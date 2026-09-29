"""
ApexETF Unified Command-Line Interface (CLI)
Provides operators and investors quick commands for serving, live synchronizing,
auditing portfolio overlap, and checking system status.
"""

import argparse
import json
import os
import sys
import urllib.request
from typing import List, Dict

from . import __version__
from .config import DEFAULT_PORT, DEFAULT_HOST, DATA_DIR, WATCHLIST_TICKERS
from .server import run_server
from .sync import run_full_sync
from .analysis import calculate_portfolio_overlap

def cmd_serve(args: argparse.Namespace) -> None:
    """Run HTTP dashboard server."""
    run_server(port=args.port, host=args.host)

def cmd_sync(args: argparse.Namespace) -> None:
    """Execute live data sync engine."""
    print("=" * 65)
    print("🔄 ApexETF Real-Time Synchronization Engine")
    print(f"📊 Targets: {len(WATCHLIST_TICKERS)} European Watchlist ETFs")
    print("🌐 Ingesting: Yahoo Finance, justETF, ECB RSS, MarketWatch")
    print("=" * 65)
    
    result = run_full_sync()
    
    print("\n✅ Sync Completed Successfully!")
    print(f"⏰ Timestamp: {result.get('timestamp')}")
    print(f"📈 ETFs Processed: {result.get('etfsSynced')}")
    print(f"📰 Live News Wire Items: {result.get('liveNewsItemsFetched')}")
    print("\nETF Details:")
    for item in result.get("details", []):
        day_chg = item.get("dayChange", 0.0)
        chg_sign = "+" if day_chg >= 0 else ""
        print(f" • {item['ticker']:<5} | Price: {item.get('price', 0):>7.2f} {item.get('currency', 'EUR')} | Change: {chg_sign}{day_chg:>5.2f}% | AUM: {item.get('aumMillions', 0):>7.1f}M €")

def cmd_status(args: argparse.Namespace) -> None:
    """Check health and summary stats of ApexETF installation."""
    print("=" * 65)
    print(f"ApexETF Dashboard v{__version__} - System Status")
    print("=" * 65)
    print(f"📁 Data Directory: {DATA_DIR}")
    
    etfs_file = os.path.join(DATA_DIR, "etfs.json")
    news_file = os.path.join(DATA_DIR, "news.json")
    
    if os.path.exists(etfs_file):
        with open(etfs_file, "r", encoding="utf-8") as f:
            etfs = json.load(f)
        total_aum = sum(e.get("aumMillionsEUR", 0) for e in etfs)
        print(f"✅ etfs.json: {len(etfs)} tracked instruments | Total AUM: {total_aum / 1000:.2f}B €")
    else:
        print("❌ etfs.json missing! Run 'apex-etf sync' to generate.")

    if os.path.exists(news_file):
        with open(news_file, "r", encoding="utf-8") as f:
            news = json.load(f)
        print(f"✅ news.json: {len(news)} macro and market wire signals")
    else:
        print("❌ news.json missing! Run 'apex-etf sync' to generate.")

    # Probe running server
    server_url = f"http://localhost:{DEFAULT_PORT}/api/market-status"
    try:
        req = urllib.request.Request(server_url, headers={"User-Agent": "ApexETF-CLI"})
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            st = data.get("status") or data.get("marketStatus", "online")
            cnt = data.get("trackedEtfCount") or data.get("trackedEtfs", len(etfs) if 'etfs' in locals() else 0)
            print(f"🟢 Web Server: ONLINE at http://localhost:{DEFAULT_PORT}")
            print(f"   Status: {st} | Tracked Instruments: {cnt}")
    except Exception:
        print(f"⚪ Web Server: OFFLINE on port {DEFAULT_PORT} (start with: 'apex-etf serve')")
    print("=" * 65)

