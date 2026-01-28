"""
Repeaterbook API Client

Fetches Austrian amateur radio relay data from the Repeaterbook API.
"""

import logging
from typing import Optional
from dataclasses import dataclass

import requests

logger = logging.getLogger(__name__)


@dataclass
class RepeaterInfo:
    """Parsed repeater information from Repeaterbook."""
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
    seehoehe: Optional[int] = None
    status: str = "aktiv"


class RepeaterbookClient:
    """Client for Repeaterbook API."""

    API_URL = "https://www.repeaterbook.com/api/export.php"
    COUNTRY_CODE = "at"  # Austria

    BUNDESLAND_MAP = {
        "Vienna": "Wien",
        "Lower Austria": "Niederösterreich",
        "Upper Austria": "Oberösterreich",
        "Styria": "Steiermark",
        "Carinthia": "Kärnten",
        "Salzburg": "Salzburg",
        "Tyrol": "Tirol",
        "Vorarlberg": "Vorarlberg",
        "Burgenland": "Burgenland",
    }

    def __init__(self, timeout: int = 30):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Relaisblick/1.0 (Amateur Radio Relay Map)"
        })

    def fetch_repeaters(self) -> list[RepeaterInfo]:
        """Fetch all Austrian repeaters from Repeaterbook API."""
        logger.info("Fetching repeater data from Repeaterbook...")

        params = {
            "country": self.COUNTRY_CODE,
            "format": "json"
        }

        try:
            response = self.session.get(
                self.API_URL,
                params=params,
                timeout=self.timeout
            )
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch Repeaterbook data: {e}")
            return []
        except ValueError as e:
            logger.error(f"Failed to parse Repeaterbook JSON: {e}")
            return []

        return self._parse_response(data)

    def _parse_response(self, data: dict) -> list[RepeaterInfo]:
        """Parse Repeaterbook API response."""
        repeaters = []

        results = data.get("results", [])
        if not results:
            logger.warning("No results in Repeaterbook response")
            return []

        for item in results:
            try:
                repeater = self._parse_item(item)
                if repeater:
                    repeaters.append(repeater)
            except Exception as e:
                logger.warning(f"Failed to parse Repeaterbook item: {e}")

        logger.info(f"Parsed {len(repeaters)} repeaters from Repeaterbook")
        return repeaters

    def _parse_item(self, item: dict) -> Optional[RepeaterInfo]:
        """Parse a single Repeaterbook item."""
        # Get callsign
        callsign = item.get("Callsign", "").upper()
        if not callsign or not callsign.startswith("OE"):
            return None

        # Get frequencies
        try:
            tx_freq = float(item.get("Frequency", 0))
            offset = float(item.get("Input Freq", 0)) - tx_freq
            rx_freq = tx_freq + offset
            shift = offset * 1000  # Convert to kHz
        except (ValueError, TypeError):
            return None

        if tx_freq == 0:
            return None

        # Get location
        city = item.get("Nearest City", "Unbekannt")
        state = item.get("State", "")
        bundesland = self.BUNDESLAND_MAP.get(state, self._guess_bundesland(callsign))

        # Get coordinates
        try:
            lat = float(item.get("Lat", 47.5))
            lng = float(item.get("Long", 13.5))
        except (ValueError, TypeError):
            lat, lng = 47.5, 13.5

        # Get CTCSS
        ctcss = None
        ctcss_str = item.get("PL", "")
        if ctcss_str:
            try:
                ctcss = float(ctcss_str)
            except ValueError:
                pass

        # Determine band
        band = self._determine_band(tx_freq)

        # Determine type
        typ = self._determine_type(item)

        # Get altitude
        seehoehe = None
        alt_str = item.get("Altitude", "")
        if alt_str:
            try:
                seehoehe = int(float(alt_str))
            except ValueError:
                pass

        # Determine status
        status = "aktiv" if item.get("Operational Status") == "On-air" else "unbekannt"

        return RepeaterInfo(
            rufzeichen=callsign,
            standort=city,
            bundesland=bundesland,
            lat=lat,
            lng=lng,
            typ=typ,
            band=band,
            tx_frequenz=tx_freq,
            rx_frequenz=rx_freq,
            shift=shift,
            ctcss=ctcss,
            seehoehe=seehoehe,
            status=status,
        )

    def _guess_bundesland(self, callsign: str) -> str:
        """Guess bundesland from callsign prefix."""
        if len(callsign) >= 3:
            code = callsign[2]
            code_map = {
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
            return code_map.get(code, "Wien")
        return "Wien"

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
        return "2m"

    def _determine_type(self, item: dict) -> str:
        """Determine repeater type from item data."""
        use = item.get("Use", "").upper()

        if "DMR" in use:
            return "DMR"
        elif "D-STAR" in use or "DSTAR" in use:
            return "D-STAR"
        elif "C4FM" in use or "FUSION" in use:
            return "C4FM"
        elif "TETRA" in use:
            return "TETRA"
        elif "ATV" in use:
            return "ATV"

        return "FM"
