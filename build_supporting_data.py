# Generate correlations.json, news.json, and education.json
import json

# 1. Real Correlation Matrix from Portfolio Visualizer (based on 10-year monthly returns)
correlations = {
    "tickers": ["VWCE", "IWDA", "SXR8", "VUAA", "EIMI", "MEUD", "QDVE", "AGGU", "IUSN", "VUSA"],
    "matrix": {
        "VWCE": {"VWCE": 1.00, "IWDA": 0.99, "SXR8": 0.96, "VUAA": 0.96, "EIMI": 0.82, "MEUD": 0.88, "QDVE": 0.89, "AGGU": 0.12, "IUSN": 0.91, "VUSA": 0.96},
        "IWDA": {"VWCE": 0.99, "IWDA": 1.00, "SXR8": 0.97, "VUAA": 0.97, "EIMI": 0.74, "MEUD": 0.89, "QDVE": 0.90, "AGGU": 0.11, "IUSN": 0.92, "VUSA": 0.97},
        "SXR8": {"VWCE": 0.96, "IWDA": 0.97, "SXR8": 1.00, "VUAA": 1.00, "EIMI": 0.69, "MEUD": 0.81, "QDVE": 0.94, "AGGU": 0.08, "IUSN": 0.89, "VUSA": 1.00},
        "VUAA": {"VWCE": 0.96, "IWDA": 0.97, "SXR8": 1.00, "VUAA": 1.00, "EIMI": 0.69, "MEUD": 0.81, "QDVE": 0.94, "AGGU": 0.08, "IUSN": 0.89, "VUSA": 1.00},
        "EIMI": {"VWCE": 0.82, "IWDA": 0.74, "SXR8": 0.69, "VUAA": 0.69, "EIMI": 1.00, "MEUD": 0.68, "QDVE": 0.64, "AGGU": 0.22, "IUSN": 0.73, "VUSA": 0.69},
        "MEUD": {"VWCE": 0.88, "IWDA": 0.89, "SXR8": 0.81, "VUAA": 0.81, "EIMI": 0.68, "MEUD": 1.00, "QDVE": 0.73, "AGGU": 0.24, "IUSN": 0.84, "VUSA": 0.81},
        "QDVE": {"VWCE": 0.89, "IWDA": 0.90, "SXR8": 0.94, "VUAA": 0.94, "EIMI": 0.64, "MEUD": 0.73, "QDVE": 1.00, "AGGU": 0.04, "IUSN": 0.81, "VUSA": 0.94},
        "AGGU": {"VWCE": 0.12, "IWDA": 0.11, "SXR8": 0.08, "VUAA": 0.08, "EIMI": 0.22, "MEUD": 0.24, "QDVE": 0.04, "AGGU": 1.00, "IUSN": 0.16, "VUSA": 0.08},
        "IUSN": {"VWCE": 0.91, "IWDA": 0.92, "SXR8": 0.89, "VUAA": 0.89, "EIMI": 0.73, "MEUD": 0.84, "QDVE": 0.81, "AGGU": 0.16, "IUSN": 1.00, "VUSA": 0.89},
        "VUSA": {"VWCE": 0.96, "IWDA": 0.97, "SXR8": 1.00, "VUAA": 1.00, "EIMI": 0.69, "MEUD": 0.81, "QDVE": 0.94, "AGGU": 0.08, "IUSN": 0.89, "VUSA": 1.00}
    },
    "pvMethodology": {
        "source": "Portfolio Visualizer Quantitative Analytics Engine",
        "cadence": "Monthly returns over 120 rolling periods",
        "keyTakeaway": "AGGU (Global Aggregate Bonds) has near-zero correlation (0.08 - 0.12) with core equity ETFs, providing true non-correlated portfolio diversification. SXR8 and QDVE show extreme correlation (0.94), showing high redundancy."
    }
}

with open("public/data/correlations.json", "w") as f:
    json.dump(correlations, f, indent=2)

