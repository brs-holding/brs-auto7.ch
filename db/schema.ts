import { pgTable, text, serial, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const carModels = pgTable("car_models", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  platformGeneration: text("platform_generation"),
  worldClassification: text("world_classification"),
  productionYears: text("production_years"),
  americanClassification: text("american_classification"),
  modelYearsUS: text("model_years_us"),
  countryOfOrigin: text("country_of_origin"),
  soldInEurope: text("sold_in_europe"),
  soldInNorthAmerica: text("sold_in_north_america"),
  soldInIndia: text("sold_in_india"),
  unitsProduced: text("units_produced"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carListings = pgTable("car_listings", {
  id: serial("id").primaryKey(),
  listingId: text("listing_id").notNull().unique(),
  carModelId: integer("car_model_id").references(() => carModels.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  fuelType: text("fuel_type").notNull(),
  transmission: text("transmission").notNull(),
  driveType: text("drive_type").notNull(),
  features: text("features").array(),
  dealershipName: text("dealership_name"),
  dealershipAddress: text("dealership_address"),
  dealershipPhone: text("dealership_phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create Zod schemas for validation
export const insertCarModelSchema = createInsertSchema(carModels);
export const selectCarModelSchema = createSelectSchema(carModels);

export const insertCarListingSchema = createInsertSchema(carListings);
export const selectCarListingSchema = createSelectSchema(carListings);

// Export types
export const carModelRelations = {
  listings: () => carListings
};

export type CarModel = typeof carModels.$inferSelect;
export type InsertCarModel = typeof carModels.$inferInsert;
export type CarListing = typeof carListings.$inferSelect;
export type InsertCarListing = typeof carListings.$inferInsert;