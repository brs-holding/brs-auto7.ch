import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let db: ReturnType<typeof drizzle>;

try {
  console.log('Initializing database connection...');

  // Configure database connection based on environment
  const config = {
    connectionString: process.env.DATABASE_URL,
  };

  // Only use WebSocket in development environment
  if (process.env.NODE_ENV !== 'production') {
    Object.assign(config, { ws });
  }

  db = drizzle({
    ...config,
    schema,
  });

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