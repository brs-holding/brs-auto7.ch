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
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
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
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  // Get all car listings with optional search filters
  app.get("/api/cars", async (req, res) => {
    try {
      const { make, model, minYear, maxYear, minPrice, maxPrice } = req.query;
      console.log('Search parameters:', { make, model, minYear, maxYear, minPrice, maxPrice });

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

      console.log('Executing search query...');
      const listings = conditions.length > 0 
        ? await db
            .select()
            .from(carListings)
            .where(and(...conditions))
            .orderBy(desc(carListings.createdAt))
        : await db
            .select()
            .from(carListings)
            .orderBy(desc(carListings.createdAt));

      console.log(`Found ${listings.length} matching listings`);
      res.json(listings);
    } catch (error) {
      console.error("Error searching car listings:", error);
      res.status(500).json({
        error: "Failed to search car listings",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  // Get a specific car listing by ID
  app.get("/api/cars/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching car details for ID: ${id}`);

      const listing = await db
        .select()
        .from(carListings)
        .where(eq(carListings.id, parseInt(id)))
        .limit(1);

      if (!listing || listing.length === 0) {
        console.log(`No car found with ID: ${id}`);
        res.status(404).json({
          error: "Car listing not found",
          details: process.env.NODE_ENV === 'development' ? `No car with ID ${id}` : undefined
        });
        return;
      }

      console.log(`Successfully fetched car details for ID: ${id}`);
      res.json(listing[0]);
    } catch (error) {
      console.error("Error fetching car details:", error);
      res.status(500).json({
        error: "Failed to fetch car details",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  // Health check endpoint
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
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}