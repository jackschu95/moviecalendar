import type { Theater } from '../types';

interface TheaterFilterProps {
  theaters: Theater[];
  selectedTheaters: Set<string>;
  onToggleTheater: (theaterId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function TheaterFilter({
  theaters,
  selectedTheaters,
  onToggleTheater,
  onSelectAll,
  onDeselectAll,
}: TheaterFilterProps) {
  const independentTheaters = theaters.filter(t => t.type === 'independent');
  const landmarkTheaters = theaters.filter(t => t.type === 'landmark');

  return (
    <div className="theater-filter">
      <h3>Filter by Theater</h3>

      <div className="filter-actions">
        <button onClick={onSelectAll} className="filter-action-btn">
          Select All
        </button>
        <button onClick={onDeselectAll} className="filter-action-btn">
          Deselect All
        </button>
      </div>

      <div className="theater-group">
        <h4>Independent Theaters</h4>
        {independentTheaters.map(theater => (
          <label key={theater.id} className="theater-checkbox">
            <input
              type="checkbox"
              checked={selectedTheaters.has(theater.id)}
              onChange={() => onToggleTheater(theater.id)}
            />
            <span>{theater.name}</span>
          </label>
        ))}
      </div>

      <div className="theater-group">
        <h4>Landmark</h4>
        {landmarkTheaters.map(theater => (
          <label key={theater.id} className="theater-checkbox">
            <input
              type="checkbox"
              checked={selectedTheaters.has(theater.id)}
              onChange={() => onToggleTheater(theater.id)}
            />
            <span>{theater.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
