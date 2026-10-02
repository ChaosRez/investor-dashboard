# Architecture & Investment Decisions Record (ADR)
**Project:** ApexETF — Personal Investment Dashboard for Retail Investors  
**Date:** September 2026  
**Audience:** Human Investors, Financial Engineers, and Future AI Collaborators  
**Status:** Active & Implemented  

---

## 📌 Executive Summary

This document serves as the authoritative permanent record of all **architectural, data provenance, financial modeling, and algorithmic decisions** made in the construction of the ApexETF personal investment dashboard.

Any human engineer or AI agent extending, refactoring, or querying this repository must adhere to the decisions and methodologies documented herein.

---

## 🏛️ 1. Core Architectural & Technical Decisions

### Decision 1.1: Dual Execution Model (REST API + Offline In-Memory Fallback)
* **Context:** Retail investors and agents operate in varied environments: local servers, sandboxed IDEs, local file system browsing (`file://`), or offline environments.
* **Decision:** Implement a dual-execution architecture:
  1. **REST API Mode (`server.py`):** Standard Python 3 HTTP server exposing endpoints (`/api/etfs`, `/api/overlap`, `/api/portfolio/backtest`, `/api/correlations`, `/api/news`, `/api/education`).
  2. **Zero-Dependency Standalone Mode (`data-store.js`):** All verified datasets and math algorithms are mirrored in vanilla JavaScript. If an API request fails, times out, or the application is loaded directly from disk via `file:///...`, the dashboard automatically executes calculations clientside with 100% feature parity.
* **Rationale:** Prevents CORS errors, proxy sandboxing blocks, or local server connection failures from breaking the retail investor's experience.

### Decision 1.2: Zero External Node/NPM Build Tool Overhead
* **Context:** Front-end build chains (Vite, Webpack, Babel) introduce heavy `node_modules` dependencies, version deprecation risk, and sandboxed package installation failures (e.g. npm 403 proxy policies).
* **Decision:** Build the entire UI using **Modern Vanilla Web Standards (ES Modules, CSS3 Custom Properties, Native SVG Visualization)**.
* **Rationale:** Zero build time, instant load speed, zero runtime vulnerabilities, and 100% perpetual maintainability across any browser.

### Decision 1.3: Native SVG Vector Charts vs Heavy Canvas/Chart Libraries
* **Context:** Loading libraries like Chart.js or D3 adds 500KB+ overhead and external CDN dependencies that fail in air-gapped or sandboxed environments.
* **Decision:** Write lightweight, responsive mathematical SVG chart renderers directly in `curvo-engine.js` (Multi-line DCA wealth projection) and `pv-engine.js` (Markowitz Efficient Frontier curve).
* **Rationale:** Fully responsive, zero external script dependencies, crisp vector scaling at any DPI, and direct DOM event integration.

---

## 💎 2. Data Provenance & "No Mock Data" Standard

### Decision 2.1: Absolute Prohibition of Mock Data
* **Context:** Financial planning requires rigorous, audited numbers. Synthetic or hallucinated numbers mislead retail investors regarding risks, drawdowns, and expected yields.
* **Decision:** Every single metric is grounded in verifiable sources:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA PROVENANCE MAP                             │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Financial Source         │ Grounded Data Fields                        │
├──────────────────────────┼─────────────────────────────────────────────┤
│ justETF.com              │ TER, AUM, Physical/Synthetic Replication,   │
│                          │ Securities Lending share, Domicile, WKN     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ extraETF.com             │ 1Y & 5Y Tracking Difference (TD),           │
│                          │ Sparplan status on TR, Scalable, IBKR, etc. │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Curvo.eu                 │ Historical CAGR, StDev, Sharpe, Max Drawdown│
│                          │ recovery durations (2000–2026 data series)  │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Portfolio Visualizer     │ 10-Yr Monthly Correlation Matrix, Sortino,  │
│                          │ Calmar, 95% Monthly Value at Risk (VaR)     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Morningstar.com          │ 3x3 Style Box, P/E, P/B, Sustainability     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Trackinsight.com         │ Liquidity tiers, bid-ask spreads, error     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Official KIDs/Factsheets │ PRIIPs SRI Risk (1–7), Official PDFs        │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Bogleheads Wiki          │ 3-Fund UCITS model, Accumulating rules      │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 📈 3. Financial & Investment Logic Decisions

