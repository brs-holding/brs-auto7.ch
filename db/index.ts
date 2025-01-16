import { drizzle } from "drizzle-orm/neon-serverless";
import { neon, neonConfig } from '@neondatabase/serverless';
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

  // Configure Neon client settings for WebSocket support
  neonConfig.fetchConnectionCache = true;
  neonConfig.webSocketConstructor = ws;
  neonConfig.useSecureWebSocket = true;
  neonConfig.pipelineConnect = false; // Disable pipelining for better compatibility
  neonConfig.wsProxy = process.env.NODE_ENV === 'production';

  // Create SQL connection
  const sql = neon(process.env.DATABASE_URL);

  // Initialize Drizzle
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