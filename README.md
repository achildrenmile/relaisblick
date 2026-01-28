# Relaisblick - Austrian Repeater Map

Interactive web map displaying all amateur radio repeaters in Austria.

## Features

- Interactive map with all Austrian amateur radio repeaters
- Filter by band (2m, 70cm, 23cm, etc.)
- Filter by type (FM, DMR, D-STAR, C4FM, etc.)
- Filter by federal state (Bundesland)
- Search by callsign or location
- Detail view with frequencies, CTCSS, DMR IDs, etc.
- Responsive design for desktop and mobile
- Automatic weekly data updates

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### With Docker (Development)

```bash
docker compose -f docker-compose.dev.yml up
```

### Production with Docker

```bash
docker compose up -d
```

The application will be available at http://localhost:80.

## Project Structure

```
relaisblick/
├── src/
│   ├── components/
│   │   ├── Map/          # Map components (Leaflet)
│   │   ├── Sidebar/      # Filters, search, repeater list
│   │   └── UI/           # General UI components
│   ├── hooks/            # React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── scripts/              # Python scraper
│   └── sources/          # Data sources (OEVSV, Repeaterbook)
├── data/                 # Repeater data (JSON)
├── docker/               # Docker configuration
└── .github/workflows/    # CI/CD pipelines
```

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (Build tool)
- Leaflet / React-Leaflet (Maps)
- Tailwind CSS (Styling)

### Backend / Scraper
- Python 3.12
- BeautifulSoup4 (Web scraping)
- Requests (HTTP client)

### Infrastructure
- Docker (Multi-stage builds)
- Nginx (Production server)
- GitHub Actions (CI/CD)

## Data Sources

Repeater data is aggregated from the following sources:

1. **OEVSV** - Austrian Amateur Radio Association (Österreichischer Versuchssenderverband)
2. **Repeaterbook** - International repeater database

Updates are performed automatically every week via GitHub Actions.

### Manual Data Update

```bash
# With Python directly
cd scripts
pip install -r requirements.txt
python update_relais.py

# With Docker
docker compose run --rm updater
```

## Configuration

### Docker Compose Override

For local customizations:

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
# Edit file as needed
```

### Environment Variables (Updater)

| Variable | Description | Default |
|----------|-------------|---------|
| `OUTPUT_DIR` | Output directory for JSON | `/data` |
| `SCHEDULE` | Cron schedule for updates | `0 3 * * 0` (Sunday 03:00) |
| `ONE_SHOT` | Single run without cron | `false` |

## Development

### Prerequisites

- Node.js 20+
- npm 9+
- Python 3.12+ (for scraper)
- Docker & Docker Compose (optional)

### Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Production preview
npm run lint     # ESLint
```

### Code Style

- TypeScript with strict types
- ESLint for code quality
- Prettier for formatting (recommended)

## Deployment

### GitHub Container Registry

Docker images are automatically built and pushed to GHCR:

```bash
docker pull ghcr.io/OWNER/relaisblick:latest
docker pull ghcr.io/OWNER/relaisblick-updater:latest
```

### Self-Hosted Deployment

1. Clone repository
2. Create `docker-compose.override.yml`
3. Run `docker compose up -d`

For automatic deployments, see `.github/workflows/deploy.yml`.

## License

MIT License - see LICENSE file.

## Contributing

Contributions are welcome! Please create an issue or pull request.

## Contact

For questions or issues, please create a GitHub issue.

---

73 de OE8YML
