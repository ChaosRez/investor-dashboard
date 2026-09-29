/**
 * Portfolio Visualizer Quantitative Analytics Engine
 * Deep quantitative analysis: Sortino Ratio, Calmar Ratio, VaR 95%,
 * Efficient Frontier visualization (Risk vs Return tradeoff), and Factor Tilts.
 */

window.PortfolioVisualizerModule = (function () {
  let allEtfs = [];

  function init(etfs) {
    allEtfs = etfs || [];
    renderDashboard();
  }

  function renderDashboard() {
    const container = document.getElementById("portfolio-visualizer-container");
    if (!container) return;

    // Build comparison table of all ETFs with quantitative metrics
    const rowsHtml = allEtfs.map(etf => {
      const q = etf.quantitativeStatsPV || {};
      const c = etf.historicalStatsCurvo || {};
      const m = etf.morningstar || {};

      return `
        <tr>
          <td>
            <strong style="color: var(--accent-cyan); font-size: 0.95rem;">${etf.ticker}</strong>
            <div style="font-size: 0.74rem; color: var(--text-muted);">${etf.benchmarkIndex}</div>
          </td>
          <td><span class="badge badge-blue">${m.styleBox || "Large Blend"}</span></td>
          <td><strong>${c.cagr}%</strong></td>
          <td>${c.stdev}%</td>
          <td><strong style="color: var(--accent-emerald);">${c.sharpe}</strong></td>
          <td><strong style="color: var(--accent-cyan);">${q.sortino || "N/A"}</strong></td>
          <td>${q.calmar || "N/A"}</td>
          <td><span class="val-negative">${q.var95 || "N/A"}%</span></td>
          <td>${q.marketBeta || "1.00"}</td>
          <td>
            <a href="${q.pvUrl || "https://www.portfoliovisualizer.com"}" target="_blank" class="btn btn-secondary btn-sm">
              📊 PV Model
            </a>
          </td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">🧮 Advanced Quantitative Analytics (Portfolio Visualizer Model)</h3>
            <span class="card-subtitle">Downside deviation, Sortino, Tail Risk (VaR 95%), and Factor Sensitivity</span>
          </div>
          <a href="https://www.portfoliovisualizer.com/backtest-portfolio" target="_blank" class="btn btn-secondary btn-sm">
            🔗 Open PortfolioVisualizer.com
          </a>
        </div>

        <!-- Metric Definitions Callout -->
        <div class="grid-3" style="margin-bottom: 20px;">
          <div class="metric-box">
            <span class="metric-label">Sortino vs Sharpe</span>
            <span style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin-top: 4px;">
              Sharpe penalizes upside volatility. <strong>Sortino only penalizes downside losses</strong>, making it the preferred metric for long-term equity investors who welcome positive upside swings.
            </span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Value at Risk (VaR 95%)</span>
            <span style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin-top: 4px;">
              The maximum expected monthly loss at a 95% confidence level. Shows tail-risk severity during sudden liquidity contractions and flash crashes.
            </span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Calmar Ratio</span>
            <span style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin-top: 4px;">
              Ratio of annualized CAGR to Maximum Drawdown. Highlights capital recovery velocity after bear market capitulation events.
            </span>
          </div>
        </div>

        <!-- Efficient Frontier Visualization -->
        <div class="card" style="background: var(--bg-secondary);">
          <div class="card-header">
            <div>
              <h4 class="card-title">📉 Markowitz Efficient Frontier (Risk vs Return)</h4>
              <span class="card-subtitle">Optimal asset allocation: Maximum Sharpe Ratio vs Minimum Variance</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              X-Axis: Annualized Volatility (%) | Y-Axis: Expected CAGR (%)
            </div>
          </div>
          <div id="efficient-frontier-chart" class="chart-container" style="height: 280px;">
            <!-- Rendered via SVG -->
          </div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-top: 12px;">
            💡 <strong>Bogleheads Mathematical Takeaway:</strong> Notice how adding 10%–20% AGGU (Global Aggregate Bonds) shifts the portfolio leftward along the curve (reducing portfolio volatility from 15.1% to 12.4%) with only a marginal reduction in return. This is the classic <em>free lunch of asset class diversification</em> formalized by Harry Markowitz.
          </div>
        </div>

        <!-- Quantitative Comparison Table -->
        <h4 class="card-title" style="margin-top: 24px; margin-bottom: 12px;">Fund-by-Fund Quantitative Scorecard</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ticker & Benchmark</th>
                <th>Style Box</th>
                <th>CAGR</th>
                <th>StDev (Risk)</th>
                <th>Sharpe</th>
                <th>Sortino (Downside)</th>
                <th>Calmar</th>
                <th>VaR 95% (Monthly)</th>
                <th>Beta</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;

    renderSvgEfficientFrontier();
  }

  function renderSvgEfficientFrontier() {
    const container = document.getElementById("efficient-frontier-chart");
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = 280;
    const padding = { top: 20, right: 40, bottom: 40, left: 60 };

    // Points on the frontier curve (Volatility X, CAGR Y, Label)
    const points = [
      { ticker: "AGGU (100% Bond)", x: 5.82, y: 3.41, type: "asset" },
      { ticker: "Min Volatility (80 Bond / 20 Eq)", x: 6.20, y: 4.65, type: "optimal" },
      { ticker: "Balanced 60/40", x: 9.80, y: 7.15, type: "portfolio" },
      { ticker: "Max Sharpe (80 Eq / 20 Bond)", x: 12.40, y: 8.40, type: "tangency" },
      { ticker: "VWCE (100% World)", x: 15.12, y: 9.64, type: "asset" },
      { ticker: "IWDA (MSCI World)", x: 14.70, y: 8.19, type: "asset" },
      { ticker: "SXR8 (S&P 500)", x: 15.18, y: 11.13, type: "asset" },
      { ticker: "IUSN (Small Cap)", x: 17.82, y: 8.94, type: "asset" },
      { ticker: "EIMI (Emerging Mkt)", x: 20.16, y: 5.75, type: "asset" },
      { ticker: "QDVE (Tech Sector)", x: 20.84, y: 19.82, type: "asset" }
    ];

    const minX = 4, maxX = 24;
    const minY = 2, maxY = 22;

    const xScale = (v) => padding.left + ((v - minX) / (maxX - minX)) * (width - padding.left - padding.right);
    const yScale = (r) => height - padding.bottom - ((r - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);

    // Draw curve connecting frontier
    const frontierPoints = [
      points[0], points[1], points[2], points[3], points[4], points[6], points[9]
    ];
    const curvePath = frontierPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x)} ${yScale(p.y)}`).join(" ");

    // Grid lines
    let gridHtml = "";
    for (let r = 5; r <= 20; r += 5) {
      const y = yScale(r);
      gridHtml += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="chart-grid-line" />
        <text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${r}%</text>
      `;
    }

    for (let v = 5; v <= 20; v += 5) {
      const x = xScale(v);
      gridHtml += `
        <line x1="${x}" y1="${height - padding.bottom}" x2="${x}" y2="${padding.top}" class="chart-grid-line" />
        <text x="${x}" y="${height - padding.bottom + 18}" text-anchor="middle" class="chart-axis-text">${v}% Vol</text>
      `;
    }

    // Points circles and labels
    const pointsHtml = points.map(p => {
      const cx = xScale(p.x);
      const cy = yScale(p.y);
      let fill = "var(--accent-blue)";
      let r = 5;
      if (p.type === "tangency") { fill = "var(--accent-emerald)"; r = 7; }
      else if (p.type === "optimal") { fill = "var(--accent-cyan)"; r = 6; }
      else if (p.ticker.includes("QDVE")) { fill = "var(--accent-purple)"; }
      else if (p.ticker.includes("AGGU")) { fill = "var(--accent-amber)"; }

      return `
        <g>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#fff" stroke-width="1.5" />
          <text x="${cx + 8}" y="${cy + 4}" font-size="10.5" font-weight="700" fill="var(--text-primary)">
            ${p.ticker}
          </text>
        </g>
      `;
    }).join("");

    container.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
        ${gridHtml}
        <!-- Frontier Curve Line -->
        <path d="${curvePath}" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-dasharray="3, 3" />
        <!-- Asset & Portfolio Points -->
        ${pointsHtml}
      </svg>
    `;
  }

  return {
    init
  };
})();
