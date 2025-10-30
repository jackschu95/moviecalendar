import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { sampleMovies } from '../src/data/movies';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Try to get movies from KV storage
    const movies = await kv.get('movies');

    if (movies && Array.isArray(movies) && movies.length > 0) {
      return res.status(200).json(movies);
    }

    // Fallback to sample data
    const sampleMoviesWithIds = sampleMovies.map(movie => ({
      ...movie,
      id: `${movie.theater}-${movie.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${movie.date.getTime()}`,
    }));

    return res.status(200).json(sampleMoviesWithIds);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return res.status(500).json({ error: 'Failed to fetch movies' });
  }
}