### Decision 3.1: Strict Prioritization of Accumulating (Acc) ETFs
* **Context:** In most European tax jurisdictions (Germany, UK, Belgium, Italy, France, Spain, Austria), distributing dividends creates immediate tax drag.
* **Decision:**
  1. Highlight Accumulating share classes by default with green status indicators.
  2. Implement an **Interactive Compounding Drag Calculator** in the Bogleheads Academy tab.
* **Mathematical Rationale:**
  - In a distributing ETF, dividends ($y \approx 2.0\%$) trigger annual withholding tax ($t \approx 26.375\% - 30\%$).
  - Effective net compounding return is reduced from $g$ to $(g - y) + y(1 - t)$.
  - Over a 25-year horizon on a €50,000 portfolio, this tax friction strips away **over €42,000 in lost compounding growth**, not including broker reinvestment transaction commissions!
  - Accumulating funds automatically reinvest gross dividends into NAV without taxable distribution events in capital-gains deferred regimes.

### Decision 3.2: Rejection of Star Ratings Alone in Favor of Multi-Factor Retail Scoring
* **Context:** Morningstar star ratings are purely backward-looking performance metrics that often lead retail investors to chase past high-beta winners at peak valuations.
* **Decision:** Implement a transparent **Multi-Factor Retail Score (0–100)** incorporating:
  1. **Index Coverage (Weight: 20%):** Constituent breadth (e.g. VWCE: 3,682 holdings vs SXR8: 503) and global diversification.
  2. **Total Cost of Ownership (Weight: 20%):** TER + 5Y Tracking Difference + Bid-Ask Spread.
  3. **Tracking Difference Alpha (Weight: 20%):** Rewards funds that beat their net benchmark (negative TD).
  4. **Fund Size & Liquidity (Weight: 15%):** >€100M threshold eliminates liquidation/merger risk; >€10B ensures institutional spreads.
  5. **Domicile Tax Efficiency (Weight: 15%):** Ireland (15% US treaty, 0% local WHT) vs Luxembourg (30%) vs US (40% estate tax hazard).
  6. **Broker Sparplan Availability (Weight: 10%):** Free automated execution on European brokers.

### Decision 3.3: Domicile Policy: Ireland (IE) as the Undisputed Gold Standard
* **Context:** Non-US retail investors often mistakenly purchase US-domiciled ETFs (e.g. VOO, VTI) or sub-optimal European domiciles.
* **Decision:** Explicitly educate and flag fund domiciles:
  - **Ireland (IE):** Benefits from the US-Ireland Double Taxation Treaty (15% US dividend withholding vs 30% statutory rate). Zero Irish dividend withholding tax on distributions to non-residents. Fully shielded from the **40% US Estate Tax trap** on US-situs assets exceeding $60,000.
  - **Luxembourg (LU):** Efficient for European assets (MEUD), but sub-optimal for US equities (often subject to 30% US WHT).
  - **United States (US):** Prohibited for non-US investors due to IRS estate tax liabilities and lack of EU PRIIPs KIDs.

---

## 🔗 4. Overlap & Correlation Engine Decisions

### Decision 4.1: Pairwise Correlation vs Constituent Overlap Distinction
* **Context:** Investors frequently confuse return correlation with portfolio overlap. Two funds can have a high return correlation while holding zero shared stocks (e.g. US Tech and Taiwanese Semiconductors).
* **Decision:** Provide two distinct, complementary analytical tools:
  1. **10-Year Monthly Correlation Matrix:** Evaluates macroeconomic co-movement. Proves that **AGGU (0.12 correlation)** is an anti-fragile portfolio stabilizer, whereas **SXR8 and QDVE (0.94 correlation)** move in lockstep.
  2. **Constituent Overlap & Redundancy Auditor:** Deconstructs the underlying equity holdings by weight to compute shared company exposure.

### Decision 4.2: Automated Redundancy & Single-Stock Concentration Warnings
* **Context:** Retail investors who buy "VWCE + SXR8 + QDVE" believe they are diversifying, but in reality they are "triple-stacking" large-cap tech.
* **Decision:** The portfolio redundancy auditor automatically calculates the aggregated weight of individual stocks and triggers warnings:
  - **Single-Stock Concentration Warning:** Fired if the top 3 holdings exceed 15% of the portfolio.
  - **Sector Concentration Warning:** Fired if Information Technology exceeds 35% of total portfolio weight.
  - **Geographic Concentration Warning:** Fired if US equity weight exceeds 75%.
  - **Distributing Exposure Warning:** Fired if any distributing fund is detected.

---

