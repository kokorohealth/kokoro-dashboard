import { type Metric, type Sale, type InsertMetric, type InsertSale } from "@shared/schema";

export interface IStorage {
  getMetrics(): Promise<Metric[]>;
  getSales(): Promise<Sale[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  createSale(sale: InsertSale): Promise<Sale>;
}

export class MemStorage implements IStorage {
  private metrics: Map<number, Metric>;
  private sales: Map<number, Sale>;
  private metricId: number;
  private saleId: number;

  constructor() {
    this.metrics = new Map();
    this.sales = new Map();
    this.metricId = 1;
    this.saleId = 1;
    
    // Add sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleMetrics: InsertMetric[] = [
      { name: "Total Users", value: 15423, category: "users" },
      { name: "Active Users", value: 8762, category: "users" },
      { name: "Revenue", value: 45290, category: "finance" },
      { name: "Growth", value: 23, category: "finance" }
    ];

    const sampleSales: InsertSale[] = Array.from({ length: 10 }, (_, i) => ({
      product: `Product ${i + 1}`,
      amount: Math.floor(Math.random() * 10000),
      date: new Date(2024, 0, i + 1)
    }));

    sampleMetrics.forEach(metric => this.createMetric(metric));
    sampleSales.forEach(sale => this.createSale(sale));
  }

  async getMetrics(): Promise<Metric[]> {
    return Array.from(this.metrics.values());
  }

  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = this.metricId++;
    const metric: Metric = { 
      ...insertMetric, 
      id, 
      timestamp: new Date() 
    };
    this.metrics.set(id, metric);
    return metric;
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = this.saleId++;
    const sale: Sale = { ...insertSale, id };
    this.sales.set(id, sale);
    return sale;
  }
}

export const storage = new MemStorage();
