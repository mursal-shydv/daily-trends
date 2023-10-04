import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

let redisClient: RedisClientType;

export const connectToRedis = async (): Promise<RedisClientType> => {
  redisClient = createClient();
  redisClient.on('error', err => console.error(`Redis Error: ${err}`));
  redisClient.on('connect', () => console.info('Redis connected'));
  redisClient.on('reconnecting', () => console.info('Redis reconnecting'));
  await redisClient.connect();
  return redisClient;
};
