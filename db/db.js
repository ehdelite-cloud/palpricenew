const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "palprice",
  password: "Adm9n@El9te",
  port: 5432,
});

module.exports = pool;