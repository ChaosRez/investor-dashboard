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

# 4. Optimize portfolio using Hierarchical Risk Parity (HRP) or Risk Parity (ERC)
uv run apex-etf optimize VWCE:60 AGGU:40 SGLD:10 XEON:10 --method hrp

# 5. Stress-test historical downside across 5 crises (Dot-Com, Lehman, COVID, 2022)
uv run apex-etf stress-test VWCE:60 AGGU:40 --tolerance -20

# 6. Generate QuantStats downside teardown metrics (Sortino, CDaR, VaR, Ulcer Index)
uv run apex-etf teardown VWCE:60 AGGU:40

# 7. View curated institutional no-code tools (Portfolio Visualizer, Testfol.io, Portfolio Charts)
uv run apex-etf platforms

# 8. Check installation status & dataset integrity
uv run apex-etf status

# 9. Short-horizon plan: stress test, one-year risk, orders & fees, tax notes for amounts YOU choose
uv run apex-etf plan AII:1500 WGLD:1500 --hold CASH:15000 --hold BTC:250 --drop -10 --strategy tranches

# 10. Re-download price histories: performance figures, backtests, planner risk data (~5 s; Live Sync does it too)
uv run apex-etf planner-risk

# 11. Run the complete automated test suite (166 tests across 7 test modules)
uv run pytest tests
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

### 0. 🔎 Ticker Cards (everywhere)
* Hover, focus or tap any ticker (screener, comparison, planner, overlap heatmap, parity, quant risk, news chips, factsheets) for a card: full name, type, Acc/Dist and domicile, TER, fund size, price and day change, a one-year price line, and **measured** returns (1M, YTD, 1Y, 3Y and 5Y a year), volatility and the deepest fall with its dates. Enter on a ticker opens the full details; Esc closes.
* The figures come from `public/data/performance.json`, computed from Yahoo Finance daily prices (distributions reinvested) on every Live Sync. A period longer than a fund's price history shows "—"; a fund whose download failed keeps its last figures, labelled **Cached**.

### 1. 📊 ETF Screener & Multi-Factor Retail Scoring
* **Compact table:** ticker, name and badges (Acc/Dist, domicile, ISIN) in one cell; score, TER, tracking difference, fund size, **1-year return (measured)** and price. Details, compare and add-to-portfolio are icon buttons.
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

### 3. 📈 Backtest & DCA Plan
* **Pre-Built Classic Portfolios**:
  - *"VWCE and Chill"* (100% VWCE)
  - *"Bogleheads 88/12"* (88% IWDA + 12% EIMI)
  - *"Bogleheads 80/20"* (80% VWCE + 20% AGGU EUR Hedged)
  - *"Global All-Cap"* (80% VWCE + 20% IUSN Small Cap)
  - *"US Core + Tech Tilt"* (70% SXR8 + 30% QDVE)
* **With real prices:** the same plan (initial deposit, monthly Sparplan, years, inflation) run on actual month-end prices over the last N years, or as far back as the shared price history goes (said so when shorter): deposits, final value, value after inflation, the mix's annual return and volatility, and the deepest fall on the way. No fees or taxes.
* **Projection:** the plan compounded at the funds' weighted long-run CAGR from the dataset, with nominal, after-inflation and deposits lines. An illustration, not a forecast; real paths swing far more.
* Direct deep-link to verify and compare live on `https://curvo.eu/backtest/en`.

### 4. 🛡️ Regime Resilience & Non-Linear Risk Parity Studio
Built specifically for unpredictable macro regimes where basic Markowitz Mean-Variance Optimization (MPT) fails due to fragile expected return forecasts:
* **The 3-Step Decision-Making Workflow**:
  1. *Step 1: Pick Structural Building Blocks*: Manually assemble assets across 5 distinct economic regimes (**Growth Equities**, **Factor Tilts**, **Fixed Income Bonds**, **Cash €STR Liquidity**, and **Real Commodities/Gold**).
  2. *Step 2: Size with HRP or Risk Parity*: Allocate by true volatility risk contribution rather than subjective return forecasts using **Hierarchical Risk Parity (HRP)** or **Equal Risk Contribution (ERC / Risk Parity)**.
  3. *Step 3: Stress-Test the Downside*: Evaluate drawdown survival across 5 historical crisis shocks (**2000–2002 Dot-Com**, **2007–2009 Lehman GFC**, **2011 Euro Debt**, **2020 COVID**, and **2022 Fed Rate-Hiking Cycle**). If the worst result breaches your tolerance, the engine computes the exact XEON (€STR cash) share that would have kept every crisis within it, and "Try it" mixes that share in. Figures for funds launched after a crisis are labelled as estimates.
