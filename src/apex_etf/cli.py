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
from .analysis import (
    calculate_portfolio_overlap,
    calculate_hierarchical_risk_parity,
    calculate_equal_risk_contribution,
    calculate_mean_cvar,
    calculate_robust_portfolio_optimization,
    calculate_crisis_stress_test,
    calculate_quantstats_downside_tear_sheet,
    get_platforms_metadata,
)
from .planner import analyze_plan, load_planner_dataset, load_planner_risk, refresh_planner_risk

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

def cmd_optimize(args: argparse.Namespace) -> None:
    """Run robust optimization algorithms (HRP, Risk Parity, Mean-CVaR)."""
    etfs_file = os.path.join(DATA_DIR, "etfs.json")
    etfs_by_ticker = {}
    if os.path.exists(etfs_file):
        with open(etfs_file, "r", encoding="utf-8") as f:
            etfs = json.load(f)
        etfs_by_ticker = {e["ticker"].upper(): e for e in etfs}

    tickers = []
    if args.etfs:
        for item in args.etfs:
            t = item.split(":")[0].strip().upper()
            if t and t not in tickers:
                tickers.append(t)
    else:
        tickers = ["VWCE", "AGGU", "XEON", "SGLD"]

    method = getattr(args, "method", "all").lower()

    print("=" * 70)
    print(f"🛡️ ApexETF Robust Optimization Suite | Target Assets: {tickers}")
    print("=" * 70)

    if method == "hrp":
        res = calculate_hierarchical_risk_parity(tickers, etfs_by_ticker)
        print(f"\n[Hierarchical Risk Parity (HRP)] - Est. Volatility: {res.get('portfolioVolatility', 0):.2f}%")
        print(f"Clustering Order: {' -> '.join(res.get('seriatedOrder', []))}")
        print("\nAllocations & Risk Contributions:")
        for t, w in res.get("weights", {}).items():
            rc = res.get("percentageRiskContributions", {}).get(t, 0)
            print(f" • {t:<6} Weight: {w:>6.2f}%  |  Risk Contribution: {rc:>6.2f}%")
    elif method in ["risk-parity", "erc"]:
        res = calculate_equal_risk_contribution(tickers, etfs_by_ticker)
        print(f"\n[Equal Risk Contribution (Risk Parity)] - Est. Volatility: {res.get('portfolioVolatility', 0):.2f}%")
        print("\nAllocations & Risk Contributions (Guaranteed Equalized):")
        for t, w in res.get("weights", {}).items():
            rc = res.get("percentageRiskContributions", {}).get(t, 0)
            print(f" • {t:<6} Weight: {w:>6.2f}%  |  Risk Contribution: {rc:>6.2f}%")
    elif method == "mean-cvar":
        res = calculate_mean_cvar(tickers, etfs_by_ticker)
        print(f"\n[Mean-CVaR Tail-Risk Optimization] - 95% CVaR Tail Loss: {res.get('cvar95', 0):.2f}%")
        print("\nAllocations:")
        for t, w in res.get("weights", {}).items():
            print(f" • {t:<6} Weight: {w:>6.2f}%")
    else:
        res = calculate_robust_portfolio_optimization(tickers, etfs_by_ticker)
        methods = res.get("methods", {})
        print(f"{'Asset':<6} | {'HRP':>8} | {'RiskParity':>11} | {'Mean-CVaR':>10} | {'1/N Eq':>8} | {'Markowitz':>10}")
        print("-" * 65)
        for t in tickers:
            w_hrp = methods.get("hrp", {}).get("weights", {}).get(t, 0)
            w_erc = methods.get("equalRiskContribution", {}).get("weights", {}).get(t, 0)
            w_cvar = methods.get("meanCvar", {}).get("weights", {}).get(t, 0)
            w_eq = methods.get("equalWeight", {}).get("weights", {}).get(t, 0)
            w_mpt = methods.get("markowitzMeanVariance", {}).get("weights", {}).get(t, 0)
            print(f"{t:<6} | {w_hrp:>7.1f}% | {w_erc:>10.1f}% | {w_cvar:>9.1f}% | {w_eq:>7.1f}% | {w_mpt:>9.1f}%")
        print("-" * 65)
        vol_hrp = methods.get("hrp", {}).get("volatility", 0)
        vol_erc = methods.get("equalRiskContribution", {}).get("volatility", 0)
        vol_cvar = methods.get("meanCvar", {}).get("volatility", 0)
        vol_eq = methods.get("equalWeight", {}).get("volatility", 0)
        vol_mpt = methods.get("markowitzMeanVariance", {}).get("volatility", 0)
        print(f"{'Vol %':<6} | {vol_hrp:>7.2f}% | {vol_erc:>10.2f}% | {vol_cvar:>9.2f}% | {vol_eq:>7.2f}% | {vol_mpt:>9.2f}%")
    print("=" * 70)

