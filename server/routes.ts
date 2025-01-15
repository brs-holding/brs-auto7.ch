import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { carListings } from "@db/schema";
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

      const uniqueMakes = makes.map(m => m.make);
      console.log(`Successfully fetched ${uniqueMakes.length} car makes:`, uniqueMakes);
      res.json(uniqueMakes);
    } catch (error) {
      console.error("Error fetching car makes:", error);
      res.status(500).json({ 
        error: "Failed to fetch car makes"
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

      const uniqueModels = models.map(m => m.model);
      console.log(`Successfully fetched ${uniqueModels.length} models for ${make}:`, uniqueModels);
      res.json(uniqueModels);
    } catch (error) {
      console.error("Error fetching car models:", error);
      res.status(500).json({ 
        error: "Failed to fetch car models"
      });
    }
  });

  // Get all car listings with optional search filters
  app.get("/api/cars", async (req, res) => {
    try {
      const { make, model, year, minPrice, maxPrice, type } = req.query;
      console.log('Search parameters:', { make, model, year, minPrice, maxPrice, type });

      const conditions = [];

      if (make && make !== 'all') {
        conditions.push(eq(carListings.make, make as string));
      }

      if (model && model !== 'all') {
        conditions.push(eq(carListings.model, model as string));
      }

      if (year) {
        conditions.push(eq(carListings.year, parseInt(year as string)));
      }

      if (minPrice) {
        conditions.push(sql`${carListings.price} >= ${parseFloat(minPrice as string)}`);
      }

      if (maxPrice) {
        conditions.push(sql`${carListings.price} <= ${parseFloat(maxPrice as string)}`);
      }

      if (type && type !== 'all') {
        conditions.push(eq(carListings.category, type as string));
      }

      const query = conditions.length > 0 
        ? db.select().from(carListings).where(and(...conditions))
        : db.select().from(carListings);

      const listings = await query.orderBy(desc(carListings.createdAt));

      console.log(`Found ${listings.length} matching listings`);
      res.json(listings);
    } catch (error) {
      console.error("Error searching car listings:", error);
      res.status(500).json({
        error: "Failed to search car listings"
      });
    }
  });

  // Get a specific car listing by ID
  app.get("/api/cars/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching car details for ID: ${id}`);

      if (!id || isNaN(parseInt(id))) {
        res.status(400).json({ error: "Invalid car ID" });
        return;
      }

      const listing = await db
        .select()
        .from(carListings)
        .where(eq(carListings.id, parseInt(id)))
        .limit(1);

      if (!listing || listing.length === 0) {
        console.log(`No car found with ID: ${id}`);
        res.status(404).json({ error: "Car listing not found" });
        return;
      }

      console.log(`Successfully fetched car details for ID: ${id}`);
      res.json(listing[0]);
    } catch (error) {
      console.error("Error fetching car details:", error);
      res.status(500).json({
        error: "Failed to fetch car details"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      await db.execute(sql`SELECT 1`);
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(503).json({ 
        status: "error",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}