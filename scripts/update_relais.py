#!/usr/bin/env python3
"""
Relaisblick Data Updater

Main script to fetch and merge relay data from multiple sources.
"""

import json
import logging
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from sources.oevsv import OevsvScraper, RelaisInfo
from sources.repeaterbook import RepeaterbookClient, RepeaterInfo

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

DEFAULT_OUTPUT = Path(__file__).parent.parent / "data" / "relais.json"


def merge_relais_data(
    oevsv_data: list[RelaisInfo],
    repeaterbook_data: list[RepeaterInfo],
) -> list[dict]:
    """
    Merge relay data from multiple sources.

    Priority: ÖVSV > Repeaterbook
    Matching is done by callsign.
    """
    merged = {}

    # First, add Repeaterbook data
    for r in repeaterbook_data:
        relais_id = r.rufzeichen.lower().replace("/", "-")
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
            "lastUpdate": datetime.now(timezone.utc).date().isoformat(),
        }

        if r.ctcss:
            merged[relais_id]["ctcss"] = r.ctcss
        if r.dcs_code:
            merged[relais_id]["dcsCode"] = r.dcs_code
        if r.seehoehe:
            merged[relais_id]["seehöhe"] = r.seehoehe

    # Then, update/add ÖVSV data (higher priority)
    for r in oevsv_data:
        relais_id = r.rufzeichen.lower().replace("/", "-")

        if relais_id in merged:
            # Update existing entry with ÖVSV data
            entry = merged[relais_id]
            entry["standort"] = r.standort
            entry["bundesland"] = r.bundesland
            entry["koordinaten"] = {"lat": r.lat, "lng": r.lng}
            entry["typ"] = r.typ
            entry["band"] = r.band
            entry["txFrequenz"] = r.tx_frequenz
            entry["rxFrequenz"] = r.rx_frequenz
            entry["shift"] = r.shift
            entry["status"] = r.status
            entry["lastUpdate"] = datetime.now(timezone.utc).date().isoformat()

            if r.ctcss:
                entry["ctcss"] = r.ctcss
            if r.dcs_code:
                entry["dcsCode"] = r.dcs_code
            if r.echolink:
                entry["echolink"] = r.echolink
            if r.dmr_id:
                entry["dmrId"] = r.dmr_id
            if r.color_code:
                entry["colorCode"] = r.color_code
            if r.dstar_module:
                entry["dstarModule"] = r.dstar_module
            if r.betreiber:
                entry["betreiber"] = r.betreiber
            if r.seehoehe:
                entry["seehöhe"] = r.seehoehe
            if r.bemerkung:
                entry["bemerkung"] = r.bemerkung
        else:
            # Create new entry
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
                "lastUpdate": datetime.now(timezone.utc).date().isoformat(),
            }

            if r.ctcss:
                merged[relais_id]["ctcss"] = r.ctcss
            if r.dcs_code:
                merged[relais_id]["dcsCode"] = r.dcs_code
            if r.echolink:
                merged[relais_id]["echolink"] = r.echolink
            if r.dmr_id:
                merged[relais_id]["dmrId"] = r.dmr_id
            if r.color_code:
                merged[relais_id]["colorCode"] = r.color_code
            if r.dstar_module:
                merged[relais_id]["dstarModule"] = r.dstar_module
            if r.betreiber:
                merged[relais_id]["betreiber"] = r.betreiber
            if r.seehoehe:
                merged[relais_id]["seehöhe"] = r.seehoehe
            if r.bemerkung:
                merged[relais_id]["bemerkung"] = r.bemerkung

    # Sort by callsign
    return sorted(merged.values(), key=lambda x: x["rufzeichen"])


def load_existing_data(filepath: Path) -> Optional[dict]:
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
        help="Skip ÖVSV scraping"
    )
    parser.add_argument(
        "--skip-repeaterbook",
        action="store_true",
        help="Skip Repeaterbook API"
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
    repeaterbook_data = []

    if not args.skip_oevsv:
        try:
            scraper = OevsvScraper()
            oevsv_data = scraper.fetch_relais()
        except Exception as e:
            logger.error(f"ÖVSV scraping failed: {e}")

    if not args.skip_repeaterbook:
        try:
            client = RepeaterbookClient()
            repeaterbook_data = client.fetch_repeaters()
        except Exception as e:
            logger.error(f"Repeaterbook fetching failed: {e}")

    # If both sources failed, try to keep existing data
    if not oevsv_data and not repeaterbook_data:
        logger.warning("No data from any source!")
        existing = load_existing_data(args.output)
        if existing:
            logger.info("Keeping existing data")
            return
        logger.error("No existing data to fall back to")
        return

    # Merge data
    merged_relais = merge_relais_data(oevsv_data, repeaterbook_data)

    # Create output structure
    output_data = {
        "relais": merged_relais,
        "lastUpdate": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
    }

    # Save
    save_data(output_data, args.output)
    logger.info("Update complete!")


if __name__ == "__main__":
    main()
