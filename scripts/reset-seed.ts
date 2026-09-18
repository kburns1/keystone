import { db, sqlite } from "../src/db";
import { seed } from "../src/db/seed";

sqlite.exec("DELETE FROM audit_events; DELETE FROM records;");
seed(db);
console.log("Reseeded database.");
