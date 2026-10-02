/**
 * ETF Correlation & Overlap Engine
 * Visualizes pairwise correlations from Portfolio Visualizer
 * Analyzes constituent overlap and audits portfolio redundancy (extraETF methodology)
 * Supports both API mode and clientside calculation mode.
 *
 * Heatmap: one-hue sequential ramp (read from the theme's --seq-* tokens), label colour
 * chosen from each cell's luminance, diagonal dimmed, roving-tabindex keyboard grid.
 */

window.OverlapModule = (function () {
  const { esc, icon, fmt } = UI;

  let correlationData = null;
  let allEtfs = [];
  let etfsByTicker = {};
  let selectedPair = null; // { r, c }
  let bound = false;
  let currentPortfolio = {
    IUSQ: 40,
    SXR8: 20,
    IMAE: 10,
    XEON: 10,
    WTAI: 10,
    AII: 10,
  };

  const portfolioPresets = {
    "watchlist-10": {
      name: "⭐ My 10 Watchlist ETFs (Equal Weight 10%)",
      desc: "Equal 10% distribution across all 10 of your tracked European ETFs",
      weights: { IUSQ: 10, SXR8: 10, IMAE: 10, XEON: 10, VHYL: 10, AII: 10, WTAI: 10, BATT: 10, RARE: 10, XCS6: 10 },
    },
    "watchlist-core-satellite": {
      name: "🎯 Watchlist Core & Satellite (50% IUSQ)",
      desc: "50% Global ACWI Core + 50% Satellite Tilts across AI, Metals, and Cash",
      weights: { IUSQ: 50, SXR8: 10, IMAE: 10, XEON: 10, WTAI: 5, AII: 5, BATT: 5, RARE: 5 },
    },
    "world-core": {
      name: "🌍 1-Fund World Simplicity (100% IUSQ)",
      desc: "Total global market coverage in a single low-cost accumulating vehicle",
      weights: { IUSQ: 100 },
    },
    "classic-88-12": {
      name: "🏛️ Boglehead 88/12 Core (88% IWDA + 12% EIMI)",
      desc: "The standard European two-fund total market benchmark",
      weights: { IWDA: 88, EIMI: 12 },
    },
    "tech-growth": {
      name: "🚀 AI & Tech Growth (60% IUSQ + 20% WTAI + 20% AII)",
      desc: "Global broad market anchor with concentrated AI software & infrastructure tilts",
      weights: { IUSQ: 60, WTAI: 20, AII: 20 },
    },
    "cash-shield": {
      name: "🛡️ All-Weather Cash Shield (60% IUSQ + 20% XEON + 20% AGGU)",
      desc: "Capital preservation combining global equities with overnight €STR cash and bonds",
      weights: { IUSQ: 60, XEON: 20, AGGU: 20 },
    },
  };

  /* ------------------------------------------------------------- lifecycle */
  function init(etfs, correlations) {
    allEtfs = etfs || [];
    etfsByTicker = {};
    allEtfs.forEach((e) => { etfsByTicker[e.ticker.toUpperCase()] = e; });
    correlationData = correlations;

    if (document.querySelector(".portfolio-item-row")) {
      // Already on screen (data refresh): keep whatever the user has typed, saved or not
      currentPortfolio = readRows();
    } else {
      try {
        const parsed = JSON.parse(localStorage.getItem("apex_custom_portfolio"));
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) currentPortfolio = parsed;
      } catch (e) { /* none saved */ }
    }

    renderCorrelationMatrix();
    renderPortfolioInputs();
    // The first audit only matters once the tab is visible (saves an API call at load)
    UI.whenTabActive("overlap", () => runPortfolioAudit(), "audit");
    bindOnce();
  }

  function bindOnce() {
    if (bound) return;
    bound = true;
    // The builder container persists across renders, so its delegated handlers
    // are attached exactly once (re-binding per render would multiply actions).
    bindBuilder(document.getElementById("portfolio-overlap-inputs"));
    // Heatmap colours come from theme tokens, so redraw when the theme flips
    document.addEventListener("apex:theme", () => {
      if (correlationData) renderCorrelationMatrix();
    });
  }

  /* --------------------------------------------------------------- heatmap */
  function seqRamp() {
    return UI.color.ramp([0, 1, 2, 3, 4, 5].map((i) => UI.color.cssVar(`--seq-${i}`) || "#888888"));
  }

  function renderCorrelationMatrix() {
    const container = document.getElementById("correlation-matrix-container");
    if (!container || !correlationData) return;

    const tickers = correlationData.tickers || [];
    const matrix = correlationData.matrix || {};
    const ramp = seqRamp();

    const head = `<tr><td class="hm-corner"><span class="sr-only">Fund</span></td>${tickers
      .map((t, c) => `<th scope="col" class="hm-col-head" data-c="${c}">${esc(t)}</th>`)
      .join("")}</tr>`;

    const body = tickers
      .map((rowTicker, r) => {
        const cells = tickers
          .map((colTicker, c) => {
            const val = Number(matrix[rowTicker]?.[colTicker] ?? 1);
            const diagonal = r === c;
            const rgb = ramp(Math.max(0, Math.min(1, val)));
            const style = diagonal
              ? ""
              : ` style="background-color:${UI.color.css(rgb)};color:${UI.color.readableText(rgb)}"`;
            const label = diagonal
              ? `${rowTicker} against itself`
              : `${rowTicker} versus ${colTicker}: correlation ${val.toFixed(2)}`;
            const selected = selectedPair && selectedPair.r === r && selectedPair.c === c;
            return `<td class="hm-cell${diagonal ? " is-diagonal" : ""}${selected ? " is-selected" : ""}"
                      role="gridcell" tabindex="${r === 0 && c === 0 ? 0 : -1}"${selected ? ' aria-selected="true"' : ""}
                      data-r="${r}" data-c="${c}" data-t1="${esc(rowTicker)}" data-t2="${esc(colTicker)}" data-val="${val}"
                      aria-label="${esc(label)}" data-tip="${esc(`${rowTicker} vs ${colTicker} — correlation ${val.toFixed(2)}`)}"${style}>${val.toFixed(2)}</td>`;
          })
          .join("");
        return `<tr><th scope="row" class="hm-row-head" data-r="${r}">${esc(rowTicker)}</th>${cells}</tr>`;
      })
      .join("");

    const legendStops = [0, 0.25, 0.5, 0.75, 1].map((t) => `${UI.color.css(ramp(t))} ${t * 100}%`).join(", ");

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon("layers")} 10-year monthly return correlation matrix</h2>
            <span class="card-subtitle">Portfolio Visualizer data · 120 rolling monthly periods · select any cell to read the diversification verdict</span>
          </div>
          <div class="hm-legend" aria-label="Colour scale">
            <span class="hm-legend-end">0 · diversifier</span>
            <span class="hm-legend-bar" style="background:linear-gradient(to right, ${legendStops})" aria-hidden="true"></span>
            <span class="hm-legend-end">1.0 · moves together</span>
          </div>
        </div>

        <div class="table-responsive hm-wrap">
          <table class="hm-table" role="grid" aria-label="Pairwise correlation of ETF monthly returns">
            <thead>${head}</thead>
            <tbody>${body}</tbody>
          </table>
        </div>

        <div id="correlation-cell-details" class="callout callout-info mt-4" role="status">
          ${icon("info")}
          <div>Select any cell to inspect the diversification benefit and overlap analysis between the two funds. Low values (near 0) are real diversifiers; values above 0.9 mean the funds move almost in lockstep.</div>
        </div>
      </div>`;

    const grid = container.querySelector(".hm-table");
    grid.addEventListener("click", (e) => {
      const cell = e.target.closest(".hm-cell");
      if (cell) selectCell(cell);
    });
    grid.addEventListener("keydown", onGridKeydown);

    if (selectedPair) {
      const cell = grid.querySelector(`[data-r="${selectedPair.r}"][data-c="${selectedPair.c}"]`);
      if (cell) { cell.tabIndex = 0; grid.querySelector('[tabindex="0"]:not(.is-selected)')?.setAttribute("tabindex", "-1"); }
      markHeaders(grid);
      if (cell) explainCorrelationPair(cell.dataset.t1, cell.dataset.t2, parseFloat(cell.dataset.val));
    }
  }

  function onGridKeydown(e) {
    const cell = e.target.closest(".hm-cell");
    if (!cell) return;
    const grid = cell.closest("table");
    const n = (correlationData.tickers || []).length;
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    let nr = r;
    let nc = c;
    switch (e.key) {
      case "ArrowRight": nc = Math.min(n - 1, c + 1); break;
      case "ArrowLeft": nc = Math.max(0, c - 1); break;
      case "ArrowDown": nr = Math.min(n - 1, r + 1); break;
      case "ArrowUp": nr = Math.max(0, r - 1); break;
      case "Home": nc = 0; break;
      case "End": nc = n - 1; break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectCell(cell);
        return;
      default: return;
    }
    e.preventDefault();
    const next = grid.querySelector(`[data-r="${nr}"][data-c="${nc}"].hm-cell`);
    if (next) {
      cell.tabIndex = -1;
      next.tabIndex = 0;
      next.focus();
    }
  }

  function markHeaders(grid) {
    grid.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
    if (!selectedPair) return;
    grid.querySelector(`.hm-row-head[data-r="${selectedPair.r}"]`)?.classList.add("is-active");
    grid.querySelector(`.hm-col-head[data-c="${selectedPair.c}"]`)?.classList.add("is-active");
  }

  function selectCell(cell) {
    const grid = cell.closest("table");
    grid.querySelectorAll(".hm-cell.is-selected").forEach((el) => {
      el.classList.remove("is-selected");
      el.removeAttribute("aria-selected");
    });
    cell.classList.add("is-selected");
    cell.setAttribute("aria-selected", "true");
    selectedPair = { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };
    markHeaders(grid);
    explainCorrelationPair(cell.dataset.t1, cell.dataset.t2, parseFloat(cell.dataset.val));
  }

  function explainCorrelationPair(t1, t2, val) {
    const box = document.getElementById("correlation-cell-details");
    if (!box) return;
    const v = val.toFixed(2);
    const has = (a, b) => (t1 === a && t2 === b) || (t1 === b && t2 === a);
    let tone = "info";
    let html;

    if (t1 === t2) {
      html = `<strong>${esc(t1)} vs ${esc(t2)}:</strong> identical fund (1.00 correlation).`;
    } else if (has("VWCE", "IWDA")) {
      tone = "danger";
      html = `<strong>${esc(t1)} vs ${esc(t2)} (${v}): extreme redundancy.</strong> VWCE tracks FTSE All-World (89% developed, 11% emerging) while IWDA tracks MSCI World (100% developed). Holding both gives virtually zero diversification benefit while doubling your admin. Bogleheads recommend picking one core foundation.`;
    } else if (t1 === "AGGU" || t2 === "AGGU") {
      tone = "success";
      const equity = t1 === "AGGU" ? t2 : t1;
      html = `<strong>${esc(equity)} vs AGGU (${v}): superb non-correlated diversification.</strong> AGGU (global aggregate bonds) has a ${v} correlation to ${esc(equity)}. When equities suffer sharp drawdowns, high-quality sovereign bonds act as an anti-fragile shock absorber, letting you rebalance into depressed equities.`;
    } else if (has("SXR8", "QDVE")) {
      tone = "danger";
      html = `<strong>${esc(t1)} vs ${esc(t2)} (${v}): high redundancy and concentration.</strong> The S&P 500 already allocates 32.1% to technology. Adding QDVE heavily multiplies your stake in Microsoft, Apple and NVIDIA (62% of QDVE) — an aggressive high-beta bet on the AI capex cycle.`;
    } else if (has("EIMI", "IWDA")) {
      tone = "success";
      html = `<strong>IWDA vs EIMI (${v}): complementary building blocks.</strong> IWDA holds 0% emerging markets and EIMI holds 100% (0% constituent overlap). A classic Bogleheads 88% IWDA + 12% EIMI split reconstructs the global market portfolio with full allocation control.`;
    } else {
      tone = val >= 0.9 ? "warning" : val <= 0.3 ? "success" : "info";
      html = `<strong>${esc(t1)} vs ${esc(t2)} (correlation ${v}):</strong> combining these funds balances regional or factor weights. Check the constituent overlap below to inspect shared individual equities.`;
    }

    box.className = `callout callout-${tone} mt-4`;
    box.innerHTML = `${icon(tone === "danger" || tone === "warning" ? "alert" : tone === "success" ? "check" : "info")}<div>${html}</div>`;
  }

  /* ----------------------------------------------------- portfolio builder */
  function rowHtml(ticker, weight, index) {
    const options = allEtfs
      .map((e) => `<option value="${esc(e.ticker)}"${e.ticker === ticker ? " selected" : ""}>${esc(e.ticker)} — ${esc(e.name)}</option>`)
      .join("");
    return `
      <div class="pf-row portfolio-item-row" data-ticker="${esc(ticker)}">
        <label class="sr-only" for="pf-etf-${index}">ETF for position ${index + 1}</label>
        <select id="pf-etf-${index}" class="filter-select etf-select">${options}</select>
        <div class="pf-weight">
          <label class="sr-only" for="pf-w-${index}">Weight of position ${index + 1} in percent</label>
          <input id="pf-w-${index}" type="number" class="filter-input etf-weight-input" min="0" max="100" step="any" value="${esc(weight)}" inputmode="decimal" />
          <span class="pf-pct" aria-hidden="true">%</span>
        </div>
        <button type="button" class="btn btn-danger btn-sm remove-row-btn" aria-label="Remove position ${index + 1}">${icon("x")}<span class="pf-remove-text"> Remove</span></button>
      </div>`;
  }

  function renderPortfolioInputs() {
    const container = document.getElementById("portfolio-overlap-inputs");
    if (!container) return;

    const presetsHtml = Object.entries(portfolioPresets)
      .map(([key, p]) => `
        <button type="button" class="btn btn-secondary btn-sm portfolio-preset-btn${key.includes("watchlist") ? " is-watch" : ""}" data-preset="${key}" data-tip="${esc(p.desc)}">${esc(p.name)}</button>`)
      .join("");

    const rowsHtml = Object.entries(currentPortfolio).map(([t, w], i) => rowHtml(t, w, i)).join("");

    container.innerHTML = `
      <div class="card guide-card">
        <div class="row-between mb-3">
          <h3 class="card-title">💡 How to build your portfolio <span class="text-muted text-sm fw-600">(Boglehead 3-step architecture)</span></h3>
          <span class="badge badge-acc">Core + satellite strategy</span>
        </div>
        <div class="grid-3 guide-grid">
          <div class="panel">
            <strong class="guide-heading" style="color: var(--accent-emerald)">1. Anchor with 1 global core (60–90%)</strong>
            <p class="text-secondary text-sm mt-1">Choose one broad-market Accumulating fund (e.g. <strong>IUSQ</strong> MSCI ACWI or <strong>VWCE</strong> FTSE All-World) to compound global growth at minimal cost with zero dividend tax drag.</p>
          </div>
          <div class="panel">
            <strong class="guide-heading" style="color: var(--accent-cyan)">2. Add satellite tilts deliberately (10–30%)</strong>
            <p class="text-secondary text-sm mt-1">Allocate small proportions to high-conviction megatrends (e.g. <strong>WTAI</strong> AI, <strong>BATT</strong> batteries, <strong>RARE</strong> metals) or a cash cushion (<strong>XEON</strong> €STR) for risk mitigation.</p>
          </div>
          <div class="panel">
            <strong class="guide-heading" style="color: var(--accent-rose)">3. Audit overlap &amp; concentration</strong>
            <p class="text-secondary text-sm mt-1">Run the auditor below to verify single-stock exposure (Apple, Microsoft, NVIDIA) does not unintentionally concentrate past your risk budget.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="cluster">
              <h2 class="card-title">${icon("sliders")} Portfolio builder &amp; overlap auditor</h2>
              <span class="stage-status-badge badge-essential">Stage 2 · Portfolio construction</span>
            </div>
            <span class="card-subtitle">Build, customise and audit your allocation across all verified European ETFs</span>
          </div>
          <div class="cluster">
            <button type="button" id="equal-weight-btn" class="btn btn-secondary btn-sm" data-tip="Evenly distribute 100% across all listed funds">${icon("scale")} Equal-weight</button>
            <button type="button" id="save-portfolio-btn" class="btn btn-success btn-sm" data-tip="Save this portfolio in your browser">${icon("save")} Save</button>
            <button type="button" id="add-etf-row-btn" class="btn btn-primary btn-sm">${icon("plus")} Add ETF</button>
          </div>
        </div>

        <div class="panel mb-4">
          <h3 class="section-label">Quick allocation presets</h3>
          <div class="cluster">${presetsHtml}</div>
        </div>

        <div id="portfolio-rows-container">${rowsHtml}</div>

        <div class="pf-footer">
          <div id="total-weight-display" class="pf-total" role="status">Total weight: 100%</div>
          <div class="cluster">
            <button type="button" id="clear-portfolio-btn" class="btn btn-ghost btn-sm">${icon("trash")} Clear</button>
            <button type="button" id="run-audit-btn" class="btn btn-primary">${icon("zap")} Run overlap audit</button>
          </div>
        </div>
      </div>`;

    updateTotalWeight();
  }

  function bindBuilder(container) {
    if (!container) return;
    container.addEventListener("input", (e) => {
      if (e.target.matches(".etf-weight-input")) updateTotalWeight();
    });

    container.addEventListener("change", (e) => {
      if (e.target.matches(".etf-select")) e.target.closest(".portfolio-item-row").dataset.ticker = e.target.value;
    });

    container.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.matches(".remove-row-btn")) {
        btn.closest(".portfolio-item-row").remove();
        syncPortfolioFromDom();
        updateTotalWeight();
      } else if (btn.matches(".portfolio-preset-btn")) {
        const preset = portfolioPresets[btn.dataset.preset];
        if (preset) {
          currentPortfolio = { ...preset.weights };
          renderPortfolioInputs();
          runPortfolioAudit();
          UI.toast(`Loaded preset: ${preset.name.replace(/^\S+\s/, "")}`, { type: "success" });
        }
      } else if (btn.id === "equal-weight-btn") {
        equalWeight();
      } else if (btn.id === "save-portfolio-btn") {
        savePortfolio();
      } else if (btn.id === "clear-portfolio-btn") {
        currentPortfolio = {};
        renderPortfolioInputs();
        UI.toast("Portfolio cleared. Select an ETF or load a preset.", { type: "info" });
      } else if (btn.id === "add-etf-row-btn") {
        addRow();
      } else if (btn.id === "run-audit-btn") {
        runPortfolioAudit({ scroll: true });
      }
    });
  }

  function readRows() {
    const portfolio = {};
    document.querySelectorAll(".portfolio-item-row").forEach((row) => {
      const ticker = (row.querySelector(".etf-select")?.value || row.dataset.ticker || "").toUpperCase();
      const weight = parseFloat(row.querySelector(".etf-weight-input")?.value || 0);
      if (ticker && weight > 0) portfolio[ticker] = (portfolio[ticker] || 0) + weight;
    });
    return portfolio;
  }

  function syncPortfolioFromDom() {
    currentPortfolio = readRows();
  }

  function addRow() {
    const used = new Set([...document.querySelectorAll(".portfolio-item-row")].map((r) => r.dataset.ticker));
    const next = allEtfs.find((e) => !used.has(e.ticker))?.ticker || "IUSQ";
    const rows = document.getElementById("portfolio-rows-container");
    rows.insertAdjacentHTML("beforeend", rowHtml(next, 10, rows.children.length));
    rows.lastElementChild.querySelector(".etf-select").focus();
    updateTotalWeight();
  }

  function equalWeight() {
    const rows = document.querySelectorAll(".portfolio-item-row");
    if (rows.length === 0) return;
    const share = Math.floor(100 / rows.length);
    const remainder = 100 - share * rows.length;
    rows.forEach((row, i) => {
      const input = row.querySelector(".etf-weight-input");
      if (input) input.value = i === 0 ? share + remainder : share;
    });
    updateTotalWeight();
    runPortfolioAudit();
    UI.toast("Weights evenly rebalanced to 100%.", { type: "success" });
  }

  function savePortfolio() {
    const portfolio = readRows();
    try {
      localStorage.setItem("apex_custom_portfolio", JSON.stringify(portfolio));
      currentPortfolio = portfolio;
      UI.toast("Portfolio saved in this browser.", { type: "success" });
    } catch (e) {
      UI.toast("Couldn't save — browser storage is unavailable.", { type: "error" });
    }
  }

  function updateTotalWeight() {
    let total = 0;
    document.querySelectorAll(".portfolio-item-row .etf-weight-input").forEach((i) => { total += parseFloat(i.value || 0) || 0; });
    const display = document.getElementById("total-weight-display");
    if (!display) return;
    const ok = Math.abs(total - 100) < 0.005;
    const shown = Number(total.toFixed(2));
    display.innerHTML = `Total weight: <strong class="${ok ? "val-positive" : "pf-warn"}">${esc(shown)}%</strong> ${
      ok ? `<span class="val-positive">${icon("check")}</span>` : `<span class="text-muted text-sm">(will be normalised to 100% in the audit)</span>`
    }`;
  }

  /* ----------------------------------------------------------------- audit */
  async function runPortfolioAudit({ scroll = false } = {}) {
    const btn = document.getElementById("run-audit-btn");
    const results = document.getElementById("overlap-audit-results");
    if (btn) { btn.disabled = true; btn.classList.add("is-loading"); btn.setAttribute("aria-busy", "true"); }
    if (results) results.classList.add("is-refreshing"); // hold the previous render, dimmed

    let portfolio = readRows();

    if (Object.keys(portfolio).length === 0) {
      portfolio = { VWCE: 100 };
      currentPortfolio = { ...portfolio };
      renderPortfolioInputs();
      UI.toast("Empty portfolio auto-filled with VWCE.", { type: "info" });
    } else {
      currentPortfolio = { ...portfolio };
    }

    let data = null;
    try {
      const res = await fetch("/api/overlap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio }),
      });
      if (res.ok) data = await res.json();
    } catch (e) {
      console.warn("API overlap failed, falling back to client-side calculation:", e);
    }
    if (!data) data = computePortfolioOverlapClientside(portfolio);

    renderAuditResults(data);
    if (results) results.classList.remove("is-refreshing");
    const btn2 = document.getElementById("run-audit-btn");
    if (btn2) { btn2.disabled = false; btn2.classList.remove("is-loading"); btn2.removeAttribute("aria-busy"); }
    if (scroll && results) results.scrollIntoView({ behavior: UI.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }

  function computePortfolioOverlapClientside(portfolioWeights) {
    const totalInput = Object.values(portfolioWeights).reduce((a, b) => a + b, 0);
    const norm = {};
    for (let [k, v] of Object.entries(portfolioWeights)) {
      norm[k.toUpperCase()] = v / (totalInput || 1);
    }

    let weightedTer = 0.0;
    let weightedTd = 0.0;
    let accShare = 0.0;
    const aggregatedHoldings = {};
    const aggregatedCountries = {};
    const aggregatedSectors = {};

    for (let [t, pWeight] of Object.entries(norm)) {
      const etf = etfsByTicker[t];
      if (!etf) continue;

      weightedTer += (etf.ter || 0) * pWeight;
      weightedTd += (etf.trackingDifference5Y || 0) * pWeight;
      if (etf.isAccumulating) accShare += pWeight * 100;

      // Holdings
      (etf.topHoldings || []).forEach(h => {
        const name = h.name;
        const contrib = h.weight * pWeight;
        if (!aggregatedHoldings[name]) {
          aggregatedHoldings[name] = {
            name: name,
            symbol: h.symbol || "",
            portfolioWeight: 0,
            foundInEtfs: []
          };
        }
        aggregatedHoldings[name].portfolioWeight += contrib;
        aggregatedHoldings[name].foundInEtfs.push({
          ticker: t,
          effectiveContribution: contrib.toFixed(2)
        });
      });

      // Countries
      for (let [c, w] of Object.entries(etf.countryBreakdown || {})) {
        aggregatedCountries[c] = (aggregatedCountries[c] || 0) + (w * pWeight);
      }

      // Sectors
      for (let [s, w] of Object.entries(etf.sectorBreakdown || {})) {
        aggregatedSectors[s] = (aggregatedSectors[s] || 0) + (w * pWeight);
      }
    }

    const sortedHoldings = Object.values(aggregatedHoldings).sort((a, b) => b.portfolioWeight - a.portfolioWeight);
    sortedHoldings.forEach(h => { h.portfolioWeight = parseFloat(h.portfolioWeight.toFixed(2)); });

    // Pairwise
    const pairwise = [];
    const tickers = Object.keys(norm);
    for (let i = 0; i < tickers.length; i++) {
      for (let j = i + 1; j < tickers.length; j++) {
        const t1 = tickers[i], t2 = tickers[j];
        const e1 = etfsByTicker[t1];
        const e2 = etfsByTicker[t2];

        let overlap = 0.0;
        if (e1 && e2) {
          const h1 = {};
          (e1.topHoldings || []).forEach(h => h1[h.name] = h.weight);
          const h2 = {};
          (e2.topHoldings || []).forEach(h => h2[h.name] = h.weight);

          let minWeightSum = 0;
          for (let name in h1) {
            if (h2[name]) {
              minWeightSum += Math.min(h1[name], h2[name]);
            }
          }
          overlap = minWeightSum;
        }

        // Heuristics for broad indices
        if ((t1 === "VWCE" && t2 === "IWDA") || (t1 === "IWDA" && t2 === "VWCE")) overlap = 88.4;
        else if (["VWCE", "IWDA"].includes(t1) && ["SXR8", "VUAA"].includes(t2)) overlap = 64.2;
        else if (["SXR8", "VUAA"].includes(t1) && ["IWDA"].includes(t2)) overlap = 70.8;
        else if (t1 === "QDVE" || t2 === "QDVE") overlap = 32.1;
        else if (["IUSQ"].includes(t1) && ["SXR8"].includes(t2)) overlap = 63.8;
        else if (["SXR8"].includes(t1) && ["IUSQ"].includes(t2)) overlap = 63.8;
        else if (t1 === "EIMI" || t2 === "EIMI" || t1 === "AGGU" || t2 === "AGGU") overlap = 0.0;

        pairwise.push({
          pair: `${t1} + ${t2}`,
          overlapPercent: parseFloat(overlap.toFixed(1)),
          redundancyLevel: overlap > 70 ? "Extreme (>70%)" : (overlap > 35 ? "High (>35%)" : "Complementary (<10%)")
        });
      }
    }

    // Warnings
    const warnings = [];
    const top3 = (sortedHoldings[0]?.portfolioWeight || 0) + (sortedHoldings[1]?.portfolioWeight || 0) + (sortedHoldings[2]?.portfolioWeight || 0);
    if (top3 > 15) {
      warnings.push({
        type: "Single Stock Concentration",
        severity: "high",
        message: `Your top 3 holdings account for ${top3.toFixed(1)}% of your entire portfolio (${sortedHoldings.slice(0, 3).map(h => `${h.name}: ${h.portfolioWeight}%`).join(", ")}). Consider broad market-cap rebalancing.`
      });
    }

    const techW = aggregatedSectors["Information Technology"] || 0;
    if (techW > 35) {
      warnings.push({
        type: "Sector Overweight",
        severity: "medium",
        message: `Information Technology makes up ${techW.toFixed(1)}% of this portfolio (vs 25.8% in FTSE All-World). Note higher sensitivity to AI capex shifts.`
      });
    }

    if (accShare < 100) {
      warnings.push({
        type: "Distributing Exposure Drag",
        severity: "info",
        message: `${(100 - accShare).toFixed(1)}% of your portfolio is in Distributing share classes. Switching to Accumulating funds avoids annual dividend tax drag and reinvestment fees.`
      });
    }

    return {
      portfolioWeights: norm,
      weightedTer: parseFloat(weightedTer.toFixed(3)),
      weightedTrackingDifference: parseFloat(weightedTd.toFixed(3)),
      accumulatingShare: parseFloat(accShare.toFixed(1)),
      topConstituents: sortedHoldings,
      sectorBreakdown: aggregatedSectors,
      countryBreakdown: aggregatedCountries,
      pairwiseOverlaps: pairwise,
      redundancyWarnings: warnings
    };
  }

  function renderAuditResults(data) {
    const container = document.getElementById("overlap-audit-results");
    if (!container || !data) return;

    try {
      // Normalise the server response to the flat structure used below
      if (data.summary) {
        data.weightedTer = data.summary.weightedTER;
        data.weightedTrackingDifference = data.summary.weightedTrackingDifference;
        data.accumulatingShare = data.summary.accumulatingShare;
      }
      if (data.topAggregatedHoldings && !data.topConstituents) data.topConstituents = data.topAggregatedHoldings;
      if (data.pairwiseOverlaps && data.pairwiseOverlaps.length > 0 && data.pairwiseOverlaps[0].etf1) {
        data.pairwiseOverlaps = data.pairwiseOverlaps.map((p) => ({
          ...p,
          pair: `${p.etf1} + ${p.etf2}`,
          overlapPercent: p.overlapPercentage,
          redundancyLevel: p.overlapPercentage > 70 ? "Extreme (>70%)" : p.overlapPercentage > 35 ? "High (>35%)" : "Complementary (<10%)",
        }));
      }
      if (data.warnings && !data.redundancyWarnings) {
        data.redundancyWarnings = data.warnings.map((w) => ({
          ...w,
          severity: w.level === "warning" ? "high" : w.level === "redundancy" ? "medium" : "info",
          type: w.title,
        }));
      }

      const warningsHtml = (data.redundancyWarnings || [])
        .map((w) => {
          const tone = w.severity === "high" ? "danger" : w.severity === "info" ? "info" : "warning";
          return `<div class="callout callout-${tone}">${icon(tone === "info" ? "info" : "alert")}<div><div class="callout-title">${esc(w.type)}</div>${esc(w.message)}</div></div>`;
        })
        .join("");

      const top3 = (data.topConstituents || []).slice(0, 3).reduce((s, h) => s + (Number(h.portfolioWeight) || 0), 0);

      const holdings = (data.topConstituents || []).slice(0, 10);
      const holdingsHtml = holdings.length
        ? holdings
            .map((h, i) => {
              const from = (h.foundInEtfs || []).map((e) => `${e.ticker}: ${e.effectiveContribution}%`).join(" + ");
              return `<div class="bar-row">
                <div class="bar-row-head"><span><strong>${i + 1}. ${esc(h.name)}</strong>${from ? ` <span class="text-muted text-xs">from ${esc(from)}</span>` : ""}</span><strong>${esc(fmt.pct(h.portfolioWeight, 2))}</strong></div>
                <div class="bar-track"><div class="bar-fill" style="width:${Math.max(1.5, Math.min(100, (h.portfolioWeight / (holdings[0].portfolioWeight || 1)) * 100)).toFixed(1)}%"></div></div>
              </div>`;
            })
            .join("")
        : `<p class="text-muted text-sm">No constituent data for the selected funds.</p>`;

      const pairs = data.pairwiseOverlaps || [];
      const pairwiseHtml = pairs.length
        ? pairs
            .map((p) => {
              const high = p.overlapPercent > 60;
              return `<tr>
                <th scope="row"><strong>${esc(p.pair)}</strong></th>
                <td>
                  <div class="overlap-meter">
                    <div class="meter-track"><div class="meter-fill${high ? " is-critical" : ""}" style="width:${Math.max(0, Math.min(100, p.overlapPercent))}%"></div></div>
                    <strong class="tabular">${esc(p.overlapPercent)}%</strong>
                  </div>
                </td>
                <td><span class="badge ${high ? "badge-red" : "badge-blue"}">${esc(p.redundancyLevel)}</span></td>
              </tr>`;
            })
            .join("")
        : `<tr><td colspan="3" class="text-muted">Add multiple ETFs to compare pairwise overlap.</td></tr>`;

      const sectors = Object.entries(data.sectorBreakdown || {})
        .map(([s, v]) => [s, Number(v) || 0])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
      const sectorMax = Math.max(...sectors.map(([, v]) => v), 1);
      const sectorHtml = sectors
        .map(([s, v]) => `<div class="bar-row">
            <div class="bar-row-head"><span>${esc(s)}</span><strong>${esc(fmt.pct(v, 1))}</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.max(1.5, (v / sectorMax) * 100).toFixed(1)}%"></div></div>
          </div>`)
        .join("");

      const td = Number(data.weightedTrackingDifference);
      container.innerHTML = `
        ${warningsHtml ? `<div class="stack mb-5">${warningsHtml}</div>` : ""}

        <div class="grid-4 mb-5">
          <div class="metric-box"><span class="metric-label">Weighted TER</span><span class="metric-value">${esc(fmt.pct(data.weightedTer, 3))}</span><span class="metric-sub">Annual ongoing fee</span></div>
          <div class="metric-box"><span class="metric-label">Weighted tracking difference</span><span class="metric-value ${td < 0 ? "val-positive" : ""}">${esc(fmt.pct(td, 3))}</span><span class="metric-sub">5Y average vs benchmarks</span></div>
          <div class="metric-box"><span class="metric-label">Accumulating share</span><span class="metric-value ${data.accumulatingShare === 100 ? "val-positive" : "val-negative"}">${esc(fmt.pct(data.accumulatingShare, 1))}</span><span class="metric-sub">${data.accumulatingShare === 100 ? "100% tax compounder" : "Contains distributing funds"}</span></div>
          <div class="metric-box"><span class="metric-label">Top 3 stock weight</span><span class="metric-value accent-cyan">${esc(fmt.pct(top3, 1))}</span><span class="metric-sub">Single-company risk</span></div>
        </div>

        <div class="grid-2">
          <section class="card" aria-labelledby="audit-hold">
            <h3 id="audit-hold" class="card-title mb-1">${icon("layers")} True aggregated holdings</h3>
            <p class="text-muted text-sm mb-3">What you actually own across all funds combined:</p>
            ${holdingsHtml}
          </section>

          <div>
            <section class="card" aria-labelledby="audit-pair">
              <h3 id="audit-pair" class="card-title mb-3">Pairwise overlap</h3>
              <div class="table-responsive">
                <table class="data-table">
                  <thead><tr><th scope="col">ETF pair</th><th scope="col">Shared weight</th><th scope="col">Redundancy</th></tr></thead>
                  <tbody>${pairwiseHtml}</tbody>
                </table>
              </div>
            </section>

            <section class="card" aria-labelledby="audit-sect">
              <h3 id="audit-sect" class="card-title mb-3">Sector exposure</h3>
              ${sectorHtml || `<p class="text-muted text-sm">No sector data.</p>`}
            </section>
          </div>
        </div>`;
    } catch (err) {
      console.error("Audit render error:", err);
      container.innerHTML = `<div class="callout callout-danger" role="alert">${icon("alert")}<div>Couldn't render the audit results. Please try again.</div></div>`;
    }
  }

  /* ------------------------------------------------------------- public API */
  function addEtfToPortfolio(ticker, defaultWeight = 10) {
    ticker = (ticker || "").toUpperCase();
    if (!ticker) return;
    // The DOM is the source of truth once the builder is on screen
    if (document.querySelector(".portfolio-item-row")) currentPortfolio = readRows();
    if (currentPortfolio[ticker] !== undefined) {
      UI.toast(`${ticker} is already in your portfolio.`, { type: "info" });
      return;
    }
    currentPortfolio[ticker] = defaultWeight;
    renderPortfolioInputs();
    runPortfolioAudit();
    UI.toast(`Added ${ticker} to your portfolio.`, { type: "success" });
  }

  function setPortfolio(portfolioObj) {
    if (!portfolioObj || typeof portfolioObj !== "object") return;
    currentPortfolio = { ...portfolioObj };
    renderPortfolioInputs();
    runPortfolioAudit();
  }

  return {
    init,
    addEtfToPortfolio,
    setPortfolio,
    getPortfolio: () => ({ ...currentPortfolio }),
  };
})();
