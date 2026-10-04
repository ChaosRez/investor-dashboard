"""
ApexETF Dynamic Live Data Sync Engine
Fetches real-time market quotes, 52W high/low, and daily percentage returns from Yahoo Finance,
validates fund size (AUM) and TER against justETF, and streams live institutional news from the
European Central Bank (ECB) and market financial wires.
"""

import json
import os
import re
import socket
import ssl
import sys
import time
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

from .config import DATA_DIR, BASE_DIR, ETF_MARKET_MAP, WATCHLIST_TICKERS
from .macro_news import VERIFIED_MACRO_NEWS

# Yahoo answers HTTP 429 to browser-spoofing and urllib's default User-Agents, so identify honestly.
USER_AGENT = "ApexETF/1.0 (personal dashboard)"

def describe_fetch_error(exc: BaseException) -> str:
    """Short reason a request failed, suitable for showing in the Live Sync summary."""
    if isinstance(exc, urllib.error.HTTPError):
        return f"HTTP {exc.code}"
    reason = getattr(exc, "reason", exc)
    if isinstance(reason, ssl.SSLCertVerificationError):
        return "TLS certificate could not be verified"
    if isinstance(reason, (socket.timeout, TimeoutError)):
        return "timed out"
    if isinstance(reason, OSError):
        return "network unreachable"
    return type(reason).__name__

