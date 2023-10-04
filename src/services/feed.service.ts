import Container from 'typedi';
import { IFeed } from '../interfaces';
import FeedModel from '../models/feed.model';
import { NewsScraperService, RedisService } from '../services';
import { CACHE } from '../constants';

/**
 * Service class to manage feed data and handle caching with Redis.
 */
export class FeedService {
  private readonly newsScraperService: NewsScraperService;
  private readonly redisService: RedisService;

  constructor() {
    this.newsScraperService = Container.get(NewsScraperService);
    this.redisService = Container.get(RedisService);
  }

  /**
   * Retrieves all feeds. First attempts to fetch from cache, 
   * then falls back to database query if cache is empty.
   */
  async getAllFeeds(): Promise<IFeed[]> {
    
    const cachedFeeds = await this.redisService.get(CACHE.FEED);
    if (cachedFeeds && JSON.parse(cachedFeeds).length) {
      return JSON.parse(cachedFeeds);
    }

    const feeds = await FeedModel.find().select('-_id -__v').lean();
    if (feeds.length) {
      await this.redisService.set(CACHE.FEED, JSON.stringify(feeds));
    } else {
      const elPaisFeeds = await this.newsScraperService.scrapeElPais();
      const elMundoFeeds = await this.newsScraperService.scrapeElMundo();

      const allFeeds = [...elPaisFeeds, ...elMundoFeeds];
      for (const feed of allFeeds) {
        await FeedModel.findOneAndUpdate({ title: feed.title }, feed, { upsert: true });
      }

      await this.redisService.set(CACHE.FEED, JSON.stringify(allFeeds), 86400);
    }
    return feeds;
  }

  /**
   * Retrieves a single feed by its ID. 
   * Attempts to fetch from cache first, then falls back to database query.
   * @param id - The ID of the feed to retrieve.
   */
  async getFeedById(id: string): Promise<IFeed | null> {
    const cachedFeed = await this.redisService.get(`${CACHE.FEED_}${id}`);
    if (cachedFeed) {
      return JSON.parse(cachedFeed);
    }

    const feed = await FeedModel.findById(id).select('-_id -__v').lean();
    if (feed) {
      await this.redisService.set(`${CACHE.FEED_}${id}`, JSON.stringify(feed));
    }
    return feed;
  }

  /**
   * Creates a new feed and clears the all_feeds cache.
   * @param feedData - The data for the new feed.
   */
  async createFeed(feedData: IFeed): Promise<IFeed> {
    const feed = new FeedModel(feedData);
    const savedFeed = await feed.save();

    await this.redisService.del(CACHE.FEED);

    return {
      title: savedFeed.title,
      description: savedFeed.description,
      author: savedFeed.author,
      location: savedFeed.location
    };
  }

  /**
   * Updates a feed by its ID and clears relevant cache.
   * @param id - The ID of the feed to update.
   * @param feedData - The new data for the feed.
   */
  async updateFeed(id: string, feedData: IFeed): Promise<IFeed | null> {
    const updatedFeed = await FeedModel.findByIdAndUpdate(id, feedData, { new: true }).select('-_id -__v').lean();

    await this.redisService.del(`${CACHE.FEED_}${id}`);
    await this.redisService.del(CACHE.FEED);

    return updatedFeed;
  }

  /**
   * Deletes a feed by its ID and clears relevant cache.
   * @param id - The ID of the feed to delete.
   */
  async deleteFeed(id: string): Promise<void> {
    try {
      await FeedModel.findByIdAndDelete(id);
      await this.redisService.del(`${CACHE.FEED_}${id}`);
      await this.redisService.del(CACHE.FEED);
    } catch (error) {
      console.log(error);
    }
  }
}
