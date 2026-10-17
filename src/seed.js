import { createDb, seed } from "./db.js";

const db = createDb(process.env.DB_PATH || "data/bbims.db");
const inserted = seed(db);
console.log(
  inserted
    ? "Seed data inserted into data/bbims.db"
    : "Database already contains books; seed data was not inserted again."
);
db.close();
