import type { NextApiRequest, NextApiResponse } from "next";
import satori from 'satori';

import fs from 'node:fs';
import { join, resolve } from 'node:path';
import connection from "../../../../../../infra/database";
import redis from "../../../../../../infra/redis";
import { renderAsync } from "@resvg/resvg-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  const total_unique = await connection?.query(`
    SELECT 
          COUNT(DISTINCT ip) AS unique_views
        FROM tracking
        WHERE pixel_id = $1`, [req.query.item])

  const cachedSvg = await redis?.get(`view-counter:${req.query.item}`);
  let renderBuffer: any;

  if (cachedSvg) {
     const svg = await satori(renderTemplate(total_unique?.rows[0].unique_views), {
    width: 400,
    height: 29,
    fonts: [
      {
        name: 'Roboto',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'Roboto-Regular.ttf')),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Roboto',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'Roboto-Bold.ttf')),
        weight: 700,
        style: 'normal',
      },
      {
        name: 'NotoEmoji',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'NotoEmoji-Bold.ttf')),
        weight: 700,
        style: 'normal',
      },
    ]
  });
    await redis?.set(`view-counter:${req.query.item}`, svg);
    renderBuffer = await renderAsync(cachedSvg);
  } else {
     const svg = await satori(renderTemplate(total_unique?.rows[0].unique_views), {
    width: 400,
    height: 29,
    fonts: [
      {
        name: 'Roboto',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'Roboto-Regular.ttf')),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Roboto',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'Roboto-Bold.ttf')),
        weight: 700,
        style: 'normal',
      },
      {
        name: 'NotoEmoji',
        data: fs.readFileSync(join(resolve('.'), 'fonts', 'NotoEmoji-Bold.ttf')),
        weight: 700,
        style: 'normal',
      },
    ]
  });
    renderBuffer = await renderAsync(svg);
    await redis?.set(`view-counter:${req.query.item}`, svg);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `image/png`);

  res.end(renderBuffer.asPng());
}

function renderTemplate(count: number) {
  const paddedNumber = leftPad(count.toString(), 7, '0');

  const digitDivs = paddedNumber.split('').map((digit, index) => (
    <div
      key={index}
      style={{
        width: '29px',
        height: '29px',
        backgroundColor: "#000000",
        marginLeft: index === 0 ? '0' : '5px',
        color: "#00FF13",
        fontSize: '24px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '100'
      }}
    >
      {digit}
    </div>
  ));

  return (
    <div style={{ display: "flex", width: "100%", justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
      {digitDivs}
    </div>
  );
}

function leftPad(str: string, length: number, padChar: string): string {
  while (str.length < length) {
    str = padChar + str;
  }
  return str;
}