def cmd_stress_test(args: argparse.Namespace) -> None:
    """Stress-test portfolio allocation across canonical historical crises."""
    etfs_file = os.path.join(DATA_DIR, "etfs.json")
    etfs_by_ticker = {}
    if os.path.exists(etfs_file):
        with open(etfs_file, "r", encoding="utf-8") as f:
            etfs = json.load(f)
        etfs_by_ticker = {e["ticker"].upper(): e for e in etfs}

    weights = {}
    if args.etfs:
        for item in args.etfs:
            if ":" in item:
                parts = item.split(":")
                weights[parts[0].strip().upper()] = float(parts[1])
            else:
                weights[item.strip().upper()] = 100.0 / len(args.etfs)
    else:
        weights = {"VWCE": 60, "AGGU": 40}

    tolerance = getattr(args, "tolerance", -20.0)

    print("=" * 75)
    print(f"📉 QuantStats Historical Crisis Stress-Test | Portfolio: {weights}")
    print(f"🎯 Behavioral Drawdown Tolerance Limit: {tolerance:.1f}%")
    print("=" * 75)

    res = calculate_crisis_stress_test(weights, etfs_by_ticker, tolerance)
    crises = res.get("crises", [])

    print(f"{'Historical Crisis':<34} | {'Portfolio':>10} | {'100% Equity':>11} | {'Alpha vs Eq':>11}")
    print("-" * 75)
    for c in crises:
        p_dd = c["portfolioDrawdown"]
        eq_dd = c["benchmarkEquityDrawdown"]
        alpha = c["outperformanceVsEquity"]
        sign = "+" if alpha >= 0 else ""
        print(f"{c['name']:<34} | {p_dd:>9.1f}% | {eq_dd:>10.1f}% | {sign}{alpha:>9.1f}%")
    print("-" * 75)

    worst_dd = res.get("worstHistoricalDrawdown", 0)
    worst_crisis = res.get("worstCrisisName", "")
    print(f"\n🚨 Worst Historical Drawdown: {worst_dd:.1f}% during '{worst_crisis}'")
    print(f"\nAdvisory & Guardrail Assessment:")
    print(f" {res.get('remedyAdvice', '')}")
    print("=" * 75)

