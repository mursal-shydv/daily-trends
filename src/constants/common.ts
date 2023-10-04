enum CACHE {
  FEED = 'all_feeds',
  FEED_ = 'feed_',
}

enum ARTICLE_SELECTORS {
  ARTICLE = 'article.c',
  TITLE = 'h2.c_t > a',
  DESCRIPTION = 'p.c_d',
  AUTHOR = 'div.c_a > a.c_a_a',
  LOCATION = 'span.c_a_l',

  HEADER = '.ue-c-cover-content__headline',
  LINK = '.ue-c-cover-content__link',

  TITLE_MUNDO = '.ue-c-article__headline',
  DESCRIPTION_MUNDO = '.ue-c-article__standfirst',
  AUTHOR_MUNDO = '.ue-c-article__byline-name',
  LOCATION_MUNDO = '.ue-c-article__byline-location',
}

enum URLS {
  EL_PAIS = 'https://elpais.com/',
  EL_MUNDO = 'https://www.elmundo.es/',
}

export { URLS, CACHE, ARTICLE_SELECTORS };
