import 'dotenv/config';
import express from 'express';
import connectDB from './config/database.js';  // Import centralized DB connection
import cors from 'cors';
import helmet from 'helmet';
import taskRoutes from './routes/taskroutes.js';
import redisClient from './config/redis.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database Connections
connectDB();  // Uses the connection from database.js
redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

// Routes
app.use('/tasks', taskRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error!' });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});