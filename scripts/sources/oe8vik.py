"""
OE8VIK Digital Repeater Scraper

Fetches DMR, D-STAR, and C4FM repeater data from OE8VIK's websites:
- dmraustria.at
- dstaraustria.at
- c4fmaustria.at
"""

import re
import logging
from typing import Optional
from dataclasses import dataclass

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


@dataclass
class DigitalRelaisInfo:
    """Parsed digital relay information from OE8VIK sites."""
    rufzeichen: str
    standort: str
    typ: str  # DMR, D-STAR, C4FM
    band: str
    tx_frequenz: float
    rx_frequenz: float
    shift: float
    network: Optional[str] = None  # IPSC2, Brandmeister, etc.
    module: Optional[str] = None  # D-STAR module
    reflector: Optional[str] = None
    status: str = "aktiv"


class OE8VIKScraper:
    """Scraper for OE8VIK digital repeater websites."""

    DMR_URL = "https://dmraustria.at/relaisliste/"
    DSTAR_URL = "https://dstaraustria.at/relaisliste/"
    C4FM_URL = "https://c4fmaustria.at/relaisliste-c4fm-oesterreich/"

    def __init__(self, timeout: int = 30):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Relaisblick/1.0 (Amateur Radio Relay Map)",
        })

    def fetch_all(self) -> list[DigitalRelaisInfo]:
        """Fetch all digital repeaters from all OE8VIK sites."""
        all_relais = []

        # Fetch DMR
        dmr_relais = self.fetch_dmr()
        all_relais.extend(dmr_relais)

        # Fetch D-STAR
        dstar_relais = self.fetch_dstar()
        all_relais.extend(dstar_relais)

        # Fetch C4FM
        c4fm_relais = self.fetch_c4fm()
        all_relais.extend(c4fm_relais)

        logger.info(f"Total from OE8VIK: {len(all_relais)} digital repeaters")
        return all_relais

    def fetch_dmr(self) -> list[DigitalRelaisInfo]:
        """Fetch DMR repeaters from dmraustria.at."""
        logger.info("Fetching DMR data from dmraustria.at...")

        try:
            response = self.session.get(self.DMR_URL, timeout=self.timeout)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch DMR data: {e}")
            return []

        return self._parse_dmr_page(response.text)

    def fetch_dstar(self) -> list[DigitalRelaisInfo]:
        """Fetch D-STAR repeaters from dstaraustria.at."""
        logger.info("Fetching D-STAR data from dstaraustria.at...")

        try:
            response = self.session.get(self.DSTAR_URL, timeout=self.timeout)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch D-STAR data: {e}")
            return []

        return self._parse_dstar_page(response.text)

    def fetch_c4fm(self) -> list[DigitalRelaisInfo]:
        """Fetch C4FM repeaters from c4fmaustria.at."""
        logger.info("Fetching C4FM data from c4fmaustria.at...")

        try:
            response = self.session.get(self.C4FM_URL, timeout=self.timeout)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch C4FM data: {e}")
            return []

        return self._parse_c4fm_page(response.text)

    def _parse_dmr_page(self, html: str) -> list[DigitalRelaisInfo]:
        """Parse DMR repeater page."""
        soup = BeautifulSoup(html, "lxml")
        relais_list = []

        # Find table rows
        tables = soup.find_all("table")
        for table in tables:
            rows = table.find_all("tr")
            for row in rows:
                cells = row.find_all(["td", "th"])
                if len(cells) >= 3:
                    relais = self._parse_dmr_row(cells)
                    if relais:
                        relais_list.append(relais)

        logger.info(f"Parsed {len(relais_list)} DMR repeaters")
        return relais_list

    def _parse_dmr_row(self, cells) -> Optional[DigitalRelaisInfo]:
        """Parse a DMR table row."""
        try:
            # Extract text from cells
            texts = [cell.get_text(strip=True) for cell in cells]

            # Look for callsign pattern
            callsign = None
            location = None
            freq = None
            network = None

            for i, text in enumerate(texts):
                if re.match(r"OE\d[A-Z]{2,3}", text.upper()):
                    callsign = text.upper()
                    if i + 1 < len(texts):
                        location = texts[i + 1]
                elif "MHz" in text or re.match(r"\d{3}\.\d+", text):
                    freq = text
                elif text in ["IPSC2", "Brandmeister", "IPSC2/Brandmeister"]:
                    network = text

            if not callsign or not freq:
                return None

            # Parse frequency
            freq_match = re.search(r"(\d{3}\.?\d*)", freq)
            if not freq_match:
                return None

            tx_freq = float(freq_match.group(1))

            # Determine band and shift
            if tx_freq > 430:
                band = "70cm"
                shift = -7600
                rx_freq = tx_freq - 7.6
            else:
                band = "2m"
                shift = -600
                rx_freq = tx_freq - 0.6

            return DigitalRelaisInfo(
                rufzeichen=callsign,
                standort=location or "Unbekannt",
                typ="DMR",
                band=band,
                tx_frequenz=tx_freq,
                rx_frequenz=rx_freq,
                shift=shift,
                network=network,
            )
        except Exception as e:
            logger.debug(f"Failed to parse DMR row: {e}")
            return None

    def _parse_dstar_page(self, html: str) -> list[DigitalRelaisInfo]:
        """Parse D-STAR repeater page."""
        soup = BeautifulSoup(html, "lxml")
        relais_list = []

        tables = soup.find_all("table")
        for table in tables:
            rows = table.find_all("tr")
            for row in rows:
                cells = row.find_all(["td", "th"])
                if len(cells) >= 3:
                    relais = self._parse_dstar_row(cells)
                    if relais:
                        relais_list.append(relais)

        logger.info(f"Parsed {len(relais_list)} D-STAR repeaters")
        return relais_list

    def _parse_dstar_row(self, cells) -> Optional[DigitalRelaisInfo]:
        """Parse a D-STAR table row."""
        try:
            texts = [cell.get_text(strip=True) for cell in cells]

            callsign = None
            location = None
            tx_freq = None
            module = None
            reflector = None

            for i, text in enumerate(texts):
                if re.match(r"OE\d[A-Z]{2,3}", text.upper()):
                    callsign = text.upper()
                    if i + 1 < len(texts):
                        location = texts[i + 1]
                elif "MHz" in text or re.match(r"^\d{3}\.\d+", text):
                    # Extract frequency number from text like "438.525 MHz -7.6"
                    freq_match = re.search(r"(\d{3}\.?\d*)", text)
                    if freq_match and tx_freq is None:
                        tx_freq = float(freq_match.group(1))
                elif text in ["A", "B", "C"]:
                    module = text
                elif re.match(r"(DCS|REF|XRF|XLX)\d+", text.upper()):
                    reflector = text.upper()

            if not callsign or not tx_freq:
                return None

            # Determine band and shift
            if tx_freq > 1000:
                band = "23cm"
                shift = -28000
                rx_freq = tx_freq - 28.0
            elif tx_freq > 430:
                band = "70cm"
                shift = -7600
                rx_freq = tx_freq - 7.6
            elif tx_freq > 144:
                band = "2m"
                shift = -600
                rx_freq = tx_freq - 0.6
            else:
                band = "2m"
                shift = 0
                rx_freq = tx_freq  # Simplex

            return DigitalRelaisInfo(
                rufzeichen=callsign,
                standort=location or "Unbekannt",
                typ="D-STAR",
                band=band,
                tx_frequenz=tx_freq,
                rx_frequenz=rx_freq,
                shift=shift,
                module=module,
                reflector=reflector,
            )
        except Exception as e:
            logger.debug(f"Failed to parse D-STAR row: {e}")
            return None

    def _parse_c4fm_page(self, html: str) -> list[DigitalRelaisInfo]:
        """Parse C4FM repeater page."""
        soup = BeautifulSoup(html, "lxml")
        relais_list = []

        tables = soup.find_all("table")
        for table in tables:
            rows = table.find_all("tr")
            for row in rows:
                cells = row.find_all(["td", "th"])
                if len(cells) >= 3:
                    relais = self._parse_c4fm_row(cells)
                    if relais:
                        relais_list.append(relais)

        logger.info(f"Parsed {len(relais_list)} C4FM repeaters")
        return relais_list

    def _parse_c4fm_row(self, cells) -> Optional[DigitalRelaisInfo]:
        """Parse a C4FM table row."""
        try:
            texts = [cell.get_text(strip=True) for cell in cells]

            callsign = None
            location = None
            tx_freq = None
            network = None

            for i, text in enumerate(texts):
                if re.match(r"OE\d[A-Z]{2,3}", text.upper()):
                    callsign = text.upper()
                    if i + 1 < len(texts):
                        location = texts[i + 1]
                elif "MHz" in text or re.match(r"^\d{3}\.\d+", text):
                    # Extract frequency number from text like "438.425 MHz -7.6"
                    freq_match = re.search(r"(\d{2,3}\.?\d*)", text)
                    if freq_match and tx_freq is None:
                        tx_freq = float(freq_match.group(1))
                elif "YCS" in text.upper() or "WIRES" in text.upper() or "YSF" in text.upper():
                    network = text

            if not callsign or not tx_freq:
                return None

            # Determine band and shift
            if tx_freq > 430:
                band = "70cm"
                shift = -7600
                rx_freq = tx_freq - 7.6
            else:
                band = "2m"
                shift = -600
                rx_freq = tx_freq - 0.6

            return DigitalRelaisInfo(
                rufzeichen=callsign,
                standort=location or "Unbekannt",
                typ="C4FM",
                band=band,
                tx_frequenz=tx_freq,
                rx_frequenz=rx_freq,
                shift=shift,
                network=network,
            )
        except Exception as e:
            logger.debug(f"Failed to parse C4FM row: {e}")
            return None
