import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { cars, dealerships } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Cars API
  app.get("/api/cars", async (_req, res) => {
    try {
      const allCars = await db.select().from(cars);
      res.json(allCars);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await db.select().from(cars).where(eq(cars.id, parseInt(req.params.id)));
      if (car.length === 0) {
        res.status(404).json({ error: "Car not found" });
        return;
      }
      res.json(car[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car" });
    }
  });

  // Dealerships API
  app.post("/api/dealerships", async (req, res) => {
    try {
      const newDealership = await db.insert(dealerships).values(req.body);
      res.status(201).json(newDealership);
    } catch (error) {
      res.status(500).json({ error: "Failed to create dealership" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
