"""
Unit tests for ApexETF Quantitative Analysis & Portfolio Calculation Engine
"""

import unittest
from apex_etf.analysis import calculate_portfolio_overlap, calculate_curvo_portfolio_simulation

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
                "curvoMetrics": {"cagr10Y": 10.4, "volatility10Y": 14.8, "maxDrawdown": -33.6}
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
                "curvoMetrics": {"cagr10Y": 21.2, "volatility10Y": 20.5, "maxDrawdown": -31.2}
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
                "curvoMetrics": {"cagr10Y": 7.8, "volatility10Y": 13.5, "maxDrawdown": -28.0}
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

if __name__ == "__main__":
    unittest.main()
