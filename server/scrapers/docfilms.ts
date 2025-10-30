import { TheaterScraper } from './base';
import { ScrapedMovie } from '../types';

export class DocFilmsScraper extends TheaterScraper {
  constructor() {
    super('doc-films', 'Doc Films', 'https://docfilms.uchicago.edu');
  }

  async scrape(): Promise<ScrapedMovie[]> {
    try {
      const $ = await this.fetchHtml(`${this.baseUrl}/schedule`);
      const movies: ScrapedMovie[] = [];

      $('.film, .screening, .event').each((_, element) => {
        try {
          const $elem = $(element);

          const title = $elem.find('.title, h2, h3').first().text().trim();
          const dateStr = $elem.find('time, .date').first().attr('datetime')
            || $elem.find('.date').first().text().trim();
          const timeStr = $elem.find('.time').first().text().trim();
          const description = $elem.find('.description, .synopsis').first().text().trim();
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
          console.error('Error parsing Doc Films event:', err);
        }
      });

      return movies;
    } catch (error) {
      console.error('Doc Films scraper failed:', error);
      return [];
    }
  }
}
