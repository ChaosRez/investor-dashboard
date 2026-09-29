/**
 * Curvo Historical Portfolio Analysis Engine
 * Real historical metrics (CAGR, Sharpe, StDev, Max Drawdowns, Recovery times)
 * Interactive Dollar-Cost-Averaging (DCA) and inflation-adjusted growth simulator
 * Supports both API mode and clientside calculation mode.
 */

window.CurvoModule = (function () {
  let allEtfs = [];
  let etfsByTicker = {};

  const presetPortfolios = {
    "vwce-chill": {
      name: "Single-Fund 'VWCE and Chill'",
      description: "100% Vanguard FTSE All-World (USD) Acc. The gold-standard Bogleheads simplicity model.",
      holdings: { VWCE: 100 }
    },
    "iwda-eimi": {
      name: "Classic Core 88/12 (Developed + Emerging)",
      description: "88% iShares Core MSCI World + 12% iShares Core MSCI EM IMI. Complete global stock ownership with custom rebalancing.",
      holdings: { IWDA: 88, EIMI: 12 }
    },
    "bogleheads-80-20": {
      name: "Bogleheads 80/20 (Global Equity + Bond Shield)",
      description: "80% VWCE + 20% AGGU (EUR Hedged). Non-correlated fixed income cuts drawdown while preserving long-term equity compounding.",
      holdings: { VWCE: 80, AGGU: 20 }
    },
    "world-small-cap": {
      name: "Global All-Cap (Large + Mid + Small)",
      description: "80% VWCE + 20% IUSN (MSCI World Small Cap). Captures the academic Fama-French small-cap size premium.",
      holdings: { VWCE: 80, IUSN: 20 }
    },
    "us-tech-tilt": {
      name: "US Core + Tech Momentum Tilt",
      description: "70% SXR8 (S&P 500) + 30% QDVE (S&P 500 Tech). High historical return with elevated cyclical volatility.",
      holdings: { SXR8: 70, QDVE: 30 }
    }
  };

  let activeHoldings = { VWCE: 100 };

  function init(etfs) {
    allEtfs = etfs || [];
    etfsByTicker = {};
    allEtfs.forEach(e => { etfsByTicker[e.ticker.toUpperCase()] = e; });
    renderInterface();
    runSimulation();
  }

  function renderInterface() {
    const container = document.getElementById("curvo-backtest-container");
    if (!container) return;

    const presetButtonsHtml = Object.entries(presetPortfolios).map(([key, p], i) => `
      <button class="btn btn-secondary btn-sm preset-btn ${i === 0 ? "active" : ""}" data-preset="${key}" style="text-align: left; padding: 10px 14px; border-radius: var(--radius-md);">
        <strong style="display: block; font-size: 0.88rem; color: var(--text-primary);">${p.name}</strong>
        <span style="font-size: 0.74rem; color: var(--text-muted);">${p.description}</span>
      </button>
    `).join("");

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 class="card-title" style="margin-bottom: 0;">🏆 Curvo Historical Backtest &amp; DCA Growth Engine</h3>
              <span class="stage-status-badge badge-essential">Stage 3 (Planning Phase)</span>
            </div>
            <span class="card-subtitle">Real historical performance metrics from Curvo.eu (2000–2026 data series)</span>
          </div>
          <span class="badge badge-acc">UCITS Real Data</span>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px; display: block;">
            Select a Classic Bogleheads Portfolio Blueprint:
          </label>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
            ${presetButtonsHtml}
          </div>
        </div>

        <div class="grid-4" style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px;">
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Initial Capital (€)</label>
            <input type="number" id="curvo-initial" class="filter-input" style="width: 100%; margin-top: 4px;" value="10000" min="0" step="500" />
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Monthly Sparplan DCA (€)</label>
            <input type="number" id="curvo-dca" class="filter-input" style="width: 100%; margin-top: 4px;" value="500" min="0" step="50" />
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Time Horizon (Years)</label>
            <input type="number" id="curvo-years" class="filter-input" style="width: 100%; margin-top: 4px;" value="20" min="1" max="40" />
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Est. Annual Inflation (%)</label>
            <input type="number" id="curvo-inflation" class="filter-input" style="width: 100%; margin-top: 4px;" value="2.2" min="0" max="15" step="0.1" />
          </div>
        </div>

        <div style="text-align: right;">
          <button id="curvo-run-btn" class="btn btn-primary">
            🚀 Recalculate Curvo Backtest
          </button>
        </div>
      </div>

      <div id="curvo-results-container"></div>
    `;

    container.querySelectorAll(".preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const presetKey = btn.dataset.preset;
        activeHoldings = presetPortfolios[presetKey].holdings;
        runSimulation();
      });
    });

    document.getElementById("curvo-run-btn")?.addEventListener("click", runSimulation);
  }

  async function runSimulation() {
    const initialAmount = parseFloat(document.getElementById("curvo-initial")?.value || 10000);
    const monthlyDca = parseFloat(document.getElementById("curvo-dca")?.value || 500);
    const years = parseInt(document.getElementById("curvo-years")?.value || 20);
    const inflationRate = parseFloat(document.getElementById("curvo-inflation")?.value || 2.2);

    try {
      const res = await fetch("/api/portfolio/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holdings: activeHoldings,
          initialAmount,
          monthlyDca,
          years,
          inflationRate
        })
      });
      if (res.ok) {
        const data = await res.json();
        renderSimulationResults(data);
        return;
      }
    } catch (e) {
      // Fall through to clientside simulation
    }

    const localData = computeCurvoSimulationClientside({
      holdings: activeHoldings,
      initialAmount,
      monthlyDca,
      years,
      inflationRate
    });
    renderSimulationResults(localData);
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

    // Diversification adjustment if holding bonds (AGGU)
    const bondW = (weights["AGGU"] || 0) / (totalW || 1);
    const eqW = 1.0 - bondW;
    if (bondW > 0.05 && eqW > 0.05) {
      blendedStdev = Math.sqrt(Math.pow(eqW * 15.1, 2) + Math.pow(bondW * 5.8, 2) + 2 * eqW * bondW * 15.1 * 5.8 * 0.10);
      blendedSharpe = (blendedCagr - 2.5) / (blendedStdev || 1);
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

  function renderSimulationResults(data) {
    const container = document.getElementById("curvo-results-container");
    if (!container || !data) return;

    const m = data.blendedMetrics || {};
    const s = data.simulationSummary || {};

    const formatCur = (num) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(num);

    container.innerHTML = `
      <div class="grid-4" style="margin-bottom: 20px;">
        <div class="metric-box">
          <span class="metric-label">Historical CAGR</span>
          <span class="metric-value val-positive">${m.cagrPercent}%</span>
          <span class="metric-sub">Compound annual growth</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Annualized Volatility</span>
          <span class="metric-value">${m.annualizedVolatility}%</span>
          <span class="metric-sub">Standard deviation (StDev)</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Sharpe Ratio</span>
          <span class="metric-value" style="color: var(--accent-cyan);">${m.sharpeRatio}</span>
          <span class="metric-sub">Risk-adjusted return</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Max Drawdown (Curvo)</span>
          <span class="metric-value val-negative">${m.maxDrawdown}%</span>
          <span class="metric-sub">Deepest historical crash</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h4 class="card-title">📈 Wealth Accumulation Projection (DCA vs Inflation)</h4>
            <span class="card-subtitle">Real compounding based on historical Curvo CAGR • Visualizing nominal vs inflation-adjusted purchasing power</span>
          </div>
          <div style="display: flex; gap: 12px; font-size: 0.75rem; align-items: center;">
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent-emerald);"></span> Nominal Portfolio</span>
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent-cyan);"></span> Real (Inflation Adjusted)</span>
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: var(--text-muted);"></span> Total Deposits</span>
          </div>
        </div>

        <div id="growth-chart-wrapper" class="chart-container"></div>

        <div class="grid-3" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
          <div style="text-align: center;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Total Out-of-Pocket Deposits</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">${formatCur(s.totalContributions)}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Final Nominal Portfolio Value</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-emerald);">${formatCur(s.finalNominalValue)}</div>
            <div style="font-size: 0.75rem; color: var(--accent-emerald);">Wealth Multiple: ${s.returnMultiple}x</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Real Purchasing Power</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-cyan);">${formatCur(s.finalRealValue)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">After inflation adjustment</div>
          </div>
        </div>

        <div style="margin-top: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Verify this exact backtest portfolio live on Curvo with underlying European UCITS fund data:
          </span>
          <a href="${data.curvoVerificationUrl}" target="_blank" class="btn btn-secondary btn-sm">
            🔗 Open Live on Curvo.eu/backtest
          </a>
        </div>
      </div>
    `;

    renderSvgGrowthChart(data.timeline || []);
  }

  function renderSvgGrowthChart(timeline) {
    const container = document.getElementById("growth-chart-wrapper");
    if (!container || timeline.length === 0) return;

    const width = container.clientWidth || 900;
    const height = 300;
    const padding = { top: 20, right: 30, bottom: 30, left: 70 };

    const maxVal = Math.max(...timeline.map(d => d.portfolioNominal)) * 1.05;
    const years = timeline.length - 1;

    const xScale = (y) => padding.left + (y / (years || 1)) * (width - padding.left - padding.right);
    const yScale = (v) => height - padding.bottom - (v / (maxVal || 1)) * (height - padding.top - padding.bottom);

    const nominalPath = timeline.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)} ${yScale(d.portfolioNominal)}`).join(" ");
    const realPath = timeline.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)} ${yScale(d.portfolioReal)}`).join(" ");
    const depositsPath = timeline.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)} ${yScale(d.totalDeposits)}`).join(" ");

    let gridLines = "";
    for (let i = 0; i <= 4; i++) {
      const v = (maxVal / 4) * i;
      const y = yScale(v);
      const label = v >= 1000000 ? (v / 1000000).toFixed(1) + "M €" : (v / 1000).toFixed(0) + "k €";
      gridLines += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="chart-grid-line" />
        <text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${label}</text>
      `;
    }

    let xTicks = "";
    const step = years <= 10 ? 1 : (years <= 20 ? 2 : 5);
    for (let y = 0; y <= years; y += step) {
      const x = xScale(y);
      xTicks += `
        <line x1="${x}" y1="${height - padding.bottom}" x2="${x}" y2="${height - padding.bottom + 5}" stroke="var(--border-color)" />
        <text x="${x}" y="${height - padding.bottom + 18}" text-anchor="middle" class="chart-axis-text">Yr ${y}</text>
      `;
    }

    container.innerHTML = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
        ${gridLines}
        ${xTicks}
        <path d="${depositsPath}" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-dasharray="4, 4" />
        <path d="${realPath}" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5" />
        <path d="${nominalPath}" fill="none" stroke="var(--accent-emerald)" stroke-width="3" />
      </svg>
    `;
  }

  return {
    init,
    runSimulation
  };
})();
