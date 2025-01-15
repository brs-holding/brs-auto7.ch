import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { carListings, favorites } from "@db/schema";
import { eq, sql, and, desc } from "drizzle-orm";
import { setupAuth, isAuthenticated } from "./auth";

export function registerRoutes(app: Express): Server {
  // Set up authentication
  setupAuth(app);

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

  // Register a new car
  app.post("/api/cars", isAuthenticated, async (req, res) => {
    try {
      console.log('Received car registration request:', req.body);

      const {
        make,
        model,
        price,
        year,
        mileage,
        fuelType,
        transmission,
        driveType,
        color,
        description,
        images
      } = req.body;

      // Validate required fields
      if (!make || !model || !price || !year || !mileage) {
        console.error('Missing required fields:', { make, model, price, year, mileage });
        return res.status(400).json({
          error: "Missing required fields"
        });
      }

      console.log('Creating new car listing with user ID:', (req.user as any).id);

      const [newListing] = await db
        .insert(carListings)
        .values({
          userId: (req.user as any).id,
          make,
          model,
          price: parseFloat(price),
          year: parseInt(year),
          mileage: parseInt(mileage),
          fuelType,
          transmission,
          driveType,
          color,
          description,
          images: images || [],
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      console.log(`Created new car listing: ${newListing.id}`);
      res.status(201).json(newListing);
    } catch (error) {
      console.error("Error creating car listing:", error);
      res.status(500).json({
        error: "Failed to create car listing"
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

  // Add favorites routes
  app.post("/api/favorites/:carId", isAuthenticated, async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      const userId = (req.user as any).id;

      const [favorite] = await db
        .insert(favorites)
        .values({
          userId,
          carListingId: carId
        })
        .returning();

      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:carId", isAuthenticated, async (req, res) => {
    try {
      const carId = parseInt(req.params.carId);
      const userId = (req.user as any).id;

      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.carListingId, carId)
          )
        );

      res.json({ message: "Favorite removed" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const userFavorites = await db
        .select({
          favorite: favorites,
          car: carListings
        })
        .from(favorites)
        .innerJoin(carListings, eq(favorites.carListingId, carListings.id))
        .where(eq(favorites.userId, userId));

      res.json(userFavorites.map(f => ({
        ...f.car,
        favoriteId: f.favorite.id
      })));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}