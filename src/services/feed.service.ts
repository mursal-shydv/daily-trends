import { IFeed } from '../interfaces';
import FeedModel from '../models/feed.model';
import { RedisService } from '../services';

/**
 * Service class to manage feed data and handle caching with Redis.
 */
export class FeedService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Retrieves all feeds. First attempts to fetch from cache, 
   * then falls back to database query if cache is empty.
   */
  async getAllFeeds(): Promise<IFeed[]> {
    const cachedFeeds = await this.redisService.get('all_feeds');
    if (cachedFeeds) {
      return JSON.parse(cachedFeeds);
    }

    const feeds = await FeedModel.find();
    if (feeds.length) {
      await this.redisService.set('all_feeds', JSON.stringify(feeds));
    }
    return feeds;
  }

  /**
   * Retrieves a single feed by its ID. 
   * Attempts to fetch from cache first, then falls back to database query.
   * @param id - The ID of the feed to retrieve.
   */
  async getFeedById(id: string): Promise<IFeed | null> {
    const cachedFeed = await this.redisService.get(`feed_${id}`);
    if (cachedFeed) {
      return JSON.parse(cachedFeed);
    }

    const feed = await FeedModel.findById(id);
    if (feed) {
      await this.redisService.set(`feed_${id}`, JSON.stringify(feed));
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

    await this.redisService.del('all_feeds');
    return savedFeed;
  }

  /**
   * Updates a feed by its ID and clears relevant cache.
   * @param id - The ID of the feed to update.
   * @param feedData - The new data for the feed.
   */
  async updateFeed(id: string, feedData: IFeed): Promise<IFeed | null> {
    const updatedFeed = await FeedModel.findByIdAndUpdate(id, feedData, { new: true });

    await this.redisService.del(`feed_${id}`);
    await this.redisService.del('all_feeds');

    return updatedFeed;
  }

  /**
   * Deletes a feed by its ID and clears relevant cache.
   * @param id - The ID of the feed to delete.
   */
  async deleteFeed(id: string): Promise<void> {
    await FeedModel.findByIdAndDelete(id);
    await this.redisService.del(`feed_${id}`);
    await this.redisService.del('all_feeds');
  }
}
