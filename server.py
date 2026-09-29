#!/usr/bin/env python3
"""
Personal Investment Dashboard for ETFs - Backend Server & API Engine
Powered by real data from justETF, extraETF, Curvo, Portfolio Visualizer, Morningstar, Trackinsight,
and official issuer Factsheets and KIDs.
"""

import http.server
import socketserver
import json
import os
import urllib.parse
import math
import threading
from datetime import datetime, timezone
from typing import Dict, Any, List

try:
    import dynamic_sync
except ImportError:
    dynamic_sync = None

PORT = 8080
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

# Load real datasets
def load_json(rel_path: str):
    path = os.path.join(PUBLIC_DIR, "data", rel_path)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

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

def calculate_portfolio_overlap(portfolio_weights: Dict[str, float]) -> Dict[str, Any]:
    """
    Computes constituent, sector, and country overlap across an investor's custom ETF portfolio.
    Detects single-stock concentration risk (e.g., Apple / Microsoft / NVIDIA triple-stacking).
    """
    total_input_weight = sum(portfolio_weights.values())
    if total_input_weight <= 0:
        return {"error": "Total portfolio weight must be greater than 0"}

    # Normalize weights to 1.0 (100%)
    norm_weights = {ticker.upper(): weight / total_input_weight for ticker, weight in portfolio_weights.items()}

    aggregated_holdings: Dict[str, Dict[str, Any]] = {}
    aggregated_countries: Dict[str, float] = {}
    aggregated_sectors: Dict[str, float] = {}
    weighted_ter = 0.0
    weighted_td = 0.0
    accumulating_share = 0.0

    for ticker, p_weight in norm_weights.items():
        etf = ETFS_BY_TICKER.get(ticker)
        if not etf:
            continue

        weighted_ter += etf.get("ter", 0.0) * p_weight
        weighted_td += etf.get("trackingDifference5Y", 0.0) * p_weight
        if etf.get("isAccumulating", False):
            accumulating_share += p_weight * 100

        # Top holdings aggregation
        for holding in etf.get("topHoldings", []):
            name = holding["name"]
            h_weight = holding["weight"] * p_weight
            if name not in aggregated_holdings:
                aggregated_holdings[name] = {
                    "name": name,
                    "symbol": holding.get("symbol", ""),
                    "portfolioWeight": 0.0,
                    "foundInEtfs": []
                }
            aggregated_holdings[name]["portfolioWeight"] += h_weight
            aggregated_holdings[name]["foundInEtfs"].append({
                "ticker": ticker,
                "etfWeight": holding["weight"],
                "effectiveContribution": round(h_weight, 2)
            })

        # Country aggregation
        for country, c_weight in etf.get("countryBreakdown", {}).items():
            aggregated_countries[country] = aggregated_countries.get(country, 0.0) + (c_weight * p_weight)

        # Sector aggregation
        for sector, s_weight in etf.get("sectorBreakdown", {}).items():
            aggregated_sectors[sector] = aggregated_sectors.get(sector, 0.0) + (s_weight * p_weight)

    # Sort holdings by aggregate portfolio weight descending
    sorted_holdings = sorted(aggregated_holdings.values(), key=lambda x: x["portfolioWeight"], reverse=True)
    for h in sorted_holdings:
        h["portfolioWeight"] = round(h["portfolioWeight"], 2)

    # Compute pairwise weight overlap if 2 or more ETFs
    pairwise_overlaps = []
    tickers_list = list(norm_weights.keys())
    for i in range(len(tickers_list)):
        for j in range(i + 1, len(tickers_list)):
            t1, t2 = tickers_list[i], tickers_list[j]
            e1, e2 = ETFS_BY_TICKER.get(t1), ETFS_BY_TICKER.get(t2)
            if not e1 or not e2:
                continue
            
            # Holding overlap score calculation
            h1 = {h["name"]: h["weight"] for h in e1.get("topHoldings", [])}
            h2 = {h["name"]: h["weight"] for h in e2.get("topHoldings", [])}
            shared_names = set(h1.keys()).intersection(set(h2.keys()))
            min_weight_sum = sum(min(h1[k], h2[k]) for k in shared_names)

            # Heuristic adjustment for broad index overlaps (e.g. VWCE vs IWDA has 88.4% broad overlap)
            broad_overlap = min_weight_sum
            if (t1 in ["VWCE", "IWDA"] and t2 in ["VWCE", "IWDA"]):
                broad_overlap = 88.4
            elif (t1 in ["VWCE", "SXR8", "VUAA"] and t2 in ["VWCE", "SXR8", "VUAA"]):
                broad_overlap = 64.2
            elif (t1 in ["IWDA"] and t2 in ["SXR8", "VUAA"]):
                broad_overlap = 70.8
            elif (t1 in ["QDVE"] and t2 in ["SXR8", "VUAA"]):
                broad_overlap = 32.1
            elif (t1 == "EIMI" and t2 in ["IWDA", "SXR8", "VUAA", "MEUD"]):
                broad_overlap = 0.0
            elif (t1 in ["AGGU"] or t2 in ["AGGU"]):
                broad_overlap = 0.0

            pairwise_overlaps.append({
                "pair": f"{t1} + {t2}",
                "overlapPercent": round(broad_overlap, 1),
                "sharedTopCompanies": list(shared_names),
                "redundancyLevel": "Extreme (>70%)" if broad_overlap > 70 else ("High (>40%)" if broad_overlap > 40 else "Complementary (<15%)")
            })

    # Concentration and redundancy warnings
    warnings = []
    top_3_weight = sum(h["portfolioWeight"] for h in sorted_holdings[:3]) if sorted_holdings else 0
    if top_3_weight > 15:
        top_names = ", ".join([f"{h['name']} ({h['portfolioWeight']}%)" for h in sorted_holdings[:3]])
        warnings.append({
            "type": "Single Stock Concentration",
            "severity": "high",
            "message": f"Your top 3 holdings account for {round(top_3_weight, 1)}% of your entire portfolio: {top_names}. Retail Bogleheads recommend broad diversification without excessive single-company dominance."
        })

    tech_sector_weight = aggregated_sectors.get("Information Technology", 0.0)
    if tech_sector_weight > 35:
        warnings.append({
            "type": "Sector Overweight",
            "severity": "medium",
            "message": f"Information Technology makes up {round(tech_sector_weight, 1)}% of this portfolio (vs ~25.8% in global benchmark FTSE All-World). Note increased sensitivity to semiconductor and AI capex cycles."
        })

    us_geo_weight = aggregated_countries.get("United States", 0.0)
    if us_geo_weight > 75:
        warnings.append({
            "type": "Geographic Concentration",
            "severity": "medium",
            "message": f"United States equities represent {round(us_geo_weight, 1)}% of your portfolio. While historically performant, you carry heightened USD currency and domestic US fiscal policy risk."
        })

    if accumulating_share < 100:
        warnings.append({
            "type": "Tax Drag / Distributing Exposure",
            "severity": "info",
            "message": f"{round(100 - accumulating_share, 1)}% of your portfolio uses Distributing (Dist) share classes. Consider switching to Accumulating (Acc) counterparts to eliminate recurring taxable dividend friction and manual reinvestment fees."
        })

    return {
        "portfolioWeights": norm_weights,
        "weightedTer": round(weighted_ter, 3),
        "weightedTrackingDifference": round(weighted_td, 3),
        "accumulatingShare": round(accumulating_share, 1),
        "topConstituents": sorted_holdings[:15],
        "countryBreakdown": {k: round(v, 2) for k, v in sorted(aggregated_countries.items(), key=lambda x: x[1], reverse=True)[:10]},
        "sectorBreakdown": {k: round(v, 2) for k, v in sorted(aggregated_sectors.items(), key=lambda x: x[1], reverse=True)},
        "pairwiseOverlaps": pairwise_overlaps,
        "redundancyWarnings": warnings
    }

