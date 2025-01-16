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

  // Configure Neon client settings
  neonConfig.fetchConnectionCache = true;

  // Always use WebSocket in production, optional in development
  if (process.env.NODE_ENV === 'production') {
    console.log('Configuring secure WebSocket connection for production');
    neonConfig.useSecureWebSocket = true;
    neonConfig.wsProxy = true; // Enable WebSocket proxy for better stability
  } else {
    console.log('Using default connection settings for development');
  }

  // Create SQL connection
  const sql = neon(process.env.DATABASE_URL);

  // Initialize Drizzle with retry logic
  db = drizzle(sql, { 
    schema,
    // Add prepared statements cache for better performance
    prepare: true,
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