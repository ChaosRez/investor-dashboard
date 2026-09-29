"""
Apex ETF Portfolio Intelligence & Real-Time European ETF Dashboard
"""

__version__ = "1.0.0"
__author__ = "Apex ETF Team"

from .config import (
    DEFAULT_PORT,
    DEFAULT_HOST,
    PUBLIC_DIR,
    DATA_DIR,
    WATCHLIST_TICKERS,
    ETF_MARKET_MAP,
)
from .analysis import (
    calculate_portfolio_overlap,
    calculate_curvo_portfolio_simulation,
)
from .sync import (
    run_full_sync,
    sync_etf_market_data,
    scrape_justetf_fund_data,
)
from .server import (
    ETFHandler,
    run_server,
)

__all__ = [
    "__version__",
    "DEFAULT_PORT",
    "DEFAULT_HOST",
    "PUBLIC_DIR",
    "DATA_DIR",
    "WATCHLIST_TICKERS",
    "ETF_MARKET_MAP",
    "calculate_portfolio_overlap",
    "calculate_curvo_portfolio_simulation",
    "run_full_sync",
    "sync_etf_market_data",
    "scrape_justetf_fund_data",
    "ETFHandler",
    "run_server",
]
