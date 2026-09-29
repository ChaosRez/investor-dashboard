/**
 * ApexETF Grounded Data Store
 * Grounded in verified real-world metrics from justETF, extraETF, Curvo, Portfolio Visualizer,
 * Morningstar, Trackinsight, Yahoo Finance, and official issuer KIDs.
 * Last Synced: 2026-09-29T14:15:00.723770+00:00
 */

window.APEX_DATA_STORE = {
  syncMeta: {
    lastSyncedAt: "2026-09-29T14:15:00.723784+00:00",
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
    "aumMillionsEUR": 53167.0,
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
    "lastSyncedAt": "2026-09-29T14:14:51.186472+00:00",
    "liveMarketData": {
      "livePrice": 169.88,
      "currency": "EUR",
      "previousClose": 170.5,
      "dayChange": -0.62,
      "dayChangePercent": -0.36,
      "fiftyTwoWeekHigh": 170.92,
      "fiftyTwoWeekLow": 138.24,
      "regularMarketDayHigh": 170.1,
      "regularMarketDayLow": 169.36,
      "regularMarketVolume": 119618,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:18.139019+00:00"
    },
    "currentPriceEUR": 169.88,
    "dayChangePercent": -0.36,
    "fiftyTwoWeekHigh": 170.92,
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
    "aumMillionsEUR": 130706.0,
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
    "lastSyncedAt": "2026-09-29T14:14:51.673375+00:00",
    "liveMarketData": {
      "livePrice": 129.08,
      "currency": "EUR",
      "previousClose": 129.1,
      "dayChange": -0.02,
      "dayChangePercent": -0.02,
      "fiftyTwoWeekHigh": 129.83,
      "fiftyTwoWeekLow": 106.13,
      "regularMarketDayHigh": 129.27,
      "regularMarketDayLow": 128.71,
      "regularMarketVolume": 60039,
      "exchange": "Euronext Amsterdam",
      "lastPriceUpdated": "2026-09-29T13:29:18.787822+00:00"
    },
    "currentPriceEUR": 129.08,
    "dayChangePercent": -0.02,
    "fiftyTwoWeekHigh": 129.83,
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
    "aumMillionsEUR": 136853.0,
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
    "lastSyncedAt": "2026-09-29T14:14:52.080449+00:00",
    "liveMarketData": {
      "livePrice": 731.74,
      "currency": "EUR",
      "previousClose": 731.94,
      "dayChange": -0.2,
      "dayChangePercent": -0.03,
      "fiftyTwoWeekHigh": 735.02,
      "fiftyTwoWeekLow": 595.6,
      "regularMarketDayHigh": 732.3,
      "regularMarketDayLow": 729.28,
      "regularMarketVolume": 11288,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:19.501004+00:00"
    },
    "currentPriceEUR": 731.74,
    "dayChangePercent": -0.03,
    "fiftyTwoWeekHigh": 735.02,
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
    "aumMillionsEUR": 32157.0,
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
    "lastSyncedAt": "2026-09-29T14:14:52.613859+00:00",
    "liveMarketData": {
      "livePrice": 131.22,
      "currency": "EUR",
      "previousClose": 131.26,
      "dayChange": -0.04,
      "dayChangePercent": -0.03,
      "fiftyTwoWeekHigh": 131.81,
      "fiftyTwoWeekLow": 106.82,
      "regularMarketDayHigh": 131.305,
      "regularMarketDayLow": 130.775,
      "regularMarketVolume": 10253,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:20.049294+00:00"
    },
    "currentPriceEUR": 131.22,
    "dayChangePercent": -0.03,
    "fiftyTwoWeekHigh": 131.81,
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
    "aumMillionsEUR": 40069.0,
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
    "lastSyncedAt": "2026-09-29T14:14:53.073986+00:00",
    "liveMarketData": {
      "livePrice": 48.595,
      "currency": "EUR",
      "previousClose": 48.84,
      "dayChange": -0.245,
      "dayChangePercent": -0.5,
      "fiftyTwoWeekHigh": 51.03,
      "fiftyTwoWeekLow": 36.72,
      "regularMarketDayHigh": 48.65,
      "regularMarketDayLow": 48.335,
      "regularMarketVolume": 32552,
      "exchange": "Euronext Amsterdam",
      "lastPriceUpdated": "2026-09-29T13:29:20.699111+00:00"
    },
    "currentPriceEUR": 48.595,
    "dayChangePercent": -0.5,
    "fiftyTwoWeekHigh": 51.03,
    "fiftyTwoWeekLow": 36.72
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
    "aumMillionsEUR": 20925.0,
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
    "lastSyncedAt": "2026-09-29T14:14:53.576599+00:00",
    "liveMarketData": {
      "livePrice": 316.1,
      "currency": "EUR",
      "previousClose": 315.85,
      "dayChange": 0.25,
      "dayChangePercent": 0.08,
      "fiftyTwoWeekHigh": 326.7,
      "fiftyTwoWeekLow": 265.67,
      "regularMarketDayHigh": 317.2,
      "regularMarketDayLow": 315.8,
      "regularMarketVolume": 41008,
      "exchange": "Euronext Paris",
      "lastPriceUpdated": "2026-09-29T13:29:21.228257+00:00"
    },
    "currentPriceEUR": 316.1,
    "dayChangePercent": 0.08,
    "fiftyTwoWeekHigh": 326.7,
    "fiftyTwoWeekLow": 265.67
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
    "aumMillionsEUR": 18119.0,
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
    "lastSyncedAt": "2026-09-29T14:14:54.000449+00:00",
    "liveMarketData": {
      "livePrice": 47.29,
      "currency": "EUR",
      "previousClose": 46.9,
      "dayChange": 0.39,
      "dayChangePercent": 0.83,
      "fiftyTwoWeekHigh": 47.35,
      "fiftyTwoWeekLow": 31.88,
      "regularMarketDayHigh": 47.35,
      "regularMarketDayLow": 47.06,
      "regularMarketVolume": 56867,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:22.057776+00:00"
    },
    "currentPriceEUR": 47.29,
    "dayChangePercent": 0.83,
    "fiftyTwoWeekHigh": 47.35,
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
    "aumMillionsEUR": 2505.0,
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
    "lastSyncedAt": "2026-09-29T14:14:54.422276+00:00",
    "liveMarketData": {
      "livePrice": 5.723,
      "currency": "USD",
      "previousClose": 5.764,
      "dayChange": -0.041,
      "dayChangePercent": -0.71,
      "fiftyTwoWeekHigh": 6.15,
      "fiftyTwoWeekLow": 5.71,
      "regularMarketDayHigh": 5.728,
      "regularMarketDayLow": 5.71,
      "regularMarketVolume": 25612,
      "exchange": "London Stock Exchange",
      "lastPriceUpdated": "2026-09-29T13:29:22.733553+00:00"
    },
    "currentPriceEUR": 5.723,
    "dayChangePercent": -0.71,
    "fiftyTwoWeekHigh": 6.15,
    "fiftyTwoWeekLow": 5.71
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
    },
    "lastSyncedAt": "2026-09-29T14:14:55.074980+00:00",
    "liveMarketData": {
      "livePrice": 9.002,
      "currency": "EUR",
      "previousClose": 9.078,
      "dayChange": -0.076,
      "dayChangePercent": -0.84,
      "fiftyTwoWeekHigh": 9.36,
      "fiftyTwoWeekLow": 7.26,
      "regularMarketDayHigh": 9.014,
      "regularMarketDayLow": 8.964,
      "regularMarketVolume": 118318,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:23.532353+00:00"
    },
    "currentPriceEUR": 9.002,
    "dayChangePercent": -0.84,
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
    "aumMillionsEUR": 46776.0,
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
    },
    "lastSyncedAt": "2026-09-29T14:14:55.548004+00:00",
    "liveMarketData": {
      "livePrice": 128.491,
      "currency": "EUR",
      "previousClose": 128.373,
      "dayChange": 0.118,
      "dayChangePercent": 0.09,
      "fiftyTwoWeekHigh": 129.09,
      "fiftyTwoWeekLow": 105.03,
      "regularMarketDayHigh": 128.6,
      "regularMarketDayLow": 128.042,
      "regularMarketVolume": 25382,
      "exchange": "Euronext Amsterdam",
      "lastPriceUpdated": "2026-09-29T13:29:24.428494+00:00"
    },
    "currentPriceEUR": 128.491,
    "dayChangePercent": 0.09,
    "fiftyTwoWeekHigh": 129.09,
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
    "aumMillionsEUR": 658.0,
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
    "lastSyncedAt": "2026-09-29T14:14:55.943982+00:00",
    "liveMarketData": {
      "livePrice": 49.17,
      "currency": "USD",
      "previousClose": 49.49,
      "dayChange": -0.32,
      "dayChangePercent": -0.65,
      "fiftyTwoWeekHigh": 51.34,
      "fiftyTwoWeekLow": 42.78,
      "regularMarketDayHigh": 49.21,
      "regularMarketDayLow": 49.0,
      "regularMarketVolume": 13726,
      "exchange": "London Stock Exchange",
      "lastPriceUpdated": "2026-09-29T13:29:25.110397+00:00"
    },
    "currentPriceEUR": 49.17,
    "dayChangePercent": -0.65,
    "fiftyTwoWeekHigh": 51.34,
    "fiftyTwoWeekLow": 42.78
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
    "aumMillionsEUR": 4111.0,
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
    "lastSyncedAt": "2026-09-29T14:14:56.333052+00:00",
    "liveMarketData": {
      "livePrice": 8.361,
      "currency": "EUR",
      "previousClose": 8.385,
      "dayChange": -0.024,
      "dayChangePercent": -0.29,
      "fiftyTwoWeekHigh": 8.41,
      "fiftyTwoWeekLow": 6.8,
      "regularMarketDayHigh": 8.372,
      "regularMarketDayLow": 8.339,
      "regularMarketVolume": 51831,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:25.721115+00:00"
    },
    "currentPriceEUR": 8.361,
    "dayChangePercent": -0.29,
    "fiftyTwoWeekHigh": 8.41,
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
    "aumMillionsEUR": 660.0,
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
      "livePrice": 25.85,
      "currency": "EUR",
      "previousClose": 26.755,
      "dayChange": -0.905,
      "dayChangePercent": -3.38,
      "fiftyTwoWeekHigh": 35.52,
      "fiftyTwoWeekLow": 20.61,
      "regularMarketDayHigh": 25.92,
      "regularMarketDayLow": 25.685,
      "regularMarketVolume": 4565,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:26.347088+00:00"
    },
    "currentPriceEUR": 25.85,
    "dayChangePercent": -3.38,
    "fiftyTwoWeekHigh": 35.52,
    "fiftyTwoWeekLow": 20.61,
    "lastSyncedAt": "2026-09-29T14:14:56.923397+00:00"
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
    "aumMillionsEUR": 762.0,
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
      "livePrice": 52.06,
      "currency": "USD",
      "previousClose": 54.72,
      "dayChange": -2.66,
      "dayChangePercent": -4.86,
      "fiftyTwoWeekHigh": 70.6,
      "fiftyTwoWeekLow": 42.09,
      "regularMarketDayHigh": 52.38,
      "regularMarketDayLow": 51.78,
      "regularMarketVolume": 1085,
      "exchange": "London Stock Exchange",
      "lastPriceUpdated": "2026-09-29T13:29:27.060816+00:00"
    },
    "currentPriceEUR": 52.06,
    "dayChangePercent": -4.86,
    "fiftyTwoWeekHigh": 70.6,
    "fiftyTwoWeekLow": 42.09,
    "lastSyncedAt": "2026-09-29T14:14:57.444236+00:00"
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
    "aumMillionsEUR": 32474.0,
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
      "livePrice": 108.78,
      "currency": "EUR",
      "previousClose": 109.18,
      "dayChange": -0.4,
      "dayChangePercent": -0.37,
      "fiftyTwoWeekHigh": 109.5,
      "fiftyTwoWeekLow": 88.46,
      "regularMarketDayHigh": 108.96,
      "regularMarketDayLow": 108.48,
      "regularMarketVolume": 46741,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:27.671814+00:00"
    },
    "currentPriceEUR": 108.78,
    "dayChangePercent": -0.37,
    "fiftyTwoWeekHigh": 109.5,
    "fiftyTwoWeekLow": 88.46,
    "lastSyncedAt": "2026-09-29T14:14:57.883950+00:00"
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
    "aumMillionsEUR": 15830.0,
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
      "livePrice": 104.24,
      "currency": "EUR",
      "previousClose": 104.0,
      "dayChange": 0.24,
      "dayChangePercent": 0.23,
      "fiftyTwoWeekHigh": 107.56,
      "fiftyTwoWeekLow": 87.61,
      "regularMarketDayHigh": 104.545,
      "regularMarketDayLow": 104.04,
      "regularMarketVolume": 100861,
      "exchange": "Euronext Amsterdam",
      "lastPriceUpdated": "2026-09-29T13:29:28.321424+00:00"
    },
    "currentPriceEUR": 104.24,
    "dayChangePercent": 0.23,
    "fiftyTwoWeekHigh": 107.56,
    "fiftyTwoWeekLow": 87.61,
    "lastSyncedAt": "2026-09-29T14:14:58.377468+00:00"
  },
  {
    "ticker": "XCS6",
    "secondaryTickers": [
      "RQFI",
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
    "aumMillionsEUR": 1758.0,
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
      "livePrice": 11.08,
      "currency": "EUR",
      "previousClose": 11.572,
      "dayChange": -0.492,
      "dayChangePercent": -4.25,
      "fiftyTwoWeekHigh": 12.71,
      "fiftyTwoWeekLow": 10.47,
      "regularMarketDayHigh": 11.138,
      "regularMarketDayLow": 11.06,
      "regularMarketVolume": 1771,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:29.026300+00:00"
    },
    "currentPriceEUR": 11.08,
    "dayChangePercent": -4.25,
    "fiftyTwoWeekHigh": 12.71,
    "fiftyTwoWeekLow": 10.47,
    "lastSyncedAt": "2026-09-29T14:14:58.892245+00:00"
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
    "aumMillionsEUR": 22939.0,
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
      "livePrice": 150.355,
      "currency": "EUR",
      "previousClose": 150.252,
      "dayChange": 0.103,
      "dayChangePercent": 0.07,
      "fiftyTwoWeekHigh": 150.36,
      "fiftyTwoWeekLow": 147.29,
      "regularMarketDayHigh": 150.358,
      "regularMarketDayLow": 150.33,
      "regularMarketVolume": 131927,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:29.694170+00:00"
    },
    "currentPriceEUR": 150.355,
    "dayChangePercent": 0.07,
    "fiftyTwoWeekHigh": 150.36,
    "fiftyTwoWeekLow": 147.29,
    "lastSyncedAt": "2026-09-29T14:14:59.396268+00:00"
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
    "aumMillionsEUR": 9930.0,
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
      "livePrice": 80.52,
      "currency": "EUR",
      "previousClose": 80.96,
      "dayChange": -0.44,
      "dayChangePercent": -0.54,
      "fiftyTwoWeekHigh": 82.28,
      "fiftyTwoWeekLow": 66.0,
      "regularMarketDayHigh": 80.66,
      "regularMarketDayLow": 80.42,
      "regularMarketVolume": 45788,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:30.385528+00:00"
    },
    "currentPriceEUR": 80.52,
    "dayChangePercent": -0.54,
    "fiftyTwoWeekHigh": 82.28,
    "fiftyTwoWeekLow": 66.0,
    "lastSyncedAt": "2026-09-29T14:14:59.786916+00:00"
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
    "benchmarkIndex": "Morningstar Global AI Infrastructure Index",
    "assetClass": "Thematic Equities (AI Data Centers & Infrastructure)",
    "distributionPolicy": "Accumulating",
    "isAccumulating": true,
    "ter": 0.35,
    "trackingDifference5Y": 0.08,
    "trackingDifference1Y": 0.05,
    "aumMillionsEUR": 1253.0,
    "domicile": "Ireland",
    "replication": "Physical (Full replication)",
    "securitiesLending": false,
    "securitiesLendingRevenueShare": "No lending",
    "sriRisk": 5,
    "holdingCount": 55,
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
      "period": "2023 - 2026 (AI Infrastructure Index Track)",
      "cagr": 24.5,
      "sharpe": 1.15,
      "stdev": 22.8,
      "maxDrawdown": -21.4,
      "recoveryPeriod": "8 months",
      "bestYear": 48.5,
      "worstYear": -12.5,
      "curvoUrl": "https://curvo.eu/backtest/en/fund/ishares-ai-infrastructure-ucits-etf-usd-acc/IE000X59ZHE2"
    },
    "quantitativeStatsPV": {
      "sortino": 1.58,
      "calmar": 1.14,
      "var95": -9.8,
      "marketBeta": 1.38,
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
      "livePrice": 10.332,
      "currency": "EUR",
      "previousClose": 10.292,
      "dayChange": 0.04,
      "dayChangePercent": 0.39,
      "fiftyTwoWeekHigh": 10.44,
      "fiftyTwoWeekLow": 5.61,
      "regularMarketDayHigh": 10.346,
      "regularMarketDayLow": 10.248,
      "regularMarketVolume": 17298,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:31.090594+00:00"
    },
    "currentPriceEUR": 10.332,
    "dayChangePercent": 0.39,
    "fiftyTwoWeekHigh": 10.44,
    "fiftyTwoWeekLow": 5.61,
    "lastSyncedAt": "2026-09-29T14:15:00.192394+00:00"
  },
  {
    "ticker": "WTAI",
    "secondaryTickers": [
      "2B76"
    ],
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
    "aumMillionsEUR": 1344.0,
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
      "livePrice": 19.29,
      "currency": "EUR",
      "previousClose": 19.172,
      "dayChange": 0.118,
      "dayChangePercent": 0.62,
      "fiftyTwoWeekHigh": 19.42,
      "fiftyTwoWeekLow": 12.83,
      "regularMarketDayHigh": 19.324,
      "regularMarketDayLow": 19.162,
      "regularMarketVolume": 51042,
      "exchange": "XETRA (Frankfurt)",
      "lastPriceUpdated": "2026-09-29T13:29:31.718803+00:00"
    },
    "currentPriceEUR": 19.29,
    "dayChangePercent": 0.62,
    "fiftyTwoWeekHigh": 19.42,
    "fiftyTwoWeekLow": 12.83,
    "lastSyncedAt": "2026-09-29T14:15:00.702558+00:00"
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
}
};
