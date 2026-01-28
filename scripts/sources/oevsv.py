"""
ÖVSV (Österreichischer Versuchssenderverband) Scraper

Scrapes relay data from the official ÖVSV website.
"""

import re
import logging
from typing import Optional
from dataclasses import dataclass

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


@dataclass
class RelaisInfo:
    """Parsed relay information from ÖVSV."""
    rufzeichen: str
    standort: str
    bundesland: str
    lat: float
    lng: float
    typ: str
    band: str
    tx_frequenz: float
    rx_frequenz: float
    shift: float
    ctcss: Optional[float] = None
    dcs_code: Optional[str] = None
    echolink: Optional[int] = None
    dmr_id: Optional[int] = None
    color_code: Optional[int] = None
    dstar_module: Optional[str] = None
    betreiber: Optional[str] = None
    seehoehe: Optional[int] = None
    status: str = "aktiv"
    bemerkung: Optional[str] = None


class OevsvScraper:
    """Scraper for ÖVSV relay listings."""

    BASE_URL = "https://www.oevsv.at"
    RELAIS_URL = f"{BASE_URL}/funkbetrieb/amateurfunkfrequenzen/ukw-relais"

    BUNDESLAND_MAP = {
        "W": "Wien",
        "N": "Niederösterreich",
        "O": "Oberösterreich",
        "ST": "Steiermark",
        "K": "Kärnten",
        "S": "Salzburg",
        "T": "Tirol",
        "V": "Vorarlberg",
        "B": "Burgenland",
    }

    def __init__(self, timeout: int = 30):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Relaisblick/1.0 (Amateur Radio Relay Map)"
        })

    def fetch_relais(self) -> list[RelaisInfo]:
        """Fetch all relays from ÖVSV website."""
        logger.info("Fetching relay data from ÖVSV...")

        try:
            response = self.session.get(self.RELAIS_URL, timeout=self.timeout)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch ÖVSV data: {e}")
            return []

        return self._parse_relais_page(response.text)

    def _parse_relais_page(self, html: str) -> list[RelaisInfo]:
        """Parse the relay listing HTML page."""
        soup = BeautifulSoup(html, "lxml")
        relais_list = []

        # Find relay tables (structure may vary)
        tables = soup.find_all("table", class_="relais-table")

        for table in tables:
            rows = table.find_all("tr")[1:]  # Skip header
            for row in rows:
                try:
                    relais = self._parse_row(row)
                    if relais:
                        relais_list.append(relais)
                except Exception as e:
                    logger.warning(f"Failed to parse row: {e}")

        logger.info(f"Parsed {len(relais_list)} relays from ÖVSV")
        return relais_list

    def _parse_row(self, row) -> Optional[RelaisInfo]:
        """Parse a single table row into RelaisInfo."""
        cells = row.find_all("td")
        if len(cells) < 6:
            return None

        rufzeichen = cells[0].get_text(strip=True).upper()
        if not rufzeichen.startswith("OE"):
            return None

        # Extract bundesland from callsign (OE1... = Wien, etc.)
        bl_code = self._extract_bundesland_code(rufzeichen)
        bundesland = self.BUNDESLAND_MAP.get(bl_code, "Wien")

        standort = cells[1].get_text(strip=True)

        # Parse frequencies
        tx_text = cells[2].get_text(strip=True)
        rx_text = cells[3].get_text(strip=True)

        try:
            tx_frequenz = self._parse_frequency(tx_text)
            rx_frequenz = self._parse_frequency(rx_text)
        except ValueError:
            return None

        shift = (rx_frequenz - tx_frequenz) * 1000  # Convert to kHz

        # Determine band
        band = self._determine_band(tx_frequenz)

        # Parse type (FM, DMR, D-STAR, etc.)
        typ = cells[4].get_text(strip=True).upper()
        typ = self._normalize_type(typ)

        # Parse coordinates if available
        lat, lng = self._extract_coordinates(row)

        return RelaisInfo(
            rufzeichen=rufzeichen,
            standort=standort,
            bundesland=bundesland,
            lat=lat,
            lng=lng,
            typ=typ,
            band=band,
            tx_frequenz=tx_frequenz,
            rx_frequenz=rx_frequenz,
            shift=shift,
        )

    def _extract_bundesland_code(self, rufzeichen: str) -> str:
        """Extract bundesland code from callsign."""
        match = re.match(r"OE(\d)", rufzeichen)
        if match:
            code_map = {
                "1": "W", "2": "S", "3": "N", "4": "B",
                "5": "O", "6": "ST", "7": "T", "8": "K", "9": "V"
            }
            return code_map.get(match.group(1), "W")
        return "W"

    def _parse_frequency(self, text: str) -> float:
        """Parse frequency text to MHz float."""
        # Remove common suffixes and clean
        text = re.sub(r"[MHz\s]", "", text)
        text = text.replace(",", ".")
        return float(text)

    def _determine_band(self, freq_mhz: float) -> str:
        """Determine amateur band from frequency."""
        if 28 <= freq_mhz < 30:
            return "10m"
        elif 50 <= freq_mhz < 54:
            return "6m"
        elif 144 <= freq_mhz < 148:
            return "2m"
        elif 430 <= freq_mhz < 440:
            return "70cm"
        elif 1240 <= freq_mhz < 1300:
            return "23cm"
        elif 2300 <= freq_mhz < 2450:
            return "13cm"
        elif 3400 <= freq_mhz < 3500:
            return "9cm"
        elif 5650 <= freq_mhz < 5850:
            return "6cm"
        elif 10000 <= freq_mhz < 10500:
            return "3cm"
        return "2m"  # Default

    def _normalize_type(self, typ: str) -> str:
        """Normalize relay type string."""
        typ = typ.upper()
        if "DMR" in typ:
            return "DMR"
        elif "D-STAR" in typ or "DSTAR" in typ:
            return "D-STAR"
        elif "C4FM" in typ or "FUSION" in typ:
            return "C4FM"
        elif "TETRA" in typ:
            return "TETRA"
        elif "ATV" in typ:
            return "ATV"
        elif "BAKE" in typ or "BEACON" in typ:
            return "Bake"
        return "FM"

    def _extract_coordinates(self, row) -> tuple[float, float]:
        """Extract coordinates from row data or data attributes."""
        # Check for data attributes
        lat = row.get("data-lat")
        lng = row.get("data-lng")

        if lat and lng:
            try:
                return float(lat), float(lng)
            except ValueError:
                pass

        # Default to Austria center if not found
        return 47.5, 13.5
