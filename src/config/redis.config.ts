import { createClient } from 'redis';

export const connectToRedis = async (): Promise<any> => {
  const client = await createClient()
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();

  client.on('connect', () => {
    console.log('Connected to Redis');
  });

  client.on('end', () => {
    console.error('Redis client disconnected');
  });
  return client;
};