def cmd_teardown(args: argparse.Namespace) -> None:
    """Generate QuantStats-style downside teardown tear-sheet."""
    etfs_file = os.path.join(DATA_DIR, "etfs.json")
    etfs_by_ticker = {}
    if os.path.exists(etfs_file):
        with open(etfs_file, "r", encoding="utf-8") as f:
            etfs = json.load(f)
        etfs_by_ticker = {e["ticker"].upper(): e for e in etfs}

    weights = {}
    if args.etfs:
        for item in args.etfs:
            if ":" in item:
                parts = item.split(":")
                weights[parts[0].strip().upper()] = float(parts[1])
            else:
                weights[item.strip().upper()] = 100.0 / len(args.etfs)
    else:
        weights = {"VWCE": 60, "AGGU": 40}

    print("=" * 70)
    print(f"📋 QuantStats Downside Teardown Tear-Sheet | Allocation: {weights}")
    print("=" * 70)

    res = calculate_quantstats_downside_tear_sheet(weights, etfs_by_ticker)
    m = res.get("metrics", {})

    print(f" • Expected CAGR:              {m.get('cagr', 0):>6.2f}%")
    print(f" • Annualized Volatility:      {m.get('annualizedVolatility', 0):>6.2f}%")
    print(f" • Sharpe Ratio (Rf=2.5%):     {m.get('sharpeRatio', 0):>6.2f}")
    print(f" • Sortino Ratio (Downside):   {m.get('sortinoRatio', 0):>6.2f}")
    print(f" • Calmar Ratio (CAGR/MaxDD):  {m.get('calmarRatio', 0):>6.2f}")
    print(f" • Maximum Historical Drawdown:{m.get('maxDrawdown', 0):>6.2f}%")
    print(f" • Tail Ratio (95th/5th tail): {m.get('tailRatio', 0):>6.2f}")
    print(f" • Monthly VaR 95%:            {m.get('var95Monthly', 0):>6.2f}%")
    print(f" • Monthly CVaR (Tail Loss):   {m.get('cvar95Monthly', 0):>6.2f}%")
    print(f" • CDaR 95% (Conditional DD):  {m.get('cdar95', 0):>6.2f}%")
    print(f" • Ulcer Index (Depth+Length): {m.get('ulcerIndex', 0):>6.2f}")
    print(f" • Safe Withdrawal Rate (30Y): {m.get('swr30Y', 0):>6.2f}%")
    print(f" • Longest Underwater Period:  {m.get('longestUnderwaterMonths', 0)} months")
    print("=" * 70)

def _parse_amounts(items: List[str], flag: str) -> Dict[str, float]:
    out: Dict[str, float] = {}
    for item in items or []:
        if ":" not in item:
            print(f"❌ {flag} expects ID:EUR pairs such as AII:1500 (got '{item}').")
            sys.exit(2)
        key, value = item.split(":", 1)
        try:
            out[key.strip().upper()] = float(value)
        except ValueError:
            print(f"❌ '{value}' in {item} is not an amount in euro.")
            sys.exit(2)
    return out

