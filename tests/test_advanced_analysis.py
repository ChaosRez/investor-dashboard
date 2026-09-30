"""
Unit tests for ApexETF Advanced Robust Portfolio Optimization,
Regime Stress-Testing, and Quant Downside Analytics.
"""

import unittest
from apex_etf.analysis import (
    REGIME_TAXONOMY,
    REGIME_PRESETS,
    HISTORICAL_CRISES,
    build_asset_covariance_matrix,
    calculate_hierarchical_risk_parity,
    calculate_equal_risk_contribution,
    calculate_mean_cvar,
    calculate_covariance_shrinkage,
    calculate_robust_portfolio_optimization,
    calculate_crisis_stress_test,
    calculate_quantstats_downside_tear_sheet,
    generate_quant_code_snippets,
    get_platforms_metadata
)

class TestAdvancedAnalysisSuite(unittest.TestCase):
    def setUp(self):
        self.mock_etfs = {
            "VWCE": {
                "ticker": "VWCE",
                "name": "Vanguard FTSE All-World",
                "historicalStatsCurvo": {"cagr": 9.6, "stdev": 15.1, "maxDrawdown": -33.6}
            },
            "AGGU": {
                "ticker": "AGGU",
                "name": "iShares Core Global Aggregate Bond",
                "historicalStatsCurvo": {"cagr": 3.4, "stdev": 5.8, "maxDrawdown": -17.2}
            },
            "XEON": {
                "ticker": "XEON",
                "name": "Xtrackers II EUR Overnight Rate Swap",
                "historicalStatsCurvo": {"cagr": 2.1, "stdev": 0.8, "maxDrawdown": -0.1}
            },
            "SGLD": {
                "ticker": "SGLD",
                "name": "Invesco Physical Gold",
                "historicalStatsCurvo": {"cagr": 8.4, "stdev": 13.8, "maxDrawdown": -21.4}
            }
        }
        self.correlations = {
            "matrix": {
                "VWCE": {"VWCE": 1.0, "AGGU": 0.12, "XEON": 0.01, "SGLD": 0.06},
                "AGGU": {"VWCE": 0.12, "AGGU": 1.0, "XEON": 0.05, "SGLD": 0.18},
                "XEON": {"VWCE": 0.01, "AGGU": 0.05, "XEON": 1.0, "SGLD": 0.00},
                "SGLD": {"VWCE": 0.06, "AGGU": 0.18, "XEON": 0.00, "SGLD": 1.0}
            }
        }

    def test_taxonomy_and_presets_integrity(self):
        self.assertIn("growth_equity", REGIME_TAXONOMY)
        self.assertIn("fixed_income", REGIME_TAXONOMY)
        self.assertIn("liquidity_cash", REGIME_TAXONOMY)
        self.assertIn("real_assets", REGIME_TAXONOMY)

        self.assertIn("classic_60_40", REGIME_PRESETS)
        self.assertIn("all_weather", REGIME_PRESETS)
        self.assertIn("permanent", REGIME_PRESETS)
        self.assertIn("golden_butterfly", REGIME_PRESETS)

        self.assertEqual(len(HISTORICAL_CRISES), 5)
        crisis_ids = [c["id"] for c in HISTORICAL_CRISES]
        self.assertIn("dot_com_2000", crisis_ids)
        self.assertIn("gfc_2008", crisis_ids)
        self.assertIn("fed_hiking_2022", crisis_ids)

    def test_build_asset_covariance_matrix(self):
        res = build_asset_covariance_matrix(["VWCE", "AGGU", "SGLD"], self.mock_etfs, self.correlations)
        self.assertEqual(res["tickers"], ["VWCE", "AGGU", "SGLD"])
        self.assertEqual(res["volatilities"]["VWCE"], 15.1)
        self.assertEqual(res["volatilities"]["AGGU"], 5.8)
        self.assertEqual(res["correlations"]["VWCE"]["AGGU"], 0.12)
        cov = res["covarianceMatrix"]
        self.assertEqual(len(cov), 3)
        self.assertEqual(len(cov[0]), 3)
        # Cov(VWCE, AGGU) = 15.1 * 5.8 * 0.12 = 10.5096
        self.assertAlmostEqual(cov[0][1], 15.1 * 5.8 * 0.12, places=2)

    def test_hierarchical_risk_parity(self):
        res = calculate_hierarchical_risk_parity(["VWCE", "AGGU", "SGLD"], self.mock_etfs, self.correlations)
        self.assertIn("weights", res)
        weights = res["weights"]
        # Sum of weights should be approximately 100%
        self.assertAlmostEqual(sum(weights.values()), 100.0, places=1)
        self.assertTrue(all(w >= 0 for w in weights.values()))
        self.assertIn("tree", res)
        self.assertIn("seriatedOrder", res)
        self.assertIn("portfolioVolatility", res)
        self.assertIn("percentageRiskContributions", res)

    def test_equal_risk_contribution_parity(self):
        # Two assets: VWCE (vol 15.1) and AGGU (vol 5.8)
        res = calculate_equal_risk_contribution(["VWCE", "AGGU"], self.mock_etfs, self.correlations)
        weights = res["weights"]
        rc = res["percentageRiskContributions"]
        self.assertAlmostEqual(sum(weights.values()), 100.0, places=1)
        # Risk contribution should be balanced ~50% each
        self.assertAlmostEqual(rc["VWCE"], 50.0, delta=1.0)
        self.assertAlmostEqual(rc["AGGU"], 50.0, delta=1.0)
        # Lower volatility asset (AGGU) gets higher nominal weight
        self.assertGreater(weights["AGGU"], weights["VWCE"])

    def test_mean_cvar_tail_minimization(self):
        res = calculate_mean_cvar(["VWCE", "AGGU", "SGLD"], self.mock_etfs)
        self.assertIn("weights", res)
        self.assertAlmostEqual(sum(res["weights"].values()), 100.0, places=1)
        self.assertIn("cvar95", res)
        self.assertGreater(res["cvar95"], 0.0)

    def test_covariance_shrinkage(self):
        res = calculate_covariance_shrinkage(["VWCE", "AGGU", "SGLD"], self.mock_etfs, self.correlations)
        self.assertIn("shrinkageIntensity", res)
        self.assertGreater(res["shrinkageIntensity"], 0.0)
        self.assertIn("shrunkCovariance", res)

    def test_master_robust_optimization_suite(self):
        res = calculate_robust_portfolio_optimization(["VWCE", "AGGU", "SGLD"], self.mock_etfs, self.correlations)
        self.assertIn("methods", res)
        methods = res["methods"]
        self.assertIn("hrp", methods)
        self.assertIn("equalRiskContribution", methods)
        self.assertIn("meanCvar", methods)
        self.assertIn("inverseVolatility", methods)
        self.assertIn("equalWeight", methods)
        self.assertIn("markowitzMeanVariance", methods)
        self.assertIn("shrinkage", res)

    def test_crisis_stress_test_and_guardrail(self):
        # 100% Equity portfolio (high drawdown in 2008 Lehman)
        portfolio = {"VWCE": 100}
        res = calculate_crisis_stress_test(portfolio, self.mock_etfs, behavioral_tolerance=-20.0)
        self.assertEqual(len(res["crises"]), 5)
        # 2008 Lehman was -54.3%, which exceeds -20.0% tolerance
        self.assertTrue(res["toleranceBreached"])
        self.assertGreater(res["recommendedCashShift"], 0)
        self.assertIn("⚠️", res["remedyAdvice"])

        # Permanent portfolio (25 Stocks, 25 Bonds, 25 Cash, 25 Gold) should have much lower drawdown
        perm_portfolio = {"VWCE": 25, "AGGU": 25, "XEON": 25, "SGLD": 25}
        perm_res = calculate_crisis_stress_test(perm_portfolio, self.mock_etfs, behavioral_tolerance=-25.0)
        self.assertFalse(perm_res["toleranceBreached"])
        self.assertIn("✅", perm_res["remedyAdvice"])

    def test_quantstats_downside_tear_sheet(self):
        portfolio = {"VWCE": 60, "AGGU": 40}
        res = calculate_quantstats_downside_tear_sheet(portfolio, self.mock_etfs)
        self.assertIn("metrics", res)
        m = res["metrics"]
        self.assertIn("cagr", m)
        self.assertIn("annualizedVolatility", m)
        self.assertIn("sharpeRatio", m)
        self.assertIn("sortinoRatio", m)
        self.assertIn("calmarRatio", m)
        self.assertIn("maxDrawdown", m)
        self.assertIn("tailRatio", m)
        self.assertIn("var95Monthly", m)
        self.assertIn("cvar95Monthly", m)
        self.assertIn("cdar95", m)
        self.assertIn("ulcerIndex", m)
        self.assertIn("swr30Y", m)
        self.assertIn("regimeCoverage", res)

    def test_code_snippets_generator(self):
        portfolio = {"VWCE": 60, "AGGU": 40}
        snippets = generate_quant_code_snippets(portfolio)
        self.assertIn("pyportfolioopt", snippets)
        self.assertIn("riskfolio", snippets)
        self.assertIn("quantstats", snippets)
        self.assertIn("HRPOpt", snippets["pyportfolioopt"])
        self.assertIn("rp.Portfolio", snippets["riskfolio"])
        self.assertIn("qs.reports.html", snippets["quantstats"])

    def test_platforms_metadata(self):
        platforms = get_platforms_metadata({"VWCE": 60, "AGGU": 40})
        self.assertEqual(len(platforms), 6)
        ids = [p["id"] for p in platforms]
        self.assertIn("portfoliovisualizer", ids)
        self.assertIn("testfolio", ids)
        self.assertIn("portfoliocharts", ids)
        self.assertIn("pyportfolioopt", ids)
        self.assertIn("riskfolio", ids)
        self.assertIn("quantstats", ids)

if __name__ == "__main__":
    unittest.main()
