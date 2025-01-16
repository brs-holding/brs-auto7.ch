import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "@db";
import { sql } from "drizzle-orm";

const app = express();

// Increase JSON and URL-encoded payload limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Request size logging middleware
app.use((req, res, next) => {
  const contentLength = req.headers['content-length'];
  if (contentLength) {
    const sizeInMB = parseInt(contentLength) / (1024 * 1024);
    if (sizeInMB > 10) {
      console.log(`Large request detected: ${sizeInMB.toFixed(2)}MB for ${req.path}`);
    }
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log('Initializing database connection...');
    await db.execute(sql`SELECT 1`);
    console.log('Database connection established successfully');

    console.log('Testing database connection...');
    await db.execute(sql`SELECT 1`);
    console.log('Database connection verified successfully');

    // Create server and register routes
    const server = await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      // Log the full error details for debugging
      console.error(`[Error] ${status}: ${message}`);
      if (err.stack) {
        console.error(err.stack);
      }

      // Send a sanitized error response to the client
      res.status(status).json({ 
        message: status === 413 ? "Request too large. Please reduce the size of your uploads." : message 
      });
    });

    // Serve static files in production or set up Vite in development
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }

    const PORT = parseInt(process.env.PORT || '5000', 10);
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
})();