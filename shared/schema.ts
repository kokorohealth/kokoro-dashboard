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

export const lessonCompletions = pgTable("lesson_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  weekNumber: integer("week_number").notNull(),
  completed: boolean("completed").notNull(),
  completedAt: timestamp("completed_at").notNull(),
});

export const contentInteractions = pgTable("content_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  contentType: text("content_type").notNull(), // 'video', 'pdf', 'journal'
  lessonId: integer("lesson_id").notNull(),
  weekNumber: integer("week_number").notNull(),
  interactionTime: integer("interaction_time").notNull(), // in seconds
  timestamp: timestamp("timestamp").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  weekNumber: integer("week_number").notNull(),
  type: text("type").notNull(), // 'video', 'pdf', 'journal'
  averageRating: integer("average_rating"), // 1-5 scale
  totalCompletions: integer("total_completions").notNull().default(0),
  averageTimeSpent: integer("average_time_spent"), // in seconds
});

export const realTimeMetrics = pgTable("real_time_metrics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: integer("value").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Export insert schemas
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true, timestamp: true });
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, joinDate: true, lastActive: true });
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true });
export const insertHealthDataSchema = createInsertSchema(healthData).omit({ id: true });
export const insertLessonCompletionSchema = createInsertSchema(lessonCompletions).omit({ id: true });
export const insertContentInteractionSchema = createInsertSchema(contentInteractions).omit({ id: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertRealTimeMetricSchema = createInsertSchema(realTimeMetrics).omit({ id: true, timestamp: true });

// Export types
export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertHealthData = z.infer<typeof insertHealthDataSchema>;
export type InsertLessonCompletion = z.infer<typeof insertLessonCompletionSchema>;
export type InsertContentInteraction = z.infer<typeof insertContentInteractionSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertRealTimeMetric = z.infer<typeof insertRealTimeMetricSchema>;

export type Metric = typeof metrics.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type HealthData = typeof healthData.$inferSelect;
export type LessonCompletion = typeof lessonCompletions.$inferSelect;
export type ContentInteraction = typeof contentInteractions.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type RealTimeMetric = typeof realTimeMetrics.$inferSelect;