def fetch_url(url: str, timeout: int = 5, errors: Optional[List[str]] = None) -> Optional[str]:
    """GET a URL as text. Returns None on any failure; the reason is appended to `errors` when given."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode("utf-8", errors="ignore")
    except Exception as exc:
        if errors is not None:
            errors.append(describe_fetch_error(exc))
        return None

def fetch_json(url: str, timeout: int = 5, errors: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
    content = fetch_url(url, timeout, errors)
    if content:
        try:
            return json.loads(content)
        except Exception:
            if errors is not None:
                errors.append("invalid JSON")
            return None
    return None

def previous_session_close(result: Dict[str, Any]) -> Optional[float]:
    """Close of the last session *before* the latest quote.

    Yahoo's `chartPreviousClose` is the close before the whole requested range (five sessions back
    for range=5d), so using it as the base turns a daily change into a five-day change. The daily
    bars give the real prior close; the range-level fields are only a fallback.
    """
    meta = result.get("meta", {})
    stamps = result.get("timestamp") or []
    closes = ((result.get("indicators") or {}).get("quote") or [{}])[0].get("close") or []
    trade_ts = meta.get("regularMarketTime")
    if trade_ts and stamps and closes:
        trade_day = datetime.fromtimestamp(trade_ts, timezone.utc).date()
        prior = [
            c for ts, c in zip(stamps, closes)
            if c is not None and datetime.fromtimestamp(ts, timezone.utc).date() < trade_day
        ]
        if prior:
            return prior[-1]
    return meta.get("previousClose") or meta.get("chartPreviousClose")

def sync_etf_market_data(ticker: str, errors: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
    """Fetches live market quote, 52W range, and daily return from Yahoo Finance."""
    info = ETF_MARKET_MAP.get(ticker.upper())
    if not info:
        return None

    symbol = info["symbol"]
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range=5d&interval=1d"
    data = fetch_json(url, errors=errors)
    if not data or "chart" not in data or not data["chart"].get("result"):
        if data and errors is not None:
            errors.append("no chart data")
        return None

    try:
        result = data["chart"]["result"][0]
        meta = result.get("meta", {})
        price = meta.get("regularMarketPrice")
        prev_close = previous_session_close(result)

        if price is None:
            return None

        # Change calculation
        day_change = round(price - prev_close, 3) if prev_close else 0.0
        day_change_pct = round(((price - prev_close) / prev_close) * 100, 2) if prev_close else 0.0

        # High/low 52W
        w52_high = meta.get("fiftyTwoWeekHigh")
        w52_low = meta.get("fiftyTwoWeekLow")

        fetched_at = datetime.now(timezone.utc).isoformat()
        return {
            "livePrice": round(price, 3),
            "currency": meta.get("currency", "EUR"),
            "previousClose": round(prev_close, 3) if prev_close else None,
            "dayChange": day_change,
            "dayChangePercent": day_change_pct,
            "fiftyTwoWeekHigh": round(w52_high, 2) if w52_high else None,
            "fiftyTwoWeekLow": round(w52_low, 2) if w52_low else None,
            "exchange": info.get("exchange", "European Exchange"),
            "marketTime": fetched_at,
            # Same moment under the name the bundled dataset and the dashboard already use
            "lastPriceUpdated": fetched_at
        }
    except Exception:
        return None

# justETF profile markup. Current layout first, the older one as a fallback.
JUSTETF_SIZE_PATTERNS = (
    # <td data-testid="etf-basics_label_fund-size"> Fund size </td> <td> <div> EUR 53,011 m
    r'etf-basics_label_fund-size[^>]*>\s*Fund size\s*</td>\s*<td[^>]*>\s*<div[^>]*>\s*EUR\s*([0-9][0-9,.]*)\s*m\b',
    # Fund size</div><div>53,167 m EUR
    r'Fund size[^<]*</div>\s*<div[^>]*>\s*([0-9,.]+)\s*m\s*EUR',
)
JUSTETF_TER_PATTERNS = (
    # <div class="val" data-testid="tl_etf-basics_value_ter">0.14% p.a.</div>
    r'data-testid="tl_etf-basics_value_ter"[^>]*>\s*([0-9]+(?:\.[0-9]+)?)\s*%',
    # Total expense ratio</div><div>0.22% p.a.
    r'Total expense ratio[^<]*</div>\s*<div[^>]*>\s*([0-9.]+)\s*%',
)

def _first_match(patterns, html: str) -> Optional[str]:
    for pattern in patterns:
        found = re.search(pattern, html, re.IGNORECASE)
        if found:
            return found.group(1)
    return None

def scrape_justetf_fund_data(isin: str, errors: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
    """Fetches fund size and confirms expense ratio from justETF profile."""
    url = f"https://www.justetf.com/en/etf-profile.html?isin={isin}"
    html = fetch_url(url, errors=errors)
    if not html:
        return None

    result = {}
    try:
        size = _first_match(JUSTETF_SIZE_PATTERNS, html)
        if size:
            result["aumMillionsEUR"] = float(size.replace(",", ""))

        ter = _first_match(JUSTETF_TER_PATTERNS, html)
        if ter:
            result["ter"] = float(ter)

        if not result and errors is not None:
            errors.append("page layout not recognised")
        return result if result else None
    except Exception:
        return None

def sync_live_ecb_news(errors: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """Streams live monetary policy decisions and press releases from the official European Central Bank RSS."""
    url = "https://www.ecb.europa.eu/rss/press.html"
    xml_data = fetch_url(url, errors=errors)
    if not xml_data:
        return []

    items = []
    try:
        root = ET.fromstring(xml_data)
        # Handle standard RSS 2.0 or RDF
        channel = root.find("channel")
        item_nodes = channel.findall("item") if channel is not None else root.findall("{http://purl.org/rss/1.0/}item")
        
        for node in item_nodes[:5]:
            title = node.findtext("title") or node.findtext("{http://purl.org/rss/1.0/}title") or "ECB Press Release"
            link = node.findtext("link") or node.findtext("{http://purl.org/rss/1.0/}link") or "https://www.ecb.europa.eu"
            desc = node.findtext("description") or node.findtext("{http://purl.org/rss/1.0/}description") or ""
            pub_date = node.findtext("pubDate") or node.findtext("{http://purl.org/dc/elements/1.1/}date") or datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0200")

            # Determine signal level
            bias = "Watch / Neutral"
            bias_color = "var(--accent-amber)"
            impact = "High Impact (Critical)"
            impact_badge = "critical"
            timeframe = "Tactical (1–3 Months)"

            lower_title = title.lower()
            if any(k in lower_title for k in ["cut", "easing", "lower rate", "stimulus", "growth"]):
                bias = "Bullish for European Equities & Duration"
                bias_color = "var(--accent-emerald)"
            elif any(k in lower_title for k in ["hike", "inflation pressure", "tightening", "restrictive"]):
                bias = "Caution / Higher Sovereign Yields"
                bias_color = "var(--accent-rose)"

            items.append({
                "id": f"ecb-{abs(hash(title)) % 100000000}",
                "title": f"🇪🇺 ECB: {title}",
                "summary": desc[:250] + ("..." if len(desc) > 250 else ""),
                "date": pub_date,
                "source": "European Central Bank (Official RSS Feed)",
                "sourceUrl": link,
                "isLiveStream": True,
                "signal": {
                    "bias": bias,
                    "biasColor": bias_color,
                    "impact": impact,
                    "impactBadge": impact_badge,
                    "timeframe": timeframe
                },
                "relatedEtfs": [
                    {"ticker": "AGGU", "issuer": "BlackRock / iShares", "relation": "EUR-hedged bond yields track ECB benchmark deposit rates directly"},
                    {"ticker": "MEUD", "issuer": "Amundi", "relation": "European equities discount corporate borrowing costs based on ECB rate trajectory"},
                    {"ticker": "VWCE", "issuer": "Vanguard", "relation": "European macroeconomic stability impacts global composite equity valuations"},
                    {"ticker": "XEON", "issuer": "Xtrackers", "relation": "€STR overnight swap yield directly reflects ECB deposit facility decisions"},
                    {"ticker": "IMAE", "issuer": "BlackRock / iShares", "relation": "European corporate borrowing costs and equity discount rates shift with ECB policy"}
                ],
                "retailAction": "ECB policy signals should not trigger ad-hoc adjustments. Bond allocations (AGGU) automatically harvest shifting yield curves. Continue monthly automated DCA without attempting to front-run rate meetings."
            })
    except Exception:
        if errors is not None:
            errors.append("unreadable feed")

    return items

def sync_live_marketwatch_news(errors: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """Streams live market headlines from MarketWatch RSS."""
    url = "https://feeds.content.dowjones.io/public/rss/mw_topstories"
    xml_data = fetch_url(url, errors=errors)
    if not xml_data:
        return []

    items = []
    try:
        root = ET.fromstring(xml_data)
        channel = root.find("channel")
        item_nodes = channel.findall("item") if channel is not None else []
        for node in item_nodes[:7]:
            title = node.findtext("title") or "Market Update"
            link = node.findtext("link") or "https://www.marketwatch.com"
            desc = node.findtext("description") or ""
            pub_date = node.findtext("pubDate") or datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")

            bias = "Watch / Neutral"
            bias_color = "var(--accent-amber)"
            impact = "Moderate Impact"
            impact_badge = "medium"
            timeframe = "Tactical (1–4 Weeks)"

            lower_title = title.lower()
            if any(k in lower_title for k in ["record", "surge", "gain", "rally", "ai", "tech"]):
                bias = "Bullish Sentiment"
                bias_color = "var(--accent-emerald)"
            elif any(k in lower_title for k in ["drop", "fall", "slump", "fear", "recession", "war", "tariff"]):
                bias = "Caution / Volatility Spike"
                bias_color = "var(--accent-rose)"
                impact = "High Impact (Critical)"
                impact_badge = "critical"

            items.append({
                "id": f"mw-{abs(hash(title)) % 100000000}",
                "title": f"🌐 MarketWatch: {title}",
                "summary": desc[:250] + ("..." if len(desc) > 250 else ""),
                "date": pub_date,
                "source": "MarketWatch Wire Service",
                "sourceUrl": link,
                "isLiveStream": True,
                "signal": {
                    "bias": bias,
                    "biasColor": bias_color,
                    "impact": impact,
                    "impactBadge": impact_badge,
                    "timeframe": timeframe
                },
                "relatedEtfs": [
                    {"ticker": "SXR8", "issuer": "BlackRock / iShares", "relation": "US large caps reflect broader market sentiment and quarterly earnings reports"},
                    {"ticker": "VWCE", "issuer": "Vanguard", "relation": "Global equities absorb headline volatility across international trading sessions"},
                    {"ticker": "QDVE", "issuer": "BlackRock / iShares", "relation": "US tech valuations respond with high beta to market sentiment and rate shifts"},
                    {"ticker": "IUSQ", "issuer": "BlackRock / iShares", "relation": "All-world diversified equities capture aggregate global earnings momentum"}
                ],
                "retailAction": "Market noise is the enemy of compounding. Avoid buying into momentum sector spikes or panic-selling during pullbacks. Maintain total market diversification."
            })
    except Exception:
        if errors is not None:
            errors.append("unreadable feed")

    return items

def build_js_store() -> None:
    """Generates public/js/data-store.js from current JSON files to ensure offline standalone execution."""
    try:
        def read_j(name: str):
            p = os.path.join(DATA_DIR, name)
            if os.path.exists(p):
                with open(p, "r", encoding="utf-8") as f:
                    return json.load(f)
            return []

        etfs = read_j("etfs.json")
        corr = read_j("correlations.json")
        news = read_j("news.json")
        edu = read_j("education.json")

        js_content = f"""/**
 * ApexETF Grounded Data Store
 * Grounded in verified real-world metrics from justETF, extraETF, Curvo, Portfolio Visualizer,
 * Morningstar, Trackinsight, Yahoo Finance, and official issuer KIDs.
 * Last Synced: {datetime.now(timezone.utc).isoformat()}
 */

