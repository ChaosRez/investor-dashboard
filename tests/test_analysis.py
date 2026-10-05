"""
Unit tests for ApexETF Quantitative Analysis & Portfolio Calculation Engine
"""

import unittest
from datetime import date, timedelta

from apex_etf.analysis import calculate_portfolio_overlap, calculate_curvo_portfolio_simulation, calculate_dca_backtest

class TestAnalysisEngine(unittest.TestCase):
    def setUp(self):
        self.mock_etfs = {
            "VWCE": {
                "ticker": "VWCE",
                "name": "Vanguard FTSE All-World UCITS ETF",
                "ter": 0.22,
                "trackingDifference5Y": 0.02,
                "isAccumulating": True,
                "topHoldings": [
                    {"name": "NVIDIA Corp.", "weight": 4.5},
                    {"name": "Apple Inc.", "weight": 4.0},
                    {"name": "Microsoft Corp.", "weight": 3.8},
                    {"name": "Amazon.com Inc.", "weight": 2.5}
                ],
                "countryBreakdown": {"United States": 61.5, "Japan": 6.2, "United Kingdom": 3.8},
                "sectorBreakdown": {"Technology": 24.5, "Financials": 15.2},
                "historicalStatsCurvo": {"cagr": 10.4, "stdev": 14.8, "maxDrawdown": -33.6}
            },
            "QDVE": {
                "ticker": "QDVE",
                "name": "iShares S&P 500 Information Technology Sector UCITS ETF",
                "ter": 0.15,
                "trackingDifference5Y": -0.12,
                "isAccumulating": True,
                "topHoldings": [
                    {"name": "Apple Inc.", "weight": 21.0},
                    {"name": "Microsoft Corp.", "weight": 20.0},
                    {"name": "NVIDIA Corp.", "weight": 21.5}
                ],
                "countryBreakdown": {"United States": 100.0},
                "sectorBreakdown": {"Technology": 100.0},
                "historicalStatsCurvo": {"cagr": 21.2, "stdev": 20.5, "maxDrawdown": -31.2}
            },
            "VHYL": {
                "ticker": "VHYL",
                "name": "Vanguard FTSE All-World High Dividend Yield UCITS ETF",
                "ter": 0.29,
                "trackingDifference5Y": 0.08,
                "isAccumulating": False,
                "topHoldings": [
                    {"name": "Broadcom Inc.", "weight": 2.8},
                    {"name": "JPMorgan Chase & Co.", "weight": 2.5}
                ],
                "countryBreakdown": {"United States": 42.0, "United Kingdom": 7.5},
                "sectorBreakdown": {"Financials": 25.0, "Consumer": 12.0},
                "historicalStatsCurvo": {"cagr": 7.8, "stdev": 13.5, "maxDrawdown": -28.0}
            }
        }

    def test_zero_weights_returns_error(self):
        res = calculate_portfolio_overlap({"VWCE": 0, "QDVE": 0}, self.mock_etfs)
        self.assertIn("error", res)

    def test_single_etf_overlap(self):
        res = calculate_portfolio_overlap({"VWCE": 100}, self.mock_etfs)
        summary = res["summary"]
        self.assertEqual(summary["weightedTER"], 0.22)
        self.assertEqual(summary["accumulatingShare"], 100.0)
        self.assertEqual(summary["etfCount"], 1)

    def test_weighted_metrics_calculation(self):
        # 50% VWCE (TER 0.22) + 50% QDVE (TER 0.15) => weighted TER = 0.185
        res = calculate_portfolio_overlap({"VWCE": 50, "QDVE": 50}, self.mock_etfs)
        summary = res["summary"]
        self.assertAlmostEqual(summary["weightedTER"], 0.185, places=3)
        self.assertAlmostEqual(summary["weightedTrackingDifference"], -0.05, places=2)
        self.assertEqual(summary["accumulatingShare"], 100.0)

    def test_distributing_fund_detection(self):
        # 50% VWCE (Acc) + 50% VHYL (Dist) => 50% Acc
        res = calculate_portfolio_overlap({"VWCE": 50, "VHYL": 50}, self.mock_etfs)
        summary = res["summary"]
        self.assertAlmostEqual(summary["accumulatingShare"], 50.0, places=1)
        # Check warning about distributing fund
        warnings = [w for w in res["warnings"] if "Dividend" in w["title"] or "Distributing" in w.get("message", "")]
        self.assertTrue(len(warnings) > 0)

    def test_stock_concentration_alert(self):
        # 20% VWCE + 80% QDVE produces heavy Apple/Microsoft/NVIDIA concentration
        res = calculate_portfolio_overlap({"VWCE": 20, "QDVE": 80}, self.mock_etfs)
        summary = res["summary"]
        self.assertGreater(summary["top3StockWeight"], 50.0)
        warnings = [w for w in res["warnings"] if "Concentration" in w["title"]]
        self.assertTrue(len(warnings) > 0)

    def test_curvo_simulation_growth(self):
        inputs = {
            "initialDeposit": 10000,
            "monthlyDca": 500,
            "years": 10,
            "inflation": 2.0,
            "portfolio": {"VWCE": 100}
        }
        res = calculate_curvo_portfolio_simulation(inputs, self.mock_etfs)
        self.assertIn("curvoMetrics", res)
        self.assertIn("results", res)
        self.assertIn("growthTimeline", res)
        
        results = res["results"]
        # Total invested: 10,000 + (500 * 120) = 70,000
        self.assertEqual(results["totalInvested"], 70000)
        # Nominal value should exceed invested capital given positive CAGR
        self.assertGreater(results["finalNominalValue"], 70000)
        self.assertGreater(results["finalRealValue"], results["totalInvested"])

    def test_projection_uses_each_funds_own_return(self):
        # Regression: the engine read cagr10Y/volatility10Y, which no dataset entry has, so every
        # portfolio was projected at the same default 8.5%.
        base = {"initialDeposit": 10000, "monthlyDca": 500, "years": 10, "inflation": 2.0}
        world = calculate_curvo_portfolio_simulation({**base, "portfolio": {"VWCE": 100}}, self.mock_etfs)
        tech = calculate_curvo_portfolio_simulation({**base, "portfolio": {"QDVE": 100}}, self.mock_etfs)
        self.assertEqual(world["curvoMetrics"]["cagrPercent"], 10.4)
        self.assertEqual(tech["curvoMetrics"]["cagrPercent"], 21.2)
        self.assertGreater(tech["results"]["finalNominalValue"], world["results"]["finalNominalValue"])

    def test_funds_without_statistics_are_named_not_defaulted(self):
        res = calculate_curvo_portfolio_simulation({"years": 5, "portfolio": {"VWCE": 50, "NOSTATS": 50}}, self.mock_etfs)
        self.assertEqual(res["missingStats"], ["NOSTATS"])
        self.assertEqual(res["curvoMetrics"]["cagrPercent"], 10.4)  # the covered part, not a blend with a default
        self.assertIn("error", calculate_curvo_portfolio_simulation({"portfolio": {"NOSTATS": 100}}, self.mock_etfs))


