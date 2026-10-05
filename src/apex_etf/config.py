"""
ApexETF Configuration & Constants
"""

import os
from typing import Dict, Any, List

# Directory Paths
PACKAGE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.dirname(PACKAGE_DIR)
BASE_DIR = os.path.dirname(SRC_DIR) if os.path.basename(SRC_DIR) == "src" else SRC_DIR
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
DATA_DIR = os.path.join(PUBLIC_DIR, "data")

DEFAULT_PORT = 8080
DEFAULT_HOST = "0.0.0.0"

# Watchlist Tickers
WATCHLIST_TICKERS: List[str] = [
    "XEON", "AII", "WTAI", "BATT", "RARE", "XCS6", "IMAE", "IUSQ", "SXR8", "VHYL"
]

# Market Data Symbol Mapping (Yahoo Finance European Quotes)
ETF_MARKET_MAP: Dict[str, Dict[str, str]] = {
    "VWCE": {"symbol": "VWCE.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00BK5BQT80"},
    "IWDA": {"symbol": "IWDA.AS", "exchange": "Euronext Amsterdam", "isin": "IE00B4L5Y983"},
    "SXR8": {"symbol": "SXR8.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00B5BMR087"},
    "VUAA": {"symbol": "VUAA.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00BFMXXD54"},
    "EIMI": {"symbol": "EMIM.AS", "exchange": "Euronext Amsterdam", "isin": "IE00BKM4GZ66"},
    "MEUD": {"symbol": "MEUD.PA", "exchange": "Euronext Paris", "isin": "LU0908500753"},
    "QDVE": {"symbol": "QDVE.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00B3WJKG14"},
    # EUNA is the EUR-hedged (Acc) class the dataset describes; AGGU.L is the USD-hedged class, quoted in USD.
    "AGGU": {"symbol": "EUNA.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00BDBRDM35"},
    "IUSN": {"symbol": "IUSN.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00BF4RFH31"},
    "VUSA": {"symbol": "VUSA.AS", "exchange": "Euronext Amsterdam", "isin": "IE00B3XXRP09"},
    # The London lines of GGRA and RARE quote in USD; these are their EUR lines.
    "GGRA": {"symbol": "GGRA.MI", "exchange": "Borsa Italiana (Milan)", "isin": "IE00BZ56SW52"},
    "FWRA": {"symbol": "FWIA.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE000716YHJ7"},
    "BATT": {"symbol": "BATE.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00BF0M2Z96"},
    "RARE": {"symbol": "RARE.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE000KHX9DX6"},
    "IUSQ": {"symbol": "IUSQ.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00B6R52259"},
    "IMAE": {"symbol": "IMAE.AS", "exchange": "Euronext Amsterdam", "isin": "IE00B4K48X80"},
    # XCHA is the CSI 300 Swap 1C fund (LU0779800910); RQFI.DE is a different fund (Harvest CSI300 1D).
    "XCS6": {"symbol": "XCHA.DE", "exchange": "XETRA (Frankfurt)", "isin": "LU0779800910"},
    "XEON": {"symbol": "XEON.DE", "exchange": "XETRA (Frankfurt)", "isin": "LU0290358497"},
    "VHYL": {"symbol": "VGWD.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00B8GKDB10"},
    "AII":  {"symbol": "AIFS.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE000X59ZHE2"},
    # 2B76.DE is iShares Automation & Robotics, not this fund; Yahoo's EUR line for WTAI is Milan.
    "WTAI": {"symbol": "WTAI.MI", "exchange": "Borsa Italiana (Milan)", "isin": "IE00BDVPNG13"},
    # Invesco Physical Gold ETC. Yahoo lists it on XETRA as 8PSG.DE (EUR, matching the dashboard's
    # EUR figures); SGLD.L is the USD line and SGLD.MI the Milan EUR line (both quote the same NAV).
    "SGLD": {"symbol": "8PSG.DE", "exchange": "XETRA (Frankfurt)", "isin": "IE00B579F325"}
}
