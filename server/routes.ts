import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { carModels } from "@db/schema";

export function registerRoutes(app: Express): Server {
  // Car Models API
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