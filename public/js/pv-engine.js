/**
 * Portfolio Visualizer Quantitative Analytics Engine
 * Deep quantitative analysis: Sortino Ratio, Calmar Ratio, VaR 95%,
 * Efficient Frontier visualization (Risk vs Return tradeoff), and Factor Tilts.
 *
 * Chart: scatter of single ETFs (series 1) and blended portfolios (series 2) with a
 * neutral frontier path. Every point has a ≥24px focusable hit target + tooltip, and
 * the table view carries the same numbers.
 */

window.PortfolioVisualizerModule = (function () {
  const { esc, icon, fmt } = UI;

  let allEtfs = [];

  // Illustrative frontier points (volatility %, expected CAGR %). Kept as originally
  // authored; `short` is the on-chart label, `name` appears in tooltips and the table.
  const FRONTIER_POINTS = [
    { name: "AGGU (100% Bond)", short: "AGGU", x: 5.82, y: 3.41, kind: "etf" },
    { name: "Min Volatility (80 Bond / 20 Eq)", short: "Min vol 80/20", x: 6.2, y: 4.65, kind: "blend", side: "left" },
    { name: "Balanced 60/40", short: "Balanced 60/40", x: 9.8, y: 7.15, kind: "blend", side: "left" },
    { name: "Max Sharpe (80 Eq / 20 Bond)", short: "Max Sharpe 80/20", x: 12.4, y: 8.4, kind: "blend", side: "left" },
    { name: "VWCE (100% World)", short: "VWCE", x: 15.12, y: 9.64, kind: "etf" },
    { name: "IWDA (MSCI World)", short: "IWDA", x: 14.7, y: 8.19, kind: "etf", side: "left" },
    { name: "SXR8 (S&P 500)", short: "SXR8", x: 15.18, y: 11.13, kind: "etf" },
    { name: "IUSN (Small Cap)", short: "IUSN", x: 17.82, y: 8.94, kind: "etf" },
    { name: "EIMI (Emerging Mkt)", short: "EIMI", x: 20.16, y: 5.75, kind: "etf" },
    { name: "QDVE (Tech Sector)", short: "QDVE", x: 20.84, y: 19.82, kind: "etf", side: "left" },
  ];
  const FRONTIER_PATH = ["AGGU", "Min vol 80/20", "Balanced 60/40", "Max Sharpe 80/20", "VWCE", "SXR8", "QDVE"];
  const KIND = {
    etf: { label: "Single ETFs", color: "var(--series-1)" },
    blend: { label: "Blended portfolios (VWCE + AGGU)", color: "var(--series-2)" },
  };

  /* ------------------------------------------------------------- lifecycle */
  function init(etfs) {
    allEtfs = etfs || [];
    renderDashboard();
  }

  function renderDashboard() {
    const container = document.getElementById("portfolio-visualizer-container");
    if (!container) return;

    const rowsHtml = allEtfs
      .map((etf) => {
        const q = etf.quantitativeStatsPV || {};
        const c = etf.historicalStatsCurvo || {};
        const m = etf.morningstar || {};
        return `
          <tr>
            <th scope="row" class="pv-fund">
              <div class="cluster">
                <span class="ticker">${esc(etf.ticker)}</span>
                ${window.ProviderLogos?.getLogoSvg(etf.issuer, 18, { label: false }) || ""}
              </div>
              <div class="text-muted text-xs">${esc(etf.benchmarkIndex)}</div>
            </th>
            <td><span class="badge badge-blue">${esc(m.styleBox || "Large Blend")}</span></td>
            <td class="num">${c.cagr != null ? esc(fmt.pct(c.cagr, 2)) : "—"}</td>
            <td class="num">${c.stdev != null ? esc(fmt.pct(c.stdev, 2)) : "—"}</td>
            <td class="num">${esc(fmt.num(c.sharpe, 2))}</td>
            <td class="num">${esc(fmt.num(q.sortino, 2))}</td>
            <td class="num">${esc(fmt.num(q.calmar, 2))}</td>
            <td class="num val-negative">${q.var95 != null ? esc(fmt.pct(q.var95, 2)) : "—"}</td>
            <td class="num">${esc(fmt.num(q.marketBeta ?? 1, 2))}</td>
            <td class="num">${UI.link(q.pvUrl || "https://www.portfoliovisualizer.com", `${icon("external")} PV model`, { cls: "btn btn-secondary btn-sm", html: true })}</td>
          </tr>`;
      })
      .join("");

    const legend =
      Object.values(KIND)
        .map((k) => `<span class="legend-item" role="listitem"><span class="legend-key is-dot" style="--c:${k.color}"></span>${esc(k.label)}</span>`)
        .join("") +
      `<span class="legend-item" role="listitem"><span class="legend-key" style="--c:var(--chart-axis)"></span>Efficient frontier path</span>`;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="cluster">
              <h2 class="card-title">${icon("activity")} Advanced quantitative analytics <span class="text-muted text-sm fw-600">(Portfolio Visualizer model)</span></h2>
              <span class="stage-status-badge badge-optional">Stage 5 · Optional / advanced</span>
            </div>
            <span class="card-subtitle">Downside deviation, Sortino, tail risk (VaR 95%) and factor sensitivity</span>
          </div>
          ${UI.link("https://www.portfoliovisualizer.com/backtest-portfolio", `${icon("external")} Open PortfolioVisualizer.com`, { cls: "btn btn-secondary btn-sm", html: true })}
        </div>

        <div class="grid-3 mb-5">
          <div class="metric-box">
            <span class="metric-label">Sortino vs Sharpe</span>
            <span class="text-secondary text-sm">Sharpe penalises upside volatility. <strong>Sortino only penalises downside losses</strong>, making it the preferred metric for long-term equity investors who welcome positive upside swings.</span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Value at risk (VaR 95%)</span>
            <span class="text-secondary text-sm">The maximum expected monthly loss at a 95% confidence level. Shows tail-risk severity during sudden liquidity contractions and flash crashes.</span>
          </div>
          <div class="metric-box">
            <span class="metric-label">Calmar ratio</span>
            <span class="text-secondary text-sm">Ratio of annualised CAGR to maximum drawdown. Highlights capital recovery velocity after bear-market capitulation events.</span>
          </div>
        </div>

        <div class="panel mb-5">
          ${UI.chart.frameHtml({
            title: "Markowitz efficient frontier (risk vs return)",
            subtitle: "Optimal asset allocation along the curve · x: annualised volatility (%) · y: expected CAGR (%)",
            legend,
            plotStyle: "height:340px",
          })}
          <div class="callout callout-info mt-4">
            ${icon("info")}
            <div><strong>Bogleheads mathematical takeaway:</strong> adding 10%–20% AGGU (global aggregate bonds) shifts the portfolio leftward along the curve — reducing volatility from 15.1% to 12.4% — with only a marginal reduction in return. This is the classic <em>free lunch of asset-class diversification</em> formalised by Harry Markowitz.</div>
          </div>
        </div>

        <h3 class="card-title mb-3">Fund-by-fund quantitative scorecard</h3>
        <div class="table-responsive">
          <table class="data-table">
            <caption class="sr-only">Quantitative scorecard for every tracked ETF</caption>
            <thead>
              <tr>
                <th scope="col">Ticker &amp; benchmark</th>
                <th scope="col">Style box <span class="info-tip" data-tip="Morningstar 3x3 classification of market-cap size and value/blend/growth style.">?</span></th>
                <th scope="col" class="num">CAGR</th>
                <th scope="col" class="num">StDev (risk)</th>
                <th scope="col" class="num">Sharpe</th>
                <th scope="col" class="num">Sortino <span class="info-tip" data-tip="Penalises only negative volatility. Preferred for long-term equity investors who welcome upside swings.">?</span></th>
                <th scope="col" class="num">Calmar <span class="info-tip" data-tip="Annualised CAGR divided by maximum historical drawdown. Measures crash-recovery efficiency.">?</span></th>
                <th scope="col" class="num">VaR 95% (monthly) <span class="info-tip" data-tip="Worst expected monthly loss at 95% confidence under normal market distribution tails.">?</span></th>
                <th scope="col" class="num">Beta <span class="info-tip" data-tip="Sensitivity vs the global market index (1.00 = market; below 1.00 = defensive).">?</span></th>
                <th scope="col"><span class="sr-only">Link</span></th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>`;

    const frame = container.querySelector("[data-chart-frame]");
    UI.chart.wireFrame(frame);
    const tableHost = frame.querySelector('[data-view-panel="table"]');
    tableHost.appendChild(
      UI.chart.dataTable({
        caption: "Efficient frontier points",
        columns: [
          { key: "name", label: "Point" },
          { key: "kindLabel", label: "Type" },
          { key: "x", label: "Volatility", align: "right", format: (v) => fmt.pct(v, 2) },
          { key: "y", label: "Expected CAGR", align: "right", format: (v) => fmt.pct(v, 2) },
        ],
        rows: FRONTIER_POINTS.map((p) => ({ ...p, kindLabel: KIND[p.kind].label })),
      })
    );
    drawFrontier(frame.querySelector('[data-view-panel="chart"]'));
  }

  /* ----------------------------------------------------------------- chart */
  function drawFrontier(host) {
    if (!host) return;
    const tooltip = UI.chart.tooltip(host);

    UI.chart.mountResponsive(host, (width) => {
      const height = host.clientHeight || 340;
      const compact = width < 560;
      const pad = { top: 16, right: compact ? 16 : 28, bottom: 44, left: 48 };
      const plotW = width - pad.left - pad.right;
      const plotH = height - pad.top - pad.bottom;

      const xs = FRONTIER_POINTS.map((p) => p.x);
      const ys = FRONTIER_POINTS.map((p) => p.y);
      const sx = UI.chart.niceScale(Math.min(...xs) - 1, Math.max(...xs) + 1, 6);
      const sy = UI.chart.niceScale(Math.min(...ys) - 1, Math.max(...ys) + 1, 6);
      const X = (v) => pad.left + ((v - sx.min) / (sx.max - sx.min)) * plotW;
      const Y = (v) => pad.top + plotH - ((v - sy.min) / (sy.max - sy.min)) * plotH;

      const grid =
        sy.ticks.map((t) => `<line class="chart-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${Y(t)}" y2="${Y(t)}"></line>
                             <text class="chart-axis-text" x="${pad.left - 8}" y="${Y(t) + 4}" text-anchor="end">${esc(fmt.num(t, 0))}%</text>`).join("") +
        sx.ticks.map((t) => `<line class="chart-grid-line" x1="${X(t)}" x2="${X(t)}" y1="${pad.top}" y2="${pad.top + plotH}"></line>
                             <text class="chart-axis-text" x="${X(t)}" y="${pad.top + plotH + 16}" text-anchor="middle">${esc(fmt.num(t, 0))}%</text>`).join("");

      const byShort = Object.fromEntries(FRONTIER_POINTS.map((p) => [p.short, p]));
      const path = FRONTIER_PATH.map((s, i) => `${i === 0 ? "M" : "L"}${X(byShort[s].x).toFixed(1)} ${Y(byShort[s].y).toFixed(1)}`).join(" ");

      // Labels: right of the dot by default, left where flagged or near the edge; nudge to avoid overlap
      const placed = [];
      const labels = FRONTIER_POINTS.map((p) => {
        if (compact && p.kind !== "blend") return "";
        const text = p.short;
        const w = text.length * 6.4 + 4;
        let side = p.side || "right";
        if (side === "right" && X(p.x) + 10 + w > width - 4) side = "left";
        const lx = side === "right" ? X(p.x) + 10 : X(p.x) - 10;
        let ly = Y(p.y) + 4;
        const box = () => ({ x0: side === "right" ? lx : lx - w, x1: side === "right" ? lx + w : lx, y0: ly - 11, y1: ly + 3 });
        let tries = 0;
        while (tries++ < 6 && placed.some((b) => !(box().x1 < b.x0 || box().x0 > b.x1 || box().y1 < b.y0 || box().y0 > b.y1))) ly += 13;
        placed.push(box());
        return `<text class="chart-label" x="${lx}" y="${ly}" text-anchor="${side === "right" ? "start" : "end"}">${esc(text)}</text>`;
      }).join("");

      const dots = FRONTIER_POINTS.map((p, i) => {
        const k = KIND[p.kind];
        return `<g class="fp" data-i="${i}" tabindex="0" role="img"
                   aria-label="${esc(p.name)}: volatility ${esc(fmt.pct(p.x, 2))}, expected CAGR ${esc(fmt.pct(p.y, 2))}">
                  <circle class="fp-hit" cx="${X(p.x)}" cy="${Y(p.y)}" r="14" fill="transparent"></circle>
                  <circle class="fp-dot" cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.kind === "blend" ? 6 : 5}" fill="${k.color}" stroke="var(--chart-surface)" stroke-width="2"></circle>
                </g>`;
      }).join("");

      host.querySelector("svg")?.remove();
      host.insertAdjacentHTML("afterbegin", `
        <svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="group" aria-label="Efficient frontier scatter chart. Use Tab to move between points, or open the table view.">
          ${grid}
          <line class="chart-axis-line" x1="${pad.left}" x2="${width - pad.right}" y1="${pad.top + plotH}" y2="${pad.top + plotH}"></line>
          <line class="chart-axis-line" x1="${pad.left}" x2="${pad.left}" y1="${pad.top}" y2="${pad.top + plotH}"></line>
          <text class="chart-axis-text" x="${pad.left + plotW / 2}" y="${height - 6}" text-anchor="middle">Annualised volatility (%)</text>
          <text class="chart-axis-text" transform="translate(12 ${pad.top + plotH / 2}) rotate(-90)" text-anchor="middle">Expected CAGR (%)</text>
          <path d="${path}" fill="none" stroke="var(--chart-axis)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          ${labels}
          ${dots}
        </svg>`);

      host.querySelectorAll(".fp").forEach((g) => {
        const p = FRONTIER_POINTS[Number(g.dataset.i)];
        const show = () => {
          const k = KIND[p.kind];
          tooltip.show({
            x: X(p.x),
            y: Y(p.y),
            title: p.name,
            rows: [
              { dot: true, color: k.color, value: fmt.pct(p.y, 2), label: "expected CAGR" },
              { dot: true, color: k.color, value: fmt.pct(p.x, 2), label: "volatility" },
            ],
          });
        };
        g.addEventListener("pointerenter", show);
        g.addEventListener("pointerleave", () => tooltip.hide());
        g.addEventListener("focus", show);
        g.addEventListener("blur", () => tooltip.hide());
      });
    });
  }

  return { init };
})();
