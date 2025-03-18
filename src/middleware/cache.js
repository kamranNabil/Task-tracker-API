// middleware/cache.js
import redisClient from '../config/redis.js';

export const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = `tasks:${req.query.priority}:${req.query.status}:${req.query.page}:${req.query.limit}`;
  
  const cachedData = await redisClient.get(key);
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  const originalSend = res.json;
  res.json = (body) => {
    redisClient.setEx(key, duration, JSON.stringify(body));
    originalSend.call(res, body);
  };
  next();
};

export const invalidateCache = async (req, res, next) => {
  const pattern = `tasks:*`;
  const keys = await redisClient.keys(pattern);
  if (keys.length) await redisClient.del(keys);
  next();
};