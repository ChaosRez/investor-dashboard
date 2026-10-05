"""
Unit tests for the short-horizon planner: risk statistics from price history and the arithmetic of a plan.
"""

import json
import math
import os
import tempfile
import unittest
from datetime import date, datetime, timedelta, timezone
from unittest import mock

from apex_etf import planner
from apex_etf.config import DATA_DIR
from apex_etf.planner import (
    analyze_plan,
    compute_risk_stats,
    drawdown_episodes,
    fridays_between,
    max_drawdown,
    parse_chart_history,
    period_return,
    regression_stats,
    savings_plan_dates,
    weekly_returns,
    worst_rolling_return,
)


def daily(start: date, prices):
    """Consecutive calendar days starting at `start`."""
    return [(start + timedelta(days=i), float(p)) for i, p in enumerate(prices)]


def chart_payload(stamps, closes, adj=None, offset=0):
    indicators = {"quote": [{"close": closes}]}
    if adj is not None:
        indicators["adjclose"] = [{"adjclose": adj}]
    return {"chart": {"result": [{"meta": {"gmtoffset": offset}, "timestamp": stamps, "indicators": indicators}]}}


class TestPriceHistory(unittest.TestCase):
    def test_uses_adjusted_close_and_skips_gaps(self):
        t0 = int(datetime(2026, 1, 5, 8, tzinfo=timezone.utc).timestamp())
        payload = chart_payload([t0, t0 + 86400, t0 + 2 * 86400], [10, 11, 12], adj=[9.5, None, 11.5])
        self.assertEqual(parse_chart_history(payload), [(date(2026, 1, 5), 9.5), (date(2026, 1, 7), 11.5)])

    def test_falls_back_to_close_without_adjusted_series(self):
        t0 = int(datetime(2026, 1, 5, 8, tzinfo=timezone.utc).timestamp())
        self.assertEqual(parse_chart_history(chart_payload([t0], [10])), [(date(2026, 1, 5), 10.0)])

    def test_days_follow_the_exchange_calendar(self):
        # 23:30 UTC on 4 Jan is already 5 Jan in Frankfurt (UTC+1)
        t0 = int(datetime(2026, 1, 4, 23, 30, tzinfo=timezone.utc).timestamp())
        self.assertEqual(parse_chart_history(chart_payload([t0], [10], offset=3600))[0][0], date(2026, 1, 5))

    def test_garbage_is_an_empty_history(self):
        self.assertEqual(parse_chart_history({"chart": {"result": None}}), [])
        self.assertEqual(parse_chart_history(None), [])


