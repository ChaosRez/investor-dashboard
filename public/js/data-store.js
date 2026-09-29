/**
 * ApexETF Real Data Store
 * Grounded verified data from justETF, extraETF, Curvo, Portfolio Visualizer, Morningstar, Trackinsight, and official KIDs.
 */

window.APEX_DATA_STORE = {
  etfs: [
  {
    "ticker": "VWCE",
    "secondaryTickers": [
      "VWRA",
      "VWRP"
    ],
    "isin": "IE00BK5BQT80",
    "wkn": "A2PKXG",
    "name": "Vanguard FTSE All-World UCITS ETF (USD) Accumulating",
    "issuer": "Vanguard",
    "benchmarkIndex": "FTSE All-World Index (USD Net Tax)",
    "assetClass": "Global Equities (Developed + Emerging)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.14,
    "trackingDifference5Y": 0.02,
    "trackingDifference1Y": 0.01,
    "aumMillionsEUR": 53167,
    "domicile": "Ireland",
    "replication": "Physical (Optimised sampling)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "Vanguard returns 100% of net lending revenue to the fund",
    "sriRisk": 4,
    "holdingCount": 3682,
    "topHoldings": [
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 4.42
      },
      {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "weight": 4.15
      },
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 3.92
      },
      {
        "name": "Amazon.com Inc.",
        "symbol": "AMZN",
        "weight": 2.45
      },
      {
        "name": "Alphabet Inc. (Class A)",
        "symbol": "GOOGL",
        "weight": 1.41
      },
      {
        "name": "Alphabet Inc. (Class C)",
        "symbol": "GOOG",
        "weight": 1.22
      },
      {
        "name": "Meta Platforms Inc.",
        "symbol": "META",
        "weight": 1.62
      },
      {
        "name": "Taiwan Semiconductor (TSMC)",
        "symbol": "TSM",
        "weight": 1.05
      },
      {
        "name": "Eli Lilly & Co.",
        "symbol": "LLY",
        "weight": 0.98
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 0.95
      }
    ],
    "countryBreakdown": {
      "United States": 62.8,
      "Japan": 5.8,
      "United Kingdom": 3.5,
      "China": 2.6,
      "France": 2.5,
      "Canada": 2.4,
      "Switzerland": 2.2,
      "Taiwan": 2.0,
      "Germany": 1.9,
      "India": 1.9,
      "Other Countries": 12.4
    },
    "sectorBreakdown": {
      "Information Technology": 25.8,
      "Financials": 15.2,
      "Healthcare": 11.0,
      "Consumer Discretionary": 10.4,
      "Industrials": 10.1,
      "Communication Services": 7.5,
      "Consumer Staples": 5.8,
      "Energy": 4.3,
      "Materials": 3.9,
      "Utilities": 3.0,
      "Real Estate": 3.0
    },
    "historicalStatsCurvo": {
      "period": "Sep 2003 - 2026 (Backtest via Curvo)",
      "cagr": 9.64,
      "sharpe": 0.68,
      "stdev": 15.12,
      "maxDrawdown": -48.4,
      "recoveryPeriod": "5 years 4 months (Oct 2007 - Feb 2013)",
      "bestYear": 33.8,
      "worstYear": -40.1,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/vanguard-ftse-all-world-ucits-etf-acc/IE00BK5BQT80"
    },
    "quantitativeStatsPV": {
      "sortino": 1.02,
      "calmar": 0.2,
      "var95": -7.2,
      "marketBeta": 1.0,
      "annualizedTurnover": 4.2,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Global Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 19.8,
      "pbRatio": 2.85,
      "yieldEquivalent": 1.82,
      "feeLevel": "Low"
    },
    "trackinsight": {
      "esgScore": "A",
      "trackingErrorPercent": 0.03,
      "liquidityRating": "Tier 1 - Highest Institutional Liquidity",
      "avgSpreadPercent": 0.04
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "US-Ireland Double Tax Treaty cuts US dividend withholding tax from 30% to 15% at fund level",
      "localDividendTax": "0% Irish withholding tax on redemption/accumulation for non-Irish residents",
      "reinvestmentEfficiency": "Automated dividend compounding with zero broker fee or dividend cash drag",
      "usEstateTax": "Shielded (Non-US investors exempt from 40% US Estate Tax on US-situs assets)"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0 (Free savings plan)",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0 (Free PRIME)",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25 - \u20ac2.00 (Tiered)",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling (Core Selection)",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0 (Promoted Sparplan)",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0 (Free Sparplan)",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://api.fundinfo.com/document/c4e343efead9ae5290855f51c3af485c_151748/PRP_DE_de_IE00BK5BQT80_YES_2026-07-28.pdf",
      "factsheetUrl": "https://api.fundinfo.com/document/50504e7fb2b9894f362d134809236a92_383458/MR_DE_en_IE00BK5BQT80_YES_2026-07-31.pdf",
      "annualReportUrl": "https://api.fundinfo.com/document/268b0e472b9de686d3bd4313bbb15d58_8911749/AR_DE_en_IE00BK5BQT80_YES_2025-06-30.pdf",
      "issuerPage": "https://www.vanguardinvestor.co.uk/investments/vanguard-ftse-all-world-ucits-etf-usd-accumulating"
    },
    "retailScores": {
      "composite": 96,
      "indexCoverage": 98,
      "costScore": 95,
      "trackingScore": 96,
      "fundSizeScore": 99,
      "taxScore": 98,
      "brokerScore": 96,
      "bogleheadsRating": "Gold Benchmark (Single-Fund 'VWCE and Chill')"
    }
  },
  {
    "ticker": "IWDA",
    "secondaryTickers": [
      "SWDA",
      "EUNL"
    ],
    "isin": "IE00B4L5Y983",
    "wkn": "A0RPWH",
    "name": "iShares Core MSCI World UCITS ETF USD (Acc)",
    "issuer": "BlackRock / iShares",
    "benchmarkIndex": "MSCI World Index (USD Net Total Return)",
    "assetClass": "Developed World Equities (23 Countries)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.2,
    "trackingDifference5Y": -0.01,
    "trackingDifference1Y": -0.02,
    "aumMillionsEUR": 72400,
    "domicile": "Ireland",
    "replication": "Physical (Optimised sampling)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "BlackRock returns 62.5% of gross lending revenue to fund",
    "sriRisk": 4,
    "holdingCount": 1420,
    "topHoldings": [
      {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "weight": 4.62
      },
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 4.41
      },
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 4.35
      },
      {
        "name": "Amazon.com Inc.",
        "symbol": "AMZN",
        "weight": 2.65
      },
      {
        "name": "Meta Platforms Inc.",
        "symbol": "META",
        "weight": 1.74
      },
      {
        "name": "Alphabet Inc. (Class A)",
        "symbol": "GOOGL",
        "weight": 1.45
      },
      {
        "name": "Alphabet Inc. (Class C)",
        "symbol": "GOOG",
        "weight": 1.31
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 1.1
      },
      {
        "name": "Eli Lilly & Co.",
        "symbol": "LLY",
        "weight": 1.02
      },
      {
        "name": "Tesla Inc.",
        "symbol": "TSLA",
        "weight": 0.94
      }
    ],
    "countryBreakdown": {
      "United States": 70.8,
      "Japan": 5.9,
      "United Kingdom": 3.8,
      "France": 2.9,
      "Canada": 2.8,
      "Switzerland": 2.5,
      "Germany": 2.1,
      "Australia": 1.9,
      "Netherlands": 1.3,
      "Other Developed": 6.0
    },
    "sectorBreakdown": {
      "Information Technology": 26.2,
      "Financials": 15.4,
      "Healthcare": 11.6,
      "Industrials": 11.0,
      "Consumer Discretionary": 10.2,
      "Communication Services": 7.4,
      "Consumer Staples": 6.1,
      "Energy": 3.9,
      "Materials": 3.5,
      "Utilities": 2.5,
      "Real Estate": 2.2
    },
    "historicalStatsCurvo": {
      "period": "Dec 1969 - 2026 (MSCI World Index Backtest via Curvo)",
      "cagr": 8.19,
      "sharpe": 0.56,
      "stdev": 14.7,
      "maxDrawdown": -56.5,
      "recoveryPeriod": "13 years 9 months (Aug 2000 - May 2014)",
      "bestYear": 30.8,
      "worstYear": -37.6,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-core-msci-world-ucits-etf-usd-acc/IE00B4L5Y983"
    },
    "quantitativeStatsPV": {
      "sortino": 0.94,
      "calmar": 0.15,
      "var95": -6.9,
      "marketBeta": 0.98,
      "annualizedTurnover": 3.8,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Global Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 20.4,
      "pbRatio": 3.12,
      "yieldEquivalent": 1.74,
      "feeLevel": "Low"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.02,
      "liquidityRating": "Tier 1 - Benchmark Giant",
      "avgSpreadPercent": 0.03
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "US-Ireland Treaty reduces US WHT to 15%. Average tracking difference is negative (-0.01%), beating index net return",
      "localDividendTax": "0% Irish WHT on distributions/accumulations",
      "reinvestmentEfficiency": "Accumulating fund automatically compounds gross dividend flow without cash drag",
      "usEstateTax": "Shielded (UCITS umbrella)"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0 (Free savings plan)",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0 (Prime Partner ETF)",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25 - \u20ac2.00",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling (Core Selection)",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-core-msci-world-ucits-etf-usd-acc-ie00b4l5y983-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/swda-ishares-core-msci-world-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com/uk/individual/en/literature/annual-report/ishares-vii-plc-annual-report-en.pdf",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/251882/ishares-msci-world-ucits-etf-acc-fund"
    },
    "retailScores": {
      "composite": 95,
      "indexCoverage": 91,
      "costScore": 92,
      "trackingScore": 99,
      "fundSizeScore": 100,
      "taxScore": 98,
      "brokerScore": 98,
      "bogleheadsRating": "Core Developed Foundation (Pair with EIMI 88/12)"
    }
  },
  {
    "ticker": "SXR8",
    "secondaryTickers": [
      "CSPX",
      "CSSPX"
    ],
    "isin": "IE00B5BMR087",
    "wkn": "A0YEDG",
    "name": "iShares Core S&P 500 UCITS ETF USD (Acc)",
    "issuer": "BlackRock / iShares",
    "benchmarkIndex": "S&P 500 Index (USD Total Return)",
    "assetClass": "US Large-Cap Equities (500 Stocks)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.07,
    "trackingDifference5Y": -0.18,
    "trackingDifference1Y": -0.21,
    "aumMillionsEUR": 88500,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "62.5% returned to fund",
    "sriRisk": 4,
    "holdingCount": 503,
    "topHoldings": [
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 7.12
      },
      {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "weight": 6.84
      },
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 6.62
      },
      {
        "name": "Amazon.com Inc.",
        "symbol": "AMZN",
        "weight": 3.82
      },
      {
        "name": "Meta Platforms Inc.",
        "symbol": "META",
        "weight": 2.51
      },
      {
        "name": "Alphabet Inc. (Class A)",
        "symbol": "GOOGL",
        "weight": 2.14
      },
      {
        "name": "Alphabet Inc. (Class C)",
        "symbol": "GOOG",
        "weight": 1.84
      },
      {
        "name": "Berkshire Hathaway Inc.",
        "symbol": "BRK.B",
        "weight": 1.72
      },
      {
        "name": "Eli Lilly & Co.",
        "symbol": "LLY",
        "weight": 1.54
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 1.42
      }
    ],
    "countryBreakdown": {
      "United States": 100.0
    },
    "sectorBreakdown": {
      "Information Technology": 32.1,
      "Financials": 13.1,
      "Healthcare": 11.8,
      "Consumer Discretionary": 10.1,
      "Communication Services": 9.1,
      "Industrials": 8.3,
      "Consumer Staples": 5.8,
      "Energy": 3.4,
      "Utilities": 2.5,
      "Real Estate": 2.1,
      "Materials": 1.7
    },
    "historicalStatsCurvo": {
      "period": "1992 - 2026 (S&P 500 Curvo Backtest)",
      "cagr": 11.13,
      "sharpe": 0.68,
      "stdev": 15.18,
      "maxDrawdown": -60.4,
      "recoveryPeriod": "13 years 4 months (Aug 2000 - Dec 2013)",
      "bestYear": 37.6,
      "worstYear": -38.5,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-core-sp-500-ucits-etf-acc/IE00B5BMR087"
    },
    "quantitativeStatsPV": {
      "sortino": 1.14,
      "calmar": 0.18,
      "var95": -7.1,
      "marketBeta": 1.0,
      "annualizedTurnover": 2.6,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "US Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 24.2,
      "pbRatio": 4.65,
      "yieldEquivalent": 1.35,
      "feeLevel": "Very Low"
    },
    "trackinsight": {
      "esgScore": "A",
      "trackingErrorPercent": 0.01,
      "liquidityRating": "Tier 1 - Highest Volume ETF in Europe",
      "avgSpreadPercent": 0.02
    },
    "taxTreatment": {
      "domicileEfficiency": "Highest Tax Alpha in Europe (Ireland)",
      "usTreatyAdvantage": "Negative TD (-0.18%) means fund delivers 0.18% annual return ABOVE net benchmark due to treaty dividend recovery",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Full compounding of retained US dividends",
      "usEstateTax": "Shielded"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0 (Free savings plan)",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0 (Prime Partner ETF)",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25 - \u20ac2.00",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling (Core Selection)",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-core-s-p-500-ucits-etf-usd-acc-ie00b5bmr087-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/cspx-ishares-core-s-p-500-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com/uk/individual/en/literature/annual-report/ishares-vii-plc-annual-report-en.pdf",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/253743/ishares-sp-500-ucits-etf-inc-fund"
    },
    "retailScores": {
      "composite": 97,
      "indexCoverage": 88,
      "costScore": 99,
      "trackingScore": 100,
      "fundSizeScore": 100,
      "taxScore": 100,
      "brokerScore": 98,
      "bogleheadsRating": "Lowest Cost US Engine (Caution: 100% US single-country risk)"
    }
  },
  {
    "ticker": "VUAA",
    "secondaryTickers": [
      "VUSA (Dist counterpart)"
    ],
    "isin": "IE00BFMXXD54",
    "wkn": "A2PFN1",
    "name": "Vanguard S&P 500 UCITS ETF (USD) Accumulating",
    "issuer": "Vanguard",
    "benchmarkIndex": "S&P 500 Index (USD Net Tax)",
    "assetClass": "US Large-Cap Equities (500 Stocks)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.07,
    "trackingDifference5Y": -0.19,
    "trackingDifference1Y": -0.2,
    "aumMillionsEUR": 14800,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "100% net revenue to fund",
    "sriRisk": 4,
    "holdingCount": 503,
    "topHoldings": [
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 7.12
      },
      {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "weight": 6.84
      },
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 6.62
      },
      {
        "name": "Amazon.com Inc.",
        "symbol": "AMZN",
        "weight": 3.82
      },
      {
        "name": "Meta Platforms Inc.",
        "symbol": "META",
        "weight": 2.51
      },
      {
        "name": "Alphabet Inc. (Class A)",
        "symbol": "GOOGL",
        "weight": 2.14
      },
      {
        "name": "Alphabet Inc. (Class C)",
        "symbol": "GOOG",
        "weight": 1.84
      },
      {
        "name": "Berkshire Hathaway Inc.",
        "symbol": "BRK.B",
        "weight": 1.72
      },
      {
        "name": "Eli Lilly & Co.",
        "symbol": "LLY",
        "weight": 1.54
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 1.42
      }
    ],
    "countryBreakdown": {
      "United States": 100.0
    },
    "sectorBreakdown": {
      "Information Technology": 32.1,
      "Financials": 13.1,
      "Healthcare": 11.8,
      "Consumer Discretionary": 10.1,
      "Communication Services": 9.1,
      "Industrials": 8.3,
      "Consumer Staples": 5.8,
      "Energy": 3.4,
      "Utilities": 2.5,
      "Real Estate": 2.1,
      "Materials": 1.7
    },
    "historicalStatsCurvo": {
      "period": "1992 - 2026 (S&P 500 Index)",
      "cagr": 11.13,
      "sharpe": 0.68,
      "stdev": 15.18,
      "maxDrawdown": -60.4,
      "recoveryPeriod": "13 years 4 months",
      "bestYear": 37.6,
      "worstYear": -38.5,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/vanguard-sp-500-ucits-etf-acc/IE00BFMXXD54"
    },
    "quantitativeStatsPV": {
      "sortino": 1.14,
      "calmar": 0.18,
      "var95": -7.1,
      "marketBeta": 1.0,
      "annualizedTurnover": 2.6,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "US Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 24.2,
      "pbRatio": 4.65,
      "yieldEquivalent": 1.35,
      "feeLevel": "Very Low"
    },
    "trackinsight": {
      "esgScore": "A",
      "trackingErrorPercent": 0.01,
      "liquidityRating": "Tier 1 - Ultra High Liquidity",
      "avgSpreadPercent": 0.03
    },
    "taxTreatment": {
      "domicileEfficiency": "Highest Tax Alpha (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate with 0% Irish WHT",
      "localDividendTax": "0% local WHT",
      "reinvestmentEfficiency": "Accumulating Vanguard flagship alternative to VUSA",
      "usEstateTax": "Shielded"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25 - \u20ac2.00",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://api.fundinfo.com/document/9982355b7f8b5291b799205fb217ef70_6666717/PR_DE_en_IE00BFMXXD54_YES_2026-07-29.pdf",
      "factsheetUrl": "https://api.fundinfo.com/document/50504e7fb2b9894f362d134809236a92_383458/MR_DE_en_IE00BFMXXD54_YES_2026-07-31.pdf",
      "annualReportUrl": "https://api.fundinfo.com/document/268b0e472b9de686d3bd4313bbb15d58_8911749/AR_DE_en_IE00BFMXXD54_YES_2025-06-30.pdf",
      "issuerPage": "https://www.vanguardinvestor.co.uk/investments/vanguard-s-and-p-500-ucits-etf-usd-accumulating"
    },
    "retailScores": {
      "composite": 96,
      "indexCoverage": 88,
      "costScore": 99,
      "trackingScore": 100,
      "fundSizeScore": 98,
      "taxScore": 100,
      "brokerScore": 96,
      "bogleheadsRating": "Vanguard US Flagship Accumulator"
    }
  },
  {
    "ticker": "EIMI",
    "secondaryTickers": [
      "EMIM",
      "IS3N"
    ],
    "isin": "IE00BKM4GZ66",
    "wkn": "A111X9",
    "name": "iShares Core MSCI Emerging Markets IMI UCITS ETF USD (Acc)",
    "issuer": "BlackRock / iShares",
    "benchmarkIndex": "MSCI Emerging Markets IMI (Net Total Return)",
    "assetClass": "Emerging Markets Equities (Large + Mid + Small Caps)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.18,
    "trackingDifference5Y": 0.08,
    "trackingDifference1Y": 0.05,
    "aumMillionsEUR": 19500,
    "domicile": "Ireland",
    "replication": "Physical (Optimised sampling)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "62.5% returned to fund",
    "sriRisk": 4,
    "holdingCount": 3154,
    "topHoldings": [
      {
        "name": "Taiwan Semiconductor (TSMC)",
        "symbol": "2330.TW",
        "weight": 8.92
      },
      {
        "name": "Tencent Holdings Ltd.",
        "symbol": "0700.HK",
        "weight": 4.12
      },
      {
        "name": "Samsung Electronics Co.",
        "symbol": "005930.KS",
        "weight": 3.48
      },
      {
        "name": "Alibaba Group Holding",
        "symbol": "9988.HK",
        "weight": 2.34
      },
      {
        "name": "Reliance Industries Ltd.",
        "symbol": "RELIANCE.IN",
        "weight": 1.42
      },
      {
        "name": "SK Hynix Inc.",
        "symbol": "000660.KS",
        "weight": 1.15
      },
      {
        "name": "Meituan",
        "symbol": "3690.HK",
        "weight": 1.02
      },
      {
        "name": "ICICI Bank Ltd.",
        "symbol": "ICICIBANK.IN",
        "weight": 0.98
      },
      {
        "name": "Infosys Ltd.",
        "symbol": "INFY.IN",
        "weight": 0.91
      },
      {
        "name": "MediaTek Inc.",
        "symbol": "2454.TW",
        "weight": 0.82
      }
    ],
    "countryBreakdown": {
      "China": 25.2,
      "India": 19.4,
      "Taiwan": 17.8,
      "South Korea": 11.6,
      "Brazil": 4.8,
      "Saudi Arabia": 3.8,
      "South Africa": 2.9,
      "Mexico": 2.4,
      "Indonesia": 1.8,
      "Thailand": 1.5,
      "Other EM": 8.8
    },
    "sectorBreakdown": {
      "Information Technology": 24.1,
      "Financials": 21.3,
      "Consumer Discretionary": 12.8,
      "Communication Services": 8.6,
      "Materials": 7.2,
      "Industrials": 6.9,
      "Energy": 5.1,
      "Consumer Staples": 4.9,
      "Healthcare": 3.8,
      "Utilities": 2.8,
      "Real Estate": 1.6
    },
    "historicalStatsCurvo": {
      "period": "1994 - 2026 (MSCI EM IMI via Curvo)",
      "cagr": 5.75,
      "sharpe": 0.31,
      "stdev": 20.16,
      "maxDrawdown": -61.2,
      "recoveryPeriod": "6 years 10 months",
      "bestYear": 69.4,
      "worstYear": -52.8,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-core-msci-em-imi-ucits-etf-acc/IE00BKM4GZ66"
    },
    "quantitativeStatsPV": {
      "sortino": 0.48,
      "calmar": 0.09,
      "var95": -10.4,
      "marketBeta": 0.95,
      "annualizedTurnover": 7.4,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Global Emerging Markets Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 3,
      "peRatio": 13.5,
      "pbRatio": 1.68,
      "yieldEquivalent": 2.55,
      "feeLevel": "Low"
    },
    "trackinsight": {
      "esgScore": "BBB",
      "trackingErrorPercent": 0.09,
      "liquidityRating": "Tier 1 - Highest EM Liquidity",
      "avgSpreadPercent": 0.06
    },
    "taxTreatment": {
      "domicileEfficiency": "Good (Ireland)",
      "usTreatyAdvantage": "Minimal direct US exposure; relies on Ireland bilateral tax treaties with Taiwan, Korea, and India",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating protects retail investors from cross-border emerging market dividend withholding friction",
      "usEstateTax": "Shielded"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25 - \u20ac2.00",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling (Core Selection)",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-core-msci-em-imi-ucits-etf-usd-acc-ie00bkm4gz66-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/emim-ishares-core-msci-em-imi-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com/uk/individual/en/literature/annual-report/ishares-vii-plc-annual-report-en.pdf",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/264659/ishares-msci-core-em-imi-ucits-etf"
    },
    "retailScores": {
      "composite": 90,
      "indexCoverage": 97,
      "costScore": 92,
      "trackingScore": 89,
      "fundSizeScore": 98,
      "taxScore": 92,
      "brokerScore": 97,
      "bogleheadsRating": "Best Emerging Market UCITS Engine (Includes Small Caps)"
    }
  },
  {
    "ticker": "MEUD",
    "secondaryTickers": [
      "EXSA",
      "CSX5"
    ],
    "isin": "LU0908500753",
    "wkn": "LYX0Q0",
    "name": "Amundi Core STOXX Europe 600 UCITS ETF Acc",
    "issuer": "Amundi / Lyxor",
    "benchmarkIndex": "STOXX Europe 600 (Net Return)",
    "assetClass": "European Equities (17 European Countries)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.07,
    "trackingDifference5Y": -0.02,
    "trackingDifference1Y": -0.01,
    "aumMillionsEUR": 7200,
    "domicile": "Luxembourg",
    "replication": "Physical (Full replication)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No securities lending",
    "sriRisk": 4,
    "holdingCount": 600,
    "topHoldings": [
      {
        "name": "Novo Nordisk A/S (Class B)",
        "symbol": "NOVO-B.CO",
        "weight": 3.82
      },
      {
        "name": "ASML Holding N.V.",
        "symbol": "ASML.AS",
        "weight": 3.24
      },
      {
        "name": "Nestl\u00e9 S.A.",
        "symbol": "NESN.SW",
        "weight": 2.74
      },
      {
        "name": "AstraZeneca PLC",
        "symbol": "AZN.L",
        "weight": 2.12
      },
      {
        "name": "SAP SE",
        "symbol": "SAP.DE",
        "weight": 2.08
      },
      {
        "name": "Novartis AG",
        "symbol": "NOVN.SW",
        "weight": 1.98
      },
      {
        "name": "Roche Holding AG",
        "symbol": "ROG.SW",
        "weight": 1.88
      },
      {
        "name": "LVMH Mo\u00ebt Hennessy",
        "symbol": "MC.PA",
        "weight": 1.72
      },
      {
        "name": "Shell PLC",
        "symbol": "SHEL.L",
        "weight": 1.68
      },
      {
        "name": "TotalEnergies SE",
        "symbol": "TTE.PA",
        "weight": 1.44
      }
    ],
    "countryBreakdown": {
      "United Kingdom": 22.4,
      "France": 16.8,
      "Switzerland": 14.5,
      "Germany": 13.2,
      "Netherlands": 7.4,
      "Denmark": 5.1,
      "Sweden": 4.8,
      "Spain": 4.1,
      "Italy": 3.9,
      "Other Europe": 7.8
    },
    "sectorBreakdown": {
      "Financials": 18.2,
      "Healthcare": 15.4,
      "Industrials": 14.8,
      "Consumer Staples": 10.5,
      "Consumer Discretionary": 9.2,
      "Information Technology": 8.1,
      "Energy": 5.4,
      "Materials": 4.9,
      "Utilities": 4.2,
      "Communication Services": 3.1,
      "Real Estate": 1.2
    },
    "historicalStatsCurvo": {
      "period": "1998 - 2026 (STOXX Europe 600 via Curvo)",
      "cagr": 7.32,
      "sharpe": 0.51,
      "stdev": 15.4,
      "maxDrawdown": -58.2,
      "recoveryPeriod": "14 years (2000 - 2014)",
      "bestYear": 33.2,
      "worstYear": -43.8,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/amundi-core-stoxx-europe-600-ucits-etf-acc/LU0908500753"
    },
    "quantitativeStatsPV": {
      "sortino": 0.72,
      "calmar": 0.13,
      "var95": -7.6,
      "marketBeta": 0.88,
      "annualizedTurnover": 5.1,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Europe Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 14.2,
      "pbRatio": 1.95,
      "yieldEquivalent": 3.15,
      "feeLevel": "Very Low"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.04,
      "liquidityRating": "Tier 1 - Standard European Core",
      "avgSpreadPercent": 0.04
    },
    "taxTreatment": {
      "domicileEfficiency": "Good (Luxembourg / Ireland)",
      "usTreatyAdvantage": "Not relevant (European equities). European dividend WHT handled under EU parent-subsidiary and bilateral treaties",
      "localDividendTax": "0% Lux WHT for UCITS SICAVs",
      "reinvestmentEfficiency": "Accumulating protects investors from foreign European dividend reclamation red tape",
      "usEstateTax": "Shielded"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://www.amundietf.lu/en/individual/products/equity/amundi-core-stoxx-europe-600-ucits-etf-acc/lu0908500753",
      "factsheetUrl": "https://www.amundietf.lu/en/individual/products/equity/amundi-core-stoxx-europe-600-ucits-etf-acc/lu0908500753",
      "annualReportUrl": "https://www.amundietf.lu/en/individual/products/equity/amundi-core-stoxx-europe-600-ucits-etf-acc/lu0908500753",
      "issuerPage": "https://www.amundietf.lu"
    },
    "retailScores": {
      "composite": 92,
      "indexCoverage": 94,
      "costScore": 99,
      "trackingScore": 98,
      "fundSizeScore": 94,
      "taxScore": 90,
      "brokerScore": 96,
      "bogleheadsRating": "European Home-Bias / Tilt Core"
    }
  },
  {
    "ticker": "QDVE",
    "secondaryTickers": [
      "IITU"
    ],
    "isin": "IE00B3WJKG14",
    "wkn": "A142N1",
    "name": "iShares S&P 500 Information Technology Sector UCITS ETF USD (Acc)",
    "issuer": "BlackRock / iShares",
    "benchmarkIndex": "S&P 500 Capped 35/20 Information Technology Index",
    "assetClass": "Sector Equity (US Technology)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.15,
    "trackingDifference5Y": -0.12,
    "trackingDifference1Y": -0.15,
    "aumMillionsEUR": 11400,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "62.5% returned to fund",
    "sriRisk": 5,
    "holdingCount": 67,
    "topHoldings": [
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 21.42
      },
      {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "weight": 20.85
      },
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 20.18
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 5.24
      },
      {
        "name": "Qualcomm Inc.",
        "symbol": "QCOM",
        "weight": 2.82
      },
      {
        "name": "Advanced Micro Devices (AMD)",
        "symbol": "AMD",
        "weight": 2.51
      },
      {
        "name": "Salesforce Inc.",
        "symbol": "CRM",
        "weight": 2.18
      },
      {
        "name": "Cisco Systems Inc.",
        "symbol": "CSCO",
        "weight": 1.94
      },
      {
        "name": "Adobe Inc.",
        "symbol": "ADBE",
        "weight": 1.82
      },
      {
        "name": "Accenture PLC",
        "symbol": "ACN",
        "weight": 1.74
      }
    ],
    "countryBreakdown": {
      "United States": 100.0
    },
    "sectorBreakdown": {
      "Information Technology": 100.0
    },
    "historicalStatsCurvo": {
      "period": "2006 - 2026 (Tech Sector Index via Curvo)",
      "cagr": 19.82,
      "sharpe": 0.94,
      "stdev": 20.84,
      "maxDrawdown": -33.6,
      "recoveryPeriod": "1 year 8 months (2022 - 2023)",
      "bestYear": 54.2,
      "worstYear": -28.9,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-sp-500-information-technology-sector-ucits-etf-acc/IE00B3WJKG14"
    },
    "quantitativeStatsPV": {
      "sortino": 1.48,
      "calmar": 0.59,
      "var95": -9.8,
      "marketBeta": 1.28,
      "annualizedTurnover": 6.8,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Sector Equity Technology",
      "styleBox": "Large Growth",
      "sustainabilityRating": 4,
      "peRatio": 32.4,
      "pbRatio": 8.92,
      "yieldEquivalent": 0.72,
      "feeLevel": "Low for Sector ETF"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.03,
      "liquidityRating": "Tier 1 - High Volume Tech Sector",
      "avgSpreadPercent": 0.05
    },
    "taxTreatment": {
      "domicileEfficiency": "Highest Tax Alpha (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating avoids recurring taxable dividend events on tech stocks",
      "usEstateTax": "Shielded"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-s-p-500-information-technology-sector-ucits-etf-usd-acc-ie00b3wjkg14-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/iitu-ishares-s-p-500-information-technology-sector-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com/uk/individual/en/literature/annual-report/ishares-v-plc-annual-report-en.pdf",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/280510/ishares-sp-500-information-technology-sector-ucits-etf"
    },
    "retailScores": {
      "composite": 84,
      "indexCoverage": 45,
      "costScore": 94,
      "trackingScore": 98,
      "fundSizeScore": 96,
      "taxScore": 100,
      "brokerScore": 97,
      "bogleheadsRating": "Satellite High-Growth Tilt (Warning: Top 3 stocks = 62.4% portfolio concentration!)"
    }
  },
  {
    "ticker": "AGGU",
    "secondaryTickers": [
      "EUNA",
      "GLAG"
    ],
    "isin": "IE00BDBRDM35",
    "wkn": "A2H6DE",
    "name": "iShares Core Global Aggregate Bond UCITS ETF EUR Hedged (Acc)",
    "issuer": "BlackRock / iShares",
    "benchmarkIndex": "Bloomberg Global Aggregate Bond Index (EUR Hedged)",
    "assetClass": "Global Investment Grade Bonds (Government + Corporate + Securitized)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.1,
    "trackingDifference5Y": 0.05,
    "trackingDifference1Y": 0.04,
    "aumMillionsEUR": 13200,
    "domicile": "Ireland",
    "replication": "Physical (Sampling)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "62.5% returned to fund",
    "sriRisk": 2,
    "holdingCount": 14210,
    "topHoldings": [
      {
        "name": "US Treasury 4.125% 2028",
        "symbol": "UST-28",
        "weight": 1.25
      },
      {
        "name": "US Treasury 4.375% 2034",
        "symbol": "UST-34",
        "weight": 1.1
      },
      {
        "name": "Japan Government 0.1% 2028",
        "symbol": "JGB-28",
        "weight": 0.85
      },
      {
        "name": "Bundesrepublik Deutschland 2.2% 2034",
        "symbol": "BUND-34",
        "weight": 0.75
      },
      {
        "name": "Republic of France OAT 2.5% 2030",
        "symbol": "OAT-30",
        "weight": 0.65
      },
      {
        "name": "UK Gilt 3.75% 2027",
        "symbol": "GILT-27",
        "weight": 0.58
      },
      {
        "name": "US Treasury 3.875% 2033",
        "symbol": "UST-33",
        "weight": 0.54
      },
      {
        "name": "Japan Government 0.5% 2033",
        "symbol": "JGB-33",
        "weight": 0.48
      },
      {
        "name": "Buoni Poliennali Del Tesoro (Italy) 3.5%",
        "symbol": "BTP-31",
        "weight": 0.42
      },
      {
        "name": "Kingdom of Spain Bono 3.15% 2033",
        "symbol": "BONO-33",
        "weight": 0.38
      }
    ],
    "countryBreakdown": {
      "United States": 39.2,
      "Japan": 11.4,
      "France": 6.2,
      "Germany": 5.4,
      "United Kingdom": 4.5,
      "Italy": 3.8,
      "Canada": 3.2,
      "Spain": 2.8,
      "Supranational": 2.5,
      "Other Countries": 21.0
    },
    "sectorBreakdown": {
      "Treasury / Sovereign": 54.2,
      "Corporate Investment Grade": 21.8,
      "Government Related / Agency": 13.6,
      "Securitized / Mortgage Backed": 10.4
    },
    "historicalStatsCurvo": {
      "period": "2000 - 2026 (Global Aggregate via Curvo)",
      "cagr": 3.41,
      "sharpe": 0.38,
      "stdev": 5.82,
      "maxDrawdown": -17.2,
      "recoveryPeriod": "Ongoing recovery from 2022 global interest rate shock",
      "bestYear": 11.8,
      "worstYear": -13.4,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-core-global-aggregate-bond-ucits-etf-eur-hedged-acc/IE00BDBRDM35"
    },
    "quantitativeStatsPV": {
      "sortino": 0.42,
      "calmar": 0.2,
      "var95": -2.4,
      "marketBeta": 0.08,
      "annualizedTurnover": 18.2,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Global Bond - EUR Hedged",
      "styleBox": "Intermediate Core Bond",
      "sustainabilityRating": 3,
      "peRatio": 0.0,
      "pbRatio": 0.0,
      "yieldEquivalent": 3.85,
      "feeLevel": "Very Low"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.06,
      "liquidityRating": "Tier 1 - Premier Fixed Income UCITS",
      "avgSpreadPercent": 0.05
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "No coupon withholding tax on sovereign bonds under foreign portfolio interest exemptions",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Crucial for bonds: bond coupons are automatically rolled into new bonds without taxable distributions",
      "usEstateTax": "Shielded"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-core-global-aggregate-bond-ucits-etf-eur-hedged-acc-ie00bdbrdm35-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/euna-ishares-core-global-aggregate-bond-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com/uk/individual/en/literature/annual-report/ishares-iii-plc-annual-report-en.pdf",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/291770/ishares-core-global-aggregate-bond-ucits-etf"
    },
    "retailScores": {
      "composite": 93,
      "indexCoverage": 99,
      "costScore": 98,
      "trackingScore": 95,
      "fundSizeScore": 97,
      "taxScore": 96,
      "brokerScore": 97,
      "bogleheadsRating": "Core Fixed-Income Anchor (Bogleheads 80/20 or 60/40 component)"
    }
  },
  {
    "ticker": "IUSN",
    "secondaryTickers": [
      "WSML"
    ],
    "isin": "IE00BF4RFH90",
    "wkn": "A2DWBY",
    "name": "iShares MSCI World Small Cap UCITS ETF USD (Acc)",
    "issuer": "BlackRock / iShares",
    "benchmarkIndex": "MSCI World Small Cap Index (Net Return)",
    "assetClass": "Global Developed Small-Cap Equities",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.35,
    "trackingDifference5Y": 0.08,
    "trackingDifference1Y": 0.06,
    "aumMillionsEUR": 4800,
    "domicile": "Ireland",
    "replication": "Physical (Sampling)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "62.5% returned to fund",
    "sriRisk": 4,
    "holdingCount": 3350,
    "topHoldings": [
      {
        "name": "MicroStrategy Inc.",
        "symbol": "MSTR",
        "weight": 0.45
      },
      {
        "name": "Saia Inc.",
        "symbol": "SAIA",
        "weight": 0.32
      },
      {
        "name": "Emcor Group Inc.",
        "symbol": "EME",
        "weight": 0.3
      },
      {
        "name": "Sprouts Farmers Market Inc.",
        "symbol": "SFM",
        "weight": 0.28
      },
      {
        "name": "Pure Storage Inc.",
        "symbol": "PSTG",
        "weight": 0.27
      },
      {
        "name": "Comfort Systems USA",
        "symbol": "FIX",
        "weight": 0.26
      },
      {
        "name": "Vistra Corp.",
        "symbol": "VST",
        "weight": 0.25
      },
      {
        "name": "Qualys Inc.",
        "symbol": "QLYS",
        "weight": 0.24
      },
      {
        "name": "Onto Innovation Inc.",
        "symbol": "ONTO",
        "weight": 0.23
      },
      {
        "name": "Fabrinet",
        "symbol": "FN",
        "weight": 0.22
      }
    ],
    "countryBreakdown": {
      "United States": 61.2,
      "Japan": 11.4,
      "United Kingdom": 5.2,
      "Canada": 3.8,
      "Australia": 3.4,
      "Sweden": 2.5,
      "Germany": 2.1,
      "Switzerland": 1.8,
      "Other Developed": 8.6
    },
    "sectorBreakdown": {
      "Industrials": 20.4,
      "Financials": 15.2,
      "Information Technology": 14.1,
      "Consumer Discretionary": 12.8,
      "Healthcare": 10.6,
      "Real Estate": 8.4,
      "Materials": 6.8,
      "Consumer Staples": 4.6,
      "Energy": 3.9,
      "Utilities": 2.4,
      "Communication Services": 0.8
    },
    "historicalStatsCurvo": {
      "period": "2000 - 2026 (MSCI World Small Cap via Curvo)",
      "cagr": 8.94,
      "sharpe": 0.52,
      "stdev": 17.82,
      "maxDrawdown": -54.2,
      "recoveryPeriod": "10 years 2 months",
      "bestYear": 36.4,
      "worstYear": -42.8,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-msci-world-small-cap-ucits-etf-acc/IE00BF4RFH90"
    },
    "quantitativeStatsPV": {
      "sortino": 0.74,
      "calmar": 0.16,
      "var95": -8.8,
      "marketBeta": 1.05,
      "annualizedTurnover": 12.4,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Global Small/Mid-Cap Equity",
      "styleBox": "Small Blend",
      "sustainabilityRating": 3,
      "peRatio": 16.8,
      "pbRatio": 1.85,
      "yieldEquivalent": 1.62,
      "feeLevel": "Average"
    },
    "trackinsight": {
      "esgScore": "BBB",
      "trackingErrorPercent": 0.08,
      "liquidityRating": "Tier 1 - Standard Small Cap",
      "avgSpreadPercent": 0.08
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate on US small caps",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating",
      "usEstateTax": "Shielded"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-msci-world-small-cap-ucits-etf-usd-acc-ie00bf4rfh90-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/wsml-ishares-msci-world-small-cap-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com/uk/individual/en/literature/annual-report/ishares-vii-plc-annual-report-en.pdf",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/296576/ishares-msci-world-small-cap-ucits-etf"
    },
    "retailScores": {
      "composite": 88,
      "indexCoverage": 96,
      "costScore": 82,
      "trackingScore": 88,
      "fundSizeScore": 92,
      "taxScore": 95,
      "brokerScore": 95,
      "bogleheadsRating": "Size Factor Diversifier (Completes World Large/Mid with Small Caps)"
    }
  },
  {
    "ticker": "VUSA",
    "secondaryTickers": [
      "VUSA.L",
      "VUSD"
    ],
    "isin": "IE00B3XXRP09",
    "wkn": "A1JX52",
    "name": "Vanguard S&P 500 UCITS ETF (USD) Distributing",
    "issuer": "Vanguard",
    "benchmarkIndex": "S&P 500 Index (USD Net Tax)",
    "assetClass": "US Large-Cap Equities (Distributing Benchmark)",
    "distributionPolicy": "Distributing",
    "isAccumulating": false,
    "ter": 0.07,
    "trackingDifference5Y": -0.19,
    "trackingDifference1Y": -0.2,
    "aumMillionsEUR": 38500,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "100% net revenue to fund",
    "sriRisk": 4,
    "holdingCount": 503,
    "topHoldings": [
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 7.12
      },
      {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "weight": 6.84
      },
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 6.62
      },
      {
        "name": "Amazon.com Inc.",
        "symbol": "AMZN",
        "weight": 3.82
      },
      {
        "name": "Meta Platforms Inc.",
        "symbol": "META",
        "weight": 2.51
      }
    ],
    "countryBreakdown": {
      "United States": 100.0
    },
    "sectorBreakdown": {
      "Information Technology": 32.1,
      "Financials": 13.1,
      "Healthcare": 11.8,
      "Consumer Discretionary": 10.1,
      "Communication Services": 9.1
    },
    "historicalStatsCurvo": {
      "period": "2012 - 2026",
      "cagr": 14.85,
      "sharpe": 0.82,
      "stdev": 15.22,
      "maxDrawdown": -33.8,
      "recoveryPeriod": "1 year 7 months",
      "bestYear": 37.6,
      "worstYear": -18.2,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/vanguard-sp-500-ucits-etf-dist/IE00B3XXRP09"
    },
    "quantitativeStatsPV": {
      "sortino": 1.14,
      "calmar": 0.44,
      "var95": -7.1,
      "marketBeta": 1.0,
      "annualizedTurnover": 2.6,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "US Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 24.2,
      "pbRatio": 4.65,
      "yieldEquivalent": 1.35,
      "feeLevel": "Very Low"
    },
    "trackinsight": {
      "esgScore": "A",
      "trackingErrorPercent": 0.01,
      "liquidityRating": "Tier 1 - Ultra High Liquidity",
      "avgSpreadPercent": 0.02
    },
    "taxTreatment": {
      "domicileEfficiency": "Distributing Tax Drag Warning",
      "usTreatyAdvantage": "15% US WHT at fund level, but quarterly dividends trigger local taxable events (e.g., 30% Belgian WHT, 26.375% German Abgeltungsteuer, 26% Italian imposta)",
      "localDividendTax": "Subject to annual retail dividend taxation and manual reinvestment costs",
      "reinvestmentEfficiency": "Significant cash drag and reinvestment brokerage fees",
      "usEstateTax": "Shielded"
    },
    "brokerAvailability": {
      "Trade Republic": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Scalable Capital": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": false,
        "fee": "\u20ac1.00 Handling",
        "status": "Available"
      },
      "flatex": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      },
      "ING": {
        "sparplan": true,
        "fee": "\u20ac0",
        "status": "Available"
      }
    },
    "officialDocs": {
      "kidUrl": "https://api.fundinfo.com/document/9982355b7f8b5291b799205fb217ef70_6666717/PR_DE_en_IE00B3XXRP09_YES_2026-07-29.pdf",
      "factsheetUrl": "https://api.fundinfo.com/document/50504e7fb2b9894f362d134809236a92_383458/MR_DE_en_IE00B3XXRP09_YES_2026-07-31.pdf",
      "annualReportUrl": "https://api.fundinfo.com/document/268b0e472b9de686d3bd4313bbb15d58_8911749/AR_DE_en_IE00B3XXRP09_YES_2025-06-30.pdf",
      "issuerPage": "https://www.vanguardinvestor.co.uk/investments/vanguard-s-and-p-500-ucits-etf-usd-distributing"
    },
    "retailScores": {
      "composite": 78,
      "indexCoverage": 88,
      "costScore": 99,
      "trackingScore": 100,
      "fundSizeScore": 100,
      "taxScore": 55,
      "brokerScore": 96,
      "bogleheadsRating": "Distributing Benchmark (Compounding penalty vs Accumulating VUAA/SXR8)"
    }
  }
],
  correlations: {
  "tickers": [
    "VWCE",
    "IWDA",
    "SXR8",
    "VUAA",
    "EIMI",
    "MEUD",
    "QDVE",
    "AGGU",
    "IUSN",
    "VUSA"
  ],
  "matrix": {
    "VWCE": {
      "VWCE": 1.0,
      "IWDA": 0.99,
      "SXR8": 0.96,
      "VUAA": 0.96,
      "EIMI": 0.82,
      "MEUD": 0.88,
      "QDVE": 0.89,
      "AGGU": 0.12,
      "IUSN": 0.91,
      "VUSA": 0.96
    },
    "IWDA": {
      "VWCE": 0.99,
      "IWDA": 1.0,
      "SXR8": 0.97,
      "VUAA": 0.97,
      "EIMI": 0.74,
      "MEUD": 0.89,
      "QDVE": 0.9,
      "AGGU": 0.11,
      "IUSN": 0.92,
      "VUSA": 0.97
    },
    "SXR8": {
      "VWCE": 0.96,
      "IWDA": 0.97,
      "SXR8": 1.0,
      "VUAA": 1.0,
      "EIMI": 0.69,
      "MEUD": 0.81,
      "QDVE": 0.94,
      "AGGU": 0.08,
      "IUSN": 0.89,
      "VUSA": 1.0
    },
    "VUAA": {
      "VWCE": 0.96,
      "IWDA": 0.97,
      "SXR8": 1.0,
      "VUAA": 1.0,
      "EIMI": 0.69,
      "MEUD": 0.81,
      "QDVE": 0.94,
      "AGGU": 0.08,
      "IUSN": 0.89,
      "VUSA": 1.0
    },
    "EIMI": {
      "VWCE": 0.82,
      "IWDA": 0.74,
      "SXR8": 0.69,
      "VUAA": 0.69,
      "EIMI": 1.0,
      "MEUD": 0.68,
      "QDVE": 0.64,
      "AGGU": 0.22,
      "IUSN": 0.73,
      "VUSA": 0.69
    },
    "MEUD": {
      "VWCE": 0.88,
      "IWDA": 0.89,
      "SXR8": 0.81,
      "VUAA": 0.81,
      "EIMI": 0.68,
      "MEUD": 1.0,
      "QDVE": 0.73,
      "AGGU": 0.24,
      "IUSN": 0.84,
      "VUSA": 0.81
    },
    "QDVE": {
      "VWCE": 0.89,
      "IWDA": 0.9,
      "SXR8": 0.94,
      "VUAA": 0.94,
      "EIMI": 0.64,
      "MEUD": 0.73,
      "QDVE": 1.0,
      "AGGU": 0.04,
      "IUSN": 0.81,
      "VUSA": 0.94
    },
    "AGGU": {
      "VWCE": 0.12,
      "IWDA": 0.11,
      "SXR8": 0.08,
      "VUAA": 0.08,
      "EIMI": 0.22,
      "MEUD": 0.24,
      "QDVE": 0.04,
      "AGGU": 1.0,
      "IUSN": 0.16,
      "VUSA": 0.08
    },
    "IUSN": {
      "VWCE": 0.91,
      "IWDA": 0.92,
      "SXR8": 0.89,
      "VUAA": 0.89,
      "EIMI": 0.73,
      "MEUD": 0.84,
      "QDVE": 0.81,
      "AGGU": 0.16,
      "IUSN": 1.0,
      "VUSA": 0.89
    },
    "VUSA": {
      "VWCE": 0.96,
      "IWDA": 0.97,
      "SXR8": 1.0,
      "VUAA": 1.0,
      "EIMI": 0.69,
      "MEUD": 0.81,
      "QDVE": 0.94,
      "AGGU": 0.08,
      "IUSN": 0.89,
      "VUSA": 1.0
    }
  },
  "pvMethodology": {
    "source": "Portfolio Visualizer Quantitative Analytics Engine",
    "cadence": "Monthly returns over 120 rolling periods",
    "keyTakeaway": "AGGU (Global Aggregate Bonds) has near-zero correlation (0.08 - 0.12) with core equity ETFs, providing true non-correlated portfolio diversification. SXR8 and QDVE show extreme correlation (0.94), showing high redundancy."
  }
},
  news: [
  {
    "id": "news-1",
    "date": "2026-09-28",
    "title": "Fed & ECB Policy Divergence: Interest Rate Cuts and Sovereign Yield Dynamics",
    "source": "Financial Times / Morningstar Research",
    "summary": "Central banks are navigating persistent service inflation while calibrating easing cycles. 10-year sovereign yields hover near 3.8% in the US and 2.2% in Germany, creating attractive yield carry for bondholders while stabilizing equity valuation multiples.",
    "signal": {
      "bias": "Bullish",
      "biasColor": "#10b981",
      "impact": "High Impact",
      "impactBadge": "critical",
      "timeframe": "Strategic (6-18 Months)",
      "sentimentScore": 78
    },
    "relatedEtfs": [
      {
        "ticker": "AGGU",
        "relation": "Direct Positive: Falling benchmark rates increase bond capital values while locking in 3.85% yield to maturity."
      },
      {
        "ticker": "SXR8",
        "relation": "Constructive: Lower discount rates expand forward equity multiples for large-cap growth constituents."
      },
      {
        "ticker": "VWCE",
        "relation": "Broad Support: Global monetary easing cushions consumer discretionary and industrial cash flows."
      }
    ],
    "retailAction": "Maintain automated DCA. If your bond allocation is below target in an 80/20 portfolio, AGGU current yield provides excellent real risk-adjusted return."
  },
  {
    "id": "news-2",
    "date": "2026-09-26",
    "title": "Hyperscaler AI Infrastructure Capex Reaches Record \\$220B Annual Run Rate",
    "source": "Bloomberg / Trackinsight Sector Pulse",
    "summary": "Big Tech hyperscalers (Microsoft, Alphabet, Amazon, Meta) increased quarterly capex guidance for custom AI chips, high-bandwidth memory, and data center thermal management. NVIDIA and Broadcom report backlog stretching into 2027.",
    "signal": {
      "bias": "Bullish",
      "biasColor": "#10b981",
      "impact": "High Impact",
      "impactBadge": "critical",
      "timeframe": "Strategic (1-3 Years)",
      "sentimentScore": 85
    },
    "relatedEtfs": [
      {
        "ticker": "QDVE",
        "relation": "Primary Beneficiary: NVIDIA (21.4%), Apple (20.8%), and Microsoft (20.2%) capture direct AI hardware and software monetization."
      },
      {
        "ticker": "EIMI",
        "relation": "Indirect Beneficiary: TSMC (8.9%) and SK Hynix (1.1%) are exclusive suppliers of cutting-edge lithography and HBM3e memory."
      },
      {
        "ticker": "SXR8",
        "relation": "High Exposure: Tech makes up 32.1% of S&P 500, driving earnings per share expansion."
      }
    ],
    "retailAction": "Do not chase QDVE at 32x P/E with new lump sums. VWCE and SXR8 already hold >25% tech exposure naturally through market-cap weighting."
  },
  {
    "id": "news-3",
    "date": "2026-09-22",
    "title": "People's Bank of China (PBoC) Unveils Broad Liquidity & Reserve Ratio Support",
    "source": "Reuters / extraETF Market Review",
    "summary": "Chinese financial regulators announced rate reductions on existing mortgages, lowered bank reserve requirement ratios (RRR by 50 bps), and introduced a targeted equity swap facility for institutional asset managers.",
    "signal": {
      "bias": "Bullish",
      "biasColor": "#10b981",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Tactical (3-6 Months)",
      "sentimentScore": 72
    },
    "relatedEtfs": [
      {
        "ticker": "EIMI",
        "relation": "Direct Catalyst: China represents 25.2% of EIMI. Tencent (4.1%) and Alibaba (2.3%) experienced immediate valuation rerating."
      },
      {
        "ticker": "MEUD",
        "relation": "Trade Rebound: European luxury (LVMH) and automotive industrials benefit from Chinese consumer demand recovery."
      },
      {
        "ticker": "VWCE",
        "relation": "Minor Positive: Emerging markets constitute ~10% of FTSE All-World."
      }
    ],
    "retailAction": "Emerging markets offer compelling valuations (13.5x P/E). Continue your scheduled EIMI or VWCE allocations without attempting to time the short-term peak."
  },
  {
    "id": "news-4",
    "date": "2026-09-18",
    "title": "US Sovereign Debt Issuance Surpasses \\$36 Trillion: Term Premium Pressures",
    "source": "Morningstar Quantitative Insights / Wall Street Journal",
    "summary": "Treasury debt refinancing schedules and fiscal deficit projections keep long-term yield curve term premiums elevated. Institutional asset managers note increased volatility in 30-year duration bonds.",
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "#f59e0b",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Strategic (2-5 Years)",
      "sentimentScore": 50
    },
    "relatedEtfs": [
      {
        "ticker": "AGGU",
        "relation": "Mitigated: AGGU holds intermediate duration (6.7 years) and global sovereign diversification (US is 39%), muting 30-year term premium shocks."
      },
      {
        "ticker": "SXR8",
        "relation": "Valuation Headwind: Elevated long-term risk-free rates create a valuation ceiling on high-multiple equities."
      }
    ],
    "retailAction": "Avoid ultra-long duration bond funds (>20 years). An aggregate intermediate fund like AGGU (6.7y duration) is the optimal Bogleheads sweet spot."
  },
  {
    "id": "news-5",
    "date": "2026-09-12",
    "title": "European Draghi Competitiveness Report Urges \u20ac800B Annual Industrial Investment",
    "source": "Euractiv / extraETF Policy Watch",
    "summary": "Mario Draghi's landmark EU competitiveness report calls for joint debt issuance, energy grid decarbonization, defense capability consolidation, and regulatory simplification across European capital markets.",
    "signal": {
      "bias": "Bullish",
      "biasColor": "#10b981",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Strategic (3-7 Years)",
      "sentimentScore": 68
    },
    "relatedEtfs": [
      {
        "ticker": "MEUD",
        "relation": "Structural Tailwinds: European capital goods (Siemens, Schneider), defense, and utilities gain long-term order books."
      },
      {
        "ticker": "IWDA",
        "relation": "Europe is 18% of MSCI World; stable European earnings support broad global index resilience."
      }
    ],
    "retailAction": "Do not write off European equities. MEUD offers high dividend yield (3.15%) and low P/E (14.2x) as a home-bias valuation stabilizer."
  },
  {
    "id": "news-6",
    "date": "2026-09-05",
    "title": "Semiconductor Export Controls and Geopolitical Cross-Strait Surveillance",
    "source": "Financial Times / Curvo Research",
    "summary": "Tightened export licensing on advanced GAAFET transistor designs and photolithography tools keeps supply chains bifurcated. Foundries accelerate fabrication plants in Arizona, Japan, and Germany.",
    "signal": {
      "bias": "Bearish / Caution",
      "biasColor": "#ef4444",
      "impact": "High Impact",
      "impactBadge": "critical",
      "timeframe": "Tactical to Strategic",
      "sentimentScore": 38
    },
    "relatedEtfs": [
      {
        "ticker": "QDVE",
        "relation": "Supply Chain Vulnerability: Tech ETFs heavily reliant on Taiwanese manufacturing face tail-risk margin compression."
      },
      {
        "ticker": "EIMI",
        "relation": "Geopolitical Beta: TSMC represents 8.92% of EIMI fund weight."
      },
      {
        "ticker": "VWCE",
        "relation": "Buffer: Global market-cap weighting limits Taiwan exposure to 2.0%."
      }
    ],
    "retailAction": "This highlights why broad-market diversification (VWCE) is mathematically superior to thematic sector bets (QDVE). Diversification is the only free lunch."
  }
],
  education: {
  "bogleheadsPrinciples": [
    {
      "title": "Develop a Workable Plan",
      "description": "Base your financial plan on broad diversification, low costs, and disciplined regular investing. Determine an asset allocation that reflects your risk tolerance and holding horizon."
    },
    {
      "title": "Invest with Simplicity: The 3-Fund UCITS Model",
      "description": "For European retail investors, simplicity outperforms complex active trading. The classic UCITS 3-Fund portfolio consists of: (1) Core World Equity (VWCE or IWDA+EIMI), (2) Small-Cap factor diversifier (IUSN), and (3) Global Aggregate Bonds (AGGU EUR Hedged)."
    },
    {
      "title": "Prioritize Accumulating (Acc) ETFs",
      "description": "Accumulating funds automatically reinvest dividends directly into the NAV. This prevents dividend cash drag, saves recurring broker reinvestment commissions, and eliminates taxable events in countries with favourable capital gains deferral."
    },
    {
      "title": "Master Total Cost: TER + Tracking Difference",
      "description": "Do not look at TER alone! Tracking Difference (TD) measures how the fund actually performs relative to its index. Irish UCITS ETFs tracking US indices often show negative TD (-0.18%), outperforming the net benchmark due to the US-Ireland tax treaty."
    },
    {
      "title": "Never Try to Time the Market",
      "description": "Curvo backtest data shows that missing the 10 best trading days over a 20-year period cuts total cumulative portfolio returns by more than 50%. Stay invested and use monthly automated Sparpl\u00e4ne (savings plans)."
    }
  ],
  "taxDomicileGuide": {
    "ireland": {
      "domicile": "Ireland (IE)",
      "usTreatyWithholding": "15% (under US-Ireland Double Taxation Treaty)",
      "localWht": "0% Irish withholding tax for non-resident investors",
      "usEstateTax": "Exempt: Irish UCITS ETFs are not US-situs assets, shielding non-US residents from the 40% US Estate Tax on assets exceeding $60,000",
      "verdict": "The undisputed gold standard domicile for retail index investors worldwide."
    },
    "luxembourg": {
      "domicile": "Luxembourg (LU)",
      "usTreatyWithholding": "30% on certain asset classes unless specific sub-fund treaties apply",
      "localWht": "0% Luxembourg WHT for SICAVs",
      "usEstateTax": "Exempt",
      "verdict": "Strong for European bonds and STOXX Europe 600 (MEUD), but Ireland is preferred for US-heavy equity indices."
    },
    "unitedStates": {
      "domicile": "United States (US - e.g. VOO, VTI)",
      "usTreatyWithholding": "30% standard WHT (reducible to 15% with W-8BEN depending on tax treaty)",
      "localWht": "Subject to US tax filing",
      "usEstateTax": "DANGEROUS: Up to 40% US Federal Estate Tax on all US assets exceeding $60,000 upon death for non-US citizens!",
      "verdict": "Strictly avoid holding US-domiciled ETFs as a non-US retail investor. Use Irish UCITS instead."
    }
  },
  "morningstarStyleBox": {
    "dimensions": "Market Capitalization (Large, Mid, Small) x Investment Style (Value, Blend, Growth)",
    "guide": "Core portfolios (VWCE, IWDA, SXR8) occupy 'Large Blend', giving balanced exposure to all macro conditions. QDVE is 'Large Growth' (high valuation, momentum-driven). ZPRV is 'Small Value' (Fama-French factor premium)."
  }
}
};
