import 'reflect-metadata';
import cron from 'node-cron';
import { Container } from 'typedi';
import Feed from '../models/feed.model';
import { NewsScraperService, RedisService } from '../services';

const scheduleScraping = (): void => {

  const redisService: RedisService = Container.get(RedisService);
  const newsScraperService: NewsScraperService = Container.get(NewsScraperService);

  // Schedule for every minute (will be updated to happen for once a day only)
  cron.schedule('* * * * *', async function () {
    console.log('Running the scraping service...');
    try {

      const elPaisFeeds = await newsScraperService.scrapeElPais();
      const elMundoFeeds = await newsScraperService.scrapeElMundo();

      const allFeeds = [...elPaisFeeds, ...elMundoFeeds];
      const redisKey = 'all_feeds';

      for (let feed of allFeeds) {
        await Feed.findOneAndUpdate({ link: feed.link }, feed, { upsert: true });
      }

      await redisService.set(redisKey, JSON.stringify(allFeeds), 86400);

      console.log('Scraping job completed.');
    } catch (error) {
      console.error('Error during scraping:', error);
    }
  });
};

export default scheduleScraping;
