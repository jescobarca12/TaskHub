import "dotenv/config";
import { Pool } from "pg";

// En producción (Render/Neon) la conexión llega como una sola DATABASE_URL
// y requiere SSL. En desarrollo usamos las variables sueltas del .env local.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

export default pool;
