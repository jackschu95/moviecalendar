# Chicago Independent Cinema Calendar

A beautiful, interactive web application that displays a calendar of movies playing at Chicago's independent theaters and Landmark cinemas. **Automatically scrapes theater websites and updates nightly at midnight!**

## Features

- **🎬 Automated Data Collection**: Web scrapers pull movie listings directly from theater websites
- **⏰ Scheduled Updates**: Data refreshes automatically every night at midnight (Chicago time)
- **📅 Interactive Calendar View**: Browse movies by date with an easy-to-navigate monthly calendar
- **🎭 Theater Filtering**: Filter movies by specific theaters or view all at once
- **ℹ️ Detailed Movie Information**: Click on any movie to see details including director, year, description, and showtimes
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🔄 Manual Refresh**: Click the refresh button to update listings on demand
- **Featured Theaters**:
  - Music Box Theatre
  - Doc Films (University of Chicago)
  - Gene Siskel Film Center
  - Facets Cinematheque
  - Logan Theatre
  - Davis Theater
  - Landmark Century Centre Cinema

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moviecalendar
```

2. Install dependencies:
```bash
npm install
```

3. Start both frontend and backend servers:
```bash
npm run dev
```

This will start:
- **Frontend** (Vite dev server) on http://localhost:5173
- **Backend** (Express API server) on http://localhost:3001

4. Open your browser and navigate to http://localhost:5173

The backend will automatically scrape theater websites on first run, then update the data every night at midnight (Chicago time) and every 6 hours as a backup.

### Manual Data Refresh

You can manually trigger a data refresh by:
- Clicking the refresh button in the app header
- Making a POST request to `http://localhost:3001/api/refresh`

## Available Scripts

- `npm run dev` - Start both frontend and backend development servers concurrently
- `npm run dev:client` - Start only the frontend (Vite dev server)
- `npm run dev:server` - Start only the backend (Express API server)
- `npm run build` - Build the production-ready frontend
- `npm run build:server` - Build the backend TypeScript
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **date-fns** - Modern date utility library
- **lucide-react** - Beautiful icon library

### Backend
- **Express** - Web server framework
- **Cheerio** - HTML parsing and web scraping
- **Axios** - HTTP client for fetching theater websites
- **node-cron** - Task scheduler for automated updates
- **lowdb** - Simple JSON database for storing movie data

## Project Structure

```
moviecalendar/
├── src/                        # Frontend source code
│   ├── components/             # React components
│   │   ├── Calendar.tsx       # Main calendar view
│   │   ├── MovieDetail.tsx    # Movie details modal
│   │   └── TheaterFilter.tsx  # Theater filter sidebar
│   ├── data/                   # Static data
│   │   └── theaters.ts        # Theater information
│   ├── types.ts               # TypeScript type definitions
│   ├── App.tsx                # Main application component
│   ├── App.css                # Application styles
│   ├── index.css              # Global styles
│   └── main.tsx               # Application entry point
├── server/                     # Backend source code
│   ├── scrapers/              # Web scrapers for each theater
│   │   ├── base.ts            # Base scraper class
│   │   ├── musicbox.ts        # Music Box Theatre scraper
│   │   ├── siskel.ts          # Gene Siskel Film Center scraper
│   │   ├── docfilms.ts        # Doc Films scraper
│   │   └── index.ts           # Scraper manager
│   ├── db.ts                  # Database layer (lowdb)
│   ├── index.ts               # Express server with API routes
│   └── types.ts               # Backend TypeScript types
└── package.json               # Dependencies and scripts
```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/movies` - Get all movie showings
- `GET /api/theaters` - Get all theaters
- `GET /api/last-update` - Get timestamp of last data update
- `POST /api/refresh` - Trigger manual data refresh
- `GET /api/health` - Health check endpoint

## How It Works

### Web Scraping
Each theater has a custom scraper that:
1. Fetches the theater's website HTML
2. Parses the HTML to extract movie information (title, date, time, description, etc.)
3. Returns structured data

### Scheduling
The application uses `node-cron` to schedule automatic updates:
- **Midnight** (12:00 AM Chicago time) - Daily update
- **Every 6 hours** - Backup update to ensure fresh data

### Data Storage
Movie data is stored in a JSON file (`server/data.json`) using lowdb:
- Persists between server restarts
- Automatically cleans up past movie showings
- Tracks last update timestamp

## Future Enhancements

- Add more Chicago theaters (Film Center, Chicago Film Society, etc.)
- Enhance scrapers with more detailed movie metadata
- Add search functionality by movie title or director
- Filter by genre, year, or other attributes
- User accounts and favorites
- Email notifications for upcoming films
- Share calendar events via social media
- Integration with ticketing platforms
- Dark mode support
- Export to Google Calendar / iCal
- Mobile app using React Native

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Theater data and information from respective theater websites
- Built with love for Chicago's vibrant independent film community