class TestDcaBacktest(unittest.TestCase):
    """The DCA plan on real (here: synthetic) prices."""

    @staticmethod
    def history(prices_by_ticker, start=date(2020, 1, 3)):
        return {"instruments": {t: {"start": start.isoformat(), "lastDate": (start + timedelta(weeks=len(v) - 1)).isoformat(), "values": v}
                                for t, v in prices_by_ticker.items()}}

    def test_flat_prices_return_exactly_the_deposits(self):
        h = self.history({"A": [100.0] * 160})
        res = calculate_dca_backtest({"A": 100}, 1000, 100, 2, 0, history=h)
        self.assertTrue(res["available"])
        self.assertEqual(res["months"], 24)
        self.assertEqual(res["deposits"], 1000 + 100 * 24)
        self.assertEqual(res["finalValue"], res["deposits"])
        self.assertEqual(res["maxDrawdown"], 0.0)

    def test_growth_and_a_capped_window(self):
        weekly = [100 * 1.002 ** i for i in range(120)]  # ~2.3 years of steady growth
        res = calculate_dca_backtest({"A": 100}, 1000, 0, 10, 0, history=self.history({"A": weekly}))
        self.assertTrue(res["capped"])  # asked for 10 years, history has ~2
        self.assertGreater(res["finalValue"], 1000)
        self.assertAlmostEqual(res["cagr"], (1.002 ** (365.25 / 7) - 1) * 100, delta=0.6)

    def test_missing_history_is_reported(self):
        res = calculate_dca_backtest({"A": 50, "B": 50}, 1000, 100, 5, 0, history=self.history({"A": [100.0] * 60}))
        self.assertFalse(res["available"])
        self.assertIn("B", res["reason"])


if __name__ == "__main__":
    unittest.main()
