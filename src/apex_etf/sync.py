"""
ApexETF Dynamic Live Data Sync Engine
Fetches real-time market quotes, 52W high/low, and daily percentage returns from Yahoo Finance,
validates fund size (AUM) and TER against justETF, and streams live institutional news from the
European Central Bank (ECB) and market financial wires.
"""

import hashlib
import json
import os
import re
import socket
import ssl
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from typing import Dict, Any, Iterator, List, Optional, Tuple

from .config import DATA_DIR, BASE_DIR, ETF_MARKET_MAP, WATCHLIST_TICKERS
from .macro_news import VERIFIED_MACRO_NEWS

# Yahoo answers HTTP 429 to browser-spoofing and urllib's default User-Agents, so identify honestly.
USER_AGENT = "ApexETF/1.0 (personal dashboard)"

ECB_SOURCE = "European Central Bank (Official RSS Feed)"
MARKETWATCH_SOURCE = "MarketWatch Wire Service"

# Headlines a feed stops delivering are kept (marked stale) for this long, then dropped.
STALE_NEWS_MAX_AGE_DAYS = 7

# Other CA bundles to try *after* the default trust store rejects a certificate, e.g. an out-of-date
# system bundle that lacks a newer root such as Sectigo's. Verification is never switched off.
CA_BUNDLE_FALLBACKS = (
    "/opt/homebrew/etc/ca-certificates/cert.pem",  # Homebrew, Apple Silicon
    "/usr/local/etc/ca-certificates/cert.pem",     # Homebrew, Intel
    "/etc/ssl/cert.pem",
    "/etc/pki/tls/certs/ca-bundle.crt",            # RHEL / Fedora
    "/etc/ssl/certs/ca-certificates.crt",          # Debian / Ubuntu
)

_logged_fallbacks = set()

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

def _is_cert_failure(exc: BaseException) -> bool:
    return isinstance(getattr(exc, "reason", exc), ssl.SSLCertVerificationError)

def _fallback_ssl_contexts() -> Iterator[Tuple[str, ssl.SSLContext]]:
    """(bundle path, verifying context) for each other CA bundle on this machine, certifi first.

    Every context requires a valid certificate chain and a matching hostname; only the set of
    trusted roots differs from the default context.
    """
    candidates: List[str] = []
    try:
        import certifi  # optional: used when installed, never required
        candidates.append(certifi.where())
    except ImportError:
        pass
    candidates.extend(CA_BUNDLE_FALLBACKS)

    default_cafile = ssl.get_default_verify_paths().cafile
    seen = {os.path.realpath(default_cafile)} if default_cafile else set()  # symlinks: /etc/ssl/cert.pem
    for path in candidates:
        real = os.path.realpath(path)
        if real in seen or not os.path.isfile(path):
            continue
        seen.add(real)
        try:
            yield path, ssl.create_default_context(cafile=path)
        except (OSError, ssl.SSLError):
            continue

def _http_get(url: str, timeout: int, context: Optional[ssl.SSLContext] = None) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    kwargs: Dict[str, Any] = {"timeout": timeout}
    if context is not None:
        kwargs["context"] = context
    with urllib.request.urlopen(req, **kwargs) as resp:
        return resp.read().decode("utf-8", errors="ignore")

