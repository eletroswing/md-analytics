import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../../../../infra/database";
import geoip from "geoip-lite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let ip: any = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Se estiver usando uma lista de endereços IP (do cabeçalho x-forwarded-for), pegue o primeiro
  if (ip && typeof ip === "string") {
    ip = ip.split(",")[0];
  }

  const ua = req.headers["user-agent"];

  const referrer = req.headers.referrer || req.headers.referer;
  const origin = req.headers.origin;


  const pixel_id = req.query.item;

  const lookup = geoip.lookup(ip == '::1' ? '168.121.42.74': ip);
  const country = lookup ? lookup.country : "";
  const state = lookup ? lookup.region : "";
  const neighborhood = lookup ? lookup.city : "";

  await connection?.query(
    "INSERT INTO tracking (pixel_id, user_agent, ip, referrer, country, state, neighborhood, origin, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [pixel_id, ua, ip == '::1' ? '168.121.42.74': ip, referrer, country, state, neighborhood, origin, lookup?.ll[0], lookup?.ll[1]]
  );
  res.redirect("/pixel.png");
}
