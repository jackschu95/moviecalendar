import { useState, useMemo, useEffect } from 'react';
import { Film, RefreshCw } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { MovieDetail } from './components/MovieDetail';
import { TheaterFilter } from './components/TheaterFilter';
import type { CalendarEvent, Theater, MovieShowing } from './types';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [movies, setMovies] = useState<MovieShowing[]>([]);
  const [selectedTheaters, setSelectedTheaters] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch theaters and movies on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [theatersRes, moviesRes, updateRes] = await Promise.all([
        fetch(`${API_URL}/api/theaters`),
        fetch(`${API_URL}/api/movies`),
        fetch(`${API_URL}/api/last-update`),
      ]);

      const theatersData = await theatersRes.json();
      const moviesData = await moviesRes.json();
      const updateData = await updateRes.json();

      setTheaters(theatersData);
      setMovies(moviesData.map((m: any) => ({
        ...m,
        date: new Date(m.date),
      })));
      setLastUpdate(updateData.lastUpdate);

      // Select all theaters by default
      if (selectedTheaters.size === 0) {
        setSelectedTheaters(new Set(theatersData.map((t: Theater) => t.id)));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetch(`${API_URL}/api/refresh`, { method: 'POST' });
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return movies
      .filter(movie => selectedTheaters.has(movie.theater))
      .map(movie => {
        const theater = theaters.find(t => t.id === movie.theater);
        return {
          id: movie.id,
          title: movie.title,
          theater: movie.theater,
          theaterName: theater?.name || '',
          date: movie.date,
          time: movie.time,
          description: movie.description,
          director: movie.director,
          year: movie.year,
        };
      });
  }, [movies, selectedTheaters, theaters]);

  const toggleTheater = (theaterId: string) => {
    const newSelected = new Set(selectedTheaters);
    if (newSelected.has(theaterId)) {
      newSelected.delete(theaterId);
    } else {
      newSelected.add(theaterId);
    }
    setSelectedTheaters(newSelected);
  };

  const selectAllTheaters = () => {
    setSelectedTheaters(new Set(theaters.map(t => t.id)));
  };

  const deselectAllTheaters = () => {
    setSelectedTheaters(new Set());
  };

  if (loading) {
    return (
      <div className="app loading-state">
        <div className="loading-spinner">
          <Film size={48} />
          <p>Loading movie listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Film size={32} />
          <h1>Chicago Independent Cinema Calendar</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="refresh-button"
            title="Refresh movie listings"
          >
            <RefreshCw size={20} className={refreshing ? 'spinning' : ''} />
          </button>
        </div>
        <p className="header-subtitle">
          Your guide to independent and art house films in Chicago
        </p>
        {lastUpdate && (
          <p className="last-update">
            Last updated: {new Date(lastUpdate).toLocaleString()}
          </p>
        )}
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <TheaterFilter
            theaters={theaters}
            selectedTheaters={selectedTheaters}
            onToggleTheater={toggleTheater}
            onSelectAll={selectAllTheaters}
            onDeselectAll={deselectAllTheaters}
          />
        </aside>

        <main className="main-content">
          {calendarEvents.length === 0 ? (
            <div className="no-movies">
              <p>No movies found for the selected theaters.</p>
              <button onClick={handleRefresh} className="refresh-link">
                Refresh data
              </button>
            </div>
          ) : (
            <Calendar events={calendarEvents} onEventClick={setSelectedEvent} />
          )}
        </main>
      </div>

      <MovieDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}

export default App;
