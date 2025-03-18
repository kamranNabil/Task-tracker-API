// controllers/taskController.js
import Task from '../models/taskModel.js';
import { PriorityQueue } from '../utils/priorityQueue.js';
import redisClient from '../config/redis.js';

// Priority comparator: High → Medium → Low, then oldest first
const taskComparator = (a, b) => {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }
  return a.createdAt - b.createdAt;
};

export const createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'pending',
      priority: req.body.priority || 'medium'
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // 1. Fetch tasks from DB
    const tasks = await Task.find(filter);

    // 2. Sort using priority queue
    const taskQueue = new PriorityQueue(taskComparator);
    tasks.forEach(task => taskQueue.enqueue(task));
    const sortedTasks = taskQueue.toArray();

    // 3. Manual pagination
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginatedTasks = sortedTasks.slice(start, end);

    res.json({
      tasks: paginatedTasks,
      totalTasks: sortedTasks.length,
      totalPages: Math.ceil(sortedTasks.length / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// (getTaskById remains unchanged)

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};