## 📡 5. Market News & Signal Radar Decisions

### Decision 5.1: Structured Signal Classification Schema
* **Context:** Financial news media is designed to provoke retail FOMO and panic trading.
* **Decision:** Every news item must be strictly parsed into a four-dimensional signal schema:
  1. **Signal Bias:** `Bullish` 🟢 | `Watch / Neutral` 🟡 | `Bearish / Caution` 🔴
  2. **Systemic Impact:** `High Impact (Critical)` ⚡ | `Moderate Impact` ⚖️ | `Low Impact` ℹ️
  3. **Time Horizon:** `Tactical (1–3 Months)` vs `Strategic (1–5 Years)`
  4. **Target ETFs & Economic Transmission:** Specific causal explanation of how the macro catalyst impacts underlying fund cash flows.

### Decision 5.2: Mandatory "Retail Boglehead Action" Field
* **Context:** News without actionable discipline leads to erratic portfolio churn.
* **Decision:** Every news card includes an explicit Bogleheads takeaway instructing investors on whether to rebalance, maintain DCA, or ignore short-term market noise.

---

## 🧮 6. Quantitative Analysis (Curvo & Portfolio Visualizer)

### Decision 6.1: Curvo DCA Compounding Formulation
* **Context:** Retail investors rarely invest a single lump sum; they invest monthly via automated Sparpläne.
* **Decision:** The Curvo backtest engine simulates monthly DCA compounding:
  $$V_{m} = (V_{m-1} + \text{DCA}) \times (1 + r_{\text{monthly}})$$
  where $r_{\text{monthly}} = (1 + \text{CAGR})^{1/12} - 1$.
  Real purchasing power is simultaneously tracked using historical inflation discounting:
  $$V_{\text{real}, y} = \frac{V_{\text{nominal}, y}}{(1 + i)^y}$$

### Decision 6.2: Portfolio Visualizer Downside Risk Metrics
* **Context:** Volatility is not risk; permanent capital loss or severe drawdown is risk. Standard Sharpe ratio penalizes upside volatility.
* **Decision:** Integrate Portfolio Visualizer metrics that isolate downside risk:
  - **Sortino Ratio:** $\frac{R_p - R_f}{\sigma_d}$ (penalizes only negative variance).
  - **Calmar Ratio:** $\frac{\text{CAGR}}{|\text{Max Drawdown}|}$ (measures return velocity relative to worst historical capitulation).
  - **Monthly VaR (95%):** Value at Risk isolating tail risk in a 1-in-20 month liquidity crunch.
  - **Markowitz Efficient Frontier:** Demonstrates the mathematical benefit of combining non-correlated assets (AGGU + VWCE).

---

## 🤖 7. Guidelines for Future AI Collaborators & Developers

When modifying or extending this codebase, follow these rules:

1. **Never Inject Mock or Fabricated Numbers:**
   - Always verify ETF metrics via `search_web` or official factsheet/KID documents before updating `public/data/etfs.json`.
2. **Synchronize Dual Data Stores:**
   - If modifying `public/data/etfs.json`, `correlations.json`, or `news.json`, immediately run `build_js_store.py` (`python3 build_js_store.py`) to keep `public/js/data-store.js` in 100% lockstep.
3. **Preserve Sandboxing Resilience:**
   - Avoid adding external npm package dependencies or complex build steps. Keep all JavaScript pure vanilla ES6+.
4. **Maintain Portfolio Auditor Warning Thresholds:**
   - When altering warning logic, ensure Bogleheads principles (broad diversification, low turnover, tax efficiency) remain the guiding evaluation standard.
5. **Always Verify PRIIPs KIDs:**
   - Any new ETF added must include official issuer document URLs (`kidUrl`, `factsheetUrl`, `issuerPage`).
6. **Escape Everything That Is Not Yours (Frontend):**
   - News titles, summaries and sources come from third-party RSS feeds. Pass every interpolated string through `UI.esc()` and every link through `UI.safeUrl()` / `UI.link()` before it reaches `innerHTML`. Never interpolate raw data into markup.
7. **Never Fabricate Defaults for Missing Data (Frontend):**
   - A missing score, SRI, replication method or lending policy renders as `—`, not a plausible-looking default (this applies the Zero Mock Data mandate to the UI).
8. **Use the Design Tokens and the UI Toolkit:**
   - Colours come from the custom properties in `styles.css` (never hard-coded hex in templates); dialogs, tooltips, toasts and chart scaffolding come from `ui.js`. When you ship frontend changes, bump the `?v=` asset version in `index.html`.