def fetch_url(url: str, timeout: int = 5, errors: Optional[List[str]] = None) -> Optional[str]:
    """GET a URL as text. Returns None on any failure; the reason is appended to `errors` when given.

    If the default trust store rejects the server's certificate, other CA bundles are tried before
    giving up (see CA_BUNDLE_FALLBACKS). A certificate no bundle can verify is still refused, and
    setting APEX_STRICT_TLS=1 turns the fallback off so only the default trust store is used.
    """
    try:
        return _http_get(url, timeout)
    except Exception as exc:
        failure = exc
        if _is_cert_failure(exc) and not os.environ.get("APEX_STRICT_TLS"):
            for path, context in _fallback_ssl_contexts():
                try:
                    body = _http_get(url, timeout, context)
                except Exception as retry_exc:
                    failure = retry_exc
                    if not _is_cert_failure(retry_exc):
                        break
                    continue
                host = urllib.parse.urlparse(url).hostname
                if (host, path) not in _logged_fallbacks:
                    _logged_fallbacks.add((host, path))
                    print(f"[sync] The default CA bundle rejected {host}; verified it against {path} instead.", file=sys.stderr)
                return body
        if errors is not None:
            errors.append(describe_fetch_error(failure))
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

        # The dashboard shows EUR. A quote in another currency means the symbol points at another
        # listing or share class (AGGU.L is the USD-hedged class of a EUR-hedged fund), so refuse it.
        currency = meta.get("currency") or "EUR"
        if currency != "EUR":
            if errors is not None:
                errors.append(f"{symbol} is quoted in {currency}, not EUR")
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
            "currency": currency,
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

def _stable_id(prefix: str, title: str) -> str:
    """Same headline, same id on every run. (The built-in hash() is salted per process, so ids built
    from it changed on each restart and could never be matched against a previous sync.)"""
    return f"{prefix}-{int(hashlib.sha1(title.encode('utf-8')).hexdigest()[:8], 16) % 100000000}"

