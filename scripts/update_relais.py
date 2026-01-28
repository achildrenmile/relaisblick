#!/usr/bin/env python3
"""
Relaisblick Data Updater

Main script to fetch and merge relay data from multiple sources:
- OE8VIK websites (DMR, D-STAR, C4FM) - primary source for digital repeaters
- OEVSV API - primary source for FM repeaters
"""

import json
import logging
import argparse
from datetime import datetime, timezone
from pathlib import Path

from sources.oevsv import OevsvScraper, RelaisInfo
from sources.oe8vik import OE8VIKScraper, DigitalRelaisInfo

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

DEFAULT_OUTPUT = Path(__file__).parent.parent / "data" / "relais.json"

# Mapping from OEVSV Bundesland to our format
BUNDESLAND_FROM_CALLSIGN = {
    "1": "Wien",
    "2": "Salzburg",
    "3": "Niederösterreich",
    "4": "Burgenland",
    "5": "Oberösterreich",
    "6": "Steiermark",
    "7": "Tirol",
    "8": "Kärnten",
    "9": "Vorarlberg",
}


def get_bundesland_from_callsign(callsign: str) -> str:
    """Extract Bundesland from callsign prefix."""
    if len(callsign) >= 3 and callsign.startswith("OE"):
        digit = callsign[2]
        return BUNDESLAND_FROM_CALLSIGN.get(digit, "Wien")
    return "Wien"


def merge_relais_data(
    oevsv_data: list[RelaisInfo],
    oe8vik_data: list[DigitalRelaisInfo],
) -> list[dict]:
    """
    Merge relay data from multiple sources.

    Priority for digital modes: OE8VIK > OEVSV
    FM repeaters: OEVSV only
    """
    merged = {}
    today = datetime.now(timezone.utc).date().isoformat()

    # First, add all OEVSV FM repeaters
    for r in oevsv_data:
        if r.typ != "FM":
            continue  # Skip digital from OEVSV, we'll use OE8VIK

        relais_id = f"{r.rufzeichen.lower()}-{r.band}".replace("/", "-")

        merged[relais_id] = {
            "id": relais_id,
            "rufzeichen": r.rufzeichen,
            "standort": r.standort,
            "bundesland": r.bundesland,
            "koordinaten": {"lat": r.lat, "lng": r.lng},
            "typ": r.typ,
            "band": r.band,
            "txFrequenz": r.tx_frequenz,
            "rxFrequenz": r.rx_frequenz,
            "shift": r.shift,
            "status": r.status,
            "lastUpdate": today,
        }

        if r.ctcss:
            merged[relais_id]["ctcss"] = r.ctcss
        if r.echolink:
            merged[relais_id]["echolink"] = r.echolink
        if r.betreiber:
            merged[relais_id]["betreiber"] = r.betreiber
        if r.seehoehe:
            merged[relais_id]["seehöhe"] = r.seehoehe
        if r.bemerkung:
            merged[relais_id]["bemerkung"] = r.bemerkung

    # Then add OE8VIK digital repeaters (these are more up-to-date)
    for r in oe8vik_data:
        relais_id = f"{r.rufzeichen.lower()}-{r.typ.lower()}-{r.band}".replace("/", "-")

        # Try to get coordinates from OEVSV data
        lat, lng = 47.5, 13.5  # Default Austria center
        bundesland = get_bundesland_from_callsign(r.rufzeichen)
        seehoehe = None

        # Look for matching OEVSV entry to get coordinates
        for oevsv_r in oevsv_data:
            if oevsv_r.rufzeichen == r.rufzeichen:
                lat, lng = oevsv_r.lat, oevsv_r.lng
                bundesland = oevsv_r.bundesland
                seehoehe = oevsv_r.seehoehe
                break

        merged[relais_id] = {
            "id": relais_id,
            "rufzeichen": r.rufzeichen,
            "standort": r.standort,
            "bundesland": bundesland,
            "koordinaten": {"lat": lat, "lng": lng},
            "typ": r.typ,
            "band": r.band,
            "txFrequenz": r.tx_frequenz,
            "rxFrequenz": r.rx_frequenz,
            "shift": r.shift,
            "status": r.status,
            "lastUpdate": today,
        }

        if r.network:
            merged[relais_id]["network"] = r.network
        if r.module:
            merged[relais_id]["dstarModule"] = r.module
        if r.reflector:
            merged[relais_id]["reflector"] = r.reflector
        if seehoehe:
            merged[relais_id]["seehöhe"] = seehoehe

    # Sort by callsign and type
    return sorted(merged.values(), key=lambda x: (x["rufzeichen"], x["typ"]))


def load_existing_data(filepath: Path) -> dict | None:
    """Load existing relay data if available."""
    if not filepath.exists():
        return None

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        logger.warning(f"Could not load existing data: {e}")
        return None


def save_data(data: dict, filepath: Path) -> None:
    """Save relay data to JSON file."""
    filepath.parent.mkdir(parents=True, exist_ok=True)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    logger.info(f"Saved {len(data['relais'])} relays to {filepath}")


def main():
    parser = argparse.ArgumentParser(
        description="Update Austrian amateur radio relay data"
    )
    parser.add_argument(
        "-o", "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output JSON file (default: {DEFAULT_OUTPUT})"
    )
    parser.add_argument(
        "--skip-oevsv",
        action="store_true",
        help="Skip OEVSV API"
    )
    parser.add_argument(
        "--skip-oe8vik",
        action="store_true",
        help="Skip OE8VIK websites"
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    logger.info("Starting relay data update...")

    # Fetch from sources
    oevsv_data = []
    oe8vik_data = []

    if not args.skip_oevsv:
        try:
            scraper = OevsvScraper()
            oevsv_data = scraper.fetch_relais()
        except Exception as e:
            logger.error(f"OEVSV fetching failed: {e}")

    if not args.skip_oe8vik:
        try:
            scraper = OE8VIKScraper()
            oe8vik_data = scraper.fetch_all()
        except Exception as e:
            logger.error(f"OE8VIK fetching failed: {e}")

    # If all sources failed, try to keep existing data
    if not oevsv_data and not oe8vik_data:
        logger.warning("No data from any source!")
        existing = load_existing_data(args.output)
        if existing:
            logger.info("Keeping existing data")
            return
        logger.error("No existing data to fall back to")
        return

    # Merge data
    merged_relais = merge_relais_data(oevsv_data, oe8vik_data)

    # Create output structure
    output_data = {
        "relais": merged_relais,
        "lastUpdate": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "sources": {
            "oevsv": len(oevsv_data),
            "oe8vik": len(oe8vik_data),
        }
    }

    # Save
    save_data(output_data, args.output)
    logger.info("Update complete!")


if __name__ == "__main__":
    main()
