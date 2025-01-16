import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure Neon client settings for WebSocket support
neonConfig.fetchConnectionCache = true;
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = false; // Disable pipelining for better compatibility
neonConfig.wsProxy = process.env.NODE_ENV === 'production';

// Create SQL connection
const sql = neon(process.env.DATABASE_URL);

// Initialize Drizzle with the schema
export const db = drizzle(sql, { schema });

console.log('Database connection initialized');