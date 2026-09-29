/**
 * ETF Correlation & Overlap Engine
 * Visualizes pairwise correlations from Portfolio Visualizer
 * Analyzes constituent overlap and audits portfolio redundancy (extraETF methodology)
 * Supports both API mode and clientside calculation mode.
 */

window.OverlapModule = (function () {
  let correlationData = null;
  let allEtfs = [];
  let etfsByTicker = {};
  let currentPortfolio = {
    IUSQ: 40,
    SXR8: 20,
    IMAE: 10,
    XEON: 10,
    WTAI: 10,
    AII: 10
  };

  const portfolioPresets = {
    "watchlist-10": {
      name: "⭐ My 10 Watchlist ETFs (Equal Weight 10%)",
      desc: "Equal 10% distribution across all 10 of your tracked European ETFs",
      weights: {
        IUSQ: 10,
        SXR8: 10,
        IMAE: 10,
        XEON: 10,
        VHYL: 10,
        AII: 10,
        WTAI: 10,
        BATT: 10,
        RARE: 10,
        XCS6: 10
      }
    },
    "watchlist-core-satellite": {
      name: "🎯 Watchlist Core & Satellite (50% IUSQ)",
      desc: "50% Global ACWI Core + 50% Satellite Tilts across AI, Metals, and Cash",
      weights: {
        IUSQ: 50,
        SXR8: 10,
        IMAE: 10,
        XEON: 10,
        WTAI: 5,
        AII: 5,
        BATT: 5,
        RARE: 5
      }
    },
    "world-core": {
      name: "🌍 1-Fund World Simplicity (100% IUSQ)",
      desc: "Total global market coverage in a single low-cost accumulating vehicle",
      weights: {
        IUSQ: 100
      }
    },
    "classic-88-12": {
      name: "🏛️ Boglehead 88/12 Core (88% IWDA + 12% EIMI)",
      desc: "The standard European two-fund total market benchmark",
      weights: {
        IWDA: 88,
        EIMI: 12
      }
    },
    "tech-growth": {
      name: "🚀 AI & Tech Growth (60% IUSQ + 20% WTAI + 20% AII)",
      desc: "Global broad market anchor with concentrated AI software & infrastructure tilts",
      weights: {
        IUSQ: 60,
        WTAI: 20,
        AII: 20
      }
    },
    "cash-shield": {
      name: "🛡️ All-Weather Cash Shield (60% IUSQ + 20% XEON + 20% AGGU)",
      desc: "Capital preservation combining global equities with overnight €STR cash and bonds",
      weights: {
        IUSQ: 60,
        XEON: 20,
        AGGU: 20
      }
    }
  };

  function init(etfs, correlations) {
    allEtfs = etfs || [];
    etfsByTicker = {};
    allEtfs.forEach(e => { etfsByTicker[e.ticker.toUpperCase()] = e; });
    correlationData = correlations;

    const saved = localStorage.getItem("apex_custom_portfolio");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
          currentPortfolio = parsed;
        }
      } catch (e) {}
    }

    renderCorrelationMatrix();
    renderPortfolioInputs();
    runPortfolioAudit();
  }

  function renderCorrelationMatrix() {
    const container = document.getElementById("correlation-matrix-container");
    if (!container || !correlationData) return;

    const tickers = correlationData.tickers || [];
    const matrix = correlationData.matrix || {};

    let headerHtml = `<tr><th style="text-align: left; background: var(--bg-card);">Ticker</th>` +
      tickers.map(t => `<th>${t}</th>`).join("") + `</tr>`;

    let rowsHtml = tickers.map(rowTicker => {
      let cells = tickers.map(colTicker => {
        const val = matrix[rowTicker]?.[colTicker] ?? 1.0;
        const color = getCorrelationColor(val);
        const textColor = val > 0.6 || val < 0.2 ? "#ffffff" : "#111827";

        return `
          <td class="heatmap-cell" style="background-color: ${color}; color: ${textColor};"
              title="${rowTicker} vs ${colTicker}: Correlation ${val.toFixed(2)}"
              data-t1="${rowTicker}" data-t2="${colTicker}" data-val="${val}">
            ${val.toFixed(2)}
          </td>
        `;
      }).join("");

      return `<tr><td style="font-weight: 800; text-align: left; color: var(--accent-cyan); background: var(--bg-card);">${rowTicker}</td>${cells}</tr>`;
    }).join("");

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">🔗 10-Year Monthly Return Correlation Matrix</h3>
            <span class="card-subtitle">Real quantitative data from Portfolio Visualizer • 120 rolling monthly periods</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">
            🟢 &lt; 0.30 Non-Correlated Diversifier | 🔵 0.70 - 0.90 High | 🟣 &gt; 0.95 Extreme Redundancy
          </div>
        </div>

        <div class="table-responsive">
          <table class="heatmap-table">
            <thead>${headerHtml}</thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>

        <div id="correlation-cell-details" style="margin-top: 14px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.84rem;">
          <p>👉 <em>Click on any cell above to inspect the diversification benefit and overlap analysis between the two funds.</em></p>
        </div>
      </div>
    `;

    // Click handler for heatmap cells
    container.querySelectorAll(".heatmap-cell").forEach(cell => {
      cell.addEventListener("click", (e) => {
        const t1 = e.currentTarget.dataset.t1;
        const t2 = e.currentTarget.dataset.t2;
        const val = parseFloat(e.currentTarget.dataset.val);
        explainCorrelationPair(t1, t2, val);
      });
    });
  }

  function getCorrelationColor(val) {
    if (val <= 0.20) return "rgba(16, 185, 129, 0.85)";
    if (val <= 0.70) return "rgba(6, 182, 212, 0.75)";
    if (val <= 0.90) return "rgba(59, 130, 246, 0.75)";
    if (val < 1.0) return "rgba(99, 102, 241, 0.85)";
    return "rgba(139, 92, 246, 0.9)";
  }

  function explainCorrelationPair(t1, t2, val) {
    const detailsBox = document.getElementById("correlation-cell-details");
    if (!detailsBox) return;

    if (t1 === t2) {
      detailsBox.innerHTML = `<strong>${t1} vs ${t2}:</strong> Identical fund (1.00 correlation).`;
      return;
    }

    let explanation = "";
    if ((t1 === "VWCE" && t2 === "IWDA") || (t1 === "IWDA" && t2 === "VWCE")) {
      explanation = `<strong>${t1} vs ${t2} (${val}): Extreme Redundancy!</strong> VWCE tracks FTSE All-World (89% Developed, 11% Emerging) while IWDA tracks MSCI World (100% Developed). Holding both in the same portfolio provides virtually zero diversification benefit while doubling your tracking admin. Bogleheads recommend picking one core foundation.`;
    } else if (t1 === "AGGU" || t2 === "AGGU") {
      const equityTicker = t1 === "AGGU" ? t2 : t1;
      explanation = `<strong>${equityTicker} vs AGGU (${val}): Superb Non-Correlated Diversification!</strong> AGGU (Global Aggregate Bonds) has a 0.12 correlation to ${equityTicker}. When equities suffer sharp drawdowns, high-quality sovereign bonds act as an anti-fragile shock absorber, allowing rebalancing into depressed equities.`;
    } else if ((t1 === "SXR8" && t2 === "QDVE") || (t1 === "QDVE" && t2 === "SXR8")) {
      explanation = `<strong>${t1} vs ${t2} (${val}): High Redundancy & Concentration!</strong> S&P 500 already allocates 32.1% to Technology. Adding QDVE heavily triples your stake in Microsoft, Apple, and NVIDIA (which make up 62% of QDVE). Your portfolio becomes an aggressive high-beta bet on the AI capex cycle.`;
    } else if ((t1 === "EIMI" && t2 === "IWDA") || (t1 === "IWDA" && t2 === "EIMI")) {
      explanation = `<strong>IWDA vs EIMI (${val}): Complementary Building Blocks!</strong> IWDA holds 0% Emerging Markets, and EIMI holds 100% Emerging Markets (0% constituent overlap). A classic Bogleheads 88% IWDA + 12% EIMI allocation perfectly reconstructs the global market portfolio with total allocation control.`;
    } else {
      explanation = `<strong>${t1} vs ${t2} (Correlation ${val}):</strong> With an observed correlation of ${val}, combining these funds balances regional or factor weights. Check the constituent overlap below to inspect shared individual equities.`;
    }

    detailsBox.innerHTML = `<div style="color: var(--text-primary); line-height: 1.5;">${explanation}</div>`;
  }

  function renderPortfolioInputs() {
    const container = document.getElementById("portfolio-overlap-inputs");
    if (!container) return;

    // Presets buttons HTML
    const presetsHtml = Object.entries(portfolioPresets).map(([key, p]) => {
      const isWatchlist = key.includes("watchlist");
      const btnStyle = isWatchlist
        ? "background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.25)); border-color: rgba(245, 158, 11, 0.5); color: #fbbf24; font-weight: 700;"
        : "";
      return `
        <button class="btn btn-secondary btn-sm portfolio-preset-btn" data-preset="${key}" style="${btnStyle}" title="${p.desc}">
          ${p.name}
        </button>
      `;
    }).join("");

    let rowsHtml = Object.entries(currentPortfolio).map(([ticker, weight]) => `
      <div class="portfolio-item-row" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;" data-ticker="${ticker}">
        <select class="filter-select etf-select" style="min-width: 160px; font-weight: 700;">
          ${allEtfs.map(e => `<option value="${e.ticker}" ${e.ticker === ticker ? "selected" : ""}>${e.ticker} - ${e.name.substring(0, 26)}...</option>`).join("")}
        </select>
        <div style="display: flex; align-items: center; gap: 4px;">
          <input type="number" class="filter-input etf-weight-input" style="width: 80px; min-width: 80px;" min="1" max="100" value="${weight}" />
          <span style="font-weight: 700;">%</span>
        </div>
        <button class="btn btn-secondary btn-sm remove-row-btn" style="color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.3);">✕ Remove</button>
      </div>
    `).join("");

    container.innerHTML = `
      <!-- Educational Framework: How to Build Your Portfolio -->
      <div class="card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.08)); border-color: rgba(59, 130, 246, 0.3); margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <h4 style="margin: 0; color: var(--accent-blue); display: flex; align-items: center; gap: 8px; font-size: 1.05rem;">
            💡 How to Build Your Portfolio (Boglehead 3-Step Architecture)
          </h4>
          <span class="badge badge-acc">Core + Satellite Strategy</span>
        </div>
        <div class="grid-3" style="gap: 12px; font-size: 0.8rem; line-height: 1.45;">
          <div style="background: var(--bg-card); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
            <strong style="color: var(--accent-emerald);">1. Anchor with 1 Global Core (60–90%)</strong>
            <p style="margin: 4px 0 0; color: var(--text-secondary);">
              Choose 1 broad-market Accumulating fund (e.g. <strong>IUSQ</strong> MSCI ACWI or <strong>VWCE</strong> FTSE All-World) to compound entire global growth at minimal cost with zero dividend tax drag.
            </p>
          </div>
          <div style="background: var(--bg-card); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
            <strong style="color: var(--accent-cyan);">2. Add Satellite Tilts Deliberately (10–30%)</strong>
            <p style="margin: 4px 0 0; color: var(--text-secondary);">
              Allocate small proportions to high-conviction megatrends (e.g. <strong>WTAI</strong> AI, <strong>BATT</strong> Batteries, <strong>RARE</strong> Metals) or a cash cushion (<strong>XEON</strong> €STR) for risk mitigation.
            </p>
          </div>
          <div style="background: var(--bg-card); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
            <strong style="color: var(--accent-rose);">3. Audit Overlap &amp; Concentration</strong>
            <p style="margin: 4px 0 0; color: var(--text-secondary);">
              Run the auditor below to verify single-stock exposure (Apple, Microsoft, NVIDIA) does not unintentionally concentrate past your risk budget.
            </p>
          </div>
        </div>
      </div>

      <!-- Portfolio Builder Workspace -->
      <div class="card">
        <div class="card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 class="card-title" style="margin-bottom: 0;">🛠️ Portfolio Builder &amp; Overlap Auditor</h3>
              <span class="stage-status-badge badge-essential">Stage 2: Portfolio Construction</span>
            </div>
            <span class="card-subtitle">Build, customize, and audit your allocation weights across all verified European ETFs</span>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button id="equal-weight-btn" class="btn btn-secondary btn-sm" title="Evenly distribute 100% across all listed funds">
              ⚖️ Auto Equal-Weight (100%)
            </button>
            <button id="save-portfolio-btn" class="btn btn-secondary btn-sm" style="color: var(--accent-emerald); border-color: rgba(16, 185, 129, 0.4);" title="Save this portfolio in your browser">
              💾 Save Portfolio
            </button>
            <button id="add-etf-row-btn" class="btn btn-primary btn-sm">+ Add ETF</button>
          </div>
        </div>

        <!-- 1-Click Presets -->
        <div style="margin-bottom: 16px; padding: 10px 14px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div style="font-size: 0.74rem; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
            ⚡ Quick 1-Click Allocation Presets:
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${presetsHtml}
          </div>
        </div>

        <!-- Portfolio ETF Rows -->
        <div id="portfolio-rows-container">
          ${rowsHtml}
        </div>

        <!-- Bottom Actions & Weight Normalizer -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 10px;">
          <div id="total-weight-display" style="font-weight: 700; font-size: 0.95rem;">
            Total Weight: 100%
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button id="clear-portfolio-btn" class="btn btn-secondary btn-sm" style="color: var(--text-muted);">
              🗑️ Clear
            </button>
            <button id="run-audit-btn" class="btn btn-primary">
              ⚡ Run Overlap Audit
            </button>
          </div>
        </div>
      </div>
    `;

    bindInputEvents();
  }

  function bindInputEvents() {
    const container = document.getElementById("portfolio-overlap-inputs");
    if (!container) return;

    container.querySelectorAll(".etf-weight-input").forEach(input => {
      input.addEventListener("input", updateTotalWeight);
    });

    container.querySelectorAll(".etf-select").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const row = e.target.closest(".portfolio-item-row");
        row.dataset.ticker = e.target.value;
      });
    });

    container.querySelectorAll(".remove-row-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest(".portfolio-item-row");
        const ticker = row.dataset.ticker;
        row.remove();
        delete currentPortfolio[ticker];
        updateTotalWeight();
      });
    });

    // Preset buttons
    container.querySelectorAll(".portfolio-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const presetKey = btn.dataset.preset;
        const preset = portfolioPresets[presetKey];
        if (preset) {
          currentPortfolio = { ...preset.weights };
          renderPortfolioInputs();
          runPortfolioAudit();
          showNotification(`✅ Loaded preset: ${preset.name}`);
        }
      });
    });

    // Equal-weight button
    document.getElementById("equal-weight-btn")?.addEventListener("click", () => {
      const rows = document.querySelectorAll(".portfolio-item-row");
      if (rows.length === 0) return;
      const equalShare = Math.floor(100 / rows.length);
      const remainder = 100 - (equalShare * rows.length);
      rows.forEach((row, idx) => {
        const input = row.querySelector(".etf-weight-input");
        if (input) {
          input.value = idx === 0 ? (equalShare + remainder) : equalShare;
        }
      });
      updateTotalWeight();
      runPortfolioAudit();
      showNotification("⚖️ Portfolio weights evenly rebalanced to 100%!");
    });

    // Save Portfolio button
    document.getElementById("save-portfolio-btn")?.addEventListener("click", () => {
      const portfolio = {};
      document.querySelectorAll(".portfolio-item-row").forEach(row => {
        const ticker = (row.querySelector(".etf-select")?.value || row.dataset.ticker || "").toUpperCase();
        const weight = parseFloat(row.querySelector(".etf-weight-input")?.value || 0);
        if (ticker && weight > 0) {
          portfolio[ticker] = weight;
        }
      });
      localStorage.setItem("apex_custom_portfolio", JSON.stringify(portfolio));
      currentPortfolio = portfolio;
      showNotification("💾 Portfolio successfully saved to browser!");
    });

    // Clear button
    document.getElementById("clear-portfolio-btn")?.addEventListener("click", () => {
      currentPortfolio = {};
      renderPortfolioInputs();
      showNotification("🗑️ Portfolio cleared. Select an ETF or load a preset!");
    });

    document.getElementById("add-etf-row-btn")?.addEventListener("click", () => {
      const remainingEtfs = allEtfs.filter(e => !document.querySelector(`.portfolio-item-row[data-ticker="${e.ticker}"]`));
      const nextTicker = remainingEtfs.length > 0 ? remainingEtfs[0].ticker : "IUSQ";
      
      const newRow = document.createElement("div");
      newRow.className = "portfolio-item-row";
      newRow.dataset.ticker = nextTicker;
      newRow.style = "display: flex; align-items: center; gap: 10px; margin-bottom: 10px;";
      newRow.innerHTML = `
        <select class="filter-select etf-select" style="min-width: 160px; font-weight: 700;">
          ${allEtfs.map(e => `<option value="${e.ticker}" ${e.ticker === nextTicker ? "selected" : ""}>${e.ticker} - ${e.name.substring(0, 26)}...</option>`).join("")}
        </select>
        <div style="display: flex; align-items: center; gap: 4px;">
          <input type="number" class="filter-input etf-weight-input" style="width: 80px; min-width: 80px;" min="1" max="100" value="10" />
          <span style="font-weight: 700;">%</span>
        </div>
        <button class="btn btn-secondary btn-sm remove-row-btn" style="color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.3);">✕ Remove</button>
      `;

      document.getElementById("portfolio-rows-container")?.appendChild(newRow);
      bindInputEvents();
      updateTotalWeight();
    });

    document.getElementById("run-audit-btn")?.addEventListener("click", runPortfolioAudit);
    updateTotalWeight();
  }

  function updateTotalWeight() {
    let total = 0;
    document.querySelectorAll(".portfolio-item-row").forEach(row => {
      const val = parseFloat(row.querySelector(".etf-weight-input")?.value || 0);
      total += val;
    });

    const display = document.getElementById("total-weight-display");
    if (display) {
      display.innerHTML = `Total Weight: <span style="color: ${total === 100 ? "var(--accent-emerald)" : "var(--accent-amber)"};">${total}%</span> ${total !== 100 ? "(Will be normalized to 100% in audit)" : "✅"}`;
    }
  }

  async function runPortfolioAudit() {
    const portfolio = {};
    document.querySelectorAll(".portfolio-item-row").forEach(row => {
      const ticker = row.querySelector(".etf-select")?.value || row.dataset.ticker;
      const weight = parseFloat(row.querySelector(".etf-weight-input")?.value || 0);
      if (weight > 0) {
        portfolio[ticker] = (portfolio[ticker] || 0) + weight;
      }
    });

    if (Object.keys(portfolio).length === 0) {
      portfolio["VWCE"] = 100;
    }

    try {
      const res = await fetch("/api/overlap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio })
      });
      if (res.ok) {
        const data = await res.json();
        renderAuditResults(data);
        return;
      }
    } catch (e) {
      // Fall through to clientside calculation
    }

    // Clientside calculation fallback
    const localData = computePortfolioOverlapClientside(portfolio);
    renderAuditResults(localData);
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
        let overlap = 0.0;
        if ((t1 === "VWCE" && t2 === "IWDA") || (t1 === "IWDA" && t2 === "VWCE")) overlap = 88.4;
        else if (["VWCE", "IWDA"].includes(t1) && ["SXR8", "VUAA"].includes(t2)) overlap = 64.2;
        else if (t1 === "QDVE" || t2 === "QDVE") overlap = 32.1;
        else if (t1 === "EIMI" || t2 === "EIMI" || t1 === "AGGU" || t2 === "AGGU") overlap = 0.0;

        pairwise.push({
          pair: `${t1} + ${t2}`,
          overlapPercent: overlap,
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

    const warningsHtml = (data.redundancyWarnings || []).map(w => {
      let icon = "⚠️";
      let border = "var(--accent-amber)";
      if (w.severity === "high") { icon = "🚨"; border = "var(--accent-rose)"; }
      else if (w.severity === "info") { icon = "💡"; border = "var(--accent-cyan)"; }

      return `
        <div style="background: var(--bg-secondary); border-left: 4px solid ${border}; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 10px; font-size: 0.85rem;">
          <div style="font-weight: 700; color: ${border}; margin-bottom: 2px;">${icon} ${w.type}</div>
          <div style="color: var(--text-secondary); line-height: 1.4;">${w.message}</div>
        </div>
      `;
    }).join("");

    const topHoldingsHtml = (data.topConstituents || []).slice(0, 10).map((h, i) => {
      const details = (h.foundInEtfs || []).map(e => `${e.ticker}: ${e.effectiveContribution}%`).join(" + ");
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
          <div>
            <span style="font-weight: 700; color: var(--text-primary);">${i + 1}. ${h.name}</span>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${details ? `From [${details}]` : ""}</div>
          </div>
          <span style="font-weight: 800; font-size: 1rem; color: var(--accent-cyan);">${h.portfolioWeight}%</span>
        </div>
      `;
    }).join("");

    const pairwiseHtml = (data.pairwiseOverlaps || []).map(p => `
      <tr>
        <td><strong>${p.pair}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="progress-track" style="width: 100px; height: 8px;">
              <div class="progress-fill" style="width: ${p.overlapPercent}%; background: ${p.overlapPercent > 60 ? "var(--accent-rose)" : "var(--accent-blue)"};"></div>
            </div>
            <strong>${p.overlapPercent}%</strong>
          </div>
        </td>
        <td><span class="badge ${p.overlapPercent > 60 ? "badge-red" : "badge-blue"}">${p.redundancyLevel}</span></td>
      </tr>
    `).join("");

    const sectorHtml = Object.entries(data.sectorBreakdown || {}).slice(0, 6).map(([sec, val]) => `
      <div style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 2px;">
          <span>${sec}</span>
          <strong>${typeof val === "number" ? val.toFixed(1) : val}%</strong>
        </div>
        <div class="progress-track" style="height: 6px;">
          <div class="progress-fill" style="width: ${val}%; background: var(--accent-blue);"></div>
        </div>
      </div>
    `).join("");

    container.innerHTML = `
      ${warningsHtml ? `<div class="card" style="border-color: var(--accent-amber);">${warningsHtml}</div>` : ""}

      <div class="grid-4" style="margin-bottom: 20px;">
        <div class="metric-box">
          <span class="metric-label">Weighted TER</span>
          <span class="metric-value">${data.weightedTer}%</span>
          <span class="metric-sub">Annual ongoing fee</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Weighted Tracking Diff</span>
          <span class="metric-value ${data.weightedTrackingDifference < 0 ? "val-positive" : ""}">${data.weightedTrackingDifference}%</span>
          <span class="metric-sub">5Y Avg vs Benchmarks</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Accumulating Share</span>
          <span class="metric-value ${data.accumulatingShare === 100 ? "val-positive" : "val-negative"}">${data.accumulatingShare}%</span>
          <span class="metric-sub">${data.accumulatingShare === 100 ? "100% Tax Compounder" : "Contains Distributing Funds"}</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Top 3 Stock Weight</span>
          <span class="metric-value" style="color: var(--accent-cyan);">${((data.topConstituents?.[0]?.portfolioWeight || 0) + (data.topConstituents?.[1]?.portfolioWeight || 0) + (data.topConstituents?.[2]?.portfolioWeight || 0)).toFixed(1)}%</span>
          <span class="metric-sub">Single-company risk</span>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h4 class="card-title">🔍 True Aggregated Holdings</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px;">What you actually own across all funds combined:</p>
          ${topHoldingsHtml}
        </div>

        <div>
          <div class="card" style="margin-bottom: 20px;">
            <h4 class="card-title">📊 Pairwise Overlap Breakdown</h4>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ETF Pair</th>
                    <th>Shared Weight</th>
                    <th>Redundancy Rating</th>
                  </tr>
                </thead>
                <tbody>
                  ${pairwiseHtml || "<tr><td colspan='3'>Add multiple ETFs to compare pairwise overlap</td></tr>"}
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <h4 class="card-title">🌍 Sector Exposure</h4>
            ${sectorHtml}
          </div>
        </div>
      </div>
    `;
  }

  function showNotification(msg) {
    const existing = document.getElementById("portfolio-toast-alert");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "portfolio-toast-alert";
    toast.style = "position: fixed; bottom: 24px; right: 24px; background: var(--bg-card); color: var(--accent-emerald); border: 1px solid var(--accent-emerald); padding: 12px 20px; border-radius: 8px; box-shadow: var(--shadow-lg); z-index: 9999; font-weight: 700; font-size: 0.9rem; transition: opacity 0.3s ease;";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function addEtfToPortfolio(ticker, defaultWeight = 10) {
    ticker = (ticker || "").toUpperCase();
    if (!ticker) return;
    if (currentPortfolio[ticker] !== undefined) {
      showNotification(`ℹ️ ${ticker} is already in your portfolio.`);
      return;
    }
    currentPortfolio[ticker] = defaultWeight;
    renderPortfolioInputs();
    runPortfolioAudit();
    showNotification(`✅ Added ${ticker} to your portfolio!`);
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
    getPortfolio: () => ({ ...currentPortfolio })
  };
})();
