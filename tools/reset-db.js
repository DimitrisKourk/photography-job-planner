// Wipes the database configured in .env and rebuilds it from DB_Structure_data_demo.sql.
//
//   npm run db:reset              asks you to type the database name to confirm
//   npm run db:reset -- --yes     skips the confirmation
//
// WARNING: this drops EVERY table in the configured database, not only the app's tables.
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const mysql = require("mysql2");

const SQL_FILE = path.join(__dirname, "..", "DB_Structure_data_demo.sql");

const config = {
  host: process.env.db_host,
  port: Number(process.env.db_port) || 3306,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_name,
  multipleStatements: true, // the .sql file is run as one batch
};
if (process.env.db_ssl_ca) {
  config.ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.resolve(__dirname, "..", process.env.db_ssl_ca), "utf8"),
  };
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); }));
}

function run(connection, sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => (error ? reject(error) : resolve(results)));
  });
}

async function main() {
  if (!config.host || !config.user || !config.database) {
    throw new Error("Missing db_host, db_user or db_name. Run with: npm run db:reset");
  }
  if (!fs.existsSync(SQL_FILE)) throw new Error("Can't find " + SQL_FILE);

  const connection = mysql.createConnection(config);
  try {
    const tables = (await run(connection,
      "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'"
    )).map((row) => row.name);

    console.log(`Database: ${config.database} on ${config.host}:${config.port}`);
    console.log(tables.length ? `Tables that will be DROPPED (${tables.length}): ${tables.join(", ")}` : "The database is already empty.");

    if (!process.argv.includes("--yes")) {
      const answer = await ask(`Type the database name (${config.database}) to wipe and rebuild it: `);
      if (answer !== config.database) {
        console.log("Cancelled, nothing was changed.");
        return;
      }
    }

    // 1. wipe: drop every table (foreign key checks off so the order doesn't matter)
    if (tables.length) {
      await run(connection, "SET FOREIGN_KEY_CHECKS = 0");
      await run(connection, "DROP TABLE " + tables.map((t) => mysql.escapeId(t)).join(", "));
      await run(connection, "SET FOREIGN_KEY_CHECKS = 1");
      console.log(`Dropped ${tables.length} table(s).`);
    }

    // 2. rebuild from the .sql file
    await run(connection, fs.readFileSync(SQL_FILE, "utf8"));

    const counts = await run(connection,
      "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name"
    );
    console.log("Rebuilt from DB_Structure_data_demo.sql:");
    for (const row of counts) console.log(`  ${row.name}`);
    console.log("Done. Log in with demo / demo.");
  } finally {
    connection.end();
  }
}

main().catch((error) => {
  console.error("Reset failed:", error.message);
  process.exitCode = 1;
});