def cmd_plan(args: argparse.Namespace) -> None:
    """Stress test, one-year risk, order plan and tax notes for amounts you choose."""
    dataset, risk = load_planner_dataset(), load_planner_risk()
    holdings = _parse_amounts(args.hold, "--hold") or dict((dataset.get("defaultPortfolio") or {}).get("today") or {})
    request = {
        "holdings": holdings,
        "targets": _parse_amounts(args.targets, "targets"),
        "scenario": {"benchmarkMove": args.drop},
        "horizonMonths": args.horizon,
        "execution": {"strategy": args.strategy, "tranches": args.tranches, "intervalWeeks": args.interval,
                      "frequency": args.frequency, "executions": args.executions, "orderFee": args.fee},
        "tax": {"allowanceUsedElsewhere": args.allowance_used},
    }
    if args.rate is not None:
        request["cashRate"] = args.rate
    res = analyze_plan(request, dataset, risk)
    if "error" in res:
        print(f"❌ {res['error']}")
        sys.exit(1)

    eur = lambda x: f"{'-' if x < 0 else ''}€{abs(x):,.2f}"
    print("=" * 78)
    print(f"🧭 Short-horizon plan | {eur(res['total'])} in total, {res['riskyPercent']:.1f}% outside the cash account")
    print(f"   Risk data as of {res['riskDataAsOf']} (refresh: apex-etf planner-risk). Facts and arithmetic, not advice.")
    print("=" * 78)
    print(f"{'Instrument':<46} {'Today':>10} {'Target':>10} {'Share':>7}")
    for row in res["allocation"]:
        print(f"{row['name'][:46]:<46} {row['today']:>10,.0f} {row['target']:>10,.0f} {row['targetPercent']:>6.1f}%")

    s = res["stress"]
    labels = {e["id"]: e.get("label") or e["id"] for e in s["episodes"]}
    print(f"\n📉 If {dataset.get('benchmark')} (world equity) falls {abs(s['benchmarkMove']):g}%:")
    print(f" • Beta estimate:                {eur(s['totals']['beta'])} ({s['totals']['betaPercent']:+.2f}%)")
    for eid, change in s["totals"]["scaled"].items():
        print(f" • Same pattern as {labels[eid][:40]:<40} {eur(change)}")
    print(f" • Worst of these: {eur(s['totals']['worst'])} = {s['monthsOfInterestToRecoverWorst']:g} months of interest on everything in cash")
    if s["lossLimit"] is not None:
        print(f" • Your loss limit {eur(s['lossLimit'])}: {'within' if s['withinLossLimit'] else 'EXCEEDED'}")
    print("\n⏪ If a past fall repeated in full:")
    for e in s["episodes"]:
        print(f" • {labels[e['id']][:40]:<40} world {e['benchmarkMove']:+.1f}% → you {eur(s['totals']['replay'][e['id']])} ({s['totals']['replayPercent'][e['id']]:+.1f}%)")

    h = res["horizon"]
    print(f"\n📆 {h['months']}-month risk: volatility {h['horizonVolatility']:.2f}%, a 1-in-20 loss of about {eur(h['loss95'])}"
          f" | cash interest on the rest {eur(h['cashInterest'])}")

    ex = res["execution"]
    sm = ex["summary"]
    print(f"\n🧾 Orders ({ex['settings']['strategy']}): {sm['orderCount']} orders + {sm['savingsPlanExecutions']} savings-plan executions,"
          f" fees {eur(sm['fees'])} ({sm['feePercentOfBuys']:.3f}% of buys), fully invested {sm['fullyInvestedOn'] or '—'}")
    for o in ex["orders"]:
        print(f"   {o['date']}  {o['side']:<4} {o['id']:<5} {o['amount']:>10,.2f}  fee {o['fee']:.2f}  ({o['type']})")

    t = res["tax"]
    print(f"\n🧮 Cash interest over {t['cashInterestMonths']} months {eur(t['cashInterest'])}; allowance left {eur(t['allowanceLeft'])};"
          f" tax on interest {eur(t['taxOnInterest'])}")
    for w in res["warnings"]:
        print(f"⚠️  {w}")
    print("=" * 78)

def cmd_planner_risk(args: argparse.Namespace) -> None:
    """Recompute the planner's risk statistics from fresh Yahoo Finance price history."""
    print("🔄 Downloading price history and recomputing planner risk statistics…")
    res = refresh_planner_risk()
    if res.get("status") == "failed":
        print(f"❌ {res.get('error')}")
        sys.exit(1)
    print(f"✅ {res['status']}: {res['instrumentsUpdated']} instruments, {res['episodes']} market falls of 10%+, data as of {res['asOf']}")
    for w in res.get("warnings", []):
        print(f"⚠️  {w}")

