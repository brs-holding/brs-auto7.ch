import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { cars, carModels, dealerships } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Car Models API
  app.get("/api/car-models", async (_req, res) => {
    try {
      const allCarModels = await db.select().from(carModels);
      res.json(allCarModels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car models" });
    }
  });

  // Cars API
  app.get("/api/cars", async (req, res) => {
    try {
      const { make, model, year, price } = req.query;
      let query = db.select().from(cars);

      if (make || model) {
        const carModelQuery = db.select().from(carModels);
        if (make && make !== 'all') {
          carModelQuery.where(eq(carModels.make, make as string));
        }
        if (model && model !== 'all') {
          carModelQuery.where(eq(carModels.model, model as string));
        }
        const matchingModels = await carModelQuery;
        if (matchingModels.length > 0) {
          query = query.where(eq(cars.carModelId, matchingModels[0].id));
        }
      }

      if (year && year !== 'all') {
        query = query.where(eq(cars.year, parseInt(year as string)));
      }

      if (price && price !== 'all') {
        const [min, max] = (price as string).split('-').map(Number);
        // Add price range filter when implementing the price column
      }

      const allCars = await query;
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