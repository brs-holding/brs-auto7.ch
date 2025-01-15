import { pgTable, text, serial, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const carModels = pgTable("car_models", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  generation: text("generation"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carListings = pgTable("car_listings", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  fuelType: text("fuel_type").notNull(),
  transmission: text("transmission").notNull(),
  driveType: text("drive_type"),
  color: text("color"),
  interiorColor: text("interior_color"),
  description: text("description"),
  features: text("features").array(),
  images: text("images").array(),
  dealerName: text("dealer_name"),
  dealerLocation: text("dealer_location"),
  dealerPhone: text("dealer_phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create Zod schemas for validation
export const insertCarModelSchema = createInsertSchema(carModels);
export const selectCarModelSchema = createSelectSchema(carModels);

export const insertCarListingSchema = createInsertSchema(carListings);
export const selectCarListingSchema = createSelectSchema(carListings);

// Export types
export type CarModel = typeof carModels.$inferSelect;
export type InsertCarModel = typeof carModels.$inferInsert;
export type CarListing = typeof carListings.$inferSelect;
export type InsertCarListing = typeof carListings.$inferInsert;

// Export relations
export const carModelRelations = {
  listings: () => carListings
};