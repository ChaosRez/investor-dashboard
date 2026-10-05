"""
ApexETF Short-Horizon Planner

Turns real price history and an allocation the investor chooses into numbers they can check:

1. Risk statistics (`compute_risk_stats`, refreshed by `refresh_planner_risk`): annualised volatility,
   beta and correlation to the benchmark from weekly returns, maximum drawdown, the worst 12-month
   return, and how each instrument moved during every fall of the benchmark of 10% or more. Inputs are
   Yahoo Finance daily adjusted closes in EUR; nothing is typed in by hand.
2. The arithmetic of a plan (`analyze_plan`): a market-drop stress test, a one-year risk estimate, an
   order schedule for the broker (fees, dates, exposure while buying) and the German tax treatment.

It never proposes instruments or amounts: every amount it works with comes from the request.
Curated facts (names, costs, broker fees, tax rules, sources) live in public/data/planner.json; the
computed statistics in public/data/planner-risk.json.
"""

import bisect
import json
import math
import os
import threading
import time
import urllib.parse
from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

from .config import DATA_DIR, ETF_MARKET_MAP
from .sync import _top_reason, _write_json_atomic, _write_text_atomic, build_js_store, fetch_json

PLANNER_FILE = "planner.json"
RISK_FILE = "planner-risk.json"
PERFORMANCE_FILE = "performance.json"
HISTORY_FILE = "history.json"   # weekly closes per instrument, for backtests and tear sheets (server-side only)

HISTORY_YEARS = 10          # how much daily history to download
BETA_WINDOW_YEARS = 3       # weekly returns used for volatility, beta and correlation
RISK_WINDOW_YEARS = 5       # window for maximum drawdown and the worst 12-month return
EPISODE_THRESHOLD = 0.10    # a benchmark fall at least this deep counts as an episode
MIN_WEEKS = 26              # fewer aligned weekly returns than this and no statistic is reported
Z_95 = 1.645                # one-sided 95% quantile of the normal distribution

SCENARIO_MIN, SCENARIO_MAX = -60.0, -1.0
SAVINGS_FREQUENCIES = ("weekly", "biweekly", "monthly", "quarterly")

Series = List[Tuple[date, float]]


class RiskRefreshInProgress(RuntimeError):
    """A risk refresh was requested while another one is still running."""


_REFRESH_LOCK = threading.Lock()


# ---------------------------------------------------------------------------
# Datasets
# ---------------------------------------------------------------------------

def _read_json(path: str, default: Any) -> Any:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def load_planner_dataset(data_dir: str = DATA_DIR) -> Dict[str, Any]:
    return _read_json(os.path.join(data_dir, PLANNER_FILE), {})


def load_planner_risk(data_dir: str = DATA_DIR) -> Dict[str, Any]:
    return _read_json(os.path.join(data_dir, RISK_FILE), {})


def load_performance(data_dir: str = DATA_DIR) -> Dict[str, Any]:
    return _read_json(os.path.join(data_dir, PERFORMANCE_FILE), {})


def load_history(data_dir: str = DATA_DIR) -> Dict[str, Any]:
    return _read_json(os.path.join(data_dir, HISTORY_FILE), {})


def weekly_closes(series: Series, years: int = HISTORY_YEARS) -> Optional[Dict[str, Any]]:
    """Friday closes (last close on or before each Friday) for the last `years`, or since the first price.

    Compact form: value i belongs to `start` + 7*i days, except that the series ends on the latest close
    (`lastDate`), which is usually not a Friday. `history_points` turns it back into (date, price) pairs.
    """
    if not series:
        return None
    last_day = series[-1][0]
    start = max(series[0][0], last_day - timedelta(days=round(365.25 * years)))
    fridays = fridays_between(start, last_day)
    if not fridays:
        return None
    values = [round(price_on_or_before(series, f), 4) for f in fridays]
    if fridays[-1] != last_day:
        values.append(round(series[-1][1], 4))
    return {"start": _iso(fridays[0]), "lastDate": _iso(last_day), "values": values}


def history_points(entry: Dict[str, Any]) -> Series:
    """(date, price) pairs of one `history.json` instrument entry."""
    try:
        start = date.fromisoformat(entry["start"])
        last = date.fromisoformat(entry["lastDate"])
        values = [float(v) for v in entry["values"]]
    except (KeyError, TypeError, ValueError):
        return []
    days = [start + timedelta(weeks=i) for i in range(len(values))]
    if days and days[-1] != last:
        days[-1] = last
    return list(zip(days, values))


# ---------------------------------------------------------------------------
# Price history
# ---------------------------------------------------------------------------

def parse_chart_history(payload: Any) -> Series:
    """(day, adjusted close) pairs from a Yahoo chart response, oldest first.

    The adjusted close (distributions reinvested) is used when present, else the close. Days without
    a usable price are skipped; days are the exchange's local calendar days.
    """
    try:
        result = payload["chart"]["result"][0]
        stamps = result.get("timestamp") or []
        indicators = result.get("indicators") or {}
        closes = (indicators.get("adjclose") or [{}])[0].get("adjclose")
        if not closes:
            closes = (indicators.get("quote") or [{}])[0].get("close") or []
        offset = int((result.get("meta") or {}).get("gmtoffset") or 0)
    except (KeyError, IndexError, TypeError, ValueError, AttributeError):
        return []
    by_day: Dict[date, float] = {}
    for stamp, close in zip(stamps, closes):
        if not isinstance(close, (int, float)) or isinstance(close, bool) or not close > 0:
            continue
        day = datetime.fromtimestamp(stamp + offset, tz=timezone.utc).date()
        by_day[day] = float(close)
    return sorted(by_day.items())


def fetch_price_history(symbol: str, errors: Optional[List[str]] = None, years: int = HISTORY_YEARS) -> Series:
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(symbol)}"
           f"?range={years}y&interval=1d")
    payload = fetch_json(url, timeout=15, errors=errors)
    if payload is None:
        return []
    series = parse_chart_history(payload)
    if not series and errors is not None:
        errors.append("no price history in the response")
    return series


# ---------------------------------------------------------------------------
# Statistics (pure functions on Series)
# ---------------------------------------------------------------------------

def _iso(day: Optional[date]) -> Optional[str]:
    return day.isoformat() if day else None


def price_on_or_before(series: Series, day: date) -> Optional[float]:
    """Last close on or before `day`; None if the series starts after it."""
    i = bisect.bisect_right(series, (day, math.inf)) - 1
    return series[i][1] if i >= 0 else None


