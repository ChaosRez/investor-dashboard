/**
 * Regime Resilience & Robust Risk Parity Module
 * Implements the 3-Step Decision-Making Workflow for Uncertain Macro Regimes:
 * 1. Structural Building Blocks Selection (Macro Regimes: Equity, Tilt, Bonds, Cash, Gold)
 * 2. Position Sizing via Non-Linear Optimization (HRP, Risk Parity / ERC, Mean-CVaR, Shrinkage)
 * 3. Downside Stress-Testing & Crisis Analysis (QuantStats historical crisis teardown & tolerance guardrails)
 * Plus Python Quant Code Generators (PyPortfolioOpt, Riskfolio, QuantStats) and No-Code Platforms.
 *
 * Notes
 *  - Analytics run lazily (first time the tab is shown) and keep the previous render dimmed
 *    while refreshing. If the local server is unreachable, each section says so and offers Retry.
 *  - The risk-decomposition chart plots the CURRENT portfolio's real risk contribution,
 *    w_i·(Σw)_i / wᵀΣw, computed from the API's covariance matrix (not the ERC solution's).
 *  - The dendrogram places each merge at its true correlation distance.
 */

window.RegimeRiskParityModule = (function () {
  const { esc, icon, fmt } = UI;

  let allEtfs = [];
  let correlationsData = null;
  let etfsByTicker = {};
  let bound = false;
  let runId = 0;

  // Active state (survives data refreshes)
  let activePortfolio = { VWCE: 60, AGGU: 40 };
  let activePreset = "classic_60_40";
  let behavioralTolerance = -20.0;
  let optimizationData = null;
  let stressTestData = null;
  let tearSheetData = null;
  let codeSnippets = null;
  let codeTab = "pyportfolioopt";

  const presets = {
    vwce_chill: {
      name: "Single-Fund 'VWCE and Chill'",
      tag: "Bogleheads simplicity",
      desc: "100% Vanguard FTSE All-World (USD) Acc. Maximum long-term equity compounding, 100% drawdown exposure.",
      portfolio: { VWCE: 100 },
    },
    classic_60_40: {
      name: "Institutional 60/40 Core",
      tag: "Traditional benchmark",
      desc: "60% All-World + 40% Global Aggregate Bonds. The multi-asset baseline for balanced growth and duration defense.",
      portfolio: { VWCE: 60, AGGU: 40 },
    },
    all_weather: {
      name: "Ray Dalio All-Weather Regime",
      tag: "All-quadrant resilience",
      desc: "30% Equities (VWCE), 40% Aggregate Bonds (AGGU), 15% Cash (€STR XEON), 7.5% Physical Gold (SGLD), 7.5% Critical Resources (RARE).",
      portfolio: { VWCE: 30, AGGU: 40, XEON: 15, SGLD: 7.5, RARE: 7.5 },
    },
    permanent: {
      name: "Harry Browne Permanent Portfolio",
      tag: "Sleep-well four-pillar",
      desc: "Equal 25% allocation across Equities (VWCE), Bonds (AGGU), Cash (XEON), and Physical Gold (SGLD).",
      portfolio: { VWCE: 25, AGGU: 25, XEON: 25, SGLD: 25 },
    },
    golden_butterfly: {
      name: "Golden Butterfly Portfolio",
      tag: "Small-cap value accelerated",
      desc: "20% Large US (SXR8) + 20% Small-Cap (IUSN) + 20% Agg Bonds (AGGU) + 20% Cash (XEON) + 20% Gold (SGLD).",
      portfolio: { SXR8: 20, IUSN: 20, AGGU: 20, XEON: 20, SGLD: 20 },
    },
    barbell_regime: {
      name: "Growth & T-Bill Barbell Strategy",
      tag: "Zero duration risk",
      desc: "80% Global Equity (VWCE) + 20% Ultra-Short Cash Yield (€STR XEON). Eliminates bond duration crash risk.",
      portfolio: { VWCE: 80, XEON: 20 },
    },
    tech_momentum_tilt: {
      name: "US Core + Tech Momentum Tilt",
      tag: "High cyclical beta",
      desc: "70% S&P 500 (SXR8) + 30% Information Technology (QDVE). High upside alpha with elevated rate-shock drawdown.",
      portfolio: { SXR8: 70, QDVE: 30 },
    },
  };

  const macroRegimes = [
    { id: "growth_equity", name: "Broad Growth & Global Equities", icon: "🌍", role: "Capital growth during economic expansion regimes", tickers: ["VWCE", "IWDA", "SXR8", "VUAA", "MEUD", "IMAE", "IUSQ", "FWRA"] },
    { id: "factor_tilt", name: "Factor Tilts & Tech Momentum", icon: "⚡", role: "Harvesting structural factor risk premia (Small-Cap, Quality, Tech)", tickers: ["IUSN", "GGRA", "QDVE", "VHYL", "EIMI", "XCS6", "AII", "WTAI"] },
    { id: "fixed_income", name: "Fixed Income & Intermediate Bonds", icon: "🛡️", role: "Deflation protection & flight-to-safety duration buffer", tickers: ["AGGU"] },
    { id: "liquidity_cash", name: "Ultra-Short Liquidity / Cash (€STR)", icon: "💶", role: "Duration-free dry powder earning risk-free overnight rates", tickers: ["XEON"] },
    { id: "real_assets", name: "Real Assets, Commodities & Gold", icon: "🪙", role: "Stagflation, supply shocks, and monetary debasement hedge", tickers: ["SGLD", "RARE", "BATT"] },
  ];

  const METHOD_ORDER = ["hrp", "equalRiskContribution", "meanCvar", "inverseVolatility", "equalWeight", "markowitzMeanVariance"];

  /* ------------------------------------------------------------- lifecycle */
  function init(etfs, correlations) {
    allEtfs = etfs || [];
    correlationsData = correlations || null;
    etfsByTicker = {};
    allEtfs.forEach((e) => { etfsByTicker[e.ticker.toUpperCase()] = e; });

    renderInterface();
    ensureDialogs();
    // Three API calls only matter once the tab is on screen
    UI.whenTabActive("parity", () => runAllAnalytics(), "analytics");
    bindOnce();
  }

  function bindOnce() {
    if (bound) return;
    bound = true;
    const root = document.getElementById("regime-risk-parity-container");

    root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.matches(".preset-regime-btn")) {
        const key = btn.dataset.preset;
        if (presets[key]) {
          activePreset = key;
          activePortfolio = { ...presets[key].portfolio };
          refreshSelectionUi();
          runAllAnalytics();
        }
      } else if (btn.matches(".block-ticker-badge")) {
        const ticker = btn.dataset.ticker;
        if (Object.prototype.hasOwnProperty.call(activePortfolio, ticker)) delete activePortfolio[ticker];
        else activePortfolio[ticker] = 10;
        activePreset = "";
        normalizeActiveWeights();
        refreshSelectionUi();
        runAllAnalytics();
      } else if (btn.matches(".remove-ticker-btn")) {
        delete activePortfolio[btn.dataset.ticker];
        activePreset = "";
        normalizeActiveWeights();
        refreshSelectionUi();
        runAllAnalytics();
      } else if (btn.id === "equalize-weights-btn") {
        const keys = Object.keys(activePortfolio);
        if (keys.length === 0) return;
        const eq = parseFloat((100.0 / keys.length).toFixed(1));
        keys.forEach((k) => { activePortfolio[k] = eq; });
        activePreset = "";
        normalizeActiveWeights();
        refreshSelectionUi();
        runAllAnalytics();
      } else if (btn.id === "recalculate-all-btn" || btn.matches(".parity-retry-btn")) {
        runAllAnalytics();
      } else if (btn.matches(".apply-optimized-weights-btn")) {
        const m = optimizationData?.methods?.[btn.dataset.method];
        if (m && m.weights) {
          activePortfolio = { ...m.weights };
          activePreset = "";
          refreshSelectionUi();
          runAllAnalytics();
          UI.toast(`Applied ${m.name} weights.`, { type: "success" });
        }
      } else if (btn.id === "open-quant-code-btn") {
        openCodeDialog(btn);
      } else if (btn.id === "open-platforms-btn") {
        openPlatformsDialog(btn);
      } else if (btn.id === "apply-remedy-btn") {
        const shift = Math.round(stressTestData?.recommendedCashShift || 15);
        activePortfolio["XEON"] = (activePortfolio["XEON"] || 0) + shift;
        activePreset = "";
        normalizeActiveWeights();
        refreshSelectionUi();
        runAllAnalytics();
        UI.toast(`Added a ${shift}% XEON liquidity buffer.`, { type: "success" });
      }
    });

    root.addEventListener("change", (e) => {
      if (e.target.matches(".holding-weight-input")) {
        activePortfolio[e.target.dataset.ticker] = parseFloat(e.target.value) || 0;
        activePreset = "";
        updateSumIndicator();
        syncPresetPressed();
      }
    });

    const refreshStress = UI.debounce(() => refreshStressOnly(), 450);
    root.addEventListener("input", (e) => {
      if (!e.target.matches("#tolerance-slider")) return;
      behavioralTolerance = parseFloat(e.target.value);
      updateToleranceLabel();
      if (stressTestData) renderToleranceAlert(stressTestData); // instant breach feedback
      refreshStress(); // then refresh the server's remedy for the new threshold
    });
  }

  /* ------------------------------------------------------------- interface */
  function renderInterface() {
    const container = document.getElementById("regime-risk-parity-container");
    if (!container) return;

    const presetsHtml = Object.entries(presets)
      .map(([key, p]) => `
        <button type="button" class="preset-card preset-regime-btn${key === activePreset ? " active" : ""}" data-preset="${key}" aria-pressed="${key === activePreset}">
          <span class="preset-card-head"><span class="preset-card-title">${esc(p.name)}</span></span>
          <span class="badge badge-neutral badge-sm">${esc(p.tag)}</span>
          <span class="preset-card-desc">${esc(p.desc)}</span>
        </button>`)
      .join("");

    const regimesHtml = macroRegimes
      .map((reg) => `
        <div class="regime-panel">
          <div class="regime-head"><span class="regime-icon" aria-hidden="true">${reg.icon}</span><strong>${esc(reg.name)}</strong></div>
          <div class="text-muted text-xs regime-role">${esc(reg.role)}</div>
          <div class="chip-row" data-regime="${reg.id}">${reg.tickers.map((t) => chipHtml(t)).join("")}</div>
        </div>`)
      .join("");

    container.innerHTML = `
      <div class="card parity-intro">
        <div class="card-header">
          <div>
            <div class="cluster">
              <h2 class="card-title">${icon("shield")} Regime resilience &amp; robust risk parity studio</h2>
              <span class="stage-status-badge badge-essential">Stage 4 · Regime resilience</span>
            </div>
            <span class="card-subtitle">Moving beyond fragile mean-variance optimisation to non-linear risk parity, graph-clustering dendrograms and downside crisis stress-testing.</span>
          </div>
          <div class="cluster">
            <button type="button" id="open-quant-code-btn" class="btn btn-secondary btn-sm">${icon("code")} Python quant scripts</button>
            <button type="button" id="open-platforms-btn" class="btn btn-secondary btn-sm">${icon("globe")} No-code web platforms</button>
          </div>
        </div>
        <ol class="workflow-grid">
          <li class="workflow-step"><span class="step-badge step-1" aria-hidden="true">1</span><div><strong>Pick structural building blocks</strong><p>Don't let an optimiser pick your assets. Manually select assets representing distinct economic regimes (equities, tilts, bonds, cash, gold).</p></div></li>
          <li class="workflow-step"><span class="step-badge step-2" aria-hidden="true">2</span><div><strong>Size with HRP or risk parity</strong><p>Size positions by <strong>volatility risk contribution</strong> rather than subjective return guesses, using PyPortfolioOpt (HRP) or Riskfolio (ERC).</p></div></li>
          <li class="workflow-step"><span class="step-badge step-3" aria-hidden="true">3</span><div><strong>Stress-test the downside</strong><p>Run QuantStats crisis teardowns (2000 Dot-Com, 2008 Lehman, 2022 Stagflation). If drawdown breaches your tolerance, increase liquidity.</p></div></li>
        </ol>
      </div>

      <section class="card" aria-labelledby="step1-title">
        <div class="card-header">
          <div>
            <div class="cluster"><span class="step-pill step-1">Step 1</span><h3 id="step1-title" class="card-title">Macro structural building blocks &amp; portfolio blueprints</h3></div>
            <span class="card-subtitle">Choose a battle-tested regime blueprint, or customise your own building-block allocation.</span>
          </div>
        </div>

        <h4 class="section-label">Classic regime presets</h4>
        <div class="preset-grid mb-5" role="group" aria-label="Regime presets">${presetsHtml}</div>

        <div class="panel mb-4">
          <div class="row-between wrap-gap mb-3">
            <h4 class="section-label" style="margin:0">Macro regime inventory &amp; asset building blocks</h4>
            <span class="text-muted text-xs">Click an ETF to add or remove it from the portfolio</span>
          </div>
          <div class="regime-grid">${regimesHtml}</div>
        </div>

        <div class="panel" id="active-holdings-editor">
          <div class="row-between wrap-gap mb-3">
            <div><strong>Current target allocation</strong> <span id="allocation-sum-indicator" class="alloc-total" role="status">Total: 100%</span></div>
            <div class="cluster">
              <button type="button" id="equalize-weights-btn" class="btn btn-secondary btn-sm">${icon("scale")} Equalise (1/N)</button>
              <button type="button" id="recalculate-all-btn" class="btn btn-primary btn-sm">${icon("zap")} Run robust parity &amp; stress test</button>
            </div>
          </div>
          <div id="holdings-inputs-row" class="holding-row"></div>
        </div>
      </section>

      <section class="card" aria-labelledby="step2-title">
        <div class="card-header">
          <div>
            <div class="cluster"><span class="step-pill step-2">Step 2</span><h3 id="step2-title" class="card-title">Position sizing via non-linear parity &amp; ML clustering</h3></div>
            <span class="card-subtitle">PyPortfolioOpt (HRP &amp; Mean-CVaR) vs Riskfolio-Lib (Equal Risk Contribution) vs traditional Markowitz</span>
          </div>
        </div>

        <div class="table-responsive mb-5" id="optimization-region">
          <table class="data-table" id="optimization-comparison-table">
            <caption class="sr-only">Optimisation methods compared for the current building blocks</caption>
            <thead>
              <tr>
                <th scope="col">Optimisation algorithm</th>
                <th scope="col">Model &amp; library</th>
                <th scope="col">Target weights</th>
                <th scope="col" class="num">Est. volatility</th>
                <th scope="col">Key resilience advantage</th>
                <th scope="col"><span class="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody id="optimization-table-body">
              <tr><td colspan="6" class="text-muted">Waiting for the analytics engine…</td></tr>
            </tbody>
          </table>
        </div>

        <div class="grid-2">
          <div class="panel" id="risk-chart-panel">
            ${UI.chart.frameHtml({
              title: "Nominal weight vs share of portfolio risk",
              subtitle: "The 60/40 equity trap: one asset can drive most of the variance on a fraction of the capital.",
              legend: `<span class="legend-item" role="listitem"><span class="legend-key is-rect" style="--c:var(--series-1)"></span>Nominal allocation</span><span class="legend-item" role="listitem"><span class="legend-key is-rect" style="--c:var(--series-2)"></span>Share of portfolio risk</span>`,
              plotStyle: "height:260px",
            })}
            <p id="risk-insight" class="text-secondary text-sm mt-3" role="status"></p>
          </div>
          <div class="panel" id="dendro-chart-panel">
            ${UI.chart.frameHtml({
              title: "HRP dendrogram",
              subtitle: "Hierarchical clustering orders assets by correlation distance d = √(2(1 − ρ)).",
              plotStyle: "height:260px",
            })}
          </div>
        </div>
      </section>

      <section class="card" aria-labelledby="step3-title">
        <div class="card-header">
          <div>
            <div class="cluster"><span class="step-pill step-3">Step 3</span><h3 id="step3-title" class="card-title">Downside stress-testing &amp; QuantStats teardown</h3></div>
            <span class="card-subtitle">Performance across canonical historical macro crises vs 100% equity and 60/40 benchmarks.</span>
          </div>
        </div>

        <div class="panel mb-5">
          <div class="row-between wrap-gap mb-2">
            <label for="tolerance-slider" class="tolerance-label">${icon("target")} Behavioural drawdown tolerance limit: <strong id="tolerance-val-display">-20.0%</strong></label>
            <span class="text-muted text-xs">Your psychological threshold before panic-selling at the bottom</span>
          </div>
          <input type="range" id="tolerance-slider" min="-45" max="-10" step="1" value="${behavioralTolerance}" class="tolerance-slider" aria-valuetext="${behavioralTolerance} percent" />
          <div id="tolerance-alert-box" class="mt-3" aria-live="polite"></div>
        </div>

        <div id="crisis-cards-container" class="crisis-grid mb-5"></div>

        <h4 class="card-title mb-3">QuantStats downside tear-sheet</h4>
        <div id="quantstats-tearsheet-container"></div>
      </section>`;

    UI.chart.wireFrame(container.querySelector("#risk-chart-panel"));
    UI.chart.wireFrame(container.querySelector("#dendro-chart-panel"));
    renderHoldingsInputs();
    updateToleranceLabel();
    syncChips();
  }

  function chipHtml(t) {
    const selected = Object.prototype.hasOwnProperty.call(activePortfolio, t);
    return `<button type="button" class="badge block-ticker-badge ${selected ? "badge-acc" : "badge-neutral"}" data-ticker="${esc(t)}" aria-pressed="${selected}" aria-label="${esc(t)}">${esc(t)} ${selected ? `(${esc(activePortfolio[t])}%)` : icon("plus")}</button>`;
  }

  /** Update chips, editor, and preset state after the allocation changes. */
  function refreshSelectionUi() {
    syncChips();
    renderHoldingsInputs();
    syncPresetPressed();
  }

  function syncChips() {
    document.querySelectorAll(".block-ticker-badge").forEach((btn) => {
      const t = btn.dataset.ticker;
      const selected = Object.prototype.hasOwnProperty.call(activePortfolio, t);
      btn.className = `badge block-ticker-badge ${selected ? "badge-acc" : "badge-neutral"}`;
      btn.setAttribute("aria-pressed", String(selected));
      btn.innerHTML = `${esc(t)} ${selected ? `(${esc(activePortfolio[t])}%)` : icon("plus")}`;
    });
  }

  function syncPresetPressed() {
    document.querySelectorAll(".preset-regime-btn").forEach((btn) => {
      const on = btn.dataset.preset === activePreset;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  }

  function renderHoldingsInputs() {
    const row = document.getElementById("holdings-inputs-row");
    if (!row) return;
    const entries = Object.entries(activePortfolio);
    row.innerHTML = entries.length
      ? entries
          .map(([t, w]) => `
            <div class="holding-chip">
              <strong class="ticker">${esc(t)}</strong>
              <label class="sr-only" for="hw-${esc(t)}">Weight of ${esc(t)} in percent</label>
              <input id="hw-${esc(t)}" type="number" class="holding-weight-input" data-ticker="${esc(t)}" value="${esc(w)}" min="0" max="100" step="any" inputmode="decimal" />
              <span class="text-muted text-xs" aria-hidden="true">%</span>
              <button type="button" class="remove-ticker-btn" data-ticker="${esc(t)}" aria-label="Remove ${esc(t)}">${icon("x")}</button>
            </div>`)
          .join("")
      : `<span class="text-muted text-sm">Select at least one building block above.</span>`;
    updateSumIndicator();
  }

  function normalizeActiveWeights() {
    const total = Object.values(activePortfolio).reduce((a, b) => a + b, 0);
    if (total <= 0) return;
    for (const k in activePortfolio) activePortfolio[k] = parseFloat(((activePortfolio[k] / total) * 100).toFixed(1));
  }

  function updateSumIndicator() {
    const total = Object.values(activePortfolio).reduce((a, b) => a + b, 0);
    const ind = document.getElementById("allocation-sum-indicator");
    if (!ind) return;
    const ok = Math.abs(total - 100) < 0.5;
    ind.textContent = `Total: ${total.toFixed(1)}%${ok ? "" : " (normalised on run)"}`;
    ind.classList.toggle("is-off", !ok);
  }

  function updateToleranceLabel() {
    const disp = document.getElementById("tolerance-val-display");
    if (disp) disp.textContent = `${behavioralTolerance.toFixed(1)}%`;
    document.getElementById("tolerance-slider")?.setAttribute("aria-valuetext", `${behavioralTolerance} percent`);
  }

  /* ------------------------------------------------------------- analytics */
  const post = (url, body) =>
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))));

  function setBusy(on) {
    ["optimization-region", "risk-chart-panel", "dendro-chart-panel", "crisis-cards-container", "quantstats-tearsheet-container"].forEach((id) => {
      document.getElementById(id)?.classList.toggle("is-refreshing", on);
    });
    const btn = document.getElementById("recalculate-all-btn");
    if (btn) { btn.disabled = on; btn.classList.toggle("is-loading", on); }
  }

  async function runAllAnalytics() {
    normalizeActiveWeights();
    refreshSelectionUi(); // show the normalised weights
    const tickers = Object.keys(activePortfolio);
    if (tickers.length === 0) return;

    const myRun = ++runId;
    setBusy(true);
    const [opt, stress, tear] = await Promise.allSettled([
      post("/api/portfolio/optimize", { tickers, method: "all" }),
      post("/api/portfolio/stress-test", { portfolio: activePortfolio, behavioralTolerance }),
      post("/api/portfolio/teardown", { portfolio: activePortfolio }),
    ]);
    if (myRun !== runId) return; // superseded by a newer run
    setBusy(false);

    optimizationData = opt.status === "fulfilled" ? opt.value : null;
    stressTestData = stress.status === "fulfilled" ? stress.value : null;
    tearSheetData = tear.status === "fulfilled" ? tear.value : null;

    if (!optimizationData && !stressTestData && !tearSheetData) {
      renderUnavailable();
      return;
    }
    renderOptimizationResults();
    renderStressTestResults();
    renderTearSheetResults();
  }

  async function refreshStressOnly() {
    if (Object.keys(activePortfolio).length === 0) return;
    try {
      stressTestData = await post("/api/portfolio/stress-test", { portfolio: activePortfolio, behavioralTolerance });
      renderStressTestResults();
    } catch (e) { /* keep the current render */ }
  }

  function unavailableHtml() {
    return `<div class="callout callout-warning">${icon("alert")}<div>
      <div class="callout-title">Analytics engine unreachable</div>
      HRP, risk parity, CVaR and the crisis stress tests are computed by the local server. Start it with <code>uv run apex-etf</code> (or <code>python3 server.py</code>) and press Retry.
      <div class="mt-2"><button type="button" class="btn btn-secondary btn-sm parity-retry-btn">${icon("refresh")} Retry</button></div>
    </div></div>`;
  }

  function renderUnavailable() {
    document.getElementById("optimization-table-body").innerHTML = `<tr><td colspan="6">${unavailableHtml()}</td></tr>`;
    ["risk-chart-panel", "dendro-chart-panel"].forEach((id) => {
      const host = document.querySelector(`#${id} [data-view-panel="chart"]`);
      if (host) { host.querySelector("svg")?.remove(); }
    });
    document.getElementById("risk-insight").textContent = "";
    document.getElementById("crisis-cards-container").innerHTML = unavailableHtml();
    document.getElementById("quantstats-tearsheet-container").innerHTML = "";
    document.getElementById("tolerance-alert-box").innerHTML = "";
  }

  /* ---------------------------------------------------- step 2: optimisation */
  function renderOptimizationResults() {
    const tbody = document.getElementById("optimization-table-body");
    if (!tbody) return;
    const methods = optimizationData?.methods;
    if (!methods) {
      tbody.innerHTML = `<tr><td colspan="6">${unavailableHtml()}</td></tr>`;
      return;
    }

    tbody.innerHTML = METHOD_ORDER.map((key) => {
      const m = methods[key];
      if (!m) return "";
      const recommended = key === "hrp" || key === "equalRiskContribution";
      const weights = Object.entries(m.weights || {})
        .map(([t, w]) => `<span class="w-chip"><strong>${esc(t)}</strong> ${esc(fmt.num(w, 1))}%</span>`)
        .join("");
      return `
        <tr class="${recommended ? "highlight-row" : ""}">
          <th scope="row" class="algo-cell">
            <div class="cluster"><strong>${esc(m.name)}</strong>${recommended ? `<span class="badge badge-acc badge-sm">Recommended</span>` : ""}</div>
            <div class="text-muted text-xs">${esc(m.tag)}</div>
          </th>
          <td><span class="badge badge-blue">${esc(m.library)}</span></td>
          <td><div class="cluster w-chips">${weights}</div></td>
          <td class="num"><strong>${esc(fmt.pct(m.volatility, 2))}</strong></td>
          <td class="algo-desc">${esc(m.description)}</td>
          <td><button type="button" class="btn btn-secondary btn-sm apply-optimized-weights-btn" data-method="${key}" aria-label="Apply ${esc(m.name)} weights">${icon("check")} Apply</button></td>
        </tr>`;
    }).join("");

    renderRiskDecomposition();
    renderDendrogram();
  }

  /** Risk contribution of the CURRENT portfolio: w_i·(Σw)_i / wᵀΣw, from the API covariance. */
  function currentRiskContributions() {
    const tickers = optimizationData?.tickers;
    const cov = optimizationData?.shrinkage?.sampleCovariance;
    if (!Array.isArray(tickers) || !Array.isArray(cov) || cov.length !== tickers.length) return null;
    const total = tickers.reduce((s, t) => s + (activePortfolio[t] || 0), 0);
    if (total <= 0) return null;
    const w = tickers.map((t) => (activePortfolio[t] || 0) / total);
    const sigmaW = cov.map((row) => row.reduce((s, c, j) => s + c * w[j], 0));
    const variance = w.reduce((s, wi, i) => s + wi * sigmaW[i], 0);
    if (!(variance > 0)) return null;
    return tickers.map((t, i) => ({
      ticker: t,
      weight: w[i] * 100,
      risk: ((w[i] * sigmaW[i]) / variance) * 100,
    }));
  }

  function barPath(x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h));
    return `M${x} ${y + h}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h}Z`;
  }

  function renderRiskDecomposition() {
    const panel = document.getElementById("risk-chart-panel");
    const host = panel?.querySelector('[data-view-panel="chart"]');
    const tableHost = panel?.querySelector('[data-view-panel="table"]');
    const insight = document.getElementById("risk-insight");
    if (!host) return;

    host.querySelector(".chart-empty")?.remove();
    const data = currentRiskContributions();
    if (!data) {
      host.querySelector("svg")?.remove();
      host.insertAdjacentHTML("afterbegin", `<p class="text-muted text-sm chart-empty">Risk decomposition needs the covariance matrix from the analytics engine.</p>`);
      if (insight) insight.textContent = "";
      return;
    }

    tableHost.textContent = "";
    tableHost.appendChild(UI.chart.dataTable({
      caption: "Nominal allocation versus share of portfolio risk",
      columns: [
        { key: "ticker", label: "Asset" },
        { key: "weight", label: "Nominal allocation", align: "right", format: (v) => fmt.pct(v, 1) },
        { key: "risk", label: "Share of risk", align: "right", format: (v) => fmt.pct(v, 1) },
      ],
      rows: data,
    }));

    const top = data.slice().sort((a, b) => b.risk - a.risk)[0];
    if (insight) {
      insight.textContent = data.length > 1
        ? `${top.ticker} drives ${fmt.pct(top.risk, 1)} of this portfolio's risk on ${fmt.pct(top.weight, 1)} of the capital.`
        : "";
    }

    const tooltip = host._tip || (host._tip = UI.chart.tooltip(host));
    UI.chart.mountResponsive(host, (width) => {
      const height = host.clientHeight || 260;
      const pad = { top: 22, right: 12, bottom: 34, left: 40 };
      const plotW = width - pad.left - pad.right;
      const plotH = height - pad.top - pad.bottom;
      const n = data.length;
      const band = Math.min(plotW / n, 160); // few assets → keep groups compact
      const startX = pad.left + (plotW - band * n) / 2;
      const barW = Math.max(8, Math.min(24, band * 0.3));
      const gap = 2;
      const Y = (v) => pad.top + plotH - (Math.max(0, Math.min(100, v)) / 100) * plotH;
      const showValues = band >= 64;

      const grid = [0, 25, 50, 75, 100]
        .map((t) => `<line class="chart-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${Y(t)}" y2="${Y(t)}"></line>
                     <text class="chart-axis-text" x="${pad.left - 6}" y="${Y(t) + 4}" text-anchor="end">${t}%</text>`)
        .join("");

      const groups = data.map((d, i) => {
        const cx = startX + band * i + band / 2;
        const x1 = cx - barW - gap / 2;
        const x2 = cx + gap / 2;
        const h1 = Math.max(1, pad.top + plotH - Y(d.weight));
        const h2 = Math.max(1, pad.top + plotH - Y(d.risk));
        return `
          <g class="bar-group" data-i="${i}" tabindex="0" role="img"
             aria-label="${esc(d.ticker)}: nominal allocation ${esc(fmt.pct(d.weight, 1))}, share of portfolio risk ${esc(fmt.pct(d.risk, 1))}">
            <rect class="bar-hit" x="${startX + band * i}" y="${pad.top}" width="${band}" height="${plotH}" fill="transparent"></rect>
            <path d="${barPath(x1, pad.top + plotH - h1, barW, h1, 4)}" fill="var(--series-1)"></path>
            <path d="${barPath(x2, pad.top + plotH - h2, barW, h2, 4)}" fill="var(--series-2)"></path>
            ${showValues ? `<text class="chart-label" x="${x1 + barW / 2}" y="${pad.top + plotH - h1 - 5}" text-anchor="middle">${esc(fmt.num(d.weight, 0))}%</text>
                            <text class="chart-label" x="${x2 + barW / 2}" y="${pad.top + plotH - h2 - 5}" text-anchor="middle">${esc(fmt.num(d.risk, 0))}%</text>` : ""}
            <text class="chart-label tick-label" x="${cx}" y="${height - pad.bottom + 18}" text-anchor="middle">${esc(d.ticker)}</text>
          </g>`;
      }).join("");

      host.querySelector("svg")?.remove();
      host.insertAdjacentHTML("afterbegin", `
        <svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="group" aria-label="Grouped bar chart comparing each asset's nominal allocation with its share of portfolio risk. Open the table view for the numbers.">
          ${grid}
          <line class="chart-axis-line" x1="${pad.left}" x2="${width - pad.right}" y1="${pad.top + plotH}" y2="${pad.top + plotH}"></line>
          ${groups}
        </svg>`);

      host.querySelectorAll(".bar-group").forEach((g) => {
        const d = data[Number(g.dataset.i)];
        const show = () => {
          const cx = startX + band * Number(g.dataset.i) + band / 2;
          tooltip.show({
            x: cx,
            y: pad.top + plotH / 3,
            title: d.ticker,
            rows: [
              { color: "var(--series-1)", value: fmt.pct(d.weight, 1), label: "nominal allocation" },
              { color: "var(--series-2)", value: fmt.pct(d.risk, 1), label: "share of portfolio risk" },
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

  /* ----------------------------------------------------------- dendrogram */
  function collectMerges(node, out) {
    if (!node || (node.left == null && node.right == null)) return;
    const leaves = (n) => (n.ticker ? [n.ticker] : [...leaves(n.left), ...leaves(n.right)]);
    out.push({ members: leaves(node).join(" + "), distance: node.distance });
    collectMerges(node.left, out);
    collectMerges(node.right, out);
  }

  function renderDendrogram() {
    const panel = document.getElementById("dendro-chart-panel");
    const host = panel?.querySelector('[data-view-panel="chart"]');
    const tableHost = panel?.querySelector('[data-view-panel="table"]');
    if (!host) return;

    const hrp = optimizationData?.methods?.hrp;
    const tree = hrp?.dendrogramTree;
    const order = hrp?.seriatedOrder || Object.keys(activePortfolio);

    host.querySelector(".chart-empty")?.remove();
    if (!tree || order.length < 2) {
      host.querySelector("svg")?.remove();
      host.insertAdjacentHTML("afterbegin", `<p class="text-muted text-sm chart-empty">Dendrogram clustering needs two or more assets.</p>`);
      tableHost.textContent = "";
      return;
    }

    const merges = [];
    collectMerges(tree, merges);
    merges.sort((a, b) => a.distance - b.distance);
    tableHost.textContent = "";
    const orderNote = document.createElement("p");
    orderNote.className = "text-secondary text-sm mb-3";
    orderNote.textContent = `Seriated order: ${order.join(" → ")}`;
    tableHost.appendChild(orderNote);
    tableHost.appendChild(UI.chart.dataTable({
      caption: "Cluster merges ordered by correlation distance",
      columns: [
        { key: "members", label: "Cluster members" },
        { key: "distance", label: "Merge distance", align: "right", format: (v) => fmt.num(v, 3) },
      ],
      rows: merges,
    }));

    const tooltip = host._tip || (host._tip = UI.chart.tooltip(host));
    UI.chart.mountResponsive(host, (width) => {
      const height = host.clientHeight || 260;
      const pad = { top: 16, right: 20, bottom: 34, left: 44 };
      const plotW = width - pad.left - pad.right;
      const plotH = height - pad.top - pad.bottom;
      const maxDist = Math.max(tree.distance || 1, 0.01);
      const scale = UI.chart.niceScale(0, maxDist, 4);
      const baseY = pad.top + plotH;
      const Y = (d) => baseY - (d / scale.max) * plotH;
      const step = plotW / Math.max(1, order.length - 1);
      const leafX = {};
      order.forEach((t, i) => { leafX[t] = order.length === 1 ? pad.left + plotW / 2 : pad.left + i * step; });

      let paths = "";
      let nodes = "";
      let nodeIndex = 0;
      const nodeInfo = [];
      (function walk(node) {
        if (node.left == null && node.right == null) return { x: leafX[node.ticker] ?? pad.left, y: baseY };
        const l = walk(node.left);
        const r = walk(node.right);
        const y = Y(node.distance || 0);
        paths += `<path d="M${l.x} ${l.y}V${y}H${r.x}V${r.y}" fill="none" stroke="var(--series-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`;
        const x = (l.x + r.x) / 2;
        const leaves = (n) => (n.ticker ? [n.ticker] : [...leaves(n.left), ...leaves(n.right)]);
        const idx = nodeIndex++;
        nodeInfo.push({ members: leaves(node).join(" + "), distance: node.distance });
        nodes += `<g class="dn" data-i="${idx}" tabindex="0" role="img" aria-label="Cluster ${esc(leaves(node).join(" and "))}, merge distance ${esc(fmt.num(node.distance, 3))}">
                    <circle cx="${x}" cy="${y}" r="14" fill="transparent"></circle>
                    <circle class="dn-dot" cx="${x}" cy="${y}" r="4.5" fill="var(--chart-surface)" stroke="var(--series-1)" stroke-width="2"></circle>
                  </g>`;
        return { x, y };
      })(tree);

      const leaves = order.map((t) => `
        <circle cx="${leafX[t]}" cy="${baseY}" r="5" fill="var(--series-1)" stroke="var(--chart-surface)" stroke-width="2"></circle>
        <text class="chart-label tick-label" x="${leafX[t]}" y="${baseY + 20}" text-anchor="middle">${esc(t)}</text>`).join("");

      const grid = scale.ticks
        .map((t) => `<line class="chart-grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${Y(t)}" y2="${Y(t)}"></line>
                     <text class="chart-axis-text" x="${pad.left - 6}" y="${Y(t) + 4}" text-anchor="end">${esc(fmt.num(t, 1))}</text>`)
        .join("");

      host.querySelector("svg")?.remove();
      host.insertAdjacentHTML("afterbegin", `
        <svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="group" aria-label="HRP dendrogram. Assets are ordered by correlation distance; open the table view for the cluster merges.">
          ${grid}
          <line class="chart-axis-line" x1="${pad.left}" x2="${width - pad.right}" y1="${baseY}" y2="${baseY}"></line>
          <text class="chart-axis-text" transform="translate(10 ${pad.top + plotH / 2}) rotate(-90)" text-anchor="middle">Correlation distance</text>
          ${paths}${leaves}${nodes}
        </svg>`);

      host.querySelectorAll(".dn").forEach((g) => {
        const info = nodeInfo[Number(g.dataset.i)];
        const c = g.querySelector(".dn-dot");
        const show = () => tooltip.show({
          x: Number(c.getAttribute("cx")),
          y: Number(c.getAttribute("cy")),
          title: info.members,
          rows: [{ dot: true, color: "var(--series-1)", value: fmt.num(info.distance, 3), label: "merge distance" }],
        });
        g.addEventListener("pointerenter", show);
        g.addEventListener("pointerleave", () => tooltip.hide());
        g.addEventListener("focus", show);
        g.addEventListener("blur", () => tooltip.hide());
      });
    });
  }

  /* ------------------------------------------------------------ step 3 */
  function crisisCard(c) {
    const vals = [
      { label: "Your portfolio", v: c.portfolioDrawdown, focus: true },
      { label: "100% equity", v: c.benchmarkEquityDrawdown, focus: false },
      { label: "Classic 60/40", v: c.benchmark6040Drawdown, focus: false },
    ];
    const lo = Math.min(0, ...vals.map((x) => x.v));
    const hi = Math.max(0, ...vals.map((x) => x.v));
    const span = hi - lo || 1;
    const zero = ((0 - lo) / span) * 100;
    const alpha = Number(c.outperformanceVsEquity);

    const bars = vals.map((x) => {
      const start = (Math.min(0, x.v) - lo) / span * 100;
      const w = Math.abs(x.v) / span * 100;
      return `<div class="cb-row">
        <span class="cb-label">${esc(x.label)}</span>
        <div class="cb-track" aria-hidden="true"><span class="cb-zero" style="left:${zero.toFixed(1)}%"></span><span class="cb-bar${x.focus ? " is-focus" : ""}${x.v < 0 ? " is-neg" : " is-pos"}" style="left:${start.toFixed(1)}%;width:${Math.max(0.8, w).toFixed(1)}%"></span></div>
        <strong class="cb-val ${x.v >= 0 ? "val-positive" : "val-negative"}">${esc(fmt.pct(x.v, 1, { sign: true }))}</strong>
      </div>`;
    }).join("");

    return `
      <article class="crisis-card ${alpha >= 0 ? "is-good" : "is-bad"}">
        <header class="row-between">
          <h5 class="crisis-name">${esc(c.name)}</h5>
          <span class="badge badge-neutral badge-sm">${esc(c.durationMonths)} mo.</span>
        </header>
        <div class="text-muted text-xs mb-3">${esc(c.period)}</div>
        <div class="crisis-bars" role="group" aria-label="${esc(c.name)}: ${vals.map((x) => `${x.label} ${fmt.pct(x.v, 1, { sign: true })}`).join(", ")}">${bars}</div>
        <div class="crisis-alpha ${alpha >= 0 ? "val-positive" : "val-negative"}"><span aria-hidden="true">${alpha >= 0 ? "▲" : "▼"}</span> ${alpha >= 0 ? "Outperformed" : "Underperformed"} all-world equity by ${esc(fmt.pct(Math.abs(alpha), 1))}</div>
        <p class="crisis-dynamics">💡 ${esc(c.regimeDynamics)}</p>
      </article>`;
  }

  function renderStressTestResults() {
    if (!stressTestData) return;
    renderToleranceAlert(stressTestData);
    const container = document.getElementById("crisis-cards-container");
    if (!container || !stressTestData.crises) return;
    container.innerHTML = stressTestData.crises.map((c) => crisisCard(c)).join("");
  }

  function renderToleranceAlert(data) {
    const box = document.getElementById("tolerance-alert-box");
    if (!box) return;
    const worst = Number(data.worstHistoricalDrawdown) || 0;
    const breached = worst < behavioralTolerance;

    if (breached) {
      const gap = Math.abs(worst - behavioralTolerance).toFixed(1);
      box.innerHTML = `
        <div class="callout callout-danger">${icon("alert")}<div>
          <div class="callout-title">Behavioural drawdown warning — breach by ${esc(gap)} points</div>
          <div>${esc(data.remedyAdvice || "")}</div>
          <div class="mt-2"><button type="button" id="apply-remedy-btn" class="btn btn-secondary btn-sm">${icon("shield")} Add +${esc(Math.round(data.recommendedCashShift || 15))}% XEON liquidity buffer</button></div>
        </div></div>`;
    } else {
      box.innerHTML = `<div class="callout callout-success">${icon("check")}<div><div class="callout-title">Stress test passed</div>Worst drawdown of ${esc(fmt.pct(worst, 1))} sits inside your ${esc(fmt.pct(behavioralTolerance, 1))} behavioural threshold.</div></div>`;
    }
  }

  function renderTearSheetResults() {
    const container = document.getElementById("quantstats-tearsheet-container");
    if (!container || !tearSheetData?.metrics) return;
    const m = tearSheetData.metrics;
    const tile = (label, value, sub, cls = "") =>
      `<div class="metric-box"><span class="metric-label">${esc(label)}</span><span class="metric-value ${cls}">${value}</span><span class="metric-sub">${esc(sub)}</span></div>`;

    container.innerHTML = `
      <div class="grid-4">
        ${tile("Expected CAGR", esc(fmt.pct(m.cagr, 2)), "Compounded annual return")}
        ${tile("Annual volatility", esc(fmt.pct(m.annualizedVolatility, 2)), "Portfolio standard deviation")}
        ${tile("Sharpe ratio (Rf 2.5%)", esc(fmt.num(m.sharpeRatio, 2)), "Excess return per unit of total risk")}
        ${tile("Sortino (downside vol)", esc(fmt.num(m.sortinoRatio, 2)), "Penalises only negative drawdowns")}
        ${tile("Tail ratio (95th / 5th)", esc(fmt.num(m.tailRatio, 2)), "Above 1.0 = positive upside asymmetry")}
        ${tile("Conditional DaR (95%)", esc(fmt.pct(m.cdar95, 2)), "Average depth of the 5% worst drawdowns", "val-negative")}
        ${tile("Ulcer index", esc(fmt.num(m.ulcerIndex, 2)), "Penalises drawdown depth and length")}
        ${tile("Safe withdrawal rate (30Y)", esc(fmt.pct(m.swr30Y, 2)), "Portfolio Charts retirement model")}
      </div>`;
  }

  /* --------------------------------------------------------------- dialogs */
  function ensureDialogs() {
    if (document.getElementById("quant-code-modal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div id="quant-code-modal" class="modal-overlay">
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="quant-code-title" tabindex="-1">
          <button type="button" class="modal-close-btn" aria-label="Close script generator" data-dialog-close>&times;</button>
          <div class="modal-body">
            <div class="modal-head"><h2 id="quant-code-title" class="modal-title">💻 Open-source Python quant script generators</h2>
              <p class="text-muted text-sm mt-1">Ready-to-run scripts pre-filled with your current allocation.</p></div>
            <div class="pill-group mb-3" id="code-tabs" role="group" aria-label="Script library">
              <button type="button" class="pill-btn code-tab-btn active" data-tab="pyportfolioopt" aria-pressed="true">PyPortfolioOpt (HRP &amp; Mean-CVaR)</button>
              <button type="button" class="pill-btn code-tab-btn" data-tab="riskfolio" aria-pressed="false">Riskfolio-Lib (tail risk &amp; parity)</button>
              <button type="button" class="pill-btn code-tab-btn" data-tab="quantstats" aria-pressed="false">QuantStats (tear-sheet &amp; crises)</button>
            </div>
            <pre class="code-block" tabindex="0"><code id="quant-code-block">Loading…</code></pre>
            <div class="row-between mt-3"><span id="code-status" class="text-muted text-xs" role="status"></span>
              <button type="button" id="copy-code-btn" class="btn btn-primary btn-sm">${icon("copy")} Copy Python script</button></div>
          </div>
        </div>
      </div>

      <div id="platforms-modal" class="modal-overlay">
        <div class="modal-content modal-lg" role="dialog" aria-modal="true" aria-labelledby="platforms-title" tabindex="-1">
          <button type="button" class="modal-close-btn" aria-label="Close platforms hub" data-dialog-close>&times;</button>
          <div class="modal-body">
            <div class="modal-head"><h2 id="platforms-title" class="modal-title">🌐 Institutional no-code &amp; quant tools hub</h2>
              <p class="text-muted text-sm mt-1">The premier open-source quant libraries and no-code ETF backtesters.</p></div>
            <div id="platforms-modal-body"></div>
          </div>
        </div>
      </div>`);

    document.getElementById("code-tabs").addEventListener("click", (e) => {
      const btn = e.target.closest(".code-tab-btn");
      if (!btn) return;
      codeTab = btn.dataset.tab;
      document.querySelectorAll(".code-tab-btn").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      showCodeTab();
    });

    document.getElementById("copy-code-btn").addEventListener("click", async () => {
      const code = document.getElementById("quant-code-block").textContent || "";
      const ok = await UI.copy(code);
      UI.toast(ok ? "Python script copied to the clipboard." : "Couldn't copy — select the code and copy manually.", { type: ok ? "success" : "error" });
    });
  }

  function showCodeTab() {
    const block = document.getElementById("quant-code-block");
    const status = document.getElementById("code-status");
    if (!block) return;
    if (codeSnippets) {
      block.textContent = codeSnippets[codeTab] || codeSnippets.pyportfolioopt || "# No script available for this library.";
      status.textContent = "";
    } else {
      block.textContent = "# Scripts are generated by the local analytics server.\n# Start it with:  uv run apex-etf\n# then reopen this dialog.";
      status.textContent = "Server unreachable";
    }
  }

  async function openCodeDialog(opener) {
    UI.dialog.open("quant-code-modal", { opener });
    document.getElementById("quant-code-block").textContent = "Generating…";
    try {
      codeSnippets = await post("/api/portfolio/code-snippets", { portfolio: activePortfolio });
    } catch (e) {
      codeSnippets = null;
    }
    showCodeTab();
  }

  const FALLBACK_PLATFORMS = [
    { name: "Portfolio Visualizer", type: "Web Application", badge: "Institutional standards", url: "https://www.portfoliovisualizer.com", keyStrengths: "Built-in Risk Parity, factor regression, historical crisis periods.", bestUsedFor: "Comparing 60/40 vs All-Weather across rate cycles." },
    { name: "Testfol.io", type: "Web Application (Free)", badge: "Advanced backtesting", url: "https://testfol.io", keyStrengths: "Exceptional backtesting engine with custom leverage, simulated cash drag.", bestUsedFor: "Testing barbell strategies over multi-decade cycles." },
    { name: "Portfolio Charts", type: "Web Application", badge: "Drawdown survival", url: "https://portfoliocharts.com", keyStrengths: "Focuses entirely on drawdown survival, recovery times, and safe withdrawal rates.", bestUsedFor: "Evaluating robust, all-weather style portfolios." },
    { name: "PyPortfolioOpt", type: "Python Quant Library", badge: "Practical quant", url: "https://github.com/PyPortfolio/PyPortfolioOpt", keyStrengths: "Hierarchical Risk Parity (HRP), Mean-CVaR, and Ledoit-Wolf shrinkage.", bestUsedFor: "Robust optimisation without return-forecast fragility." },
    { name: "Riskfolio-Lib", type: "Python Quant Library", badge: "Gold-standard tail risk", url: "https://github.com/dcajasn/Riskfolio-Lib", keyStrengths: "24+ risk measures, CDaR, Equal Risk Contribution, Student-t fat tails.", bestUsedFor: "Deep downside tail-risk optimisation." },
    { name: "QuantStats", type: "Python Quant Library", badge: "Portfolio teardown", url: "https://github.com/ranaroussi/quantstats", keyStrengths: "Comprehensive HTML tear-sheets, specific historical crisis breakdowns.", bestUsedFor: "Post-allocation downside stress-testing." },
  ];

  async function openPlatformsDialog(opener) {
    const body = document.getElementById("platforms-modal-body");
    let platforms = [];
    try {
      const res = await fetch("/api/portfolio/platforms");
      if (res.ok) platforms = (await res.json()).platforms || [];
    } catch (e) { /* use the bundled list */ }
    if (platforms.length === 0) platforms = FALLBACK_PLATFORMS;

    body.innerHTML = `<div class="platform-grid">${platforms.map((p) => `
      <article class="panel platform-card">
        <div class="row-between"><strong>${esc(p.name)}</strong><span class="badge badge-neutral badge-sm">${esc(p.badge)}</span></div>
        <div class="text-muted text-xs mb-2">${esc(p.type)}</div>
        <p class="text-secondary text-sm mb-2"><strong>Key strength:</strong> ${esc(p.keyStrengths)}</p>
        <p class="text-secondary text-sm mb-3"><strong>Best used for:</strong> ${esc(p.bestUsedFor)}</p>
        ${UI.link(p.url, `${icon("external")} Open ${esc(p.name)}`, { cls: "btn btn-secondary btn-sm btn-block", html: true })}
      </article>`).join("")}</div>`;
    UI.dialog.open("platforms-modal", { opener });
  }

  return { init, renderInterface };
})();
