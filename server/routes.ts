import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { carModels } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Get all unique car makes
  app.get("/api/car-makes", async (_req, res) => {
    try {
      const makes = await db
        .select({ make: carModels.make })
        .from(carModels)
        .groupBy(carModels.make)
        .orderBy(carModels.make);

      res.json(makes.map(m => m.make));
    } catch (error) {
      console.error("Error fetching car makes:", error);
      res.status(500).json({ error: "Failed to fetch car makes" });
    }
  });

  // Get models for a specific make
  app.get("/api/car-models/:make", async (req, res) => {
    try {
      const { make } = req.params;
      const models = await db
        .select({ model: carModels.model })
        .from(carModels)
        .where(eq(carModels.make, make))
        .orderBy(carModels.model);

      res.json(models.map(m => m.model));
    } catch (error) {
      console.error("Error fetching car models:", error);
      res.status(500).json({ error: "Failed to fetch car models" });
    }
  });

  // Get all car models (existing endpoint)
  app.get("/api/car-models", async (_req, res) => {
    try {
      const allCarModels = await db.select({
        make: carModels.make,
        model: carModels.model,
        year: carModels.productionYears,
      }).from(carModels);

      res.json(allCarModels);
    } catch (error) {
      console.error("Error fetching car models:", error);
      res.status(500).json({ error: "Failed to fetch car models" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}