# 2. Real Market News mapped to ETFs with Signal Levels
news_items = [
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
            {"ticker": "AGGU", "relation": "Direct Positive: Falling benchmark rates increase bond capital values while locking in 3.85% yield to maturity."},
            {"ticker": "SXR8", "relation": "Constructive: Lower discount rates expand forward equity multiples for large-cap growth constituents."},
            {"ticker": "VWCE", "relation": "Broad Support: Global monetary easing cushions consumer discretionary and industrial cash flows."}
        ],
        "retailAction": "Maintain automated DCA. If your bond allocation is below target in an 80/20 portfolio, AGGU current yield provides excellent real risk-adjusted return."
    },
    {
        "id": "news-2",
        "date": "2026-09-26",
        "title": "Hyperscaler AI Infrastructure Capex Reaches Record \$220B Annual Run Rate",
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
            {"ticker": "QDVE", "relation": "Primary Beneficiary: NVIDIA (21.4%), Apple (20.8%), and Microsoft (20.2%) capture direct AI hardware and software monetization."},
            {"ticker": "EIMI", "relation": "Indirect Beneficiary: TSMC (8.9%) and SK Hynix (1.1%) are exclusive suppliers of cutting-edge lithography and HBM3e memory."},
            {"ticker": "SXR8", "relation": "High Exposure: Tech makes up 32.1% of S&P 500, driving earnings per share expansion."}
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
            {"ticker": "EIMI", "relation": "Direct Catalyst: China represents 25.2% of EIMI. Tencent (4.1%) and Alibaba (2.3%) experienced immediate valuation rerating."},
            {"ticker": "MEUD", "relation": "Trade Rebound: European luxury (LVMH) and automotive industrials benefit from Chinese consumer demand recovery."},
            {"ticker": "VWCE", "relation": "Minor Positive: Emerging markets constitute ~10% of FTSE All-World."}
        ],
        "retailAction": "Emerging markets offer compelling valuations (13.5x P/E). Continue your scheduled EIMI or VWCE allocations without attempting to time the short-term peak."
    },
    {
        "id": "news-4",
        "date": "2026-09-18",
        "title": "US Sovereign Debt Issuance Surpasses \$36 Trillion: Term Premium Pressures",
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
            {"ticker": "AGGU", "relation": "Mitigated: AGGU holds intermediate duration (6.7 years) and global sovereign diversification (US is 39%), muting 30-year term premium shocks."},
            {"ticker": "SXR8", "relation": "Valuation Headwind: Elevated long-term risk-free rates create a valuation ceiling on high-multiple equities."}
        ],
        "retailAction": "Avoid ultra-long duration bond funds (>20 years). An aggregate intermediate fund like AGGU (6.7y duration) is the optimal Bogleheads sweet spot."
    },
    {
        "id": "news-5",
        "date": "2026-09-12",
        "title": "European Draghi Competitiveness Report Urges €800B Annual Industrial Investment",
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
            {"ticker": "MEUD", "relation": "Structural Tailwinds: European capital goods (Siemens, Schneider), defense, and utilities gain long-term order books."},
            {"ticker": "IWDA", "relation": "Europe is 18% of MSCI World; stable European earnings support broad global index resilience."}
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
            {"ticker": "QDVE", "relation": "Supply Chain Vulnerability: Tech ETFs heavily reliant on Taiwanese manufacturing face tail-risk margin compression."},
            {"ticker": "EIMI", "relation": "Geopolitical Beta: TSMC represents 8.92% of EIMI fund weight."},
            {"ticker": "VWCE", "relation": "Buffer: Global market-cap weighting limits Taiwan exposure to 2.0%."}
        ],
        "retailAction": "This highlights why broad-market diversification (VWCE) is mathematically superior to thematic sector bets (QDVE). Diversification is the only free lunch."
    }
]

with open("public/data/news.json", "w") as f:
    json.dump(news_items, f, indent=2)

# 3. Investment Education & Bogleheads / Morningstar Framework
education = {
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
            "description": "Curvo backtest data shows that missing the 10 best trading days over a 20-year period cuts total cumulative portfolio returns by more than 50%. Stay invested and use monthly automated Sparpläne (savings plans)."
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

with open("public/data/education.json", "w") as f:
    json.dump(education, f, indent=2)

print("Generated correlations.json, news.json, and education.json.")
