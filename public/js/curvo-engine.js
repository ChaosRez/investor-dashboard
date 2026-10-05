/**
 * Curvo Historical Portfolio Analysis Engine
 * Real historical metrics (CAGR, Sharpe, StDev, Max Drawdowns, Recovery times)
 * Interactive Dollar-Cost-Averaging (DCA) and inflation-adjusted growth simulator
 * Supports both API mode and clientside calculation mode.
 *
 * Chart: responsive SVG line chart — solid hairline grid, 2px lines, end dots with a
 * surface ring, crosshair + one tooltip listing every series, keyboard arrows, and a
 * Chart/Table toggle (the table is the accessible twin).
 */

window.CurvoModule = (function () {
  const { esc, icon, fmt } = UI;

  let allEtfs = [];
  let etfsByTicker = {};
  let runId = 0;

  const presetPortfolios = {
    "vwce-chill": {
      name: "Single-Fund 'VWCE and Chill'",
      description: "100% Vanguard FTSE All-World (USD) Acc. The gold-standard Bogleheads simplicity model.",
      holdings: { VWCE: 100 },
    },
    "iwda-eimi": {
      name: "Classic Core 88/12 (Developed + Emerging)",
      description: "88% iShares Core MSCI World + 12% iShares Core MSCI EM IMI. Complete global stock ownership with custom rebalancing.",
      holdings: { IWDA: 88, EIMI: 12 },
    },
    "bogleheads-80-20": {
      name: "Bogleheads 80/20 (Global Equity + Bond Shield)",
      description: "80% VWCE + 20% AGGU (EUR Hedged). Non-correlated fixed income cuts drawdown while preserving long-term equity compounding.",
      holdings: { VWCE: 80, AGGU: 20 },
    },
    "world-small-cap": {
      name: "Global All-Cap (Large + Mid + Small)",
      description: "80% VWCE + 20% IUSN (MSCI World Small Cap). Captures the academic Fama-French small-cap size premium.",
      holdings: { VWCE: 80, IUSN: 20 },
    },
    "us-tech-tilt": {
      name: "US Core + Tech Momentum Tilt",
      description: "70% SXR8 (S&P 500) + 30% QDVE (S&P 500 Tech). High historical return with elevated cyclical volatility.",
      holdings: { SXR8: 70, QDVE: 30 },
    },
  };

  const SERIES = [
    { key: "totalDeposits", label: "Total deposits", short: "Deposits", color: "var(--series-muted)" },
    { key: "portfolioReal", label: "Real (inflation-adjusted)", short: "Real", color: "var(--series-2)" },
    { key: "portfolioNominal", label: "Nominal portfolio", short: "Nominal", color: "var(--series-1)" },
  ];

  // State survives re-render so a data refresh never resets the user's scenario
  let activePreset = "vwce-chill";
  let activeHoldings = { ...presetPortfolios["vwce-chill"].holdings };
  const params = { initialAmount: 10000, monthlyDca: 500, years: 20, inflationRate: 2.2 };

  const clamp = (v, lo, hi, fallback) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
  };

  /* ------------------------------------------------------------- lifecycle */
  function init(etfs) {
    allEtfs = etfs || [];
    etfsByTicker = {};
    allEtfs.forEach((e) => { etfsByTicker[e.ticker.toUpperCase()] = e; });
    renderInterface();
    UI.whenTabActive("curvo", () => runSimulation(), "sim"); // no API call until the tab is shown
  }

  function renderInterface() {
    const container = document.getElementById("curvo-backtest-container");
    if (!container) return;

    const presetsHtml = Object.entries(presetPortfolios)
      .map(([key, p]) => `
        <button type="button" class="preset-card preset-btn${key === activePreset ? " active" : ""}" data-preset="${key}" aria-pressed="${key === activePreset}" data-tip="${esc(p.description)}">
          <span class="preset-card-title">${esc(p.name)}</span>
          <span class="preset-card-desc">${Object.entries(p.holdings).map(([t, w]) => `${esc(t)} ${esc(w)}%`).join(" · ")}</span>
        </button>`)
      .join("");

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="cluster">
              <h2 class="card-title">${icon("trending-up")} Backtest &amp; DCA plan</h2>
              <span class="stage-status-badge badge-essential">Stage 3 · Planning phase</span>
            </div>
            <span class="card-subtitle">Your monthly plan on real prices, then projected forward.</span>
          </div>
          <span class="badge badge-acc">UCITS real data</span>
        </div>

        <h3 class="section-label">Choose a portfolio blueprint</h3>
        <div class="preset-grid mb-4" role="group" aria-label="Portfolio blueprints">${presetsHtml}</div>

        <form id="curvo-form" class="panel form-grid" novalidate>
          <div class="field">
            <label class="field-label" for="curvo-initial">Initial capital (€)</label>
            <input type="number" id="curvo-initial" class="filter-input" value="${esc(params.initialAmount)}" min="0" step="500" inputmode="decimal" />
          </div>
          <div class="field">
            <label class="field-label" for="curvo-dca">Monthly Sparplan DCA (€)</label>
            <input type="number" id="curvo-dca" class="filter-input" value="${esc(params.monthlyDca)}" min="0" step="50" inputmode="decimal" />
          </div>
          <div class="field">
            <label class="field-label" for="curvo-years">Time horizon (years)</label>
            <input type="number" id="curvo-years" class="filter-input" value="${esc(params.years)}" min="1" max="40" step="1" inputmode="numeric" />
          </div>
          <div class="field">
            <label class="field-label" for="curvo-inflation">Est. annual inflation (%)</label>
            <input type="number" id="curvo-inflation" class="filter-input" value="${esc(params.inflationRate)}" min="0" max="15" step="0.1" inputmode="decimal" />
          </div>
        </form>

        <div class="row-between mt-3">
          <span class="text-muted text-xs">Results update as you type. Allocation: <strong id="curvo-allocation">${esc(allocationLabel())}</strong></span>
          <button type="button" id="curvo-run-btn" class="btn btn-primary">${icon("zap")} Recalculate</button>
        </div>
      </div>

      <div id="curvo-results-container"></div>`;

    container.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activePreset = btn.dataset.preset;
        activeHoldings = { ...presetPortfolios[activePreset].holdings };
        container.querySelectorAll(".preset-btn").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        document.getElementById("curvo-allocation").textContent = allocationLabel();
        runSimulation();
      });
    });

    const debounced = UI.debounce(() => runSimulation(), 350);
    document.getElementById("curvo-form").addEventListener("input", debounced);
    document.getElementById("curvo-form").addEventListener("submit", (e) => { e.preventDefault(); runSimulation(); });
    document.getElementById("curvo-run-btn").addEventListener("click", () => runSimulation());
  }

  const allocationLabel = () =>
    Object.entries(activeHoldings).map(([t, w]) => `${t} ${w}%`).join(" · ");

  function readParams() {
    params.initialAmount = clamp(document.getElementById("curvo-initial")?.value, 0, 1e9, params.initialAmount);
    params.monthlyDca = clamp(document.getElementById("curvo-dca")?.value, 0, 1e7, params.monthlyDca);
    params.years = Math.round(clamp(document.getElementById("curvo-years")?.value, 1, 40, params.years));
    params.inflationRate = clamp(document.getElementById("curvo-inflation")?.value, 0, 15, params.inflationRate);
    return { holdings: activeHoldings, ...params };
  }

  /* ------------------------------------------------------------ simulation */
  async function runSimulation() {
    const body = readParams();
    const results = document.getElementById("curvo-results-container");
    const myRun = ++runId;
    if (results) results.classList.add("is-refreshing"); // keep the frame, dim it

    let data = null;
    try {
      const res = await fetch("/api/portfolio/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) data = await res.json();
    } catch (e) { /* fall through to the clientside engine */ }

    if (myRun !== runId) return; // a newer run superseded this one
    if (!data) data = computeCurvoSimulationClientside(body);
    renderSimulationResults(data);
    if (results) results.classList.remove("is-refreshing");
  }

  function computeCurvoSimulationClientside(params) {
    const weights = params.holdings || { VWCE: 100 };
    const initialAmount = params.initialAmount || 10000;
    const monthlyDca = params.monthlyDca || 500;
    const years = params.years || 20;
    const inflationRate = (params.inflationRate || 2.2) / 100.0;

    const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
    let blendedCagr = 0.0;
    let blendedStdev = 0.0;
    let blendedSharpe = 0.0;
    let blendedSortino = 0.0;
    let blendedMaxDd = 0.0;

    for (let [ticker, w] of Object.entries(weights)) {
      const normW = w / (totalW || 1);
      const etf = etfsByTicker[ticker.toUpperCase()];
      if (!etf) continue;

      const c = etf.historicalStatsCurvo || {};
      const pv = etf.quantitativeStatsPV || {};

      blendedCagr += (c.cagr || 8.0) * normW;
      blendedStdev += (c.stdev || 15.0) * normW;
      blendedSharpe += (c.sharpe || 0.6) * normW;
      blendedSortino += (pv.sortino || 0.9) * normW;
      blendedMaxDd += (c.maxDrawdown || -45.0) * normW;
    }

    const monthlyRate = Math.pow(1 + blendedCagr / 100.0, 1 / 12) - 1;
    const timeline = [];
    let curVal = initialAmount;
    let totalInvested = initialAmount;

    timeline.push({
      year: 0,
      portfolioNominal: curVal,
      portfolioReal: curVal,
      totalDeposits: totalInvested
    });

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        curVal = (curVal + monthlyDca) * (1 + monthlyRate);
        totalInvested += monthlyDca;
      }
      const cumInf = Math.pow(1 + inflationRate, y);
      timeline.push({
        year: y,
        portfolioNominal: Math.round(curVal),
        portfolioReal: Math.round(curVal / cumInf),
        totalDeposits: Math.round(totalInvested)
      });
    }

    return {
      blendedMetrics: {
        cagrPercent: parseFloat(blendedCagr.toFixed(2)),
        annualizedVolatility: parseFloat(blendedStdev.toFixed(2)),
        sharpeRatio: parseFloat(blendedSharpe.toFixed(2)),
        sortinoRatio: parseFloat(blendedSortino.toFixed(2)),
        maxDrawdown: parseFloat(blendedMaxDd.toFixed(1)),
        calmarRatio: parseFloat((Math.abs(blendedCagr / (blendedMaxDd || 1))).toFixed(2))
      },
      simulationSummary: {
        finalNominalValue: Math.round(curVal),
        finalRealValue: Math.round(curVal / Math.pow(1 + inflationRate, years)),
        totalContributions: Math.round(totalInvested),
        compoundWealthCreated: Math.round(curVal - totalInvested),
        returnMultiple: parseFloat((curVal / (totalInvested || 1)).toFixed(2))
      },
      timeline: timeline,
      curvoVerificationUrl: "https://curvo.eu/backtest/en/compare?portfolios=" + encodeURIComponent(
        JSON.stringify([{ funds: Object.entries(weights).map(([t, w]) => ({ isin: etfsByTicker[t]?.isin || "", weight: w })) }])
      )
    };
  }

  /* --------------------------------------------------------------- results */
  function renderSimulationResults(data) {
    const container = document.getElementById("curvo-results-container");
    if (!container || !data) return;

    const m = data.blendedMetrics || {};
    const s = data.simulationSummary || {};
    const timeline = data.timeline || [];

    const legend = SERIES.slice().reverse()
      .map((sr) => `<span class="legend-item" role="listitem"><span class="legend-key" style="--c:${sr.color}"></span>${esc(sr.label)}</span>`)
      .join("");

    const b = data.historicalBacktest;
    const backtestHtml = !b ? `<p class="text-muted text-sm">The backtest with real prices needs the local server.</p>`
      : !b.available ? `<p class="text-muted text-sm">${esc(b.reason || "No price history for this portfolio.")}</p>`
      : `
        <div class="grid-4">
          <div class="metric-box"><span class="metric-label">Deposited</span><span class="metric-value">${esc(fmt.eur(b.deposits))}</span><span class="metric-sub">${esc(b.from)} to ${esc(b.to)}</span></div>
          <div class="metric-box"><span class="metric-label">Worth at the end</span><span class="metric-value val-positive">${esc(fmt.eur(b.finalValue))}</span><span class="metric-sub">${esc(fmt.eur(b.realFinalValue))} after inflation</span></div>
          <div class="metric-box"><span class="metric-label">Return of the mix</span><span class="metric-value">${esc(fmt.pct(b.cagr, 1))} a year</span><span class="metric-sub">volatility ${esc(fmt.pct(b.volatility, 1))}</span></div>
          <div class="metric-box tone-rose"><span class="metric-label">Deepest fall on the way</span><span class="metric-value val-negative">${esc(fmt.pct(b.maxDrawdown, 1))}</span><span class="metric-sub">of the mix, peak to trough</span></div>
        </div>
        ${b.capped ? `<p class="text-muted text-xs mt-2">Price history covers ${esc(fmt.num(b.years, 1))} of the ${esc(b.requestedYears)} years you chose.</p>` : ""}
        <details class="planner-more mt-3"><summary class="text-sm">Year by year</summary>
          <div class="table-responsive mt-2"><table class="data-table"><caption class="sr-only">Backtest values year by year</caption>
            <thead><tr><th scope="col">Date</th><th scope="col" class="num">Deposited</th><th scope="col" class="num">Value</th><th scope="col" class="num">After inflation</th></tr></thead>
            <tbody>${(b.timeline || []).map((r) => `<tr><th scope="row">${esc(r.date)}</th><td class="num">${esc(fmt.eur(r.deposits))}</td><td class="num">${esc(fmt.eur(r.value))}</td><td class="num">${esc(fmt.eur(r.realValue))}</td></tr>`).join("")}</tbody>
          </table></div>
        </details>`;

    container.innerHTML = `
      <div class="card">
        <div class="card-header"><div>
          <h3 class="card-title">With real prices</h3>
          <span class="card-subtitle">What this plan actually returned over the last ${esc(b?.available ? fmt.num(b.years, 1) : params.years)} years. No fees or taxes.</span>
        </div></div>
        ${backtestHtml}
      </div>

      <div class="card">
        <div class="card-header"><div>
          <h3 class="card-title">Projection</h3>
          <span class="card-subtitle">At the funds' long-run average return of ${esc(fmt.pct(m.cagrPercent, 2))} a year, every year: an illustration, not a forecast.${(data.missingStats || []).length ? ` No long-run figures for ${esc(data.missingStats.join(", "))}.` : ""}</span>
        </div></div>
        ${UI.chart.frameHtml({
          title: "Wealth projection (deposits, nominal, after inflation)",
          subtitle: `Long-run volatility ${fmt.pct(m.annualizedVolatility, 1)} · deepest historical fall ${fmt.pct(m.maxDrawdown, 1)}: real paths swing far more than this line`,
          legend,
        })}

        <div class="grid-3 totals-row">
          <div class="total-cell"><div class="total-label">Deposits</div><div class="total-value">${esc(fmt.eur(s.totalContributions))}</div></div>
          <div class="total-cell"><div class="total-label">Projected value</div><div class="total-value">${esc(fmt.eur(s.finalNominalValue))}</div><div class="total-sub val-positive">${esc(fmt.num(s.returnMultiple, 2))}× deposits</div></div>
          <div class="total-cell"><div class="total-label">After inflation</div><div class="total-value">${esc(fmt.eur(s.finalRealValue))}</div><div class="total-sub">at ${esc(fmt.pct(params.inflationRate, 1))} a year</div></div>
        </div>

        <div class="row-between mt-4 wrap-gap">
          <span class="text-muted text-sm">Check the long-run history on Curvo:</span>
          ${UI.link(data.curvoVerificationUrl, `${icon("external")} Open on Curvo.eu`, { cls: "btn btn-secondary btn-sm", html: true })}
        </div>
      </div>`;

    const frame = container.querySelector("[data-chart-frame]");
    UI.chart.wireFrame(frame);
    renderTableTwin(frame.querySelector('[data-view-panel="table"]'), timeline);
    drawGrowthChart(frame.querySelector('[data-view-panel="chart"]'), timeline, frame);
  }

  function renderTableTwin(host, timeline) {
    host.textContent = "";
    host.appendChild(
      UI.chart.dataTable({
        caption: "Projected portfolio value by year",
        columns: [
          { key: "year", label: "Year", format: (v) => `Year ${v}` },
          { key: "totalDeposits", label: "Total deposits", align: "right", format: (v) => fmt.eur(v) },
          { key: "portfolioNominal", label: "Nominal value", align: "right", format: (v) => fmt.eur(v) },
          { key: "portfolioReal", label: "Real value", align: "right", format: (v) => fmt.eur(v) },
        ],
        rows: timeline,
      })
    );
  }

  /* ----------------------------------------------------------------- chart */
  function drawGrowthChart(host, timeline, frame) {
    if (!host || timeline.length === 0) return;
    const tooltip = UI.chart.tooltip(host);
    const live = document.createElement("div");
    live.className = "sr-only";
    live.setAttribute("role", "status");
    frame.appendChild(live);

    UI.chart.mountResponsive(host, (width) => {
      const height = host.clientHeight || 320;
      const compact = width < 560;
      const pad = { top: 18, right: compact ? 18 : 84, bottom: 30, left: compact ? 52 : 62 };
      const plotW = width - pad.left - pad.right;
      const plotH = height - pad.top - pad.bottom;
      const years = timeline.length - 1;

      const maxVal = Math.max(...timeline.map((d) => d.portfolioNominal), 1);
      const scale = UI.chart.niceScale(0, maxVal, 5);
      const x = (yr) => pad.left + (yr / (years || 1)) * plotW;
      const y = (v) => pad.top + plotH - (v / (scale.max || 1)) * plotH;

      const grid = scale.ticks
        .map((t) => `<line class="chart-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${y(t)}" y2="${y(t)}"></line>
                     <text class="chart-axis-text" x="${pad.left - 8}" y="${y(t) + 4}" text-anchor="end">${esc(fmt.eurCompact(t))}</text>`)
        .join("");

      const step = years <= 10 ? 1 : years <= 20 ? 2 : 5;
      let xTicks = "";
      for (let yr = 0; yr <= years; yr += step) {
        xTicks += `<text class="chart-axis-text" x="${x(yr)}" y="${height - pad.bottom + 18}" text-anchor="middle">${compact ? yr : `Yr ${yr}`}</text>`;
      }

      const path = (key) => timeline.map((d, i) => `${i === 0 ? "M" : "L"}${x(d.year).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(" ");
      const last = timeline[timeline.length - 1];

      const lines = SERIES.map((sr) => `<path d="${path(sr.key)}" fill="none" stroke="${sr.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`).join("");
      const endDots = SERIES.map((sr) => `<circle cx="${x(last.year)}" cy="${y(last[sr.key])}" r="4.5" fill="${sr.color}" stroke="var(--chart-surface)" stroke-width="2"></circle>`).join("");

      // Direct end-labels only when they cannot collide; otherwise legend + tooltip carry identity
      let endLabels = "";
      if (!compact) {
        const ends = SERIES.map((sr) => ({ sr, py: y(last[sr.key]) })).sort((a, b) => a.py - b.py);
        const roomy = ends.every((e, i) => i === 0 || e.py - ends[i - 1].py >= 15);
        if (roomy) {
          endLabels = ends.map((e) => `<text class="chart-label" x="${x(last.year) + 11}" y="${e.py + 4}">${esc(e.sr.short)}</text>`).join("");
        }
      }

      const crosshairDots = SERIES.map(() => `<circle class="cc-dot" r="4.5" stroke="var(--chart-surface)" stroke-width="2"></circle>`).join("");

      host.querySelector("svg")?.remove();
      host.insertAdjacentHTML("afterbegin", `
        <svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" tabindex="0" role="img"
             aria-label="Wealth projection over ${years} years. Final nominal value ${esc(fmt.eur(last.portfolioNominal))}, real value ${esc(fmt.eur(last.portfolioReal))}, deposits ${esc(fmt.eur(last.totalDeposits))}. Use the left and right arrow keys to read each year, or switch to the table view.">
          ${grid}
          <line class="chart-axis-line" x1="${pad.left}" x2="${width - pad.right}" y1="${pad.top + plotH}" y2="${pad.top + plotH}"></line>
          ${xTicks}
          ${lines}
          ${endDots}
          ${endLabels}
          <g class="cc" style="display:none">
            <line class="cc-line" y1="${pad.top}" y2="${pad.top + plotH}" stroke="var(--chart-axis)" stroke-width="1"></line>
            ${crosshairDots}
          </g>
          <rect class="chart-hit" x="${pad.left}" y="${pad.top}" width="${plotW}" height="${plotH}" fill="transparent"></rect>
        </svg>`);

      const svg = host.querySelector("svg");
      const cc = svg.querySelector(".cc");
      const ccLine = svg.querySelector(".cc-line");
      const ccDots = [...svg.querySelectorAll(".cc-dot")];
      let focusIdx = timeline.length - 1;

      function show(idx, { announce = false } = {}) {
        focusIdx = Math.max(0, Math.min(timeline.length - 1, idx));
        const d = timeline[focusIdx];
        const px = x(d.year);
        cc.style.display = "";
        ccLine.setAttribute("x1", px);
        ccLine.setAttribute("x2", px);
        SERIES.forEach((sr, i) => {
          ccDots[i].setAttribute("cx", px);
          ccDots[i].setAttribute("cy", y(d[sr.key]));
          ccDots[i].setAttribute("fill", sr.color);
        });
        const rows = SERIES.slice().reverse().map((sr) => ({ color: sr.color, value: fmt.eur(d[sr.key]), label: sr.label }));
        tooltip.show({ x: px, y: pad.top + plotH / 2, title: `Year ${d.year}`, rows });
        if (announce) {
          live.textContent = `Year ${d.year}: ${rows.map((r) => `${r.label} ${r.value}`).join(", ")}`;
        }
      }
      function hide() {
        cc.style.display = "none";
        tooltip.hide();
      }

      svg.addEventListener("pointermove", (e) => {
        const rect = svg.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const yr = Math.round(((px - pad.left) / plotW) * years);
        show(yr);
      });
      svg.addEventListener("pointerleave", () => { if (document.activeElement !== svg) hide(); });
      svg.addEventListener("focus", () => show(focusIdx, { announce: true }));
      svg.addEventListener("blur", hide);
      svg.addEventListener("keydown", (e) => {
        const move = { ArrowRight: 1, ArrowLeft: -1, PageUp: 5, PageDown: -5 }[e.key];
        if (move !== undefined) { e.preventDefault(); show(focusIdx + move, { announce: true }); }
        else if (e.key === "Home") { e.preventDefault(); show(0, { announce: true }); }
        else if (e.key === "End") { e.preventDefault(); show(timeline.length - 1, { announce: true }); }
        else if (e.key === "Escape") { hide(); }
      });
    });
  }

  return { init, runSimulation };
})();
