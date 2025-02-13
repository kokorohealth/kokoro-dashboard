import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: integer("value").notNull(),
  category: text("category").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  product: text("product").notNull(),
  amount: integer("amount").notNull(),
  date: timestamp("date").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  joinDate: timestamp("join_date").notNull().defaultNow(),
  lastActive: timestamp("last_active"),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  attendeeCount: integer("attendee_count").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(), // in minutes
});

export const healthData = pgTable("health_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  weight: integer("weight"), // in grams
  waistCircumference: integer("waist_circumference"), // in mm
  bloodGlucose: integer("blood_glucose"), // in mg/dL
  date: timestamp("date").notNull(),
});

// Export insert schemas
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true, timestamp: true });
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, joinDate: true, lastActive: true });
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true });
export const insertHealthDataSchema = createInsertSchema(healthData).omit({ id: true });

// Export types
export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertHealthData = z.infer<typeof insertHealthDataSchema>;

export type Metric = typeof metrics.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type HealthData = typeof healthData.$inferSelect;