---

## 🐍 8. Modular Python Architecture & Modern Tooling (`uv`)

### Decision 8.1: Standard `src/` Layout & PEP 621 Packaging (`pyproject.toml`)
* **Context:** The project initially used flat root scripts (`server.py`, `dynamic_sync.py`, `build_*.py`). For long-term maintainability, professional distribution, and clean separation of concerns, a standardized layout is required.
* **Decision:** Modularize core logic into `src/apex_etf/`:
  - `config.py`: Centralized filesystem paths, defaults, ISIN market mappings, and watchlist tickers.
  - `analysis.py`: Quantitative overlap mathematics, single-stock concentration analysis, and Curvo DCA compounding.
  - `sync.py`: Live ingestion engine (Yahoo Finance quotes, justETF fund size/TER scraper, ECB RSS, MarketWatch).
  - `macro_news.py`: Grounded macro catalysts, transmission mechanisms, and Boglehead retail actions.
  - `server.py`: Standard HTTP server handling static asset delivery and REST API routes (`/api/*`).
  - `cli.py`: Unified command-line dispatcher (`serve`, `sync`, `audit`, `status`).
* **Packaging:** Define `pyproject.toml` using `hatchling` as build-backend and `uv.lock` for deterministic dependency resolution.

### Decision 8.2: Zero External Runtime Dependencies Mandate
* **Context:** Requiring heavy external web frameworks (FastAPI, Flask, Pandas, Django) introduces compilation friction, C-extension build failures, pip version conflicts, and startup latency for new users.
* **Decision:** The core runtime of `apex-etf` relies strictly on Python 3 standard library modules (`http.server`, `urllib.request`, `socketserver`, `json`, `xml.etree.ElementTree`, `math`, `argparse`).
* **Rationale:** Zero setup overhead. A user who clones the repository can execute `uv run apex-etf` or `python3 server.py` immediately with zero `pip install` steps.

### Decision 8.3: Backward-Compatible Root Shims
* **Context:** Existing automation, persistent background server daemons, and developer muscle memory rely on `python3 server.py` and `python3 dynamic_sync.py`.
* **Decision:** Retain root `server.py` and `dynamic_sync.py` as lightweight backward-compatible shims that dynamically add `src/` to `sys.path` and delegate to `apex_etf.server` and `apex_etf.sync`. Legacy build scripts are archived in `scripts/`.

### Decision 8.4: Automated Unit Test Suite (`tests/`)
* **Context:** Ensuring numerical accuracy of portfolio overlap, tracking difference calculations, and server stability requires continuous verification.
* **Decision:** Establish an automated test suite under `tests/` covering:
  - `test_analysis.py`: Overlap math, single-stock concentration warnings, Curvo DCA nominal/real values.
  - `test_server.py`: HTTP server endpoints (`/api/etfs`, `/api/correlations`, `/api/news`, `/api/market-status`, POST `/api/overlap`, POST `/api/portfolio/backtest`) on ephemeral OS ports.
  - `test_sync.py`: Ticker mappings, ISIN formatting, macro news grounding, and network resilience.
  - Run via: `uv run python -m unittest discover tests` or `python3 -m unittest discover tests`.

---

## 🛡️ 9. Advanced Portfolio Analysis for Unpredictable Macro Regimes

### Decision 9.1: Non-Linear Risk Parity (HRP & ERC) Over Naive Mean-Variance Optimization (MPT)
* **Context:** Classical Markowitz Mean-Variance Optimization requires forecasting expected returns ($\mu$). In unpredictable macro environments with inflation shocks and regime shifts, small forecast errors produce extreme, un-investable portfolio weights ("error maximizers"). Additionally, standard nominal allocations like the institutional 60/40 suffer from the **Equity Risk Concentration Trap**:
  - In a 60% VWCE / 40% AGGU portfolio, equities account for **over 91.5% of total portfolio volatility risk**.
  - In the 2022 stagflationary rate-hiking cycle, intermediate bonds fell by -16.8%, compounding equity losses rather than hedging them.
