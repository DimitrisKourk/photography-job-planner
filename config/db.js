// MySQL connection pools (mysql2, which supports MySQL 8 authentication). Credentials come from environment variables (see .env.example).
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

const baseConfig = {
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_name,
  password: process.env.db_password,
  port: Number(process.env.db_port) || 3306,
  timezone: "Z",
  // SUM() returns DECIMAL, which mysql2 sends as a string by default; the dashboard adds these up
  decimalNumbers: true,
};

// optional SSL, needed for hosted databases such as Aiven: db_ssl_ca points to the CA certificate
if (process.env.db_ssl_ca) {
  baseConfig.ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.resolve(__dirname, "..", process.env.db_ssl_ca), "utf8"),
  };
}

// regular pool for single statements
const pool = mysql.createPool(baseConfig);
// separate pool that allows several statements in one query (e.g. INSERT ...; DELETE ...),
// only used by the routes that need it
const multiStatementPool = mysql.createPool({ ...baseConfig, multipleStatements: true });

function runQuery(targetPool, sql, values) {
  return new Promise((resolve, reject) => {
    targetPool.query(sql, values, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

module.exports = {
  query: (sql, values) => runQuery(pool, sql, values),
  multiQuery: (sql, values) => runQuery(multiStatementPool, sql, values),
};
