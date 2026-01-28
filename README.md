# Relaisblick - Österreichische Relais-Karte

Interaktive Webkarte zur Darstellung aller Amateurfunk-Relais in Österreich.

## Features

- Interaktive Karte mit allen österreichischen Amateurfunk-Relais
- Filter nach Band (2m, 70cm, 23cm, etc.)
- Filter nach Typ (FM, DMR, D-STAR, C4FM, etc.)
- Filter nach Bundesland
- Suche nach Rufzeichen oder Standort
- Detailansicht mit Frequenzen, CTCSS, DMR-IDs, etc.
- Responsive Design für Desktop und Mobile
- Automatisches wöchentliches Daten-Update

## Schnellstart

### Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Öffne http://localhost:5173 im Browser.

### Mit Docker (Entwicklung)

```bash
docker compose -f docker-compose.dev.yml up
```

### Produktion mit Docker

```bash
docker compose up -d
```

Die Anwendung ist dann unter http://localhost:80 erreichbar.

## Projektstruktur

```
relaisblick/
├── src/
│   ├── components/
│   │   ├── Map/          # Kartenkomponenten (Leaflet)
│   │   ├── Sidebar/      # Filter, Suche, Relaisliste
│   │   └── UI/           # Allgemeine UI-Komponenten
│   ├── hooks/            # React Hooks
│   ├── types/            # TypeScript Typdefinitionen
│   └── utils/            # Hilfsfunktionen
├── scripts/              # Python Scraper
│   └── sources/          # Datenquellen (ÖVSV, Repeaterbook)
├── data/                 # Relaisdaten (JSON)
├── docker/               # Docker-Konfiguration
└── .github/workflows/    # CI/CD Pipelines
```

## Technologie-Stack

### Frontend
- React 18 mit TypeScript
- Vite (Build Tool)
- Leaflet / React-Leaflet (Karten)
- Tailwind CSS (Styling)

### Backend / Scraper
- Python 3.12
- BeautifulSoup4 (Web Scraping)
- Requests (HTTP Client)

### Infrastruktur
- Docker (Multi-Stage Builds)
- Nginx (Production Server)
- GitHub Actions (CI/CD)

## Datenquellen

Die Relaisdaten werden aus folgenden Quellen aggregiert:

1. **ÖVSV** - Österreichischer Versuchssenderverband
2. **Repeaterbook** - Internationale Repeater-Datenbank

Das Update erfolgt automatisch wöchentlich via GitHub Actions.

### Manuelles Daten-Update

```bash
# Mit Python direkt
cd scripts
pip install -r requirements.txt
python update_relais.py

# Mit Docker
docker compose run --rm updater
```

## Konfiguration

### Docker Compose Override

Für lokale Anpassungen:

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
# Datei nach Bedarf anpassen
```

### Umgebungsvariablen (Updater)

| Variable | Beschreibung | Standard |
|----------|--------------|----------|
| `OUTPUT_DIR` | Ausgabeverzeichnis für JSON | `/data` |
| `SCHEDULE` | Cron-Schedule für Updates | `0 3 * * 0` (Sonntag 03:00) |
| `ONE_SHOT` | Einmaliger Lauf ohne Cron | `false` |

## Entwicklung

### Voraussetzungen

- Node.js 20+
- npm 9+
- Python 3.12+ (für Scraper)
- Docker & Docker Compose (optional)

### Scripts

```bash
npm run dev      # Development Server
npm run build    # Production Build
npm run preview  # Production Preview
npm run lint     # ESLint
```

### Code-Stil

- TypeScript mit strikten Typen
- ESLint für Code-Qualität
- Prettier für Formatierung (empfohlen)

## Deployment

### GitHub Container Registry

Docker Images werden automatisch gebaut und zu GHCR gepusht:

```bash
docker pull ghcr.io/OWNER/relaisblick:latest
docker pull ghcr.io/OWNER/relaisblick-updater:latest
```

### Eigenes Deployment

1. Repository klonen
2. `docker-compose.override.yml` erstellen
3. `docker compose up -d`

Für automatische Deployments siehe `.github/workflows/deploy.yml`.

## Lizenz

MIT License - siehe LICENSE Datei.

## Mitwirken

Beiträge sind willkommen! Bitte erstelle einen Issue oder Pull Request.

## Kontakt

Bei Fragen oder Problemen bitte ein GitHub Issue erstellen.

---

73 de OE8YML
