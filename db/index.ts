import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let db: ReturnType<typeof drizzle>;

try {
  console.log('Initializing database connection...');
  console.log('Environment:', process.env.NODE_ENV);

  // Force HTTP-only mode (no WebSocket)
  neonConfig.webSocketConstructor = undefined;
  neonConfig.httpAgent = undefined;
  neonConfig.wsAgent = undefined;

  // Create SQL connection
  const sql = neon(process.env.DATABASE_URL);

  // Initialize Drizzle with HTTP-only mode
  db = drizzle(sql, { schema });

  console.log('Database connection established successfully');
} catch (error) {
  console.error('Failed to initialize database connection:', error);
  console.error('Connection details:', {
    nodeEnv: process.env.NODE_ENV,
    hasDbUrl: !!process.env.DATABASE_URL,
    error: error instanceof Error ? error.message : String(error)
  });
  throw error;
}

export { db };