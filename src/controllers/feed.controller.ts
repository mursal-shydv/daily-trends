import Container from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { FeedService } from '../services/feed.service';
import { IFeed } from '../interfaces/feed.interface';
import { JsonController, Get, Post, Put, Delete, Param, Body } from 'routing-controllers';

@JsonController('/feeds')
export class FeedController {
  private readonly feedService: FeedService;

  public constructor() {
    this.feedService = Container.get(FeedService);
  }

  @Get('/')
  @OpenAPI({
    summary: 'Retrieve a list of news',
    responses: {
      '200': {
        description: 'List of news'
      }
    }
  })
  getAllFeed(): Promise<IFeed[]> {
    return this.feedService.getAllFeeds();
  }

  @Get('/:id')
  @OpenAPI({
    summary: 'Retrieve single news by id',
    responses: {
      '200': {
        description: 'single news'
      }
    }
  })
  getOneFeed(@Param('id') id: string): Promise<IFeed | null> {
    return this.feedService.getFeedById(id);
  }

  @Post('/')
  @OpenAPI({
    summary: 'Create new news manually',
    responses: {
      '200': {
        description: 'create news'
      }
    }
  })
  createNewFeed(@Body() feed: IFeed): Promise<IFeed | null> {
    return this.feedService.createFeed(feed);
  }

  @Put('/:id')
  @OpenAPI({
    summary: 'Update the news by id',
    responses: {
      '200': {
        description: 'update news'
      }
    }
  })
  updateFeed(@Param('id') id: string, @Body() feed: IFeed): Promise<IFeed | null> {
    return this.feedService.updateFeed(id, feed);
  }

  @Delete('/:id')
  @OpenAPI({
    summary: 'Delete news by id',
    responses: {
      '200': {
        description: 'delete news'
      }
    }
  })
  async deleteFeed(@Param('id') id: string): Promise<object> {
    await this.feedService.deleteFeed(id);
    return { response: 'Feed deleted successfully' };
  }
}
