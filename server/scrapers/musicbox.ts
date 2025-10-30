import { TheaterScraper } from './base';
import { ScrapedMovie } from '../types';

export class MusicBoxScraper extends TheaterScraper {
  constructor() {
    super('music-box', 'Music Box Theatre', 'https://musicboxtheatre.com');
  }

  async scrape(): Promise<ScrapedMovie[]> {
    try {
      const $ = await this.fetchHtml(`${this.baseUrl}/calendar`);
      const movies: ScrapedMovie[] = [];

      // Music Box uses a calendar view with event listings
      $('.event-item, .film-listing, .show-listing').each((_, element) => {
        try {
          const $elem = $(element);

          const title = $elem.find('.event-title, .film-title, h2, h3').first().text().trim();
          const dateStr = $elem.find('.event-date, .show-date, time').first().attr('datetime')
            || $elem.find('.event-date, .show-date').first().text().trim();
          const timeStr = $elem.find('.event-time, .show-time').first().text().trim();
          const description = $elem.find('.event-description, .film-description, p').first().text().trim();
          const url = $elem.find('a').first().attr('href');

          if (title && dateStr && timeStr) {
            const date = this.parseDate(dateStr);
            if (date) {
              movies.push({
                title,
                date,
                time: timeStr,
                description: description || undefined,
                url: url ? `${this.baseUrl}${url}` : undefined,
              });
            }
          }
        } catch (err) {
          console.error('Error parsing Music Box event:', err);
        }
      });

      return movies;
    } catch (error) {
      console.error('Music Box scraper failed:', error);
      return [];
    }
  }
}
