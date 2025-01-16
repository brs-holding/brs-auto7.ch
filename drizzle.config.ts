import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable not set. Ensure the database is provisioned.");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  },
  verbose: true,
  strict: true,
});