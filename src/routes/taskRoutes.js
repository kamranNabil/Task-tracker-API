// routes/taskRoutes.js
import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = express.Router();

router.post('/', invalidateCache, createTask);
router.get('/', cacheMiddleware(300), getAllTasks);
router.get('/:id', getTaskById);
router.patch('/:id', invalidateCache, updateTask);
router.delete('/:id', invalidateCache, deleteTask);

export default router;