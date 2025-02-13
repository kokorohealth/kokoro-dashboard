import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  app.get("/api/metrics", async (_req, res) => {
    const metrics = await storage.getMetrics();
    res.json(metrics);
  });

  app.get("/api/sales", async (_req, res) => {
    const sales = await storage.getSales();
    res.json(sales);
  });

  const httpServer = createServer(app);
  return httpServer;
}
