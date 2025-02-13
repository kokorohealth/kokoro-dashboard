import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  // Metrics endpoints
  app.get("/api/metrics", async (_req, res) => {
    const metrics = await storage.getMetrics();
    res.json(metrics);
  });

  // Sales endpoints
  app.get("/api/sales", async (_req, res) => {
    const sales = await storage.getSales();
    res.json(sales);
  });

  // Users endpoints
  app.get("/api/users", async (_req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  // Sessions endpoints
  app.get("/api/sessions", async (_req, res) => {
    const sessions = await storage.getSessions();
    res.json(sessions);
  });

  // Health data endpoints
  app.get("/api/health-data", async (_req, res) => {
    const healthData = await storage.getHealthData();
    res.json(healthData);
  });

  // Lesson completions endpoints
  app.get("/api/lesson-completions", async (_req, res) => {
    const completions = await storage.getLessonCompletions();
    res.json(completions);
  });

  // Content interactions endpoints
  app.get("/api/content-interactions", async (_req, res) => {
    const interactions = await storage.getContentInteractions();
    res.json(interactions);
  });

  // Lessons endpoints
  app.get("/api/lessons", async (_req, res) => {
    const lessons = await storage.getLessons();
    res.json(lessons);
  });

  const httpServer = createServer(app);
  return httpServer;
}