def sync_live_ecb_news(errors: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """Streams live monetary policy decisions and press releases from the official European Central Bank RSS."""
    url = "https://www.ecb.europa.eu/rss/press.html"
    xml_data = fetch_url(url, errors=errors)
    if not xml_data:
        return []

    items = []
    fetched_at = datetime.now(timezone.utc).isoformat()
    try:
        root = ET.fromstring(xml_data)
        # Handle standard RSS 2.0 or RDF
        channel = root.find("channel")
        item_nodes = channel.findall("item") if channel is not None else root.findall("{http://purl.org/rss/1.0/}item")
        
        for node in item_nodes[:5]:
            title = (node.findtext("title") or node.findtext("{http://purl.org/rss/1.0/}title") or "ECB Press Release").strip()
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
                "id": _stable_id("ecb", title),
                "title": f"🇪🇺 ECB: {title}",
                "summary": desc[:250] + ("..." if len(desc) > 250 else ""),
                "date": pub_date,
                "source": ECB_SOURCE,
                "sourceUrl": link,
                "isLiveStream": True,
                "fetchedAt": fetched_at,
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
    fetched_at = datetime.now(timezone.utc).isoformat()
    try:
        root = ET.fromstring(xml_data)
        channel = root.find("channel")
        item_nodes = channel.findall("item") if channel is not None else []
        for node in item_nodes[:7]:
            title = (node.findtext("title") or "Market Update").strip()
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
                "id": _stable_id("mw", title),
                "title": f"🌐 MarketWatch: {title}",
                "summary": desc[:250] + ("..." if len(desc) > 250 else ""),
                "date": pub_date,
                "source": MARKETWATCH_SOURCE,
                "sourceUrl": link,
                "isLiveStream": True,
                "fetchedAt": fetched_at,
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

def _write_text_atomic(path: str, text: str) -> None:
    """Write `text` to `path` so a concurrent reader (the server runs threaded) sees either the old
    file or the new one, never a half-written file: write a temp file next to it, then rename."""
    directory = os.path.dirname(path) or "."
    fd, tmp_path = tempfile.mkstemp(dir=directory, prefix=os.path.basename(path) + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(text)
        try:
            mode = os.stat(path).st_mode & 0o777
        except FileNotFoundError:
            mode = 0o644
        os.chmod(tmp_path, mode)
        os.replace(tmp_path, path)
    except BaseException:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
        raise

def _write_json_atomic(path: str, data: Any) -> None:
    # Serialise first: a TypeError must leave the existing file untouched.
    _write_text_atomic(path, json.dumps(data, indent=2))

def build_js_store() -> None:
    """Generates public/js/data-store.js from current JSON files to ensure offline standalone execution."""
    try:
        def read_j(name: str, default: Any = None):
            p = os.path.join(DATA_DIR, name)
            if os.path.exists(p):
                with open(p, "r", encoding="utf-8") as f:
                    return json.load(f)
            return [] if default is None else default

        etfs = read_j("etfs.json")
        corr = read_j("correlations.json")
        news = read_j("news.json")
        edu = read_j("education.json")
        planner = read_j("planner.json", {})
        planner_risk = read_j("planner-risk.json", {})

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
  education: {json.dumps(edu, indent=2)},
  planner: {json.dumps(planner, indent=2)},
  plannerRisk: {json.dumps(planner_risk, indent=2)}
}};
"""
        store_path = os.path.join(BASE_DIR, "public", "js", "data-store.js")
        _write_text_atomic(store_path, js_content)
    except Exception as e:
        print(f"Error rebuilding data-store.js: {e}", file=sys.stderr)

def _top_reason(errors: List[str], default: str = "no data returned") -> str:
    """Most frequent failure reason in a list, e.g. 'HTTP 429'."""
    return Counter(errors).most_common(1)[0][0] if errors else default

def _parse_when(raw: Any) -> Optional[datetime]:
    """Parse an RSS (RFC 822) or ISO 8601 timestamp into an aware datetime; None if it is neither."""
    if not raw or not isinstance(raw, str):
        return None
    try:
        when = parsedate_to_datetime(raw)
    except (TypeError, ValueError, IndexError):
        try:
            when = datetime.fromisoformat(raw)
        except ValueError:
            return None
    return when if when.tzinfo else when.replace(tzinfo=timezone.utc)

def merge_live_news(
    previous: List[Dict[str, Any]],
    fresh_by_source: Dict[str, List[Dict[str, Any]]],
    now: Optional[datetime] = None,
    max_age_days: int = STALE_NEWS_MAX_AGE_DAYS,
) -> Tuple[List[Dict[str, Any]], Dict[str, int]]:
    """Live headlines for news.json, one feed at a time.

    A feed that delivered this run replaces its previous items. A feed that delivered nothing (it was
    unreachable, or its certificate or markup broke) keeps the items from its last good sync, marked
    `isStale` with a `staleSince` stamp, so a transient outage does not wipe the news radar. Kept items
    older than `max_age_days` are dropped. Returns the items and, per source, how many were kept.
    """
    now = now or datetime.now(timezone.utc)
    cutoff = now - timedelta(days=max_age_days)
    merged: List[Dict[str, Any]] = []
    kept: Dict[str, int] = {}
    for source, fresh in fresh_by_source.items():
        if fresh:
            merged.extend(fresh)
            kept[source] = 0
            continue
        carried = []
        for item in previous:
            if not item.get("isLiveStream") or item.get("source") != source:
                continue
            published = _parse_when(item.get("date")) or _parse_when(item.get("fetchedAt")) or _parse_when(item.get("staleSince"))
            if published is not None and published < cutoff:
                continue
            carried.append({**item, "isStale": True, "staleSince": item.get("staleSince") or now.isoformat()})
        merged.extend(carried)
        kept[source] = len(carried)
    return merged, kept

def _read_live_news(path: str) -> List[Dict[str, Any]]:
    """Live-feed items currently in news.json ([] if the file is missing or unreadable)."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, ValueError):
        return []
    return [n for n in data if isinstance(n, dict) and n.get("isLiveStream")] if isinstance(data, list) else []

class SyncInProgress(RuntimeError):
    """A sync was requested while another one is still running."""

_SYNC_LOCK = threading.Lock()

def run_full_sync() -> Dict[str, Any]:
    """Run one sync at a time. A second caller gets SyncInProgress at once instead of racing the
    first one over the data files (the server is threaded, so a second click really can overlap)."""
    if not _SYNC_LOCK.acquire(blocking=False):
        raise SyncInProgress("A sync is already running. Try again when it finishes.")
    try:
        return _run_full_sync()
    finally:
        _SYNC_LOCK.release()

