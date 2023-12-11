import { Pool } from "pg";

let connection: Pool | undefined = undefined;

if (!connection) {
  connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export default connection;