* **Decision:**
  1. Implement **Hierarchical Risk Parity (HRP)** (Marcos López de Prado): Uses machine learning graph clustering (single-linkage dendrograms) on the correlation distance matrix $d_{i,j} = \sqrt{2(1 - \rho_{i,j})}$, quasi-diagonalization (seriation), and recursive bisection. It never inverts a covariance matrix, eliminating matrix singularity and stability collapse during regime shifts.
  2. Implement **Equal Risk Contribution (ERC / Risk Parity)**: Uses exact Cyclical Coordinate Descent (CCD) to solve for weights where each asset contributes identical marginal risk to total portfolio volatility ($w_i (\Sigma w)_i = w_j (\Sigma w)_j$).
  3. Support **Inverse Volatility ($w_i \propto 1/\sigma_i$)** as a practical, bounded risk-parity baseline.

### Decision 9.2: Tail-Risk Minimization (Mean-CVaR) and Ledoit-Wolf Covariance Shrinkage
* **Context:** Financial asset returns exhibit fat tails (leptokurtic Student-t distributions) and negative skewness. Optimizing for standard deviation penalizes upside volatility equally with catastrophic downside losses.
* **Decision:**
  1. **Mean-CVaR (Conditional Value-at-Risk):** Implemented a projected gradient descent solver that minimizes the expected shortfall (average loss in the worst 5% tail scenarios) rather than naive variance.
  2. **Ledoit-Wolf Covariance Shrinkage:** Replaces noisy sample covariance matrices with an analytically shrunk matrix $\Sigma^* = \alpha F + (1 - \alpha) S$, where $F$ is a constant-correlation structured target and $\alpha$ is the optimal shrinkage intensity, preventing over-allocation to spurious correlations.

### Decision 9.3: QuantStats Historical Crisis Stress-Testing & Behavioral Drawdown Tolerance Guardrails
* **Context:** Aggregated Sharpe ratios mask intra-cycle maximum drawdown trauma. Retail investors routinely abandon long-term investment plans when drawdowns breach their emotional tolerance threshold.
* **Decision:**
  1. Ground stress-testing in **5 canonical historical crisis windows** with real asset drawdowns:
     - *2000–2002 Dot-Com Tech Bust*: Heavy drawdown in equities (-44.2%), positive sovereign bond flight (+22.4%), gold resilience (+8.1%).
     - *2007–2009 Lehman Brothers Global Financial Crisis*: Liquidity freeze across global equities (-53.8%), high-grade bond buffer (+14.2%), cash stability (+3.5%).
     - *2011 European Sovereign Debt Crisis*: Periphery bank stress and euro equity drawdown (-21.5%), bond flight (+8.2%), gold surge (+29.6%).
     - *2020 COVID-19 Liquidity Shock*: Rapid compressed equity crash (-33.8%), temporary bond buffer (+3.1%), rapid cash preservation.
     - *2022 Fed Rate-Hiking / Stagflation Shock*: Simultaneous equity crash (-18.2%) and bond duration collapse (-16.8%); gold (+0.4%) and overnight cash €STR (+0.8%) provided sole capital defense.
  2. Implement a dynamic **Behavioral Drawdown Tolerance Guardrail**: If historical maximum drawdown exceeds the investor's specified limit (e.g. -20%), the engine calculates the exact reallocation into ultra-short liquidity (€STR XEON) required to bring portfolio drawdown back inside safe emotional tolerance.
  3. Calculate a comprehensive **QuantStats Downside Tear-Sheet**: CAGR, Volatility, Sharpe, Sortino, Calmar, Max Drawdown, Tail Ratio, Monthly VaR 95%, CVaR 95%, Conditional Drawdown at Risk (CDaR 95%), Ulcer Index (cumulative drawdown stress), and 30-Year Safe Withdrawal Rate (SWR).

### Decision 9.4: Multi-Tier Architecture: Zero-Dependency Core + Python Quant Generators + No-Code Hub
* **Context:** Users vary between retail investors seeking intuitive visual modeling and quantitative researchers demanding Python code.
* **Decision:**
  1. **Zero-Dependency Python Standard Library Core:** All mathematical solvers (HRP, ERC, Mean-CVaR, Ledoit-Wolf, stress-tests) are implemented strictly using Python's standard library `math` and `random` modules, ensuring zero installation friction (`uv run apex-etf`).
  2. **Open-Source Python Quant Script Generators:** The engine exports ready-to-run, fully formatted Python code for **PyPortfolioOpt** (`HRPOpt`), **Riskfolio-Lib** (`riskfolio.Portfolio`), and **QuantStats** (`qs.reports.full`).
  3. **Curated No-Code Tools Integration:** Direct guidance, parameter recommendations, and use-case matching for **Portfolio Visualizer**, **Testfol.io**, and **Portfolio Charts**.

---

