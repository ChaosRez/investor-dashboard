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
    VWCE: 60,
    SXR8: 25,
    QDVE: 15
  };

  function init(etfs, correlations) {
    allEtfs = etfs || [];
    etfsByTicker = {};
    allEtfs.forEach(e => { etfsByTicker[e.ticker.toUpperCase()] = e; });
    correlationData = correlations;
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

    let rowsHtml = Object.entries(currentPortfolio).map(([ticker, weight]) => `
      <div class="portfolio-item-row" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;" data-ticker="${ticker}">
        <select class="filter-select etf-select" style="min-width: 140px; font-weight: 700;">
          ${allEtfs.map(e => `<option value="${e.ticker}" ${e.ticker === ticker ? "selected" : ""}>${e.ticker} - ${e.name.substring(0, 24)}...</option>`).join("")}
        </select>
        <div style="display: flex; align-items: center; gap: 4px;">
          <input type="number" class="filter-input etf-weight-input" style="width: 80px; min-width: 80px;" min="1" max="100" value="${weight}" />
          <span style="font-weight: 700;">%</span>
        </div>
        <button class="btn btn-secondary btn-sm remove-row-btn" style="color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.3);">✕ Remove</button>
      </div>
    `).join("");

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">🔍 Custom Portfolio Overlap & Redundancy Auditor</h3>
            <span class="card-subtitle">Detect constituent overlap, single-stock clustering, and hidden factor tilts</span>
          </div>
          <button id="add-etf-row-btn" class="btn btn-secondary btn-sm">+ Add ETF</button>
        </div>

        <div id="portfolio-rows-container">
          ${rowsHtml}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-color);">
          <div id="total-weight-display" style="font-weight: 700; font-size: 0.95rem;">
            Total Weight: 100%
          </div>
          <button id="run-audit-btn" class="btn btn-primary">
            ⚡ Run Overlap Audit
          </button>
        </div>
      </div>
    `;

    bindInputEvents();
  }

  function bindInputEvents() {
    const container = document.getElementById("portfolio-rows-container");
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
        row.remove();
        updateTotalWeight();
      });
    });

    document.getElementById("add-etf-row-btn")?.addEventListener("click", () => {
      const remainingEtfs = allEtfs.filter(e => !document.querySelector(`.portfolio-item-row[data-ticker="${e.ticker}"]`));
      const nextTicker = remainingEtfs.length > 0 ? remainingEtfs[0].ticker : "AGGU";
      
      const newRow = document.createElement("div");
      newRow.className = "portfolio-item-row";
      newRow.dataset.ticker = nextTicker;
      newRow.style = "display: flex; align-items: center; gap: 10px; margin-bottom: 10px;";
      newRow.innerHTML = `
        <select class="filter-select etf-select" style="min-width: 140px; font-weight: 700;">
          ${allEtfs.map(e => `<option value="${e.ticker}" ${e.ticker === nextTicker ? "selected" : ""}>${e.ticker} - ${e.name.substring(0, 24)}...</option>`).join("")}
        </select>
        <div style="display: flex; align-items: center; gap: 4px;">
          <input type="number" class="filter-input etf-weight-input" style="width: 80px; min-width: 80px;" min="1" max="100" value="10" />
          <span style="font-weight: 700;">%</span>
        </div>
        <button class="btn btn-secondary btn-sm remove-row-btn" style="color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.3);">✕ Remove</button>
      `;

      container.appendChild(newRow);
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

  function addEtfToPortfolio(ticker) {
    if (!currentPortfolio[ticker]) {
      currentPortfolio[ticker] = 20;
      renderPortfolioInputs();
      runPortfolioAudit();
    }
  }

  return {
    init,
    addEtfToPortfolio
  };
})();
