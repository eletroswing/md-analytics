import type { NextApiRequest, NextApiResponse } from "next";

import { transformToSvg } from "../../../../../../models/tw-to-css";
import connection from "../../../../../../infra/database";
import redis from "../../../../../../infra/redis";

import { renderAsync } from '@resvg/resvg-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const by_referrer = await connection?.query(
    `
 SELECT COUNT(id) AS total, referrer
FROM tracking
WHERE pixel_id = $1
GROUP BY referrer
ORDER BY total DESC;
`,
    [req.query.item]
  );

  const preData: { label: string; value: number }[] = by_referrer?.rows.map((row) => {
    return {
      label: row.referrer || 'Null',
      value: Number(row.total)
    }
  }) || [];
  
  const data = new Map();
  
  preData.forEach(item => {
    const formatted = item.label != "Null" ? item.label.split("/")[2] : "Null"
    if (data.has(formatted)) {
      data.set(formatted, data.get(formatted) + item.value);
    } else {
      data.set(formatted, item.value);
    }
  });
  
  const dataArray: { label: string; value: number }[] = Array.from(data, ([key, value]) => ({ label: key, value }));

  const cachedSvg = await redis?.get(`analytic-widget:${req.query.item}`);
  let renderBuffer: any;

  if(cachedSvg) {
    const svg = await transformToSvg(renderer(dataArray), 600);
    await redis?.set(`analytic-widget:${req.query.item}`, svg)    
    renderBuffer = await renderAsync(cachedSvg);
  }else {
    const svg = await transformToSvg(renderer(dataArray), 600);
    renderBuffer = await renderAsync(svg);
    await redis?.set(`analytic-widget:${req.query.item}`, svg)
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `image/png`);

  res.end( renderBuffer.asPng());
}

function renderer(
  data: { label: string; value: number }[],
  topNumber: number = 6
) {
  data.sort((a, b) => b.value - a.value);
  const top = data.slice(0, topNumber);

  const others = data
    .slice(topNumber)
    .reduce((acc, curr) => acc + curr.value, 0);

  if (others != 0) {
    top.push({ label: "Others", value: others });
  }

  return (
    <div className="flex w-[600px] bg-[#1f1f23] border border-[#27272a] rounded-md flex-col text-white">
      <div className="flex flex-col w-full px-3 pt-3 text-[0.6rem] font-sans font-thin mx-2">
        <h1>Website Analytics</h1>
      </div>
      <div className="flex justify-between p-3 font-sans font-semibold mr-4">
        <span>Source</span>
        <span>Visits</span>
      </div>
      <div className="flex w-full pb-5 flex-col">
        {top.map((item) => {
          const percentage = (item.value * 90) / top[0].value;
          return (
            <div
              key={item.label}
              className="flex w-full justify-between px-3 font-sans font-thin mr-4 items-center mt-3"
            >
              <span
                className={`w-[${percentage}%] rounded-md py-2 pl-3 bg-green-500 whitespace-nowrap`}
              >
                {item.label}
              </span>
              <span className="mr-4">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
