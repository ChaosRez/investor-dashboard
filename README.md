# ApexETF - Personal Investment Dashboard for ETFs

A comprehensive personal investment dashboard for retail investors, prioritizing **Accumulating (Acc) UCITS ETFs**, **Total Cost of Ownership (TER + Tracking Difference)**, **Tax Domicile Alpha (Ireland vs Luxembourg vs US)**, **Correlation & Overlap Auditing**, and **Market News with Signal Classification**.

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
| **Execution Quality & ESG** | [Trackinsight.com](https://www.trackinsight.com) | Liquidity tier ratings, average bid-ask spreads, tracking error volatility |
| **Final Statutory Verification** | Official Issuers | Direct links to PRIIPs Key Information Documents (KIDs), monthly PDF Factsheets, and WKN/ISIN identifiers |
| **Retail Investment Education** | [Bogleheads Wiki](https://www.bogleheads.org/wiki/EU_investing) | 3-Fund UCITS model, Accumulating compounding alpha, Domicile tax treaty benefits, rebalancing rules |

---

## 🚀 How to Run & Access the Dashboard

### Option A: Local Server (Recommended)
The Python API and web server is running locally on port **8080**:
```bash
# Start server (if not already running)
python3 server.py
```
Open your browser and navigate to:
👉 **[http://localhost:8080](http://localhost:8080)**

### Option B: Direct Browser Access (Offline / Standalone)
The dashboard features an integrated in-memory data store (`public/js/data-store.js`) and clientside computational fallback. You can open it directly from disk:
👉 **[./public/index.html](./public/index.html)**

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
* Direct link to Portfolio Visualizer for multi-factor regression analysis.

### 5. 📰 Market Intelligence & ETF Signal Radar
* Real-world financial and macroeconomic developments (Central Bank policy, Big Tech AI capex run-rates, Chinese liquidity facilities, sovereign debt term premiums, European competitiveness, semiconductor export controls).
* **Signal Level Classification**:
  - 🟢 **Bullish** | 🟡 **Watch / Neutral** | 🔴 **Bearish / Caution**
  - ⚡ **High Impact (Critical)** | ⚖️ **Moderate Impact** | ℹ️ **Low Impact**
  - **Timeframe**: Tactical (1–3 Months) vs Strategic (1–5 Years)
* **Direct ETF Mapping**: Shows exactly which ETFs are affected and the economic transmission mechanism.
* **🛡️ Retail Boglehead Action**: Disciplined retail advice to prevent emotional trading, stay the course, and maintain automated DCA.

### 6. 📑 Official Issuer Documents & Final Verification Hub
* Comprehensive verification directory with one-click **ISIN Copy** buttons.
* Direct links to official **PRIIPs Key Information Documents (KIDs)**, **Monthly Factsheets**, and **Annual Reports** directly from Vanguard, BlackRock / iShares, and Amundi.

### 7. 🎓 Bogleheads Wiki & Tax Academy
* **Interactive Compounding Drag Calculator**: Calculate the exact wealth loss of holding Distributing (Dist) vs Accumulating (Acc) ETFs over 10 to 40 years based on local dividend tax rates (e.g. 26.375% German Abgeltungsteuer or 30% Belgian WHT).
* **Domicile Deep-Dive**: Explains why **Ireland (IE)** is the gold standard for non-US investors (15% US treaty rate, 0% Irish WHT, and complete shielding from the 40% US Estate Tax trap on US-domiciled ETFs like VOO or VTI).
* **Morningstar Style Box Framework**: Guide to Large Blend, Large Growth, and Small Value factor tilts.

---

## 🛠️ Project Structure

```
├── README.md                      # Documentation & methodology guide
├── server.py                      # Python 3 HTTP Server & API endpoints
├── build_etf_data.py              # Script to build verified etfs.json
├── build_supporting_data.py       # Script to build correlations, news, education
├── build_js_store.py              # Bundler for zero-dependency standalone mode
└── public/
    ├── index.html                 # Main dashboard UI
    ├── css/
    │   └── styles.css             # Responsive theme styling (Dark/Light mode)
    ├── data/
    │   ├── etfs.json              # Verified ETF dataset
    │   ├── correlations.json      # Correlation matrix dataset
    │   ├── news.json              # Market news with signal classification
    │   └── education.json         # Bogleheads and tax documentation
    └── js/
        ├── app.js                 # Global application controller & router
        ├── data-store.js          # In-memory verified dataset store
        ├── screener.js            # ETF screener & multi-factor scoring
        ├── overlap-correlation.js # Correlation heatmap & redundancy auditor
        ├── curvo-engine.js        # Curvo backtest & DCA simulator
        ├── pv-engine.js           # Portfolio Visualizer quant risk & frontier
        ├── news-signals.js        # News radar & signal level classification
        ├── verification-docs.js   # Official issuer KIDs & Factsheets hub
        └── bogleheads-academy.js  # Tax academy & compounding drag calculator
```
