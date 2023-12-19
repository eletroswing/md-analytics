import type { NextApiRequest, NextApiResponse } from "next";

import connection from "../../../../../../infra/database";
import redis from "../../../../../../infra/redis";
import createLineChart from "../../../../../../models/svgChart";
import { renderAsync } from "@resvg/resvg-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const total = await connection?.query(
    `
        SELECT 
    DATE_TRUNC('hour', created_at AT TIME ZONE 'UTC' AT TIME ZONE 'GMT-3') as timestamp,
    COUNT(id) AS total_views
FROM 
    tracking
WHERE 
    pixel_id = $1
    AND created_at >= CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT-3'
    AND created_at < DATE_TRUNC('day', CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'GMT-3') + INTERVAL '1 day'
GROUP BY 
    timestamp
ORDER BY 
    timestamp
LIMIT 23;
        `,
    [req.query.item]
  );

  const itemData: {
    time: number;
    value: number;
  }[] = total?.rows.map((item, index) => {
    const currentPoint = {
      time: new Date(item.timestamp).getHours(),
      value: item.total_views,
    };

    return currentPoint;
  }) || [{ time: 0, value: 0 }];

  const cachedSvg = await redis?.get(`graph-widget:${req.query.item}`);
  let renderBuffer: any;

  if (cachedSvg) {
    const svg = createLineChart({
      data: itemData,
    });
    await redis?.set(`graph-widget:${req.query.item}`, svg);
    renderBuffer = await renderAsync(cachedSvg);
  } else {
    const svg = createLineChart({
      data: itemData,
    });
    renderBuffer = await renderAsync(svg);
    await redis?.set(`graph-widget:${req.query.item}`, svg);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `image/png`);

  res.end(renderBuffer.asPng());
}
