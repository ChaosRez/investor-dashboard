#!/usr/bin/env python3
"""
Adds the user's 9 missing watchlist ETFs into the primary ETF dataset,
assigns isUserWatchlist flag, updates dynamic_sync.py mapping, and rebuilds JSON and JS stores.
"""

import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "public", "data")

NEW_WATCHLIST_ETFS = [
    {
        "ticker": "BATT",
        "secondaryTickers": ["BATE", "LGEN"],
        "isin": "IE00BF0M2Z96",
        "wkn": "A2H5GK",
        "name": "L&G Battery Value-Chain UCITS ETF",
        "issuer": "Legal & General",
        "benchmarkIndex": "Solactive Battery Value-Chain Index (Net Return)",
        "assetClass": "Thematic Equities (Clean Energy & Battery Storage)",
        "distributionPolicy": "Accumulating",
        "isAccumulating": True,
        "ter": 0.49,
        "trackingDifference5Y": 0.12,
        "trackingDifference1Y": 0.08,
        "aumMillionsEUR": 660,
        "domicile": "Ireland",
        "replication": "Physical (Full replication)",
        "securitiesLending": False,
        "securitiesLendingRevenueShare": "No lending",
        "sriRisk": 5,
        "holdingCount": 35,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "Panasonic Holdings Corp.", "symbol": "6752.T", "weight": 3.60},
            {"name": "Siemens AG", "symbol": "SIE.DE", "weight": 3.12},
            {"name": "Hitachi Ltd.", "symbol": "6501.T", "weight": 3.10},
            {"name": "Bayerische Motoren Werke (BMW)", "symbol": "BMW.DE", "weight": 2.95},
            {"name": "Tesla Inc.", "symbol": "TSLA", "weight": 2.80},
            {"name": "Albemarle Corp.", "symbol": "ALB", "weight": 2.75},
            {"name": "Samsung SDI Co.", "symbol": "006400.KS", "weight": 2.70},
            {"name": "LG Energy Solution", "symbol": "373220.KS", "weight": 2.60},
            {"name": "BYD Co. Ltd.", "symbol": "1211.HK", "weight": 2.50},
            {"name": "Pilbara Minerals Ltd.", "symbol": "PLS.AX", "weight": 2.40}
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
            "cagr": 11.20,
            "sharpe": 0.52,
            "stdev": 24.50,
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
            "pbRatio": 2.10,
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
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": True, "fee": "€1.00 Handling", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
        }
    },
    {
        "ticker": "RARE",
        "secondaryTickers": ["WRAE"],
        "isin": "IE000KHX9DX6",
        "wkn": "A3D66Z",
        "name": "WisdomTree Strategic Metals and Rare Earths Miners UCITS ETF USD Acc",
        "issuer": "WisdomTree",
        "benchmarkIndex": "WisdomTree Strategic Metals and Rare Earths Miners Index",
        "assetClass": "Thematic Equities (Critical Raw Materials & Rare Earths)",
        "distributionPolicy": "Accumulating",
        "isAccumulating": True,
        "ter": 0.50,
        "trackingDifference5Y": 0.15,
        "trackingDifference1Y": 0.10,
        "aumMillionsEUR": 762,
        "domicile": "Ireland",
        "replication": "Physical (Full replication)",
        "securitiesLending": False,
        "securitiesLendingRevenueShare": "No lending",
        "sriRisk": 5,
        "holdingCount": 42,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "Lynas Rare Earths Ltd.", "symbol": "LYC.AX", "weight": 3.54},
            {"name": "Anglo American Plc", "symbol": "AAL.L", "weight": 3.47},
            {"name": "PT Merdeka Copper Gold Tbk", "symbol": "MDKA.JK", "weight": 3.24},
            {"name": "Freeport-McMoRan Inc.", "symbol": "FCX", "weight": 3.10},
            {"name": "MP Materials Corp.", "symbol": "MP", "weight": 3.05},
            {"name": "Iluka Resources Ltd.", "symbol": "ILU.AX", "weight": 2.90},
            {"name": "Pilbara Minerals", "symbol": "PLS.AX", "weight": 2.80},
            {"name": "Albemarle Corp.", "symbol": "ALB", "weight": 2.70},
            {"name": "Sociedad Quimica y Minera (SQM)", "symbol": "SQM", "weight": 2.60},
            {"name": "Tianqi Lithium Corp.", "symbol": "002466.SZ", "weight": 2.50}
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
            "cagr": 8.40,
            "sharpe": 0.42,
            "stdev": 26.80,
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
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": False, "fee": "€1.00 Handling", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
        }
    },
    {
        "ticker": "IUSQ",
        "secondaryTickers": ["ISAC", "SSAC"],
        "isin": "IE00B6R52259",
        "wkn": "A111X9",
        "name": "iShares MSCI ACWI UCITS ETF USD (Acc)",
        "issuer": "iShares",
        "benchmarkIndex": "MSCI All Country World Index (ACWI) Net USD",
        "assetClass": "Global Equities (Developed + Emerging Markets)",
        "distributionPolicy": "Accumulating",
        "isAccumulating": True,
        "ter": 0.20,
        "trackingDifference5Y": -0.04,
        "trackingDifference1Y": -0.02,
        "aumMillionsEUR": 32474,
        "domicile": "Ireland",
        "replication": "Physical (Optimised sampling)",
        "securitiesLending": True,
        "securitiesLendingRevenueShare": "62.5% net revenue to fund",
        "sriRisk": 4,
        "holdingCount": 2350,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "NVIDIA Corp.", "symbol": "NVDA", "weight": 4.88},
            {"name": "Apple Inc.", "symbol": "AAPL", "weight": 4.46},
            {"name": "Microsoft Corp.", "symbol": "MSFT", "weight": 3.42},
            {"name": "Amazon.com Inc.", "symbol": "AMZN", "weight": 2.25},
            {"name": "Meta Platforms Inc.", "symbol": "META", "weight": 1.65},
            {"name": "Alphabet Inc. (Class A)", "symbol": "GOOGL", "weight": 1.38},
            {"name": "Alphabet Inc. (Class C)", "symbol": "GOOG", "weight": 1.18},
            {"name": "Taiwan Semiconductor (TSMC)", "symbol": "TSM", "weight": 1.05},
            {"name": "Eli Lilly & Co.", "symbol": "LLY", "weight": 0.95},
            {"name": "Broadcom Inc.", "symbol": "AVGO", "weight": 0.92}
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
            "calmar": 0.30,
            "var95": -6.8,
            "marketBeta": 1.00,
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
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0 (Prime ETF)", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": True, "fee": "€1.00 Handling (Core Selection)", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
        }
    },
    {
        "ticker": "IMAE",
        "secondaryTickers": ["SMEA", "CEU2"],
        "isin": "IE00B4K48X80",
        "wkn": "A0RPWH",
        "name": "iShares Core MSCI Europe UCITS ETF EUR (Acc)",
        "issuer": "iShares",
        "benchmarkIndex": "MSCI Europe Index (Net Return EUR)",
        "assetClass": "European Equities (15 Developed European Countries)",
        "distributionPolicy": "Accumulating",
        "isAccumulating": True,
        "ter": 0.12,
        "trackingDifference5Y": -0.06,
        "trackingDifference1Y": -0.03,
        "aumMillionsEUR": 15830,
        "domicile": "Ireland",
        "replication": "Physical (Full replication)",
        "securitiesLending": True,
        "securitiesLendingRevenueShare": "62.5% net revenue to fund",
        "sriRisk": 4,
        "holdingCount": 420,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "ASML Holding NV", "symbol": "ASML.AS", "weight": 4.55},
            {"name": "Novo Nordisk A/S (Class B)", "symbol": "NOVO-B.CO", "weight": 3.80},
            {"name": "Nestlé S.A.", "symbol": "NESN.SW", "weight": 2.80},
            {"name": "HSBC Holdings Plc", "symbol": "HSBA.L", "weight": 2.47},
            {"name": "AstraZeneca PLC", "symbol": "AZN.L", "weight": 2.20},
            {"name": "Roche Holding AG", "symbol": "ROG.SW", "weight": 2.13},
            {"name": "SAP SE", "symbol": "SAP.DE", "weight": 2.10},
            {"name": "Novartis AG", "symbol": "NOVN.SW", "weight": 2.00},
            {"name": "Shell PLC", "symbol": "SHEL.L", "weight": 1.80},
            {"name": "LVMH Moët Hennessy", "symbol": "MC.PA", "weight": 1.70}
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
            "sharpe": 0.60,
            "stdev": 14.50,
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
            "yieldEquivalent": 3.10,
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
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": True, "fee": "€1.00 Handling", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
        }
    },
    {
        "ticker": "XCS6",
        "secondaryTickers": ["RQFI", "XCHA"],
        "isin": "LU0779800910",
        "wkn": "DBX0M2",
        "name": "Xtrackers CSI 300 Swap UCITS ETF 1C",
        "issuer": "Xtrackers",
        "benchmarkIndex": "CSI 300 Index (China A-Shares)",
        "assetClass": "Emerging Market Equities (Mainland China A-Shares)",
        "distributionPolicy": "Accumulating",
        "isAccumulating": True,
        "ter": 0.50,
        "trackingDifference5Y": -0.15,
        "trackingDifference1Y": -0.08,
        "aumMillionsEUR": 1758,
        "domicile": "Luxembourg",
        "replication": "Synthetic (Unfunded swap)",
        "securitiesLending": False,
        "securitiesLendingRevenueShare": "No lending",
        "sriRisk": 5,
        "holdingCount": 300,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "Contemporary Amperex Technology (CATL)", "symbol": "300750.SZ", "weight": 4.01},
            {"name": "Zhongji Innolight Co.", "symbol": "300308.SZ", "weight": 3.86},
            {"name": "Kweichow Moutai Co. Ltd.", "symbol": "600519.SS", "weight": 3.24},
            {"name": "Ping An Insurance (Group)", "symbol": "601318.SS", "weight": 2.95},
            {"name": "China Merchants Bank", "symbol": "600036.SS", "weight": 2.70},
            {"name": "Midea Group Co. Ltd.", "symbol": "000333.SZ", "weight": 2.50},
            {"name": "BYD Co. Ltd. (A-Share)", "symbol": "002594.SZ", "weight": 2.40},
            {"name": "China Yangtze Power Co.", "symbol": "600900.SS", "weight": 2.30},
            {"name": "Wuliangye Yibin Co. Ltd.", "symbol": "000858.SZ", "weight": 2.10},
            {"name": "Zijin Mining Group Co.", "symbol": "601899.SS", "weight": 1.90}
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
            "cagr": 6.80,
            "sharpe": 0.38,
            "stdev": 22.40,
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
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0 (Prime ETF)", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": False, "fee": "€1.00 Handling", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
        }
    },
    {
        "ticker": "XEON",
        "secondaryTickers": ["DBX0AN"],
        "isin": "LU0290358497",
        "wkn": "DBX0AN",
        "name": "Xtrackers II EUR Overnight Rate Swap UCITS ETF 1C",
        "issuer": "Xtrackers",
        "benchmarkIndex": "Deutsche Bundesbank Euro Short-Term Rate (€STR)",
        "assetClass": "Money Market / Euro Overnight Cash Yield",
        "distributionPolicy": "Accumulating",
        "isAccumulating": True,
        "ter": 0.10,
        "trackingDifference5Y": -0.02,
        "trackingDifference1Y": -0.01,
        "aumMillionsEUR": 22939,
        "domicile": "Luxembourg",
        "replication": "Synthetic (Unfunded swap backed by European sovereign collateral)",
        "securitiesLending": False,
        "securitiesLendingRevenueShare": "No lending",
        "sriRisk": 1,
        "holdingCount": 1,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "€STR Overnight Swap Collateral (European Sovereign Debt Basket)", "symbol": "ESTR.CASH", "weight": 100.0}
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
            "reinvestmentEfficiency": "Accumulating share class auto-compounds daily ECB €STR interest",
            "usEstateTax": "Shielded"
        },
        "brokerAvailability": {
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0 (Prime ETF)", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": True, "fee": "€1.00 Handling", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
            "bogleheadsRating": "Ultimate Retail Cash Anchor (Earns ECB €STR with Zero Bank Default Risk)"
        }
    },
    {
        "ticker": "VHYL",
        "secondaryTickers": ["VGWD", "VHYD"],
        "isin": "IE00B8GKDB10",
        "wkn": "A1T8FV",
        "name": "Vanguard FTSE All-World High Dividend Yield UCITS ETF Distributing",
        "issuer": "Vanguard",
        "benchmarkIndex": "FTSE All-World High Dividend Yield Index (Net Tax)",
        "assetClass": "Global Equities (High Dividend Factor)",
        "distributionPolicy": "Distributing",
        "isAccumulating": False,
        "ter": 0.29,
        "trackingDifference5Y": 0.05,
        "trackingDifference1Y": 0.02,
        "aumMillionsEUR": 9930,
        "domicile": "Ireland",
        "replication": "Physical (Optimised sampling)",
        "securitiesLending": True,
        "securitiesLendingRevenueShare": "100% net revenue to fund",
        "sriRisk": 4,
        "holdingCount": 1820,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "JPMorgan Chase & Co.", "symbol": "JPM", "weight": 2.13},
            {"name": "ExxonMobil Corp.", "symbol": "XOM", "weight": 1.50},
            {"name": "Johnson & Johnson", "symbol": "JNJ", "weight": 1.44},
            {"name": "Procter & Gamble Co.", "symbol": "PG", "weight": 1.35},
            {"name": "Home Depot Inc.", "symbol": "HD", "weight": 1.28},
            {"name": "AbbVie Inc.", "symbol": "ABBV", "weight": 1.22},
            {"name": "Chevron Corp.", "symbol": "CVX", "weight": 1.18},
            {"name": "Nestlé S.A.", "symbol": "NESN.SW", "weight": 1.12},
            {"name": "Bank of America Corp.", "symbol": "BAC", "weight": 1.08},
            {"name": "Broadcom Inc.", "symbol": "AVGO", "weight": 1.05}
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
            "stdev": 13.90,
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
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": True, "fee": "€1.00 Handling (Core Selection)", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
        }
    },
    {
        "ticker": "AII",
        "secondaryTickers": ["AIFS"],
        "isin": "IE000X59ZHE2",
        "wkn": "A40H8L",
        "name": "iShares AI Infrastructure UCITS ETF USD (Acc)",
        "issuer": "iShares",
        "benchmarkIndex": "Morningstar Global AI Infrastructure Index",
        "assetClass": "Thematic Equities (AI Data Centers & Infrastructure)",
        "distributionPolicy": "Accumulating",
        "isAccumulating": True,
        "ter": 0.35,
        "trackingDifference5Y": 0.08,
        "trackingDifference1Y": 0.05,
        "aumMillionsEUR": 1253,
        "domicile": "Ireland",
        "replication": "Physical (Full replication)",
        "securitiesLending": False,
        "securitiesLendingRevenueShare": "No lending",
        "sriRisk": 5,
        "holdingCount": 55,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "Palantir Technologies, Inc.", "symbol": "PLTR", "weight": 5.57},
            {"name": "Palo Alto Networks, Inc.", "symbol": "PANW", "weight": 5.12},
            {"name": "Microsoft Corp.", "symbol": "MSFT", "weight": 5.09},
            {"name": "Broadcom Inc.", "symbol": "AVGO", "weight": 4.85},
            {"name": "NVIDIA Corp.", "symbol": "NVDA", "weight": 4.72},
            {"name": "Arista Networks Inc.", "symbol": "ANET", "weight": 4.45},
            {"name": "Super Micro Computer Inc.", "symbol": "SMCI", "weight": 3.90},
            {"name": "Vertiv Holdings Co.", "symbol": "VRT", "weight": 3.80},
            {"name": "Cisco Systems Inc.", "symbol": "CSCO", "weight": 3.60},
            {"name": "Taiwan Semiconductor (TSMC)", "symbol": "TSM", "weight": 3.50}
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
            "cagr": 24.50,
            "sharpe": 1.15,
            "stdev": 22.80,
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
            "pbRatio": 6.80,
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
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": False, "fee": "€1.00 Handling", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
        }
    },
    {
        "ticker": "WTAI",
        "secondaryTickers": ["2B76"],
        "isin": "IE00BDVPNG13",
        "wkn": "A2N6WP",
        "name": "WisdomTree Artificial Intelligence UCITS ETF USD Acc",
        "issuer": "WisdomTree",
        "benchmarkIndex": "NASDAQ CTA Artificial Intelligence Index (Net Return)",
        "assetClass": "Thematic Equities (AI Enablers, Engagers & Enhancers)",
        "distributionPolicy": "Accumulating",
        "isAccumulating": True,
        "ter": 0.40,
        "trackingDifference5Y": 0.06,
        "trackingDifference1Y": 0.04,
        "aumMillionsEUR": 1344,
        "domicile": "Ireland",
        "replication": "Physical (Full replication)",
        "securitiesLending": False,
        "securitiesLendingRevenueShare": "No lending",
        "sriRisk": 5,
        "holdingCount": 68,
        "isUserWatchlist": True,
        "topHoldings": [
            {"name": "Advanced Micro Devices (AMD)", "symbol": "AMD", "weight": 4.78},
            {"name": "Marvell Technology Inc.", "symbol": "MRVL", "weight": 4.70},
            {"name": "Micron Technology Inc.", "symbol": "MU", "weight": 3.62},
            {"name": "Infineon Technologies AG", "symbol": "IFX.DE", "weight": 3.40},
            {"name": "Qualcomm Inc.", "symbol": "QCOM", "weight": 3.20},
            {"name": "Cadence Design Systems", "symbol": "CDNS", "weight": 3.10},
            {"name": "Synopsys Inc.", "symbol": "SNPS", "weight": 3.00},
            {"name": "Alphabet Inc. (Class A)", "symbol": "GOOGL", "weight": 2.90},
            {"name": "NVIDIA Corp.", "symbol": "NVDA", "weight": 2.80},
            {"name": "Meta Platforms Inc.", "symbol": "META", "weight": 2.70}
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
            "cagr": 18.20,
            "sharpe": 0.82,
            "stdev": 22.40,
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
            "Trade Republic": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Scalable Capital": {"sparplan": True, "fee": "€0", "status": "Available"},
            "Interactive Brokers": {"sparplan": True, "fee": "€1.25", "status": "Available"},
            "DEGIRO": {"sparplan": False, "fee": "€1.00 Handling", "status": "Available"},
            "flatex": {"sparplan": True, "fee": "€0", "status": "Available"},
            "ING": {"sparplan": True, "fee": "€0", "status": "Available"}
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
        }
    }
]

def merge_etfs():
    etfs_path = os.path.join(DATA_DIR, "etfs.json")
    with open(etfs_path, "r", encoding="utf-8") as f:
        etfs = json.load(f)

    # Flag SXR8 as isUserWatchlist
    for e in etfs:
        if e.get("ticker") == "SXR8":
            e["isUserWatchlist"] = True

    existing_isins = {e.get("isin") for e in etfs}
    added = 0

    for new_etf in NEW_WATCHLIST_ETFS:
        if new_etf["isin"] not in existing_isins:
            etfs.append(new_etf)
            existing_isins.add(new_etf["isin"])
            added += 1

    with open(etfs_path, "w", encoding="utf-8") as f:
        json.dump(etfs, f, indent=2)

    print(f"Added {added} new watchlist ETFs. Total funds in etfs.json: {len(etfs)}")

if __name__ == "__main__":
    merge_etfs()