* **The 60/40 Equity Risk Trap Exposed**:
  - In a nominal 60/40 equity/bond portfolio, equities account for **over 91.5% of total portfolio risk**.
  - In the 2022 stagflation shock, intermediate bonds suffered a **-16.8% drawdown**, failing as a hedge and proving the necessity of non-linear risk parity, cash (€STR), and real assets.
* **Institutional Quant Engine (Zero External Dependencies)**:
  - **Hierarchical Risk Parity (HRP)**: Single-linkage agglomerative clustering on tree distance $d_{i,j} = \sqrt{2(1 - \rho_{i,j})}$, quasi-diagonalization (seriation), and recursive bisection.
  - **Equal Risk Contribution (ERC / Risk Parity)**: Exact Cyclical Coordinate Descent solver balancing marginal risk contributions ($w_i (\Sigma w)_i = w_j (\Sigma w)_j$).
  - **Mean-CVaR (Conditional Value-at-Risk)**: Projected gradient descent minimizing 95% expected tail loss in extreme black swan scenarios.
  - **Ledoit-Wolf Covariance Shrinkage**: Constant-correlation target shrinking sample noise to prevent extreme allocations.
  - **QuantStats Downside Tear-Sheet**: computed from the portfolio's real weekly returns (rebalanced weekly, over the dates all holdings share): CAGR, volatility, Sharpe and Sortino (risk-free rate: XEON over the same window), Calmar, maximum drawdown and longest time under water, VaR/CVaR 95% of 4-week returns, CDaR 95%, Ulcer index and tail ratio. The period is shown; a safe withdrawal rate would need decades of data and is not estimated.
* **Open-Source Python Quant Script Generators**:
  - One-click copyable scripts for **PyPortfolioOpt** (HRP, minimum CVaR, Ledoit-Wolf), **Riskfolio-Lib** (equal risk contribution, minimum CDaR) and **QuantStats** (HTML tear sheet against VWCE), pre-filled with your weights and the dashboard's EUR symbols. Run end to end on 5 Oct 2026 with yfinance 1.7, PyPortfolioOpt 1.6, Riskfolio-Lib 7 and QuantStats; they include a shim for PyPortfolioOpt 1.6 on SciPy 1.18.
* **Institutional No-Code Tools Integration**:
  - Interactive deep-dives into **Portfolio Visualizer** (Factor regression & Risk Parity), **Testfol.io** (Synthetic histories & cash drag), and **Portfolio Charts** (Drawdown survival & safe withdrawal rates).

### 5. 🧮 Portfolio Visualizer Quantitative Analytics
* **Advanced Risk Metrics**: Sortino Ratio (downside risk only), Calmar Ratio (recovery velocity), 95% Monthly Value at Risk (VaR), and Market Beta.
* **Markowitz Efficient Frontier**: SVG visualization showing the risk-return curve and demonstrating why adding non-correlated bonds (AGGU) reduces portfolio variance with minimal return sacrifice.

### 6. 📰 Market Intelligence & Real-Time Macro Radar
* Real-world financial and macroeconomic developments (ECB policy rate easing, Big Tech AI capex run-rates, Chinese liquidity facilities, sovereign debt term premiums, European competitiveness, semiconductor export controls).
* **Signal Level Classification**:
  - 🟢 **Bullish** | 🟡 **Watch / Neutral** | 🔴 **Bearish / Caution**
  - ⚡ **High Impact (Critical)** | ⚖️ **Moderate Impact** | ℹ️ **Low Impact**
  - **Timeframe**: Tactical (1–3 Months) vs Strategic (1–5 Years)
