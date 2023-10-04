import Container from 'typedi';
import connectDatabase from './mongodb.config';
import { connectToRedis } from './redis.config';
import { FeedService, NewsScraperService, RedisService } from '../services';

const bootstrap = async (): Promise<void> => {
  try {
    await connectDatabase();

    const redisClient = await connectToRedis();

    const redisService = new RedisService(redisClient);
    Container.set(RedisService, redisService);

    const newsScraperService = new NewsScraperService();
    Container.set(NewsScraperService, newsScraperService);

    const feedService = new FeedService(redisService);
    Container.set(FeedService, feedService);

  } catch (error) {
    console.error('Error during bootstrapping:', error);
  }
};

export default bootstrap;
