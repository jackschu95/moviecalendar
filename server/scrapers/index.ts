import { MusicBoxScraper } from './musicbox';
import { SiskelScraper } from './siskel';
import { DocFilmsScraper } from './docfilms';
import { TheaterScraper } from './base';
import { ScrapedMovie, MovieShowing } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ScraperManager {
  private scrapers: Map<string, TheaterScraper>;

  constructor() {
    this.scrapers = new Map();
    this.registerScrapers();
  }

  private registerScrapers() {
    const scraperInstances = [
      new MusicBoxScraper(),
      new SiskelScraper(),
      new DocFilmsScraper(),
    ];

    scraperInstances.forEach(scraper => {
      this.scrapers.set((scraper as any).theaterId, scraper);
    });
  }

  async scrapeAll(): Promise<MovieShowing[]> {
    console.log('Starting to scrape all theaters...');
    const allMovies: MovieShowing[] = [];

    for (const [theaterId, scraper] of this.scrapers) {
      try {
        console.log(`Scraping ${theaterId}...`);
        const scrapedMovies = await scraper.scrape();

        const movieShowings: MovieShowing[] = scrapedMovies.map(movie => ({
          id: uuidv4(),
          theater: theaterId,
          ...movie,
        }));

        allMovies.push(...movieShowings);
        console.log(`Successfully scraped ${movieShowings.length} movies from ${theaterId}`);
      } catch (error) {
        console.error(`Failed to scrape ${theaterId}:`, error);
      }
    }

    console.log(`Total movies scraped: ${allMovies.length}`);
    return allMovies;
  }

  async scrapeTheater(theaterId: string): Promise<MovieShowing[]> {
    const scraper = this.scrapers.get(theaterId);
    if (!scraper) {
      throw new Error(`No scraper found for theater: ${theaterId}`);
    }

    const scrapedMovies = await scraper.scrape();
    return scrapedMovies.map(movie => ({
      id: uuidv4(),
      theater: theaterId,
      ...movie,
    }));
  }
}