def fridays_between(start: date, end: date) -> List[date]:
    first = start + timedelta(days=(4 - start.weekday()) % 7)
    return [first + timedelta(weeks=k) for k in range(((end - first).days // 7) + 1)] if first <= end else []


def weekly_returns(series: Series, fridays: List[date]) -> List[Optional[float]]:
    """Friday-to-Friday returns (last close on or before each Friday). None where a week has no
    price at its start, i.e. before the instrument existed."""
    if not series:
        return [None] * max(0, len(fridays) - 1)
    first_day = series[0][0]
    closes = [price_on_or_before(series, f) if f >= first_day else None for f in fridays]
    return [b / a - 1 if a and b else None for a, b in zip(closes, closes[1:])]


def _aligned(xs: List[Optional[float]], ys: List[Optional[float]]) -> Tuple[List[float], List[float]]:
    pairs = [(x, y) for x, y in zip(xs, ys) if x is not None and y is not None]
    return [p[0] for p in pairs], [p[1] for p in pairs]


def _mean(v: List[float]) -> float:
    return sum(v) / len(v)


def _var(v: List[float]) -> float:
    m = _mean(v)
    return sum((x - m) ** 2 for x in v) / (len(v) - 1)


def correlation(xs: List[Optional[float]], ys: List[Optional[float]]) -> Optional[float]:
    a, b = _aligned(xs, ys)
    if len(a) < MIN_WEEKS:
        return None
    va, vb = _var(a), _var(b)
    if va <= 0 or vb <= 0:
        return None
    ma, mb = _mean(a), _mean(b)
    cov = sum((x - ma) * (y - mb) for x, y in zip(a, b)) / (len(a) - 1)
    return cov / math.sqrt(va * vb)


def regression_stats(bench: List[Optional[float]], inst: List[Optional[float]]) -> Optional[Dict[str, float]]:
    """Weekly beta, correlation and annualised volatility of `inst` against `bench`.

    `downBeta` is the beta through the origin over the weeks the benchmark fell, i.e. how much the
    instrument tended to move per 1% benchmark fall.
    """
    b, y = _aligned(bench, inst)
    n = len(b)
    if n < MIN_WEEKS:
        return None
    vb, vy = _var(b), _var(y)
    mb, my = _mean(b), _mean(y)
    cov = sum((p - mb) * (q - my) for p, q in zip(b, y)) / (n - 1)
    down = [(p, q) for p, q in zip(b, y) if p < 0]
    down_ss = sum(p * p for p, _ in down)
    return {
        "beta": cov / vb if vb > 0 else 0.0,
        "correlation": cov / math.sqrt(vb * vy) if vb > 0 and vy > 0 else 0.0,
        "volatility": math.sqrt(vy) * math.sqrt(52) * 100,
        "downBeta": sum(p * q for p, q in down) / down_ss if down_ss > 0 else 0.0,
        "weeks": n,
    }


def max_drawdown(series: Series, start: Optional[date] = None) -> Optional[Dict[str, Any]]:
    """Deepest peak-to-trough fall (in %) of closes on or after `start`."""
    peak = peak_day = None
    worst, worst_peak, worst_trough = 0.0, None, None
    for day, price in series:
        if start and day < start:
            continue
        if peak is None or price > peak:
            peak, peak_day = price, day
        dd = price / peak - 1
        if dd < worst:
            worst, worst_peak, worst_trough = dd, peak_day, day
    if peak is None:
        return None
    return {"value": round(worst * 100, 1), "peak": _iso(worst_peak), "trough": _iso(worst_trough)}


def worst_rolling_return(series: Series, start: Optional[date] = None, days: int = 365) -> Optional[Dict[str, Any]]:
    """Worst return over any `days`-long holding period that lies entirely on or after `start`."""
    pts = [(d, p) for d, p in series if start is None or d >= start]
    if not pts or (pts[-1][0] - pts[0][0]).days < days:
        return None
    worst = None
    windows = 0
    j = 0
    for d, p in pts:
        target = d - timedelta(days=days)
        if target < pts[0][0]:
            continue
        while j + 1 < len(pts) and pts[j + 1][0] <= target:
            j += 1
        r = p / pts[j][1] - 1
        windows += 1
        if worst is None or r < worst[0]:
            worst = (r, pts[j][0], d)
    return {"value": round(worst[0] * 100, 1), "from": _iso(worst[1]), "to": _iso(worst[2]), "windows": windows}


def drawdown_episodes(series: Series, threshold: float = EPISODE_THRESHOLD) -> List[Dict[str, Any]]:
    """Every fall of at least `threshold` from a running peak to the lowest close before that peak
    was regained. An episode still in progress has `recovered` = None."""
    episodes = []
    peak = trough = None
    peak_day = trough_day = None
    for day, price in series:
        if peak is None or price >= peak:
            if peak is not None and trough / peak - 1 <= -threshold:
                episodes.append({"peak": peak_day, "trough": trough_day, "move": trough / peak - 1, "recovered": day})
            peak, peak_day, trough, trough_day = price, day, price, day
        elif price < trough:
            trough, trough_day = price, day
    if peak is not None and trough / peak - 1 <= -threshold:
        episodes.append({"peak": peak_day, "trough": trough_day, "move": trough / peak - 1, "recovered": None})
    return episodes


def period_return(series: Series, start: date, end: date) -> Optional[float]:
    """Return from the close on/before `start` to the close on/before `end`; None if the series
    starts after `start` (the instrument did not exist yet)."""
    if not series or series[0][0] > start:
        return None
    a, b = price_on_or_before(series, start), price_on_or_before(series, end)
    return b / a - 1 if a and b else None


def compute_performance(series: Series) -> Optional[Dict[str, Any]]:
    """Trailing returns (in %, 3- and 5-year annualised), volatility, the deepest fall and a one-year
    weekly price line, all from daily closes. A period longer than the history is None, never guessed."""
    if not series:
        return None
    first_day = series[0][0]
    last_day, last_price = series[-1]

    def change_since(start: date) -> Optional[float]:
        if start < first_day:
            return None
        base = price_on_or_before(series, start)
        return last_price / base - 1 if base else None

    def annualised(years: int) -> Optional[float]:
        r = change_since(last_day - timedelta(days=round(365.25 * years)))
        return None if r is None else (1 + r) ** (1 / years) - 1

    pct = lambda x: None if x is None else round(x * 100, 2)
    returns = {
        "1m": pct(change_since(last_day - timedelta(days=30))),
        "3m": pct(change_since(last_day - timedelta(days=91))),
        "ytd": pct(change_since(date(last_day.year - 1, 12, 31))),
        "1y": pct(change_since(last_day - timedelta(days=365))),
        "3y": pct(annualised(3)),
        "5y": pct(annualised(5)),
    }
    years_of_history = (last_day - first_day).days / 365.25
    since_first_price = None
    if returns["3y"] is None and years_of_history >= 0.25:
        total = last_price / series[0][1] - 1
        since_first_price = {"from": _iso(first_day), "total": pct(total),
                        "annualised": pct((1 + total) ** (1 / years_of_history) - 1) if years_of_history >= 1 else None}

    vol_start = max(first_day, last_day - timedelta(days=round(365.25 * BETA_WINDOW_YEARS)))
    weekly = [r for r in weekly_returns(series, fridays_between(vol_start, last_day)) if r is not None]
    volatility = round(math.sqrt(_var(weekly)) * math.sqrt(52) * 100, 1) if len(weekly) >= MIN_WEEKS else None

    risk_start = max(first_day, last_day - timedelta(days=round(365.25 * RISK_WINDOW_YEARS)))
    spark_days = [f for f in fridays_between(last_day - timedelta(days=364), last_day) if f >= first_day]
    spark = [round(price_on_or_before(series, f), 4) for f in spark_days]
    if not spark_days or spark_days[-1] != last_day:
        spark.append(round(last_price, 4))
    return {
        "firstDate": _iso(first_day),
        "lastDate": _iso(last_day),
        "lastPrice": round(last_price, 4),
        "returns": returns,
        "sinceFirstPrice": since_first_price,
        "volatility": volatility,
        "maxDrawdown": {**(max_drawdown(series, risk_start) or {}), "windowStart": _iso(risk_start)},
        "spark": {"from": _iso(spark_days[0]) if spark_days else _iso(last_day), "stepDays": 7, "values": spark},
    }


def _episode_id(peak: date) -> str:
    return f"{peak.year}-{peak.month:02d}"


def compute_risk_stats(
    histories: Dict[str, Series],
    instruments: List[Dict[str, Any]],
    benchmark_id: str,
    episode_labels: Optional[Dict[str, str]] = None,
    generated_at: Optional[datetime] = None,
) -> Dict[str, Any]:
    """Statistics for every instrument that has price history, measured against `benchmark_id`."""
    bench = histories.get(benchmark_id) or []
    if not bench:
        raise ValueError(f"No price history for the benchmark {benchmark_id}")
    labels = episode_labels or {}
    end = bench[-1][0]
    beta_start = end - timedelta(days=round(365.25 * BETA_WINDOW_YEARS))
    risk_start = end - timedelta(days=round(365.25 * RISK_WINDOW_YEARS))
    fridays = fridays_between(beta_start, end)
    bench_weekly = weekly_returns(bench, fridays)

    raw_episodes = drawdown_episodes(bench)
    episodes = []
    for e in raw_episodes:
        eid = _episode_id(e["peak"])
        episodes.append({
            "id": eid,
            "label": labels.get(eid),
            "peak": _iso(e["peak"]),
            "trough": _iso(e["trough"]),
            "recovered": _iso(e["recovered"]),
            "benchmarkMove": round(e["move"] * 100, 1),
        })

    weekly: Dict[str, List[Optional[float]]] = {}
    stats: Dict[str, Dict[str, Any]] = {}
    warnings: List[str] = []
    by_id = {i["id"]: i for i in instruments}

    for inst in instruments:
        iid = inst["id"]
        series = histories.get(iid)
        if not inst.get("yahooSymbol"):
            continue
        if not series:
            warnings.append(f"{iid}: no price history, so no risk statistics.")
            continue
        weekly[iid] = weekly_returns(series, fridays)
        reg = regression_stats(bench_weekly, weekly[iid])
        stats_from = next((fridays[k] for k, (x, y) in enumerate(zip(bench_weekly, weekly[iid])) if x is not None and y is not None), None)
        own_start = max(risk_start, series[0][0])

        ep_moves: Dict[str, Dict[str, Any]] = {}
        for e, raw in zip(episodes, raw_episodes):
            move = period_return(series, raw["peak"], raw["trough"])
            if move is not None:
                ep_moves[e["id"]] = {"move": round(move * 100, 1), "basis": "actual"}
                continue
            proxy = inst.get("episodeProxy")
            proxy_move = period_return(histories.get(proxy) or [], raw["peak"], raw["trough"]) if proxy else None
            if proxy_move is not None:
                ep_moves[e["id"]] = {"move": round(proxy_move * 100, 1), "basis": "proxy", "proxy": proxy}
            else:
                ep_moves[e["id"]] = {"move": None, "basis": "none"}

        stats[iid] = {
            "symbol": inst["yahooSymbol"],
            "firstDate": _iso(series[0][0]),
            "lastDate": _iso(series[-1][0]),
            "lastPrice": round(series[-1][1], 4),
            "statsFrom": _iso(stats_from) if reg else None,
            "weeks": reg["weeks"] if reg else 0,
            "volatility": round(reg["volatility"], 1) if reg else None,
            "beta": round(reg["beta"], 2) if reg else None,
            "downBeta": round(reg["downBeta"], 2) if reg else None,
            "correlation": round(reg["correlation"], 2) if reg else None,
            "maxDrawdown": {**(max_drawdown(series, own_start) or {}), "windowStart": _iso(own_start)},
            "worst12m": worst_rolling_return(series, own_start),
            "episodes": ep_moves,
        }
        if not reg:
            warnings.append(f"{iid}: fewer than {MIN_WEEKS} weeks of shared history with {benchmark_id}; no beta or volatility.")

    ids = list(weekly)
    correlations: Dict[str, Dict[str, Optional[float]]] = {a: {a: 1.0} for a in ids}
    for i, a in enumerate(ids):
        for b in ids[i + 1:]:
            c = correlation(weekly[a], weekly[b])
            correlations[a][b] = correlations[b][a] = round(c, 3) if c is not None else None

    return {
        "generatedAt": (generated_at or datetime.now(timezone.utc)).isoformat(),
        "asOf": _iso(end),
        "benchmark": benchmark_id,
        "benchmarkName": by_id.get(benchmark_id, {}).get("name"),
        "source": "Yahoo Finance daily adjusted closes in EUR",
        "method": {
            "betaWindowYears": BETA_WINDOW_YEARS,
            "riskWindowYears": RISK_WINDOW_YEARS,
            "episodeThreshold": EPISODE_THRESHOLD * 100,
            "minWeeks": MIN_WEEKS,
            "notes": [
                f"Volatility, beta and correlation use Friday-to-Friday returns over the last {BETA_WINDOW_YEARS} years, or since launch if shorter.",
                f"Maximum drawdown and the worst 12-month return cover the last {RISK_WINDOW_YEARS} years, or since launch if shorter.",
                f"Episodes are every fall of the benchmark of at least {EPISODE_THRESHOLD * 100:.0f}% from a peak to its lowest close before that peak was regained.",
                "An instrument that did not exist during an episode has no measured move there. If it has a proxy with the same underlying, the proxy's move is shown and labelled.",
            ],
        },
        "episodes": episodes,
        "instruments": stats,
        "correlations": correlations,
        "warnings": warnings,
    }


def _market_symbols(dataset: Dict[str, Any], data_dir: str) -> Dict[str, str]:
    """id -> Yahoo symbol for every screener ETF with a quote symbol and every planner instrument."""
    etfs = _read_json(os.path.join(data_dir, "etfs.json"), [])
    symbols = {e["ticker"].upper(): ETF_MARKET_MAP[e["ticker"].upper()]["symbol"]
               for e in etfs if isinstance(e, dict) and e.get("ticker", "").upper() in ETF_MARKET_MAP}
    for inst in dataset.get("instruments") or []:
        if inst.get("yahooSymbol"):
            symbols.setdefault(inst["id"], inst["yahooSymbol"])
    return symbols


def refresh_planner_risk(data_dir: str = DATA_DIR, rebuild_store: bool = True) -> Dict[str, Any]:
    """Download daily price history for every planner instrument and screener ETF, recompute
    planner-risk.json (planner statistics) and performance.json (returns, volatility, deepest fall and a
    one-year price line per instrument), and report what refreshed. One refresh at a time; a second
    caller gets RiskRefreshInProgress."""
    if not _REFRESH_LOCK.acquire(blocking=False):
        raise RiskRefreshInProgress("A price-history refresh is already running. Try again when it finishes.")
    try:
        dataset = load_planner_dataset(data_dir)
        instruments = dataset.get("instruments") or []
        benchmark = dataset.get("benchmark")
        if not instruments or not benchmark:
            return {"status": "failed", "error": f"{PLANNER_FILE} is missing or has no instruments/benchmark."}

        symbols = _market_symbols(dataset, data_dir)
        by_symbol: Dict[str, Series] = {}
        failed: List[str] = []
        errors: List[str] = []
        for iid, symbol in symbols.items():
            if symbol not in by_symbol:
                by_symbol[symbol] = fetch_price_history(symbol, errors=errors)
                time.sleep(0.05)  # politeness interval
            if not by_symbol[symbol]:
                failed.append(iid)

        planner_ids = {i["id"] for i in instruments if i.get("yahooSymbol")}
        histories = {i["id"]: by_symbol.get(i["yahooSymbol"]) for i in instruments
                     if i.get("yahooSymbol") and by_symbol.get(i["yahooSymbol"])}
        if benchmark not in histories:
            return {
                "status": "failed",
                "error": f"No price history for the benchmark {benchmark} ({_top_reason(errors)}); kept the previous data.",
                "failed": failed,
            }

        risk = compute_risk_stats(histories, instruments, benchmark, dataset.get("episodeLabels"))
        _write_json_atomic(os.path.join(data_dir, RISK_FILE), risk)

        previous = load_performance(data_dir).get("instruments") or {}
        performance: Dict[str, Any] = {}
        for iid, symbol in symbols.items():
            stats = compute_performance(by_symbol.get(symbol) or [])
            if stats:
                performance[iid] = {"symbol": symbol, **stats}
            elif iid in previous:
                performance[iid] = {**previous[iid], "isStale": True}  # keep the last good copy, labelled
        _write_json_atomic(os.path.join(data_dir, PERFORMANCE_FILE), {
            "generatedAt": risk["generatedAt"],
            "asOf": risk["asOf"],
            "source": "Yahoo Finance daily adjusted closes in EUR (distributions reinvested)",
            "instruments": performance,
        })
        old_history = load_history(data_dir).get("instruments") or {}
        history: Dict[str, Any] = {}
        for iid, symbol in symbols.items():
            weekly = weekly_closes(by_symbol.get(symbol) or [])
            if weekly:
                history[iid] = {"symbol": symbol, **weekly}
            elif iid in old_history:
                history[iid] = {**old_history[iid], "isStale": True}
        # Compact JSON: ~27 x 520 numbers that change on every refresh
        _write_text_atomic(os.path.join(data_dir, HISTORY_FILE), json.dumps({
            "generatedAt": risk["generatedAt"],
            "asOf": risk["asOf"],
            "frequency": "weekly: Friday closes from `start`; the last value is the close on `lastDate`",
            "source": "Yahoo Finance daily adjusted closes in EUR (distributions reinvested)",
            "instruments": history,
        }, separators=(",", ":")))
        if rebuild_store:
            build_js_store()

        warnings = list(risk["warnings"])
        if failed:
            warnings.insert(0, f"Yahoo Finance: no history for {', '.join(failed)} ({_top_reason(errors)}); their figures were not updated.")
        return {
            "status": "partial" if failed else "success",
            "asOf": risk["asOf"],
            "generatedAt": risk["generatedAt"],
            "instrumentsUpdated": len(symbols) - len(failed),
            "plannerInstruments": len(planner_ids & set(histories)),
            "failed": failed,
            "episodes": len(risk["episodes"]),
            "warnings": warnings,
        }
    finally:
        _REFRESH_LOCK.release()


# ---------------------------------------------------------------------------
# Plan analysis
# ---------------------------------------------------------------------------

class PlanError(ValueError):
    """The request cannot be analysed as given; the message says why, in plain words."""


def _eur(x: float) -> str:
    return f"€{x:,.2f}"


def _number(value: Any, label: str, lo: float, hi: float, default: Optional[float] = None) -> float:
    if value is None or value == "":
        if default is None:
            raise PlanError(f"{label} is missing.")
        return default
    try:
        x = float(value)
    except (TypeError, ValueError):
        raise PlanError(f"{label} must be a number.")
    if not math.isfinite(x) or x < lo or x > hi:
        raise PlanError(f"{label} must be between {lo:g} and {hi:g}.")
    return x


def _amounts(raw: Any, known: Dict[str, Dict[str, Any]], label: str) -> Dict[str, float]:
    if raw in (None, ""):
        return {}
    if not isinstance(raw, dict):
        raise PlanError(f"{label} must map instrument ids to euro amounts.")
    out: Dict[str, float] = {}
    for key, value in raw.items():
        iid = str(key).strip().upper()
        if iid not in known:
            raise PlanError(f"Unknown instrument '{key}' in {label}.")
        amount = _number(value, f"{label} for {iid}", 0, 1e9)
        if amount > 0:
            out[iid] = round(amount, 2)
    return out


def _money(x: float, digits: int = 2) -> float:
    """Rounded, without negative zero (round(-0.0) stays -0.0 and would print as "-€0")."""
    return round(x, digits) + 0.0


def _split_cents(amount: float, parts: int) -> List[float]:
    """`amount` in `parts` equal pieces to the cent; the last piece absorbs the rounding."""
    cents = int(round(amount * 100))
    base = cents // parts
    pieces = [base] * parts
    pieces[-1] += cents - base * parts
    return [p / 100 for p in pieces]


def _add_months(day: date, months: int, dom: int) -> date:
    y, m = divmod(day.month - 1 + months, 12)
    return date(day.year + y, m + 1, dom)


def savings_plan_dates(start: date, frequency: str, count: int) -> List[date]:
    """Scheduled execution days of a Trade Republic savings plan.

    A plan starts on the 2nd or 16th of a month (the first such day on or after `start`) and then runs
    weekly (2nd, 9th, 16th, 23rd), twice a month (2nd and 16th), monthly or quarterly on its start day.
    """
    days_by_freq = {"weekly": (2, 9, 16, 23), "biweekly": (2, 16), "monthly": None, "quarterly": None}
    if frequency not in days_by_freq:
        raise PlanError(f"Savings-plan frequency must be one of {', '.join(SAVINGS_FREQUENCIES)}.")
    first = next(d for d in (date(start.year, start.month, 2), date(start.year, start.month, 16),
                             _add_months(start, 1, 2)) if d >= start)
    if frequency in ("monthly", "quarterly"):
        step = 1 if frequency == "monthly" else 3
        return [_add_months(first, k * step, first.day) for k in range(count)]
    allowed = days_by_freq[frequency]
    out: List[date] = []
    month = date(first.year, first.month, 1)
    while len(out) < count:
        for dom in allowed:
            d = date(month.year, month.month, dom)
            if d >= first and len(out) < count:
                out.append(d)
        month = _add_months(month, 1, 1)
    return out


def _covariance_volatility(weights: Dict[str, float], stats: Dict[str, Any], correlations: Dict[str, Any],
                           bench_vol: Optional[float]) -> Tuple[float, List[str]]:
    """Annualised volatility (fraction) of a portfolio from instrument volatilities and correlations.
    A missing correlation falls back to the single-index model rho = beta_i beta_j sigma_b^2 / (sigma_i sigma_j)."""
    notes: List[str] = []
    ids = [i for i, w in weights.items() if w > 0 and (stats.get(i) or {}).get("volatility")]
    var = 0.0
    for x, a in enumerate(ids):
        sa = stats[a]["volatility"] / 100
        var += (weights[a] * sa) ** 2
        for b in ids[x + 1:]:
            sb = stats[b]["volatility"] / 100
            rho = (correlations.get(a) or {}).get(b)
            if rho is None:
                ba, bb = stats[a].get("beta"), stats[b].get("beta")
                rho = 0.0 if ba is None or bb is None or not bench_vol else \
                    max(-1.0, min(1.0, ba * bb * (bench_vol / 100) ** 2 / (sa * sb)))
                notes.append(f"No measured correlation between {a} and {b}; estimated from their betas.")
            var += 2 * weights[a] * weights[b] * sa * sb * rho
    return math.sqrt(max(0.0, var)), notes


def analyze_plan(request: Dict[str, Any], dataset: Dict[str, Any], risk: Dict[str, Any],
                 today: Optional[date] = None) -> Dict[str, Any]:
    """Allocation, stress test, one-year risk, execution plan and tax notes for the amounts in `request`.

    request = {
      "holdings": {"CASH": 15000, "BTC": 250},     # what you hold today, in EUR
      "targets":  {"AII": 1500, "WGLD": 1500},     # what you want to hold; cash absorbs the difference
      "scenario": {"benchmarkMove": -10},          # % fall of the benchmark
      "cashRate": 2.5, "horizonMonths": 12, "lossLimit": 500,
      "execution": {"strategy": "lump" | "tranches" | "savings", "tranches": 3, "intervalWeeks": 4,
                    "frequency": "monthly", "executions": 3, "orderFee": 1, "startDate": "2026-10-06"},
      "tax": {"allowance": 1000, "allowanceUsedElsewhere": 0},
    }
    Returns {"error": ...} when the request cannot be analysed.
    """
    try:
        return _analyze(request or {}, dataset or {}, risk or {}, today or date.today())
    except PlanError as exc:
        return {"error": str(exc)}


def _analyze(req: Dict[str, Any], dataset: Dict[str, Any], risk: Dict[str, Any], today: date) -> Dict[str, Any]:
    instruments = {i["id"]: i for i in dataset.get("instruments") or []}
    if not instruments:
        raise PlanError(f"The planner dataset ({PLANNER_FILE}) is missing.")
    cash_id = dataset.get("cashInstrument") or next((i for i, x in instruments.items() if x.get("kind") == "cash"), None)
    if cash_id not in instruments:
        raise PlanError("The planner dataset has no cash instrument.")
    stats = risk.get("instruments") or {}
    correlations = risk.get("correlations") or {}
    episodes = risk.get("episodes") or []
    broker = dataset.get("broker") or {}
    tax_rules = dataset.get("tax") or {}
    benchmark = dataset.get("benchmark")
    warnings: List[str] = []

    holdings = _amounts(req.get("holdings"), instruments, "Holdings")
    targets_in = _amounts(req.get("targets"), instruments, "Targets")
    # An explicit zero target means "sell it all", so read zeros from the raw request too.
    raw_targets = req.get("targets") if isinstance(req.get("targets"), dict) else {}
    zero_targets = {str(k).strip().upper() for k, v in raw_targets.items() if v in (0, "0", 0.0)}

    total = round(sum(holdings.values()), 2)
    if total <= 0:
        raise PlanError("Enter what you hold today, including the cash you want to invest.")
    targets = {k: v for k, v in holdings.items() if k != cash_id and k not in zero_targets}
    targets.update({k: v for k, v in targets_in.items() if k != cash_id})
    cash_target = round(total - sum(targets.values()), 2)
    if cash_target < 0:
        raise PlanError(f"Your targets add up to {_eur(-cash_target)} more than everything you hold today "
                        f"({_eur(total)}). Lower a target, or add the extra money to today's cash.")
    targets[cash_id] = cash_target
    targets = {k: v for k, v in targets.items() if v > 0 or k == cash_id}

    move = _number((req.get("scenario") or {}).get("benchmarkMove"), "The market drop", SCENARIO_MIN, SCENARIO_MAX, -10.0)
    cash_rate = _number(req.get("cashRate"), "The cash interest rate", 0, 20,
                        float(instruments[cash_id].get("interestRate") or 0))
    horizon = int(_number(req.get("horizonMonths"), "The horizon", 1, 120, 12.0))
    loss_limit = req.get("lossLimit")
    loss_limit = None if loss_limit in (None, "") else _number(loss_limit, "Your loss limit", 0, 1e9)

    order = [i for i in instruments if i in holdings or i in targets]
    allocation = []
    for iid in order:
        inst = instruments[iid]
        now, tgt = holdings.get(iid, 0.0), targets.get(iid, 0.0)
        allocation.append({
            "id": iid, "name": inst.get("name"), "kind": inst.get("kind"),
            "today": now, "target": tgt, "change": round(tgt - now, 2),
            "targetPercent": round(tgt / total * 100, 2),
        })
    risky_total = round(sum(v for k, v in targets.items() if instruments[k].get("kind") != "cash"), 2)

    # --- stress test ---------------------------------------------------------------------------
    def exposure(iid: str) -> Optional[Dict[str, Any]]:
        """Beta and per-episode moves of an instrument; cash is zero by definition."""
        if instruments[iid].get("kind") == "cash":
            return {"beta": 0.0, "episodes": {e["id"]: {"move": 0.0, "basis": "cash"} for e in episodes}}
        st = stats.get(iid)
        if not st or st.get("beta") is None:
            return None
        moves = {}
        for e in episodes:
            m = (st.get("episodes") or {}).get(e["id"]) or {}
            if m.get("move") is not None:
                moves[e["id"]] = {"move": m["move"], "basis": m.get("basis", "actual"), "proxy": m.get("proxy")}
            else:
                moves[e["id"]] = {"move": round(st["beta"] * e["benchmarkMove"], 1), "basis": "beta"}
        return {"beta": st["beta"], "episodes": moves}

    stress_rows = []
    missing = []
    for iid in order:
        amount = targets.get(iid, 0.0)
        if amount <= 0:
            continue
        ex = exposure(iid)
        if ex is None:
            missing.append(iid)
            continue
        beta_move = ex["beta"] * move
        row = {
            "id": iid, "name": instruments[iid].get("name"), "amount": amount, "beta": ex["beta"],
            "betaMove": _money(beta_move), "betaChange": _money(amount * beta_move / 100),
            "scaled": {}, "replay": {},
        }
        for e in episodes:
            m = ex["episodes"][e["id"]]
            scaled = m["move"] / e["benchmarkMove"] * move if e["benchmarkMove"] else 0.0
            row["scaled"][e["id"]] = {"move": _money(scaled), "change": _money(amount * scaled / 100),
                                      "basis": m["basis"], "proxy": m.get("proxy")}
            row["replay"][e["id"]] = {"move": m["move"], "change": _money(amount * m["move"] / 100),
                                      "basis": m["basis"], "proxy": m.get("proxy")}
        stress_rows.append(row)
    if missing:
        warnings.append(f"No risk statistics for {', '.join(missing)}: left out of the stress test and the one-year risk. "
                        "Refresh the risk data or check the instrument's price symbol.")

    beta_total = _money(sum(r["betaChange"] for r in stress_rows))
    scaled_totals = {e["id"]: _money(sum(r["scaled"][e["id"]]["change"] for r in stress_rows)) for e in episodes}
    replay_totals = {e["id"]: _money(sum(r["replay"][e["id"]]["change"] for r in stress_rows)) for e in episodes}
    candidates = [("beta", beta_total)] + [(eid, v) for eid, v in scaled_totals.items()]
    worst_method, worst_change = min(candidates, key=lambda kv: kv[1])
    monthly_interest_all_cash = total * cash_rate / 100 / 12
    stress = {
        "benchmark": benchmark,
        "benchmarkMove": move,
        "rows": stress_rows,
        "totals": {
            "beta": beta_total,
            "betaPercent": round(beta_total / total * 100, 2),
            "scaled": scaled_totals,
            "worst": worst_change,
            "worstPercent": round(worst_change / total * 100, 2),
            "worstMethod": worst_method,
            "best": max(v for _, v in candidates),
            "replay": replay_totals,
            "replayPercent": {k: round(v / total * 100, 2) for k, v in replay_totals.items()},
        },
        "allCash": {"change": 0.0, "monthlyInterest": round(monthly_interest_all_cash, 2)},
        "monthsOfInterestToRecoverWorst": round(-worst_change / monthly_interest_all_cash, 1)
        if worst_change < 0 and monthly_interest_all_cash > 0 else 0.0,
        "lossLimit": loss_limit,
        "withinLossLimit": None if loss_limit is None else -worst_change <= loss_limit,
        "episodes": episodes,
    }

    # --- one-year risk ---------------------------------------------------------------------------
    weights = {r["id"]: r["amount"] / total for r in stress_rows if instruments[r["id"]].get("kind") != "cash"}
    bench_vol = (stats.get(benchmark) or {}).get("volatility")
    port_vol, corr_notes = _covariance_volatility(weights, stats, correlations, bench_vol)
    horizon_vol = port_vol * math.sqrt(horizon / 12)
    horizon_risk = {
        "months": horizon,
        "portfolioVolatility": round(port_vol * 100, 2),
        "horizonVolatility": round(horizon_vol * 100, 2),
        "loss95": round(total * Z_95 * horizon_vol, 2),
        "loss95Percent": round(Z_95 * horizon_vol * 100, 2),
        "cashInterest": round(cash_target * cash_rate / 100 * horizon / 12, 2),
        "allCashInterest": round(total * cash_rate / 100 * horizon / 12, 2),
        "worst12m": [
            {"id": r["id"], "worst12m": (stats.get(r["id"]) or {}).get("worst12m"),
             "maxDrawdown": (stats.get(r["id"]) or {}).get("maxDrawdown")}
            for r in stress_rows if instruments[r["id"]].get("kind") != "cash"
        ],
        "notes": corr_notes,
    }

    # --- execution plan --------------------------------------------------------------------------
    execution = _execution_plan(req.get("execution") or {}, holdings, targets, instruments, cash_id, broker,
                                {r["id"]: r["beta"] for r in stress_rows}, move, cash_rate, today, warnings)

    # --- taxes -----------------------------------------------------------------------------------
    taxes = _tax_overview(req.get("tax") or {}, holdings, targets, instruments, cash_id, tax_rules,
                          cash_rate, horizon, execution["orders"], warnings)

    risk_as_of = risk.get("asOf")
    if risk_as_of:
        try:
            age = (today - date.fromisoformat(risk_as_of)).days
            if age > 31:
                warnings.append(f"Risk statistics are from {risk_as_of} ({age} days old). Refresh them in the planner.")
        except ValueError:
            pass

    return {
        "asOf": today.isoformat(),
        "riskDataAsOf": risk_as_of,
        "total": total,
        "riskyTotal": risky_total,
        "riskyPercent": round(risky_total / total * 100, 2),
        "cashRate": cash_rate,
        "allocation": allocation,
        "stress": stress,
        "horizon": horizon_risk,
        "execution": execution,
        "tax": taxes,
        "warnings": warnings,
    }


def _execution_plan(opts: Dict[str, Any], holdings: Dict[str, float], targets: Dict[str, float],
                    instruments: Dict[str, Dict[str, Any]], cash_id: str, broker: Dict[str, Any],
                    betas: Dict[str, float], move: float, cash_rate: float, today: date,
                    warnings: List[str]) -> Dict[str, Any]:
    strategy = str(opts.get("strategy") or "lump").lower()
    if strategy not in ("lump", "tranches", "savings"):
        raise PlanError("The execution strategy must be 'lump', 'tranches' or 'savings'.")
    fee = _number(opts.get("orderFee"), "The order fee", 0, 50, float(broker.get("orderFee", 1.0)))
    start_raw = opts.get("startDate")
    try:
        start = date.fromisoformat(start_raw) if start_raw else today
    except (TypeError, ValueError):
        raise PlanError("The start date must look like 2026-10-06.")

    ids = [i for i in instruments if i != cash_id and (i in holdings or i in targets)]
    buys = {i: round(targets.get(i, 0.0) - holdings.get(i, 0.0), 2) for i in ids}
    sells = {i: -v for i, v in buys.items() if v < 0}
    buys = {i: v for i, v in buys.items() if v > 0}

    orders: List[Dict[str, Any]] = []
    for iid, amount in sells.items():
        orders.append({"date": start.isoformat(), "id": iid, "side": "sell", "amount": amount, "fee": fee, "type": "order"})

    settings: Dict[str, Any] = {"strategy": strategy, "orderFee": fee, "startDate": start.isoformat()}
    if strategy == "lump":
        for iid, amount in buys.items():
            orders.append({"date": start.isoformat(), "id": iid, "side": "buy", "amount": amount, "fee": fee, "type": "order"})
    elif strategy == "tranches":
        n = int(_number(opts.get("tranches"), "The number of tranches", 2, 12, 3))
        weeks = int(_number(opts.get("intervalWeeks"), "The weeks between tranches", 1, 26, 4))
        settings.update(tranches=n, intervalWeeks=weeks)
        for iid, amount in buys.items():
            for k, part in enumerate(_split_cents(amount, n)):
                when = start + timedelta(weeks=weeks * k)
                orders.append({"date": when.isoformat(), "id": iid, "side": "buy", "amount": part, "fee": fee, "type": "order"})
    else:
        frequency = str(opts.get("frequency") or "monthly").lower()
        n = int(_number(opts.get("executions"), "The number of savings-plan executions", 2, 52, 3))
        dates = savings_plan_dates(start, frequency, n)
        settings.update(frequency=frequency, executions=n)
        lo, hi = float(broker.get("savingsPlanMin", 0) or 0), float(broker.get("savingsPlanMax", 0) or 0)
        for iid, amount in buys.items():
            parts = _split_cents(amount, n)
            if lo and min(parts) < lo:
                warnings.append(f"{iid}: {_eur(min(parts))} per savings-plan execution is below the broker's minimum of {_eur(lo)}. "
                                "Use fewer executions or a single order.")
            if hi and max(parts) > hi:
                warnings.append(f"{iid}: {_eur(max(parts))} per execution is above the broker's savings-plan maximum of {_eur(hi)}.")
            for when, part in zip(dates, parts):
                orders.append({"date": when.isoformat(), "id": iid, "side": "buy", "amount": part, "fee": 0.0, "type": "savings plan"})

    orders.sort(key=lambda o: (o["date"], o["side"] != "sell", o["id"]))
    spreads = broker.get("spreadEstimates") or {}
    for o in orders:
        o["name"] = instruments[o["id"]].get("name")
        pct = spreads.get(o["id"])
        o["spreadEstimate"] = round(o["amount"] * pct / 100, 2) if pct else None

    # Exposure while buying: what a fall of the scenario size would cost right after each date.
    held_risky = {i: v for i, v in holdings.items() if i != cash_id}
    timeline = []
    invested = dict(held_risky)
    for day in sorted({o["date"] for o in orders}):
        for o in orders:
            if o["date"] == day:
                invested[o["id"]] = invested.get(o["id"], 0.0) + (o["amount"] if o["side"] == "buy" else -o["amount"])
        risky = round(sum(v for v in invested.values() if v > 0), 2)
        loss = _money(sum(v * betas.get(i, 0.0) * move / 100 for i, v in invested.items() if v > 0))
        timeline.append({"date": day, "invested": risky, "scenarioChange": loss})

    buy_orders = [o for o in orders if o["side"] == "buy"]
    total_buys = round(sum(o["amount"] for o in buy_orders), 2)
    fees = round(sum(o["fee"] for o in orders), 2)
    waiting_interest = round(sum(
        o["amount"] * cash_rate / 100 * (date.fromisoformat(o["date"]) - start).days / 365 for o in buy_orders
    ), 2)
    spread_total = round(sum(o["spreadEstimate"] or 0 for o in orders), 2)
    return {
        "settings": settings,
        "orders": orders,
        "timeline": timeline,
        "summary": {
            "orderCount": sum(1 for o in orders if o["type"] == "order"),
            "savingsPlanExecutions": sum(1 for o in orders if o["type"] == "savings plan"),
            "totalBuys": total_buys,
            "totalSells": round(sum(sells.values()), 2),
            "fees": fees,
            "feePercentOfBuys": round(fees / total_buys * 100, 3) if total_buys else 0.0,
            "spreadEstimate": spread_total,
            "fullyInvestedOn": max((o["date"] for o in buy_orders), default=None),
            "interestWhileWaiting": waiting_interest,
        },
    }


def _tax_overview(opts: Dict[str, Any], holdings: Dict[str, float], targets: Dict[str, float],
                  instruments: Dict[str, Dict[str, Any]], cash_id: str, rules: Dict[str, Any],
                  cash_rate: float, horizon: int, orders: List[Dict[str, Any]], warnings: List[str]) -> Dict[str, Any]:
    flat = float(rules.get("flatRate", 26.375))
    tfs = float(rules.get("equityFundPartialExemption", 30.0))
    vorab_factor = float(rules.get("vorabpauschaleFactor", 0.7))
    basiszins = rules.get("basiszins") or {}
    allowance = _number(opts.get("allowance"), "The saver's allowance", 0, 1e6, float(rules.get("saversAllowance", 1000)))
    used = _number(opts.get("allowanceUsedElsewhere"), "The allowance used elsewhere", 0, 1e6, 0.0)
    private = rules.get("privateSales") or {}

    months = min(horizon, 12)
    interest = round(targets.get(cash_id, 0.0) * cash_rate / 100 * months / 12, 2)
    allowance_left = max(0.0, allowance - used)
    taxable_interest = round(max(0.0, interest - allowance_left), 2)

    treatments = {
        "interest": {"onGains": flat, "summary": f"Interest is capital income: {flat:g}% above the saver's allowance."},
        "fund-equity": {"onGains": round(flat * (1 - tfs / 100), 4),
                        "summary": f"Equity fund: {tfs:g}% of gains are tax-free, so {flat * (1 - tfs / 100):.2f}% on the rest. "
                                   "Accumulating funds also pay a small yearly advance tax (Vorabpauschale)."},
        "fund-other": {"onGains": flat, "summary": f"Bond or money-market fund: {flat:g}% on gains, no partial exemption. Vorabpauschale applies."},
        "etc-delivery": {"onGains": None,
                         "summary": f"Gold ETC with a delivery right: taxed like physical gold, so gains are tax-free after "
                                    f"{private.get('holdingMonths', 12)} months. Sold sooner, gains count as private sales at your personal income-tax rate "
                                    f"(tax-free if all private-sale gains of the year stay below {_eur(float(private.get('exemptionLimit', 1000)))})."},
        "etc-taxable": {"onGains": flat, "summary": f"Gold ETC without a delivery right: {flat:g}% on gains whenever you sell, no partial exemption."},
        "crypto-direct": {"onGains": None,
                          "summary": f"Directly held crypto: gains are tax-free after {private.get('holdingMonths', 12)} months under current law. "
                                     f"Sold sooner, they are taxed at your personal income-tax rate (tax-free if all private-sale gains of the year stay "
                                     f"below {_eur(float(private.get('exemptionLimit', 1000)))})."},
    }
    rows = []
    for iid, amount in targets.items():
        if amount <= 0 and iid not in holdings:
            continue
        inst = instruments[iid]
        cls = inst.get("taxClass", "fund-other")
        t = treatments.get(cls, treatments["fund-other"])
        rows.append({"id": iid, "name": inst.get("name"), "taxClass": cls, "onGainsPercent": t["onGains"],
                     "summary": t["summary"], "note": inst.get("taxNote")})

    vorab = []
    for o in orders:
        inst = instruments[o["id"]]
        if o["side"] != "buy" or inst.get("taxClass") not in ("fund-equity", "fund-other") or not inst.get("accumulating"):
            continue
        day = date.fromisoformat(o["date"])
        rate = basiszins.get(str(day.year))
        if rate is None:
            continue
        share = (13 - day.month) / 12  # each full month before the purchase month drops out
        base = o["amount"] * float(rate) / 100 * vorab_factor * share
        taxable = base * (1 - tfs / 100) if inst.get("taxClass") == "fund-equity" else base
        vorab.append({"id": o["id"], "date": o["date"], "year": day.year, "upperBound": round(base, 2), "taxableUpperBound": round(taxable, 2)})
    vorab_by_id: Dict[str, Dict[str, Any]] = {}
    for v in vorab:
        agg = vorab_by_id.setdefault(v["id"], {"id": v["id"], "year": v["year"], "upperBound": 0.0, "taxableUpperBound": 0.0})
        agg["upperBound"] = round(agg["upperBound"] + v["upperBound"], 2)
        agg["taxableUpperBound"] = round(agg["taxableUpperBound"] + v["taxableUpperBound"], 2)

    for o in orders:
        if o["side"] == "sell" and instruments[o["id"]].get("taxClass") in ("crypto-direct", "etc-delivery"):
            warnings.append(f"Selling {o['id']} within {private.get('holdingMonths', 12)} months of buying it makes any gain taxable "
                            "at your personal income-tax rate (see Taxes).")

    return {
        "flatRate": flat,
        "allowance": allowance,
        "allowanceUsedElsewhere": used,
        "allowanceLeft": round(allowance_left, 2),
        "cashInterest": interest,
        "cashInterestMonths": months,
        "taxableInterest": taxable_interest,
        "taxOnInterest": round(taxable_interest * flat / 100, 2),
        "allowanceLeftAfterInterest": round(max(0.0, allowance_left - interest), 2),
        "treatments": rows,
        "vorabpauschale": list(vorab_by_id.values()),
        "notes": rules.get("notes") or [],
    }
