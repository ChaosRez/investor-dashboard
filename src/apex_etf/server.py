"""
ApexETF HTTP Server & REST API Engine
Serves static frontend assets and institutional REST endpoints.
"""

import http.server
import socketserver
import json
import os
import urllib.parse
from datetime import datetime, timezone
from typing import Dict, Any, List

from .config import PUBLIC_DIR, DATA_DIR, DEFAULT_PORT, DEFAULT_HOST
from .analysis import (
    calculate_portfolio_overlap,
    calculate_curvo_portfolio_simulation,
    calculate_hierarchical_risk_parity,
    calculate_equal_risk_contribution,
    calculate_mean_cvar,
    calculate_covariance_shrinkage,
    calculate_robust_portfolio_optimization,
    calculate_crisis_stress_test,
    calculate_quantstats_downside_tear_sheet,
    generate_quant_code_snippets,
    get_platforms_metadata,
    REGIME_TAXONOMY,
    REGIME_PRESETS,
    HISTORICAL_CRISES,
)
from .sync import run_full_sync

def load_json(rel_path: str):
    path = os.path.join(DATA_DIR, rel_path)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

# In-memory datasets
ETFS_DATA = load_json("etfs.json")
CORRELATIONS_DATA = load_json("correlations.json")
NEWS_DATA = load_json("news.json")
EDUCATION_DATA = load_json("education.json")
ETFS_BY_TICKER = {etf["ticker"].upper(): etf for etf in ETFS_DATA}

def reload_datasets():
    global ETFS_DATA, CORRELATIONS_DATA, NEWS_DATA, EDUCATION_DATA, ETFS_BY_TICKER
    ETFS_DATA = load_json("etfs.json")
    CORRELATIONS_DATA = load_json("correlations.json")
    NEWS_DATA = load_json("news.json")
    EDUCATION_DATA = load_json("education.json")
    ETFS_BY_TICKER = {etf["ticker"].upper(): etf for etf in ETFS_DATA}

class ETFHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def end_headers(self):
        # Static assets always revalidate (cheap 304s via Last-Modified) so a normal
        # reload picks up frontend edits instead of a heuristically cached copy.
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Always reload on API access so disk updates reflect immediately
        if path.startswith("/api/"):
            reload_datasets()

        if path == "/api/etfs":
            ticker = query.get("ticker", [None])[0]
            if ticker:
                etf = ETFS_BY_TICKER.get(ticker.upper())
                if etf:
                    self.send_json(etf)
                else:
                    self.send_json({"error": "ETF not found"}, status=404)
            else:
                self.send_json(ETFS_DATA)
            return

        elif path == "/api/correlations":
            self.send_json(CORRELATIONS_DATA)
            return

        elif path == "/api/news":
            ticker = query.get("ticker", [None])[0]
            if ticker:
                ticker_upper = ticker.upper()
                filtered = [
                    item for item in NEWS_DATA
                    if any(e.get("ticker", "").upper() == ticker_upper for e in item.get("relatedEtfs", []))
                ]
                self.send_json(filtered)
            else:
                self.send_json(NEWS_DATA)
            return

        elif path == "/api/education":
            self.send_json(EDUCATION_DATA)
            return

        elif path == "/api/portfolio/regimes":
            self.send_json({
                "taxonomy": REGIME_TAXONOMY,
                "presets": REGIME_PRESETS
            })
            return

        elif path == "/api/portfolio/platforms":
            self.send_json({
                "platforms": get_platforms_metadata()
            })
            return

        elif path == "/api/portfolio/crises":
            self.send_json({
                "crises": HISTORICAL_CRISES
            })
            return

        elif path == "/api/market-status":
            self.send_json({
                "status": "online",
                "marketStatus": "open",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "trackedEtfCount": len(ETFS_DATA),
                "trackedEtfs": len(ETFS_DATA),
                "trackedNewsCount": len(NEWS_DATA),
                "trackedAumTotal": f"{sum(e.get('aumMillionsEUR', 0) for e in ETFS_DATA) / 1000:.1f}B €",
                "sources": [
                    "justETF.com (Statutory AUM & Factsheet Specs)",
                    "extraETF.com (Broker Savings Plans & Tracking Difference)",
                    "Curvo.eu (10-Year European Monthly Backtest)",
                    "Portfolio Visualizer (Markowitz Efficient Frontier & VaR)",
                    "European Central Bank RSS (Live Monetary Policy)",
                    "Yahoo Finance (Live Market Execution)"
                ]
            })
            return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"

        try:
            body = json.loads(post_data)
        except Exception:
            body = {}

        if path in ["/api/sync", "/api/refresh"]:
            try:
                sync_res = run_full_sync()
                reload_datasets()
                self.send_json(sync_res, status=500 if "error" in sync_res else 200)
            except Exception as e:
                self.send_json({"error": f"Sync failed: {str(e)}"}, status=500)
            return

        elif path == "/api/overlap":
            weights = body.get("portfolio") or body.get("etfs")
            if isinstance(weights, list):
                equal_w = 100.0 / len(weights) if len(weights) > 0 else 0
                weights = {ticker: equal_w for ticker in weights}
            elif not isinstance(weights, dict):
                weights = {"VWCE": 60, "IWDA": 40}
            
            result = calculate_portfolio_overlap(weights, ETFS_BY_TICKER)
            self.send_json(result)
            return

        elif path == "/api/portfolio/backtest":
            result = calculate_curvo_portfolio_simulation(body, ETFS_BY_TICKER)
            self.send_json(result)
            return

        elif path == "/api/portfolio/optimize":
            tickers = body.get("tickers") or body.get("assets")
            if not tickers and isinstance(body.get("portfolio"), dict):
                tickers = list(body["portfolio"].keys())
            elif not tickers and isinstance(body.get("etfs"), list):
                tickers = body["etfs"]
            elif not tickers:
                tickers = ["VWCE", "AGGU", "XEON", "SGLD"]

            method = body.get("method", "all").lower()
            if method == "hrp":
                result = calculate_hierarchical_risk_parity(tickers, ETFS_BY_TICKER, CORRELATIONS_DATA)
            elif method in ["risk_parity", "erc"]:
                result = calculate_equal_risk_contribution(tickers, ETFS_BY_TICKER, CORRELATIONS_DATA)
            elif method == "mean_cvar":
                result = calculate_mean_cvar(tickers, ETFS_BY_TICKER)
            elif method == "shrinkage":
                result = calculate_covariance_shrinkage(tickers, ETFS_BY_TICKER, CORRELATIONS_DATA)
            else:
                result = calculate_robust_portfolio_optimization(tickers, ETFS_BY_TICKER, CORRELATIONS_DATA)

            self.send_json(result)
            return

        elif path == "/api/portfolio/stress-test":
            portfolio = body.get("portfolio") or body.get("holdings")
            if not portfolio and isinstance(body.get("assets"), list):
                eq_w = 100.0 / len(body["assets"])
                portfolio = {t: eq_w for t in body["assets"]}
            elif not portfolio or not isinstance(portfolio, dict):
                portfolio = {"VWCE": 60, "AGGU": 40}

            tolerance = float(body.get("behavioralTolerance", body.get("tolerance", -20.0)))
            result = calculate_crisis_stress_test(portfolio, ETFS_BY_TICKER, tolerance)
            self.send_json(result)
            return

        elif path in ["/api/portfolio/teardown", "/api/portfolio/tear-sheet"]:
            portfolio = body.get("portfolio") or body.get("holdings")
            if not portfolio or not isinstance(portfolio, dict):
                portfolio = {"VWCE": 60, "AGGU": 40}

            result = calculate_quantstats_downside_tear_sheet(portfolio, ETFS_BY_TICKER)
            self.send_json(result)
            return

        elif path == "/api/portfolio/code-snippets":
            portfolio = body.get("portfolio") or body.get("holdings")
            if not portfolio or not isinstance(portfolio, dict):
                portfolio = {"VWCE": 60, "AGGU": 40}

            result = generate_quant_code_snippets(portfolio)
            self.send_json(result)
            return

        self.send_json({"error": "Endpoint not found"}, status=404)

    def send_json(self, data: Any, status: int = 200):
        response_bytes = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(response_bytes)

def run_server(port: int = DEFAULT_PORT, host: str = DEFAULT_HOST):
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((host, port), ETFHandler) as httpd:
        print(f"🚀 ApexETF Dashboard Server active at http://localhost:{port}")
        print(f"📊 Serving verified datasets from: {DATA_DIR}")
        print(f"🌐 REST APIs: /api/etfs, /api/news, /api/correlations, /api/overlap, /api/portfolio/backtest, /api/sync")
        print("Press Ctrl+C to terminate.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully.")

def main():
    import argparse
    parser = argparse.ArgumentParser(description="ApexETF Dashboard Server")
    parser.add_argument("--port", "-p", type=int, default=DEFAULT_PORT, help="Port to listen on (default: 8080)")
    parser.add_argument("--host", "-H", type=str, default=DEFAULT_HOST, help="Host to bind to (default: 0.0.0.0)")
    args = parser.parse_args()
    run_server(port=args.port, host=args.host)

if __name__ == "__main__":
    main()
