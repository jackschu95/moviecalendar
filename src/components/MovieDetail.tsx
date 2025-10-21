import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { CalendarEvent } from '../types';

interface MovieDetailProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function MovieDetail({ event, onClose }: MovieDetailProps) {
  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <h2 className="movie-title">{event.title}</h2>

        {event.director && (
          <p className="movie-director">Directed by {event.director}</p>
        )}

        {event.year && (
          <p className="movie-year">{event.year}</p>
        )}

        <div className="movie-info">
          <div className="info-item">
            <MapPin size={18} />
            <span>{event.theaterName}</span>
          </div>
          <div className="info-item">
            <Calendar size={18} />
            <span>{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="info-item">
            <Clock size={18} />
            <span>{event.time}</span>
          </div>
        </div>

        {event.description && (
          <div className="movie-description">
            <h3>Description</h3>
            <p>{event.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
