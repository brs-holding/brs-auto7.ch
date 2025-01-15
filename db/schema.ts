import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
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

// Create Zod schemas
export const insertCarModelSchema = createInsertSchema(carModels);
export const selectCarModelSchema = createSelectSchema(carModels);

// Export types
export type CarModel = typeof carModels.$inferSelect;
export type InsertCarModel = typeof carModels.$inferInsert;