## 🖥️ 10. Frontend Architecture & UX System

### Decision 10.1: Design Tokens, Cascade Layers and Contrast-Validated Themes
* **Context:** The original stylesheet hard-coded dark-tuned colours (muted text measured ~3.8:1, light-mode badges ~1.5:1, white-on-emerald/amber buttons ~2.2–2.5:1) and templates carried ~500 inline styles, so theming and contrast could not be fixed centrally.
* **Decision:**
  1. `styles.css` is organised as `@layer reset, tokens, base, layout, components, modules, utilities` and every colour is a theme-aware custom property (`:root[data-theme="dark" | "light"]`).
  2. Accent "ink" tokens (`--accent-*`) are for text/graphics on surfaces; "solid" tokens (`--solid-*`) are fills that always carry white text. Both are computed to meet WCAG AA per theme.
  3. Legacy token names stay defined because some templates still reference them.
* **Verification:** an in-browser auditor composites each text node over its real stacked background; all nine tabs report **0 failures in both themes**. Re-run it when changing tokens.

### Decision 10.2: Navigation = Roadmap
* **Context:** The 7-stage roadmap panel (~370px, with an orphaned seventh card) sat above *every* tab and pushed real content below the fold; on phones it exceeded a full screen. The tab strip also clipped at 1440px with a hidden scrollbar.
* **Decision:** The sticky ARIA tab bar carries the stage numbers (colour-coded essential / planning / optional / maintenance). A context bar above each staged tab shows the stage's status badge, description and previous/next links; the long-form guide lives in the "Where to start?" dialog. Tab labels are short, while `aria-label` keeps the full names.

### Decision 10.3: Shared UI Toolkit (`ui.js`) Instead of a Framework
* **Decision:** Keep vanilla classic scripts (ADR 1.2/1.3 still hold) but centralise the cross-cutting pieces: escaping/URL safety, locale-aware formatting, a dialog manager (focus trap, `inert` page, Esc, focus restore), one viewport-clamped tooltip controller for `[data-tip]`, `aria-live` toasts, OKLab colour ramps and chart helpers.
* **Rationale:** a blocking `alert()`, an ad-hoc toast, buttons that swap their own label for feedback, CSS-only tooltips that scroll containers can clip and keyboards cannot reach, and the Parity tab's modals (which used classes that had no CSS and rendered permanently inline) were all symptoms of missing shared infrastructure.

### Decision 10.4: Render Instantly, Hydrate Later, Compute Lazily
* **Decision:** `app.js` renders every view from the bundled `data-store.js`, then fetches the REST API in the background and re-renders only if the payload differs. Heavy API calls (overlap audit, Curvo backtest, risk-parity analytics) run the first time their tab is shown, and in-flight refreshes keep the previous render dimmed instead of flashing a placeholder. View state (filters, scenario inputs, allocations) survives a data refresh.
* **Honest degradation:** risk-parity analytics have no client-side port (ADR 1.1 parity does not extend to them). When the server is unreachable the section says so and offers Retry, rather than showing "Calculating…" forever.
* **Data freshness:** the header judges freshness from the newest **quote** timestamp (not the sync time, which can be newer than the quotes it stored) and states the age plainly.

### Decision 10.5: Chart Rules
* Charts follow the data-viz method: single-hue sequential ramps for magnitude (the correlation heatmap — darkness/brightness = redundancy, self-correlation dimmed), a fixed validated categorical order for series, solid hairline grids, 2px lines, surface rings on markers, crosshair + single tooltip for time series, ≥24px hit targets for scatter points, and a **Table** twin for every chart.
* **Corrected on the way:** the "risk decomposition" chart now plots the *current* portfolio's risk contribution `wᵢ(Σw)ᵢ / wᵀΣw` from the API's covariance matrix (a 60/40 VWCE/AGGU portfolio shows 91.4% of risk in equities); it previously plotted the ERC solution's contributions, which are equal by construction. The dendrogram places merges at their true correlation distance, and the Acc-vs-Dist calculator reports Acc's advantage as `Acc/Dist − 1`.

### Decision 10.6: Asset Caching
* **Context:** `SimpleHTTPRequestHandler` sent no cache headers, so after an edit browsers kept using heuristically cached CSS/JS against new HTML (an unstyled page).
* **Decision:** the server sends `Cache-Control: no-cache` for non-API responses (cheap `304`s via `Last-Modified`), and `index.html` versions its stylesheet and script URLs with `?v=`. Bump the version when shipping frontend changes.

