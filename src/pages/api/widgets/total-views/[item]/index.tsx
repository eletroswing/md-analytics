import type { NextApiRequest, NextApiResponse } from "next";

import { transformToSvg } from "../../../../../../models/tw-to-css";
import connection from "../../../../../../infra/database";
import redis from "../../../../../../infra/redis";
import { renderAsync } from "@resvg/resvg-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const total_unique = await connection?.query(
    `WITH last_hour_views AS (
    SELECT COUNT(DISTINCT id) AS unique_views_last_hour
    FROM tracking
    WHERE pixel_id = $1
      AND created_at <= NOW() - INTERVAL '1 hour' AND created_at >= NOW() - INTERVAL '2 hour'
),
current_hour_views AS (
    SELECT COUNT(DISTINCT id) AS unique_views_current_hour
    FROM tracking
    WHERE pixel_id = $1
      AND created_at >= NOW() - INTERVAL '1 hour' AND created_at <= NOW()
),
unique_v AS (
    SELECT COUNT(DISTINCT id) AS unique_views
    FROM tracking
    WHERE pixel_id = $1
)

SELECT 
    unique_v.unique_views,
    current_hour.unique_views_current_hour,
    last_hour.unique_views_last_hour,
    CASE 
        WHEN last_hour.unique_views_last_hour > 0 THEN 
            ((current_hour.unique_views_current_hour - last_hour.unique_views_last_hour) / last_hour.unique_views_last_hour) * 100
        ELSE
            100 -- Se não houver visualizações na última hora, assumimos crescimento de 100%
    END AS growth_percentage
FROM current_hour_views current_hour
CROSS JOIN last_hour_views last_hour
CROSS JOIN unique_v;

    `,
    [req.query.item]
  );

  const total: number = total_unique?.rows[0].unique_views || 0;
  const last_hour: number = total_unique?.rows[0].unique_views_last_hour || 0;
  const current_hour: number =
    total_unique?.rows[0].unique_views_current_hour || 0;

  var growth: any = Math.ceil(
    ((Number(current_hour) - Number(last_hour)) / total) * 100
  );

  if(Number.isNaN(growth)){
    growth = 0;
  }

  const cachedSvg = await redis?.get(`total-views-widget:${req.query.item}`);
  let renderBuffer: any;

  if (cachedSvg) {
    const svg = await transformToSvg(renderer(total, growth), 300);
    await redis?.set(`total-views-widget:${req.query.item}`, svg);
    renderBuffer = await renderAsync(cachedSvg);
  } else {
    const svg = await transformToSvg(renderer(total, growth), 300);
    renderBuffer = await renderAsync(svg);
    await redis?.set(`total-views-widget:${req.query.item}`, svg);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `image/png`);

  res.end(renderBuffer.asPng());
}

function formatNumber(number: number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1) + "k";
  } else {
    return (number / 1000000).toFixed(1) + "M";
  }
}

function renderer(total: number, growth: number) {
  const totalText = formatNumber(total);
  return (
    <div className="px-4 pt-6 shadow-lg bg-[#1f1f23] shadow-blue-100 flex flex-col w-[300px] rounded-md">
      <div className="flex mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 rounded-xl bg-rose-400 p-4 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
        <p className="mt-4 font-medium ml-4 text-2xl text-white">Total Views</p>
      </div>
      <p
        className={`mt-2 text-xl font-medium ${
          growth >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {totalText}
        {growth >= 0 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v12m0-12-5 5m5-5 5 5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v12m0 0-5-5m5 5 5-5"
            />
          </svg>
        )}
        <span className="text-xs">
          {growth >= 0 ? "+" : "-"}
          {growth}% compared to the last hour.
        </span>
      </p>
    </div>
  );
}
