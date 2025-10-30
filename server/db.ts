import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MovieShowing, Theater } from './types';
import { chicagoTheaters } from '../src/data/theaters';

interface DatabaseSchema {
  movies: MovieShowing[];
  theaters: Theater[];
  lastUpdate: string | null;
}

class Database {
  private db!: Low<DatabaseSchema>;
  private dbPath: string;

  constructor() {
    this.dbPath = join(process.cwd(), 'server', 'data.json');
  }

  async init() {
    const adapter = new JSONFile<DatabaseSchema>(this.dbPath);
    this.db = new Low(adapter, {
      movies: [],
      theaters: chicagoTheaters,
      lastUpdate: null,
    });

    await this.db.read();

    // Initialize with default data if empty
    if (!this.db.data) {
      this.db.data = {
        movies: [],
        theaters: chicagoTheaters,
        lastUpdate: null,
      };
      await this.db.write();
    }
  }

  async getMovies(): Promise<MovieShowing[]> {
    await this.db.read();
    return this.db.data.movies || [];
  }

  async getTheaters(): Promise<Theater[]> {
    await this.db.read();
    return this.db.data.theaters || [];
  }

  async updateMovies(movies: MovieShowing[]) {
    await this.db.read();
    this.db.data.movies = movies;
    this.db.data.lastUpdate = new Date().toISOString();
    await this.db.write();
  }

  async getLastUpdate(): Promise<string | null> {
    await this.db.read();
    return this.db.data.lastUpdate;
  }

  async clearOldMovies() {
    await this.db.read();
    const now = new Date();
    this.db.data.movies = this.db.data.movies.filter(movie => {
      const movieDate = new Date(movie.date);
      return movieDate >= now;
    });
    await this.db.write();
  }
}

export const database = new Database();
