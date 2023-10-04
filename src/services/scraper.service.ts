import axios from 'axios';
import * as cheerio from 'cheerio';
import { IFeed } from '../interfaces/feed.interface';
import { ARTICLE_SELECTORS, URLS } from '../constants';

export class NewsScraperService {
  
  /**
   * Scrapes news articles from El Pais.
   *
   * @returns A promise resolving with an array of up to 3 IFeed objects containing the scraped articles.
   */
  async scrapeElPais(): Promise<IFeed[]> {
    const { data } = await axios.get(URLS.EL_PAIS);
    const $ = cheerio.load(data);
    const feeds: IFeed[] = [];

    $('article.c').each((_, element) => {
      const title = $(element).find(ARTICLE_SELECTORS.TITLE).text().trim();
      const description = $(element).find(ARTICLE_SELECTORS.DESCRIPTION).text().trim();
      const author = $(element).find(ARTICLE_SELECTORS.AUTHOR).first().text().trim();
      const location = $(element).find(ARTICLE_SELECTORS.LOCATION).text().trim();

      if (title && description && author && location) {
        feeds.push({ title, description, author, location });
      }

      if (feeds.length >= 3) {
        // need only 3 article from ElPais
        return false;
      }
    });

    return feeds;
  }

  /**
   * Scrapes news articles from El Mundo.
   *
   * @returns A promise resolving with an array of up to 2 IFeed objects containing the scraped articles.
   */
  async scrapeElMundo(): Promise<IFeed[]> {
    const { data: mainPage } = await axios.get(URLS.EL_MUNDO);
    const $ = cheerio.load(mainPage);
    const feeds: IFeed[] = [];

    const processElement = async (element: cheerio.Element) => {
      const headline = $(element).find(ARTICLE_SELECTORS.HEADER).text().trim();
      const link = $(element).find(ARTICLE_SELECTORS.LINK).attr('href');

      if (!link) return;

      const { data: articleData } = await axios.get(link);
      const article$ = cheerio.load(articleData);
      
      const title = article$(ARTICLE_SELECTORS.TITLE_MUNDO).text().trim();
      const description = article$(ARTICLE_SELECTORS.DESCRIPTION_MUNDO).text().trim();
      const author = article$(ARTICLE_SELECTORS.AUTHOR_MUNDO).text().trim();
      const location = article$(ARTICLE_SELECTORS.LOCATION_MUNDO).text().trim();
  
      if (feeds.length >= 2) {
        // only 2 articles from ElMundo
        return;
      }
      if (headline && description && author && location) {
        feeds.push({ title, description, author, location });
      }
    };

    const elements = $('.ue-c-cover-content').toArray();
    const promises = elements.map(processElement);

    await Promise.all(promises);

    return feeds;
  }
}
