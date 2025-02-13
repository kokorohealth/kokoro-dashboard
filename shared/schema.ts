import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
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

export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true, timestamp: true });
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true });

export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Metric = typeof metrics.$inferSelect;
export type Sale = typeof sales.$inferSelect;
