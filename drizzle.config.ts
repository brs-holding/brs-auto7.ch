import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable not set. Ensure the database is provisioned.");
}

// Parse database URL to get components
const dbUrl = new URL(process.env.DATABASE_URL);

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1), // Remove leading slash
    port: Number(dbUrl.port) || 5432,
    ssl: { rejectUnauthorized: false, sslmode: 'require' }
  },
  verbose: true,
  strict: true,
});