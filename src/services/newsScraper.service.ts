import axios from 'axios';
import { IFeed } from '../interfaces/feed.interface';

export class NewsScraperService {

  async scrapeElPais(): Promise<IFeed[]> {
    const url = 'https://elpais.com/';
    // const response = await axios.get(url);

    let feeds: IFeed[] = [];

    return feeds;
  }

  async scrapeElMundo(): Promise<IFeed[]> {
    const url = 'https://www.elmundo.es/';
    // const response = await axios.get(url);
  
    let feeds: IFeed[] = [];

    return feeds;
  }
}
