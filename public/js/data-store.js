/**
 * ApexETF Grounded Data Store
 * Grounded in verified real-world metrics from justETF, extraETF, Curvo, Portfolio Visualizer,
 * Morningstar, Trackinsight, Yahoo Finance, and official issuer KIDs.
 * Last Synced: 2026-10-05T15:22:40.698420+00:00
 */

window.APEX_DATA_STORE = {
  syncMeta: {
    lastSyncedAt: "2026-10-05T15:22:40.698427+00:00",
    isLiveDynamic: true,
    sources: ["Yahoo Finance", "justETF", "extraETF", "Curvo.eu", "Portfolio Visualizer", "ECB", "MarketWatch"]
  },
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
    "aumMillionsEUR": 54126.0,
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
    },
    "lastSyncedAt": "2026-10-05T14:47:57.369757+00:00",
    "liveMarketData": {
      "livePrice": 172.96,
      "currency": "EUR",
      "previousClose": 171.14,
      "dayChange": 1.82,
      "dayChangePercent": 1.06,
      "fiftyTwoWeekHigh": 173.22,
      "fiftyTwoWeekLow": 138.24,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:47:57.369736+00:00",
      "lastPriceUpdated": "2026-10-05T14:47:57.369736+00:00"
    },
    "currentPriceEUR": 172.96,
    "dayChangePercent": 1.06,
    "fiftyTwoWeekHigh": 173.22,
    "fiftyTwoWeekLow": 138.24
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
    "aumMillionsEUR": 131854.0,
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
    },
    "lastSyncedAt": "2026-10-05T14:47:58.250261+00:00",
    "liveMarketData": {
      "livePrice": 131.23,
      "currency": "EUR",
      "previousClose": 130.05,
      "dayChange": 1.18,
      "dayChangePercent": 0.91,
      "fiftyTwoWeekHigh": 131.42,
      "fiftyTwoWeekLow": 106.13,
      "exchange": "Euronext Amsterdam",
      "marketTime": "2026-10-05T14:47:58.250122+00:00",
      "lastPriceUpdated": "2026-10-05T14:47:58.250122+00:00"
    },
    "currentPriceEUR": 131.23,
    "dayChangePercent": 0.91,
    "fiftyTwoWeekHigh": 131.42,
    "fiftyTwoWeekLow": 106.13
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
    "aumMillionsEUR": 138945.0,
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
    },
    "lastSyncedAt": "2026-10-05T14:47:59.231979+00:00",
    "liveMarketData": {
      "livePrice": 746.7,
      "currency": "EUR",
      "previousClose": 739.48,
      "dayChange": 7.22,
      "dayChangePercent": 0.98,
      "fiftyTwoWeekHigh": 748.0,
      "fiftyTwoWeekLow": 595.6,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:47:59.231940+00:00",
      "lastPriceUpdated": "2026-10-05T14:47:59.231940+00:00"
    },
    "currentPriceEUR": 746.7,
    "dayChangePercent": 0.98,
    "fiftyTwoWeekHigh": 748.0,
    "fiftyTwoWeekLow": 595.6,
    "isUserWatchlist": true
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
    "aumMillionsEUR": 32731.0,
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
    },
    "lastSyncedAt": "2026-10-05T14:47:59.911146+00:00",
    "liveMarketData": {
      "livePrice": 133.9,
      "currency": "EUR",
      "previousClose": 132.6,
      "dayChange": 1.3,
      "dayChangePercent": 0.98,
      "fiftyTwoWeekHigh": 134.1,
      "fiftyTwoWeekLow": 106.82,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:47:59.911101+00:00",
      "lastPriceUpdated": "2026-10-05T14:47:59.911101+00:00"
    },
    "currentPriceEUR": 133.9,
    "dayChangePercent": 0.98,
    "fiftyTwoWeekHigh": 134.1,
    "fiftyTwoWeekLow": 106.82
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
    "aumMillionsEUR": 40289.0,
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
    },
    "lastSyncedAt": "2026-10-05T14:48:00.519095+00:00",
    "liveMarketData": {
      "livePrice": 50.2,
      "currency": "EUR",
      "previousClose": 49.055,
      "dayChange": 1.145,
      "dayChangePercent": 2.33,
      "fiftyTwoWeekHigh": 51.03,
      "fiftyTwoWeekLow": 36.74,
      "exchange": "Euronext Amsterdam",
      "marketTime": "2026-10-05T14:48:00.519044+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:00.519044+00:00"
    },
    "currentPriceEUR": 50.2,
    "dayChangePercent": 2.33,
    "fiftyTwoWeekHigh": 51.03,
    "fiftyTwoWeekLow": 36.74
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
    "aumMillionsEUR": 20595.0,
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
    },
    "lastSyncedAt": "2026-10-05T14:48:01.370198+00:00",
    "liveMarketData": {
      "livePrice": 312.55,
      "currency": "EUR",
      "previousClose": 311.65,
      "dayChange": 0.9,
      "dayChangePercent": 0.29,
      "fiftyTwoWeekHigh": 326.7,
      "fiftyTwoWeekLow": 267.86,
      "exchange": "Euronext Paris",
      "marketTime": "2026-10-05T14:48:01.370160+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:01.370160+00:00"
    },
    "currentPriceEUR": 312.55,
    "dayChangePercent": 0.29,
    "fiftyTwoWeekHigh": 326.7,
    "fiftyTwoWeekLow": 267.86
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
    "aumMillionsEUR": 18693.0,
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
    },
    "lastSyncedAt": "2026-10-05T14:48:02.071775+00:00",
    "liveMarketData": {
      "livePrice": 49.085,
      "currency": "EUR",
      "previousClose": 48.505,
      "dayChange": 0.58,
      "dayChangePercent": 1.2,
      "fiftyTwoWeekHigh": 49.26,
      "fiftyTwoWeekLow": 31.88,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:02.071741+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:02.071741+00:00"
    },
    "currentPriceEUR": 49.085,
    "dayChangePercent": 1.2,
    "fiftyTwoWeekHigh": 49.26,
    "fiftyTwoWeekLow": 31.88
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
    "aumMillionsEUR": 2543.0,
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
    },
    "lastSyncedAt": "2026-10-05T14:48:02.706074+00:00",
    "liveMarketData": {
      "livePrice": 4.797,
      "currency": "EUR",
      "previousClose": 4.804,
      "dayChange": -0.007,
      "dayChangePercent": -0.15,
      "fiftyTwoWeekHigh": 5.03,
      "fiftyTwoWeekLow": 4.78,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:02.706035+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:02.706035+00:00"
    },
    "currentPriceEUR": 4.797,
    "dayChangePercent": -0.15,
    "fiftyTwoWeekHigh": 5.03,
    "fiftyTwoWeekLow": 4.78
  },
  {
    "ticker": "IUSN",
    "secondaryTickers": [
      "WSML"
    ],
    "isin": "IE00BF4RFH31",
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
    "aumMillionsEUR": 7895.0,
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
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-msci-world-small-cap-ucits-etf-acc/IE00BF4RFH31"
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
    },
    "lastSyncedAt": "2026-10-05T14:48:03.690585+00:00",
    "liveMarketData": {
      "livePrice": 9.144,
      "currency": "EUR",
      "previousClose": 9.076,
      "dayChange": 0.068,
      "dayChangePercent": 0.75,
      "fiftyTwoWeekHigh": 9.36,
      "fiftyTwoWeekLow": 7.26,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:03.690522+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:03.690522+00:00"
    },
    "currentPriceEUR": 9.144,
    "dayChangePercent": 0.75,
    "fiftyTwoWeekHigh": 9.36,
    "fiftyTwoWeekLow": 7.26
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
    "aumMillionsEUR": 47435.0,
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
      "Communication Services": 9.1,
      "Industrials": 8.3,
      "Consumer Staples": 5.8,
      "Energy": 3.4,
      "Utilities": 2.5,
      "Real Estate": 2.1,
      "Materials": 1.7
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
    },
    "lastSyncedAt": "2026-10-05T14:48:04.420445+00:00",
    "liveMarketData": {
      "livePrice": 131.1,
      "currency": "EUR",
      "previousClose": 129.853,
      "dayChange": 1.247,
      "dayChangePercent": 0.96,
      "fiftyTwoWeekHigh": 131.38,
      "fiftyTwoWeekLow": 105.03,
      "exchange": "Euronext Amsterdam",
      "marketTime": "2026-10-05T14:48:04.420417+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:04.420417+00:00"
    },
    "currentPriceEUR": 131.1,
    "dayChangePercent": 0.96,
    "fiftyTwoWeekHigh": 131.38,
    "fiftyTwoWeekLow": 105.03
  },
  {
    "ticker": "GGRA",
    "secondaryTickers": [
      "GGRP"
    ],
    "isin": "IE00BZ56SW52",
    "wkn": "A2AG1E",
    "name": "WisdomTree Global Quality Dividend Growth UCITS ETF USD Acc",
    "issuer": "WisdomTree",
    "benchmarkIndex": "WisdomTree Global Quality Dividend Growth Index",
    "assetClass": "Global Quality Factor Dividend Equities",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.38,
    "trackingDifference5Y": 0.05,
    "trackingDifference1Y": 0.03,
    "aumMillionsEUR": 654.0,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No securities lending",
    "sriRisk": 4,
    "holdingCount": 600,
    "topHoldings": [
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 5.12
      },
      {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "weight": 4.85
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 3.42
      },
      {
        "name": "Alphabet Inc. (Class A)",
        "symbol": "GOOGL",
        "weight": 2.74
      },
      {
        "name": "The Coca-Cola Co.",
        "symbol": "KO",
        "weight": 2.15
      },
      {
        "name": "Johnson & Johnson",
        "symbol": "JNJ",
        "weight": 2.05
      },
      {
        "name": "Procter & Gamble Co.",
        "symbol": "PG",
        "weight": 1.95
      },
      {
        "name": "AbbVie Inc.",
        "symbol": "ABBV",
        "weight": 1.88
      },
      {
        "name": "Novartis AG",
        "symbol": "NOVN.SW",
        "weight": 1.74
      },
      {
        "name": "Unilever PLC",
        "symbol": "ULVR.L",
        "weight": 1.62
      }
    ],
    "countryBreakdown": {
      "United States": 68.4,
      "Switzerland": 6.8,
      "United Kingdom": 5.4,
      "Japan": 4.2,
      "France": 3.8,
      "Other Countries": 11.4
    },
    "sectorBreakdown": {
      "Information Technology": 24.5,
      "Healthcare": 18.2,
      "Consumer Staples": 15.4,
      "Industrials": 13.8,
      "Financials": 11.2,
      "Consumer Discretionary": 8.5,
      "Communication Services": 5.4,
      "Materials": 3.0
    },
    "historicalStatsCurvo": {
      "period": "2016 - 2026 (WisdomTree Global Quality Growth)",
      "cagr": 11.45,
      "sharpe": 0.74,
      "stdev": 14.82,
      "maxDrawdown": -31.8,
      "recoveryPeriod": "1 year 4 months",
      "bestYear": 32.4,
      "worstYear": -16.8,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/wisdomtree-global-quality-dividend-growth-ucits-etf-usd-acc/IE00BZ56SW52"
    },
    "quantitativeStatsPV": {
      "sortino": 1.18,
      "calmar": 0.36,
      "var95": -6.5,
      "marketBeta": 0.94,
      "annualizedTurnover": 15.4,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Global Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 21.2,
      "pbRatio": 3.85,
      "yieldEquivalent": 2.15,
      "feeLevel": "Average"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.04,
      "liquidityRating": "Tier 1 - Standard Global Dividend",
      "avgSpreadPercent": 0.05
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating share class reinvests high-quality dividends without annual dividend tax drag",
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
      "kidUrl": "https://www.wisdomtree.eu/en-gb/-/media/eu-media-files/key-information-documents/en/ucits/wisdomtree-global-quality-dividend-growth-ucits-etf---usd-acc.pdf",
      "factsheetUrl": "https://www.wisdomtree.eu/en-gb/etfs/quality-dividend-growth/wisdomtree-global-quality-dividend-growth-ucits-etf---usd-acc",
      "annualReportUrl": "https://www.wisdomtree.eu",
      "issuerPage": "https://www.wisdomtree.eu/en-gb/etfs/quality-dividend-growth/wisdomtree-global-quality-dividend-growth-ucits-etf---usd-acc"
    },
    "retailScores": {
      "composite": 93,
      "indexCoverage": 91,
      "costScore": 86,
      "trackingScore": 92,
      "fundSizeScore": 92,
      "taxScore": 98,
      "brokerScore": 96,
      "bogleheadsRating": "Quality Factor Engine (High ROE & Sustainable Dividend Growth)"
    },
    "lastSyncedAt": "2026-10-05T14:48:05.084520+00:00",
    "liveMarketData": {
      "livePrice": 43.535,
      "currency": "EUR",
      "previousClose": 43.265,
      "dayChange": 0.27,
      "dayChangePercent": 0.62,
      "fiftyTwoWeekHigh": 45.37,
      "fiftyTwoWeekLow": 37.27,
      "exchange": "Borsa Italiana (Milan)",
      "marketTime": "2026-10-05T14:48:05.084479+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:05.084479+00:00"
    },
    "currentPriceEUR": 43.535,
    "dayChangePercent": 0.62,
    "fiftyTwoWeekHigh": 45.37,
    "fiftyTwoWeekLow": 37.27
  },
  {
    "ticker": "FWRA",
    "secondaryTickers": [
      "FWIA"
    ],
    "isin": "IE000716YHJ7",
    "wkn": "A3D7QY",
    "name": "Invesco FTSE All-World UCITS ETF Acc",
    "issuer": "Invesco",
    "benchmarkIndex": "FTSE All-World Index (USD Net Tax)",
    "assetClass": "Global Equities (Developed + Emerging)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.15,
    "trackingDifference5Y": -0.01,
    "trackingDifference1Y": -0.01,
    "aumMillionsEUR": 4198.0,
    "domicile": "Ireland",
    "replication": "Physical (Optimised sampling)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "90% net revenue to fund",
    "sriRisk": 4,
    "holdingCount": 3650,
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
      "period": "2003 - 2026 (FTSE All-World Benchmark)",
      "cagr": 9.64,
      "sharpe": 0.68,
      "stdev": 15.12,
      "maxDrawdown": -48.4,
      "recoveryPeriod": "5 years 4 months",
      "bestYear": 33.8,
      "worstYear": -40.1,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/invesco-ftse-all-world-ucits-etf-acc/IE000716YHJ7"
    },
    "quantitativeStatsPV": {
      "sortino": 1.02,
      "calmar": 0.2,
      "var95": -7.2,
      "marketBeta": 1.0,
      "annualizedTurnover": 4.0,
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
      "liquidityRating": "Tier 1 - Rapid Growth",
      "avgSpreadPercent": 0.04
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating share class with ultra-competitive 0.15% TER",
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
      "kidUrl": "https://etf.invesco.com/gb/private/en/product/invesco-ftse-all-world-ucits-etf-acc/documents",
      "factsheetUrl": "https://etf.invesco.com/gb/private/en/product/invesco-ftse-all-world-ucits-etf-acc/documents",
      "annualReportUrl": "https://etf.invesco.com",
      "issuerPage": "https://etf.invesco.com/gb/private/en/product/invesco-ftse-all-world-ucits-etf-acc"
    },
    "retailScores": {
      "composite": 95,
      "indexCoverage": 98,
      "costScore": 95,
      "trackingScore": 97,
      "fundSizeScore": 90,
      "taxScore": 98,
      "brokerScore": 96,
      "bogleheadsRating": "Low-Cost Vanguard Competitor (0.15% TER Core Alternative)"
    },
    "lastSyncedAt": "2026-10-05T14:48:05.780728+00:00",
    "liveMarketData": {
      "livePrice": 8.518,
      "currency": "EUR",
      "previousClose": 8.421,
      "dayChange": 0.097,
      "dayChangePercent": 1.15,
      "fiftyTwoWeekHigh": 8.52,
      "fiftyTwoWeekLow": 6.8,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:05.780667+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:05.780667+00:00"
    },
    "currentPriceEUR": 8.518,
    "dayChangePercent": 1.15,
    "fiftyTwoWeekHigh": 8.52,
    "fiftyTwoWeekLow": 6.8
  },
  {
    "ticker": "BATT",
    "secondaryTickers": [
      "BATE",
      "LGEN"
    ],
    "isin": "IE00BF0M2Z96",
    "wkn": "A2H5GK",
    "name": "L&G Battery Value-Chain UCITS ETF",
    "issuer": "Legal & General",
    "benchmarkIndex": "Solactive Battery Value-Chain Index (Net Return)",
    "assetClass": "Thematic Equities (Clean Energy & Battery Storage)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.49,
    "trackingDifference5Y": 0.12,
    "trackingDifference1Y": 0.08,
    "aumMillionsEUR": 663.0,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No lending",
    "sriRisk": 5,
    "holdingCount": 35,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "Panasonic Holdings Corp.",
        "symbol": "6752.T",
        "weight": 3.6
      },
      {
        "name": "Siemens AG",
        "symbol": "SIE.DE",
        "weight": 3.12
      },
      {
        "name": "Hitachi Ltd.",
        "symbol": "6501.T",
        "weight": 3.1
      },
      {
        "name": "Bayerische Motoren Werke (BMW)",
        "symbol": "BMW.DE",
        "weight": 2.95
      },
      {
        "name": "Tesla Inc.",
        "symbol": "TSLA",
        "weight": 2.8
      },
      {
        "name": "Albemarle Corp.",
        "symbol": "ALB",
        "weight": 2.75
      },
      {
        "name": "Samsung SDI Co.",
        "symbol": "006400.KS",
        "weight": 2.7
      },
      {
        "name": "LG Energy Solution",
        "symbol": "373220.KS",
        "weight": 2.6
      },
      {
        "name": "BYD Co. Ltd.",
        "symbol": "1211.HK",
        "weight": 2.5
      },
      {
        "name": "Pilbara Minerals Ltd.",
        "symbol": "PLS.AX",
        "weight": 2.4
      }
    ],
    "countryBreakdown": {
      "Japan": 24.5,
      "United States": 21.0,
      "South Korea": 18.5,
      "Germany": 14.0,
      "Australia": 9.5,
      "China": 8.0,
      "Other Countries": 4.5
    },
    "sectorBreakdown": {
      "Information Technology & Batteries": 44.5,
      "Materials & Lithium Miners": 28.0,
      "Automotive / EV Manufacturing": 18.5,
      "Industrials & Electrical Equipment": 9.0
    },
    "historicalStatsCurvo": {
      "period": "2018 - 2026 (Battery Value-Chain Track)",
      "cagr": 11.2,
      "sharpe": 0.52,
      "stdev": 24.5,
      "maxDrawdown": -45.2,
      "recoveryPeriod": "2 years 6 months",
      "bestYear": 64.5,
      "worstYear": -28.4,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/lg-battery-value-chain-ucits-etf/IE00BF0M2Z96"
    },
    "quantitativeStatsPV": {
      "sortino": 0.88,
      "calmar": 0.25,
      "var95": -11.4,
      "marketBeta": 1.25,
      "annualizedTurnover": 18.0,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Sector Equity Alternative Energy",
      "styleBox": "Mid Growth",
      "sustainabilityRating": 4,
      "peRatio": 18.5,
      "pbRatio": 2.1,
      "yieldEquivalent": 1.45,
      "feeLevel": "Average"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.12,
      "liquidityRating": "Tier 2 - Specialized Sector",
      "avgSpreadPercent": 0.15
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating share class avoids annual taxable events",
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
        "sparplan": true,
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
      "kidUrl": "https://www.lgim.com/documentlibrary/capabilities/etfs/priips-kid-en.pdf",
      "factsheetUrl": "https://www.lgim.com/uk/en/capabilities/etfs/battery-value-chain-ucits-etf.html",
      "annualReportUrl": "https://www.lgim.com",
      "issuerPage": "https://www.lgim.com/uk/en/capabilities/etfs/battery-value-chain-ucits-etf.html"
    },
    "retailScores": {
      "composite": 88,
      "indexCoverage": 82,
      "costScore": 84,
      "trackingScore": 89,
      "fundSizeScore": 86,
      "taxScore": 98,
      "brokerScore": 95,
      "bogleheadsRating": "Thematic Satellite Tilt (Battery Transition & Storage)"
    },
    "liveMarketData": {
      "livePrice": 26.48,
      "currency": "EUR",
      "previousClose": 26.205,
      "dayChange": 0.275,
      "dayChangePercent": 1.05,
      "fiftyTwoWeekHigh": 35.52,
      "fiftyTwoWeekLow": 21.64,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:06.517333+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:06.517333+00:00"
    },
    "currentPriceEUR": 26.48,
    "dayChangePercent": 1.05,
    "fiftyTwoWeekHigh": 35.52,
    "fiftyTwoWeekLow": 21.64,
    "lastSyncedAt": "2026-10-05T14:48:06.517378+00:00"
  },
  {
    "ticker": "RARE",
    "secondaryTickers": [
      "WRAE"
    ],
    "isin": "IE000KHX9DX6",
    "wkn": "A3D66Z",
    "name": "WisdomTree Strategic Metals and Rare Earths Miners UCITS ETF USD Acc",
    "issuer": "WisdomTree",
    "benchmarkIndex": "WisdomTree Strategic Metals and Rare Earths Miners Index",
    "assetClass": "Thematic Equities (Critical Raw Materials & Rare Earths)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.5,
    "trackingDifference5Y": 0.15,
    "trackingDifference1Y": 0.1,
    "aumMillionsEUR": 708.0,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No lending",
    "sriRisk": 5,
    "holdingCount": 42,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "Lynas Rare Earths Ltd.",
        "symbol": "LYC.AX",
        "weight": 3.54
      },
      {
        "name": "Anglo American Plc",
        "symbol": "AAL.L",
        "weight": 3.47
      },
      {
        "name": "PT Merdeka Copper Gold Tbk",
        "symbol": "MDKA.JK",
        "weight": 3.24
      },
      {
        "name": "Freeport-McMoRan Inc.",
        "symbol": "FCX",
        "weight": 3.1
      },
      {
        "name": "MP Materials Corp.",
        "symbol": "MP",
        "weight": 3.05
      },
      {
        "name": "Iluka Resources Ltd.",
        "symbol": "ILU.AX",
        "weight": 2.9
      },
      {
        "name": "Pilbara Minerals",
        "symbol": "PLS.AX",
        "weight": 2.8
      },
      {
        "name": "Albemarle Corp.",
        "symbol": "ALB",
        "weight": 2.7
      },
      {
        "name": "Sociedad Quimica y Minera (SQM)",
        "symbol": "SQM",
        "weight": 2.6
      },
      {
        "name": "Tianqi Lithium Corp.",
        "symbol": "002466.SZ",
        "weight": 2.5
      }
    ],
    "countryBreakdown": {
      "Australia": 31.0,
      "United States": 19.5,
      "Canada": 14.0,
      "China": 12.0,
      "Indonesia": 8.5,
      "South Africa": 7.0,
      "Other Countries": 8.0
    },
    "sectorBreakdown": {
      "Materials (Rare Earth Mining)": 72.0,
      "Specialty Chemicals & Refining": 19.0,
      "Industrial Mining Services": 9.0
    },
    "historicalStatsCurvo": {
      "period": "2021 - 2026 (Rare Earths Track)",
      "cagr": 8.4,
      "sharpe": 0.42,
      "stdev": 26.8,
      "maxDrawdown": -48.2,
      "recoveryPeriod": "Ongoing",
      "bestYear": 42.1,
      "worstYear": -31.5,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/wisdomtree-strategic-metals-and-rare-earths-miners-ucits-etf-usd-unhedged-acc/IE000KHX9DX6"
    },
    "quantitativeStatsPV": {
      "sortino": 0.72,
      "calmar": 0.18,
      "var95": -12.8,
      "marketBeta": 1.18,
      "annualizedTurnover": 22.0,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Sector Equity Natural Resources",
      "styleBox": "Mid Value",
      "sustainabilityRating": 3,
      "peRatio": 15.2,
      "pbRatio": 1.75,
      "yieldEquivalent": 1.95,
      "feeLevel": "Average"
    },
    "trackinsight": {
      "esgScore": "BBB",
      "trackingErrorPercent": 0.15,
      "liquidityRating": "Tier 2 - Materials Niche",
      "avgSpreadPercent": 0.18
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating share class protects against dividend leakage",
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
      "kidUrl": "https://www.wisdomtree.eu/en-gb/-/media/eu-media-files/key-information-documents/en/ucits/wisdomtree-strategic-metals-and-rare-earths-miners-ucits-etf---usd-acc.pdf",
      "factsheetUrl": "https://www.wisdomtree.eu/en-gb/etfs/thematic/rare-earths",
      "annualReportUrl": "https://www.wisdomtree.eu",
      "issuerPage": "https://www.wisdomtree.eu/en-gb/etfs/thematic/rare-earths"
    },
    "retailScores": {
      "composite": 85,
      "indexCoverage": 80,
      "costScore": 82,
      "trackingScore": 88,
      "fundSizeScore": 87,
      "taxScore": 98,
      "brokerScore": 94,
      "bogleheadsRating": "Thematic Resource Hedge (High Volatility Geopolitical Play)"
    },
    "liveMarketData": {
      "livePrice": 46.145,
      "currency": "EUR",
      "previousClose": 45.67,
      "dayChange": 0.475,
      "dayChangePercent": 1.04,
      "fiftyTwoWeekHigh": 59.99,
      "fiftyTwoWeekLow": 36.98,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:07.325018+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:07.325018+00:00"
    },
    "currentPriceEUR": 46.145,
    "dayChangePercent": 1.04,
    "fiftyTwoWeekHigh": 59.99,
    "fiftyTwoWeekLow": 36.98,
    "lastSyncedAt": "2026-10-05T14:48:07.325058+00:00"
  },
  {
    "ticker": "IUSQ",
    "secondaryTickers": [
      "ISAC",
      "SSAC"
    ],
    "isin": "IE00B6R52259",
    "wkn": "A111X9",
    "name": "iShares MSCI ACWI UCITS ETF USD (Acc)",
    "issuer": "iShares",
    "benchmarkIndex": "MSCI All Country World Index (ACWI) Net USD",
    "assetClass": "Global Equities (Developed + Emerging Markets)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.2,
    "trackingDifference5Y": -0.04,
    "trackingDifference1Y": -0.02,
    "aumMillionsEUR": 31931.0,
    "domicile": "Ireland",
    "replication": "Physical (Optimised sampling)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "62.5% net revenue to fund",
    "sriRisk": 4,
    "holdingCount": 2350,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 4.88
      },
      {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "weight": 4.46
      },
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 3.42
      },
      {
        "name": "Amazon.com Inc.",
        "symbol": "AMZN",
        "weight": 2.25
      },
      {
        "name": "Meta Platforms Inc.",
        "symbol": "META",
        "weight": 1.65
      },
      {
        "name": "Alphabet Inc. (Class A)",
        "symbol": "GOOGL",
        "weight": 1.38
      },
      {
        "name": "Alphabet Inc. (Class C)",
        "symbol": "GOOG",
        "weight": 1.18
      },
      {
        "name": "Taiwan Semiconductor (TSMC)",
        "symbol": "TSM",
        "weight": 1.05
      },
      {
        "name": "Eli Lilly & Co.",
        "symbol": "LLY",
        "weight": 0.95
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 0.92
      }
    ],
    "countryBreakdown": {
      "United States": 64.2,
      "Japan": 5.4,
      "United Kingdom": 3.4,
      "France": 2.6,
      "Canada": 2.5,
      "China": 2.4,
      "Switzerland": 2.2,
      "Taiwan": 2.0,
      "Germany": 1.9,
      "India": 1.9,
      "Other Countries": 11.5
    },
    "sectorBreakdown": {
      "Information Technology": 26.2,
      "Financials": 15.5,
      "Healthcare": 11.2,
      "Consumer Discretionary": 10.5,
      "Industrials": 10.2,
      "Communication Services": 7.4,
      "Consumer Staples": 5.9,
      "Energy": 4.2,
      "Materials": 3.8,
      "Utilities": 2.6,
      "Real Estate": 2.5
    },
    "historicalStatsCurvo": {
      "period": "2011 - 2026 (MSCI ACWI Series)",
      "cagr": 10.15,
      "sharpe": 0.72,
      "stdev": 14.85,
      "maxDrawdown": -33.6,
      "recoveryPeriod": "1 year 8 months",
      "bestYear": 31.8,
      "worstYear": -18.2,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-msci-acwi-ucits-etf-usd-acc/IE00B6R52259"
    },
    "quantitativeStatsPV": {
      "sortino": 1.12,
      "calmar": 0.3,
      "var95": -6.8,
      "marketBeta": 1.0,
      "annualizedTurnover": 3.5,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Global Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 20.8,
      "pbRatio": 3.12,
      "yieldEquivalent": 1.78,
      "feeLevel": "Low"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.03,
      "liquidityRating": "Tier 1 - Institutional Mega Core",
      "avgSpreadPercent": 0.03
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating share class maximizes compounding",
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
        "fee": "\u20ac0 (Prime ETF)",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": true,
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
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-msci-acwi-ucits-etf-usd-acc-ie00b6r52259-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/isac-ishares-msci-acwi-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/251850/ishares-msci-acwi-ucits-etf"
    },
    "retailScores": {
      "composite": 96,
      "indexCoverage": 98,
      "costScore": 95,
      "trackingScore": 98,
      "fundSizeScore": 99,
      "taxScore": 98,
      "brokerScore": 98,
      "bogleheadsRating": "Prime Global One-Stop Core (MSCI Alternative to VWCE)"
    },
    "liveMarketData": {
      "livePrice": 110.78,
      "currency": "EUR",
      "previousClose": 109.58,
      "dayChange": 1.2,
      "dayChangePercent": 1.1,
      "fiftyTwoWeekHigh": 110.96,
      "fiftyTwoWeekLow": 88.46,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:08.209213+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:08.209213+00:00"
    },
    "currentPriceEUR": 110.78,
    "dayChangePercent": 1.1,
    "fiftyTwoWeekHigh": 110.96,
    "fiftyTwoWeekLow": 88.46,
    "lastSyncedAt": "2026-10-05T14:48:08.209236+00:00"
  },
  {
    "ticker": "IMAE",
    "secondaryTickers": [
      "SMEA",
      "CEU2"
    ],
    "isin": "IE00B4K48X80",
    "wkn": "A0RPWH",
    "name": "iShares Core MSCI Europe UCITS ETF EUR (Acc)",
    "issuer": "iShares",
    "benchmarkIndex": "MSCI Europe Index (Net Return EUR)",
    "assetClass": "European Equities (15 Developed European Countries)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.12,
    "trackingDifference5Y": -0.06,
    "trackingDifference1Y": -0.03,
    "aumMillionsEUR": 15687.0,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "62.5% net revenue to fund",
    "sriRisk": 4,
    "holdingCount": 420,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "ASML Holding NV",
        "symbol": "ASML.AS",
        "weight": 4.55
      },
      {
        "name": "Novo Nordisk A/S (Class B)",
        "symbol": "NOVO-B.CO",
        "weight": 3.8
      },
      {
        "name": "Nestl\u00e9 S.A.",
        "symbol": "NESN.SW",
        "weight": 2.8
      },
      {
        "name": "HSBC Holdings Plc",
        "symbol": "HSBA.L",
        "weight": 2.47
      },
      {
        "name": "AstraZeneca PLC",
        "symbol": "AZN.L",
        "weight": 2.2
      },
      {
        "name": "Roche Holding AG",
        "symbol": "ROG.SW",
        "weight": 2.13
      },
      {
        "name": "SAP SE",
        "symbol": "SAP.DE",
        "weight": 2.1
      },
      {
        "name": "Novartis AG",
        "symbol": "NOVN.SW",
        "weight": 2.0
      },
      {
        "name": "Shell PLC",
        "symbol": "SHEL.L",
        "weight": 1.8
      },
      {
        "name": "LVMH Mo\u00ebt Hennessy",
        "symbol": "MC.PA",
        "weight": 1.7
      }
    ],
    "countryBreakdown": {
      "United Kingdom": 21.8,
      "France": 17.5,
      "Switzerland": 15.0,
      "Germany": 13.2,
      "Netherlands": 9.8,
      "Denmark": 6.2,
      "Sweden": 4.8,
      "Spain": 4.0,
      "Italy": 3.9,
      "Other Countries": 3.8
    },
    "sectorBreakdown": {
      "Financials": 19.5,
      "Industrials": 16.8,
      "Healthcare": 15.2,
      "Consumer Discretionary": 10.8,
      "Consumer Staples": 9.8,
      "Information Technology": 9.2,
      "Materials": 6.8,
      "Energy": 5.4,
      "Utilities": 3.8,
      "Communication Services": 2.7
    },
    "historicalStatsCurvo": {
      "period": "2009 - 2026 (MSCI Europe Track)",
      "cagr": 8.65,
      "sharpe": 0.6,
      "stdev": 14.5,
      "maxDrawdown": -35.2,
      "recoveryPeriod": "2 years 1 month",
      "bestYear": 26.5,
      "worstYear": -15.1,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-core-msci-europe-ucits-etf-eur-acc/IE00B4K48X80"
    },
    "quantitativeStatsPV": {
      "sortino": 0.94,
      "calmar": 0.24,
      "var95": -7.1,
      "marketBeta": 0.88,
      "annualizedTurnover": 4.2,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Europe Large-Cap Blend Equity",
      "styleBox": "Large Blend",
      "sustainabilityRating": 4,
      "peRatio": 14.8,
      "pbRatio": 2.05,
      "yieldEquivalent": 3.1,
      "feeLevel": "Low"
    },
    "trackinsight": {
      "esgScore": "AAA",
      "trackingErrorPercent": 0.02,
      "liquidityRating": "Tier 1 - European Mega Core",
      "avgSpreadPercent": 0.03
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "Pure European holdings, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating share class compounds European dividends tax-free",
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
        "sparplan": true,
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
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-core-msci-europe-ucits-etf-eur-acc-ie00b4k48x80-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/smea-ishares-core-msci-europe-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/251861/ishares-msci-europe-ucits-etf"
    },
    "retailScores": {
      "composite": 94,
      "indexCoverage": 95,
      "costScore": 96,
      "trackingScore": 98,
      "fundSizeScore": 97,
      "taxScore": 98,
      "brokerScore": 98,
      "bogleheadsRating": "Low-Cost European Regional Pillar (0.12% TER)"
    },
    "liveMarketData": {
      "livePrice": 102.975,
      "currency": "EUR",
      "previousClose": 102.68,
      "dayChange": 0.295,
      "dayChangePercent": 0.29,
      "fiftyTwoWeekHigh": 107.56,
      "fiftyTwoWeekLow": 88.39,
      "exchange": "Euronext Amsterdam",
      "marketTime": "2026-10-05T14:48:08.897501+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:08.897501+00:00"
    },
    "currentPriceEUR": 102.975,
    "dayChangePercent": 0.29,
    "fiftyTwoWeekHigh": 107.56,
    "fiftyTwoWeekLow": 88.39,
    "lastSyncedAt": "2026-10-05T14:48:08.897540+00:00"
  },
  {
    "ticker": "XCS6",
    "secondaryTickers": [
      "XCHA"
    ],
    "isin": "LU0779800910",
    "wkn": "DBX0M2",
    "name": "Xtrackers CSI 300 Swap UCITS ETF 1C",
    "issuer": "Xtrackers",
    "benchmarkIndex": "CSI 300 Index (China A-Shares)",
    "assetClass": "Emerging Market Equities (Mainland China A-Shares)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.5,
    "trackingDifference5Y": -0.15,
    "trackingDifference1Y": -0.08,
    "aumMillionsEUR": 1751.0,
    "domicile": "Luxembourg",
    "replication": "Synthetic (Unfunded swap)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No lending",
    "sriRisk": 5,
    "holdingCount": 300,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "Contemporary Amperex Technology (CATL)",
        "symbol": "300750.SZ",
        "weight": 4.01
      },
      {
        "name": "Zhongji Innolight Co.",
        "symbol": "300308.SZ",
        "weight": 3.86
      },
      {
        "name": "Kweichow Moutai Co. Ltd.",
        "symbol": "600519.SS",
        "weight": 3.24
      },
      {
        "name": "Ping An Insurance (Group)",
        "symbol": "601318.SS",
        "weight": 2.95
      },
      {
        "name": "China Merchants Bank",
        "symbol": "600036.SS",
        "weight": 2.7
      },
      {
        "name": "Midea Group Co. Ltd.",
        "symbol": "000333.SZ",
        "weight": 2.5
      },
      {
        "name": "BYD Co. Ltd. (A-Share)",
        "symbol": "002594.SZ",
        "weight": 2.4
      },
      {
        "name": "China Yangtze Power Co.",
        "symbol": "600900.SS",
        "weight": 2.3
      },
      {
        "name": "Wuliangye Yibin Co. Ltd.",
        "symbol": "000858.SZ",
        "weight": 2.1
      },
      {
        "name": "Zijin Mining Group Co.",
        "symbol": "601899.SS",
        "weight": 1.9
      }
    ],
    "countryBreakdown": {
      "China (Mainland A-Shares)": 100.0
    },
    "sectorBreakdown": {
      "Financials": 22.5,
      "Information Technology": 18.2,
      "Consumer Staples": 14.8,
      "Industrials": 14.2,
      "Materials": 10.5,
      "Consumer Discretionary": 8.5,
      "Healthcare": 7.0,
      "Utilities": 4.3
    },
    "historicalStatsCurvo": {
      "period": "2012 - 2026 (CSI 300 Net Track)",
      "cagr": 6.8,
      "sharpe": 0.38,
      "stdev": 22.4,
      "maxDrawdown": -49.8,
      "recoveryPeriod": "3 years 9 months",
      "bestYear": 51.2,
      "worstYear": -25.8,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/xtrackers-csi300-swap-ucits-etf-1c/LU0779800910"
    },
    "quantitativeStatsPV": {
      "sortino": 0.62,
      "calmar": 0.14,
      "var95": -11.8,
      "marketBeta": 0.85,
      "annualizedTurnover": 12.0,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "China Equity - A Shares",
      "styleBox": "Large Blend",
      "sustainabilityRating": 2,
      "peRatio": 13.2,
      "pbRatio": 1.45,
      "yieldEquivalent": 2.65,
      "feeLevel": "Average"
    },
    "trackinsight": {
      "esgScore": "BB",
      "trackingErrorPercent": 0.08,
      "liquidityRating": "Tier 1 - China Benchmark",
      "avgSpreadPercent": 0.08
    },
    "taxTreatment": {
      "domicileEfficiency": "Standard (Luxembourg)",
      "usTreatyAdvantage": "Non-US assets, synthetic swap eliminates Chinese domestic withholding tax friction",
      "localDividendTax": "0% Lux WHT",
      "reinvestmentEfficiency": "Accumulating share class reinvests net dividends",
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
        "fee": "\u20ac0 (Prime ETF)",
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
      "kidUrl": "https://etf.dws.com/en-gb/LU0779800910-csi300-swap-ucits-etf-1c/",
      "factsheetUrl": "https://etf.dws.com/en-gb/LU0779800910-csi300-swap-ucits-etf-1c/",
      "annualReportUrl": "https://etf.dws.com",
      "issuerPage": "https://etf.dws.com/en-gb/LU0779800910-csi300-swap-ucits-etf-1c/"
    },
    "retailScores": {
      "composite": 84,
      "indexCoverage": 88,
      "costScore": 81,
      "trackingScore": 94,
      "fundSizeScore": 92,
      "taxScore": 90,
      "brokerScore": 95,
      "bogleheadsRating": "Single-Country Emerging Satellite (Synthetic Chinese A-Shares)"
    },
    "liveMarketData": {
      "livePrice": 17.954,
      "currency": "EUR",
      "previousClose": 17.808,
      "dayChange": 0.146,
      "dayChangePercent": 0.82,
      "fiftyTwoWeekHigh": 19.86,
      "fiftyTwoWeekLow": 15.72,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:09.533877+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:09.533877+00:00"
    },
    "currentPriceEUR": 17.954,
    "dayChangePercent": 0.82,
    "fiftyTwoWeekHigh": 19.86,
    "fiftyTwoWeekLow": 15.72,
    "lastSyncedAt": "2026-10-05T14:48:09.533896+00:00"
  },
  {
    "ticker": "XEON",
    "secondaryTickers": [
      "DBX0AN"
    ],
    "isin": "LU0290358497",
    "wkn": "DBX0AN",
    "name": "Xtrackers II EUR Overnight Rate Swap UCITS ETF 1C",
    "issuer": "Xtrackers",
    "benchmarkIndex": "Deutsche Bundesbank Euro Short-Term Rate (\u20acSTR)",
    "assetClass": "Money Market / Euro Overnight Cash Yield",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.1,
    "trackingDifference5Y": -0.02,
    "trackingDifference1Y": -0.01,
    "aumMillionsEUR": 22997.0,
    "domicile": "Luxembourg",
    "replication": "Synthetic (Unfunded swap backed by European sovereign collateral)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No lending",
    "sriRisk": 1,
    "holdingCount": 1,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "\u20acSTR Overnight Swap Collateral (European Sovereign Debt Basket)",
        "symbol": "ESTR.CASH",
        "weight": 100.0
      }
    ],
    "countryBreakdown": {
      "Eurozone Sovereign Cash / Collateral": 100.0
    },
    "sectorBreakdown": {
      "Cash & Central Bank Overnight Deposits": 100.0
    },
    "historicalStatsCurvo": {
      "period": "2007 - 2026 (Euro Overnight Track)",
      "cagr": 2.15,
      "sharpe": 1.45,
      "stdev": 0.85,
      "maxDrawdown": -0.6,
      "recoveryPeriod": "3 months",
      "bestYear": 3.85,
      "worstYear": -0.55,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/xtrackers-ii-eur-overnight-rate-swap-ucits-etf-1c/LU0290358497"
    },
    "quantitativeStatsPV": {
      "sortino": 3.85,
      "calmar": 3.58,
      "var95": -0.05,
      "marketBeta": 0.01,
      "annualizedTurnover": 0.0,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "EUR Money Market",
      "styleBox": "Cash / Risk-Free",
      "sustainabilityRating": 5,
      "peRatio": 0.0,
      "pbRatio": 0.0,
      "yieldEquivalent": 3.65,
      "feeLevel": "Lowest"
    },
    "trackinsight": {
      "esgScore": "AAA",
      "trackingErrorPercent": 0.01,
      "liquidityRating": "Tier 1 - Cash Equivalent Benchmark",
      "avgSpreadPercent": 0.01
    },
    "taxTreatment": {
      "domicileEfficiency": "Standard (Luxembourg)",
      "usTreatyAdvantage": "Zero US assets, zero US WHT, 0% Lux domestic WHT",
      "localDividendTax": "0% Lux WHT",
      "reinvestmentEfficiency": "Accumulating share class auto-compounds daily ECB \u20acSTR interest",
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
        "fee": "\u20ac0 (Prime ETF)",
        "status": "Available"
      },
      "Interactive Brokers": {
        "sparplan": true,
        "fee": "\u20ac1.25",
        "status": "Available"
      },
      "DEGIRO": {
        "sparplan": true,
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
      "kidUrl": "https://etf.dws.com/en-gb/LU0290358497-eur-overnight-rate-swap-ucits-etf-1c/",
      "factsheetUrl": "https://etf.dws.com/en-gb/LU0290358497-eur-overnight-rate-swap-ucits-etf-1c/",
      "annualReportUrl": "https://etf.dws.com",
      "issuerPage": "https://etf.dws.com/en-gb/LU0290358497-eur-overnight-rate-swap-ucits-etf-1c/"
    },
    "retailScores": {
      "composite": 98,
      "indexCoverage": 100,
      "costScore": 99,
      "trackingScore": 100,
      "fundSizeScore": 100,
      "taxScore": 98,
      "brokerScore": 99,
      "bogleheadsRating": "Ultimate Retail Cash Anchor (Earns ECB \u20acSTR with Zero Bank Default Risk)"
    },
    "liveMarketData": {
      "livePrice": 150.395,
      "currency": "EUR",
      "previousClose": 150.386,
      "dayChange": 0.009,
      "dayChangePercent": 0.01,
      "fiftyTwoWeekHigh": 150.41,
      "fiftyTwoWeekLow": 147.34,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:10.406691+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:10.406691+00:00"
    },
    "currentPriceEUR": 150.395,
    "dayChangePercent": 0.01,
    "fiftyTwoWeekHigh": 150.41,
    "fiftyTwoWeekLow": 147.34,
    "lastSyncedAt": "2026-10-05T14:48:10.406742+00:00"
  },
  {
    "ticker": "VHYL",
    "secondaryTickers": [
      "VGWD",
      "VHYD"
    ],
    "isin": "IE00B8GKDB10",
    "wkn": "A1T8FV",
    "name": "Vanguard FTSE All-World High Dividend Yield UCITS ETF Distributing",
    "issuer": "Vanguard",
    "benchmarkIndex": "FTSE All-World High Dividend Yield Index (Net Tax)",
    "assetClass": "Global Equities (High Dividend Factor)",
    "distributionPolicy": "Distributing",
    "isAccumulating": false,
    "ter": 0.29,
    "trackingDifference5Y": 0.05,
    "trackingDifference1Y": 0.02,
    "aumMillionsEUR": 9910.0,
    "domicile": "Ireland",
    "replication": "Physical (Optimised sampling)",
    "securitiesLending": true,
    "securitiesLendingRevenueShare": "100% net revenue to fund",
    "sriRisk": 4,
    "holdingCount": 1820,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "JPMorgan Chase & Co.",
        "symbol": "JPM",
        "weight": 2.13
      },
      {
        "name": "ExxonMobil Corp.",
        "symbol": "XOM",
        "weight": 1.5
      },
      {
        "name": "Johnson & Johnson",
        "symbol": "JNJ",
        "weight": 1.44
      },
      {
        "name": "Procter & Gamble Co.",
        "symbol": "PG",
        "weight": 1.35
      },
      {
        "name": "Home Depot Inc.",
        "symbol": "HD",
        "weight": 1.28
      },
      {
        "name": "AbbVie Inc.",
        "symbol": "ABBV",
        "weight": 1.22
      },
      {
        "name": "Chevron Corp.",
        "symbol": "CVX",
        "weight": 1.18
      },
      {
        "name": "Nestl\u00e9 S.A.",
        "symbol": "NESN.SW",
        "weight": 1.12
      },
      {
        "name": "Bank of America Corp.",
        "symbol": "BAC",
        "weight": 1.08
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 1.05
      }
    ],
    "countryBreakdown": {
      "United States": 43.5,
      "Japan": 8.2,
      "United Kingdom": 7.8,
      "Switzerland": 5.8,
      "Canada": 4.9,
      "France": 4.5,
      "Australia": 4.2,
      "Germany": 3.8,
      "China": 3.2,
      "Other Countries": 14.1
    },
    "sectorBreakdown": {
      "Financials": 26.5,
      "Consumer Staples": 12.8,
      "Industrials": 11.5,
      "Healthcare": 11.2,
      "Energy": 10.4,
      "Information Technology": 8.2,
      "Utilities": 6.5,
      "Communication Services": 5.4,
      "Materials": 4.8,
      "Real Estate": 2.7
    },
    "historicalStatsCurvo": {
      "period": "2013 - 2026 (High Dividend Yield Track)",
      "cagr": 7.85,
      "sharpe": 0.58,
      "stdev": 13.9,
      "maxDrawdown": -32.8,
      "recoveryPeriod": "1 year 10 months",
      "bestYear": 24.2,
      "worstYear": -12.4,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/vanguard-ftse-all-world-high-dividend-yield-ucits-etf-distributing/IE00B8GKDB10"
    },
    "quantitativeStatsPV": {
      "sortino": 0.88,
      "calmar": 0.24,
      "var95": -6.4,
      "marketBeta": 0.86,
      "annualizedTurnover": 9.5,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Global Equity Income",
      "styleBox": "Large Value",
      "sustainabilityRating": 3,
      "peRatio": 14.2,
      "pbRatio": 1.95,
      "yieldEquivalent": 3.45,
      "feeLevel": "Average"
    },
    "trackinsight": {
      "esgScore": "A",
      "trackingErrorPercent": 0.04,
      "liquidityRating": "Tier 1 - High Dividend Benchmark",
      "avgSpreadPercent": 0.04
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Distributing quarterly dividends creates annual taxable event",
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
        "sparplan": true,
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
      "kidUrl": "https://fund-docs.vanguard.com/priips-kid-ftse-all-world-high-dividend-yield-ucits-etf-dist-ie00b8gkdb10-en.pdf",
      "factsheetUrl": "https://www.vanguardinvestor.co.uk/investments/vanguard-ftse-all-world-high-dividend-yield-ucits-etf-usd-distributing",
      "annualReportUrl": "https://www.vanguard.co.uk",
      "issuerPage": "https://www.vanguardinvestor.co.uk/investments/vanguard-ftse-all-world-high-dividend-yield-ucits-etf-usd-distributing"
    },
    "retailScores": {
      "composite": 89,
      "indexCoverage": 94,
      "costScore": 88,
      "trackingScore": 92,
      "fundSizeScore": 96,
      "taxScore": 82,
      "brokerScore": 97,
      "bogleheadsRating": "Dividend Income Satellite (Note: Distributing drag applies)"
    },
    "liveMarketData": {
      "livePrice": 80.82,
      "currency": "EUR",
      "previousClose": 80.14,
      "dayChange": 0.68,
      "dayChangePercent": 0.85,
      "fiftyTwoWeekHigh": 82.28,
      "fiftyTwoWeekLow": 66.0,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:11.128737+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:11.128737+00:00"
    },
    "currentPriceEUR": 80.82,
    "dayChangePercent": 0.85,
    "fiftyTwoWeekHigh": 82.28,
    "fiftyTwoWeekLow": 66.0,
    "lastSyncedAt": "2026-10-05T14:48:11.128785+00:00"
  },
  {
    "ticker": "AII",
    "secondaryTickers": [
      "AIFS"
    ],
    "isin": "IE000X59ZHE2",
    "wkn": "A40H8L",
    "name": "iShares AI Infrastructure UCITS ETF USD (Acc)",
    "issuer": "iShares",
    "benchmarkIndex": "STOXX Global AI Infrastructure Index",
    "assetClass": "Thematic Equities (AI Data Centers & Infrastructure)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.35,
    "trackingDifference5Y": 0.08,
    "trackingDifference1Y": 0.05,
    "aumMillionsEUR": 1316.0,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No lending",
    "sriRisk": 5,
    "holdingCount": 52,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "Palantir Technologies, Inc.",
        "symbol": "PLTR",
        "weight": 5.57
      },
      {
        "name": "Palo Alto Networks, Inc.",
        "symbol": "PANW",
        "weight": 5.12
      },
      {
        "name": "Microsoft Corp.",
        "symbol": "MSFT",
        "weight": 5.09
      },
      {
        "name": "Broadcom Inc.",
        "symbol": "AVGO",
        "weight": 4.85
      },
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 4.72
      },
      {
        "name": "Arista Networks Inc.",
        "symbol": "ANET",
        "weight": 4.45
      },
      {
        "name": "Super Micro Computer Inc.",
        "symbol": "SMCI",
        "weight": 3.9
      },
      {
        "name": "Vertiv Holdings Co.",
        "symbol": "VRT",
        "weight": 3.8
      },
      {
        "name": "Cisco Systems Inc.",
        "symbol": "CSCO",
        "weight": 3.6
      },
      {
        "name": "Taiwan Semiconductor (TSMC)",
        "symbol": "TSM",
        "weight": 3.5
      }
    ],
    "countryBreakdown": {
      "United States": 78.5,
      "Taiwan": 8.0,
      "Japan": 4.5,
      "South Korea": 3.5,
      "Germany": 2.5,
      "Other Countries": 3.0
    },
    "sectorBreakdown": {
      "Information Technology (Semiconductors & Software)": 68.5,
      "Industrials (Data Center Power & Cooling)": 18.0,
      "Communication Services": 8.5,
      "Utilities (Grid Capacity)": 5.0
    },
    "historicalStatsCurvo": {
      "period": "Dec 2024 - Oct 2026 (since launch, 1.8 years; measured from Yahoo Finance prices, not a Curvo backtest)",
      "cagr": 54.8,
      "sharpe": 1.94,
      "stdev": 27.1,
      "maxDrawdown": -31.1,
      "recoveryPeriod": "7 months (Feb 2025 - Sep 2025)",
      "bestYear": null,
      "worstYear": null,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-ai-infrastructure-ucits-etf-usd-acc/IE000X59ZHE2"
    },
    "quantitativeStatsPV": {
      "sortino": 1.58,
      "calmar": 1.14,
      "var95": -9.8,
      "marketBeta": 1.7,
      "annualizedTurnover": 25.0,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Sector Equity Technology",
      "styleBox": "Large Growth",
      "sustainabilityRating": 3,
      "peRatio": 32.5,
      "pbRatio": 6.8,
      "yieldEquivalent": 0.45,
      "feeLevel": "Average"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.08,
      "liquidityRating": "Tier 1 - Rapid Growth AI Thematic",
      "avgSpreadPercent": 0.09
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating share class auto-compounds capital gains",
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
      "kidUrl": "https://www.ishares.com/uk/individual/en/literature/kiid/kiid-ishares-ai-infrastructure-ucits-etf-usd-acc-ie000x59zhe2-en.pdf",
      "factsheetUrl": "https://www.ishares.com/uk/individual/en/literature/fact-sheet/aiin-ishares-ai-infrastructure-ucits-etf-fund-fact-sheet-en-gb.pdf",
      "annualReportUrl": "https://www.ishares.com",
      "issuerPage": "https://www.ishares.com/uk/individual/en/products/338902/ishares-ai-infrastructure-ucits-etf"
    },
    "retailScores": {
      "composite": 91,
      "indexCoverage": 85,
      "costScore": 90,
      "trackingScore": 94,
      "fundSizeScore": 90,
      "taxScore": 98,
      "brokerScore": 95,
      "bogleheadsRating": "Targeted AI Enabler Tilt (Data Centers, Power & Cooling Infrastructure)"
    },
    "liveMarketData": {
      "livePrice": 10.78,
      "currency": "EUR",
      "previousClose": 10.706,
      "dayChange": 0.074,
      "dayChangePercent": 0.69,
      "fiftyTwoWeekHigh": 10.81,
      "fiftyTwoWeekLow": 5.75,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:11.883932+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:11.883932+00:00"
    },
    "currentPriceEUR": 10.78,
    "dayChangePercent": 0.69,
    "fiftyTwoWeekHigh": 10.81,
    "fiftyTwoWeekLow": 5.75,
    "lastSyncedAt": "2026-10-05T14:48:11.883951+00:00",
    "inceptionDate": "2024-12-05"
  },
  {
    "ticker": "WTAI",
    "secondaryTickers": [],
    "isin": "IE00BDVPNG13",
    "wkn": "A2N6WP",
    "name": "WisdomTree Artificial Intelligence UCITS ETF USD Acc",
    "issuer": "WisdomTree",
    "benchmarkIndex": "NASDAQ CTA Artificial Intelligence Index (Net Return)",
    "assetClass": "Thematic Equities (AI Enablers, Engagers & Enhancers)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.4,
    "trackingDifference5Y": 0.06,
    "trackingDifference1Y": 0.04,
    "aumMillionsEUR": 1364.0,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No lending",
    "sriRisk": 5,
    "holdingCount": 68,
    "isUserWatchlist": true,
    "topHoldings": [
      {
        "name": "Advanced Micro Devices (AMD)",
        "symbol": "AMD",
        "weight": 4.78
      },
      {
        "name": "Marvell Technology Inc.",
        "symbol": "MRVL",
        "weight": 4.7
      },
      {
        "name": "Micron Technology Inc.",
        "symbol": "MU",
        "weight": 3.62
      },
      {
        "name": "Infineon Technologies AG",
        "symbol": "IFX.DE",
        "weight": 3.4
      },
      {
        "name": "Qualcomm Inc.",
        "symbol": "QCOM",
        "weight": 3.2
      },
      {
        "name": "Cadence Design Systems",
        "symbol": "CDNS",
        "weight": 3.1
      },
      {
        "name": "Synopsys Inc.",
        "symbol": "SNPS",
        "weight": 3.0
      },
      {
        "name": "Alphabet Inc. (Class A)",
        "symbol": "GOOGL",
        "weight": 2.9
      },
      {
        "name": "NVIDIA Corp.",
        "symbol": "NVDA",
        "weight": 2.8
      },
      {
        "name": "Meta Platforms Inc.",
        "symbol": "META",
        "weight": 2.7
      }
    ],
    "countryBreakdown": {
      "United States": 82.5,
      "Taiwan": 6.5,
      "Germany": 3.8,
      "Japan": 3.2,
      "Other Countries": 4.0
    },
    "sectorBreakdown": {
      "Information Technology (Semiconductors & Software)": 84.5,
      "Communication Services": 10.2,
      "Consumer Discretionary": 5.3
    },
    "historicalStatsCurvo": {
      "period": "2018 - 2026 (NASDAQ CTA AI Track)",
      "cagr": 18.2,
      "sharpe": 0.82,
      "stdev": 22.4,
      "maxDrawdown": -41.5,
      "recoveryPeriod": "1 year 6 months",
      "bestYear": 58.2,
      "worstYear": -34.8,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/wisdomtree-artificial-intelligence-ucits-etf-usd-acc/IE00BDVPNG13"
    },
    "quantitativeStatsPV": {
      "sortino": 1.25,
      "calmar": 0.44,
      "var95": -9.5,
      "marketBeta": 1.32,
      "annualizedTurnover": 28.0,
      "pvUrl": "https://www.portfoliovisualizer.com/backtest-portfolio"
    },
    "morningstar": {
      "category": "Sector Equity Technology",
      "styleBox": "Large Growth",
      "sustainabilityRating": 4,
      "peRatio": 29.8,
      "pbRatio": 5.95,
      "yieldEquivalent": 0.55,
      "feeLevel": "Average"
    },
    "trackinsight": {
      "esgScore": "AA",
      "trackingErrorPercent": 0.07,
      "liquidityRating": "Tier 1 - Pure Play AI Pioneer",
      "avgSpreadPercent": 0.08
    },
    "taxTreatment": {
      "domicileEfficiency": "Excellent (Ireland)",
      "usTreatyAdvantage": "15% US treaty rate, 0% Irish WHT",
      "localDividendTax": "0% Irish WHT",
      "reinvestmentEfficiency": "Accumulating share class maximizes AI compounding",
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
      "kidUrl": "https://www.wisdomtree.eu/en-gb/-/media/eu-media-files/key-information-documents/en/ucits/wisdomtree-artificial-intelligence-ucits-etf---usd-acc.pdf",
      "factsheetUrl": "https://www.wisdomtree.eu/en-gb/etfs/thematic/artificial-intelligence",
      "annualReportUrl": "https://www.wisdomtree.eu",
      "issuerPage": "https://www.wisdomtree.eu/en-gb/etfs/thematic/artificial-intelligence"
    },
    "retailScores": {
      "composite": 90,
      "indexCoverage": 88,
      "costScore": 86,
      "trackingScore": 93,
      "fundSizeScore": 91,
      "taxScore": 98,
      "brokerScore": 95,
      "bogleheadsRating": "Pioneering Pure-Play AI Satellite (Broader Equal-Weight CTA Methodology)"
    },
    "liveMarketData": {
      "livePrice": 113.22,
      "currency": "EUR",
      "previousClose": 112.17,
      "dayChange": 1.05,
      "dayChangePercent": 0.94,
      "fiftyTwoWeekHigh": 113.5,
      "fiftyTwoWeekLow": 66.03,
      "exchange": "Borsa Italiana (Milan)",
      "marketTime": "2026-10-05T14:48:12.531822+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:12.531822+00:00"
    },
    "currentPriceEUR": 113.22,
    "dayChangePercent": 0.94,
    "fiftyTwoWeekHigh": 113.5,
    "fiftyTwoWeekLow": 66.03,
    "lastSyncedAt": "2026-10-05T14:48:12.531862+00:00"
  },
  {
    "ticker": "SGLD",
    "secondaryTickers": [
      "SGLD.L",
      "8PSG"
    ],
    "isin": "IE00B579F325",
    "wkn": "A1AA5X",
    "name": "Invesco Physical Gold ETC",
    "issuer": "Invesco",
    "benchmarkIndex": "LBMA Gold Price PM Index",
    "assetClass": "Commodities (Physical Gold ETC)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.12,
    "trackingDifference5Y": -0.05,
    "trackingDifference1Y": -0.02,
    "aumMillionsEUR": 25960.0,
    "domicile": "Ireland",
    "replication": "Physical (Allocated gold bullion)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No securities lending - physically segregated vaulted bars",
    "sriRisk": 4,
    "holdingCount": 1,
    "topHoldings": [
      {
        "name": "Physical Allocated Gold Bullion Bars (LBMA Vaults)",
        "symbol": "GOLD",
        "weight": 100.0
      }
    ],
    "countryBreakdown": {
      "Global": 100.0
    },
    "sectorBreakdown": {
      "Precious Metals": 100.0
    },
    "historicalStatsCurvo": {
      "cagr": 8.4,
      "sharpe": 0.55,
      "stdev": 13.8,
      "maxDrawdown": -21.4
    },
    "quantitativeStatsPV": {
      "sortino": 0.88,
      "calmar": 0.39,
      "var95": -5.2,
      "marketBeta": 0.05
    },
    "morningstar": {
      "styleBox": "Commodity",
      "esgRating": 3
    },
    "savingsPlanBrokers": [
      "Trade Republic",
      "Scalable Capital",
      "Interactive Brokers",
      "flatex",
      "DEGIRO",
      "ING"
    ],
    "kidUrl": "https://etf.invesco.com/gb/private/en/product/invesco-physical-gold-etc/key-information-document",
    "factsheetUrl": "https://etf.invesco.com/gb/private/en/product/invesco-physical-gold-etc/documents",
    "liveMarketData": {
      "livePrice": 355.64,
      "currency": "EUR",
      "previousClose": 354.14,
      "dayChange": 1.5,
      "dayChangePercent": 0.42,
      "fiftyTwoWeekHigh": 446.46,
      "fiftyTwoWeekLow": 321.3,
      "exchange": "XETRA (Frankfurt)",
      "marketTime": "2026-10-05T14:48:13.372939+00:00",
      "lastPriceUpdated": "2026-10-05T14:48:13.372939+00:00"
    },
    "lastSyncedAt": "2026-10-05T14:48:13.372992+00:00",
    "currentPriceEUR": 355.64,
    "dayChangePercent": 0.42,
    "fiftyTwoWeekHigh": 446.46,
    "fiftyTwoWeekLow": 321.3
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
    "VUSA",
    "SGLD",
    "XEON"
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
      "VUSA": 0.96,
      "SGLD": 0.06,
      "XEON": 0.01
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
      "VUSA": 0.97,
      "SGLD": 0.06,
      "XEON": 0.01
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
      "VUSA": 1.0,
      "SGLD": 0.04,
      "XEON": 0.0
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
      "VUSA": 1.0,
      "SGLD": 0.04,
      "XEON": 0.0
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
      "VUSA": 0.69,
      "SGLD": 0.18,
      "XEON": 0.02
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
      "VUSA": 0.81,
      "SGLD": 0.08,
      "XEON": 0.01
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
      "VUSA": 0.94,
      "SGLD": 0.02,
      "XEON": -0.02
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
      "VUSA": 0.08,
      "SGLD": 0.18,
      "XEON": 0.05
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
      "VUSA": 0.89,
      "SGLD": 0.07,
      "XEON": 0.01
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
      "VUSA": 1.0,
      "SGLD": 0.04,
      "XEON": 0.0
    },
    "SGLD": {
      "VWCE": 0.06,
      "IWDA": 0.06,
      "SXR8": 0.04,
      "VUAA": 0.04,
      "EIMI": 0.18,
      "MEUD": 0.08,
      "QDVE": 0.02,
      "AGGU": 0.18,
      "IUSN": 0.07,
      "VUSA": 0.04,
      "SGLD": 1.0,
      "XEON": 0.0
    },
    "XEON": {
      "VWCE": 0.01,
      "IWDA": 0.01,
      "SXR8": 0.0,
      "VUAA": 0.0,
      "EIMI": 0.02,
      "MEUD": 0.01,
      "QDVE": -0.02,
      "AGGU": 0.05,
      "IUSN": 0.01,
      "VUSA": 0.0,
      "SGLD": 0.0,
      "XEON": 1.0
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
    "id": "ecb-55005790",
    "title": "\ud83c\uddea\ud83c\uddfa ECB: Philip R. Lane: Diagnostic Challenges for ECB Monetary Policy",
    "summary": "",
    "date": "Mon, 05 Oct 2026 10:00:00 +0200",
    "source": "European Central Bank (Official RSS Feed)",
    "sourceUrl": "https://www.ecb.europa.eu//press/key/date/2026/html/ecb.sp261005~1d8d998ef4.en.html",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.207529+00:00",
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "var(--accent-amber)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (1\u20133 Months)"
    },
    "relatedEtfs": [
      {
        "ticker": "AGGU",
        "issuer": "BlackRock / iShares",
        "relation": "EUR-hedged bond yields track ECB benchmark deposit rates directly"
      },
      {
        "ticker": "MEUD",
        "issuer": "Amundi",
        "relation": "European equities discount corporate borrowing costs based on ECB rate trajectory"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "European macroeconomic stability impacts global composite equity valuations"
      },
      {
        "ticker": "XEON",
        "issuer": "Xtrackers",
        "relation": "\u20acSTR overnight swap yield directly reflects ECB deposit facility decisions"
      },
      {
        "ticker": "IMAE",
        "issuer": "BlackRock / iShares",
        "relation": "European corporate borrowing costs and equity discount rates shift with ECB policy"
      }
    ],
    "retailAction": "ECB policy signals should not trigger ad-hoc adjustments. Bond allocations (AGGU) automatically harvest shifting yield curves. Continue monthly automated DCA without attempting to front-run rate meetings."
  },
  {
    "id": "ecb-27188412",
    "title": "\ud83c\uddea\ud83c\uddfa ECB: Decisions taken by the Governing Council of the ECB (in addition to decisions setting interest rates)",
    "summary": "",
    "date": "Fri, 02 Oct 2026 15:00:00 +0200",
    "source": "European Central Bank (Official RSS Feed)",
    "sourceUrl": "https://www.ecb.europa.eu//press/govcdec/otherdec/2026/html/ecb.gc261002~54c6b5672b.en.html",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.207529+00:00",
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "var(--accent-amber)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (1\u20133 Months)"
    },
    "relatedEtfs": [
      {
        "ticker": "AGGU",
        "issuer": "BlackRock / iShares",
        "relation": "EUR-hedged bond yields track ECB benchmark deposit rates directly"
      },
      {
        "ticker": "MEUD",
        "issuer": "Amundi",
        "relation": "European equities discount corporate borrowing costs based on ECB rate trajectory"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "European macroeconomic stability impacts global composite equity valuations"
      },
      {
        "ticker": "XEON",
        "issuer": "Xtrackers",
        "relation": "\u20acSTR overnight swap yield directly reflects ECB deposit facility decisions"
      },
      {
        "ticker": "IMAE",
        "issuer": "BlackRock / iShares",
        "relation": "European corporate borrowing costs and equity discount rates shift with ECB policy"
      }
    ],
    "retailAction": "ECB policy signals should not trigger ad-hoc adjustments. Bond allocations (AGGU) automatically harvest shifting yield curves. Continue monthly automated DCA without attempting to front-run rate meetings."
  },
  {
    "id": "ecb-84248112",
    "title": "\ud83c\uddea\ud83c\uddfa ECB: Boris Vuj\u010di\u0107: Resilience, integration and competitiveness: building the future of European banking",
    "summary": "",
    "date": "Fri, 02 Oct 2026 13:30:00 +0200",
    "source": "European Central Bank (Official RSS Feed)",
    "sourceUrl": "https://www.ecb.europa.eu//press/key/date/2026/html/ecb.sp261002_1~419efe18e0.en.html",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.207529+00:00",
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "var(--accent-amber)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (1\u20133 Months)"
    },
    "relatedEtfs": [
      {
        "ticker": "AGGU",
        "issuer": "BlackRock / iShares",
        "relation": "EUR-hedged bond yields track ECB benchmark deposit rates directly"
      },
      {
        "ticker": "MEUD",
        "issuer": "Amundi",
        "relation": "European equities discount corporate borrowing costs based on ECB rate trajectory"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "European macroeconomic stability impacts global composite equity valuations"
      },
      {
        "ticker": "XEON",
        "issuer": "Xtrackers",
        "relation": "\u20acSTR overnight swap yield directly reflects ECB deposit facility decisions"
      },
      {
        "ticker": "IMAE",
        "issuer": "BlackRock / iShares",
        "relation": "European corporate borrowing costs and equity discount rates shift with ECB policy"
      }
    ],
    "retailAction": "ECB policy signals should not trigger ad-hoc adjustments. Bond allocations (AGGU) automatically harvest shifting yield curves. Continue monthly automated DCA without attempting to front-run rate meetings."
  },
  {
    "id": "ecb-3819661",
    "title": "\ud83c\uddea\ud83c\uddfa ECB: Isabel Schnabel: Central banks on-chain",
    "summary": "",
    "date": "Thu, 01 Oct 2026 17:30:00 +0200",
    "source": "European Central Bank (Official RSS Feed)",
    "sourceUrl": "https://www.ecb.europa.eu//press/key/date/2026/html/ecb.sp261001_1~a0be67193b.en.pdf",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.207529+00:00",
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "var(--accent-amber)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (1\u20133 Months)"
    },
    "relatedEtfs": [
      {
        "ticker": "AGGU",
        "issuer": "BlackRock / iShares",
        "relation": "EUR-hedged bond yields track ECB benchmark deposit rates directly"
      },
      {
        "ticker": "MEUD",
        "issuer": "Amundi",
        "relation": "European equities discount corporate borrowing costs based on ECB rate trajectory"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "European macroeconomic stability impacts global composite equity valuations"
      },
      {
        "ticker": "XEON",
        "issuer": "Xtrackers",
        "relation": "\u20acSTR overnight swap yield directly reflects ECB deposit facility decisions"
      },
      {
        "ticker": "IMAE",
        "issuer": "BlackRock / iShares",
        "relation": "European corporate borrowing costs and equity discount rates shift with ECB policy"
      }
    ],
    "retailAction": "ECB policy signals should not trigger ad-hoc adjustments. Bond allocations (AGGU) automatically harvest shifting yield curves. Continue monthly automated DCA without attempting to front-run rate meetings."
  },
  {
    "id": "ecb-70282421",
    "title": "\ud83c\uddea\ud83c\uddfa ECB: Christine Lagarde: Where AI risks meet",
    "summary": "",
    "date": "Thu, 01 Oct 2026 15:30:00 +0200",
    "source": "European Central Bank (Official RSS Feed)",
    "sourceUrl": "https://www.ecb.europa.eu//press/key/date/2026/html/ecb.sp261001~cf3c630379.en.html",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.207529+00:00",
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "var(--accent-amber)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (1\u20133 Months)"
    },
    "relatedEtfs": [
      {
        "ticker": "AGGU",
        "issuer": "BlackRock / iShares",
        "relation": "EUR-hedged bond yields track ECB benchmark deposit rates directly"
      },
      {
        "ticker": "MEUD",
        "issuer": "Amundi",
        "relation": "European equities discount corporate borrowing costs based on ECB rate trajectory"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "European macroeconomic stability impacts global composite equity valuations"
      },
      {
        "ticker": "XEON",
        "issuer": "Xtrackers",
        "relation": "\u20acSTR overnight swap yield directly reflects ECB deposit facility decisions"
      },
      {
        "ticker": "IMAE",
        "issuer": "BlackRock / iShares",
        "relation": "European corporate borrowing costs and equity discount rates shift with ECB policy"
      }
    ],
    "retailAction": "ECB policy signals should not trigger ad-hoc adjustments. Bond allocations (AGGU) automatically harvest shifting yield curves. Continue monthly automated DCA without attempting to front-run rate meetings."
  },
  {
    "id": "mw-98293018",
    "title": "\ud83c\udf10 MarketWatch: I bought a $126 concert ticket for my sister and now she can\u2019t go. Will I be able to make a profit selling the ticket?",
    "summary": "\u201cI\u2019m having trouble accepting that I\u2019ll probably lose some money.\u201d",
    "date": "Mon, 05 Oct 2026 14:38:00 GMT",
    "source": "MarketWatch Wire Service",
    "sourceUrl": "https://www.marketwatch.com/story/i-bought-a-126-concert-ticket-for-my-sister-and-now-she-cant-go-will-i-be-able-to-make-a-profit-selling-the-ticket-1dd5cbe9?mod=mw_rss_topstories",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.304502+00:00",
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "var(--accent-amber)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Tactical (1\u20134 Weeks)"
    },
    "relatedEtfs": [
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "US large caps reflect broader market sentiment and quarterly earnings reports"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "Global equities absorb headline volatility across international trading sessions"
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "US tech valuations respond with high beta to market sentiment and rate shifts"
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "All-world diversified equities capture aggregate global earnings momentum"
      }
    ],
    "retailAction": "Market noise is the enemy of compounding. Avoid buying into momentum sector spikes or panic-selling during pullbacks. Maintain total market diversification."
  },
  {
    "id": "mw-98571573",
    "title": "\ud83c\udf10 MarketWatch: Intel\u2019s stock drops after Musk hints at an additional partner for big chip venture",
    "summary": "Intel may not be the only semiconductor company tapped to help with chip manufacturing for the Terafab project, as Elon Musk said discussions with TSMC are ongoing.",
    "date": "Mon, 05 Oct 2026 14:38:00 GMT",
    "source": "MarketWatch Wire Service",
    "sourceUrl": "https://www.marketwatch.com/story/musk-hints-tsmc-may-join-his-mega-chip-venture-and-intels-stock-is-taking-a-hit-61c67ef9?mod=mw_rss_topstories",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.304502+00:00",
    "signal": {
      "bias": "Caution / Volatility Spike",
      "biasColor": "var(--accent-rose)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (1\u20134 Weeks)"
    },
    "relatedEtfs": [
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "US large caps reflect broader market sentiment and quarterly earnings reports"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "Global equities absorb headline volatility across international trading sessions"
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "US tech valuations respond with high beta to market sentiment and rate shifts"
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "All-world diversified equities capture aggregate global earnings momentum"
      }
    ],
    "retailAction": "Market noise is the enemy of compounding. Avoid buying into momentum sector spikes or panic-selling during pullbacks. Maintain total market diversification."
  },
  {
    "id": "mw-42898515",
    "title": "\ud83c\udf10 MarketWatch: I got a $499 body scan to see if I have cancer. Here\u2019s what I learned.",
    "summary": "Our healthcare system is designed to diagnose the presence or absence of disease, one organ at a time. That means people have no baseline against which to make broader lifestyle decisions.",
    "date": "Mon, 05 Oct 2026 14:35:00 GMT",
    "source": "MarketWatch Wire Service",
    "sourceUrl": "https://www.marketwatch.com/story/i-got-a-499-body-scan-to-see-if-i-have-cancer-heres-what-i-learned-09cfca29?mod=mw_rss_topstories",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.304502+00:00",
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "var(--accent-amber)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Tactical (1\u20134 Weeks)"
    },
    "relatedEtfs": [
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "US large caps reflect broader market sentiment and quarterly earnings reports"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "Global equities absorb headline volatility across international trading sessions"
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "US tech valuations respond with high beta to market sentiment and rate shifts"
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "All-world diversified equities capture aggregate global earnings momentum"
      }
    ],
    "retailAction": "Market noise is the enemy of compounding. Avoid buying into momentum sector spikes or panic-selling during pullbacks. Maintain total market diversification."
  },
  {
    "id": "mw-72819039",
    "title": "\ud83c\udf10 MarketWatch: This $23 billion software deal was struck at a decade-low valuation, as AI winner takes out loser",
    "summary": "Schneider Electric, the maker of electrical equipment that has thrived from the AI build-out, on Monday struck a $23 billion deal to buy an industrial-design software company at a bargain-basement valuation.",
    "date": "Mon, 05 Oct 2026 13:58:00 GMT",
    "source": "MarketWatch Wire Service",
    "sourceUrl": "https://www.marketwatch.com/story/this-23-billion-software-deal-was-struck-at-a-decade-low-valuation-as-ai-winner-takes-out-loser-aa18f477?mod=mw_rss_topstories",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.304502+00:00",
    "signal": {
      "bias": "Bullish Sentiment",
      "biasColor": "var(--accent-emerald)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Tactical (1\u20134 Weeks)"
    },
    "relatedEtfs": [
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "US large caps reflect broader market sentiment and quarterly earnings reports"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "Global equities absorb headline volatility across international trading sessions"
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "US tech valuations respond with high beta to market sentiment and rate shifts"
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "All-world diversified equities capture aggregate global earnings momentum"
      }
    ],
    "retailAction": "Market noise is the enemy of compounding. Avoid buying into momentum sector spikes or panic-selling during pullbacks. Maintain total market diversification."
  },
  {
    "id": "mw-17533882",
    "title": "\ud83c\udf10 MarketWatch: Falling wages, soaring energy prices and inflation: It\u2019s beginning to look a lot like the 1970s",
    "summary": "Is it time to dust off the financial playbook from that dismal decade?",
    "date": "Mon, 05 Oct 2026 13:49:00 GMT",
    "source": "MarketWatch Wire Service",
    "sourceUrl": "https://www.marketwatch.com/story/falling-wages-soaring-energy-prices-and-inflation-its-beginning-to-look-a-lot-like-the-1970s-d645cbca?mod=mw_rss_topstories",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.304502+00:00",
    "signal": {
      "bias": "Caution / Volatility Spike",
      "biasColor": "var(--accent-rose)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (1\u20134 Weeks)"
    },
    "relatedEtfs": [
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "US large caps reflect broader market sentiment and quarterly earnings reports"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "Global equities absorb headline volatility across international trading sessions"
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "US tech valuations respond with high beta to market sentiment and rate shifts"
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "All-world diversified equities capture aggregate global earnings momentum"
      }
    ],
    "retailAction": "Market noise is the enemy of compounding. Avoid buying into momentum sector spikes or panic-selling during pullbacks. Maintain total market diversification."
  },
  {
    "id": "mw-11024135",
    "title": "\ud83c\udf10 MarketWatch: An AI \u2018reality check\u2019 may take the S&P 500 to 5,000. Here are the trades to make, this strategist says.",
    "summary": "Keep an eye on artificial-intelligence spending in the upcoming earnings season, Panmure Liberum\u2019s Joachim Klement said.",
    "date": "Mon, 05 Oct 2026 13:30:00 GMT",
    "source": "MarketWatch Wire Service",
    "sourceUrl": "https://www.marketwatch.com/story/an-ai-reality-check-may-take-the-s-p-500-to-5-000-heres-the-trades-to-make-this-strategist-says-263cf0e9?mod=mw_rss_topstories",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.304502+00:00",
    "signal": {
      "bias": "Bullish Sentiment",
      "biasColor": "var(--accent-emerald)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Tactical (1\u20134 Weeks)"
    },
    "relatedEtfs": [
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "US large caps reflect broader market sentiment and quarterly earnings reports"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "Global equities absorb headline volatility across international trading sessions"
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "US tech valuations respond with high beta to market sentiment and rate shifts"
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "All-world diversified equities capture aggregate global earnings momentum"
      }
    ],
    "retailAction": "Market noise is the enemy of compounding. Avoid buying into momentum sector spikes or panic-selling during pullbacks. Maintain total market diversification."
  },
  {
    "id": "mw-58990786",
    "title": "\ud83c\udf10 MarketWatch: \u2018The pain was excruciating\u2019: A friend in her 80s fell down her basement stairs. Could it have been avoided?",
    "summary": "\u201cShe developed pleural effusion \u2014 fluid between the lungs and ribs \u2014 compressing her lungs and making it hard for her to breathe.\u201d",
    "date": "Mon, 05 Oct 2026 13:00:00 GMT",
    "source": "MarketWatch Wire Service",
    "sourceUrl": "https://www.marketwatch.com/story/the-pain-was-excruciating-a-friend-in-her-80s-fell-down-her-basement-stairs-could-it-have-been-avoided-ce105db6?mod=mw_rss_topstories",
    "isLiveStream": true,
    "fetchedAt": "2026-10-05T14:48:14.304502+00:00",
    "signal": {
      "bias": "Bullish Sentiment",
      "biasColor": "var(--accent-emerald)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Tactical (1\u20134 Weeks)"
    },
    "relatedEtfs": [
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "US large caps reflect broader market sentiment and quarterly earnings reports"
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "Global equities absorb headline volatility across international trading sessions"
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "US tech valuations respond with high beta to market sentiment and rate shifts"
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "All-world diversified equities capture aggregate global earnings momentum"
      }
    ],
    "retailAction": "Market noise is the enemy of compounding. Avoid buying into momentum sector spikes or panic-selling during pullbacks. Maintain total market diversification."
  },
  {
    "id": "macro-ecb-estr-rates",
    "date": "2026-09-28",
    "title": "ECB Monetary Policy Easing & Euro Short-Term Rate (\u20acSTR) Benchmark Transmission",
    "summary": "The European Central Bank is adjusting policy interest rates and reserve remuneration frameworks. \u20acSTR overnight benchmark yields and European government bond yields react directly to ECB deposit facility guidance, shifting capital yields on cash-like swap instruments and fixed income durations.",
    "source": "European Central Bank (Official Monetary Policy Decisions & \u20acSTR Benchmark)",
    "sourceUrl": "https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_short-term_rate/html/index.en.html",
    "isLiveStream": false,
    "signal": {
      "bias": "Watch / Neutral",
      "biasColor": "var(--accent-amber)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (1\u20136 Months)",
      "sentimentScore": 55
    },
    "relatedEtfs": [
      {
        "ticker": "XEON",
        "issuer": "Xtrackers",
        "relation": "Direct Mathematical Link: XEON accrues the \u20acSTR benchmark rate (+8.5 bps index spread) on a daily compounded basis via sovereign swap collateral. When the ECB cuts its deposit facility rate, the annualized return on XEON mechanically adjusts within 24 hours without duration price risk."
      },
      {
        "ticker": "AGGU",
        "issuer": "BlackRock / iShares",
        "relation": "Inverse Price Transmission: Falling policy rates drive sovereign yield curves lower across intermediate maturities (1-10 years), generating capital price appreciation across AGGU's 6.7-year effective duration portfolio."
      },
      {
        "ticker": "IMAE",
        "issuer": "BlackRock / iShares",
        "relation": "Financing Relief: Lower borrowing costs reduce corporate financing friction for European debt-laden industrials, utilities, and cyclicals in MSCI Europe."
      },
      {
        "ticker": "MEUD",
        "issuer": "Amundi",
        "relation": "Broad European 600 constituents discount corporate debt service costs, expanding forward operating earnings multiples."
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "European monetary stabilization supports global composite equity valuations and non-US liquidity."
      }
    ],
    "retailAction": "Treat XEON strictly as an emergency fund or capital preservation cash instrument, not a long-term compounding engine. As ECB rates normalize, cash yields adjust downward; continue automated DCA into global equities (IUSQ/VWCE)."
  },
  {
    "id": "macro-ai-hyperscaler-power-grid",
    "date": "2026-09-25",
    "title": "Hyperscaler Capex Tops $220B as AI Datacenter Power Grid & Nuclear Deals Accelerate",
    "summary": "Hyperscale cloud operators (Microsoft, Amazon AWS, Alphabet, Meta) have escalated their combined infrastructure capital expenditures past $220B, sparking aggressive procurement of electrical transmission gear, liquid cooling subsystems, and multi-gigawatt baseload nuclear/clean power contracts.",
    "source": "Bloomberg Intelligence / International Energy Agency (IEA) Datacenter Grid Report",
    "sourceUrl": "https://www.iea.org/reports/electricity-2024",
    "isLiveStream": false,
    "signal": {
      "bias": "Bullish for Infrastructure & Semis",
      "biasColor": "var(--accent-emerald)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Strategic (1\u20133 Years)",
      "sentimentScore": 86
    },
    "relatedEtfs": [
      {
        "ticker": "AII",
        "issuer": "BlackRock / iShares",
        "relation": "Primary Structural Beneficiary: Over 65% of AII consists of electrical grid equipment (Vertiv, Eaton, Schneider Electric) and clean/nuclear merchant power generators (Constellation Energy, Vistra). Hyperscaler long-term Power Purchase Agreements (PPAs) guarantee baseload utility revenue."
      },
      {
        "ticker": "WTAI",
        "issuer": "WisdomTree",
        "relation": "Downstream Software Translation: Enterprise software and algorithm developers in WTAI capture growing corporate AI seat licenses, though high compute inference costs constrain near-term operating margins."
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "Direct Hardware Demand: NVIDIA (21.4%) and Broadcom (5.2%) capture direct semiconductor capex procurement for next-generation AI clusters."
      },
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "Tech Weight Beta: Hyperscaler mega-caps (Microsoft, Amazon, Alphabet, Meta, NVIDIA) drive S&P 500 earnings growth, retaining ~32% index tech weight."
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "Global Exposure: US mega-cap technology comprises ~20% of the entire MSCI ACWI global index, transmitting datacenter earnings growth directly to all-world investors."
      }
    ],
    "retailAction": "AII and WTAI represent concentrated thematic bets with elevated valuation multiples (P/E 28\u201335x). Broad market funds like IUSQ and VWCE already capture 60%+ of the AI economic value chain through foundational corporate adoption without single-theme obsolescence risk."
  },
  {
    "id": "macro-china-critical-minerals-export-controls",
    "date": "2026-09-20",
    "title": "China Tightens Export Controls on Antimony, Gallium, and Rare Earth Processing Tech",
    "summary": "China's Ministry of Commerce expanded export licensing restrictions on antimony, gallium, germanium, and rare earth processing equipment. The measures tighten supply chains for permanent magnet manufacturing and battery cells, accelerating domestic subsidies for ex-China mining leaders.",
    "source": "European Commission / Reuters Mining & Trade Dispatch",
    "sourceUrl": "https://single-market-economy.ec.europa.eu/sectors/raw-materials/areas-specific-interest/critical-raw-materials_en",
    "isLiveStream": false,
    "signal": {
      "bias": "Bullish for Non-China Mining Champions",
      "biasColor": "var(--accent-emerald)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical to Strategic (6\u201324 Months)",
      "sentimentScore": 76
    },
    "relatedEtfs": [
      {
        "ticker": "RARE",
        "issuer": "WisdomTree",
        "relation": "Direct Pricing Catalyst: China dominates 70% of global rare earth extraction and 90% of magnet refining. Quota restrictions on export of dysprosium, terbium, and antimony drive spot price premiums for Western ex-China producers (MP Materials, Lynas Rare Earths, Iluka Resources, representing ~18% of RARE), while catalyzing US DoD and EU Critical Raw Materials Act domestic subsidies."
      },
      {
        "ticker": "BATT",
        "issuer": "Legal & General",
        "relation": "Component Supply Friction: Rare earth elements (neodymium) are critical for EV permanent magnet synchronous motors. Higher procurement costs create mild gross margin headwinds for electric vehicle assemblers."
      }
    ],
    "retailAction": "Thematic commodity materials funds like RARE exhibit extreme idiosyncratic volatility (annualized volatility >26%) and boom-bust supercycles. Limit any strategic tilt to <=5-10% of portfolio value, and rebalance systematically into global equities when mining stocks spike."
  },
  {
    "id": "macro-lithium-market-battery-margins",
    "date": "2026-09-17",
    "title": "Global Lithium Supply Surplus Compresses Mine Margins While EV Battery Cell Production Expands",
    "summary": "Global spodumene and lithium chemical oversupply continues to suppress upstream extraction margins across Australian and South American miners, while simultaneously driving battery pack costs below $100/kWh to benefit diversified downstream cell manufacturers.",
    "source": "Financial Times Commodity Markets / BloombergNEF Energy Storage Outlook",
    "sourceUrl": "https://about.bnef.com/energy-storage/",
    "isLiveStream": false,
    "signal": {
      "bias": "Caution / Sector Margin Bifurcation",
      "biasColor": "var(--accent-rose)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (3\u201312 Months)",
      "sentimentScore": 42
    },
    "relatedEtfs": [
      {
        "ticker": "BATT",
        "issuer": "Legal & General",
        "relation": "Upstream vs Downstream Divergence: Falling spodumene and lithium carbonate prices compress EBITDA margins for lithium mining extractors (Albemarle, Pilbara Minerals, SQM). Conversely, cheaper cathode input costs lower pack prices to <$100/kWh, improving margins for diversified downstream battery pack manufacturers (CATL, BYD, Samsung SDI, LG Energy Solution)."
      },
      {
        "ticker": "RARE",
        "issuer": "WisdomTree",
        "relation": "Mutes battery metal sentiment, though insulated by non-lithium rare earths (antimony, niobium, titanium)."
      }
    ],
    "retailAction": "BATT's diversified value-chain structure (spanning mining, chemicals, battery cells, and EV hardware) dampens pure-commodity collapse. However, high cyclicality reminds retail investors why total-market indexing (IUSQ/VWCE) minimizes drawdown trauma."
  },
  {
    "id": "macro-pboc-liquidity-csi300",
    "date": "2026-09-24",
    "title": "People's Bank of China & Politburo Launch Comprehensive Monetary Easing & Equity Liquidity Swaps",
    "summary": "The People's Bank of China rolled out comprehensive monetary stimulus measures including reserve requirement cuts and 800B yuan in dedicated liquidity swap and share buyback refinancing facilities to stabilize mainland equity benchmarks.",
    "source": "People's Bank of China (PBoC) Official Statement / Financial Times / Reuters",
    "sourceUrl": "http://www.pbc.gov.cn/en/3688140/index.html",
    "isLiveStream": false,
    "signal": {
      "bias": "Bullish / Tactical Liquidity Rebound",
      "biasColor": "var(--accent-emerald)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Tactical (3\u20139 Months)",
      "sentimentScore": 79
    },
    "relatedEtfs": [
      {
        "ticker": "XCS6",
        "issuer": "Xtrackers",
        "relation": "Direct Valuation Re-Rating: The CSI 300 index tracks the 300 largest mainland A-share equities on Shanghai and Shenzhen exchanges. PBoC's direct 500B yuan institutional swap facility and 300B yuan share buyback refinancing window provide direct institutional bids for top A-share holdings (Kweichow Moutai, CATL, Ping An Insurance, China Merchants Bank)."
      },
      {
        "ticker": "EIMI",
        "issuer": "BlackRock / iShares",
        "relation": "Emerging Markets Catalyst: China constitutes ~24% of EIMI. Major rallies in mainland and Hong Kong equities drive significant beta outperformance in EM benchmarks."
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "Composite Tailwind: China accounts for ~3% of all-country world equities, providing modest composite tailwinds."
      }
    ],
    "retailAction": "Do not chase sharp single-country speculative spikes with new capital. If you hold XCS6 or EIMI as an intentional emerging markets allocation, stick to your target rebalancing band. Let the asset allocation plan dictate your trades."
  },
  {
    "id": "macro-eu-competitiveness-draghi",
    "date": "2026-09-15",
    "title": "EU Competitiveness Blueprint Urges \u20ac800B Annual Investment in Energy, Tech, and Capital Markets",
    "summary": "Mario Draghi's strategic report to the European Commission calls for up to \u20ac800B in annual joint public and private investments across energy infrastructure, industrial decarbonization, and advanced technology to bridge the EU productivity gap.",
    "source": "European Commission / Mario Draghi Competitiveness Report / Eurostat",
    "sourceUrl": "https://commission.europa.eu/topics/strengthening-european-competitiveness/eu-competitiveness-looking-ahead_en",
    "isLiveStream": false,
    "signal": {
      "bias": "Bullish for European Blue Chips",
      "biasColor": "var(--accent-emerald)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Strategic (2\u20135 Years)",
      "sentimentScore": 74
    },
    "relatedEtfs": [
      {
        "ticker": "IMAE",
        "issuer": "BlackRock / iShares",
        "relation": "Structural Long-Term Catalyst: MSCI Europe is anchored by world-class global export leaders in healthcare (Novo Nordisk, AstraZeneca, Roche), industrials & electrification (Schneider Electric, Siemens, ABB), and semiconductors (ASML). Coordinated EU energy market integration and cross-border capital consolidation lift European corporate ROIC and narrow the valuation discount versus US equities."
      },
      {
        "ticker": "MEUD",
        "issuer": "Amundi",
        "relation": "Pan-European Exposure: Stoxx 600 constituents benefit from deregulation and infrastructure contracts."
      },
      {
        "ticker": "IWDA",
        "issuer": "BlackRock / iShares",
        "relation": "Europe represents ~18% of MSCI World; stable European earnings support broad global index resilience."
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "European equities comprise ~16% of ACWI, providing essential non-US valuation diversification."
      }
    ],
    "retailAction": "Valuation matters over decades: European equities (IMAE) trade at ~14.5x forward earnings with 3.2% dividend yields, compared to 21.5x for the US S&P 500. Maintaining a deliberate European allocation cushions against US valuation multiple compression."
  },
  {
    "id": "macro-global-dividend-record",
    "date": "2026-09-14",
    "title": "Global Corporate Dividends Reach Record $1.75 Trillion Led by Financials, Energy, and Telecoms",
    "summary": "Corporate distributions reached an unprecedented $1.75T worldwide according to global dividend indices. Accumulating UCITS ETFs allow retail investors to automatically reinvest distributions gross-of-tax, eliminating dividend withholding friction.",
    "source": "S&P Global Market Intelligence / Morningstar Dividend Study",
    "sourceUrl": "https://www.spglobal.com/marketintelligence/en/news-insights/research/global-dividend-trends",
    "isLiveStream": false,
    "signal": {
      "bias": "Watch / Neutral Income Quality",
      "biasColor": "var(--accent-amber)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Strategic (1\u20133 Years)",
      "sentimentScore": 62
    },
    "relatedEtfs": [
      {
        "ticker": "VHYL",
        "issuer": "Vanguard",
        "relation": "Direct Yield Confirmation: Strong capital return policies from financial leaders (JPMorgan Chase, HSBC, BNP Paribas) and energy/healthcare blue chips underpin VHYL's ~3.6% trailing yield and payout durability across 1,800+ global holdings."
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "Internal Compounding: Dividend growth fuels total return compounding across accumulating share classes without generating annual taxable distributions."
      },
      {
        "ticker": "VWCE",
        "issuer": "Vanguard",
        "relation": "Accumulating efficiency automatically captures global cash dividends and reinvests them into new shares at NAV without broker friction."
      }
    ],
    "retailAction": "Remember tax efficiency: In taxable accounts for European investors, distributing funds like VHYL trigger annual dividend withholding tax and mandatory drag. Accumulating alternatives (like IUSQ or VWCE) allow 100% of dividends to compound internally gross-of-tax."
  },
  {
    "id": "macro-fed-easing-r-star",
    "date": "2026-09-22",
    "title": "Federal Reserve Signals Sustained Easing Path as Core PCE Moderates and Labor Stabilizes",
    "summary": "The Federal Open Market Committee continues its policy recalibration toward a neutral policy rate as core inflation moderates, easing capital discount rates across US equities and sovereign debt.",
    "source": "Federal Reserve Board (Official FOMC Release & Projections) / Wall Street Journal",
    "sourceUrl": "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    "isLiveStream": false,
    "signal": {
      "bias": "Bullish for Global Equity Valuations",
      "biasColor": "var(--accent-emerald)",
      "impact": "High Impact (Critical)",
      "impactBadge": "critical",
      "timeframe": "Strategic (6\u201318 Months)",
      "sentimentScore": 81
    },
    "relatedEtfs": [
      {
        "ticker": "SXR8",
        "issuer": "BlackRock / iShares",
        "relation": "Direct Equity Multiple Support: A stable decline in short-term interest rates toward neutral (r*) reduces the equity risk premium discount rate, supporting valuations for high-ROE US blue chips (Microsoft, Apple, Alphabet, Berkshire Hathaway)."
      },
      {
        "ticker": "IUSQ",
        "issuer": "BlackRock / iShares",
        "relation": "Global Transmission: 64% US allocation transmits Fed liquidity conditions directly into global asset prices."
      },
      {
        "ticker": "AGGU",
        "issuer": "BlackRock / iShares",
        "relation": "Treasury Yield Transmission: Treasury yield declines lower global sovereign bond yields and boost capital prices across AGGU's bond portfolio."
      }
    ],
    "retailAction": "Macroeconomic forecasts are already priced into market quotes in milliseconds. Rather than attempting to guess Fed meeting outcomes, stay invested in low-cost index funds with automated monthly contributions."
  },
  {
    "id": "macro-enterprise-ai-software-monetization",
    "date": "2026-09-10",
    "title": "Enterprise AI Adoption Moves from Experimental Pilot to Scaled Workflow Integration",
    "summary": "Corporate IT spending surveys indicate that enterprise AI pilots are transitioning into permanent production seat licenses and automated workflows, expanding revenue streams for enterprise software platforms.",
    "source": "Gartner Research / Financial Times Tech Focus",
    "sourceUrl": "https://www.ft.com/technology",
    "isLiveStream": false,
    "signal": {
      "bias": "Bullish for Enterprise Software & AI",
      "biasColor": "var(--accent-emerald)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Strategic (2\u20134 Years)",
      "sentimentScore": 75
    },
    "relatedEtfs": [
      {
        "ticker": "WTAI",
        "issuer": "WisdomTree",
        "relation": "Revenue Translation: Enterprise software holdings (Palantir, ServiceNow, Synopsys, Salesforce) demonstrate accelerating contract renewal values and AI-assisted productivity seat expansion."
      },
      {
        "ticker": "QDVE",
        "issuer": "BlackRock / iShares",
        "relation": "Software Multiple Expansion: Software giants (Microsoft, Adobe, Oracle) expand margin contribution from enterprise AI copilot subscriptions."
      },
      {
        "ticker": "AII",
        "issuer": "BlackRock / iShares",
        "relation": "Compute Demand: Scaled enterprise workloads accelerate long-term inference capacity demands at tier-1 datacenters."
      }
    ],
    "retailAction": "Thematic software ETFs incur higher expense ratios (TER 0.40% on WTAI vs 0.07% on SXR8). Ensure the tracking difference and management fees do not silently erode compounding gains over 10-20 year horizons."
  },
  {
    "id": "macro-us-fiscal-debt-issuance",
    "date": "2026-09-08",
    "title": "US Treasury Refinancing & Sovereign Deficits Expand Global Bond Supply",
    "summary": "The US Treasury's quarterly refunding schedule reflects ongoing sovereign debt issuance, anchoring high structural yields across short-to-intermediate government securities and global bond portfolios.",
    "source": "US Department of the Treasury / Morningstar Fixed Income Strategy",
    "sourceUrl": "https://home.treasury.gov/policy-issues/financing-the-government/quarterly-refunding",
    "isLiveStream": false,
    "signal": {
      "bias": "Watch / Neutral Yield Carry",
      "biasColor": "var(--accent-amber)",
      "impact": "Moderate Impact",
      "impactBadge": "medium",
      "timeframe": "Strategic (1\u20135 Years)",
      "sentimentScore": 50
    },
    "relatedEtfs": [
      {
        "ticker": "AGGU",
        "issuer": "BlackRock / iShares",
        "relation": "Yield Floor: Continuous high debt issuance maintains structural yield carry (~3.8% YTM on AGGU), providing resilient annual coupon generation for balanced portfolio rebalancing."
      },
      {
        "ticker": "XEON",
        "issuer": "Xtrackers",
        "relation": "Collateral Benchmark: High short-end sovereign debt yields support collateral performance behind European derivative swap agreements."
      }
    ],
    "retailAction": "Intermediate aggregate bonds (duration 6.5\u20137 years) provide the optimal mathematical trade-off between yield carry and equity-crash protection. Avoid holding long-term bonds (>20y) which carry uncompensated term-premium volatility."
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
},
  planner: {
  "version": 1,
  "asOf": "2026-10-05",
  "currency": "EUR",
  "benchmark": "VWCE",
  "cashInstrument": "CASH",
  "purpose": "Facts and arithmetic for a short-horizon plan. The planner never proposes instruments or amounts; every amount comes from the person using it. Not investment or tax advice.",
  "defaultPortfolio": {
    "note": "Starting point of the planner (what you told us you hold). Edit it in the planner; your edits are remembered in this browser only.",
    "today": {
      "CASH": 15000,
      "BTC": 250
    },
    "candidates": [
      "AII",
      "BATT",
      "WGLD",
      "BTC"
    ]
  },
  "episodeLabels": {
    "2020-02": "2020 COVID crash",
    "2022-01": "2022 rate-hike sell-off",
    "2025-02": "2025 tariff shock"
  },
  "groups": [
    {
      "id": "stable",
      "label": "Capital-stable"
    },
    {
      "id": "gold",
      "label": "Gold"
    },
    {
      "id": "crypto",
      "label": "Crypto"
    },
    {
      "id": "theme",
      "label": "Thematic and sector equity"
    },
    {
      "id": "broad",
      "label": "Broad equity (reference)"
    }
  ],
  "instruments": [
    {
      "id": "CASH",
      "name": "Instant-access savings account (Tagesgeld)",
      "shortName": "Cash account",
      "kind": "cash",
      "group": "stable",
      "interestRate": 2.5,
      "summary": "Your bank account. The balance does not move with markets; the rate is variable. Deposits are protected by the EU statutory deposit guarantee up to \u20ac100,000 per person and bank.",
      "taxClass": "interest",
      "tradeRepublic": {
        "savingsPlan": null,
        "note": "Not a security. Trade Republic also pays 2.50% p.a. on uninvested cash since 16 Sep 2026 (variable, follows the ECB deposit rate)."
      },
      "sources": [
        {
          "label": "Directive 2014/49/EU on deposit guarantee schemes (\u20ac100,000)",
          "url": "https://eur-lex.europa.eu/eli/dir/2014/49/oj"
        }
      ]
    },
    {
      "id": "XEON",
      "name": "Xtrackers II EUR Overnight Rate Swap UCITS ETF 1C",
      "shortName": "\u20acSTR money-market ETF",
      "kind": "money-market",
      "group": "stable",
      "isin": "LU0290358497",
      "wkn": "DBX0AN",
      "yahooSymbol": "XEON.DE",
      "underlying": "Solactive \u20acSTR +8.5 Daily (euro overnight rate)",
      "inception": "2007-05-25",
      "domicile": "Luxembourg",
      "accumulating": true,
      "replication": "Synthetic (swap)",
      "ter": 0.1,
      "aumMillionsEUR": 22997,
      "summary": "Earns roughly the euro overnight rate minus costs; the price creeps up almost daily. A fund, so it is not covered by deposit insurance; its assets are kept separate from the issuer's.",
      "taxClass": "fund-other",
      "tradeRepublic": {
        "savingsPlan": null,
        "note": "Savings-plan availability not confirmed by justETF; check in the app."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=LU0290358497"
        }
      ]
    },
    {
      "id": "DBXP",
      "name": "Xtrackers II Eurozone Government Bond 1-3 UCITS ETF 1C",
      "shortName": "Euro government bonds 1\u20133y",
      "kind": "bond",
      "group": "stable",
      "isin": "LU0290356871",
      "wkn": "DBX0AD",
      "yahooSymbol": "DBXP.DE",
      "underlying": "iBoxx EUR Eurozone 1-3 (euro-area government bonds, 1\u20133 years to maturity)",
      "inception": "2007-05-25",
      "domicile": "Luxembourg",
      "accumulating": true,
      "replication": "Physical (sampling)",
      "ter": 0.1,
      "aumMillionsEUR": 3493,
      "summary": "Short-dated euro government bonds. Small price swings when interest rates move (prices fall when rates rise).",
      "taxClass": "fund-other",
      "tradeRepublic": {
        "savingsPlan": null,
        "note": "Savings-plan availability not confirmed by justETF; check in the app."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=LU0290356871"
        }
      ]
    },
    {
      "id": "WGLD",
      "name": "WisdomTree Core Physical Gold",
      "shortName": "Gold (WisdomTree Core)",
      "kind": "gold",
      "group": "gold",
      "isin": "JE00BN2CJ301",
      "yahooSymbol": "WGLD.MI",
      "priceNote": "Prices from the Borsa Italiana EUR line (Yahoo carries no Xetra line); every line tracks the same gold holdings.",
      "underlying": "Physical gold (LBMA), priced in USD",
      "inception": "2020-11-30",
      "domicile": "Jersey",
      "accumulating": true,
      "replication": "Physically backed, with a delivery option",
      "ter": 0.12,
      "aumMillionsEUR": 1843,
      "summary": "Exchange-traded commodity backed by vaulted gold. Gold is priced in US dollars, so a weaker dollar lowers the euro value.",
      "episodeProxy": "SGLD",
      "taxClass": "etc-delivery",
      "taxNote": "Listed by extraETF (Feb 2026) among gold ETCs with a delivery right, which German tax law treats like physical gold.",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Savings plan listed for Trade Republic on justETF."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=JE00BN2CJ301"
        },
        {
          "label": "extraETF: taxation of gold ETCs (updated 17 Feb 2026)",
          "url": "https://extraetf.com/de/wissen/besteuerung-von-gold-etc"
        }
      ]
    },
    {
      "id": "SGLD",
      "name": "Invesco Physical Gold ETC",
      "shortName": "Gold (Invesco)",
      "kind": "gold",
      "group": "gold",
      "isin": "IE00B579F325",
      "wkn": "A1AA5X",
      "yahooSymbol": "8PSG.DE",
      "underlying": "Physical gold, priced in USD",
      "inception": "2009-06-25",
      "domicile": "Ireland",
      "accumulating": true,
      "replication": "Physically backed",
      "ter": 0.12,
      "aumMillionsEUR": 25960,
      "summary": "The largest physical-gold ETC in Europe. Same gold exposure as WGLD, different German tax treatment.",
      "taxClass": "etc-taxable",
      "taxNote": "Listed by extraETF (Feb 2026) among gold ETCs without a delivery right, taxed with the flat capital-gains tax.",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Savings plan listed for Trade Republic on justETF."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=IE00B579F325"
        },
        {
          "label": "extraETF: taxation of gold ETCs (updated 17 Feb 2026)",
          "url": "https://extraetf.com/de/wissen/besteuerung-von-gold-etc"
        }
      ]
    },
    {
      "id": "BTC",
      "name": "Bitcoin (held directly)",
      "shortName": "Bitcoin",
      "kind": "crypto",
      "group": "crypto",
      "yahooSymbol": "BTC-EUR",
      "underlying": "Bitcoin, priced in EUR",
      "summary": "Bought directly in the Trade Republic app; custody by BitGo Deutschland GmbH. Trades around the clock.",
      "costNote": "\u20ac1 per order plus a spread of about 0.5% for Bitcoin; savings plans have no order fee (spread still applies).",
      "taxClass": "crypto-direct",
      "taxNote": "Under current law (\u00a7 23 EStG) gains are tax-free after 12 months. The federal cabinet's 2027 budget (6 Jul 2026) plans to abolish that exemption; no bill had been published as of September 2026.",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Crypto savings plans: \u20ac10 to \u20ac10,000 per execution, no order fee (price list v11.2025)."
      },
      "sources": [
        {
          "label": "extraETF: Trade Republic crypto test (14 Nov 2025)",
          "url": "https://extraetf.com/de/krypto-broker/trade-republic-krypto-broker-im-test"
        },
        {
          "label": "Trade Republic price list v11.2025",
          "url": "https://assets.traderepublic.com/documents/DE/FURTHER_INFORMATION_PRICE_LIST_20251125091224.pdf"
        },
        {
          "label": "neuebanken.de: planned end of the crypto holding period",
          "url": "https://www.neuebanken.de/krypto-haltefrist-abschaffung/"
        }
      ]
    },
    {
      "id": "AII",
      "name": "iShares AI Infrastructure UCITS ETF USD (Acc)",
      "shortName": "AI infrastructure",
      "kind": "equity",
      "group": "theme",
      "isin": "IE000X59ZHE2",
      "wkn": "A40H8L",
      "yahooSymbol": "AIFS.DE",
      "underlying": "STOXX Global AI Infrastructure index \u2014 52 stocks",
      "inception": "2024-12-05",
      "domicile": "Ireland",
      "accumulating": true,
      "replication": "Physical (full replication)",
      "ter": 0.35,
      "aumMillionsEUR": 1316,
      "exposure": "USA 79%, Taiwan 9%, South Korea 4%, Netherlands 4%; technology 88% of the fund",
      "summary": "Concentrated in US technology. Launched December 2024, so its own history covers one large market fall (February\u2013April 2025).",
      "taxClass": "fund-equity",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Savings plan listed for Trade Republic on justETF."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=IE000X59ZHE2"
        }
      ]
    },
    {
      "id": "BATT",
      "name": "L&G Battery Value-Chain UCITS ETF",
      "shortName": "Battery value chain",
      "kind": "equity",
      "group": "theme",
      "isin": "IE00BF0M2Z96",
      "wkn": "A2H5GK",
      "yahooSymbol": "BATE.DE",
      "underlying": "Solactive Battery Value-Chain index \u2014 46 stocks (miners, cell makers, technology)",
      "inception": "2018-01-23",
      "domicile": "Ireland",
      "accumulating": true,
      "replication": "Physical (full replication)",
      "ter": 0.49,
      "aumMillionsEUR": 663,
      "exposure": "USA 19%, Japan 17%, China 15%, Germany 9%",
      "summary": "Battery makers, technology firms and raw-material miners.",
      "taxClass": "fund-equity",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Savings plan listed for Trade Republic on justETF."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=IE00BF0M2Z96"
        }
      ]
    },
    {
      "id": "BRIJ",
      "name": "Global X European Infrastructure Development UCITS ETF EUR Acc",
      "shortName": "European infrastructure",
      "kind": "equity",
      "group": "theme",
      "isin": "IE000PS0J481",
      "yahooSymbol": "B41J.DE",
      "underlying": "Mirae Asset European Infrastructure Development index",
      "inception": "2024-09-03",
      "domicile": "Ireland",
      "accumulating": true,
      "replication": "Physical (full replication)",
      "ter": 0.47,
      "aumMillionsEUR": 542,
      "summary": "European companies in construction, engineering and infrastructure materials. Launched September 2024.",
      "taxClass": "fund-equity",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Savings plan listed for Trade Republic on justETF."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=IE000PS0J481"
        },
        {
          "label": "Global X fund page",
          "url": "https://globalxetfs.eu/funds/brij"
        }
      ]
    },
    {
      "id": "EXH9",
      "name": "iShares STOXX Europe 600 Utilities UCITS ETF (DE)",
      "shortName": "European utilities",
      "kind": "equity",
      "group": "theme",
      "isin": "DE000A0Q4R02",
      "yahooSymbol": "EXH9.DE",
      "underlying": "STOXX Europe 600 Utilities index \u2014 28 stocks (power and gas suppliers, grid operators)",
      "inception": "2002-07-08",
      "domicile": "Germany",
      "accumulating": false,
      "distribution": "Distributes at least annually",
      "replication": "Physical (full replication)",
      "ter": 0.47,
      "aumMillionsEUR": 786,
      "summary": "European energy providers and grid operators. Pays out dividends, which are taxed in the year they are paid.",
      "taxClass": "fund-equity",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Savings plan listed for Trade Republic on justETF."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=DE000A0Q4R02"
        }
      ]
    },
    {
      "id": "VWCE",
      "name": "Vanguard FTSE All-World UCITS ETF (USD) Accumulating",
      "shortName": "World equity (benchmark)",
      "kind": "equity",
      "group": "broad",
      "role": "benchmark",
      "isin": "IE00BK5BQT80",
      "wkn": "A2PKXG",
      "yahooSymbol": "VWCE.DE",
      "underlying": "FTSE All-World index \u2014 about 3,700 large and mid-sized companies worldwide",
      "inception": "2019-07-23",
      "domicile": "Ireland",
      "accumulating": true,
      "replication": "Physical (sampling)",
      "ter": 0.14,
      "aumMillionsEUR": 53011,
      "exposure": "USA about 63%",
      "summary": "The world stock market in one fund, and the planner's yardstick: \"the market falls 10%\" means this fund falls 10%.",
      "taxClass": "fund-equity",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Savings plan available at Trade Republic (dataset)."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=IE00BK5BQT80"
        }
      ]
    },
    {
      "id": "IMAE",
      "name": "iShares Core MSCI Europe UCITS ETF EUR (Acc)",
      "shortName": "Europe equity",
      "kind": "equity",
      "group": "broad",
      "isin": "IE00B4K48X80",
      "yahooSymbol": "IMAE.AS",
      "underlying": "MSCI Europe index \u2014 about 420 large and mid-sized European companies",
      "domicile": "Ireland",
      "accumulating": true,
      "replication": "Physical",
      "ter": 0.12,
      "aumMillionsEUR": 15726,
      "summary": "Broad European stock market without US companies.",
      "taxClass": "fund-equity",
      "tradeRepublic": {
        "savingsPlan": true,
        "note": "Savings plan available at Trade Republic (dataset)."
      },
      "sources": [
        {
          "label": "justETF profile",
          "url": "https://www.justetf.com/de/etf-profile.html?isin=IE00B4K48X80"
        }
      ]
    }
  ],
  "broker": {
    "name": "Trade Republic",
    "orderFee": 1.0,
    "orderFeeLabel": "Bestpreis order (venue picked automatically)",
    "orderFeeVenueChoice": 2.0,
    "orderFeeVenueChoiceLabel": "Direktpreis order (you pick the venue, e.g. Xetra)",
    "feeModelSince": "2026-07-01",
    "savingsPlanFee": 0,
    "savingsPlanMin": 10,
    "savingsPlanMax": 10000,
    "savingsPlanSchedule": "Savings plans start on the 2nd or 16th of a month and run weekly (2nd, 9th, 16th, 23rd), twice a month (2nd and 16th), monthly or quarterly.",
    "cashInterestRate": 2.5,
    "cashInterestSince": "2026-09-16",
    "spreadEstimates": {
      "BTC": 0.5
    },
    "notes": [
      "Partial fills of one order on the same trading day are charged once.",
      "Deposits by SEPA transfer are free; card, Apple Pay or Google Pay deposits cost 1%.",
      "Crypto custody and crypto transfers are free (network fees apply to transfers)."
    ],
    "sources": [
      {
        "label": "Trade Republic price list v11.2025",
        "url": "https://assets.traderepublic.com/documents/DE/FURTHER_INFORMATION_PRICE_LIST_20251125091224.pdf"
      },
      {
        "label": "startbase.de: Trade Republic after the PFOF ban (Bestpreis \u20ac1 / Direktpreis \u20ac2, from 1 Jul 2026)",
        "url": "https://www.startbase.de/news/trade-republic-reagiert-auf-das-pfof-aus-und-erfindet-sich-neu/"
      },
      {
        "label": "extraETF: Trade Republic savings-plan test (execution days)",
        "url": "https://extraetf.com/at/etf-sparplan/trade-republic-etf-sparplan-test"
      },
      {
        "label": "neuebanken.de: Trade Republic pays 2.50% from 16 Sep 2026",
        "url": "https://www.neuebanken.de/trade-republic-zinsen-2-50-prozent/"
      }
    ]
  },
  "tax": {
    "country": "Germany",
    "flatRate": 26.375,
    "flatRateNote": "25% flat capital-income tax plus 5.5% solidarity surcharge on it; no church tax.",
    "saversAllowance": 1000,
    "equityFundPartialExemption": 30,
    "vorabpauschaleFactor": 0.7,
    "basiszins": {
      "2024": 2.29,
      "2025": 2.53,
      "2026": 3.2
    },
    "privateSales": {
      "holdingMonths": 12,
      "exemptionLimit": 1000
    },
    "notes": [
      "The saver's allowance (Sparerpauschbetrag) is \u20ac1,000 a year for a single person, shared across all banks and brokers via exemption orders (Freistellungsauftr\u00e4ge).",
      "Accumulating funds pay a yearly advance tax (Vorabpauschale): fund value at the start of the year \u00d7 70% of the Basiszins (3.20% for 2026), capped at the fund's actual gain that year. In the year of purchase it shrinks by one twelfth for every full month before the purchase month. It is deducted in January of the following year and credited when you sell.",
      "Private-sale rules (directly held crypto, gold ETCs with a delivery right): gains are tax-free after 12 months. Sold sooner, gains are taxed at your personal income-tax rate, but only if all private-sale gains of the year reach \u20ac1,000 (an exemption limit, not an allowance).",
      "Losses on shares/funds can only offset gains in the same category; your broker keeps loss pots automatically.",
      "Simplified overview, not tax advice."
    ],
    "sources": [
      {
        "label": "finanzfluss: Freistellungsauftrag (\u20ac1,000 since 2023)",
        "url": "https://www.finanzfluss.de/geldanlage/freistellungsauftrag/"
      },
      {
        "label": "BVI: Basiszins 2026 (3.20%, BMF letter of 13 Jan 2026)",
        "url": "https://direkt.bvi.de/fileadmin/user_upload/letter/2026/COO.7005.100.4.13897455.pdf"
      },
      {
        "label": "Blockpit: crypto tax in Germany 2026 (\u00a7 23 EStG, \u20ac1,000 exemption limit)",
        "url": "https://www.blockpit.io/de-de/steuer-guides/krypto-steuer-deutschland"
      },
      {
        "label": "extraETF: taxation of gold ETCs (updated 17 Feb 2026)",
        "url": "https://extraetf.com/de/wissen/besteuerung-von-gold-etc"
      }
    ]
  },
  "marketContext": [
    {
      "label": "ECB deposit rate",
      "value": "2.50%",
      "detail": "Raised twice in 2026 (17 June and 16 September). Next decision 29 October 2026.",
      "source": {
        "label": "ECB key interest rates",
        "url": "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html"
      }
    },
    {
      "label": "Euro-area inflation (ECB projection)",
      "value": "3.0% in 2026",
      "detail": "September 2026 staff projections: 3.0% in 2026, 2.5% in 2027, 2.1% in 2028. A 2.5% account rate is below that.",
      "source": {
        "label": "ECB decision of 10 Sep 2026 (summary)",
        "url": "https://forexfundamentals.com/economic-calendar/ecb/2026-09-10"
      }
    },
    {
      "label": "US valuation (S&P 500 Shiller CAPE)",
      "value": "\u2248 40.6",
      "detail": "September 2026: second-highest reading since 1881; the record was 44.2 in December 1999. The long-run average is about 17.",
      "source": {
        "label": "TheStreet: S&P 500 CAPE second-highest ever",
        "url": "https://www.thestreet.com/investing/sp-500-shiller-cape-ratio-dot-com-warning-2026"
      }
    },
    {
      "label": "German infrastructure fund",
      "value": "\u20ac500 bn",
      "detail": "Special fund for infrastructure and climate neutrality, created by a constitutional amendment in March 2025 and financed by borrowing.",
      "source": {
        "label": "Bundesregierung: Sonderverm\u00f6gen",
        "url": "https://www.bundesregierung.de/breg-de/aktuelles/sondervermoegen-2356240"
      }
    },
    {
      "label": "Crypto tax exemption",
      "value": "Under review",
      "detail": "The cabinet's 2027 budget (6 Jul 2026) plans to end the 12-month exemption for crypto gains. Not law; no bill published as of September 2026.",
      "source": {
        "label": "anwalt.de: crypto taxes 2026",
        "url": "https://www.anwalt.de/rechtstipps/krypto-steuern-2026-ende-der-haltefrist-so-reagieren-anleger-jetzt-278155.html"
      }
    }
  ],
  "education": [
    {
      "id": "lump-vs-phased",
      "title": "All at once or in steps?",
      "text": "Vanguard compared investing a lump sum at once with spreading it over 12 months (MSCI World, 1976\u20132022): the lump sum came out ahead in about 68% of rolling one-year periods, because markets rose more often than they fell. Spreading the purchases mainly reduces the damage, and the regret, if prices fall soon after you buy.",
      "source": {
        "label": "Vanguard: Cost averaging \u2014 invest now or temporarily hold your cash?",
        "url": "https://corporate.vanguard.com/content/dam/corp/research/pdf/cost_averaging_invest_now_or_temporarily_hold_your_cash.pdf"
      }
    },
    {
      "id": "beta",
      "title": "What the stress test measures",
      "text": "Beta is how much an instrument has tended to move for each 1% move of the world index (weekly returns, last 3 years). The episode columns repeat what each instrument actually did during the real falls of the world index, scaled to your scenario. Neither is a forecast: the next fall can hit an instrument harder than any of these."
    }
  ]
},
  plannerRisk: {
  "generatedAt": "2026-10-05T15:22:40.660111+00:00",
  "asOf": "2026-10-05",
  "benchmark": "VWCE",
  "benchmarkName": "Vanguard FTSE All-World UCITS ETF (USD) Accumulating",
  "source": "Yahoo Finance daily adjusted closes in EUR",
  "method": {
    "betaWindowYears": 3,
    "riskWindowYears": 5,
    "episodeThreshold": 10.0,
    "minWeeks": 26,
    "notes": [
      "Volatility, beta and correlation use Friday-to-Friday returns over the last 3 years, or since launch if shorter.",
      "Maximum drawdown and the worst 12-month return cover the last 5 years, or since launch if shorter.",
      "Episodes are every fall of the benchmark of at least 10% from a peak to its lowest close before that peak was regained.",
      "An instrument that did not exist during an episode has no measured move there. If it has a proxy with the same underlying, the proxy's move is shown and labelled."
    ]
  },
  "episodes": [
    {
      "id": "2020-02",
      "label": "2020 COVID crash",
      "peak": "2020-02-19",
      "trough": "2020-03-23",
      "recovered": "2021-01-06",
      "benchmarkMove": -33.4
    },
    {
      "id": "2022-01",
      "label": "2022 rate-hike sell-off",
      "peak": "2022-01-04",
      "trough": "2022-06-16",
      "recovered": "2023-12-08",
      "benchmarkMove": -16.1
    },
    {
      "id": "2025-02",
      "label": "2025 tariff shock",
      "peak": "2025-02-19",
      "trough": "2025-04-09",
      "recovered": "2025-10-01",
      "benchmarkMove": -21.1
    }
  ],
  "instruments": {
    "XEON": {
      "symbol": "XEON.DE",
      "firstDate": "2016-10-05",
      "lastDate": "2026-10-05",
      "lastPrice": 150.39,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 0.2,
      "beta": 0.0,
      "downBeta": -0.02,
      "correlation": 0.0,
      "maxDrawdown": {
        "value": -0.5,
        "peak": "2021-10-07",
        "trough": "2022-08-04",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -0.5,
        "from": "2021-10-05",
        "to": "2022-10-05",
        "windows": 1018
      },
      "episodes": {
        "2020-02": {
          "move": -0.2,
          "basis": "actual"
        },
        "2022-01": {
          "move": -0.3,
          "basis": "actual"
        },
        "2025-02": {
          "move": 0.4,
          "basis": "actual"
        }
      }
    },
    "DBXP": {
      "symbol": "DBXP.DE",
      "firstDate": "2016-10-05",
      "lastDate": "2026-10-05",
      "lastPrice": 173.665,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 1.3,
      "beta": 0.02,
      "downBeta": -0.01,
      "correlation": 0.15,
      "maxDrawdown": {
        "value": -5.5,
        "peak": "2021-11-19",
        "trough": "2023-03-06",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -5.1,
        "from": "2022-03-04",
        "to": "2023-03-06",
        "windows": 1018
      },
      "episodes": {
        "2020-02": {
          "move": -1.7,
          "basis": "actual"
        },
        "2022-01": {
          "move": -3.2,
          "basis": "actual"
        },
        "2025-02": {
          "move": 0.9,
          "basis": "actual"
        }
      }
    },
    "WGLD": {
      "symbol": "WGLD.MI",
      "firstDate": "2020-11-30",
      "lastDate": "2026-10-05",
      "lastPrice": 367.41,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 17.2,
      "beta": 0.19,
      "downBeta": 0.08,
      "correlation": 0.14,
      "maxDrawdown": {
        "value": -22.8,
        "peak": "2026-03-02",
        "trough": "2026-07-16",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -8.9,
        "from": "2022-03-08",
        "to": "2023-03-08",
        "windows": 1013
      },
      "episodes": {
        "2020-02": {
          "move": -3.3,
          "basis": "proxy",
          "proxy": "SGLD"
        },
        "2022-01": {
          "move": 9.1,
          "basis": "actual"
        },
        "2025-02": {
          "move": -0.9,
          "basis": "actual"
        }
      }
    },
    "SGLD": {
      "symbol": "8PSG.DE",
      "firstDate": "2016-10-05",
      "lastDate": "2026-10-05",
      "lastPrice": 355.22,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 20.8,
      "beta": 0.23,
      "downBeta": 0.14,
      "correlation": 0.14,
      "maxDrawdown": {
        "value": -22.6,
        "peak": "2026-03-02",
        "trough": "2026-07-17",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -8.8,
        "from": "2022-03-08",
        "to": "2023-03-08",
        "windows": 1017
      },
      "episodes": {
        "2020-02": {
          "move": -3.3,
          "basis": "actual"
        },
        "2022-01": {
          "move": 7.6,
          "basis": "actual"
        },
        "2025-02": {
          "move": -0.8,
          "basis": "actual"
        }
      }
    },
    "BTC": {
      "symbol": "BTC-EUR",
      "firstDate": "2016-10-05",
      "lastDate": "2026-10-05",
      "lastPrice": 76262.6719,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 46.0,
      "beta": 0.79,
      "downBeta": 0.35,
      "correlation": 0.22,
      "maxDrawdown": {
        "value": -73.6,
        "peak": "2021-11-08",
        "trough": "2022-11-21",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -72.6,
        "from": "2021-11-09",
        "to": "2022-11-09",
        "windows": 1462
      },
      "episodes": {
        "2020-02": {
          "move": -33.1,
          "basis": "actual"
        },
        "2022-01": {
          "move": -52.5,
          "basis": "actual"
        },
        "2025-02": {
          "move": -18.7,
          "basis": "actual"
        }
      }
    },
    "AII": {
      "symbol": "AIFS.DE",
      "firstDate": "2024-12-09",
      "lastDate": "2026-10-05",
      "lastPrice": 10.758,
      "statsFrom": "2024-12-13",
      "weeks": 94,
      "volatility": 27.1,
      "beta": 1.7,
      "downBeta": 1.49,
      "correlation": 0.85,
      "maxDrawdown": {
        "value": -31.1,
        "peak": "2025-02-19",
        "trough": "2025-04-09",
        "windowStart": "2024-12-09"
      },
      "worst12m": {
        "value": 19.3,
        "from": "2024-12-17",
        "to": "2025-12-17",
        "windows": 206
      },
      "episodes": {
        "2020-02": {
          "move": null,
          "basis": "none"
        },
        "2022-01": {
          "move": null,
          "basis": "none"
        },
        "2025-02": {
          "move": -31.1,
          "basis": "actual"
        }
      }
    },
    "BATT": {
      "symbol": "BATE.DE",
      "firstDate": "2018-02-07",
      "lastDate": "2026-10-05",
      "lastPrice": 26.52,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 25.5,
      "beta": 1.46,
      "downBeta": 1.54,
      "correlation": 0.72,
      "maxDrawdown": {
        "value": -34.0,
        "peak": "2023-07-03",
        "trough": "2025-04-09",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -25.6,
        "from": "2024-04-09",
        "to": "2025-04-09",
        "windows": 1016
      },
      "episodes": {
        "2020-02": {
          "move": -35.9,
          "basis": "actual"
        },
        "2022-01": {
          "move": -16.7,
          "basis": "actual"
        },
        "2025-02": {
          "move": -27.4,
          "basis": "actual"
        }
      }
    },
    "BRIJ": {
      "symbol": "B41J.DE",
      "firstDate": "2024-09-09",
      "lastDate": "2026-10-05",
      "lastPrice": 18.442,
      "statsFrom": "2024-09-13",
      "weeks": 107,
      "volatility": 14.9,
      "beta": 0.49,
      "downBeta": 0.39,
      "correlation": 0.43,
      "maxDrawdown": {
        "value": -13.2,
        "peak": "2026-02-27",
        "trough": "2026-10-01",
        "windowStart": "2024-09-09"
      },
      "worst12m": {
        "value": -1.6,
        "from": "2025-10-03",
        "to": "2026-10-05",
        "windows": 271
      },
      "episodes": {
        "2020-02": {
          "move": null,
          "basis": "none"
        },
        "2022-01": {
          "move": null,
          "basis": "none"
        },
        "2025-02": {
          "move": -4.7,
          "basis": "actual"
        }
      }
    },
    "EXH9": {
      "symbol": "EXH9.DE",
      "firstDate": "2016-10-05",
      "lastDate": "2026-10-05",
      "lastPrice": 55.36,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 15.4,
      "beta": 0.24,
      "downBeta": 0.1,
      "correlation": 0.19,
      "maxDrawdown": {
        "value": -22.7,
        "peak": "2022-05-23",
        "trough": "2022-10-12",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -13.7,
        "from": "2021-10-21",
        "to": "2022-10-21",
        "windows": 1017
      },
      "episodes": {
        "2020-02": {
          "move": -33.2,
          "basis": "actual"
        },
        "2022-01": {
          "move": -10.8,
          "basis": "actual"
        },
        "2025-02": {
          "move": 2.7,
          "basis": "actual"
        }
      }
    },
    "VWCE": {
      "symbol": "VWCE.DE",
      "firstDate": "2019-07-29",
      "lastDate": "2026-10-05",
      "lastPrice": 172.78,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 12.6,
      "beta": 1.0,
      "downBeta": 1.0,
      "correlation": 1.0,
      "maxDrawdown": {
        "value": -21.1,
        "peak": "2025-02-19",
        "trough": "2025-04-09",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -13.7,
        "from": "2021-12-28",
        "to": "2022-12-28",
        "windows": 1016
      },
      "episodes": {
        "2020-02": {
          "move": -33.4,
          "basis": "actual"
        },
        "2022-01": {
          "move": -16.1,
          "basis": "actual"
        },
        "2025-02": {
          "move": -21.1,
          "basis": "actual"
        }
      }
    },
    "IMAE": {
      "symbol": "IMAE.AS",
      "firstDate": "2016-10-05",
      "lastDate": "2026-10-05",
      "lastPrice": 102.84,
      "statsFrom": "2023-10-06",
      "weeks": 156,
      "volatility": 12.6,
      "beta": 0.75,
      "downBeta": 0.76,
      "correlation": 0.75,
      "maxDrawdown": {
        "value": -19.4,
        "peak": "2022-01-05",
        "trough": "2022-09-29",
        "windowStart": "2021-10-05"
      },
      "worst12m": {
        "value": -12.3,
        "from": "2021-10-14",
        "to": "2022-10-14",
        "windows": 1022
      },
      "episodes": {
        "2020-02": {
          "move": -34.9,
          "basis": "actual"
        },
        "2022-01": {
          "move": -15.6,
          "basis": "actual"
        },
        "2025-02": {
          "move": -14.7,
          "basis": "actual"
        }
      }
    }
  },
  "correlations": {
    "XEON": {
      "XEON": 1.0,
      "DBXP": 0.163,
      "WGLD": 0.089,
      "SGLD": 0.046,
      "BTC": 0.185,
      "AII": -0.023,
      "BATT": -0.025,
      "BRIJ": -0.021,
      "EXH9": -0.005,
      "VWCE": 0.002,
      "IMAE": 0.001
    },
    "DBXP": {
      "DBXP": 1.0,
      "XEON": 0.163,
      "WGLD": 0.271,
      "SGLD": 0.131,
      "BTC": -0.015,
      "AII": 0.081,
      "BATT": 0.114,
      "BRIJ": 0.299,
      "EXH9": 0.383,
      "VWCE": 0.147,
      "IMAE": 0.211
    },
    "WGLD": {
      "WGLD": 1.0,
      "XEON": 0.089,
      "DBXP": 0.271,
      "SGLD": 0.777,
      "BTC": 0.055,
      "AII": 0.119,
      "BATT": 0.256,
      "BRIJ": 0.211,
      "EXH9": 0.212,
      "VWCE": 0.141,
      "IMAE": 0.16
    },
    "SGLD": {
      "SGLD": 1.0,
      "XEON": 0.046,
      "DBXP": 0.131,
      "WGLD": 0.777,
      "BTC": 0.11,
      "AII": 0.063,
      "BATT": 0.211,
      "BRIJ": 0.221,
      "EXH9": 0.106,
      "VWCE": 0.142,
      "IMAE": 0.172
    },
    "BTC": {
      "BTC": 1.0,
      "XEON": 0.185,
      "DBXP": -0.015,
      "WGLD": 0.055,
      "SGLD": 0.11,
      "AII": 0.351,
      "BATT": 0.18,
      "BRIJ": 0.052,
      "EXH9": -0.045,
      "VWCE": 0.217,
      "IMAE": 0.116
    },
    "AII": {
      "AII": 1.0,
      "XEON": -0.023,
      "DBXP": 0.081,
      "WGLD": 0.119,
      "SGLD": 0.063,
      "BTC": 0.351,
      "BATT": 0.694,
      "BRIJ": 0.228,
      "EXH9": -0.007,
      "VWCE": 0.846,
      "IMAE": 0.481
    },
    "BATT": {
      "BATT": 1.0,
      "XEON": -0.025,
      "DBXP": 0.114,
      "WGLD": 0.256,
      "SGLD": 0.211,
      "BTC": 0.18,
      "AII": 0.694,
      "BRIJ": 0.449,
      "EXH9": 0.215,
      "VWCE": 0.722,
      "IMAE": 0.681
    },
    "BRIJ": {
      "BRIJ": 1.0,
      "XEON": -0.021,
      "DBXP": 0.299,
      "WGLD": 0.211,
      "SGLD": 0.221,
      "BTC": 0.052,
      "AII": 0.228,
      "BATT": 0.449,
      "EXH9": 0.571,
      "VWCE": 0.429,
      "IMAE": 0.784
    },
    "EXH9": {
      "EXH9": 1.0,
      "XEON": -0.005,
      "DBXP": 0.383,
      "WGLD": 0.212,
      "SGLD": 0.106,
      "BTC": -0.045,
      "AII": -0.007,
      "BATT": 0.215,
      "BRIJ": 0.571,
      "VWCE": 0.192,
      "IMAE": 0.461
    },
    "VWCE": {
      "VWCE": 1.0,
      "XEON": 0.002,
      "DBXP": 0.147,
      "WGLD": 0.141,
      "SGLD": 0.142,
      "BTC": 0.217,
      "AII": 0.846,
      "BATT": 0.722,
      "BRIJ": 0.429,
      "EXH9": 0.192,
      "IMAE": 0.752
    },
    "IMAE": {
      "IMAE": 1.0,
      "XEON": 0.001,
      "DBXP": 0.211,
      "WGLD": 0.16,
      "SGLD": 0.172,
      "BTC": 0.116,
      "AII": 0.481,
      "BATT": 0.681,
      "BRIJ": 0.784,
      "EXH9": 0.461,
      "VWCE": 0.752
    }
  },
  "warnings": []
},
  performance: {"generatedAt": "2026-10-05T15:22:40.660111+00:00", "asOf": "2026-10-05", "source": "Yahoo Finance daily adjusted closes in EUR (distributions reinvested)", "instruments": {"VWCE": {"symbol": "VWCE.DE", "firstDate": "2019-07-29", "lastDate": "2026-10-05", "lastPrice": 172.78, "returns": {"1m": 2.92, "3m": 3.71, "ytd": 18.81, "1y": 21.97, "3y": 20.22, "5y": 12.42}, "sinceFirstPrice": null, "volatility": 12.6, "maxDrawdown": {"value": -21.1, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [140.12, 140.1, 143.0, 145.54, 141.54, 143.68, 140.8, 144.84, 145.16, 143.18, 144.18, 144.7, 145.14, 148.9, 149.9, 147.72, 147.22, 147.82, 147.7, 149.88, 149.82, 148.34, 146.78, 142.64, 140.98, 144.74, 148.56, 153.66, 153.6, 153.96, 158.14, 159.44, 161.62, 163.16, 162.36, 162.46, 165.44, 163.7, 165.88, 166.14, 163.5, 164.28, 162.96, 168.38, 168.88, 166.3, 168.54, 167.88, 166.86, 167.14, 169.74, 171.14, 172.78]}}, "IWDA": {"symbol": "IWDA.AS", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 131.09, "returns": {"1m": 2.86, "3m": 3.75, "ytd": 17.54, "1y": 20.42, "3y": 19.95, "5y": 12.75}, "sinceFirstPrice": null, "volatility": 12.9, "maxDrawdown": {"value": -21.6, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [107.915, 107.67, 110.585, 111.785, 108.765, 110.2, 108.105, 111.4, 111.695, 110.29, 110.95, 111.5, 111.335, 114.21, 114.775, 112.78, 112.19, 112.63, 112.275, 113.67, 113.575, 113.245, 111.905, 108.77, 107.515, 110.365, 112.98, 116.675, 116.73, 117.055, 119.51, 121.0, 122.83, 123.38, 123.33, 122.81, 124.82, 123.73, 125.74, 126.15, 124.85, 125.26, 124.23, 128.65, 128.84, 126.51, 128.22, 127.44, 126.64, 127.05, 128.91, 130.05, 131.09]}}, "SXR8": {"symbol": "SXR8.DE", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 745.86, "returns": {"1m": 4.27, "3m": 5.0, "ytd": 18.54, "1y": 21.49, "3y": 21.05, "5y": 14.27}, "sinceFirstPrice": null, "volatility": 14.0, "maxDrawdown": {"value": -23.3, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [609.56, 605.84, 619.62, 634.5, 614.14, 622.42, 612.08, 631.4, 632.28, 621.9, 624.48, 627.44, 624.74, 640.58, 642.46, 630.68, 626.26, 626.18, 619.36, 627.44, 624.02, 632.34, 624.6, 608.52, 597.92, 611.58, 625.72, 649.4, 655.72, 656.58, 674.76, 687.7, 694.82, 698.9, 698.3, 691.86, 703.54, 696.42, 706.12, 711.48, 703.46, 704.6, 696.24, 723.04, 724.18, 709.16, 721.06, 715.3, 712.94, 717.34, 730.44, 739.48, 745.86]}}, "VUAA": {"symbol": "VUAA.DE", "firstDate": "2024-12-30", "lastDate": "2026-10-05", "lastPrice": 133.74, "returns": {"1m": 4.28, "3m": 5.0, "ytd": 18.57, "1y": 21.52, "3y": null, "5y": null}, "sinceFirstPrice": {"from": "2024-12-30", "total": 24.12, "annualised": 13.04}, "volatility": 15.0, "maxDrawdown": {"value": -23.3, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2024-12-30"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [109.415, 108.55, 111.045, 113.77, 110.12, 111.58, 109.825, 113.22, 113.33, 111.52, 111.96, 112.51, 111.98, 114.84, 115.215, 113.09, 112.285, 112.265, 111.05, 112.51, 111.905, 113.435, 112.015, 109.1, 107.165, 109.645, 112.21, 116.45, 117.56, 117.74, 121.025, 123.33, 124.61, 125.32, 125.225, 124.04, 126.165, 124.865, 126.64, 127.57, 126.14, 126.33, 124.82, 129.645, 129.84, 127.145, 129.325, 128.245, 127.865, 128.63, 131.0, 132.6, 133.74]}}, "EIMI": {"symbol": "EMIM.AS", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 50.21, "returns": {"1m": 4.2, "3m": 3.54, "ytd": 30.82, "1y": 33.91, "3y": 22.64, "5y": 10.37}, "sinceFirstPrice": null, "volatility": 15.6, "maxDrawdown": {"value": -22.0, "peak": "2021-11-16", "trough": "2022-10-24", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [36.738, 37.529, 38.267, 38.835, 37.843, 38.74, 37.231, 38.062, 38.18, 37.449, 37.889, 38.012, 39.131, 40.184, 40.77, 40.897, 41.088, 41.456, 42.027, 43.17, 43.379, 40.808, 40.733, 39.703, 39.339, 40.08, 42.378, 44.352, 44.382, 44.309, 47.05, 45.895, 46.57, 47.98, 46.54, 47.865, 49.795, 48.185, 48.39, 47.895, 45.295, 45.86, 45.31, 46.515, 47.14, 47.13, 47.81, 48.185, 48.02, 47.68, 48.7, 49.055, 50.21]}}, "MEUD": {"symbol": "MEUD.PA", "firstDate": "2024-02-19", "lastDate": "2026-10-05", "lastPrice": 312.3, "returns": {"1m": -2.54, "3m": -2.31, "ytd": 9.56, "1y": 13.99, "3y": null, "5y": null}, "sinceFirstPrice": {"from": "2024-02-19", "total": 39.53, "annualised": 13.53}, "volatility": 12.8, "maxDrawdown": {"value": -16.2, "peak": "2025-03-03", "trough": "2025-04-07", "windowStart": "2024-02-19"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [270.9, 272.17, 276.0587, 274.89, 271.45, 276.5, 270.43, 277.37, 278.62, 278.37, 282.89, 285.0, 287.33, 293.78, 296.11, 293.24, 294.6, 297.44, 297.9, 304.32, 305.73, 289.1, 288.13, 277.13, 278.68, 289.62, 298.49, 304.2, 297.3, 298.1, 299.2, 296.5, 306.65, 307.15, 305.55, 311.0, 312.1, 312.35, 320.7, 315.45, 315.45, 317.15, 319.4, 325.2, 324.3, 322.3, 322.85, 320.45, 315.3, 313.4, 315.15, 311.65, 312.3]}}, "QDVE": {"symbol": "QDVE.DE", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 49.0, "returns": {"1m": 10.4, "3m": 13.07, "ytd": 36.32, "1y": 37.39, "3y": 34.66, "5y": 24.6}, "sinceFirstPrice": null, "volatility": 23.3, "maxDrawdown": {"value": -29.8, "peak": "2025-01-06", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [35.395, 34.98, 36.02, 38.03, 35.55, 36.39, 34.81, 36.015, 36.415, 35.415, 35.445, 35.785, 35.675, 35.855, 35.95, 35.145, 34.86, 34.13, 33.555, 34.255, 33.635, 34.64, 34.25, 33.445, 32.31, 33.32, 34.685, 37.25, 38.485, 37.895, 40.93, 42.475, 42.905, 44.315, 43.48, 42.72, 44.235, 42.265, 42.825, 43.615, 42.08, 42.92, 41.555, 44.795, 44.795, 43.16, 44.72, 44.385, 44.745, 45.165, 47.125, 48.505, 49.0]}}, "AGGU": {"symbol": "EUNA.DE", "firstDate": "2017-11-21", "lastDate": "2026-10-05", "lastPrice": 4.793, "returns": {"1m": -1.91, "3m": -2.81, "ytd": -3.12, "1y": -2.66, "3y": 2.43, "5y": -1.83}, "sinceFirstPrice": null, "volatility": 4.0, "maxDrawdown": {"value": -16.2, "peak": "2021-11-09", "trough": "2023-10-19", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [4.9372, 4.9542, 4.9581, 4.9516, 4.9438, 4.939, 4.9346, 4.9486, 4.9279, 4.9207, 4.9295, 4.9289, 4.9232, 4.94, 4.938, 4.9294, 4.9397, 4.9409, 4.9763, 4.9769, 5.0026, 4.9527, 4.9085, 4.8867, 4.8742, 4.9122, 4.9185, 4.9453, 4.9287, 4.9093, 4.9254, 4.878, 4.8961, 4.9342, 4.91, 4.9237, 4.9253, 4.9552, 4.9312, 4.915, 4.9111, 4.8919, 4.88, 4.9075, 4.8946, 4.8861, 4.893, 4.8862, 4.8467, 4.8378, 4.8108, 4.8039, 4.793]}}, "IUSN": {"symbol": "IUSN.DE", "firstDate": "2018-04-26", "lastDate": "2026-10-05", "lastPrice": 9.123, "returns": {"1m": -0.32, "3m": -1.31, "ytd": 17.26, "1y": 19.94, "3y": 16.97, "5y": 7.73}, "sinceFirstPrice": null, "volatility": 15.4, "maxDrawdown": {"value": -24.3, "peak": "2024-11-25", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [7.456, 7.473, 7.629, 7.628, 7.419, 7.488, 7.392, 7.729, 7.743, 7.735, 7.754, 7.769, 7.752, 8.14, 8.293, 8.228, 8.044, 8.261, 8.3, 8.403, 8.406, 8.281, 8.027, 7.831, 7.863, 8.086, 8.273, 8.559, 8.469, 8.488, 8.685, 8.618, 8.762, 8.879, 8.845, 9.027, 9.116, 9.182, 9.222, 9.11, 8.987, 9.086, 8.922, 9.227, 9.327, 9.164, 9.199, 9.152, 8.998, 8.964, 8.992, 9.076, 9.123]}}, "VUSA": {"symbol": "VUSA.AS", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 130.997, "returns": {"1m": 4.32, "3m": 5.02, "ytd": 18.78, "1y": 21.56, "3y": 21.06, "5y": 14.29}, "sinceFirstPrice": null, "volatility": 13.9, "maxDrawdown": {"value": -23.2, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [107.0202, 106.4486, 108.7717, 111.3712, 107.889, 109.2442, 107.3897, 110.8194, 110.963, 109.2076, 109.6712, 110.2869, 109.6762, 112.4814, 112.8001, 110.688, 109.9245, 109.9046, 108.7845, 110.1439, 109.6067, 111.0366, 109.6643, 106.9157, 104.9883, 107.3737, 109.8974, 114.0081, 115.1172, 115.3332, 118.4792, 120.7311, 121.9766, 122.6675, 122.5958, 121.3673, 123.5576, 122.2624, 123.9996, 124.9566, 123.4768, 123.6933, 122.1955, 126.9752, 127.1519, 124.5215, 126.604, 125.5693, 125.208, 125.999, 128.296, 129.853, 130.997]}}, "GGRA": {"symbol": "GGRA.MI", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 43.58, "returns": {"1m": 0.66, "3m": 0.9, "ytd": 10.33, "1y": 13.25, "3y": 12.52, "5y": 9.01}, "sinceFirstPrice": null, "volatility": 17.6, "maxDrawdown": {"value": -19.7, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [38.12, 38.2, 45.3694, 39.265, 38.07, 38.79, 38.415, 39.42, 39.4, 39.14, 39.26, 39.28, 39.455, 40.1, 40.515, 39.865, 39.395, 40.32, 40.39, 40.66, 40.645, 39.94, 39.245, 37.795, 37.65, 38.48, 39.56, 40.585, 40.075, 40.05, 40.565, 41.02, 41.44, 41.67, 41.965, 41.885, 42.77, 42.545, 43.34, 43.045, 43.01, 42.895, 42.91, 44.13, 43.83, 43.785, 43.73, 43.295, 42.69, 42.68, 43.105, 43.265, 43.58]}}, "FWRA": {"symbol": "FWIA.DE", "firstDate": "2023-06-29", "lastDate": "2026-10-05", "lastPrice": 8.508, "returns": {"1m": 3.01, "3m": 3.73, "ytd": 18.71, "1y": 21.98, "3y": 20.3, "5y": null}, "sinceFirstPrice": null, "volatility": 12.7, "maxDrawdown": {"value": -21.0, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2023-06-29"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [6.9, 6.894, 7.038, 7.163, 6.971, 7.08, 6.932, 7.129, 7.153, 7.058, 7.101, 7.126, 7.149, 7.337, 7.388, 7.277, 7.244, 7.283, 7.272, 7.379, 7.379, 7.309, 7.231, 7.025, 6.948, 7.125, 7.314, 7.561, 7.569, 7.585, 7.789, 7.852, 7.963, 8.037, 8.0, 7.998, 8.146, 8.049, 8.163, 8.177, 8.049, 8.084, 8.023, 8.289, 8.31, 8.18, 8.289, 8.259, 8.207, 8.222, 8.349, 8.421, 8.508]}}, "BATT": {"symbol": "BATE.DE", "firstDate": "2018-02-07", "lastDate": "2026-10-05", "lastPrice": 26.52, "returns": {"1m": -1.94, "3m": -12.82, "ytd": 4.7, "1y": 21.37, "3y": 19.67, "5y": 11.37}, "sinceFirstPrice": null, "volatility": 25.5, "maxDrawdown": {"value": -34.0, "peak": "2023-07-03", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [21.64, 22.07, 22.68, 23.93, 22.69, 24.485, 22.83, 24.555, 24.48, 24.69, 25.02, 25.105, 25.62, 26.715, 27.94, 28.79, 26.92, 26.82, 27.245, 27.825, 28.7, 26.665, 27.27, 25.98, 27.085, 28.4, 29.9, 32.005, 32.545, 33.725, 34.88, 33.1, 33.655, 34.355, 32.83, 32.12, 33.11, 30.065, 30.54, 28.675, 27.065, 26.85, 26.135, 27.675, 28.355, 27.665, 27.8, 27.045, 26.76, 25.96, 25.965, 26.205, 26.52]}}, "RARE": {"symbol": "RARE.DE", "firstDate": "2024-05-06", "lastDate": "2026-10-05", "lastPrice": 46.265, "returns": {"1m": -6.93, "3m": -3.04, "ytd": 2.37, "1y": 18.75, "3y": null, "5y": null}, "sinceFirstPrice": {"from": "2024-05-06", "total": 81.32, "annualised": 27.95}, "volatility": 32.4, "maxDrawdown": {"value": -28.9, "peak": "2026-05-07", "trough": "2026-07-20", "windowStart": "2024-05-06"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [39.0, 38.8, 38.77, 39.37, 37.985, 39.925, 37.7, 41.255, 41.5, 41.0, 43.09, 44.625, 44.865, 49.11, 51.24, 55.64, 51.69, 50.48, 53.1, 52.59, 58.0, 52.32, 50.77, 44.8, 47.94, 50.69, 53.21, 56.6, 54.72, 55.35, 57.49, 54.21, 53.5, 54.18, 49.7, 50.92, 50.94, 47.825, 47.73, 44.99, 42.615, 43.505, 43.13, 48.975, 49.26, 49.8, 51.07, 49.71, 48.22, 47.37, 46.275, 45.67, 46.265]}}, "IUSQ": {"symbol": "IUSQ.DE", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 110.74, "returns": {"1m": 2.99, "3m": 3.75, "ytd": 18.95, "1y": 22.12, "3y": 20.33, "5y": 12.53}, "sinceFirstPrice": null, "volatility": 12.8, "maxDrawdown": {"value": -21.2, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [89.72, 89.71, 91.46, 93.17, 90.57, 91.95, 90.09, 92.69, 92.92, 91.68, 92.29, 92.65, 92.95, 95.35, 95.98, 94.58, 94.19, 94.6, 94.39, 95.85, 95.76, 94.91, 93.89, 91.21, 90.19, 92.52, 95.04, 98.33, 98.38, 98.59, 101.22, 102.04, 103.5, 104.38, 104.0, 104.02, 105.96, 104.68, 106.26, 106.44, 104.82, 105.22, 104.44, 107.88, 108.24, 106.48, 107.96, 107.52, 106.92, 107.1, 108.72, 109.58, 110.74]}}, "IMAE": {"symbol": "IMAE.AS", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 102.84, "returns": {"1m": -2.56, "3m": -2.48, "ytd": 9.6, "1y": 13.83, "3y": 15.69, "5y": 10.07}, "sinceFirstPrice": null, "volatility": 12.6, "maxDrawdown": {"value": -19.4, "peak": "2022-01-05", "trough": "2022-09-29", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [89.3, 89.85, 90.9912, 90.655, 89.615, 91.26, 89.19, 91.445, 91.83, 91.755, 93.225, 93.44, 94.61, 96.69, 97.455, 96.38, 96.88, 97.735, 98.0, 100.205, 100.74, 95.275, 94.845, 91.195, 91.58, 95.145, 98.075, 99.91, 97.645, 97.845, 98.085, 97.435, 100.775, 101.02, 100.6, 102.34, 102.88, 103.01, 105.8, 104.0, 103.945, 104.485, 105.23, 107.09, 106.865, 106.305, 106.445, 105.545, 103.86, 103.19, 103.87, 102.68, 102.84]}}, "XCS6": {"symbol": "XCHA.DE", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 17.97, "returns": {"1m": -0.76, "3m": -5.5, "ytd": 7.35, "1y": 10.68, "3y": 12.44, "5y": 2.98}, "sinceFirstPrice": null, "volatility": 26.1, "maxDrawdown": {"value": -37.1, "peak": "2021-12-13", "trough": "2024-02-02", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [15.724, 15.954, 19.176, 16.578, 16.61, 16.5, 16.036, 16.312, 16.458, 16.272, 16.432, 16.536, 16.842, 17.412, 17.322, 17.036, 16.884, 16.924, 16.886, 17.208, 17.3, 17.184, 17.602, 16.908, 16.754, 16.902, 17.338, 17.758, 17.93, 18.152, 18.34, 18.472, 18.378, 18.728, 18.486, 18.48, 19.246, 19.228, 19.006, 18.864, 17.834, 18.484, 18.05, 18.56, 18.386, 18.088, 18.242, 18.108, 17.926, 18.1, 17.936, 17.808, 17.97]}}, "XEON": {"symbol": "XEON.DE", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 150.39, "returns": {"1m": 0.19, "3m": 0.55, "ytd": 1.55, "1y": 2.05, "3y": 2.84, "5y": 2.13}, "sinceFirstPrice": null, "volatility": 0.2, "maxDrawdown": {"value": -0.5, "peak": "2021-10-07", "trough": "2022-08-04", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [147.414, 147.451, 147.505, 147.589, 147.659, 147.71, 147.72, 147.807, 147.862, 147.924, 147.95, 147.985, 148.105, 148.15, 148.155, 148.242, 148.32, 148.355, 148.407, 148.477, 148.534, 148.59, 148.647, 148.688, 148.759, 148.759, 148.87, 148.902, 148.986, 149.024, 149.09, 149.145, 149.197, 149.253, 149.31, 149.365, 149.433, 149.481, 149.561, 149.606, 149.673, 149.735, 149.783, 149.86, 149.922, 149.99, 150.04, 150.11, 150.184, 150.226, 150.325, 150.386, 150.39]}}, "VHYL": {"symbol": "VGWD.DE", "firstDate": "2017-10-26", "lastDate": "2026-10-05", "lastPrice": 80.82, "returns": {"1m": -0.96, "3m": 1.63, "ytd": 18.26, "1y": 23.44, "3y": 17.95, "5y": 12.21}, "sinceFirstPrice": null, "volatility": 10.7, "maxDrawdown": {"value": -16.9, "peak": "2025-03-03", "trough": "2025-04-09", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [64.78, 65.0722, 66.0266, 66.1142, 65.5494, 66.7764, 65.9973, 67.2828, 67.5165, 67.3413, 67.8733, 67.9614, 68.5197, 70.2043, 71.3012, 70.5373, 70.9584, 73.2405, 73.8183, 74.69, 75.1503, 73.1131, 72.5745, 70.8245, 71.3561, 72.7834, 73.689, 74.4076, 73.5906, 74.4568, 74.4568, 75.0376, 76.524, 76.3369, 76.8193, 77.9021, 77.9437, 78.5005, 79.4353, 79.4154, 79.495, 80.5789, 80.1215, 80.9866, 81.2651, 80.738, 81.1855, 81.6032, 80.7778, 80.45, 80.47, 80.14, 80.82]}}, "AII": {"symbol": "AIFS.DE", "firstDate": "2024-12-09", "lastDate": "2026-10-05", "lastPrice": 10.758, "returns": {"1m": 12.52, "3m": 8.34, "ytd": 71.91, "1y": 82.71, "3y": null, "5y": null}, "sinceFirstPrice": {"from": "2024-12-09", "total": 121.75, "annualised": 54.87}, "volatility": 27.1, "maxDrawdown": {"value": -31.1, "peak": "2025-02-19", "trough": "2025-04-09", "windowStart": "2024-12-09"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [5.882, 5.97, 6.131, 6.514, 6.119, 6.225, 5.842, 6.165, 6.296, 6.105, 6.127, 6.171, 6.29, 6.551, 6.708, 6.626, 6.596, 6.355, 6.414, 6.542, 6.521, 6.542, 6.523, 6.439, 6.221, 6.421, 6.773, 7.249, 7.618, 7.664, 8.606, 8.733, 9.119, 9.719, 9.522, 9.752, 10.178, 9.732, 9.866, 9.751, 9.049, 9.193, 8.932, 9.631, 9.795, 9.412, 9.611, 9.561, 9.698, 9.824, 10.372, 10.706, 10.758]}}, "WTAI": {"symbol": "WTAI.MI", "firstDate": "2018-11-30", "lastDate": "2026-10-05", "lastPrice": 113.0, "returns": {"1m": 12.72, "3m": 4.23, "ytd": 52.97, "1y": 52.46, "3y": 32.3, "5y": 16.79}, "sinceFirstPrice": null, "volatility": 30.5, "maxDrawdown": {"value": -40.1, "peak": "2021-12-28", "trough": "2022-12-28", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [73.92, 73.35, 88.5855, 79.0, 72.26, 72.77, 67.25, 71.9, 74.48, 72.35, 72.44, 73.0, 74.41, 78.64, 79.1, 78.08, 77.14, 74.51, 74.89, 76.56, 75.41, 74.7, 74.32, 74.29, 70.73, 73.3, 75.97, 83.49, 86.9, 86.9, 94.08, 95.66, 101.01, 105.65, 104.94, 105.94, 110.91, 105.72, 106.74, 106.21, 95.68, 96.38, 94.66, 102.02, 104.4, 100.7, 102.82, 100.25, 101.1, 102.45, 108.55, 112.17, 113.0]}}, "SGLD": {"symbol": "8PSG.DE", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 355.22, "returns": {"1m": -3.34, "3m": 1.6, "ytd": -1.45, "1y": 11.42, "3y": 28.57, "5y": 19.34}, "sinceFirstPrice": null, "volatility": 20.8, "maxDrawdown": {"value": -22.6, "peak": "2026-03-02", "trough": "2026-07-17", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [332.9, 350.86, 395.1885, 332.7, 334.38, 339.56, 340.88, 349.32, 348.82, 351.12, 357.18, 364.82, 353.94, 372.74, 381.22, 407.76, 402.44, 401.98, 406.66, 414.16, 425.96, 421.0, 424.72, 381.9, 377.24, 389.22, 391.4, 397.0, 387.96, 379.28, 385.26, 376.18, 374.9, 377.18, 362.4, 350.86, 348.44, 344.56, 350.46, 345.32, 337.36, 344.2, 337.76, 362.12, 364.48, 379.58, 377.94, 367.48, 362.44, 365.44, 361.44, 354.14, 355.22]}}, "DBXP": {"symbol": "DBXP.DE", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 173.665, "returns": {"1m": -0.27, "3m": -0.5, "ytd": 0.01, "1y": 0.43, "3y": 2.5, "5y": 0.69}, "sinceFirstPrice": null, "volatility": 1.3, "maxDrawdown": {"value": -5.5, "peak": "2021-11-19", "trough": "2023-03-06", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [173.29, 173.515, 173.3009, 173.42, 173.485, 173.42, 173.51, 173.63, 173.48, 173.34, 173.43, 173.47, 173.655, 173.865, 173.965, 173.9, 174.2, 174.305, 174.485, 174.535, 174.69, 173.605, 173.3, 172.64, 172.62, 173.1, 173.255, 173.955, 173.56, 173.445, 173.715, 173.32, 173.735, 174.17, 173.645, 174.065, 174.09, 174.555, 174.565, 174.29, 173.97, 173.93, 174.055, 174.405, 174.295, 174.25, 174.155, 174.14, 173.535, 173.31, 173.28, 173.74, 173.665]}}, "WGLD": {"symbol": "WGLD.MI", "firstDate": "2020-11-30", "lastDate": "2026-10-05", "lastPrice": 367.41, "returns": {"1m": -3.15, "3m": 1.78, "ytd": -0.43, "1y": 11.64, "3y": 28.82, "5y": 19.36}, "sinceFirstPrice": null, "volatility": 17.2, "maxDrawdown": {"value": -22.8, "peak": "2026-03-02", "trough": "2026-07-16", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [343.39, 362.08, 355.06, 343.47, 343.9, 350.91, 351.68, 360.74, 360.2, 363.24, 368.7, 376.54, 365.17, 384.83, 393.42, 420.82, 416.9, 415.31, 420.85, 426.22, 440.05, 435.18, 437.75, 394.01, 390.36, 401.82, 404.27, 409.51, 400.61, 391.57, 397.34, 388.32, 386.77, 389.34, 374.08, 361.97, 359.46, 355.69, 361.74, 356.4, 348.3, 355.44, 348.65, 373.82, 375.9, 391.45, 390.7, 379.36, 373.93, 377.17, 372.8, 365.21, 367.41]}}, "BTC": {"symbol": "BTC-EUR", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 76262.6719, "returns": {"1m": 10.96, "3m": 36.35, "ytd": 2.25, "1y": -27.68, "3y": 43.15, "5y": 11.41}, "sinceFirstPrice": null, "volatility": 46.0, "maxDrawdown": {"value": -73.6, "peak": "2021-11-08", "trough": "2022-11-21", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [97430.8125, 91306.3438, 95511.4922, 94452.75, 89349.5234, 81205.8828, 73892.75, 78402.1406, 76757.3516, 76868.4141, 75221.6953, 74150.7812, 76704.8359, 77793.2031, 82333.1016, 75681.0781, 70972.2812, 59703.9688, 58012.3867, 57685.5977, 55746.0117, 58624.6367, 61894.5117, 60945.6172, 57473.6172, 58092.3789, 62213.1094, 65514.4258, 66072.7891, 66692.0078, 67995.3281, 68028.1172, 65028.4414, 62913.1992, 52870.5156, 54904.0547, 55361.2227, 52682.4219, 54664.3203, 56158.6406, 55856.5625, 56344.6133, 54447.8359, 56119.5469, 54442.4023, 67070.5859, 67184.8203, 68576.2812, 66508.375, 70419.5469, 73769.2188, 75058.625, 76262.6719]}}, "BRIJ": {"symbol": "B41J.DE", "firstDate": "2024-09-09", "lastDate": "2026-10-05", "lastPrice": 18.442, "returns": {"1m": -4.43, "3m": -11.08, "ytd": -1.7, "1y": -1.63, "3y": null, "5y": null}, "sinceFirstPrice": {"from": "2024-09-09", "total": 22.51, "annualised": 10.3}, "volatility": 14.9, "maxDrawdown": {"value": -13.2, "peak": "2026-02-27", "trough": "2026-10-01", "windowStart": "2024-09-09"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [18.828, 19.096, 19.286, 18.962, 18.402, 18.568, 18.418, 18.628, 18.544, 18.646, 18.716, 18.724, 18.99, 19.66, 19.562, 19.316, 19.464, 20.095, 20.3, 20.77, 21.08, 19.76, 19.84, 19.112, 19.154, 20.4, 20.95, 20.85, 20.27, 20.295, 20.235, 19.886, 20.24, 20.57, 20.275, 20.38, 20.6, 20.42, 20.875, 19.882, 19.858, 19.866, 20.195, 20.275, 20.16, 19.794, 19.684, 19.296, 19.016, 19.032, 18.99, 18.536, 18.442]}}, "EXH9": {"symbol": "EXH9.DE", "firstDate": "2016-10-05", "lastDate": "2026-10-05", "lastPrice": 55.36, "returns": {"1m": 0.67, "3m": -4.87, "ytd": 11.78, "1y": 22.07, "3y": 20.51, "5y": 11.94}, "sinceFirstPrice": null, "volatility": 15.4, "maxDrawdown": {"value": -22.7, "peak": "2022-05-23", "trough": "2022-10-12", "windowStart": "2021-10-05"}, "spark": {"from": "2025-10-10", "stepDays": 7, "values": [46.2731, 47.352, 47.529, 48.1237, 48.3399, 49.0969, 48.6447, 49.2689, 48.7282, 48.1974, 49.146, 49.1804, 50.419, 51.8444, 52.3004, 51.8864, 53.7197, 54.6463, 55.839, 55.5728, 58.1553, 55.4348, 57.4259, 54.4689, 54.2914, 58.1159, 58.6777, 56.3908, 57.4495, 58.4291, 56.4897, 54.5008, 56.6876, 55.5002, 56.2522, 56.9647, 56.4897, 57.8255, 59.0426, 57.9245, 58.85, 59.11, 57.3, 57.64, 56.41, 55.98, 56.35, 54.99, 55.06, 55.38, 54.97, 55.27, 55.36]}}}}
};
