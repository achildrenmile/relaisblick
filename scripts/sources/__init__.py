"""
Relaisblick Data Sources

This package contains scrapers and API clients for various
Austrian amateur radio relay data sources.
"""

from .oevsv import OevsvScraper
from .oe8vik import OE8VIKScraper

__all__ = ['OevsvScraper', 'OE8VIKScraper']
