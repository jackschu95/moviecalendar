# Chicago Independent Cinema Calendar

A beautiful, interactive web application that displays a calendar of movies playing at Chicago's independent theaters and Landmark cinemas.

## Features

- **Interactive Calendar View**: Browse movies by date with an easy-to-navigate monthly calendar
- **Theater Filtering**: Filter movies by specific theaters or view all at once
- **Detailed Movie Information**: Click on any movie to see details including director, year, description, and showtimes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Tech Stack

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **date-fns** - Modern date utility library
- **lucide-react** - Beautiful icon library

## Project Structure

```
src/
├── components/          # React components
│   ├── Calendar.tsx    # Main calendar view
│   ├── MovieDetail.tsx # Movie details modal
│   └── TheaterFilter.tsx # Theater filter sidebar
├── data/               # Data files
│   ├── theaters.ts     # Theater information
│   └── movies.ts       # Movie listings (sample data)
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── App.css             # Application styles
├── index.css           # Global styles
└── main.tsx            # Application entry point
```

## Data Source

Currently, the application uses sample movie data for demonstration purposes. In a production environment, you would want to:

1. **Integrate with Theater APIs**: Many theaters provide APIs or RSS feeds for their schedules
2. **Web Scraping**: Build a backend service to scrape theater websites for current listings
3. **Manual Curation**: Create an admin interface for manually entering movie data
4. **Third-party Services**: Use services like The Movie Database (TMDb) API for additional movie information

## Future Enhancements

- Real-time data integration with theater websites
- User accounts and favorites
- Email notifications for upcoming films
- Search functionality
- Filter by genre, director, or era
- Share calendar events
- Integration with ticketing platforms
- Dark mode support
- Export to Google Calendar / iCal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Theater data and information from respective theater websites
- Built with love for Chicago's vibrant independent film community
