// __tests__/tasks.test.js
import request from 'supertest';
import app from '../app.js';
import Task from '../models/taskModel.js';
import redisClient from '../config/redis.js';

// Test data
const testTask = {
  title: "Test Task",
  description: "Test Description",
  priority: "high"
};

beforeAll(async () => {
  // Connect to test DB and clear existing data
  await Task.deleteMany({});
  await redisClient.connect();
});

afterAll(async () => {
  // Close connections
  await mongoose.disconnect();
  await redisClient.disconnect();
});

afterEach(async () => {
  // Clear Redis cache after each test
  await redisClient.flushAll();
});

describe('Task API', () => {
  // Test 1: Create a task
  test('POST /tasks - Create a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send(testTask)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe(testTask.title);
  });

  // Test 2: Get tasks with priority sorting
  test('GET /tasks - Sort by priority (high first)', async () => {
    // Create test tasks
    await Task.create([
      { title: "Low Task", priority: "low" },
      { title: "High Task", priority: "high" },
      { title: "Medium Task", priority: "medium" }
    ]);

    const response = await request(app)
      .get('/tasks')
      .expect(200);

    const priorities = response.body.tasks.map(t => t.priority);
    expect(priorities).toEqual(['high', 'medium', 'low']);
  });

  // Test 3: Filter by status
  test('GET /tasks?status=completed - Filter by status', async () => {
    await Task.create({ title: "Completed Task", status: "completed" });
    
    const response = await request(app)
      .get('/tasks?status=completed')
      .expect(200);

    expect(response.body.tasks[0].status).toBe('completed');
    expect(response.body.totalTasks).toBe(1);
  });

  // Test 4: Pagination
  test('GET /tasks?page=2&limit=1 - Pagination works', async () => {
    await Task.create([{ title: "Task 1" }, { title: "Task 2" }]);
    
    const response = await request(app)
      .get('/tasks?page=2&limit=1')
      .expect(200);

    expect(response.body.tasks.length).toBe(1);
    expect(response.body.currentPage).toBe(2);
  });

  // Test 5: Caching
  test('GET /tasks - Cache response', async () => {
    // First request (uncached)
    const firstResponse = await request(app).get('/tasks');
    expect(firstResponse.headers['x-cache']).toBeUndefined();

    // Second request (cached)
    const secondResponse = await request(app).get('/tasks');
    expect(secondResponse.headers['x-cache']).toBe('HIT');
  });

  // Test 6: Error handling
  test('POST /tasks - Reject invalid priority', async () => {
    await request(app)
      .post('/tasks')
      .send({ title: "Invalid", priority: "invalid" })
      .expect(400);
  });
});