* **Two-Sided Grounded Relations**:
  - Select any news story to view every impacted ETF and the exact economic transmission mechanism.
  - Or select any ETF in the screener/modal to view all high-impact macro news directly impacting its constituents.
* **🛡️ Retail Boglehead Action**: Disciplined retail advice to prevent emotional trading, stay the course, and maintain automated DCA.

### 7. 📑 Official Issuer Documents & Final Verification Hub
* Comprehensive verification directory with one-click **ISIN Copy** buttons.
* Direct links to official **PRIIPs Key Information Documents (KIDs)**, **Monthly Factsheets**, and **Annual Reports** directly from Vanguard, BlackRock / iShares, Amundi, and Xtrackers.

### 8. 🎓 Bogleheads Wiki & Tax Academy
* **Interactive Compounding Drag Calculator**: Calculate the exact wealth loss of holding Distributing (Dist) vs Accumulating (Acc) ETFs over 10 to 40 years based on local dividend tax rates (e.g. 26.375% German Abgeltungsteuer or 30% Belgian WHT).
* **Domicile Deep-Dive**: Explains why **Ireland (IE)** is the gold standard for non-US investors (15% US treaty rate, 0% Irish WHT, and complete shielding from the 40% US Estate Tax trap on US-domiciled ETFs like VOO or VTI).
* **Step-by-Step Investor Roadmap**: Educational guide helping beginners navigate Portfolio Setup, Optimization, Verification, and Maintenance.

