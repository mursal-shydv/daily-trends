import Container from 'typedi';
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
  getAll(): Promise<IFeed[]> {
    return this.feedService.getAllFeeds();
  }

  @Get('/:id')
  getOne(@Param('id') id: string): Promise<IFeed | null> {
    return this.feedService.getFeedById(id);
  }

  @Post('/')
  post(@Body() feed: IFeed): Promise<IFeed | null> {
    return this.feedService.createFeed(feed);
  }

  @Put('/:id')
  put(@Param('id') id: string, @Body() feed: IFeed): Promise<IFeed | null> {
    return this.feedService.updateFeed(id, feed);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<void> {
    return this.feedService.deleteFeed(id);
  }
}
