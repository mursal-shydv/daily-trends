/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RedisService, NewsScraperService, FeedService } from '../';
import FeedModel from '../../models/feed.model';
import { CACHE } from '../../constants';
import { Container } from 'typedi';

jest.mock('../scraper.service');
jest.mock('../redis.service');
jest.mock('../../models/feed.model');
jest.mock('typedi', () => {
  const actualTypedi = jest.requireActual('typedi');
  actualTypedi.Container.get = jest.fn();
  return actualTypedi;
});

const mockFind = jest.fn();
(FeedModel.find as jest.Mock).mockReturnValue({
  select: jest.fn().mockReturnThis(),
  lean: mockFind
});

describe('FeedService', () => {
  let feedService: FeedService;
  let mockNewsScraperService: jest.Mocked<NewsScraperService>;
  let mockRedisService: jest.Mocked<RedisService>;
  let mockRedisClient: jest.Mocked<any>;

  beforeEach(() => {
    mockRedisClient = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    mockNewsScraperService = new NewsScraperService() as any;
    mockRedisService = new RedisService(mockRedisClient) as any;

    (Container.get as jest.Mock).mockImplementation((someClass) => {
      if (someClass === NewsScraperService) {
        return mockNewsScraperService;
      } else if (someClass === RedisService) {
        return mockRedisService;
      } else {
        throw new Error(`mock service: ${someClass}`);
      }
    });

    feedService = new FeedService();
  });

  it('should get all feeds from cache if available', async () => {
    mockRedisService.get.mockResolvedValue(JSON.stringify([{ title: 'buena noticia' }]));

    const feeds = await feedService.getAllFeeds();

    expect(feeds).toEqual([{ title: 'buena noticia' }]);
    expect(mockRedisService.get).toHaveBeenCalledWith(CACHE.FEED);
  });

  it('should scrape new feeds when neither cache nor database has them', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockFind.mockResolvedValue([]);
    mockNewsScraperService.scrapeElPais.mockResolvedValue([{ 
      title: 'buena noticia el pais' ,
      description: 'era broma',
    }]);
    mockNewsScraperService.scrapeElMundo.mockResolvedValue([{ 
      title: 'mala noticia el mundo' ,
      description: 'si es verdad'
    }]);

    expect(mockNewsScraperService.scrapeElPais).toHaveBeenCalled();
    expect(mockNewsScraperService.scrapeElMundo).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