class TestStatistics(unittest.TestCase):
    def test_weekly_returns_are_none_before_inception(self):
        fridays = fridays_between(date(2026, 1, 1), date(2026, 1, 31))
        self.assertEqual(fridays[0], date(2026, 1, 2))
        self.assertTrue(all(f.weekday() == 4 for f in fridays))
        late = daily(date(2026, 1, 10), [100 + i for i in range(30)])
        rets = weekly_returns(late, fridays)
        self.assertEqual(rets[:2], [None, None])  # no price on 2 or 9 January
        self.assertAlmostEqual(rets[2], (113 / 106) - 1)  # 16 → 23 January

    def test_regression_recovers_a_known_beta(self):
        bench = [0.01 * math.sin(i) for i in range(60)]
        inst = [2 * r for r in bench]
        stats = regression_stats(bench, inst)
        self.assertAlmostEqual(stats["beta"], 2.0)
        self.assertAlmostEqual(stats["correlation"], 1.0)
        self.assertAlmostEqual(stats["downBeta"], 2.0)
        self.assertEqual(stats["weeks"], 60)

    def test_too_little_shared_history_gives_no_statistics(self):
        bench = [0.01] * 60
        inst = [None] * 40 + [0.02] * 20
        self.assertIsNone(regression_stats(bench, inst))

    def test_max_drawdown(self):
        s = daily(date(2026, 1, 1), [100, 120, 90, 130, 104])
        self.assertEqual(max_drawdown(s), {"value": -25.0, "peak": "2026-01-02", "trough": "2026-01-03"})
        self.assertEqual(max_drawdown(s, start=date(2026, 1, 4))["value"], -20.0)

    def test_worst_rolling_return(self):
        s = daily(date(2024, 1, 1), [100] * 100 + [80] * 300 + [120] * 400)
        worst = worst_rolling_return(s)
        self.assertEqual(worst["value"], -20.0)
        self.assertIsNone(worst_rolling_return(s[:300]))  # shorter than a year

    def test_drawdown_episodes(self):
        prices = [100, 110, 95, 93.5, 111, 106, 112, 100, 99]
        eps = drawdown_episodes(daily(date(2026, 1, 1), prices))
        self.assertEqual(len(eps), 2)  # 110→93.5 (−15%) recovered; 112→99 (−11.6%) still running; 111→106 ignored
        self.assertEqual(eps[0]["peak"], date(2026, 1, 2))
        self.assertEqual(eps[0]["trough"], date(2026, 1, 4))
        self.assertAlmostEqual(eps[0]["move"], -0.15)
        self.assertEqual(eps[0]["recovered"], date(2026, 1, 5))
        self.assertIsNone(eps[1]["recovered"])

    def test_period_return_needs_the_instrument_to_exist(self):
        s = daily(date(2026, 1, 10), [100, 90])
        self.assertIsNone(period_return(s, date(2026, 1, 1), date(2026, 1, 11)))
        self.assertAlmostEqual(period_return(s, date(2026, 1, 10), date(2026, 1, 11)), -0.1)


def synthetic_histories():
    """Four years of daily prices: a benchmark with one 20% fall, a 1.5x version of it, flat gold,
    and a late-launched instrument whose proxy is the gold series."""
    start = date(2022, 10, 1)
    n = 4 * 365
    bench, levered, gold = [], [], []
    b = 100.0
    for i in range(n):
        r = 0.0004 + 0.006 * math.sin(i / 3.0)
        if 600 <= i < 640:
            r = -0.0056  # ~20% fall
        b *= 1 + r
        bench.append(b)
        levered.append((levered[-1] if levered else 100.0) * (1 + 1.5 * r))
        gold.append(100.0 + 0.01 * i)
    late = gold[700:]
    return {
        "BENCH": daily(start, bench),
        "LEV": daily(start, levered),
        "GOLD": daily(start, gold),
        "LATE": daily(start + timedelta(days=700), late),
    }


SYN_INSTRUMENTS = [
    {"id": "CASH", "kind": "cash"},
    {"id": "BENCH", "yahooSymbol": "B", "name": "Benchmark"},
    {"id": "LEV", "yahooSymbol": "L"},
    {"id": "GOLD", "yahooSymbol": "G"},
    {"id": "LATE", "yahooSymbol": "X", "episodeProxy": "GOLD"},
]