def _run_full_sync() -> Dict[str, Any]:
    """
    Executes a complete dynamic sync:
    1. Updates live quotes for all ETFs via Yahoo Finance.
    2. Validates AUM and TER via justETF.
    3. Streams live news from ECB RSS and MarketWatch RSS (a feed that fails keeps its last headlines).
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
            "price": (etf.get("liveMarketData") or {}).get("livePrice", etf.get("currentPriceEUR")),
            "currency": (etf.get("liveMarketData") or {}).get("currency", "EUR"),
            "dayChange": (etf.get("liveMarketData") or {}).get("dayChangePercent", 0.0),
            "aumMillions": etf.get("aumMillionsEUR", 0.0),
            "quoteUpdated": quote_updated
        })
        time.sleep(0.05)  # Politeness interval

    # Write updated ETFs
    _write_json_atomic(etfs_path, etfs)

    # 3. Stream live news feeds
    ecb_errors: List[str] = []
    mw_errors: List[str] = []
    live_ecb = sync_live_ecb_news(errors=ecb_errors)
    live_mw = sync_live_marketwatch_news(errors=mw_errors)
    fresh_news = live_ecb + live_mw

    news_path = os.path.join(DATA_DIR, "news.json")
    live_news_items, kept = merge_live_news(
        _read_live_news(news_path), {ECB_SOURCE: live_ecb, MARKETWATCH_SOURCE: live_mw}
    )
    _write_json_atomic(news_path, live_news_items + VERIFIED_MACRO_NEWS)

    # Rebuild data-store.js
    build_js_store()

    # What actually worked, in words the dashboard can show as-is
    warnings: List[str] = []
    quote_targets = len(etfs) - len(quotes_skipped)
    if quotes_failed:
        warnings.append(f"Yahoo Finance: {len(quotes_failed)} of {quote_targets} price requests failed ({_top_reason(quote_errors)}).")
    if fund_failed:
        warnings.append(f"justETF: fund size and TER unavailable for {fund_failed} of {fund_updated + fund_failed} funds ({_top_reason(fund_errors)}).")
    for label, items, errors, source in (
        ("ECB feed", live_ecb, ecb_errors, ECB_SOURCE),
        ("MarketWatch feed", live_mw, mw_errors, MARKETWATCH_SOURCE),
    ):
        if not items:
            n = kept[source]
            cached = f"; showing {n} cached headline{'s' if n != 1 else ''}" if n else ""
            warnings.append(f"{label}: no headlines ({_top_reason(errors)}){cached}.")

    sources = []
    if quotes_updated:
        sources.append("Yahoo Finance (Live Market Quotes, 52W High/Low, Daily Change)")
    if fund_updated:
        sources.append("justETF.com (Live Fund Size AUM & TER Verification)")
    if live_ecb:
        sources.append("European Central Bank RSS (Live Monetary Policy & Rate Guidelines)")
    if live_mw:
        sources.append("MarketWatch RSS (Real-Time Equity & Earnings Headlines)")

    refreshed_anything = bool(quotes_updated or fund_updated or fresh_news)
    return {
        "status": "failed" if not refreshed_anything else "partial" if warnings else "success",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "etfsSynced": updated_count,  # ETFs processed; see quotesUpdated for how many prices refreshed
        "quotesUpdated": quotes_updated,
        "quotesFailed": quotes_failed,
        "quotesSkipped": quotes_skipped,
        "fundDataUpdated": fund_updated,
        "liveNewsItemsFetched": len(fresh_news),
        "newsSources": {"ecb": len(live_ecb), "marketwatch": len(live_mw)},
        "newsCachedKept": {"ecb": kept[ECB_SOURCE], "marketwatch": kept[MARKETWATCH_SOURCE]},
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
