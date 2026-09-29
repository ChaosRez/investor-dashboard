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
