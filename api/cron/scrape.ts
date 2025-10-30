import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

// This endpoint runs on a schedule defined in vercel.json
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Only allow GET requests from Vercel Cron
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify request is from Vercel Cron
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Starting scheduled scrape...');

    // Import scrapers
    const { ScraperManager } = await import('../../server/scrapers/index');
    const scraperManager = new ScraperManager();

    // Scrape all theaters
    const movies = await scraperManager.scrapeAll();

    // Store in Vercel KV (key-value storage)
    if (movies.length > 0) {
      await kv.set('movies', movies);
      await kv.set('lastUpdate', new Date().toISOString());

      return res.status(200).json({
        success: true,
        moviesCount: movies.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log('No movies scraped, keeping existing data');
      return res.status(200).json({
        success: true,
        message: 'No new movies found',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({
      error: 'Scraping failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
