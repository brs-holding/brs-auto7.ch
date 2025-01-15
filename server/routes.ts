import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { carModels, carListings } from "@db/schema";
import { eq, sql, ilike, and, desc } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Get all unique car makes
  app.get("/api/car-makes", async (_req, res) => {
    try {
      console.log('Fetching car makes...');
      const makes = await db
        .select({ make: carModels.make })
        .from(carModels)
        .groupBy(carModels.make)
        .orderBy(carModels.make);

      console.log(`Successfully fetched ${makes.length} car makes`);
      res.json(makes.map(m => m.make));
    } catch (error) {
      console.error("Error fetching car makes:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      res.status(500).json({ 
        error: "Failed to fetch car makes",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Get all car listings with optional search filters
  app.get("/api/cars", async (req, res) => {
    try {
      const { make, model, minYear, maxYear, minPrice, maxPrice } = req.query;
      console.log(`Searching car listings with params:`, req.query);

      let query = db
        .select()
        .from(carListings)
        .orderBy(desc(carListings.createdAt));

      // Apply filters only if they are provided
      const conditions = [];
      if (make) {
        conditions.push(ilike(carListings.make, `%${make}%`));
      }
      if (model) {
        conditions.push(ilike(carListings.model, `%${model}%`));
      }
      if (minYear) {
        conditions.push(sql`CAST(${carListings.year} AS INTEGER) >= ${parseInt(minYear as string)}`);
      }
      if (maxYear) {
        conditions.push(sql`CAST(${carListings.year} AS INTEGER) <= ${parseInt(maxYear as string)}`);
      }
      if (minPrice) {
        conditions.push(sql`CAST(${carListings.price} AS DECIMAL) >= ${parseFloat(minPrice as string)}`);
      }
      if (maxPrice) {
        conditions.push(sql`CAST(${carListings.price} AS DECIMAL) <= ${parseFloat(maxPrice as string)}`);
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      console.log('Executing query...');
      const listings = await query;
      console.log(`Found ${listings.length} matching listings`);
      res.json(listings);
    } catch (error) {
      console.error("Error searching car listings:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      res.status(500).json({
        error: "Failed to search car listings",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Get models for a specific make
  app.get("/api/car-models/:make", async (req, res) => {
    try {
      const { make } = req.params;
      console.log(`Fetching models for make: ${make}`);
      const models = await db
        .select({ model: carModels.model })
        .from(carModels)
        .where(eq(carModels.make, make))
        .orderBy(carModels.model);

      console.log(`Successfully fetched ${models.length} models for ${make}`);
      res.json(models.map(m => m.model));
    } catch (error) {
      console.error("Error fetching car models:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      res.status(500).json({ 
        error: "Failed to fetch car models",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Health check endpoint with database check
  app.get("/api/health", async (_req, res) => {
    try {
      // Test database connection
      await db.execute(sql`SELECT 1`);
      res.json({ 
        status: "ok", 
        environment: process.env.NODE_ENV,
        database: "connected"
      });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(503).json({ 
        status: "error",
        environment: process.env.NODE_ENV,
        database: "disconnected",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}