def cmd_platforms(args: argparse.Namespace) -> None:
    """List open-source quant libraries and no-code interactive web platforms."""
    platforms = get_platforms_metadata()
    print("=" * 80)
    print("🌐 Institutional Quant Libraries & Interactive ETF Decision Platforms")
    print("=" * 80)
    for p in platforms:
        print(f"\n[{p['name']}] ({p['type']}) - {p['badge']}")
        print(f" • Key Strength: {p['keyStrengths']}")
        print(f" • Best Used For: {p['bestUsedFor']}")
        print(f" • Link: {p['url']}")
    print("=" * 80)

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

    # Command: optimize
    opt_parser = subparsers.add_parser("optimize", help="Run robust portfolio optimization (HRP, Risk Parity, Mean-CVaR)")
    opt_parser.add_argument("etfs", nargs="*", help="List of tickers to optimize (e.g. VWCE AGGU XEON SGLD)")
    opt_parser.add_argument("--method", "-m", choices=["all", "hrp", "risk-parity", "erc", "mean-cvar"], default="all", help="Optimization algorithm (default: all)")

    # Command: stress-test
    stress_parser = subparsers.add_parser("stress-test", help="Stress-test portfolio against 2000 Dot-Com, 2008 Lehman, 2020 COVID, 2022 Fed rate hiking")
    stress_parser.add_argument("etfs", nargs="*", help="Weighted portfolio (e.g. VWCE:60 AGGU:40)")
    stress_parser.add_argument("--tolerance", "-t", type=float, default=-20.0, help="Maximum tolerable drawdown percentage (default: -20.0)")

    # Command: teardown
    td_parser = subparsers.add_parser("teardown", help="Generate QuantStats-style downside teardown tear-sheet (Ulcer Index, CDaR, SWR)")
    td_parser.add_argument("etfs", nargs="*", help="Weighted portfolio (e.g. VWCE:60 AGGU:40)")

    # Command: platforms
    subparsers.add_parser("platforms", help="Display comparative guide for PyPortfolioOpt, Riskfolio, QuantStats, Portfolio Visualizer, Testfol.io, Portfolio Charts")

    # Command: plan
    plan_parser = subparsers.add_parser("plan", help="Stress-test a short-horizon plan, list its orders and fees (amounts you choose)")
    plan_parser.add_argument("targets", nargs="*", help="Target amounts in EUR, e.g. AII:1500 WGLD:1500 (cash absorbs the difference)")
    plan_parser.add_argument("--hold", action="append", default=[], help="What you hold today, e.g. --hold CASH:15000 --hold BTC:250 (default: planner.json)")
    plan_parser.add_argument("--drop", type=float, default=-10.0, help="World-equity fall to test in percent (default: -10)")
    plan_parser.add_argument("--horizon", type=int, default=12, help="Horizon in months (default: 12)")
    plan_parser.add_argument("--rate", type=float, default=None, help="Cash account interest in percent (default: planner.json)")
    plan_parser.add_argument("--strategy", choices=["lump", "tranches", "savings"], default="lump", help="All at once, in tranches, or as savings plans")
    plan_parser.add_argument("--tranches", type=int, default=3, help="Number of tranches (default: 3)")
    plan_parser.add_argument("--interval", type=int, default=4, help="Weeks between tranches (default: 4)")
    plan_parser.add_argument("--frequency", choices=["weekly", "biweekly", "monthly", "quarterly"], default="monthly", help="Savings-plan frequency")
    plan_parser.add_argument("--executions", type=int, default=3, help="Savings-plan executions per instrument (default: 3)")
    plan_parser.add_argument("--fee", type=float, default=None, help="Fee per order in EUR (default: the broker's, €1)")
    plan_parser.add_argument("--allowance-used", type=float, default=0.0, help="Saver's allowance already used elsewhere this year, EUR")

    # Command: planner-risk
    subparsers.add_parser("planner-risk", help="Recompute the planner's risk statistics from fresh price history")

    args = parser.parse_args()

    if args.command == "serve":
        cmd_serve(args)
    elif args.command == "sync":
        cmd_sync(args)
    elif args.command == "status":
        cmd_status(args)
    elif args.command == "audit":
        cmd_audit(args)
    elif args.command == "optimize":
        cmd_optimize(args)
    elif args.command == "stress-test":
        cmd_stress_test(args)
    elif args.command == "teardown":
        cmd_teardown(args)
    elif args.command == "platforms":
        cmd_platforms(args)
    elif args.command == "plan":
        cmd_plan(args)
    elif args.command == "planner-risk":
        cmd_planner_risk(args)
    else:
        # Default behavior: run server
        cmd_serve(argparse.Namespace(port=DEFAULT_PORT, host=DEFAULT_HOST))

if __name__ == "__main__":
    main()
