import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { carModels, carListings } from "@db/schema";
import { eq, sql, ilike, and, desc, or } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Get all unique car makes
  app.get("/api/car-makes", async (_req, res) => {
    try {
      console.log('Fetching car makes...');
      const makes = await db
        .select({ make: carListings.make })
        .from(carListings)
        .groupBy(carListings.make)
        .orderBy(carListings.make);

      console.log(`Successfully fetched ${makes.length} car makes`);
      res.json(makes.map(m => m.make));
    } catch (error) {
      console.error("Error fetching car makes:", error);
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
      console.log('Search parameters:', { make, model, minYear, maxYear, minPrice, maxPrice });

      let query = db
        .select()
        .from(carListings)
        .orderBy(desc(carListings.createdAt));

      const conditions = [];

      // Add make filter if specified
      if (make && make !== 'all') {
        conditions.push(eq(carListings.make, make as string));
      }

      // Add model filter if both make and model are specified
      if (model && model !== 'all' && make && make !== 'all') {
        conditions.push(eq(carListings.model, model as string));
      }

      // Add year range filters
      if (minYear) {
        conditions.push(sql`${carListings.year} >= ${parseInt(minYear as string)}`);
      }
      if (maxYear) {
        conditions.push(sql`${carListings.year} <= ${parseInt(maxYear as string)}`);
      }

      // Add price range filters
      if (minPrice) {
        conditions.push(sql`${carListings.price} >= ${parseFloat(minPrice as string)}`);
      }
      if (maxPrice) {
        conditions.push(sql`${carListings.price} <= ${parseFloat(maxPrice as string)}`);
      }

      // Apply all conditions if any exist
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      console.log('Executing search query...');
      const listings = await query;
      console.log(`Found ${listings.length} matching listings`);
      res.json(listings);
    } catch (error) {
      console.error("Error searching car listings:", error);
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
        .select({ model: carListings.model })
        .from(carListings)
        .where(eq(carListings.make, make))
        .groupBy(carListings.model)
        .orderBy(carListings.model);

      console.log(`Successfully fetched ${models.length} models for ${make}`);
      res.json(models.map(m => m.model));
    } catch (error) {
      console.error("Error fetching car models:", error);
      res.status(500).json({ 
        error: "Failed to fetch car models",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Health check endpoint with database check
  app.get("/api/health", async (_req, res) => {
    try {
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

  const httpServer = createServer(app);
  return httpServer;
}