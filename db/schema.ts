import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const carModels = pgTable("car_models", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  platform: text("platform"),
  classification: text("classification"),
  productionYears: text("production_years"),
  countryOfOrigin: text("country_of_origin"),
  unitsProduced: text("units_produced"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  carModelId: integer("car_model_id").notNull(),
  year: integer("year").notNull(),
  price: numeric("price").notNull(),
  mileage: integer("mileage").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  dealershipId: integer("dealership_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dealerships = pgTable("dealerships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  subscriptionPlan: text("subscription_plan").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create Zod schemas
export const insertCarModelSchema = createInsertSchema(carModels);
export const selectCarModelSchema = createSelectSchema(carModels);

export const insertCarSchema = createInsertSchema(cars);
export const selectCarSchema = createSelectSchema(cars);

export const insertDealershipSchema = createInsertSchema(dealerships);
export const selectDealershipSchema = createSelectSchema(dealerships);

// Export types
export type CarModel = typeof carModels.$inferSelect;
export type InsertCarModel = typeof carModels.$inferInsert;

export type Car = typeof cars.$inferSelect;
export type InsertCar = typeof cars.$inferInsert;

export type Dealership = typeof dealerships.$inferSelect;
export type InsertDealership = typeof dealerships.$inferInsert;