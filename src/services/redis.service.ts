import type { RedisClientType } from 'redis';
export class RedisService {
  private client;

  constructor(redisClient: RedisClientType) {
    this.client = redisClient;
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.client.set(key, value, { EX: ttl });
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }
}
