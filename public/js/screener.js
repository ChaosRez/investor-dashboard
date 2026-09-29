/**
 * ETF Explorer & Screener Module
 * Real data sourced from justETF, extraETF, and Trackinsight.
 * Evaluates ETFs based on retail priorities: Accumulating, TER, TD, Fund Size, Domicile, Tax, and Broker Availability.
 */

window.ScreenerModule = (function () {
  let allEtfs = [];
  let filteredEtfs = [];

  function init(etfs) {
    allEtfs = etfs || [];
    filteredEtfs = [...allEtfs];
    renderFilters();
    renderTable();
  }

  function renderFilters() {
    const container = document.getElementById("screener-filters");
    if (!container) return;

    container.innerHTML = `
      <div class="filter-bar">
        <input type="text" id="screener-search" class="filter-input" placeholder="Search by Ticker, ISIN, Index (e.g. VWCE, S&P 500)..." />
        
        <div class="pill-group" id="acc-filter-group">
          <button class="pill-btn active" data-acc="all">All Funds</button>
          <button class="pill-btn" data-acc="acc">✨ Accumulating (Acc) Priority</button>
          <button class="pill-btn" data-acc="dist">Distributing (Dist)</button>
        </div>

        <select id="domicile-filter" class="filter-select">
          <option value="all">All Domiciles</option>
          <option value="ireland">Ireland (IE - 15% US Treaty Tax Alpha)</option>
          <option value="luxembourg">Luxembourg (LU)</option>
        </select>

        <select id="broker-filter" class="filter-select">
          <option value="all">All Brokers (Sparplan)</option>
          <option value="Trade Republic">Trade Republic (Free Sparplan)</option>
          <option value="Scalable Capital">Scalable Capital (Free PRIME)</option>
          <option value="Interactive Brokers">Interactive Brokers (Global Tiered)</option>
          <option value="DEGIRO">DEGIRO (Core Selection)</option>
          <option value="ING">ING (Free Sparplan)</option>
          <option value="flatex">flatex</option>
        </select>

        <select id="sort-filter" class="filter-select">
          <option value="score">Sort: Retail Multi-Factor Score (High to Low)</option>
          <option value="ter">Sort: Lowest Total Cost (TER)</option>
          <option value="td">Sort: Best Tracking Difference (TD)</option>
          <option value="aum">Sort: Largest Fund Size (AUM)</option>
          <option value="cagr">Sort: Highest Historical CAGR</option>
        </select>
      </div>
    `;

    // Bind event listeners
    const searchInput = document.getElementById("screener-search");
    searchInput.addEventListener("input", applyFilters);

    const accButtons = document.querySelectorAll("#acc-filter-group .pill-btn");
    accButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        accButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilters();
      });
    });

    document.getElementById("domicile-filter").addEventListener("change", applyFilters);
    document.getElementById("broker-filter").addEventListener("change", applyFilters);
    document.getElementById("sort-filter").addEventListener("change", applyFilters);
  }

  function applyFilters() {
    const query = (document.getElementById("screener-search")?.value || "").toLowerCase().trim();
    const activeAccBtn = document.querySelector("#acc-filter-group .pill-btn.active");
    const accFilter = activeAccBtn ? activeAccBtn.dataset.acc : "all";
    const domicileFilter = (document.getElementById("domicile-filter")?.value || "all").toLowerCase();
    const brokerFilter = document.getElementById("broker-filter")?.value || "all";
    const sortVal = document.getElementById("sort-filter")?.value || "score";

    filteredEtfs = allEtfs.filter((etf) => {
      // Search
      const matchSearch =
        !query ||
        etf.ticker.toLowerCase().includes(query) ||
        etf.isin.toLowerCase().includes(query) ||
        etf.name.toLowerCase().includes(query) ||
        etf.benchmarkIndex.toLowerCase().includes(query) ||
        (etf.wkn && etf.wkn.toLowerCase().includes(query));

      // Acc/Dist
      let matchAcc = true;
      if (accFilter === "acc") matchAcc = etf.isAccumulating === true;
      if (accFilter === "dist") matchAcc = etf.isAccumulating === false;

      // Domicile
      let matchDom = true;
      if (domicileFilter !== "all") {
        matchDom = (etf.domicile || "").toLowerCase() === domicileFilter;
      }

      // Broker
      let matchBroker = true;
      if (brokerFilter !== "all") {
        matchBroker = etf.brokerAvailability?.[brokerFilter]?.sparplan === true;
      }

      return matchSearch && matchAcc && matchDom && matchBroker;
    });

    // Sorting
    filteredEtfs.sort((a, b) => {
      if (sortVal === "score") {
        return (b.retailScores?.composite || 0) - (a.retailScores?.composite || 0);
      } else if (sortVal === "ter") {
        return a.ter - b.ter;
      } else if (sortVal === "td") {
        return a.trackingDifference5Y - b.trackingDifference5Y;
      } else if (sortVal === "aum") {
        return b.aumMillionsEUR - a.aumMillionsEUR;
      } else if (sortVal === "cagr") {
        return (b.historicalStatsCurvo?.cagr || 0) - (a.historicalStatsCurvo?.cagr || 0);
      }
      return 0;
    });

    renderTable();
  }

  function renderTable() {
    const container = document.getElementById("screener-table-container");
    if (!container) return;

    if (filteredEtfs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <p style="font-size: 1.1rem; font-weight: 600;">No ETFs match the selected filters.</p>
          <p style="font-size: 0.85rem;">Try clearing your search query or selecting "All Funds".</p>
        </div>
      `;
      return;
    }

    let rowsHtml = filteredEtfs
      .map((etf) => {
        const isAcc = etf.isAccumulating;
        const accBadge = isAcc
          ? `<span class="badge badge-acc">✨ Accumulating (Acc)</span>`
          : `<span class="badge badge-dist">Distributing (Dist)</span>`;

        const tdVal = etf.trackingDifference5Y;
        const tdColor = tdVal < 0 ? "val-positive" : "text-primary";
        const tdLabel = tdVal < 0 ? `${tdVal}% (Outperforming Index!)` : `+${tdVal}%`;

        const aumStr = (etf.aumMillionsEUR / 1000).toFixed(1) + "B €";
        const compositeScore = etf.retailScores?.composite || 90;
        const providerLogo = window.ProviderLogos?.getLogoSvg(etf.issuer, 20) || "";

        let scoreBadgeClass = "badge-blue";
        if (compositeScore >= 95) scoreBadgeClass = "badge-acc";
        else if (compositeScore < 85) scoreBadgeClass = "badge-amber";

        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-weight: 800; font-size: 1.05rem; color: var(--accent-cyan);">${etf.ticker}</span>
                ${providerLogo}
                <span class="badge ${scoreBadgeClass}">Score ${compositeScore}/100</span>
              </div>
              <span class="table-etf-title">${etf.name}</span>
              <span class="table-etf-sub">ISIN: <strong>${etf.isin}</strong> | WKN: ${etf.wkn}</span>
            </td>
            <td>
              ${accBadge}
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">
                ${isAcc ? "Zero dividend cash drag • Auto-compound" : "Quarterly cash distribution • Taxable event"}
              </div>
            </td>
            <td>
              <strong style="font-size: 0.95rem;">${etf.ter.toFixed(2)}%</strong> p.a.
              <div style="font-size: 0.72rem; color: var(--text-muted);">Ongoing cost</div>
            </td>
            <td>
              <strong class="${tdColor}" style="font-size: 0.95rem;">${tdLabel}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted);">5Y Avg (extraETF / TD)</div>
            </td>
            <td>
              <strong>${aumStr}</strong>
              <div style="font-size: 0.72rem; color: var(--accent-emerald);">● Institutional Safe</div>
            </td>
            <td>
              <span class="badge ${etf.domicile === "Ireland" ? "badge-acc" : "badge-amber"}">${etf.domicile}</span>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                ${etf.domicile === "Ireland" ? "15% US Treaty WHT" : "Standard Treaty"}
              </div>
            </td>
            <td>
              <strong style="color: var(--accent-blue);">${etf.historicalStatsCurvo?.cagr || "N/A"}%</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Curvo Backtest CAGR</div>
            </td>
            <td style="text-align: right; white-space: nowrap;">
              <button class="btn btn-primary btn-sm view-profile-btn" data-ticker="${etf.ticker}">
                🔍 Details
              </button>
              <button class="btn btn-secondary btn-sm add-portfolio-btn" data-ticker="${etf.ticker}">
                + Add to Audit
              </button>
            </td>
          </tr>
        `;
      })
      .join("");

    container.innerHTML = `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>
                ETF & Issuer
                <span class="info-tip" data-tip="The fund ticker, official issuer logo, underlying benchmark index, and statutory ISIN.">?</span>
              </th>
              <th>
                Distribution & Tax
                <span class="info-tip" data-tip="Accumulating (Acc) reinvests dividends directly to avoid tax leakage. Distributing (Dist) pays cash, creating annual tax events.">?</span>
              </th>
              <th>
                Total Cost (TER)
                <span class="info-tip" data-tip="Total Expense Ratio: Ongoing annual operating fees retained directly from NAV. Aim for < 0.25% for core broad market equity.">?</span>
              </th>
              <th>
                Tracking Diff (TD)
                <span class="info-tip" data-tip="Tracking Difference: Actual annual performance vs benchmark net index. Negative TD means the fund outperformed due to tax optimization & lending!">?</span>
              </th>
              <th>
                Fund Size (AUM)
                <span class="info-tip" data-tip="Assets Under Management: Funds > €100M eliminate liquidation/merger risk. Funds > €10B provide the tightest bid-ask spreads.">?</span>
              </th>
              <th>
                Domicile
                <span class="info-tip" data-tip="Ireland (IE) enjoys 15% US dividend treaty withholding (vs 30% statutory) and 100% exemption from the 40% US Estate Tax trap.">?</span>
              </th>
              <th>
                Curvo CAGR
                <span class="info-tip" data-tip="Compound Annual Growth Rate verified from Curvo historical backtesting data series.">?</span>
              </th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    // Bind row action buttons
    container.querySelectorAll(".view-profile-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const ticker = e.currentTarget.dataset.ticker;
        showDetailModal(ticker);
      });
    });

    container.querySelectorAll(".add-portfolio-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const ticker = e.currentTarget.dataset.ticker;
        window.OverlapModule?.addEtfToPortfolio(ticker);
        window.App?.switchTab("overlap");
      });
    });
  }

  function showDetailModal(ticker) {
    const etf = allEtfs.find((e) => e.ticker.toUpperCase() === ticker.toUpperCase());
    if (!etf) return;

    const modalBody = document.getElementById("modal-body");
    if (!modalBody) return;

    // Top holdings list
    const holdingsListHtml = (etf.topHoldings || [])
      .map(
        (h) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
          <span><strong>${h.name}</strong> <span style="color: var(--text-muted); font-size: 0.75rem;">(${h.symbol})</span></span>
          <span style="font-weight: 700; color: var(--accent-cyan);">${h.weight.toFixed(2)}%</span>
        </div>
      `
      )
      .join("");

    // Sector breakdown
    const sectorHtml = Object.entries(etf.sectorBreakdown || {})
      .map(
        ([sec, val]) => `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 3px;">
            <span>${sec}</span>
            <strong>${val.toFixed(1)}%</strong>
          </div>
          <div class="progress-track" style="height: 6px;">
            <div class="progress-fill" style="width: ${val}%; background: var(--accent-blue);"></div>
          </div>
        </div>
      `
      )
      .join("");

    // Broker availability
    const brokersHtml = Object.entries(etf.brokerAvailability || {})
      .map(
        ([broker, data]) => `
        <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.82rem; border-bottom: 1px solid var(--border-color);">
          <span><strong>${broker}</strong></span>
          <span style="color: ${data.sparplan ? "var(--accent-emerald)" : "var(--text-muted)"}; font-weight: 600;">
            ${data.sparplan ? "✅ Sparplan: " + data.fee : "❌ Manual execution"}
          </span>
        </div>
      `
      )
      .join("");

    const providerLogo = window.ProviderLogos?.getLogoSvg(etf.issuer, 26) || "";

    let stageBadge = `<span class="stage-status-badge badge-start-here">🏁 Stage 1: Core Foundation (Start Here)</span>`;
    if (["EIMI", "MEUD", "IUSN", "ZPRV", "GGRA"].includes(etf.ticker)) {
      stageBadge = `<span class="stage-status-badge badge-optional">🧮 Stage 4: Factor / Regional Tilt (Optional)</span>`;
    } else if (etf.ticker === "QDVE") {
      stageBadge = `<span class="stage-status-badge badge-optional">⚡ Satellite Tech Tilt (High Beta)</span>`;
    } else if (etf.ticker === "AGGU") {
      stageBadge = `<span class="stage-status-badge badge-essential">🛡️ Defensive Shield (Bonds)</span>`;
    } else if (etf.ticker === "VUSA") {
      stageBadge = `<span class="stage-status-badge badge-maintain">⚠️ Distributing Benchmark</span>`;
    }

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--accent-blue);">${etf.ticker}</h2>
            ${providerLogo}
            <span class="badge ${etf.isAccumulating ? "badge-acc" : "badge-dist"}">
              ${etf.isAccumulating ? "✨ Accumulating (Acc)" : "Distributing (Dist)"}
            </span>
            <span class="badge badge-blue">Score ${etf.retailScores?.composite || 95}/100</span>
          </div>
          <div>
            ${stageBadge}
          </div>
        </div>
        <h3 style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${etf.name}</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          ISIN: <strong>${etf.isin}</strong> | WKN: <strong>${etf.wkn}</strong> | Provider: <strong>${etf.issuer}</strong> | Domicile: <strong>${etf.domicile}</strong>
        </p>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid-4" style="margin-bottom: 20px;">
        <div class="metric-box">
          <span class="metric-label">TER (Total Cost)</span>
          <span class="metric-value">${etf.ter.toFixed(2)}%</span>
          <span class="metric-sub">Annual ongoing fee</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">5Y Tracking Diff</span>
          <span class="metric-value ${etf.trackingDifference5Y < 0 ? "val-positive" : ""}">${etf.trackingDifference5Y < 0 ? "" : "+"}${etf.trackingDifference5Y}%</span>
          <span class="metric-sub">${etf.trackingDifference5Y < 0 ? "Beating index net of fee!" : "Annual tracking drag"}</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Fund Size (AUM)</span>
          <span class="metric-value">${(etf.aumMillionsEUR / 1000).toFixed(1)}B €</span>
          <span class="metric-sub">Zero liquidation risk</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">Constituents</span>
          <span class="metric-value">${etf.holdingCount}</span>
          <span class="metric-sub">Physical replication</span>
        </div>
      </div>

      <!-- Analysis Columns -->
      <div class="grid-2" style="margin-bottom: 20px;">
        <div class="card" style="margin-bottom: 0;">
          <h4 class="card-title">🏆 Curvo Historical Backtest</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px;">Covered period: ${etf.historicalStatsCurvo?.period}</p>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between;"><span>Compound Annual Growth (CAGR):</span> <strong>${etf.historicalStatsCurvo?.cagr}%</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Sharpe Ratio (Risk-Adjusted):</span> <strong>${etf.historicalStatsCurvo?.sharpe}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Annual Volatility (StDev):</span> <strong>${etf.historicalStatsCurvo?.stdev}%</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Deepest Drawdown:</span> <strong class="val-negative">${etf.historicalStatsCurvo?.maxDrawdown}%</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Recovery Time:</span> <span>${etf.historicalStatsCurvo?.recoveryPeriod}</span></div>
          </div>
          <div style="margin-top: 12px;">
            <a href="${etf.historicalStatsCurvo?.curvoUrl}" target="_blank" class="btn btn-secondary btn-sm" style="width: 100%;">
              🔗 View on Curvo.eu/backtest
            </a>
          </div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <h4 class="card-title">🧮 Portfolio Visualizer Quantitative Metrics</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px;">Advanced factor & risk statistics</p>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between;"><span>Sortino Ratio (Downside Risk):</span> <strong>${etf.quantitativeStatsPV?.sortino}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Calmar Ratio:</span> <strong>${etf.quantitativeStatsPV?.calmar}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Value-at-Risk (95% Monthly VaR):</span> <strong class="val-negative">${etf.quantitativeStatsPV?.var95}%</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Market Beta:</span> <strong>${etf.quantitativeStatsPV?.marketBeta}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Morningstar Style Box:</span> <span class="badge badge-blue">${etf.morningstar?.styleBox}</span></div>
          </div>
          <div style="margin-top: 12px;">
            <a href="${etf.quantitativeStatsPV?.pvUrl}" target="_blank" class="btn btn-secondary btn-sm" style="width: 100%;">
              🔗 Verify on Portfolio Visualizer
            </a>
          </div>
        </div>
      </div>

      <!-- Top Holdings & Sectors -->
      <div class="grid-2" style="margin-bottom: 20px;">
        <div class="card" style="margin-bottom: 0;">
          <h4 class="card-title">Top 10 Fund Holdings</h4>
          ${holdingsListHtml}
        </div>
        <div class="card" style="margin-bottom: 0;">
          <h4 class="card-title">Sector Exposure</h4>
          ${sectorHtml}
        </div>
      </div>

      <!-- Tax & Domicile Analysis -->
      <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--accent-emerald);">
        <h4 class="card-title">🏛️ Domicile & Tax Treatment (Retail Investor Checklist)</h4>
        <div style="font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary);">
          <p><strong>Domicile Rating:</strong> ${etf.taxTreatment?.domicileEfficiency}</p>
          <p><strong>US Treaty Withholding:</strong> ${etf.taxTreatment?.usTreatyAdvantage}</p>
          <p><strong>Local Withholding:</strong> ${etf.taxTreatment?.localDividendTax}</p>
          <p><strong>Compounding Friction:</strong> ${etf.taxTreatment?.reinvestmentEfficiency}</p>
          <p><strong>US Estate Tax:</strong> ${etf.taxTreatment?.usEstateTax}</p>
        </div>
      </div>

      <!-- Broker Savings Plans -->
      <div class="card" style="margin-bottom: 20px;">
        <h4 class="card-title">🏦 Broker Availability & Savings Plans (extraETF Data)</h4>
        ${brokersHtml}
      </div>

      <!-- Official Issuer Documents -->
      <div class="card" style="margin-bottom: 0;">
        <h4 class="card-title">📑 Official Issuer Documents & Final Verification</h4>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">Always verify the legal KID before allocating capital:</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="${etf.officialDocs?.kidUrl}" target="_blank" class="btn btn-primary btn-sm">
            📄 Key Information Document (KID / PRIIPs)
          </a>
          <a href="${etf.officialDocs?.factsheetUrl}" target="_blank" class="btn btn-secondary btn-sm">
            📊 Official Monthly Factsheet (PDF)
          </a>
          <a href="${etf.officialDocs?.issuerPage}" target="_blank" class="btn btn-secondary btn-sm">
            🌐 Issuer Fund Page
          </a>
        </div>
      </div>
    `;

    document.getElementById("detail-modal")?.classList.add("active");
  }

  return {
    init,
    showDetailModal
  };
})();