def cmd_audit(args: argparse.Namespace) -> None:
    """Audit portfolio overlap across specified ETFs."""
    etfs_file = os.path.join(DATA_DIR, "etfs.json")
    if not os.path.exists(etfs_file):
        print("❌ Data file etfs.json not found. Please run 'apex-etf sync' first.")
        sys.exit(1)

    with open(etfs_file, "r", encoding="utf-8") as f:
        etfs = json.load(f)
    etfs_by_ticker = {e["ticker"].upper(): e for e in etfs}

    weights: Dict[str, float] = {}
    if args.etfs:
        for item in args.etfs:
            if ":" in item:
                parts = item.split(":")
                t, w = parts[0].strip().upper(), float(parts[1])
                weights[t] = w
            else:
                t = item.strip().upper()
                weights[t] = 100.0 / len(args.etfs)
    else:
        # Default Core-Satellite portfolio
        weights = {"VWCE": 80.0, "QDVE": 20.0}

    print("=" * 65)
    print(f"📊 Quantitative Overlap Audit for Portfolio: {weights}")
    print("=" * 65)

    res = calculate_portfolio_overlap(weights, etfs_by_ticker)
    if "error" in res:
        print(f"❌ Error: {res['error']}")
        return

    summary = res.get("summary", {})
    print(f" • Weighted TER:           {summary.get('weightedTER', 0):.2f}%")
    print(f" • 5Y Tracking Difference: {summary.get('weightedTrackingDifference', 0):+.2f}%")
    print(f" • Accumulating Share:     {summary.get('accumulatingShare', 0):.1f}%")
    print(f" • Top 3 Stock Weight:     {summary.get('top3StockWeight', 0):.2f}%")

    top_holdings = res.get("topAggregatedHoldings", [])[:5]
    if top_holdings:
        print("\nTop Constituent Allocations:")
        for h in top_holdings:
            sources = ", ".join(f"{src['ticker']} ({src['effectiveContribution']}%)" for src in h.get("foundInEtfs", []))
            print(f" • {h['name']:<25} {h['portfolioWeight']:>5.2f}%  [via {sources}]")

    warnings = res.get("warnings", [])
    if warnings:
        print("\n⚠️ Portfolio Alerts & Redundancy Warnings:")
        for w in warnings:
            print(f" • [{w.get('level', 'ALERT').upper()}] {w.get('title')}: {w.get('message')}")

    print("=" * 65)

def main() -> None:
    parser = argparse.ArgumentParser(
        prog="apex-etf",
        description="ApexETF - European ETF Portfolio Intelligence & Real-Time Analytics"
    )
    parser.add_argument("--version", "-v", action="version", version=f"%(prog)s {__version__}")

    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: serve
    serve_parser = subparsers.add_parser("serve", help="Launch the local HTTP server & API")
    serve_parser.add_argument("--port", "-p", type=int, default=DEFAULT_PORT, help="Port to listen on (default: 8080)")
    serve_parser.add_argument("--host", "-H", type=str, default=DEFAULT_HOST, help="Host to bind to (default: 0.0.0.0)")

    # Command: sync
    subparsers.add_parser("sync", help="Synchronize live market data and news feeds")

    # Command: status
    subparsers.add_parser("status", help="Display system status and data file integrity")

    # Command: audit
    audit_parser = subparsers.add_parser("audit", help="Run portfolio overlap audit on ETFs")
    audit_parser.add_argument("etfs", nargs="*", help="List of tickers (e.g. VWCE IWDA) or weighted pairs (e.g. VWCE:70 IWDA:30)")

    args = parser.parse_args()

    if args.command == "serve":
        cmd_serve(args)
    elif args.command == "sync":
        cmd_sync(args)
    elif args.command == "status":
        cmd_status(args)
    elif args.command == "audit":
        cmd_audit(args)
    else:
        # Default behavior: run server
        cmd_serve(argparse.Namespace(port=DEFAULT_PORT, host=DEFAULT_HOST))

if __name__ == "__main__":
    main()
