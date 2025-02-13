import { 
  type Metric, type Sale, type User, type Session, type HealthData,
  type InsertMetric, type InsertSale, type InsertUser, type InsertSession, type InsertHealthData,
  type LessonCompletion, type ContentInteraction, type Lesson,
  type InsertLessonCompletion, type InsertContentInteraction, type InsertLesson
} from "@shared/schema";

export interface IStorage {
  // Metrics
  getMetrics(): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  
  // Sales
  getSales(): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  
  // Users
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sessions
  getSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  
  // Health Data
  getHealthData(): Promise<HealthData[]>;
  createHealthData(data: InsertHealthData): Promise<HealthData>;

  // Lesson Completions
  getLessonCompletions(): Promise<LessonCompletion[]>;
  createLessonCompletion(completion: InsertLessonCompletion): Promise<LessonCompletion>;

  // Content Interactions
  getContentInteractions(): Promise<ContentInteraction[]>;
  createContentInteraction(interaction: InsertContentInteraction): Promise<ContentInteraction>;

  // Lessons
  getLessons(): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
}

export class MemStorage implements IStorage {
  private metrics: Map<number, Metric>;
  private sales: Map<number, Sale>;
  private users: Map<number, User>;
  private sessions: Map<number, Session>;
  private healthData: Map<number, HealthData>;
  private lessonCompletions: Map<number, LessonCompletion>;
  private contentInteractions: Map<number, ContentInteraction>;
  private lessons: Map<number, Lesson>;

  private metricId: number;
  private saleId: number;
  private userId: number;
  private sessionId: number;
  private healthDataId: number;
  private lessonCompletionId: number;
  private contentInteractionId: number;
  private lessonId: number;

  constructor() {
    this.metrics = new Map();
    this.sales = new Map();
    this.users = new Map();
    this.sessions = new Map();
    this.healthData = new Map();
    this.lessonCompletions = new Map();
    this.contentInteractions = new Map();
    this.lessons = new Map();

    this.metricId = 1;
    this.saleId = 1;
    this.userId = 1;
    this.sessionId = 1;
    this.healthDataId = 1;
    this.lessonCompletionId = 1;
    this.contentInteractionId = 1;
    this.lessonId = 1;

    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample metrics
    const sampleMetrics: InsertMetric[] = [
      { name: "Total Users", value: 15423, category: "users" },
      { name: "Active Users", value: 8762, category: "users" },
      { name: "Revenue", value: 45290, category: "finance" },
      { name: "Growth", value: 23, category: "finance" },
      { name: "Conversion Rate", value: 68, category: "funnel" },
      { name: "Session Attendance", value: 456, category: "engagement" },
      { name: "Intro Call Rate", value: 60, category: "funnel" },
      { name: "Profile Completion", value: 80, category: "funnel" },
      { name: "First Lesson", value: 40, category: "engagement" }
    ];

    // Sample sales (last 10 days)
    const sampleSales: InsertSale[] = Array.from({ length: 10 }, (_, i) => ({
      product: `Health Program ${i % 3 + 1}`,
      amount: Math.floor(Math.random() * 10000),
      date: new Date(2024, 0, i + 1)
    }));

    // Sample users
    const sampleUsers: InsertUser[] = Array.from({ length: 20 }, (_, i) => ({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      onboardingCompleted: Math.random() > 0.3,
    }));

    // Sample sessions (last 5 days)
    const sampleSessions: InsertSession[] = Array.from({ length: 5 }, (_, i) => ({
      name: `Group Session ${i + 1}`,
      attendeeCount: Math.floor(Math.random() * 50) + 10,
      date: new Date(2024, 1, i + 1),
      duration: 60
    }));

    // Sample health data
    const sampleHealthData: InsertHealthData[] = Array.from({ length: 10 }, (_, i) => ({
      userId: (i % 5) + 1,
      weight: 70000 + Math.floor(Math.random() * 20000), // 70-90kg in grams
      waistCircumference: 800 + Math.floor(Math.random() * 200), // 80-100cm in mm
      bloodGlucose: 80 + Math.floor(Math.random() * 40), // 80-120 mg/dL
      date: new Date(2024, 0, i + 1)
    }));

    // Sample lessons
    const sampleLessons: InsertLesson[] = Array.from({ length: 12 }, (_, i) => ({
      title: `Week ${i + 1} Lesson`,
      weekNumber: i + 1,
      type: ['video', 'pdf', 'journal'][i % 3],
      averageRating: Math.floor(Math.random() * 2) + 4, // 4-5 rating
      totalCompletions: Math.floor(Math.random() * 1000) + 500,
      averageTimeSpent: Math.floor(Math.random() * 900) + 300, // 5-20 minutes
    }));

    // Sample lesson completions (100 users completing different weeks)
    const sampleCompletions: InsertLessonCompletion[] = Array.from({ length: 100 }, (_, i) => ({
      userId: (i % 20) + 1,
      weekNumber: Math.floor(i / 20) + 1,
      completed: true,
      completedAt: new Date(2024, 0, Math.floor(i / 20) + 1),
    }));

    // Sample content interactions
    const sampleInteractions: InsertContentInteraction[] = Array.from({ length: 200 }, (_, i) => ({
      userId: (i % 20) + 1,
      contentType: ['video', 'pdf', 'journal'][i % 3],
      lessonId: (i % 12) + 1,
      weekNumber: Math.floor(i / 20) + 1,
      interactionTime: Math.floor(Math.random() * 900) + 300, // 5-20 minutes
      timestamp: new Date(2024, 0, Math.floor(i / 20) + 1),
    }));


    // Initialize all sample data
    sampleMetrics.forEach(metric => this.createMetric(metric));
    sampleSales.forEach(sale => this.createSale(sale));
    sampleUsers.forEach(user => this.createUser(user));
    sampleSessions.forEach(session => this.createSession(session));
    sampleHealthData.forEach(data => this.createHealthData(data));
    sampleLessons.forEach(lesson => this.createLesson(lesson));
    sampleCompletions.forEach(completion => this.createLessonCompletion(completion));
    sampleInteractions.forEach(interaction => this.createContentInteraction(interaction));
  }

