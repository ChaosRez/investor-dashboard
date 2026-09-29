/**
 * Market News & Signal Radar Module
 * Two-Sided Intelligence: Relates macro/regulatory events to ETFs & maps selected ETFs to active news.
 * Grounded strictly in verified sources: ECB, Fed, European Commission, PBoC, IEA, FT, Bloomberg, Reuters.
 * Labels signal levels (Bullish/Neutral/Bearish, High/Moderate Impact, Strategic/Tactical).
 * Explains explicit transmission mechanisms (no baseless correlations) with disciplined Boglehead actions.
 */

window.NewsSignalsModule = (function () {
  let allNews = [];
  let filteredNews = [];
  let currentEtfFilter = "all";
  let currentSignalFilter = "all";
  let currentImpactFilter = "all";

  // Watchlist reference for badging and grouping
  const WATCHLIST_TICKERS = ["IUSQ", "SXR8", "IMAE", "XEON", "VHYL", "AII", "WTAI", "BATT", "RARE", "XCS6"];

  function init(news) {
    allNews = news || [];
    filteredNews = [...allNews];
    renderFilters();
    renderFeed();
  }

  function renderFilters() {
    const container = document.getElementById("news-filters-container");
    if (!container) return;

    // Collect all unique tickers mentioned across news
    const tickersSet = new Set();
    allNews.forEach(item => {
      (item.relatedEtfs || []).forEach(e => tickersSet.add(e.ticker.toUpperCase()));
    });
    const uniqueTickers = Array.from(tickersSet).sort();

    const watchlistInNews = uniqueTickers.filter(t => WATCHLIST_TICKERS.includes(t));
    const otherInNews = uniqueTickers.filter(t => !WATCHLIST_TICKERS.includes(t));

    container.innerHTML = `
      <div class="filter-bar" style="flex-wrap: wrap; gap: 10px;">
        <select id="news-etf-filter" class="filter-select" style="min-width: 240px; font-weight: 600;">
          <option value="all">🌐 All Affected ETFs (${uniqueTickers.length} tracked)</option>
          <optgroup label="⭐ My Watchlist ETFs">
            ${watchlistInNews.map(t => `<option value="${t}" ${currentEtfFilter === t ? "selected" : ""}>⭐ ${t} (Watchlist)</option>`).join("")}
          </optgroup>
          <optgroup label="🌍 Global Core & Other ETFs">
            ${otherInNews.map(t => `<option value="${t}" ${currentEtfFilter === t ? "selected" : ""}>${t}</option>`).join("")}
          </optgroup>
        </select>

        <div class="pill-group" id="news-signal-pill-group">
          <button class="pill-btn ${currentSignalFilter === "all" ? "active" : ""}" data-signal="all">All Signals</button>
          <button class="pill-btn ${currentSignalFilter === "watchlist" ? "active" : ""}" data-signal="watchlist" style="color: #fbbf24; font-weight: 700;">⭐ My Watchlist News</button>
          <button class="pill-btn ${currentSignalFilter === "bullish" ? "active" : ""}" data-signal="bullish">🟢 Bullish</button>
          <button class="pill-btn ${currentSignalFilter === "watch" ? "active" : ""}" data-signal="watch">🟡 Watch / Neutral</button>
          <button class="pill-btn ${currentSignalFilter === "bearish" ? "active" : ""}" data-signal="bearish">🔴 Bearish / Caution</button>
        </div>

        <select id="news-impact-filter" class="filter-select">
          <option value="all" ${currentImpactFilter === "all" ? "selected" : ""}>All Impact Levels</option>
          <option value="critical" ${currentImpactFilter === "critical" ? "selected" : ""}>⚡ Critical / High Impact Only</option>
          <option value="medium" ${currentImpactFilter === "medium" ? "selected" : ""}>⚖️ Moderate Impact</option>
        </select>

        ${currentEtfFilter !== "all" || currentSignalFilter !== "all" || currentImpactFilter !== "all" ? `
          <button id="reset-news-filters-btn" class="btn btn-secondary btn-sm" style="margin-left: auto;">
            ✕ Reset Filters
          </button>
        ` : ""}
      </div>
    `;

    document.getElementById("news-etf-filter")?.addEventListener("change", (e) => {
      currentEtfFilter = e.target.value;
      applyNewsFilters();
    });

    document.getElementById("news-impact-filter")?.addEventListener("change", (e) => {
      currentImpactFilter = e.target.value;
      applyNewsFilters();
    });

    document.getElementById("reset-news-filters-btn")?.addEventListener("click", () => {
      currentEtfFilter = "all";
      currentSignalFilter = "all";
      currentImpactFilter = "all";
      renderFilters();
      applyNewsFilters();
    });

    const pills = document.querySelectorAll("#news-signal-pill-group .pill-btn");
    pills.forEach(btn => {
      btn.addEventListener("click", () => {
        pills.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSignalFilter = btn.dataset.signal;
        applyNewsFilters();
      });
    });
  }

  function applyNewsFilters() {
    filteredNews = allNews.filter(item => {
      // ETF Match
      let matchEtf = true;
      if (currentEtfFilter !== "all") {
        matchEtf = (item.relatedEtfs || []).some(e => e.ticker.toUpperCase() === currentEtfFilter.toUpperCase());
      }

      // Signal Match
      let matchSignal = true;
      if (currentSignalFilter === "watchlist") {
        matchSignal = (item.relatedEtfs || []).some(e => WATCHLIST_TICKERS.includes(e.ticker.toUpperCase()));
      } else if (currentSignalFilter === "bullish") {
        matchSignal = item.signal?.bias.toLowerCase().includes("bullish");
      } else if (currentSignalFilter === "watch") {
        matchSignal = item.signal?.bias.toLowerCase().includes("watch") || item.signal?.bias.toLowerCase().includes("neutral");
      } else if (currentSignalFilter === "bearish") {
        matchSignal = item.signal?.bias.toLowerCase().includes("bearish") || item.signal?.bias.toLowerCase().includes("caution");
      }

      // Impact Match
      let matchImpact = true;
      if (currentImpactFilter !== "all") {
        matchImpact = (item.signal?.impactBadge || "").toLowerCase() === currentImpactFilter.toLowerCase();
      }

      return matchEtf && matchSignal && matchImpact;
    });

    renderFeed();
  }

  function getMacroSensitivityRationale(ticker) {
    const map = {
      XEON: "€STR Solactive Benchmark • ECB Deposit Facility Rate Transmission • Zero Duration Risk (Overnight Synthetic Swap)",
      AII: "Hyperscaler Capex Cycle ($220B+) • Electrical Power Grid Equipment • Utility Nuclear/Clean Baseload PPAs",
      RARE: "China Critical Mineral Export Controls • Western Defense Stockpiling • Strategic Rare Earth Mining Deficits",
      BATT: "Lithium Carbonate Spot Price Cycle • EV Battery Pack Manufacturing Margins • Global Supply Chain Tariffs",
      XCS6: "PBoC Monetary Stimulus • Mainland Shanghai/Shenzhen Institutional Swaps • Domestic Consumption Re-Rating",
      IMAE: "ECB Easing Trajectory • European Industrial Champions (Novo Nordisk, ASML, SAP) • Draghi Competitiveness Blueprint",
      SXR8: "S&P 500 Mega-Cap Earnings • Fed Neutral Rate (r*) Policy • Corporate Operating Margins & Tech Beta",
      IUSQ: "All-Country Global Equity Multiples • US Megacap + International Diversification • Broad Macroeconomic Liquidity",
      VHYL: "Global Corporate Cash Return Discipline • Financials Net Interest Margin • Dividend Withholding Tax Drag",
      AGGU: "Global Sovereign Yield Curves • Interest Rate Duration Sensitivity (6.7 Years) • Equity Market Shock Absorption",
      QDVE: "Semiconductor Lithography & Compute Capex • Mega-Cap Tech Concentration (Apple/Microsoft/NVIDIA) • AI Hardware Supercycle",
      EIMI: "Emerging Markets Currency Beta • TSMC Foundry Supremacy • China Policy Tailwinds (24% Benchmark Weight)",
      MEUD: "Stoxx Europe 600 Valuation Discount • ECB Borrowing Cost Relief • Industrials & Healthcare Dividends",
      VWCE: "Global Market-Cap Diversification • 3,600+ Underlying Constituents • Total Market Equity Resiliency"
    };
    return map[ticker.toUpperCase()] || "Macroeconomic Growth • Central Bank Interest Rate Cycle • Corporate Earnings Resilience";
  }

  function renderFeed() {
    const container = document.getElementById("news-feed-container");
    if (!container) return;

    let profileBannerHtml = "";

    // If a specific ETF is selected, render its dedicated Macro Profile & Signal Radar banner
    if (currentEtfFilter !== "all") {
      const etf = window.DataStore?.getEtfByTicker(currentEtfFilter);
      const isWatchlist = WATCHLIST_TICKERS.includes(currentEtfFilter.toUpperCase());
      const sensitivity = getMacroSensitivityRationale(currentEtfFilter);
      const etfNews = allNews.filter(n => (n.relatedEtfs || []).some(e => e.ticker.toUpperCase() === currentEtfFilter.toUpperCase()));
      const bullishCount = etfNews.filter(n => n.signal?.bias.toLowerCase().includes("bullish")).length;
      const watchCount = etfNews.filter(n => n.signal?.bias.toLowerCase().includes("watch") || n.signal?.bias.toLowerCase().includes("neutral")).length;
      const cautionCount = etfNews.filter(n => n.signal?.bias.toLowerCase().includes("bearish") || n.signal?.bias.toLowerCase().includes("caution")).length;

      profileBannerHtml = `
        <div class="card" style="border-left: 4px solid var(--accent-blue); margin-bottom: 24px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.05));">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="etf-tag" style="font-size: 1.05rem; padding: 4px 10px; font-weight: 800;">${currentEtfFilter}</span>
                ${isWatchlist ? '<span class="badge-watchlist">⭐ Watchlist Fund</span>' : ""}
                <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">${etf ? etf.name : currentEtfFilter}</span>
              </div>
              <p style="font-size: 0.84rem; color: var(--text-muted); margin: 0;">
                Provider: <strong>${etf?.issuer || "UCITS Issuer"}</strong> | ISIN: <code>${etf?.isin || "N/A"}</code> | TER: <strong>${etf?.ter || 0}%</strong> | Traded Price: <strong>${etf?.currentPriceEUR ? "€" + etf.currentPriceEUR : "Live NAV"}</strong>
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm jump-etf-modal-btn" data-ticker="${currentEtfFilter}">
                📄 View Factsheet / Details
              </button>
              <button class="btn btn-secondary btn-sm jump-etf-compare-btn" data-ticker="${currentEtfFilter}">
                ⚖️ Compare in Matrix
              </button>
              <button class="btn btn-primary btn-sm jump-etf-portfolio-btn" data-ticker="${currentEtfFilter}">
                🔗 Add to Portfolio
              </button>
            </div>
          </div>

          <div style="background: var(--bg-card); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 12px;">
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">
              ⚡ Macro Drivers & Fundamental Transmission Channels:
            </div>
            <div style="font-size: 0.88rem; color: var(--text-primary); font-weight: 600;">
              ${sensitivity}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; font-size: 0.84rem; flex-wrap: wrap;">
            <span><strong>${etfNews.length} Active Catalysts:</strong></span>
            ${bullishCount > 0 ? `<span class="badge badge-acc">🟢 ${bullishCount} Bullish</span>` : ""}
            ${watchCount > 0 ? `<span class="badge badge-amber">🟡 ${watchCount} Watch / Neutral</span>` : ""}
            ${cautionCount > 0 ? `<span class="badge badge-red">🔴 ${cautionCount} Caution</span>` : ""}
          </div>
        </div>
      `;
    }

    if (filteredNews.length === 0) {
      container.innerHTML = `
        ${profileBannerHtml}
        <div style="text-align: center; padding: 40px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px;">No market news items match this filter combination.</p>
          <p style="font-size: 0.85rem;">Try selecting "All Affected ETFs" or resetting your signal filters.</p>
          <button class="btn btn-secondary btn-sm" id="empty-state-reset-btn" style="margin-top: 10px;">
            Show All News
          </button>
        </div>
      `;

      document.getElementById("empty-state-reset-btn")?.addEventListener("click", () => {
        currentEtfFilter = "all";
        currentSignalFilter = "all";
        currentImpactFilter = "all";
        renderFilters();
        applyNewsFilters();
      });
      return;
    }

    const cardsHtml = filteredNews.map(item => {
      const sig = item.signal || {};
      let signalPillStyle = "background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399;";
      if (sig.bias.toLowerCase().includes("bearish") || sig.bias.toLowerCase().includes("caution")) {
        signalPillStyle = "background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.4); color: #fb7185;";
      } else if (sig.bias.toLowerCase().includes("watch") || sig.bias.toLowerCase().includes("neutral")) {
        signalPillStyle = "background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24;";
      }

      // Related ETFs list with two-sided interactive controls
      const etfListHtml = (item.relatedEtfs || []).map(e => {
        const logo = window.ProviderLogos?.getLogoSvg(e.issuer || e.ticker, 16) || "";
        const isWatchlist = WATCHLIST_TICKERS.includes(e.ticker.toUpperCase());
        const isCurrentlySelected = currentEtfFilter.toUpperCase() === e.ticker.toUpperCase();

        return `
          <div style="margin-bottom: 10px; padding: 10px; background: var(--bg-card); border-radius: 6px; border: 1px solid ${isCurrentlySelected ? "var(--accent-blue)" : "var(--border-color)"};">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="etf-tag" style="cursor: pointer; font-size: 0.85rem;" title="Click to filter feed by ${e.ticker}" data-action="filter-etf" data-ticker="${e.ticker}">
                  ${isWatchlist ? "⭐ " : ""}${e.ticker}
                </span>
                ${logo}
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">${e.issuer || ""}</span>
                ${isWatchlist ? '<span class="badge-watchlist" style="font-size: 0.65rem;">Watchlist</span>' : ""}
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-secondary btn-sm news-action-filter" data-ticker="${e.ticker}" style="font-size: 0.7rem; padding: 2px 8px;">
                  🔍 Filter to ${e.ticker}
                </button>
                <button class="btn btn-secondary btn-sm news-action-modal" data-ticker="${e.ticker}" style="font-size: 0.7rem; padding: 2px 8px;">
                  📄 Inspect Details
                </button>
              </div>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45;">
              <strong style="color: var(--text-primary);">Transmission Mechanism:</strong> ${e.relation}
            </div>
          </div>
        `;
      }).join("");

      const sourceLink = item.sourceUrl
        ? `<a href="${item.sourceUrl}" target="_blank" style="color: var(--accent-blue); text-decoration: underline; font-weight: 600;">${item.source} ↗</a>`
        : `<strong>${item.source}</strong>`;

      return `
        <div class="news-card" style="border-left-color: ${sig.biasColor || "var(--accent-blue)"};">
          <div class="news-header">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="signal-pill" style="${signalPillStyle}">
                ${sig.bias}
              </span>
              <span class="badge ${sig.impactBadge === "critical" ? "badge-red" : "badge-amber"}">
                ${sig.impact}
              </span>
              <span class="badge badge-blue">
                ${sig.timeframe}
              </span>
            </div>
            <div class="news-date">
              📅 ${item.date} • Verified Source: ${sourceLink}
            </div>
          </div>

          <h3 class="news-title">${item.title}</h3>
          ${item.summary ? `<p class="news-summary">${item.summary}</p>` : ""}

          <div style="background: var(--bg-secondary); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 12px; border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; display: flex; justify-content: space-between;">
              <span>Target ETFs Affected & Financial Transmission Channel:</span>
              <span style="font-size: 0.7rem; text-transform: none; color: var(--accent-emerald);">● Zero-speculation fundamental grounding</span>
            </div>
            ${etfListHtml}
          </div>

          <div class="retail-action-box">
            <strong>🛡️ Retail Boglehead Action:</strong>
            <span>${item.retailAction || item.retailBogleheadAction || "Maintain disciplined automated DCA into broad market index ETFs without attempting to front-run rate cycles."}</span>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = profileBannerHtml + cardsHtml;

    // Bind interactive buttons inside cards and banner
    bindCardInteractions(container);
  }

  function bindCardInteractions(container) {
    // Jump buttons in banner
    container.querySelectorAll(".jump-etf-modal-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const ticker = btn.dataset.ticker;
        window.ScreenerModule?.showDetailModal(ticker);
      });
    });

    container.querySelectorAll(".jump-etf-compare-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const ticker = btn.dataset.ticker;
        window.ComparisonMatrixModule?.addTicker(ticker);
        window.App?.switchTab("comparison");
      });
    });

    container.querySelectorAll(".jump-etf-portfolio-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const ticker = btn.dataset.ticker;
        window.OverlapModule?.addEtfToPortfolio(ticker);
        window.App?.switchTab("overlap");
      });
    });

    // In-card action buttons
    container.querySelectorAll(".news-action-filter").forEach(btn => {
      btn.addEventListener("click", () => {
        filterByEtf(btn.dataset.ticker);
      });
    });

    container.querySelectorAll("[data-action='filter-etf']").forEach(btn => {
      btn.addEventListener("click", () => {
        filterByEtf(btn.dataset.ticker);
      });
    });

    container.querySelectorAll(".news-action-modal").forEach(btn => {
      btn.addEventListener("click", () => {
        window.ScreenerModule?.showDetailModal(btn.dataset.ticker);
      });
    });
  }

  function filterByEtf(ticker) {
    currentEtfFilter = (ticker || "all").toUpperCase();
    currentSignalFilter = "all";
    renderFilters();
    applyNewsFilters();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getNewsForEtf(ticker) {
    ticker = (ticker || "").toUpperCase();
    return allNews.filter(n => (n.relatedEtfs || []).some(e => e.ticker.toUpperCase() === ticker));
  }

  return {
    init,
    filterByEtf,
    getNewsForEtf
  };
})();