window.APEX_DATA_STORE = {{
  syncMeta: {{
    lastSyncedAt: "{datetime.now(timezone.utc).isoformat()}",
    isLiveDynamic: true,
    sources: ["Yahoo Finance", "justETF", "extraETF", "Curvo.eu", "Portfolio Visualizer", "ECB", "MarketWatch"]
  }},
  etfs: {json.dumps(etfs, indent=2)},
  correlations: {json.dumps(corr, indent=2)},
  news: {json.dumps(news, indent=2)},
  education: {json.dumps(edu, indent=2)}
}};
"""
        store_path = os.path.join(BASE_DIR, "public", "js", "data-store.js")
        with open(store_path, "w", encoding="utf-8") as f:
            f.write(js_content)
    except Exception as e:
        print(f"Error rebuilding data-store.js: {e}", file=sys.stderr)

def _top_reason(errors: List[str], default: str = "no data returned") -> str:
    """Most frequent failure reason in a list, e.g. 'HTTP 429'."""
    return Counter(errors).most_common(1)[0][0] if errors else default

def run_full_sync() -> Dict[str, Any]:
    """
    Executes a complete dynamic sync:
    1. Updates live quotes for all ETFs via Yahoo Finance.
    2. Validates AUM and TER via justETF.
    3. Streams live news from ECB RSS and MarketWatch RSS.
    4. Preserves verified macroeconomic events with transmission mechanisms.
    5. Rebuilds data-store.js.

    The result reports what actually refreshed: `status` is "success" only when every source
    delivered, "partial" when some did not (see `warnings`) and "failed" when nothing refreshed.
    """
    etfs_path = os.path.join(DATA_DIR, "etfs.json")
    if not os.path.exists(etfs_path):
        return {"error": "etfs.json not found"}

    with open(etfs_path, "r", encoding="utf-8") as f:
        etfs = json.load(f)

    updated_count = 0
    sync_details = []
    quote_errors: List[str] = []
    fund_errors: List[str] = []
    quotes_updated = 0
    quotes_failed: List[str] = []
    quotes_skipped: List[str] = []  # tickers with no Yahoo symbol configured
    fund_updated = 0
    fund_failed = 0

    for etf in etfs:
        ticker = etf["ticker"]
        isin = etf.get("isin")
        quote_updated = False

        # 1. Market Data Sync
        if ticker.upper() not in ETF_MARKET_MAP:
            quotes_skipped.append(ticker)
            market_data = None
        else:
            market_data = sync_etf_market_data(ticker, errors=quote_errors)
            if not market_data:
                quotes_failed.append(ticker)
        if market_data:
            etf["liveMarketData"] = market_data
            etf["lastSyncedAt"] = datetime.now(timezone.utc).isoformat()
            etf["currentPriceEUR"] = market_data["livePrice"]
            etf["dayChangePercent"] = market_data["dayChangePercent"]
            if market_data.get("fiftyTwoWeekHigh"):
                etf["fiftyTwoWeekHigh"] = market_data["fiftyTwoWeekHigh"]
            if market_data.get("fiftyTwoWeekLow"):
                etf["fiftyTwoWeekLow"] = market_data["fiftyTwoWeekLow"]
            quotes_updated += 1
            quote_updated = True

        # 2. justETF AUM Validation
        if isin:
            fund_data = scrape_justetf_fund_data(isin, errors=fund_errors)
            if fund_data:
                fund_updated += 1
                if "aumMillionsEUR" in fund_data and fund_data["aumMillionsEUR"] > 0:
                    etf["aumMillionsEUR"] = fund_data["aumMillionsEUR"]
                if "ter" in fund_data:
                    etf["ter"] = fund_data["ter"]
            else:
                fund_failed += 1

        updated_count += 1
        sync_details.append({
            "ticker": ticker,
            "price": etf.get("liveMarketData", {}).get("livePrice", etf.get("currentPriceEUR")),
            "currency": etf.get("liveMarketData", {}).get("currency", "EUR"),
            "dayChange": etf.get("liveMarketData", {}).get("dayChangePercent", 0.0),
            "aumMillions": etf.get("aumMillionsEUR", 0.0),
            "quoteUpdated": quote_updated
        })
        time.sleep(0.05)  # Politeness interval

    # Write updated ETFs
    with open(etfs_path, "w", encoding="utf-8") as f:
        json.dump(etfs, f, indent=2)

    # 3. Stream live news feeds
    ecb_errors: List[str] = []
    mw_errors: List[str] = []
    live_ecb = sync_live_ecb_news(errors=ecb_errors)
    live_mw = sync_live_marketwatch_news(errors=mw_errors)
    live_news_items = live_ecb + live_mw

    news_path = os.path.join(DATA_DIR, "news.json")
    combined_news = live_news_items + VERIFIED_MACRO_NEWS

    with open(news_path, "w", encoding="utf-8") as f:
        json.dump(combined_news, f, indent=2)

    # Rebuild data-store.js
    build_js_store()

    # What actually worked, in words the dashboard can show as-is
    warnings: List[str] = []
    quote_targets = len(etfs) - len(quotes_skipped)
    if quotes_failed:
        warnings.append(f"Yahoo Finance: {len(quotes_failed)} of {quote_targets} price requests failed ({_top_reason(quote_errors)}).")
    if fund_failed:
        warnings.append(f"justETF: fund size and TER unavailable for {fund_failed} of {fund_updated + fund_failed} funds ({_top_reason(fund_errors)}).")
    if not live_ecb:
        warnings.append(f"ECB feed: no headlines ({_top_reason(ecb_errors)}).")
    if not live_mw:
        warnings.append(f"MarketWatch feed: no headlines ({_top_reason(mw_errors)}).")

    sources = []
    if quotes_updated:
        sources.append("Yahoo Finance (Live Market Quotes, 52W High/Low, Daily Change)")
    if fund_updated:
        sources.append("justETF.com (Live Fund Size AUM & TER Verification)")
    if live_ecb:
        sources.append("European Central Bank RSS (Live Monetary Policy & Rate Guidelines)")
    if live_mw:
        sources.append("MarketWatch RSS (Real-Time Equity & Earnings Headlines)")

    refreshed_anything = bool(quotes_updated or fund_updated or live_news_items)
    return {
        "status": "failed" if not refreshed_anything else "partial" if warnings else "success",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "etfsSynced": updated_count,  # ETFs processed; see quotesUpdated for how many prices refreshed
        "quotesUpdated": quotes_updated,
        "quotesFailed": quotes_failed,
        "quotesSkipped": quotes_skipped,
        "fundDataUpdated": fund_updated,
        "liveNewsItemsFetched": len(live_news_items),
        "newsSources": {"ecb": len(live_ecb), "marketwatch": len(live_mw)},
        "warnings": warnings,
        "sources": sources,
        "details": sync_details
    }

def main() -> None:
    print("🚀 Starting ApexETF Dynamic Live Sync...")
    res = run_full_sync()
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    main()
