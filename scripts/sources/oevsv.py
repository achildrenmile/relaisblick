"""
ÖVSV (Österreichischer Versuchssenderverband) API Client

Fetches relay data from the official ÖVSV repeater API.
"""

import logging
from typing import Optional
from dataclasses import dataclass

import requests

logger = logging.getLogger(__name__)


@dataclass
class RelaisInfo:
    """Parsed relay information from ÖVSV API."""
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
    """Client for ÖVSV repeater API."""

    API_URL = "https://repeater.oevsv.at/api/trx_list"

    BUNDESLAND_MAP = {
        "Wien": "Wien",
        "Niederösterreich": "Niederösterreich",
        "Oberösterreich": "Oberösterreich",
        "Steiermark": "Steiermark",
        "Kärnten": "Kärnten",
        "Salzburg": "Salzburg",
        "Tirol": "Tirol",
        "Vorarlberg": "Vorarlberg",
        "Burgenland": "Burgenland",
    }

    def __init__(self, timeout: int = 30):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Relaisblick/1.0 (Amateur Radio Relay Map)",
            "Accept": "application/json",
        })

    def fetch_relais(self) -> list[RelaisInfo]:
        """Fetch all relays from ÖVSV API."""
        logger.info("Fetching relay data from ÖVSV API...")

        try:
            response = self.session.get(self.API_URL, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch ÖVSV data: {e}")
            return []
        except ValueError as e:
            logger.error(f"Failed to parse ÖVSV JSON: {e}")
            return []

        return self._parse_response(data)

    def _parse_response(self, data: list) -> list[RelaisInfo]:
        """Parse API response into RelaisInfo objects."""
        relais_list = []

        for item in data:
            try:
                relais = self._parse_item(item)
                if relais:
                    relais_list.append(relais)
            except Exception as e:
                logger.warning(f"Failed to parse item {item.get('callsign', 'unknown')}: {e}")

        logger.info(f"Parsed {len(relais_list)} relays from ÖVSV API")
        return relais_list

    def _parse_item(self, item: dict) -> Optional[RelaisInfo]:
        """Parse a single API item into RelaisInfo."""
        # Get callsign
        callsign = item.get("callsign", "").upper()
        if not callsign or not callsign.startswith("OE"):
            return None

        # Skip digipeaters and beacons for now (focus on voice repeaters)
        station_type = item.get("type_of_station", "")
        if station_type in ("digipeater", "beacon"):
            return None

        # Get frequencies
        tx_freq = item.get("frequency_tx")
        rx_freq = item.get("frequency_rx")

        if not tx_freq or not rx_freq:
            return None

        try:
            tx_freq = float(tx_freq)
            rx_freq = float(rx_freq)
        except (ValueError, TypeError):
            return None

        # Calculate shift in kHz
        shift = (rx_freq - tx_freq) * 1000

        # Get location
        standort = item.get("site_name", "Unbekannt")
        city = item.get("city", "")
        if city and city != standort:
            standort = f"{standort}, {city}"

        # Get bundesland
        bundesland = item.get("bl", "Wien")
        bundesland = self.BUNDESLAND_MAP.get(bundesland, bundesland)

        # Get coordinates
        lat = item.get("latitude")
        lng = item.get("longitude")
        if not lat or not lng:
            return None

        try:
            lat = float(lat)
            lng = float(lng)
        except (ValueError, TypeError):
            return None

        # Determine band
        band = item.get("band", "")
        band = self._normalize_band(band)

        # Determine type
        typ = self._determine_type(item)

        # Get CTCSS
        ctcss = None
        ctcss_tx = item.get("ctcss_tx")
        if ctcss_tx:
            try:
                ctcss = float(ctcss_tx)
            except (ValueError, TypeError):
                pass

        # Get EchoLink
        echolink = None
        echolink_id = item.get("echolink_id")
        if echolink_id:
            try:
                echolink = int(echolink_id)
            except (ValueError, TypeError):
                pass

        # Get DMR ID
        dmr_id = None
        digital_id = item.get("digital_id")
        if digital_id and item.get("dmr"):
            try:
                dmr_id = int(digital_id)
            except (ValueError, TypeError):
                pass

        # Get altitude
        seehoehe = None
        sea_level = item.get("sea_level")
        if sea_level:
            try:
                seehoehe = int(sea_level)
            except (ValueError, TypeError):
                pass

        # Determine status
        status_str = item.get("status", "").lower()
        if status_str == "active":
            status = "aktiv"
        elif status_str in ("inactive", "off"):
            status = "inaktiv"
        else:
            status = "unbekannt"

        # Get sysop/operator
        betreiber = item.get("sysop")

        # Get comment
        bemerkung = item.get("comment")

        return RelaisInfo(
            rufzeichen=callsign,
            standort=standort,
            bundesland=bundesland,
            lat=lat,
            lng=lng,
            typ=typ,
            band=band,
            tx_frequenz=tx_freq,
            rx_frequenz=rx_freq,
            shift=shift,
            ctcss=ctcss,
            echolink=echolink,
            dmr_id=dmr_id,
            betreiber=betreiber,
            seehoehe=seehoehe,
            status=status,
            bemerkung=bemerkung,
        )

    def _normalize_band(self, band: str) -> str:
        """Normalize band string."""
        band = band.lower().strip()
        band_map = {
            "10m": "10m",
            "6m": "6m",
            "2m": "2m",
            "70cm": "70cm",
            "23cm": "23cm",
            "13cm": "13cm",
            "9cm": "9cm",
            "6cm": "6cm",
            "3cm": "3cm",
        }
        return band_map.get(band, band)

    def _determine_type(self, item: dict) -> str:
        """Determine relay type from item data."""
        # Check for digital modes
        if item.get("dmr"):
            return "DMR"
        if item.get("dstar"):
            return "D-STAR"
        if item.get("c4fm"):
            return "C4FM"
        if item.get("tetra"):
            return "TETRA"

        # Check station type
        station_type = item.get("type_of_station", "").lower()
        if "atv" in station_type:
            return "ATV"
        if "beacon" in station_type or "bake" in station_type:
            return "Bake"

        # Check for FM
        if item.get("fm"):
            return "FM"

        # Check other_mode
        if item.get("other_mode"):
            other_name = item.get("other_mode_name", "").upper()
            if "DMR" in other_name:
                return "DMR"
            if "DSTAR" in other_name or "D-STAR" in other_name:
                return "D-STAR"
            if "C4FM" in other_name or "FUSION" in other_name:
                return "C4FM"

        # Default to FM for voice repeaters
        return "FM"
