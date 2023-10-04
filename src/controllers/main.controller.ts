import Container from 'typedi';
import { FeedService } from '../services';
import { Get, Controller, Render } from 'routing-controllers';
import { IFeed } from '../interfaces';

@Controller('/')
export class MainController {
  private readonly feedService: FeedService;

  public constructor() {
    this.feedService = Container.get(FeedService);
  }

  @Get('/')
  @Render('index')
  async mainPage(): Promise<{ feeds: IFeed[] }> {
    const feeds: IFeed[] = await this.feedService.getAllFeeds();
    return { feeds };
  }
}
