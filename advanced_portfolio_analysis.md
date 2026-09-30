When evaluating ETFs in an unpredictable macro environment, you need tools that prioritize **drawdown risk, regime resilience, and non-linear risk parity** rather than basic mean-variance optimization.

Here are the best open-source libraries and interactive tools, categorized by how you prefer to work:

---

### 1. Python Libraries (For Robust Optimization & Stress-Testing)

#### [PyPortfolioOpt](https://github.com/PyPortfolio/PyPortfolioOpt) (Most Practical Open-Source Quant Library)

While it supports classic Markowitz, its real value lies in robust alternatives that don't rely on fragile expected return forecasts:

* **Hierarchical Risk Parity (HRP):** Uses machine-learning graph clustering (dendrograms) to group correlated assets without inverting a covariance matrix. It is inherently more stable during market regime changes.
* **Mean-CVaR (Conditional Value-at-Risk):** Optimizes to minimize expected tail loss during black swan events instead of penalizing upside volatility.
* **Covariance Shrinkage (Ledoit-Wolf):** Cleans noisy historical price data to prevent extreme weight allocations.

```python
from pypopt.hierarchical_portfolio import HRPOpt
# Calculates risk-parity weights using clustering rather than MPT
hrp = HRPOpt(returns)
weights = hrp.optimize()

```

#### [Riskfolio-Lib](https://github.com/dcajasn/Riskfolio-Lib) (The Gold Standard for Tail-Risk & Parity)

If you want to move beyond standard volatility, `Riskfolio-Lib` is the most comprehensive open-source portfolio optimization library available.

* Supports **24+ risk measures**, including Worst Realization (Minimax), Conditional Drawdown at Risk (CDaR), Sortino, and Ulcer Index.
* Native implementations of **Equal Risk Contribution (Risk Parity)** and **Nested Clustered Optimization (NCO)**.
* Allows you to optimize portfolios under fat-tailed Student-t distributions rather than naive Gaussian assumptions.

#### [QuantStats](https://github.com/ranaroussi/quantstats) (Portfolio Teardown & Stress-Testing)

Built specifically to evaluate how an ETF portfolio would have behaved across actual historical shocks:

* Generates comprehensive tear-sheets comparing metrics like CAGR, Sharpe, Sortino, Tail Ratio, and Value-at-Risk (VaR).
* **Specific Crisis Analysis:** Automatically breaks down your portfolio's performance during specific historical crises (e.g., 2008 Lehman collapse, 2020 COVID shock, 2022 Fed rate-hiking cycle, dot-com crash).

---

### 2. No-Code Web Platforms (For Direct ETF Analysis)

If you don't want to code in Python, several battle-tested platforms let you model non-deterministic scenarios directly:

| Tool | Type | Key Strength for Uncertain Regimes | Best Used For |
| --- | --- | --- | --- |
| **[Portfolio Visualizer](https://www.portfoliovisualizer.com/)** | Web Application | Built-in Risk Parity, factor regression (Fama-French), and historical stress periods. | Comparing 60/40 vs All-Weather vs Managed Futures allocations across rate cycles. |
| **[Testfol.io](https://testfol.io/)** | Web Application (Free) | Exceptional backtesting engine with custom leverage, simulated cash drag, and long synthetic histories. | Testing barbell strategies (e.g., T-Bills + Trend + Equity tilts) over multi-decade cycles. |
| **[Portfolio Charts](https://portfoliocharts.com/)** | Web Application (Free/Pro) | Focuses entirely on **drawdown survival, recovery times, and safe withdrawal rates** across all historic regimes. | Evaluating robust, all-weather style portfolios without mathematical optimization traps. |

---

### Recommended Workflow for Decision Making

1. **Pick structural building blocks:** Don't let an optimizer pick your assets. Manually select assets representing distinct economic regimes (e.g., broad equity, quality tilt, short T-bills, real commodities/gold, managed futures).
2. **Size positions with HRP or Risk Parity:** Use `Riskfolio-Lib` or `Portfolio Visualizer`'s Risk Parity module to size weights by volatility contribution rather than subjective return guesses.
3. **Stress-test the downside:** Run the allocation through `QuantStats` or `Testfol.io` specifically examining **2000–2002** (tech bust), **2008** (liquidity crash), and **2022** (stagflation shock). If the drawdown exceeds your behavioral tolerance, increase your short Treasury / liquidity allocation.
