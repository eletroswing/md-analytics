const dotenv = require("dotenv");
dotenv.config();

const { Pool } = require("pg");
const fs = require("node:fs");
const path = require("node:path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrationsDir = "/migrations";

fs.readdir(path.join(__dirname, migrationsDir), (err, files) => {
  if (err) {
    console.error("Error reading dir:", err);
    return;
  }

  const sqlArchive = files.filter((file) => path.extname(file) === ".sql");

  sqlArchive.forEach((archive) => {
    const archivePath = path.join(__dirname, migrationsDir, archive);
    fs.readFile(archivePath, "utf-8", (error, data) => {
      if (error) {
        console.error(`Error reading archive: ${archive}:`, error);
      } else {
        pool.query(data, (err, res) => {
          if (err) {
            console.error(`Error running ${archive}: `, err);
          } else {
            console.log(`Done running ${archive}.`);
          }
        });
      }
    });
  });

});

