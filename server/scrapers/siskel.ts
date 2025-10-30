import { TheaterScraper } from './base';
import { ScrapedMovie } from '../types';

export class SiskelScraper extends TheaterScraper {
  constructor() {
    super('siskel', 'Gene Siskel Film Center', 'https://www.siskelfilmcenter.org');
  }

  async scrape(): Promise<ScrapedMovie[]> {
    try {
      const $ = await this.fetchHtml(`${this.baseUrl}/calendar`);
      const movies: ScrapedMovie[] = [];

      $('.screening, .film-event, .calendar-event').each((_, element) => {
        try {
          const $elem = $(element);

          const title = $elem.find('.film-title, h2, h3, .title').first().text().trim();
          const dateStr = $elem.find('time, .date').first().attr('datetime')
            || $elem.find('.date').first().text().trim();
          const timeStr = $elem.find('.time, .screening-time').first().text().trim();
          const description = $elem.find('.description, .synopsis, p').first().text().trim();
          const director = $elem.find('.director').first().text().replace(/^Director:?\s*/i, '').trim();
          const yearMatch = $elem.text().match(/\b(19\d{2}|20\d{2})\b/);
          const url = $elem.find('a').first().attr('href');

          if (title && dateStr && timeStr) {
            const date = this.parseDate(dateStr);
            if (date) {
              movies.push({
                title,
                date,
                time: timeStr,
                description: description || undefined,
                director: director || undefined,
                year: yearMatch ? parseInt(yearMatch[1]) : undefined,
                url: url ? (url.startsWith('http') ? url : `${this.baseUrl}${url}`) : undefined,
              });
            }
          }
        } catch (err) {
          console.error('Error parsing Siskel event:', err);
        }
      });

      return movies;
    } catch (error) {
      console.error('Siskel scraper failed:', error);
      return [];
    }
  }
}
