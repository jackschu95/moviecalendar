import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedMovie } from '../types';

export abstract class TheaterScraper {
  protected theaterId: string;
  protected theaterName: string;
  protected baseUrl: string;

  constructor(theaterId: string, theaterName: string, baseUrl: string) {
    this.theaterId = theaterId;
    this.theaterName = theaterName;
    this.baseUrl = baseUrl;
  }

  abstract scrape(): Promise<ScrapedMovie[]>;

  protected async fetchHtml(url: string): Promise<cheerio.CheerioAPI> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 15000,
      });
      return cheerio.load(response.data);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  protected generateId(title: string, date: Date, time: string): string {
    const dateStr = date.toISOString().split('T')[0];
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${this.theaterId}-${cleanTitle}-${dateStr}-${time.replace(/[^0-9]/g, '')}`;
  }

  protected parseDate(dateStr: string): Date | null {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } catch {
      return null;
    }
  }
}
