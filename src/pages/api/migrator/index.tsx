import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import path from "node:path";

import connection from "../../../../infra/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method == "POST") {
    if (req.headers.authorization == `Bearer ${process.env.MIGRATION_KEY}`) {
      const migrationsDir = "/migrations";

      fs.readdir(path.join('./infra', migrationsDir), (err, files) => {
        if (err) {
          console.error("Error reading dir:", err);
          return;
        }

        const sqlArchive = files.filter(
          (file) => path.extname(file) === ".sql"
        );

        sqlArchive.forEach((archive) => {
          const archivePath = path.join('./infra', migrationsDir, archive);
          fs.readFile(archivePath, "utf-8", (error, data) => {
            if (error) {
              return res.status(500).end();
            } else {
              connection?.query(data, (err, result) => {
                if (err) {
                  return res.status(500).end();
                }
              });
            }
          });
        });
      });

      return res.status(200).json({ messages: "done!" });
    }
  }
  return res.status(404).end();
}
