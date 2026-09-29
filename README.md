# ApexETF - Institutional European ETF Portfolio Intelligence Dashboard

A modern, high-performance European ETF intelligence dashboard and quantitative analytics suite, tailored for European and global retail investors prioritizing **Accumulating (Acc) UCITS ETFs**, **Total Cost of Ownership (TER + 5Y Tracking Difference)**, **Tax Domicile Alpha (Ireland vs Luxembourg vs US)**, **True Constituent Overlap Auditing**, and **Real-Time Macroeconomic News & Central Bank Transmissions**.

---

## ⚡ Zero-Setup Quickstart

ApexETF is designed with a **zero-dependency core** using Python standard library modules (`http.server`, `urllib.request`, `json`, `socketserver`), while providing modern package management with [`uv`](https://github.com/astral-sh/uv).

### Option 1: Modern Fast Execution with `uv` (Recommended)

```bash
# 1. Run local dashboard server on http://localhost:8080
uv run apex-etf

# 2. Or synchronize real-time market data & central bank feeds
uv run apex-sync

# 3. Or perform an instant quantitative portfolio overlap audit in the terminal
uv run apex-etf audit VWCE:70 QDVE:30

# 4. Check installation status & dataset integrity
uv run apex-etf status

# 5. Run the complete automated test suite (18 tests)
uv run python -m unittest discover tests
```

### Option 2: Standard Python 3 (No Virtual Environment Needed)

```bash
# Start server directly (port 8080)
python3 server.py

# Run live market sync directly
python3 dynamic_sync.py

# Run test suite
python3 -m unittest discover tests
```

Access the web interface at:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 💎 Zero Mock Data Mandate: Verified Real-World Provenance

All figures, metrics, percentages, and document links in this dashboard are grounded strictly in real data from premier financial platforms:

| Domain | Platform | Data Grounded in Dashboard |
| :--- | :--- | :--- |
| **ETF Profiling & Screening** | [justETF.com](https://www.justetf.com) | TER, Fund Size (AUM), Physical/Synthetic Replication, Securities Lending share, Domicile, Exchange listings |
| **Broker Availability & Tracking** | [extraETF.com](https://extraetf.com) | 1Y & 5Y historical Tracking Difference (TD), Sparplan savings plan status across Trade Republic, Scalable, DEGIRO, IBKR, flatex, ING |
| **Historical Portfolio Analysis** | [Curvo.eu](https://curvo.eu/backtest/en) | Historical CAGR, Annual Volatility, Sharpe Ratio, Maximum Drawdown periods, recovery durations, DCA simulations |
| **Advanced Quantitative Risk** | [Portfolio Visualizer](https://www.portfoliovisualizer.com) | 10-year monthly correlation matrix, Sortino Ratio, Calmar Ratio, 95% Monthly Value at Risk (VaR), Markowitz Efficient Frontier |
| **Asset Class & Style Taxonomy** | [Morningstar.com](https://www.morningstar.com) | 3x3 Style Box (Large Blend, Large Growth, Small Blend), Sustainability ESG scores, valuation multiples |
| **Execution Quality & Spreads** | [Trackinsight.com](https://www.trackinsight.com) | Liquidity tier ratings, average bid-ask spreads, tracking error volatility |
| **Live Market Quotes** | [Yahoo Finance](https://finance.yahoo.com) | Real-time European XETRA/Euronext/LSE prices, 52-week high/low ranges, day percent changes |
| **Live Macro News Feeds** | European Central Bank & MarketWatch RSS | Official monetary policy decisions, deposit facility changes, €STR rate benchmarks, corporate earnings |
| **Final Statutory Verification** | Official Issuers | Direct links to PRIIPs Key Information Documents (KIDs), monthly PDF Factsheets, and WKN/ISIN identifiers |
| **Retail Investment Education** | [Bogleheads Wiki](https://www.bogleheads.org/wiki/EU_investing) | 3-Fund UCITS model, Accumulating compounding alpha, Domicile tax treaty benefits, rebalancing rules |

---

## 🎯 Key Dashboard Features

### 1. 📊 ETF Screener & Multi-Factor Retail Scoring
* **Prioritizes Accumulating (Acc) ETFs**: Default filters highlight accumulating share classes, explaining the elimination of dividend tax leakage and broker reinvestment friction.
* **Retail Multi-Factor Score (0–100)**: Evaluates ETFs not on star ratings alone, but across:
  1. *Index Coverage & Breadth* (FTSE All-World vs MSCI World vs S&P 500)
  2. *Total Cost of Ownership* (TER + 5Y Tracking Difference + Spread)
  3. *Tracking Difference Consistency* (Highlighting negative TD as outperformance)
  4. *Fund Size (AUM)* (>€100M liquidation safety threshold, >€10B institutional giant)
  5. *Domicile & Tax Alpha* (Ireland 15% US treaty vs Luxembourg 30% vs US 40% estate tax)
  6. *Broker Availability* (Trade Republic, Scalable Capital, Interactive Brokers, DEGIRO, ING, flatex)
* **Detailed Drilldown Modal**: View top 10 holdings, sector weights, country allocations, PRIIPs SRI risk (1–7), Curvo backtest statistics, and direct links to official issuer PDFs.
* **Provider Brand Logos**: Visual recognition for Vanguard, BlackRock / iShares, Invesco, Amundi, DWS Xtrackers, State Street SPDR, and WisdomTree.

### 2. 🔗 Correlation Heatmap & Portfolio Overlap Auditor
* **10-Year Monthly Correlation Matrix**: Interactive heatmap from Portfolio Visualizer data showing correlations between core equity and bond ETFs. Click any cell to read the diversification rationale (e.g. why AGGU has a 0.12 correlation to VWCE, providing true drawdown dampening).
* **Constituent Overlap & Redundancy Auditor**:
  - Enter your target portfolio weights (e.g., 50% VWCE + 30% SXR8 + 20% QDVE).
  - Detects **triple-stacking concentration risk** (e.g., holding 10.4% NVIDIA and 9.8% Apple across 3 funds).
  - Shows pairwise shared constituent weight (e.g., VWCE vs IWDA has 88.4% overlap; SXR8 vs QDVE has 32.1% overlap).
  - Calculates true sector and geographic exposures with automated Bogleheads warnings.

### 3. 📈 Curvo Historical Backtest & DCA Growth Engine
* **Pre-Built Classic Portfolios**:
  - *"VWCE and Chill"* (100% VWCE)
  - *"Bogleheads 88/12"* (88% IWDA + 12% EIMI)
  - *"Bogleheads 80/20"* (80% VWCE + 20% AGGU EUR Hedged)
  - *"Global All-Cap"* (80% VWCE + 20% IUSN Small Cap)
  - *"US Core + Tech Tilt"* (70% SXR8 + 30% QDVE)
* **Real Compounding DCA Simulator**:
  - Configure initial deposit (€), monthly Sparplan contribution (€), investment horizon (years), and inflation rate (%).
  - Real-time SVG Growth Chart: Visualizes **Nominal Portfolio Value**, **Real Purchasing Power (Inflation-Adjusted)**, and **Total Out-of-Pocket Deposits**.
  - Direct deep-link to verify and compare live on `https://curvo.eu/backtest/en`.

### 4. 🧮 Portfolio Visualizer Quantitative Analytics
* **Advanced Risk Metrics**: Sortino Ratio (downside risk only), Calmar Ratio (recovery velocity), 95% Monthly Value at Risk (VaR), and Market Beta.
* **Markowitz Efficient Frontier**: SVG visualization showing the risk-return curve and demonstrating why adding non-correlated bonds (AGGU) reduces portfolio variance with minimal return sacrifice.

### 5. 📰 Market Intelligence & Real-Time Macro Radar
* Real-world financial and macroeconomic developments (ECB policy rate easing, Big Tech AI capex run-rates, Chinese liquidity facilities, sovereign debt term premiums, European competitiveness, semiconductor export controls).
* **Signal Level Classification**:
  - 🟢 **Bullish** | 🟡 **Watch / Neutral** | 🔴 **Bearish / Caution**
  - ⚡ **High Impact (Critical)** | ⚖️ **Moderate Impact** | ℹ️ **Low Impact**
  - **Timeframe**: Tactical (1–3 Months) vs Strategic (1–5 Years)
* **Two-Sided Grounded Relations**:
  - Select any news story to view every impacted ETF and the exact economic transmission mechanism.
  - Or select any ETF in the screener/modal to view all high-impact macro news directly impacting its constituents.
* **🛡️ Retail Boglehead Action**: Disciplined retail advice to prevent emotional trading, stay the course, and maintain automated DCA.

### 6. 📑 Official Issuer Documents & Final Verification Hub
* Comprehensive verification directory with one-click **ISIN Copy** buttons.
* Direct links to official **PRIIPs Key Information Documents (KIDs)**, **Monthly Factsheets**, and **Annual Reports** directly from Vanguard, BlackRock / iShares, Amundi, and Xtrackers.

### 7. 🎓 Bogleheads Wiki & Tax Academy
* **Interactive Compounding Drag Calculator**: Calculate the exact wealth loss of holding Distributing (Dist) vs Accumulating (Acc) ETFs over 10 to 40 years based on local dividend tax rates (e.g. 26.375% German Abgeltungsteuer or 30% Belgian WHT).
* **Domicile Deep-Dive**: Explains why **Ireland (IE)** is the gold standard for non-US investors (15% US treaty rate, 0% Irish WHT, and complete shielding from the 40% US Estate Tax trap on US-domiciled ETFs like VOO or VTI).
* **Step-by-Step Investor Roadmap**: Educational guide helping beginners navigate Portfolio Setup, Optimization, Verification, and Maintenance.

---

## 🏗️ Architecture & Project Layout

```
├── pyproject.toml              # PEP 621 packaging metadata, hatchling build, CLI entrypoints
├── uv.lock                     # Deterministic lockfile generated via uv
├── server.py                   # Backward-compatible shim -> src/apex_etf/server.py
├── dynamic_sync.py             # Backward-compatible shim -> src/apex_etf/sync.py
├── prd.md                      # Comprehensive Product Requirements Document (PRD)
├── DECISIONS.md                # Architectural Decision Records (ADRs)
├── src/
│   └── apex_etf/
│       ├── __init__.py         # Package initialization & public API exports
│       ├── config.py           # Paths, default ports, watchlist tickers, ISIN market map
│       ├── cli.py              # CLI entrypoint (serve, sync, audit, status)
│       ├── server.py           # HTTP server, static asset handling, /api/* REST endpoints
│       ├── sync.py             # Live data ingestion engine (Yahoo Finance, justETF, ECB RSS)
│       ├── analysis.py         # Overlap math, single-stock concentration, Curvo DCA engine
│       └── macro_news.py       # Macro events, transmission mechanisms, and Boglehead rules
├── tests/
│   ├── __init__.py
│   ├── test_analysis.py        # 6 unit tests: overlap, weighted TER, DCA compounding
│   ├── test_server.py          # 8 integration tests: HTTP REST endpoints on ephemeral port
│   └── test_sync.py            # 4 unit tests: config, ISIN mappings, network resilience
├── scripts/                    # Legacy data preparation scripts
│   ├── build_etf_data.py
│   ├── build_supporting_data.py
│   └── build_js_store.py
└── public/                     # Frontend client (zero framework, vanilla modern JS/CSS)
    ├── index.html              # Single Page Application HTML5 UI
    ├── css/styles.css          # Responsive Dark/Light CSS design system
    ├── data/                   # Verified JSON datasets (etfs.json, news.json, etc.)
    └── js/                     # Modular frontend controllers
        ├── app.js
        ├── data-store.js
        ├── screener.js
        ├── overlap-correlation.js
        ├── curvo-engine.js
        ├── pv-engine.js
        ├── news-signals.js
        ├── verification-docs.js
        └── bogleheads-academy.js
```

---

## 🧪 Running Automated Tests

Run the test suite with standard `unittest` or with `uv`:

```bash
# Using uv:
uv run python -m unittest discover tests

# Using standard Python:
python3 -m unittest discover tests
```

---

## 📜 License
MIT License - Open Source for European Retail & Bogleheads Investors.
