import { pgTable, text, serial, timestamp, integer, decimal, boolean, unique } from "drizzle-orm/pg-core";
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

// Car models table (existing)
export const carModels = pgTable("car_models", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  generation: text("generation"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Car listings table (existing)
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
  category: text("category"),
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

// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  carListingId: integer("car_listing_id").references(() => carListings.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueFavorite: unique("unique_favorite_idx").on(table.userId, table.carListingId),
}));

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
});
export const selectUserSchema = createSelectSchema(users);

export const insertCarModelSchema = createInsertSchema(carModels);
export const selectCarModelSchema = createSelectSchema(carModels);

export const insertCarListingSchema = createInsertSchema(carListings);
export const selectCarListingSchema = createSelectSchema(carListings);

export const insertFavoriteSchema = createInsertSchema(favorites);
export const selectFavoriteSchema = createSelectSchema(favorites);

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CarModel = typeof carModels.$inferSelect;
export type InsertCarModel = typeof carModels.$inferInsert;
export type CarListing = typeof carListings.$inferSelect;
export type InsertCarListing = typeof carListings.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

// Export relations
export const userRelations = {
  listings: () => carListings,
  favorites: () => favorites
};

export const carModelRelations = {
  listings: () => carListings
};

export const carListingRelations = {
  user: () => users,
  favorites: () => favorites
};