/**
 * Regime Resilience & Robust Risk Parity Module
 * Implements the 3-Step Decision-Making Workflow for Uncertain Macro Regimes:
 * 1. Structural Building Blocks Selection (Macro Regimes: Equity, Tilt, Bonds, Cash, Gold)
 * 2. Position Sizing via Non-Linear Optimization (HRP, Risk Parity / ERC, Mean-CVaR, Shrinkage)
 * 3. Downside Stress-Testing & Crisis Analysis (QuantStats historical crisis teardown & tolerance guardrails)
 * Plus Python Quant Code Generators (PyPortfolioOpt, Riskfolio, QuantStats) and No-Code Platforms.
 */

window.RegimeRiskParityModule = (function () {
  let allEtfs = [];
  let correlationsData = null;
  let etfsByTicker = {};

  // Active Portfolio State
  let activePortfolio = { VWCE: 60, AGGU: 40 };
  let selectedMethod = "hrp";
  let behavioralTolerance = -20.0;
  let optimizationData = null;
  let stressTestData = null;
  let tearSheetData = null;

  const presets = {
    "vwce_chill": {
      name: "Single-Fund 'VWCE and Chill'",
      tag: "Bogleheads Simplicity",
      desc: "100% Vanguard FTSE All-World (USD) Acc. Maximum long-term equity compounding, 100% drawdown exposure.",
      portfolio: { VWCE: 100 }
    },
    "classic_60_40": {
      name: "Institutional 60/40 Core",
      tag: "Traditional Benchmark",
      desc: "60% All-World + 40% Global Aggregate Bonds. The multi-asset baseline for balanced growth and duration defense.",
      portfolio: { VWCE: 60, AGGU: 40 }
    },
    "all_weather": {
      name: "Ray Dalio All-Weather Regime",
      tag: "All-Quadrant Resilience",
      desc: "30% Equities (VWCE), 40% Aggregate Bonds (AGGU), 15% Cash (€STR XEON), 7.5% Physical Gold (SGLD), 7.5% Critical Resources (RARE).",
      portfolio: { VWCE: 30, AGGU: 40, XEON: 15, SGLD: 7.5, RARE: 7.5 }
    },
    "permanent": {
      name: "Harry Browne Permanent Portfolio",
      tag: "Sleep-Well Four-Pillar",
      desc: "Equal 25% allocation across Equities (VWCE), Bonds (AGGU), Cash (XEON), and Physical Gold (SGLD).",
      portfolio: { VWCE: 25, AGGU: 25, XEON: 25, SGLD: 25 }
    },
    "golden_butterfly": {
      name: "Golden Butterfly Portfolio",
      tag: "Small-Cap Value Accelerated",
      desc: "20% Large US (SXR8) + 20% Small-Cap (IUSN) + 20% Agg Bonds (AGGU) + 20% Cash (XEON) + 20% Gold (SGLD).",
      portfolio: { SXR8: 20, IUSN: 20, AGGU: 20, XEON: 20, SGLD: 20 }
    },
    "barbell_regime": {
      name: "Growth & T-Bill Barbell Strategy",
      tag: "Zero Duration Risk",
      desc: "80% Global Equity (VWCE) + 20% Ultra-Short Cash Yield (€STR XEON). Eliminates bond duration crash risk.",
      portfolio: { VWCE: 80, XEON: 20 }
    },
    "tech_momentum_tilt": {
      name: "US Core + Tech Momentum Tilt",
      tag: "High Cyclical Beta",
      desc: "70% S&P 500 (SXR8) + 30% Information Technology (QDVE). High upside alpha with elevated rate-shock drawdown.",
      portfolio: { SXR8: 70, QDVE: 30 }
    }
  };

  const macroRegimes = [
    {
      id: "growth_equity",
      name: "Broad Growth & Global Equities",
      icon: "🌍",
      color: "var(--accent-blue)",
      role: "Capital growth during economic expansion regimes",
      tickers: ["VWCE", "IWDA", "SXR8", "VUAA", "MEUD", "IMAE", "IUSQ", "FWRA"]
    },
    {
      id: "factor_tilt",
      name: "Factor Tilts & Tech Momentum",
      icon: "⚡",
      color: "var(--accent-purple)",
      role: "Harvesting structural factor risk premia (Small-Cap, Quality, Tech)",
      tickers: ["IUSN", "GGRA", "QDVE", "VHYL", "EIMI", "XCS6", "AII", "WTAI"]
    },
    {
      id: "fixed_income",
      name: "Fixed Income & Intermediate Bonds",
      icon: "🛡️",
      color: "var(--accent-cyan)",
      role: "Deflation protection & flight-to-safety duration buffer",
      tickers: ["AGGU"]
    },
    {
      id: "liquidity_cash",
      name: "Ultra-Short Liquidity / Cash (€STR)",
      icon: "💶",
      color: "var(--accent-emerald)",
      role: "Duration-free dry powder earning risk-free overnight rates",
      tickers: ["XEON"]
    },
    {
      id: "real_assets",
      name: "Real Assets, Commodities & Gold",
      icon: "🪙",
      color: "var(--accent-amber)",
      role: "Stagflation, supply shocks, and monetary debasement hedge",
      tickers: ["SGLD", "RARE", "BATT"]
    }
  ];

  function init(etfs, correlations) {
    allEtfs = etfs || [];
    correlationsData = correlations || null;
    etfsByTicker = {};
    allEtfs.forEach(e => { etfsByTicker[e.ticker.toUpperCase()] = e; });

    renderInterface();
    runAllAnalytics();
  }

  function renderInterface() {
    const container = document.getElementById("regime-risk-parity-container");
    if (!container) return;

    container.innerHTML = `
      <!-- Header Banner & Workflow Guide -->
      <div class="card" style="margin-bottom: 24px; border-left: 4px solid var(--accent-emerald); background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);">
        <div class="card-header" style="padding-bottom: 8px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h2 class="card-title" style="margin-bottom: 0; font-size: 1.35rem;">
                🛡️ Regime Resilience &amp; Robust Risk Parity Studio
              </h2>
              <span class="stage-status-badge badge-essential">Stage 4: Regime Resilience &amp; Stress-Testing</span>
            </div>
            <span class="card-subtitle" style="font-size: 0.88rem; margin-top: 4px;">
              Moving beyond fragile Mean-Variance optimization to non-linear risk parity, machine learning dendrograms, and downside crisis stress-testing.
            </span>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button id="open-quant-code-btn" class="btn btn-secondary btn-sm">
              💻 Python Quant Scripts
            </button>
            <button id="open-platforms-btn" class="btn btn-secondary btn-sm">
              🌐 No-Code Web Platforms
            </button>
          </div>
        </div>

        <!-- 3-Step Interactive Workflow Banner -->
        <div class="grid-3" style="margin-top: 14px; gap: 12px;">
          <div class="metric-box" style="border: 1px solid rgba(59, 130, 246, 0.25); background: var(--bg-primary);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="background: var(--accent-blue); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;">1</span>
              <strong style="color: var(--text-primary); font-size: 0.88rem;">Pick Structural Building Blocks</strong>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
              Don't let an optimizer pick your assets. Manually select assets representing distinct economic regimes (Equities, Tilts, Bonds, Cash, Gold).
            </p>
          </div>

          <div class="metric-box" style="border: 1px solid rgba(16, 185, 129, 0.25); background: var(--bg-primary);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="background: var(--accent-emerald); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;">2</span>
              <strong style="color: var(--text-primary); font-size: 0.88rem;">Size with HRP or Risk Parity</strong>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
              Size positions by <strong>volatility risk contribution</strong> rather than subjective return guesses using PyPortfolioOpt (HRP) or Riskfolio (ERC).
            </p>
          </div>

          <div class="metric-box" style="border: 1px solid rgba(245, 158, 11, 0.25); background: var(--bg-primary);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="background: var(--accent-amber); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;">3</span>
              <strong style="color: var(--text-primary); font-size: 0.88rem;">Stress-Test the Downside</strong>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0; line-height: 1.4;">
              Run through QuantStats crisis teardowns (2000 Dot-Com, 2008 Lehman, 2022 Stagflation). If drawdown breaches tolerance, increase liquidity!
            </p>
          </div>
        </div>
      </div>

      <!-- WORKFLOW STEP 1: STRUCTURAL BUILDING BLOCKS -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: var(--accent-blue); color: #fff; font-weight: 800;">Step 1</span>
              <h3 class="card-title" style="margin-bottom: 0;">Macro Structural Building Blocks &amp; Portfolio Blueprints</h3>
            </div>
            <span class="card-subtitle">Choose from battle-tested regime blueprints or customize your building block allocations:</span>
          </div>
        </div>

        <!-- Presets Grid -->
        <div style="margin-bottom: 18px;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
            Classic Regime Presets:
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
            ${Object.entries(presets).map(([key, p]) => `
              <button class="btn btn-secondary preset-regime-btn ${key === 'classic_60_40' ? 'active' : ''}" data-preset="${key}" style="text-align: left; padding: 10px 14px; border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <strong style="color: var(--text-primary); font-size: 0.88rem;">${p.name}</strong>
                  <span class="badge badge-sm" style="font-size: 0.65rem; background: var(--bg-tertiary);">${p.tag}</span>
                </div>
                <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 4px; line-height: 1.3;">${p.desc}</div>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Regime Building Blocks Selector -->
        <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">
              Macro Regime Inventory &amp; Asset Building Blocks:
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Click any ETF tag to toggle its inclusion in the portfolio
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${macroRegimes.map(reg => `
              <div style="background: var(--bg-primary); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                  <span style="font-size: 1.1rem;">${reg.icon}</span>
                  <strong style="font-size: 0.8rem; color: var(--text-primary);">${reg.name}</strong>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 8px; line-height: 1.3;">${reg.role}</div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${reg.tickers.map(t => {
                    const isSelected = activePortfolio.hasOwnProperty(t);
                    return `
                      <button class="badge block-ticker-badge ${isSelected ? 'badge-acc' : 'badge-dist'}" data-ticker="${t}" style="cursor: pointer; font-size: 0.72rem; padding: 3px 7px;">
                        ${t} ${isSelected ? `(${activePortfolio[t]}%)` : '+'}
                      </button>
                    `;
                  }).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Active Holdings Allocation Bar & Inputs -->
        <div id="active-holdings-editor" style="background: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <div>
              <strong style="font-size: 0.9rem; color: var(--text-primary);">Current Target Allocation:</strong>
              <span id="allocation-sum-indicator" style="font-size: 0.8rem; font-weight: 700; margin-left: 8px; color: var(--accent-emerald);">Total: 100%</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button id="equalize-weights-btn" class="btn btn-secondary btn-sm" style="font-size: 0.75rem;">⚖️ Equalize (1/N)</button>
              <button id="recalculate-all-btn" class="btn btn-primary btn-sm">🚀 Run Robust Parity &amp; Stress Test</button>
            </div>
          </div>

          <div id="holdings-inputs-row" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>

      <!-- WORKFLOW STEP 2: SIZING VIA NON-LINEAR OPTIMIZATION -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: var(--accent-emerald); color: #fff; font-weight: 800;">Step 2</span>
              <h3 class="card-title" style="margin-bottom: 0;">Position Sizing via Non-Linear Parity &amp; ML Clustering</h3>
            </div>
            <span class="card-subtitle">PyPortfolioOpt (HRP &amp; Mean-CVaR) vs Riskfolio-Lib (Equal Risk Contribution) vs Traditional Markowitz</span>
          </div>
        </div>

        <!-- Algorithm Comparison Table -->
        <div class="table-responsive" style="margin-bottom: 20px;">
          <table class="data-table" id="optimization-comparison-table">
            <thead>
              <tr>
                <th>Optimization Algorithm</th>
                <th>Underlying Model &amp; Library</th>
                <th>Target Weights</th>
                <th>Est. Annual Volatility</th>
                <th>Key Resilience Advantage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="optimization-table-body">
              <tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Calculating robust allocations...</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Risk Decomposition & Dendrogram SVG Section -->
        <div class="grid-2" style="gap: 16px;">
          <!-- Risk Contribution Decomposition -->
          <div class="card" style="background: var(--bg-secondary); margin: 0;">
            <div class="card-header" style="padding-bottom: 4px;">
              <div>
                <h4 class="card-title" style="font-size: 0.95rem;">⚖️ Nominal Weight vs. Volatility Risk Contribution</h4>
                <span class="card-subtitle" style="font-size: 0.74rem;">The 60/40 Equity Trap: Equities dominate ~90% of variance unless equalized by Risk Parity.</span>
              </div>
            </div>
            <div id="risk-decomposition-chart" class="chart-container" style="height: 220px;">
              <!-- Rendered via SVG -->
            </div>
          </div>

          <!-- Dendrogram ML Graph Clustering Tree -->
          <div class="card" style="background: var(--bg-secondary); margin: 0;">
            <div class="card-header" style="padding-bottom: 4px;">
              <div>
                <h4 class="card-title" style="font-size: 0.95rem;">🌳 HRP Machine-Learning Dendrogram Tree</h4>
                <span class="card-subtitle" style="font-size: 0.74rem;">Hierarchical graph clustering orders assets by correlation distance d = √(2(1-ρ)).</span>
              </div>
            </div>
            <div id="dendrogram-tree-chart" class="chart-container" style="height: 220px;">
              <!-- Rendered via SVG -->
            </div>
          </div>
        </div>
      </div>

      <!-- WORKFLOW STEP 3: HISTORICAL CRISIS STRESS-TESTING & TEARDOWN -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: var(--accent-amber); color: #fff; font-weight: 800;">Step 3</span>
              <h3 class="card-title" style="margin-bottom: 0;">Downside Stress-Testing &amp; QuantStats Teardown</h3>
            </div>
            <span class="card-subtitle">Actual performance across canonical historical macro crises vs 100% Equity and 60/40 benchmarks:</span>
          </div>
        </div>

        <!-- Behavioral Drawdown Tolerance Guardrail Slider -->
        <div style="background: var(--bg-secondary); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
            <div>
              <strong style="color: var(--text-primary); font-size: 0.88rem;">🎯 Behavioral Drawdown Tolerance Limit:</strong>
              <span id="tolerance-val-display" style="font-weight: 800; color: var(--accent-amber); margin-left: 6px;">-20.0%</span>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">
              Adjust to reflect your psychological threshold before panic selling at market bottoms
            </span>
          </div>
          <input type="range" id="tolerance-slider" min="-45" max="-10" step="1" value="-20" style="width: 100%; accent-color: var(--accent-amber);" />
          <div id="tolerance-alert-box" style="margin-top: 10px;">
            <!-- Dynamically populated alert -->
          </div>
        </div>

        <!-- Crisis Breakdown Cards Grid -->
        <div id="crisis-cards-container" class="grid-3" style="gap: 12px; margin-bottom: 20px;">
          <!-- Dynamically populated crisis cards -->
        </div>

        <!-- QuantStats Comprehensive Downside Tear-Sheet -->
        <h4 class="card-title" style="font-size: 0.95rem; margin-top: 24px; margin-bottom: 10px;">
          📋 QuantStats Comprehensive Downside Tear-Sheet
        </h4>
        <div id="quantstats-tearsheet-container">
          <!-- Dynamically populated tear-sheet grid -->
        </div>
      </div>

      <!-- INTERACTIVE PLATFORMS & CODE MODALS -->
      <div id="quant-code-modal" class="modal-backdrop">
        <div class="modal-dialog" style="max-width: 850px;">
          <div class="modal-header">
            <h3 class="modal-title">💻 Open-Source Python Quant Script Generators</h3>
            <button class="modal-close-btn" id="close-quant-modal">&times;</button>
          </div>
          <div class="modal-body">
            <div style="display: flex; gap: 8px; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
              <button class="btn btn-secondary btn-sm code-tab-btn active" data-tab="pyportfolioopt">PyPortfolioOpt (HRP &amp; Mean-CVaR)</button>
              <button class="btn btn-secondary btn-sm code-tab-btn" data-tab="riskfolio">Riskfolio-Lib (Tail-Risk &amp; Parity)</button>
              <button class="btn btn-secondary btn-sm code-tab-btn" data-tab="quantstats">QuantStats (Tear-Sheet &amp; Crises)</button>
            </div>
            <div id="quant-code-display-container">
              <pre style="background: var(--bg-tertiary); padding: 14px; border-radius: var(--radius-sm); font-size: 0.78rem; overflow-x: auto; color: var(--text-primary); font-family: monospace; max-height: 400px;"><code id="quant-code-block">Loading code snippet...</code></pre>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
              <button id="copy-code-btn" class="btn btn-primary btn-sm">📋 Copy Python Script</button>
            </div>
          </div>
        </div>
      </div>

      <div id="platforms-modal" class="modal-backdrop">
        <div class="modal-dialog" style="max-width: 850px;">
          <div class="modal-header">
            <h3 class="modal-title">🌐 Institutional No-Code &amp; Quant Tools Hub</h3>
            <button class="modal-close-btn" id="close-platforms-modal">&times;</button>
          </div>
          <div class="modal-body" id="platforms-modal-body">
            <!-- Dynamically populated platform cards -->
          </div>
        </div>
      </div>
    `;

    bindInterfaceEvents();
    renderHoldingsInputs();
  }

  function bindInterfaceEvents() {
    // Preset buttons
    document.querySelectorAll(".preset-regime-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".preset-regime-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const presetKey = btn.dataset.preset;
        if (presets[presetKey]) {
          activePortfolio = { ...presets[presetKey].portfolio };
          renderHoldingsInputs();
          runAllAnalytics();
        }
      });
    });

    // Block ticker toggle badges
    document.querySelectorAll(".block-ticker-badge").forEach(badge => {
      badge.addEventListener("click", () => {
        const ticker = badge.dataset.ticker;
        if (activePortfolio.hasOwnProperty(ticker)) {
          delete activePortfolio[ticker];
        } else {
          activePortfolio[ticker] = 10;
        }
        normalizeActiveWeights();
        renderHoldingsInputs();
        runAllAnalytics();
      });
    });

    // Equalize weights
    document.getElementById("equalize-weights-btn")?.addEventListener("click", () => {
      const keys = Object.keys(activePortfolio);
      if (keys.length === 0) return;
      const eq = parseFloat((100.0 / keys.length).toFixed(1));
      keys.forEach(k => { activePortfolio[k] = eq; });
      normalizeActiveWeights();
      renderHoldingsInputs();
      runAllAnalytics();
    });

    // Run Recalculate
    document.getElementById("recalculate-all-btn")?.addEventListener("click", () => {
      runAllAnalytics();
    });

    // Tolerance slider
    const slider = document.getElementById("tolerance-slider");
    slider?.addEventListener("input", (e) => {
      behavioralTolerance = parseFloat(e.target.value);
      const disp = document.getElementById("tolerance-val-display");
      if (disp) disp.innerText = `${behavioralTolerance.toFixed(1)}%`;
      if (stressTestData) {
        renderToleranceAlert(stressTestData);
      }
    });

    // Modals
    document.getElementById("open-quant-code-btn")?.addEventListener("click", () => {
      document.getElementById("quant-code-modal")?.classList.add("active");
      loadQuantCodeSnippet("pyportfolioopt");
    });

    document.getElementById("close-quant-modal")?.addEventListener("click", () => {
      document.getElementById("quant-code-modal")?.classList.remove("active");
    });

    document.getElementById("open-platforms-btn")?.addEventListener("click", () => {
      document.getElementById("platforms-modal")?.classList.add("active");
      loadPlatformsContent();
    });

    document.getElementById("close-platforms-modal")?.addEventListener("click", () => {
      document.getElementById("platforms-modal")?.classList.remove("active");
    });

    // Code tabs
    document.querySelectorAll(".code-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".code-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        loadQuantCodeSnippet(btn.dataset.tab);
      });
    });

    // Copy code button
    document.getElementById("copy-code-btn")?.addEventListener("click", () => {
      const code = document.getElementById("quant-code-block")?.innerText || "";
      navigator.clipboard.writeText(code).then(() => {
        const copyBtn = document.getElementById("copy-code-btn");
        if (copyBtn) {
          copyBtn.innerText = "✅ Copied to Clipboard!";
          setTimeout(() => { copyBtn.innerText = "📋 Copy Python Script"; }, 2000);
        }
      });
    });
  }

  function renderHoldingsInputs() {
    const row = document.getElementById("holdings-inputs-row");
    if (!row) return;

    row.innerHTML = Object.entries(activePortfolio).map(([t, w]) => {
      return `
        <div style="display: flex; align-items: center; gap: 6px; background: var(--bg-secondary); padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <strong style="color: var(--accent-cyan); font-size: 0.85rem;">${t}</strong>
          <input type="number" class="holding-weight-input" data-ticker="${t}" value="${w}" min="1" max="100" step="1" style="width: 55px; padding: 2px 4px; font-size: 0.8rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); text-align: right;" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">%</span>
          <button class="remove-ticker-btn" data-ticker="${t}" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.9rem; padding: 0 4px;">&times;</button>
        </div>
      `;
    }).join("");

    // Bind inputs
    row.querySelectorAll(".holding-weight-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const ticker = e.target.dataset.ticker;
        const val = parseFloat(e.target.value) || 0;
        activePortfolio[ticker] = val;
        updateSumIndicator();
      });
    });

    row.querySelectorAll(".remove-ticker-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const ticker = btn.dataset.ticker;
        delete activePortfolio[ticker];
        normalizeActiveWeights();
        renderHoldingsInputs();
        runAllAnalytics();
      });
    });

    updateSumIndicator();
  }

  function normalizeActiveWeights() {
    const total = Object.values(activePortfolio).reduce((a, b) => a + b, 0);
    if (total <= 0) return;
    for (let k in activePortfolio) {
      activePortfolio[k] = parseFloat(((activePortfolio[k] / total) * 100).toFixed(1));
    }
  }

  function updateSumIndicator() {
    const total = Object.values(activePortfolio).reduce((a, b) => a + b, 0);
    const ind = document.getElementById("allocation-sum-indicator");
    if (ind) {
      ind.innerText = `Total: ${total.toFixed(1)}%`;
      ind.style.color = Math.abs(total - 100) < 0.5 ? "var(--accent-emerald)" : "var(--accent-amber)";
    }
  }

  async function runAllAnalytics() {
    normalizeActiveWeights();
    updateSumIndicator();

    const tickers = Object.keys(activePortfolio);
    if (tickers.length === 0) return;

    // 1. Optimization call
    try {
      const optRes = await fetch("/api/portfolio/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers, method: "all" })
      });
      if (optRes.ok) {
        optimizationData = await optRes.json();
      }
    } catch (e) {
      // Fallback local mock/computation if offline
    }

    // 2. Stress-test call
    try {
      const stressRes = await fetch("/api/portfolio/stress-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: activePortfolio, behavioralTolerance })
      });
      if (stressRes.ok) {
        stressTestData = await stressRes.json();
      }
    } catch (e) {}

    // 3. Teardown call
    try {
      const tearRes = await fetch("/api/portfolio/teardown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: activePortfolio })
      });
      if (tearRes.ok) {
        tearSheetData = await tearRes.json();
      }
    } catch (e) {}

    renderOptimizationResults();
    renderStressTestResults();
    renderTearSheetResults();
  }

  function renderOptimizationResults() {
    const tbody = document.getElementById("optimization-table-body");
    if (!tbody || !optimizationData || !optimizationData.methods) return;

    const methods = optimizationData.methods;
    const methodOrder = ["hrp", "equalRiskContribution", "meanCvar", "inverseVolatility", "equalWeight", "markowitzMeanVariance"];

    tbody.innerHTML = methodOrder.map(mKey => {
      const m = methods[mKey];
      if (!m) return "";

      const weightsStr = Object.entries(m.weights || {})
        .map(([t, w]) => `<strong>${t}</strong>: ${w}%`)
        .join(" | ");

      const isRecommended = mKey === "hrp" || mKey === "equalRiskContribution";

      return `
        <tr class="${isRecommended ? 'highlight-row' : ''}">
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <strong>${m.name}</strong>
              ${isRecommended ? '<span class="badge badge-acc" style="font-size: 0.65rem;">Recommended</span>' : ''}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${m.tag}</div>
          </td>
          <td><span class="badge badge-blue">${m.library}</span></td>
          <td style="font-size: 0.8rem; line-height: 1.4;">${weightsStr}</td>
          <td><strong style="color: var(--accent-emerald);">${m.volatility}%</strong></td>
          <td style="font-size: 0.76rem; color: var(--text-secondary); max-width: 250px;">${m.description}</td>
          <td>
            <button class="btn btn-secondary btn-sm apply-optimized-weights-btn" data-method="${mKey}" style="font-size: 0.72rem; padding: 4px 8px;">
              👉 Apply Weights
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Bind apply weight buttons
    tbody.querySelectorAll(".apply-optimized-weights-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const mKey = btn.dataset.method;
        if (methods[mKey] && methods[mKey].weights) {
          activePortfolio = { ...methods[mKey].weights };
          renderHoldingsInputs();
          runAllAnalytics();
        }
      });
    });

    renderRiskDecompositionChart();
    renderDendrogramChart();
  }

  function renderRiskDecompositionChart() {
    const container = document.getElementById("risk-decomposition-chart");
    if (!container || !optimizationData) return;

    const width = container.clientWidth || 450;
    const height = 220;
    const pad = { top: 20, right: 20, bottom: 40, left: 60 };

    const tickers = Object.keys(activePortfolio);
    if (tickers.length === 0) return;

    // Compare nominal weight vs risk contribution
    const nominalWeights = activePortfolio;
    const ercRc = optimizationData.methods?.equalRiskContribution?.riskContributions || {};

    const barWidth = Math.max(16, Math.min(36, (width - pad.left - pad.right) / (tickers.length * 2.5)));
    const groupWidth = (width - pad.left - pad.right) / tickers.length;

    let barsHtml = "";
    tickers.forEach((t, i) => {
      const xGroup = pad.left + i * groupWidth + groupWidth / 2;
      const nomW = nominalWeights[t] || 0;
      const rcW = ercRc[t] || (100 / tickers.length);

      const maxVal = 100;
      const nomHeight = (nomW / maxVal) * (height - pad.top - pad.bottom);
      const rcHeight = (rcW / maxVal) * (height - pad.top - pad.bottom);

      const yNom = height - pad.bottom - nomHeight;
      const yRc = height - pad.bottom - rcHeight;

      barsHtml += `
        <!-- Nominal Weight Bar -->
        <rect x="${xGroup - barWidth}" y="${yNom}" width="${barWidth - 2}" height="${nomHeight}" fill="var(--accent-blue)" rx="3">
          <title>${t} Nominal Weight: ${nomW.toFixed(1)}%</title>
        </rect>
        <text x="${xGroup - barWidth/2}" y="${yNom - 4}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${nomW.toFixed(0)}%</text>

        <!-- Risk Contribution Bar -->
        <rect x="${xGroup}" y="${yRc}" width="${barWidth - 2}" height="${rcHeight}" fill="var(--accent-emerald)" rx="3">
          <title>${t} Risk Contribution: ${rcW.toFixed(1)}%</title>
        </rect>
        <text x="${xGroup + barWidth/2}" y="${yRc - 4}" text-anchor="middle" font-size="9" fill="var(--accent-emerald)">${rcW.toFixed(0)}%</text>

        <!-- Ticker Label -->
        <text x="${xGroup}" y="${height - pad.bottom + 16}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--text-primary)">
          ${t}
        </text>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;">
        <!-- Legend -->
        <g transform="translate(${pad.left}, 12)">
          <rect x="0" y="0" width="10" height="10" fill="var(--accent-blue)" rx="2"/>
          <text x="14" y="9" font-size="10" fill="var(--text-secondary)">Nominal Allocation (%)</text>
          <rect x="145" y="0" width="10" height="10" fill="var(--accent-emerald)" rx="2"/>
          <text x="159" y="9" font-size="10" fill="var(--text-secondary)">Volatility Risk Contribution (%)</text>
        </g>
        <!-- Baseline -->
        <line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="var(--border-color)" stroke-width="1"/>
        ${barsHtml}
      </svg>
    `;
  }

  function renderDendrogramChart() {
    const container = document.getElementById("dendrogram-tree-chart");
    if (!container || !optimizationData) return;

    const width = container.clientWidth || 450;
    const height = 220;
    const tree = optimizationData.methods?.hrp?.dendrogramTree;
    const seriated = optimizationData.methods?.hrp?.seriatedOrder || Object.keys(activePortfolio);

    if (!tree || seriated.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding-top: 80px;">Dendrogram clustering active with 2+ assets.</div>`;
      return;
    }

    const pad = { top: 30, right: 30, bottom: 40, left: 30 };
    const n = seriated.length;
    const stepX = (width - pad.left - pad.right) / Math.max(1, n - 1);

    // Leaves positions
    const leafPos = {};
    seriated.forEach((t, i) => {
      leafPos[t] = pad.left + i * stepX;
    });

    let pathsHtml = "";
    let nodesHtml = "";

    function traverse(node, depth = 0) {
      if (!node) return null;
      if (node.left === null && node.right === null) {
        const x = leafPos[node.ticker] || pad.left;
        const y = height - pad.bottom;
        return { x, y };
      }

      const leftCoords = traverse(node.left, depth + 1);
      const rightCoords = traverse(node.right, depth + 1);

      if (leftCoords && rightCoords) {
        const midX = (leftCoords.x + rightCoords.x) / 2;
        const nodeY = pad.top + Math.max(10, Math.min(height - pad.bottom - 30, 20 + depth * 35));

        // Inverted U branch
        pathsHtml += `
          <path d="M ${leftCoords.x} ${leftCoords.y} V ${nodeY} H ${rightCoords.x} V ${rightCoords.y}" fill="none" stroke="var(--accent-purple)" stroke-width="2" stroke-linecap="round"/>
        `;
        nodesHtml += `
          <circle cx="${midX}" cy="${nodeY}" r="4" fill="var(--accent-purple)" stroke="#fff" stroke-width="1.5">
            <title>Clustered Distance: ${node.distance || 0}</title>
          </circle>
        `;
        return { x: midX, y: nodeY };
      }
      return null;
    }

    traverse(tree);

    // Leaves labels
    const leavesHtml = seriated.map((t) => {
      const x = leafPos[t];
      return `
        <circle cx="${x}" cy="${height - pad.bottom}" r="5" fill="var(--accent-cyan)" stroke="#fff" stroke-width="1.5" />
        <text x="${x}" y="${height - pad.bottom + 18}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text-primary)">
          ${t}
        </text>
      `;
    }).join("");

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;">
        <text x="${pad.left}" y="18" font-size="10" fill="var(--text-muted)">Machine Learning Single-Linkage Dendrogram</text>
        ${pathsHtml}
        ${nodesHtml}
        ${leavesHtml}
      </svg>
    `;
  }

  function renderStressTestResults() {
    if (!stressTestData) return;
    renderToleranceAlert(stressTestData);

    const cardsContainer = document.getElementById("crisis-cards-container");
    if (!cardsContainer || !stressTestData.crises) return;

    cardsContainer.innerHTML = stressTestData.crises.map(c => {
      const isPositive = c.portfolioDrawdown >= 0;
      const alphaSign = c.outperformanceVsEquity >= 0 ? "+" : "";

      return `
        <div class="card" style="margin: 0; background: var(--bg-secondary); border-top: 3px solid ${c.outperformanceVsEquity >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <strong style="color: var(--text-primary); font-size: 0.9rem;">${c.name}</strong>
            <span class="badge badge-sm" style="font-size: 0.65rem;">${c.durationMonths} Mo.</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 10px;">${c.period}</div>

          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
            <span style="font-size: 0.75rem; color: var(--text-secondary);">Portfolio Return:</span>
            <strong style="font-size: 1.1rem; color: ${isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
              ${c.portfolioDrawdown > 0 ? '+' : ''}${c.portfolioDrawdown.toFixed(1)}%
            </strong>
          </div>

          <div style="background: var(--bg-primary); padding: 8px; border-radius: var(--radius-sm); font-size: 0.72rem; line-height: 1.4; color: var(--text-secondary); margin-bottom: 8px;">
            <div>100% Equity (VWCE): <strong class="val-negative">${c.benchmarkEquityDrawdown.toFixed(1)}%</strong></div>
            <div>Classic 60/40: <strong class="val-negative">${c.benchmark6040Drawdown.toFixed(1)}%</strong></div>
            <div style="margin-top: 4px; color: ${c.outperformanceVsEquity >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; font-weight: 700;">
              Alpha vs All-World: ${alphaSign}${c.outperformanceVsEquity.toFixed(1)}%
            </div>
          </div>

          <div style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.3;">
            💡 ${c.regimeDynamics}
          </div>
        </div>
      `;
    }).join("");
  }

  function renderToleranceAlert(data) {
    const box = document.getElementById("tolerance-alert-box");
    if (!box) return;

    const worstDd = data.worstHistoricalDrawdown || 0;
    const breached = worstDd < behavioralTolerance;

    if (breached) {
      const gap = Math.abs(worstDd - behavioralTolerance).toFixed(1);
      box.innerHTML = `
        <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid var(--accent-rose); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 0.8rem; color: var(--text-primary); line-height: 1.4;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; color: var(--accent-rose); margin-bottom: 4px;">
            ⚠️ Behavioral Drawdown Warning (Breach by ${gap}%)
          </div>
          <div>${data.remedyAdvice}</div>
          <div style="margin-top: 8px;">
            <button id="apply-remedy-btn" class="btn btn-secondary btn-sm" style="font-size: 0.72rem; border-color: var(--accent-rose);">
              🛡️ Auto-Inject +${Math.round(data.recommendedCashShift || 15)}% XEON Liquidity Buffer
            </button>
          </div>
        </div>
      `;

      document.getElementById("apply-remedy-btn")?.addEventListener("click", () => {
        const cashShift = Math.round(data.recommendedCashShift || 15);
        activePortfolio["XEON"] = (activePortfolio["XEON"] || 0) + cashShift;
        normalizeActiveWeights();
        renderHoldingsInputs();
        runAllAnalytics();
      });
    } else {
      box.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-emerald); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.78rem; color: var(--accent-emerald); font-weight: 600;">
          ✅ Stress-Test Passed: Worst drawdown of ${worstDd.toFixed(1)}% is comfortably within your ${behavioralTolerance.toFixed(1)}% behavioral threshold.
        </div>
      `;
    }
  }

  function renderTearSheetResults() {
    const container = document.getElementById("quantstats-tearsheet-container");
    if (!container || !tearSheetData || !tearSheetData.metrics) return;

    const m = tearSheetData.metrics;

    container.innerHTML = `
      <div class="grid-4" style="gap: 10px;">
        <div class="metric-box">
          <span class="metric-label">Expected CAGR</span>
          <span class="metric-value">${m.cagr}%</span>
          <span class="metric-sub">Compounded annual return</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Annual Volatility</span>
          <span class="metric-value">${m.annualizedVolatility}%</span>
          <span class="metric-sub">Portfolio standard deviation</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Sharpe Ratio (Rf=2.5%)</span>
          <span class="metric-value" style="color: var(--accent-emerald);">${m.sharpeRatio}</span>
          <span class="metric-sub">Excess return per unit total risk</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Sortino (Downside Vol)</span>
          <span class="metric-value" style="color: var(--accent-cyan);">${m.sortinoRatio}</span>
          <span class="metric-sub">Penalizes only negative drawdowns</span>
        </div>

        <div class="metric-box">
          <span class="metric-label">Tail Ratio (95th / 5th)</span>
          <span class="metric-value">${m.tailRatio}</span>
          <span class="metric-sub">> 1.0 = positive upside asymmetry</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Conditional DaR (CDaR 95%)</span>
          <span class="metric-value val-negative">${m.cdar95}%</span>
          <span class="metric-sub">Avg depth of 5% worst drawdowns</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Ulcer Index (UI)</span>
          <span class="metric-value" style="color: var(--accent-amber);">${m.ulcerIndex}</span>
          <span class="metric-sub">Penalizes drawdown depth &amp; length</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Safe Withdrawal Rate (30Y)</span>
          <span class="metric-value" style="color: var(--accent-emerald);">${m.swr30Y}%</span>
          <span class="metric-sub">Portfolio Charts retirement model</span>
        </div>
      </div>
    `;
  }

  async function loadQuantCodeSnippet(libraryKey) {
    const codeBlock = document.getElementById("quant-code-block");
    if (!codeBlock) return;

    try {
      const res = await fetch("/api/portfolio/code-snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: activePortfolio })
      });
      if (res.ok) {
        const snippets = await res.json();
        codeBlock.innerText = snippets[libraryKey] || snippets["pyportfolioopt"] || "# Python snippet ready";
        return;
      }
    } catch (e) {}

    // Fallback template
    codeBlock.innerText = `# Python script generator active for ${libraryKey}`;
  }

  async function loadPlatformsContent() {
    const body = document.getElementById("platforms-modal-body");
    if (!body) return;

    let platforms = [];
    try {
      const res = await fetch("/api/portfolio/platforms");
      if (res.ok) {
        const data = await res.json();
        platforms = data.platforms || [];
      }
    } catch (e) {}

    if (platforms.length === 0) {
      platforms = [
        { name: "Portfolio Visualizer", type: "Web Application", badge: "Institutional Standards", url: "https://www.portfoliovisualizer.com", keyStrengths: "Built-in Risk Parity, factor regression, historical crisis periods.", bestUsedFor: "Comparing 60/40 vs All-Weather across rate cycles." },
        { name: "Testfol.io", type: "Web Application (Free)", badge: "Advanced Backtesting", url: "https://testfol.io", keyStrengths: "Exceptional backtesting engine with custom leverage, simulated cash drag.", bestUsedFor: "Testing barbell strategies over multi-decade cycles." },
        { name: "Portfolio Charts", type: "Web Application", badge: "Drawdown Survival", url: "https://portfoliocharts.com", keyStrengths: "Focuses entirely on drawdown survival, recovery times, and safe withdrawal rates.", bestUsedFor: "Evaluating robust, all-weather style portfolios." },
        { name: "PyPortfolioOpt", type: "Python Quant Library", badge: "Practical Quant", url: "https://github.com/PyPortfolio/PyPortfolioOpt", keyStrengths: "Hierarchical Risk Parity (HRP), Mean-CVaR, and Ledoit-Wolf shrinkage.", bestUsedFor: "Robust optimization without return forecast fragility." },
        { name: "Riskfolio-Lib", type: "Python Quant Library", badge: "Gold Standard Tail-Risk", url: "https://github.com/dcajasn/Riskfolio-Lib", keyStrengths: "24+ risk measures, CDaR, Equal Risk Contribution, Student-t fat tails.", bestUsedFor: "Deep downside tail risk optimization." },
        { name: "QuantStats", type: "Python Quant Library", badge: "Portfolio Teardown", url: "https://github.com/ranaroussi/quantstats", keyStrengths: "Comprehensive HTML tear-sheets, specific historical crisis breakdowns.", bestUsedFor: "Post-allocation downside stress-testing." }
      ];
    }

    body.innerHTML = `
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.4;">
        Direct access and workflow guidance for the premier open-source quant libraries and no-code ETF backtesters:
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
        ${platforms.map(p => `
          <div class="card" style="margin: 0; background: var(--bg-secondary);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
              <strong style="color: var(--text-primary); font-size: 0.95rem;">${p.name}</strong>
              <span class="badge badge-sm" style="font-size: 0.65rem;">${p.badge}</span>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 8px;">${p.type}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 6px;">
              <strong>Key Strength:</strong> ${p.keyStrengths}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 12px;">
              <strong>Best Used For:</strong> ${p.bestUsedFor}
            </div>
            <a href="${p.url}" target="_blank" class="btn btn-secondary btn-sm" style="display: block; text-align: center; font-size: 0.75rem;">
              🔗 Open ${p.name}
            </a>
          </div>
        `).join("")}
      </div>
    `;
  }

  return {
    init,
    renderInterface
  };
})();
