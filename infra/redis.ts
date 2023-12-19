import Redis from "ioredis";

let connection: Redis | undefined = undefined;

if (!connection) {
  connection = new Redis(process.env.REDIS || "");
}

export default connection;
