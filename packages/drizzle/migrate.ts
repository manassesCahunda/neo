import { env } from "@neo/env";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const migrationClient = postgres(DATABASE_URL);
const db: PostgresJsDatabase = drizzle(migrationClient);

async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./migrations" });
  await migrationClient.end();
  console.log("Database migrated successfully!");
};