class TestComputeRiskStats(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.risk = compute_risk_stats(synthetic_histories(), SYN_INSTRUMENTS, "BENCH", {"2024-05": "Synthetic fall"})

    def test_episodes_come_from_the_benchmark(self):
        eps = self.risk["episodes"]
        self.assertEqual(len(eps), 1)
        self.assertEqual(eps[0]["id"], "2024-05")
        self.assertEqual(eps[0]["label"], "Synthetic fall")
        self.assertLess(eps[0]["benchmarkMove"], -10)

    def test_betas_and_volatility(self):
        inst = self.risk["instruments"]
        self.assertAlmostEqual(inst["BENCH"]["beta"], 1.0, places=2)
        self.assertAlmostEqual(inst["LEV"]["beta"], 1.5, delta=0.05)
        self.assertAlmostEqual(inst["LEV"]["volatility"] / inst["BENCH"]["volatility"], 1.5, delta=0.05)
        self.assertAlmostEqual(inst["GOLD"]["beta"], 0.0, places=2)
        self.assertNotIn("CASH", inst)  # no price symbol, no statistics

    def test_episode_moves_are_actual_or_labelled_proxies(self):
        eid = self.risk["episodes"][0]["id"]
        inst = self.risk["instruments"]
        self.assertEqual(inst["LEV"]["episodes"][eid]["basis"], "actual")
        self.assertLess(inst["LEV"]["episodes"][eid]["move"], self.risk["episodes"][0]["benchmarkMove"])
        self.assertEqual(inst["LATE"]["episodes"][eid], {"move": inst["GOLD"]["episodes"][eid]["move"], "basis": "proxy", "proxy": "GOLD"})

    def test_correlation_matrix_is_symmetric(self):
        c = self.risk["correlations"]
        self.assertEqual(c["LEV"]["BENCH"], c["BENCH"]["LEV"])
        self.assertAlmostEqual(c["LEV"]["BENCH"], 1.0, places=2)
        self.assertEqual(c["GOLD"]["GOLD"], 1.0)

    def test_missing_benchmark_is_an_error(self):
        with self.assertRaises(ValueError):
            compute_risk_stats({}, SYN_INSTRUMENTS, "BENCH")


DATASET = {
    "benchmark": "VWCE",
    "cashInstrument": "CASH",
    "instruments": [
        {"id": "CASH", "name": "Cash", "kind": "cash", "interestRate": 2.5, "taxClass": "interest"},
        {"id": "VWCE", "name": "World", "kind": "equity", "taxClass": "fund-equity", "accumulating": True},
        {"id": "AII", "name": "AI", "kind": "equity", "taxClass": "fund-equity", "accumulating": True},
        {"id": "WGLD", "name": "Gold", "kind": "gold", "taxClass": "etc-delivery", "accumulating": True},
        {"id": "BTC", "name": "Bitcoin", "kind": "crypto", "taxClass": "crypto-direct"},
        {"id": "NODATA", "name": "No data", "kind": "equity", "taxClass": "fund-equity"},
    ],
    "broker": {"orderFee": 1.0, "savingsPlanMin": 10, "savingsPlanMax": 10000, "spreadEstimates": {"BTC": 0.5}},
    "tax": {"flatRate": 26.375, "saversAllowance": 1000, "equityFundPartialExemption": 30,
            "vorabpauschaleFactor": 0.7, "basiszins": {"2026": 3.20}, "privateSales": {"holdingMonths": 12, "exemptionLimit": 1000}},
}

RISK = {
    "asOf": "2026-10-02",
    "episodes": [
        {"id": "2022-01", "benchmarkMove": -16.0},
        {"id": "2025-02", "benchmarkMove": -20.0},
    ],
    "instruments": {
        "VWCE": {"beta": 1.0, "volatility": 12.0, "episodes": {"2022-01": {"move": -16.0, "basis": "actual"}, "2025-02": {"move": -20.0, "basis": "actual"}}},
        "AII": {"beta": 1.7, "volatility": 27.0, "episodes": {"2022-01": {"move": None, "basis": "none"}, "2025-02": {"move": -30.0, "basis": "actual"}}},
        "WGLD": {"beta": 0.2, "volatility": 17.0, "episodes": {"2022-01": {"move": 8.0, "basis": "actual"}, "2025-02": {"move": -1.0, "basis": "actual"}}},
        "BTC": {"beta": 0.8, "volatility": 46.0, "episodes": {"2022-01": {"move": -52.0, "basis": "actual"}, "2025-02": {"move": -18.0, "basis": "actual"}}},
    },
    "correlations": {
        "VWCE": {"VWCE": 1.0, "AII": 0.85, "WGLD": 0.1, "BTC": 0.2},
        "AII": {"VWCE": 0.85, "AII": 1.0, "WGLD": 0.1, "BTC": 0.25},
        "WGLD": {"VWCE": 0.1, "AII": 0.1, "WGLD": 1.0},
        "BTC": {"VWCE": 0.2, "AII": 0.25, "BTC": 1.0},
    },
}

TODAY = date(2026, 10, 5)


def plan(**overrides):
    req = {"holdings": {"CASH": 15000, "BTC": 250}, "targets": {}, "scenario": {"benchmarkMove": -10}}
    req.update(overrides)
    return analyze_plan(req, DATASET, RISK, today=TODAY)


class TestAllocation(unittest.TestCase):
    def test_status_quo_has_no_orders(self):
        res = plan()
        self.assertNotIn("error", res)
        self.assertEqual(res["total"], 15250)
        self.assertEqual(res["execution"]["orders"], [])
        self.assertEqual({r["id"]: r["target"] for r in res["allocation"]}, {"CASH": 15000, "BTC": 250})

    def test_cash_absorbs_the_difference(self):
        res = plan(targets={"AII": 1000, "WGLD": 1500})
        alloc = {r["id"]: r for r in res["allocation"]}
        self.assertEqual(alloc["CASH"]["target"], 12500)
        self.assertEqual(alloc["BTC"]["target"], 250)  # unchanged unless targeted
        self.assertAlmostEqual(sum(r["targetPercent"] for r in res["allocation"]), 100, places=1)
        self.assertEqual(res["riskyTotal"], 2750)

    def test_targets_above_what_you_hold_are_refused_with_the_gap(self):
        res = plan(targets={"AII": 16000})
        self.assertIn("error", res)
        self.assertIn("€1,000.00 more", res["error"])

    def test_unknown_instruments_and_bad_numbers_are_refused(self):
        self.assertIn("Unknown instrument", plan(targets={"NOPE": 10})["error"])
        self.assertIn("must be a number", plan(targets={"AII": "lots"})["error"])
        self.assertIn("between", plan(scenario={"benchmarkMove": -95})["error"])
        self.assertIn("hold today", plan(holdings={})["error"])

    def test_a_zero_target_sells_the_position(self):
        res = plan(targets={"BTC": 0})
        orders = res["execution"]["orders"]
        self.assertEqual([(o["id"], o["side"], o["amount"]) for o in orders], [("BTC", "sell", 250)])
        self.assertTrue(any("within 12 months" in w for w in res["warnings"]))


class TestStress(unittest.TestCase):
    def test_beta_estimate(self):
        res = plan(targets={"AII": 1000, "WGLD": 1000})
        rows = {r["id"]: r for r in res["stress"]["rows"]}
        self.assertAlmostEqual(rows["AII"]["betaChange"], -170.0)
        self.assertAlmostEqual(rows["WGLD"]["betaChange"], -20.0)
        self.assertAlmostEqual(rows["BTC"]["betaChange"], -20.0)
        self.assertEqual(rows["CASH"]["betaChange"], 0.0)
        self.assertAlmostEqual(res["stress"]["totals"]["beta"], -210.0)

    def test_episodes_are_scaled_to_the_scenario(self):
        res = plan(targets={"AII": 1000})
        rows = {r["id"]: r for r in res["stress"]["rows"]}
        # 2025: AII fell 30% while the benchmark fell 20% → 1.5 × −10% = −15%
        self.assertAlmostEqual(rows["AII"]["scaled"]["2025-02"]["move"], -15.0)
        self.assertEqual(rows["AII"]["scaled"]["2025-02"]["basis"], "actual")
        # 2022: AII did not exist → beta estimate, labelled
        self.assertAlmostEqual(rows["AII"]["scaled"]["2022-01"]["move"], -17.0)
        self.assertEqual(rows["AII"]["scaled"]["2022-01"]["basis"], "beta")
        # Bitcoin in 2022: −52% vs −16% → 3.25 × −10%
        self.assertAlmostEqual(rows["BTC"]["scaled"]["2022-01"]["move"], -32.5)

    def test_worst_case_and_interest_comparison(self):
        res = plan(targets={"AII": 1000})
        totals = res["stress"]["totals"]
        candidates = [totals["beta"], *totals["scaled"].values()]
        self.assertEqual(totals["worst"], min(candidates))
        monthly = 15250 * 0.025 / 12
        self.assertAlmostEqual(res["stress"]["monthsOfInterestToRecoverWorst"], round(-totals["worst"] / monthly, 1))

    def test_replays_use_actual_moves(self):
        res = plan(targets={"AII": 1000})
        rows = {r["id"]: r for r in res["stress"]["rows"]}
        self.assertAlmostEqual(rows["AII"]["replay"]["2025-02"]["change"], -300.0)
        self.assertAlmostEqual(rows["BTC"]["replay"]["2022-01"]["change"], -130.0)

    def test_loss_limit_comparison(self):
        self.assertTrue(plan(targets={"AII": 100}, lossLimit=500)["stress"]["withinLossLimit"])
        self.assertFalse(plan(targets={"AII": 5000}, lossLimit=500)["stress"]["withinLossLimit"])

    def test_instruments_without_statistics_are_named(self):
        res = plan(targets={"NODATA": 500})
        self.assertTrue(any("NODATA" in w for w in res["warnings"]))
        self.assertNotIn("NODATA", [r["id"] for r in res["stress"]["rows"]])


class TestHorizonRisk(unittest.TestCase):
    def test_single_instrument_volatility(self):
        res = plan(holdings={"CASH": 10000}, targets={"VWCE": 5000})
        h = res["horizon"]
        self.assertAlmostEqual(h["portfolioVolatility"], 6.0)  # half the money at 12%
        self.assertAlmostEqual(h["loss95"], round(10000 * 1.645 * 0.06, 2))
        self.assertAlmostEqual(h["cashInterest"], 125.0)

    def test_diversification_lowers_volatility(self):
        res = plan(holdings={"CASH": 10000}, targets={"VWCE": 2500, "WGLD": 2500})
        undiversified = 0.25 * 12 + 0.25 * 17
        self.assertLess(res["horizon"]["portfolioVolatility"], undiversified)

    def test_shorter_horizon_scales_with_the_square_root_of_time(self):
        res = plan(holdings={"CASH": 10000}, targets={"VWCE": 5000}, horizonMonths=3)
        self.assertAlmostEqual(res["horizon"]["horizonVolatility"], 3.0)


class TestExecution(unittest.TestCase):
    def test_lump_sum_is_one_order_per_instrument(self):
        res = plan(targets={"AII": 1000, "WGLD": 1500}, execution={"strategy": "lump", "startDate": "2026-10-06"})
        ex = res["execution"]
        self.assertEqual(ex["summary"]["orderCount"], 2)
        self.assertEqual(ex["summary"]["fees"], 2.0)
        self.assertEqual(ex["summary"]["fullyInvestedOn"], "2026-10-06")
        self.assertEqual(ex["summary"]["interestWhileWaiting"], 0.0)

    def test_tranches_split_exactly_and_charge_every_order(self):
        res = plan(targets={"AII": 1000}, execution={"strategy": "tranches", "tranches": 3, "intervalWeeks": 2, "startDate": "2026-10-06"})
        orders = [o for o in res["execution"]["orders"] if o["id"] == "AII"]
        self.assertEqual([o["date"] for o in orders], ["2026-10-06", "2026-10-20", "2026-11-03"])
        self.assertEqual([o["amount"] for o in orders], [333.33, 333.33, 333.34])
        self.assertEqual(res["execution"]["summary"]["fees"], 3.0)
        self.assertGreater(res["execution"]["summary"]["interestWhileWaiting"], 0)

    def test_timeline_shows_exposure_growing(self):
        res = plan(targets={"AII": 900}, execution={"strategy": "tranches", "tranches": 3, "intervalWeeks": 4, "startDate": "2026-10-06"})
        tl = res["execution"]["timeline"]
        self.assertEqual([t["invested"] for t in tl], [550.0, 850.0, 1150.0])  # BTC 250 already held
        self.assertAlmostEqual(tl[-1]["scenarioChange"], -(900 * 1.7 + 250 * 0.8) / 10)

    def test_savings_plans_are_free_and_follow_the_brokers_days(self):
        res = plan(targets={"AII": 600}, execution={"strategy": "savings", "frequency": "monthly", "executions": 3, "startDate": "2026-10-06"})
        orders = res["execution"]["orders"]
        self.assertEqual([o["date"] for o in orders], ["2026-10-16", "2026-11-16", "2026-12-16"])
        self.assertEqual(res["execution"]["summary"]["fees"], 0.0)
        self.assertTrue(all(o["type"] == "savings plan" for o in orders))

    def test_savings_plan_minimum_is_checked(self):
        res = plan(targets={"AII": 15}, execution={"strategy": "savings", "frequency": "weekly", "executions": 3})
        self.assertTrue(any("below the broker's minimum" in w for w in res["warnings"]))

    def test_crypto_spread_is_estimated(self):
        res = plan(targets={"BTC": 1250}, execution={"strategy": "lump"})
        self.assertEqual(res["execution"]["summary"]["spreadEstimate"], 5.0)

    def test_savings_plan_calendar(self):
        start = date(2026, 10, 6)
        self.assertEqual(savings_plan_dates(start, "weekly", 4), [date(2026, 10, 16), date(2026, 10, 23), date(2026, 11, 2), date(2026, 11, 9)])
        self.assertEqual(savings_plan_dates(start, "biweekly", 3), [date(2026, 10, 16), date(2026, 11, 2), date(2026, 11, 16)])
        self.assertEqual(savings_plan_dates(start, "quarterly", 3), [date(2026, 10, 16), date(2027, 1, 16), date(2027, 4, 16)])
        self.assertEqual(savings_plan_dates(date(2026, 10, 2), "monthly", 2), [date(2026, 10, 2), date(2026, 11, 2)])
        self.assertEqual(savings_plan_dates(date(2026, 12, 20), "monthly", 2), [date(2027, 1, 2), date(2027, 2, 2)])


class TestTax(unittest.TestCase):
    def test_interest_against_the_allowance(self):
        res = plan(tax={"allowance": 1000, "allowanceUsedElsewhere": 800})
        tax = res["tax"]
        self.assertEqual(tax["cashInterest"], 375.0)  # €15,000 at 2.5% for 12 months
        self.assertEqual(tax["allowanceLeft"], 200.0)
        self.assertEqual(tax["taxableInterest"], 175.0)
        self.assertEqual(tax["taxOnInterest"], round(175 * 0.26375, 2))

    def test_vorabpauschale_upper_bound_for_an_october_purchase(self):
        res = plan(targets={"AII": 1000}, execution={"strategy": "lump", "startDate": "2026-10-06"})
        vp = res["tax"]["vorabpauschale"]
        self.assertEqual(len(vp), 1)
        expected = 1000 * 0.032 * 0.7 * 3 / 12
        self.assertAlmostEqual(vp[0]["upperBound"], round(expected, 2))
        self.assertAlmostEqual(vp[0]["taxableUpperBound"], round(expected * 0.7, 2))

    def test_no_vorabpauschale_for_gold_or_crypto(self):
        res = plan(targets={"WGLD": 1000, "BTC": 500}, execution={"strategy": "lump", "startDate": "2026-10-06"})
        self.assertEqual(res["tax"]["vorabpauschale"], [])
        classes = {t["id"]: t for t in res["tax"]["treatments"]}
        self.assertIsNone(classes["WGLD"]["onGainsPercent"])
        self.assertIn("12 months", classes["BTC"]["summary"])

    def test_equity_fund_rate_reflects_the_partial_exemption(self):
        res = plan(targets={"AII": 1000})
        classes = {t["id"]: t for t in res["tax"]["treatments"]}
        self.assertAlmostEqual(classes["AII"]["onGainsPercent"], 18.4625)


class TestShippedDataset(unittest.TestCase):
    """The curated dataset and the generated statistics the dashboard ships with."""

    @classmethod
    def setUpClass(cls):
        with open(os.path.join(DATA_DIR, "planner.json"), encoding="utf-8") as f:
            cls.dataset = json.load(f)
        with open(os.path.join(DATA_DIR, "planner-risk.json"), encoding="utf-8") as f:
            cls.risk = json.load(f)

    def test_every_market_instrument_has_statistics(self):
        for inst in self.dataset["instruments"]:
            if inst.get("yahooSymbol"):
                self.assertIn(inst["id"], self.risk["instruments"], inst["id"])
                self.assertEqual(self.risk["instruments"][inst["id"]]["symbol"], inst["yahooSymbol"])

    def test_every_instrument_is_sourced_and_classified(self):
        classes = {"interest", "fund-equity", "fund-other", "etc-delivery", "etc-taxable", "crypto-direct"}
        for inst in self.dataset["instruments"]:
            self.assertIn(inst["taxClass"], classes, inst["id"])
            self.assertTrue(inst.get("sources"), f"{inst['id']} has no source")
            if inst.get("isin"):
                self.assertRegex(inst["isin"], r"^[A-Z]{2}[A-Z0-9]{10}$")

    def test_proxies_and_defaults_point_at_known_instruments(self):
        ids = {i["id"] for i in self.dataset["instruments"]}
        self.assertIn(self.dataset["benchmark"], ids)
        self.assertIn(self.dataset["cashInstrument"], ids)
        for inst in self.dataset["instruments"]:
            if inst.get("episodeProxy"):
                self.assertIn(inst["episodeProxy"], ids)
        self.assertTrue(set(self.dataset["defaultPortfolio"]["today"]) <= ids)
        self.assertTrue(set(self.dataset["defaultPortfolio"]["candidates"]) <= ids)

    def test_the_default_portfolio_analyses_cleanly(self):
        res = analyze_plan({"holdings": self.dataset["defaultPortfolio"]["today"]}, self.dataset, self.risk, today=TODAY)
        self.assertNotIn("error", res)


class TestRefresh(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        with open(os.path.join(self.tmp.name, "planner.json"), "w", encoding="utf-8") as f:
            json.dump({"benchmark": "BENCH", "instruments": SYN_INSTRUMENTS}, f)

    def tearDown(self):
        self.tmp.cleanup()

    def _fake_fetch(self, histories, failing=()):
        by_symbol = {inst["yahooSymbol"]: histories[inst["id"]] for inst in SYN_INSTRUMENTS if inst.get("yahooSymbol")}

        def fetch(symbol, errors=None, years=10):
            if symbol in failing:
                errors.append("HTTP 429")
                return []
            return by_symbol[symbol]
        return fetch

    def test_writes_statistics_and_reports_success(self):
        with mock.patch.object(planner, "fetch_price_history", self._fake_fetch(synthetic_histories())), \
                mock.patch.object(planner.time, "sleep"):
            report = planner.refresh_planner_risk(self.tmp.name, rebuild_store=False)
        self.assertEqual(report["status"], "success")
        self.assertEqual(report["instrumentsUpdated"], 4)
        with open(os.path.join(self.tmp.name, "planner-risk.json"), encoding="utf-8") as f:
            self.assertIn("LEV", json.load(f)["instruments"])

    def test_a_failed_instrument_is_named(self):
        with mock.patch.object(planner, "fetch_price_history", self._fake_fetch(synthetic_histories(), failing={"L"})), \
                mock.patch.object(planner.time, "sleep"):
            report = planner.refresh_planner_risk(self.tmp.name, rebuild_store=False)
        self.assertEqual(report["status"], "partial")
        self.assertEqual(report["failed"], ["LEV"])
        self.assertIn("HTTP 429", report["warnings"][0])

    def test_without_the_benchmark_nothing_is_overwritten(self):
        with mock.patch.object(planner, "fetch_price_history", self._fake_fetch(synthetic_histories(), failing={"B"})), \
                mock.patch.object(planner.time, "sleep"):
            report = planner.refresh_planner_risk(self.tmp.name, rebuild_store=False)
        self.assertEqual(report["status"], "failed")
        self.assertFalse(os.path.exists(os.path.join(self.tmp.name, "planner-risk.json")))

    def test_a_second_refresh_is_rejected_while_one_runs(self):
        self.assertTrue(planner._REFRESH_LOCK.acquire(blocking=False))
        try:
            with self.assertRaises(planner.RiskRefreshInProgress):
                planner.refresh_planner_risk(self.tmp.name, rebuild_store=False)
        finally:
            planner._REFRESH_LOCK.release()


if __name__ == "__main__":
    unittest.main()
