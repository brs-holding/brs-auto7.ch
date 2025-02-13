import { pgTable, text, serial, timestamp, integer, decimal, boolean, unique, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  emailIdx: unique("email_idx").on(table.email),
  usernameIdx: unique("username_idx").on(table.username),
}));

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export const selectUserSchema = createSelectSchema(users);

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Car models table
export const carModels = pgTable("car_models", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  generation: text("generation"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Car listings table
export const carListings = pgTable("car_listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  make: text("make").notNull(),
  model: text("model").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  fuelType: text("fuel_type").notNull(),
  transmission: text("transmission").notNull(),
  driveType: text("drive_type"),
  bodyType: text("body_type"),
  doors: integer("doors"),
  seats: integer("seats"),
  power: integer("power"), // HP
  engineSize: decimal("engine_size", { precision: 3, scale: 1 }), // Liters
  acceleration: decimal("acceleration", { precision: 4, scale: 1 }), // 0-100 km/h
  topSpeed: integer("top_speed"), // km/h
  co2Emissions: integer("co2_emissions"), // g/km
  fuelConsumption: jsonb("fuel_consumption").default({
    city: 0,
    highway: 0,
    combined: 0
  }), // L/100km
  category: text("category"),
  color: text("color"),
  interiorColor: text("interior_color"),
  description: text("description"),
  features: text("features").array(),
  images: text("images").array(),
  dealerName: text("dealer_name"),
  dealerLocation: text("dealer_location"),
  dealerPhone: text("dealer_phone"),
  dealerWebsite: text("dealer_website"),
  dealerImage: text("dealer_image"),
  dealerRating: decimal("dealer_rating", { precision: 2, scale: 1 }), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  carListingId: integer("car_listing_id").references(() => carListings.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueFavorite: unique("unique_favorite_idx").on(table.userId, table.carListingId),
}));

// Comparison list table
export const comparisons = pgTable("comparisons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  carListingId: integer("car_listing_id").references(() => carListings.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueComparison: unique("unique_comparison_idx").on(table.userId, table.carListingId),
}));

// Create Zod schemas for validation

export const insertCarModelSchema = createInsertSchema(carModels);
export const selectCarModelSchema = createSelectSchema(carModels);

export const insertCarListingSchema = createInsertSchema(carListings, {
  fuelConsumption: z.object({
    city: z.number().min(0),
    highway: z.number().min(0),
    combined: z.number().min(0)
  }).optional().default({
    city: 0,
    highway: 0,
    combined: 0
  })
});
export const selectCarListingSchema = createSelectSchema(carListings);

export const insertFavoriteSchema = createInsertSchema(favorites);
export const selectFavoriteSchema = createSelectSchema(favorites);

export const insertComparisonSchema = createInsertSchema(comparisons);
export const selectComparisonSchema = createSelectSchema(comparisons);

// Export types

export type CarModel = typeof carModels.$inferSelect;
export type InsertCarModel = typeof carModels.$inferInsert;
export type CarListing = typeof carListings.$inferSelect;
export type InsertCarListing = typeof carListings.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;
export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = typeof comparisons.$inferInsert;

// Export relations
export const userRelations = {
  listings: () => carListings,
  favorites: () => favorites,
  comparisons: () => comparisons
};

export const carModelRelations = {
  listings: () => carListings
};

export const carListingRelations = {
  user: () => users,
  favorites: () => favorites,
  comparisons: () => comparisons
};