### 9. 🧭 Short-Horizon Planner (tab "Planner")
For money you may need again within a few years. It does the arithmetic of **your own** choices and never proposes instruments or amounts.
* **Compare the candidates:** cash account, €STR money-market and 1–3y government-bond ETFs, two gold ETCs, Bitcoin, AI-infrastructure, battery, European-infrastructure and utilities ETFs, plus world and Europe equity as references. Costs, German tax treatment and Trade Republic savings-plan availability are sourced (justETF, extraETF, the broker's price list); **volatility, beta, worst 12-month return, maximum fall and the move in every real fall of world equity of 10% or more** (2020, 2022, 2025) are computed from Yahoo Finance daily prices, never typed in.
* **Your split:** what you hold today and what you want to hold; cash absorbs the difference.
* **What if the market drops X%?** Per holding and in total: a beta estimate plus each past fall *scaled to your scenario*, full replays of those falls, a comparison with "everything in cash" (months of interest the loss would cost), an optional personal loss limit, and the one-year volatility / 1-in-20 loss from measured correlations. Instruments that did not exist during a fall are labelled (β estimate or same-underlying proxy).
* **Order plan at Trade Republic:** all at once, in tranches, or as savings plans on the broker's real execution days (2nd/9th/16th/23rd); fees (€1 Bestpreis / €2 Direktpreis since 1 Jul 2026; savings plans free, €10–€10,000 per execution), estimated crypto spread, interest earned on money still waiting, and how much a fall would cost after each purchase date.
* **Taxes (Germany, simplified):** saver's allowance vs the interest it must cover, per-instrument treatment (30% partial exemption for equity funds, 12-month rule for direct crypto and gold ETCs with a delivery right), and an upper bound for the Vorabpauschale (Basiszins 3.20% for 2026).
* **Market context with sources:** ECB deposit rate, euro-area inflation projection, S&P 500 Shiller CAPE, Germany's €500 bn infrastructure fund, the pending crypto-tax reform.
* Facts render offline from the bundled store; the calculations need the local server (`POST /api/planner/analyze`). "Refresh prices" (or Live Sync, or `uv run apex-etf planner-risk`) re-downloads prices and recomputes `planner-risk.json`, `performance.json` and `history.json`. Inputs are remembered in your browser only.

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
│       ├── cli.py              # CLI entrypoint (serve, sync, audit, optimize, stress-test, teardown, platforms)
│       ├── server.py           # HTTP server, static asset handling, /api/* REST endpoints
│       ├── sync.py             # Live data ingestion engine (Yahoo Finance, justETF, ECB RSS)
│       ├── analysis.py         # Overlap math, HRP, ERC, Mean-CVaR, Ledoit-Wolf, QuantStats teardown
│       ├── planner.py          # Short-horizon planner: risk stats from price history, stress test, orders, tax
│       └── macro_news.py       # Macro events, transmission mechanisms, and Boglehead rules
├── tests/
│   ├── __init__.py
│   ├── test_advanced_analysis.py # 19 tests: HRP, ERC, Mean-CVaR, Shrinkage, crisis stress test and exact cash share, tear sheet from real prices, generated scripts
│   ├── test_analysis.py          # 11 tests: overlap math, weighted TER, DCA projection per fund, DCA backtest on real prices
│   ├── test_cli.py               # 6 tests: CLI subcommands (audit, optimize, stress-test, teardown, platforms)
│   ├── test_planner.py           # 56 tests: price-history statistics, performance figures, episodes, stress test, orders, savings-plan calendar, tax, refresh
│   ├── test_data_integrity.py    # 4 tests: ETF schema, sector sums, holdings sums, correlation matrix
│   ├── test_server.py            # 25 tests: HTTP REST endpoints on ephemeral port, sync errors and price-history refresh, responsiveness during a sync, planner and performance API
│   └── test_sync.py              # 45 tests: fetch errors and CA fallback, daily change, EUR-only quotes, justETF parsing, sync reporting, headline retention, atomic writes, quote-symbol coverage
├── scripts/                      # Data maintenance and store generation scripts
│   ├── build_etf_data.py
│   ├── build_supporting_data.py
│   └── build_js_store.py
└── public/                       # Frontend client (zero framework, vanilla modern JS/CSS)
    ├── index.html                # App shell: app bar, ARIA tab bar (doubles as the 7-stage roadmap), dialogs, SVG icon sprite
    ├── css/styles.css            # Design system: tokens, cascade layers, dark/light themes, components, views
    ├── data/                     # Verified JSON datasets (etfs.json, news.json, correlations.json, planner.json) + computed planner-risk.json, performance.json, history.json
    └── js/                       # Classic scripts (no bundler) so file:// keeps working
        ├── ui.js                 # Shared toolkit: HTML escaping, formatting, dialogs, tooltips, toasts, chart helpers
        ├── ticker-card.js        # Hover/focus/tap card for every ticker: what it is, price, measured performance
        ├── app.js                # Controller: theme, tab routing, roadmap context bar, Live Sync, data hydration
        ├── data-store.js         # (generated) offline mirror of the datasets — run scripts/build_js_store.py after data edits
        ├── provider-logos.js
        ├── screener.js           # Sortable table (cards on mobile) + ETF drill-down dialog
        ├── comparison-matrix.js
        ├── overlap-correlation.js # Sequential-ramp correlation heatmap, portfolio builder, overlap audit
        ├── curvo-engine.js       # DCA / inflation projection chart (crosshair, keyboard, table view)
        ├── regime-risk-parity.js # 3-step decision workflow, risk-decomposition chart & dendrogram
        ├── pv-engine.js
        ├── planner.js            # Short-horizon planner: comparison, split editor, stress test, order plan, tax
        ├── news-signals.js
        ├── verification-docs.js
        └── bogleheads-academy.js
```

### 🖥️ Frontend Notes

* **Themes:** saved choice → operating-system preference → dark. Applied before first paint (no flash). All text/background pairs meet WCAG AA in both themes.
* **Navigation:** the numbered tabs *are* the roadmap (stages 1–7). A context bar above each staged tab explains what is essential vs optional and links to the previous/next stage. Press `/` to jump to the screener search; use `←` `→` `Home` `End` on the tab bar.
* **Accessibility:** WAI-ARIA tabs, focus-trapped dialogs with `inert` background, keyboard-focusable tooltips, labelled form controls, every chart has a **Table** view, and the correlation heatmap is a keyboard grid.
* **Offline behaviour:** the dashboard renders instantly from the bundled `data-store.js`, then refreshes from the REST API in the background. Overlap audit and Curvo backtests fall back to client-side math. Risk-parity analytics, Live Sync and script generation need the local server and say so when it is unreachable.
* **Caching:** the dev server sends `Cache-Control: no-cache` for static files and `index.html` versions its asset URLs (`?v=YYYYMMDD`). Bump that version string when you ship frontend changes.
* **Live Sync reports what it refreshed:** `POST /api/sync` returns `status` (`success`, `partial` or `failed`), per-source counts (`quotesUpdated`, `quotesFailed`, `fundDataUpdated`, `newsSources`) and human-readable `warnings`. The header button shows the same outcome ("Synced" / "Partly synced" / "Sync failed") and the freshness chip is judged by the *oldest* quote, so a partial sync never makes the table look fresher than it is. A sync takes ~25 s: after quotes, fund data and news it re-downloads daily price histories (`historyUpdated`) and recomputes `performance.json`, `history.json` and the planner's risk data. The server is threaded, so everything else keeps answering meanwhile, and a second sync started while one is running (say from another tab) is refused with HTTP 409.
* **Headlines survive a feed outage:** a news feed that stops answering keeps its last headlines, labelled **Cached** (with when they were fetched) and counted as "cached" rather than "live"; they are dropped after 7 days. A feed that answers always replaces them.

### 🔧 Troubleshooting Live Sync

| Warning in the sync summary | Cause | Fix |
|---|---|---|
| `Yahoo Finance: … price requests failed (HTTP 429)` | Yahoo rejects browser-spoofing and Python's default User-Agent. The sync identifies itself as `ApexETF/…`. | If it returns, check `USER_AGENT` in `src/apex_etf/sync.py`; Yahoo changes its bot filtering from time to time. |
| `ECB feed: no headlines (TLS certificate could not be verified)` | Your Python's CA bundle does not trust the CA that signs `ecb.europa.eu` (Sectigo's newer root). Verification stays on. | Nothing, normally: after the default trust store rejects a certificate the sync retries with `certifi` (if installed) and then with common OS bundles (Homebrew, Debian, RHEL), still requiring a valid chain and hostname, and logs the bundle it used. You only see this warning if none of them can verify it. Then point Python at a current bundle: `SSL_CERT_FILE=/opt/homebrew/etc/ca-certificates/cert.pem uv run apex-etf`. Set `APEX_STRICT_TLS=1` to forbid the fallback and use only the default trust store. |
| `justETF: fund size and TER unavailable … (page layout not recognised)` | justETF changed its profile markup. | Update `JUSTETF_SIZE_PATTERNS` / `JUSTETF_TER_PATTERNS` in `sync.py`. |

Every ETF in `etfs.json` needs an entry in `ETF_MARKET_MAP` (Yahoo symbol, exchange, ISIN) or it never gets a live quote; a test fails if one is missing or its ISIN disagrees with the dataset. A ticker without an entry is reported as *skipped*, not failed. The symbol must be a **EUR** line of the **same share class**: a quote in another currency is refused and reported (`… is quoted in USD, not EUR`), because London lines and other share classes quote in USD. When adding a fund, check the name Yahoo returns for the symbol, not just that it returns a price.

| Warning | Cause | Fix |
|---|---|---|
| `… is quoted in USD, not EUR` | The symbol is a non-EUR listing or another share class. | Use the fund's Xetra (`.DE`), Euronext (`.AS`/`.PA`) or Milan (`.MI`) line; Yahoo's search by ISIN lists them. |
| Planner: `No risk statistics for …` | The instrument has no price symbol or too little history (fewer than 26 weeks). | Add `yahooSymbol` in `planner.json` and run `uv run apex-etf planner-risk`. |

---

## 🧪 Running Automated Tests

Run the comprehensive test suite (166 unit and integration tests across 7 test modules):

```bash
# Using pytest (Recommended):
uv run pytest tests

# Or using standard unittest:
uv run python -m unittest discover tests
```

---

## 📜 License
MIT License - Open Source for European Retail & Bogleheads Investors.
