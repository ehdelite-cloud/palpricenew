const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT,

  // Connection pool settings
  max:                    20,    // max simultaneous connections
  idleTimeoutMillis:      30000, // close idle connections after 30s
  connectionTimeoutMillis: 5000, // error if no connection available within 5s
});

pool.on("error", (err) => {
  console.error("[DB] Unexpected error on idle client:", err.message);
  process.exit(1);
});

pool.on("connect", () => {
  // Log only in development to avoid noise in production
  if (process.env.NODE_ENV !== "production") {
    console.log("[DB] New client connected to PostgreSQL");
  }
});

module.exports = pool;