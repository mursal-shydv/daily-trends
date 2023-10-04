import 'reflect-metadata';
import cron from 'node-cron';
import { Container } from 'typedi';
import { CACHE } from '../constants';
import Feed from '../models/feed.model';
import { NewsScraperService, RedisService } from '../services';

const scheduleScraping = (): void => {

  const redisService: RedisService = Container.get(RedisService);
  const newsScraperService: NewsScraperService = Container.get(NewsScraperService);

  // Schedule for every minute (will be updated to happen for once a day only)
  cron.schedule('* * * * *', async function () {
    try {

      const elPaisFeeds = await newsScraperService.scrapeElPais();
      const elMundoFeeds = await newsScraperService.scrapeElMundo();

      const allFeeds = [...elPaisFeeds, ...elMundoFeeds];

      for (const feed of allFeeds) {
        await Feed.findOneAndUpdate({ title: feed.title }, feed, { upsert: true });
      }

      await redisService.set(CACHE.FEED, JSON.stringify(allFeeds), 86400);

    } catch (error) {
      console.error('Error during scraping:', error);
    }
  });
};

export default scheduleScraping;