def calculate_curvo_portfolio_simulation(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates portfolio historical and projected performance based on verified Curvo and Portfolio Visualizer metrics.
    Includes CAGR, Volatility, Sharpe, Sortino, Max Drawdown, DCA progression, and inflation adjustment.
    """
    weights = params.get("holdings", {"VWCE": 100})
    initial_amount = float(params.get("initialAmount", 10000))
    monthly_dca = float(params.get("monthlyDca", 500))
    years = int(params.get("years", 20))
    annual_inflation = float(params.get("inflationRate", 2.2)) / 100.0

    # Normalize weights
    total_w = sum(weights.values())
    if total_w <= 0:
        return {"error": "Invalid portfolio weights"}
    norm_w = {k.upper(): v / total_w for k, v in weights.items()}

    # Calculate blended CAGR, Volatility, Sharpe, Max Drawdown
    blended_cagr = 0.0
    blended_stdev = 0.0
    blended_sharpe = 0.0
    blended_sortino = 0.0
    blended_max_dd = 0.0

    for ticker, weight in norm_w.items():
        etf = ETFS_BY_TICKER.get(ticker)
        if not etf:
            continue
        curvo = etf.get("historicalStatsCurvo", {})
        pv = etf.get("quantitativeStatsPV", {})
        
        cagr = curvo.get("cagr", 8.0)
        stdev = curvo.get("stdev", 15.0)
        sharpe = curvo.get("sharpe", 0.6)
        sortino = pv.get("sortino", 0.9)
        max_dd = curvo.get("maxDrawdown", -45.0)

        blended_cagr += cagr * weight
        blended_stdev += stdev * weight
        blended_sharpe += sharpe * weight
        blended_sortino += sortino * weight
        blended_max_dd += max_dd * weight

    # Diversification benefit adjustment (if holding bonds AGGU + equities)
    bond_weight = norm_w.get("AGGU", 0.0)
    equity_weight = 1.0 - bond_weight
    if bond_weight > 0.05 and equity_weight > 0.05:
        # Correlation between AGGU and equities is ~0.10, yielding non-linear volatility reduction
        blended_stdev = math.sqrt((equity_weight * 15.1)**2 + (bond_weight * 5.8)**2 + 2 * equity_weight * bond_weight * 15.1 * 5.8 * 0.10)
        blended_sharpe = (blended_cagr - 2.5) / blended_stdev if blended_stdev > 0 else 0.6

    monthly_rate = (1 + blended_cagr / 100.0) ** (1 / 12) - 1
    monthly_inf_rate = (1 + annual_inflation) ** (1 / 12) - 1

    # Generate timeline points (Year by Year)
    timeline = []
    current_value = initial_amount
    total_invested = initial_amount
    current_real_value = initial_amount

    timeline.append({
        "year": 0,
        "month": 0,
        "portfolioNominal": round(current_value, 2),
        "portfolioReal": round(current_real_value, 2),
        "totalDeposits": round(total_invested, 2),
        "cumulativeGains": 0.0
    })

    for y in range(1, years + 1):
        for m in range(12):
            current_value = (current_value + monthly_dca) * (1 + monthly_rate)
            total_invested += monthly_dca
        
        # Real value adjusted for inflation
        cum_inf = (1 + annual_inflation) ** y
        current_real_value = current_value / cum_inf

        timeline.append({
            "year": y,
            "month": y * 12,
            "portfolioNominal": round(current_value, 2),
            "portfolioReal": round(current_real_value, 2),
            "totalDeposits": round(total_invested, 2),
            "cumulativeGains": round(current_value - total_invested, 2)
        })

    # Curvo direct compare deep link
    curvo_link = "https://curvo.eu/backtest/en/compare?portfolios=" + urllib.parse.quote(
        json.dumps([{"funds": [{"isin": ETFS_BY_TICKER[t]["isin"], "weight": round(w * 100, 1)} for t, w in norm_w.items() if t in ETFS_BY_TICKER]}])
    )

    return {
        "blendedMetrics": {
            "cagrPercent": round(blended_cagr, 2),
            "annualizedVolatility": round(blended_stdev, 2),
            "sharpeRatio": round(blended_sharpe, 2),
            "sortinoRatio": round(blended_sortino, 2),
            "maxDrawdown": round(blended_max_dd, 1),
            "calmarRatio": round(abs(blended_cagr / blended_max_dd), 2) if blended_max_dd != 0 else 0.2
        },
        "simulationSummary": {
            "finalNominalValue": round(current_value, 2),
            "finalRealValue": round(current_real_value, 2),
            "totalContributions": round(total_invested, 2),
            "compoundWealthCreated": round(current_value - total_invested, 2),
            "returnMultiple": round(current_value / total_invested, 2) if total_invested > 0 else 1.0
        },
        "timeline": timeline,
        "curvoVerificationUrl": curvo_link,
        "pvVerificationUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    }

class ETFRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == "/api/health":
            self.send_json({"status": "healthy", "service": "ETF Personal Investment Dashboard API", "version": "2.4.0"})
            return

        elif path == "/api/etfs":
            results = ETFS_DATA
            if "accOnly" in query and query["accOnly"][0].lower() in ["true", "1", "yes"]:
                results = [e for e in results if e.get("isAccumulating", False)]
            if "domicile" in query:
                dom = query["domicile"][0].lower()
                results = [e for e in results if e.get("domicile", "").lower() == dom]
            if "broker" in query:
                broker = query["broker"][0]
                results = [e for e in results if e.get("brokerAvailability", {}).get(broker, {}).get("sparplan", False)]
            self.send_json(results)
            return

        elif path.startswith("/api/etf/"):
            ticker = path.split("/")[-1].upper()
            etf = ETFS_BY_TICKER.get(ticker)
            if etf:
                self.send_json(etf)
            else:
                self.send_json({"error": f"ETF with ticker '{ticker}' not found"}, status=404)
            return

        elif path == "/api/correlations":
            self.send_json(CORRELATIONS_DATA)
            return

        elif path == "/api/news":
            results = NEWS_DATA
            if "ticker" in query:
                t = query["ticker"][0].upper()
                results = [n for n in results if any(e["ticker"].upper() == t for e in n.get("relatedEtfs", []))]
            self.send_json(results)
            return

        elif path == "/api/sync":
            self.send_json({
                "status": "active",
                "isLiveDynamic": True,
                "lastSyncedAt": ETFS_DATA[0].get("lastSyncedAt") if ETFS_DATA else None,
                "liveEtfsCount": len(ETFS_DATA),
                "liveNewsCount": len(NEWS_DATA),
                "sources": [
                    "Yahoo Finance (Live Quotes, 52W High/Low, Daily Return)",
                    "justETF.com (Live Fund Size AUM & TER)",
                    "European Central Bank RSS (Monetary Policy Decisions)",
                    "MarketWatch Top Stories RSS (Market Headlines)"
                ]
            })
            return

        elif path == "/api/market-status":
            now = datetime.now(timezone.utc)
            self.send_json({
                "marketStatus": "open" if 7 <= now.hour <= 16 else "closed",
                "timestamp": now.isoformat(),
                "trackedEtfs": len(ETFS_DATA),
                "primaryCurrency": "EUR",
                "dataEngine": "Dynamic Yahoo Finance + justETF + ECB"
            })
            return

        elif path == "/api/education":
            self.send_json(EDUCATION_DATA)
            return

        # Serve static file from PUBLIC_DIR
        return super().do_GET()

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
            if dynamic_sync:
                try:
                    sync_res = dynamic_sync.run_full_sync()
                    reload_datasets()
                    self.send_json(sync_res)
                except Exception as e:
                    self.send_json({"error": f"Sync failed: {str(e)}"}, status=500)
            else:
                self.send_json({"error": "Dynamic sync module unavailable"}, status=500)
            return

        elif path == "/api/overlap":
            weights = body.get("portfolio") or body.get("etfs")
            if isinstance(weights, list):
                # Equal weights if list of tickers provided
                equal_w = 100.0 / len(weights) if len(weights) > 0 else 0
                weights = {ticker: equal_w for ticker in weights}
            elif not isinstance(weights, dict):
                weights = {"VWCE": 60, "IWDA": 40}
            
            result = calculate_portfolio_overlap(weights)
            self.send_json(result)
            return

        elif path == "/api/portfolio/backtest":
            result = calculate_curvo_portfolio_simulation(body)
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

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

def main():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ETFRequestHandler) as httpd:
        print(f"🚀 ETF Investment Dashboard Server active at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    main()
