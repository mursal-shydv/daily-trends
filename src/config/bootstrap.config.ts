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


    const feedService = new FeedService(redisService)
    Container.set(FeedService, feedService);

    const newsScraperService = new NewsScraperService();
    Container.set(NewsScraperService, newsScraperService);
    

  } catch (error) {
    console.error('Error during bootstrapping:', error);
  }
};

export default bootstrap;
