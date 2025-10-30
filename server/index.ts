import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { database } from './db';
import { ScraperManager } from './scrapers';
import { sampleMovies } from '../src/data/movies';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const scraperManager = new ScraperManager();

// Initialize database
async function initializeServer() {
  await database.init();
  console.log('Database initialized');

  // Run initial scrape if no data exists
  const movies = await database.getMovies();
  if (movies.length === 0) {
    console.log('No movies found, running initial scrape...');
    await updateMovieData();
  }
}

// Function to update movie data
async function updateMovieData() {
  try {
    console.log('Starting movie data update...');
    const movies = await scraperManager.scrapeAll();

    // If scraping failed (no movies), use sample data as fallback
    if (movies.length === 0) {
      console.log('Scraping returned no results, loading sample data...');
      const sampleMoviesWithIds = sampleMovies.map(movie => ({
        ...movie,
        id: `${movie.theater}-${movie.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${movie.date.getTime()}`,
      }));
      await database.updateMovies(sampleMoviesWithIds);
      console.log(`Loaded ${sampleMoviesWithIds.length} sample movies`);
    } else {
      await database.updateMovies(movies);
      await database.clearOldMovies();
      console.log(`Movie data updated successfully at ${new Date().toISOString()}`);
      console.log(`Total movies in database: ${movies.length}`);
    }
  } catch (error) {
    console.error('Error updating movie data:', error);
  }
}

// API Routes
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await database.getMovies();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.get('/api/theaters', async (req, res) => {
  try {
    const theaters = await database.getTheaters();
    res.json(theaters);
  } catch (error) {
    console.error('Error fetching theaters:', error);
    res.status(500).json({ error: 'Failed to fetch theaters' });
  }
});

app.get('/api/last-update', async (req, res) => {
  try {
    const lastUpdate = await database.getLastUpdate();
    res.json({ lastUpdate });
  } catch (error) {
    console.error('Error fetching last update:', error);
    res.status(500).json({ error: 'Failed to fetch last update' });
  }
});

app.post('/api/refresh', async (req, res) => {
  try {
    await updateMovieData();
    const movies = await database.getMovies();
    res.json({ success: true, moviesCount: movies.length });
  } catch (error) {
    console.error('Error refreshing data:', error);
    res.status(500).json({ error: 'Failed to refresh data' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Schedule midnight updates (runs at 12:00 AM every day)
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled update at midnight...');
  await updateMovieData();
}, {
  timezone: "America/Chicago"
});

// Also schedule a refresh every 6 hours as backup
cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled 6-hour update...');
  await updateMovieData();
}, {
  timezone: "America/Chicago"
});

// Start server
initializeServer().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Scheduled updates:');
    console.log('  - Midnight (12:00 AM) every day');
    console.log('  - Every 6 hours as backup');
  });
});

export default app;