  // Metrics
  async getMetrics(): Promise<Metric[]> {
    return Array.from(this.metrics.values());
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

  // Sales
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = this.saleId++;
    const sale: Sale = { ...insertSale, id };
    this.sales.set(id, sale);
    return sale;
  }

  // Users
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = {
      ...insertUser,
      id,
      joinDate: new Date(),
      lastActive: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Sessions
  async getSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.sessionId++;
    const session: Session = { ...insertSession, id };
    this.sessions.set(id, session);
    return session;
  }

  // Health Data
  async getHealthData(): Promise<HealthData[]> {
    return Array.from(this.healthData.values());
  }

  async createHealthData(insertHealthData: InsertHealthData): Promise<HealthData> {
    const id = this.healthDataId++;
    const healthData: HealthData = { ...insertHealthData, id };
    this.healthData.set(id, healthData);
    return healthData;
  }

  // Lesson Completions
  async getLessonCompletions(): Promise<LessonCompletion[]> {
    return Array.from(this.lessonCompletions.values());
  }

  async createLessonCompletion(insertCompletion: InsertLessonCompletion): Promise<LessonCompletion> {
    const id = this.lessonCompletionId++;
    const completion: LessonCompletion = { ...insertCompletion, id };
    this.lessonCompletions.set(id, completion);
    return completion;
  }

  // Content Interactions
  async getContentInteractions(): Promise<ContentInteraction[]> {
    return Array.from(this.contentInteractions.values());
  }

  async createContentInteraction(insertInteraction: InsertContentInteraction): Promise<ContentInteraction> {
    const id = this.contentInteractionId++;
    const interaction: ContentInteraction = { ...insertInteraction, id };
    this.contentInteractions.set(id, interaction);
    return interaction;
  }

  // Lessons
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.lessonId++;
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }
}

export const storage = new MemStorage();