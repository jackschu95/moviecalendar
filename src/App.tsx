import { useState, useMemo } from 'react';
import { Film } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { MovieDetail } from './components/MovieDetail';
import { TheaterFilter } from './components/TheaterFilter';
import { chicagoTheaters } from './data/theaters';
import { sampleMovies } from './data/movies';
import type { CalendarEvent } from './types';
import './App.css';

function App() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedTheaters, setSelectedTheaters] = useState<Set<string>>(
    new Set(chicagoTheaters.map(t => t.id))
  );

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return sampleMovies
      .filter(movie => selectedTheaters.has(movie.theater))
      .map(movie => {
        const theater = chicagoTheaters.find(t => t.id === movie.theater);
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
  }, [selectedTheaters]);

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
    setSelectedTheaters(new Set(chicagoTheaters.map(t => t.id)));
  };

  const deselectAllTheaters = () => {
    setSelectedTheaters(new Set());
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Film size={32} />
          <h1>Chicago Independent Cinema Calendar</h1>
        </div>
        <p className="header-subtitle">
          Your guide to independent and art house films in Chicago
        </p>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <TheaterFilter
            theaters={chicagoTheaters}
            selectedTheaters={selectedTheaters}
            onToggleTheater={toggleTheater}
            onSelectAll={selectAllTheaters}
            onDeselectAll={deselectAllTheaters}
          />
        </aside>

        <main className="main-content">
          <Calendar events={calendarEvents} onEventClick={setSelectedEvent} />
        </main>
      </div>

      <MovieDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}

export default App;
