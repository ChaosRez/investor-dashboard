/**
 * Market News & Signal Radar Module
 * Relates real-world market intelligence to specific ETFs
 * Labels signal levels (Bullish/Neutral/Bearish, High/Medium/Low Impact, Strategic/Tactical)
 * Provides disciplined Bogleheads retail investor takeaways.
 */

window.NewsSignalsModule = (function () {
  let allNews = [];
  let filteredNews = [];

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
      (item.relatedEtfs || []).forEach(e => tickersSet.add(e.ticker));
    });
    const uniqueTickers = Array.from(tickersSet).sort();

    container.innerHTML = `
      <div class="filter-bar">
        <select id="news-etf-filter" class="filter-select">
          <option value="all">All Affected ETFs</option>
          ${uniqueTickers.map(t => `<option value="${t}">Filter by ETF: ${t}</option>`).join("")}
        </select>

        <div class="pill-group" id="news-signal-pill-group">
          <button class="pill-btn active" data-signal="all">All Signals</button>
          <button class="pill-btn" data-signal="bullish">🟢 Bullish Only</button>
          <button class="pill-btn" data-signal="watch">🟡 Watch / Neutral</button>
          <button class="pill-btn" data-signal="bearish">🔴 Bearish / Caution</button>
        </div>

        <select id="news-impact-filter" class="filter-select">
          <option value="all">All Impact Levels</option>
          <option value="critical">⚡ High Impact Only</option>
          <option value="medium">⚖️ Moderate Impact</option>
        </select>
      </div>
    `;

    document.getElementById("news-etf-filter")?.addEventListener("change", applyNewsFilters);
    document.getElementById("news-impact-filter")?.addEventListener("change", applyNewsFilters);

    const pills = document.querySelectorAll("#news-signal-pill-group .pill-btn");
    pills.forEach(btn => {
      btn.addEventListener("click", () => {
        pills.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyNewsFilters();
      });
    });
  }

  function applyNewsFilters() {
    const selectedEtf = document.getElementById("news-etf-filter")?.value || "all";
    const activePill = document.querySelector("#news-signal-pill-group .pill-btn.active");
    const selectedSignal = activePill ? activePill.dataset.signal : "all";
    const selectedImpact = document.getElementById("news-impact-filter")?.value || "all";

    filteredNews = allNews.filter(item => {
      // ETF Match
      let matchEtf = true;
      if (selectedEtf !== "all") {
        matchEtf = (item.relatedEtfs || []).some(e => e.ticker.toUpperCase() === selectedEtf.toUpperCase());
      }

      // Signal Match
      let matchSignal = true;
      if (selectedSignal === "bullish") matchSignal = item.signal?.bias.toLowerCase().includes("bullish");
      else if (selectedSignal === "watch") matchSignal = item.signal?.bias.toLowerCase().includes("watch") || item.signal?.bias.toLowerCase().includes("neutral");
      else if (selectedSignal === "bearish") matchSignal = item.signal?.bias.toLowerCase().includes("bearish") || item.signal?.bias.toLowerCase().includes("caution");

      // Impact Match
      let matchImpact = true;
      if (selectedImpact !== "all") {
        matchImpact = (item.signal?.impactBadge || "").toLowerCase() === selectedImpact.toLowerCase();
      }

      return matchEtf && matchSignal && matchImpact;
    });

    renderFeed();
  }

  function renderFeed() {
    const container = document.getElementById("news-feed-container");
    if (!container) return;

    if (filteredNews.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <p style="font-size: 1.1rem; font-weight: 600;">No news items match this filter combination.</p>
        </div>
      `;
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

      // Related ETFs list
      const etfListHtml = (item.relatedEtfs || []).map(e => {
        const logo = window.ProviderLogos?.getLogoSvg(e.issuer || e.ticker, 16) || "";
        return `
          <div style="margin-bottom: 6px; font-size: 0.82rem; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span class="etf-tag">${e.ticker}</span>
            ${logo}
            <span style="color: var(--text-secondary); margin-left: 2px;">${e.relation}</span>
          </div>
        `;
      }).join("");

      return `
        <div class="news-card" style="border-left-color: ${sig.biasColor || "var(--accent-blue)"};">
          <div class="news-header">
            <div style="display: flex; align-items: center; gap: 8px;">
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
              📅 ${item.date} • Source: <strong>${item.source}</strong>
            </div>
          </div>

          <h3 class="news-title">${item.title}</h3>
          <p class="news-summary">${item.summary}</p>

          <div style="background: var(--bg-secondary); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 12px; border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
              Target ETFs Affected & Transmission Mechanism:
            </div>
            ${etfListHtml}
          </div>

          <div class="retail-action-box">
            <strong>🛡️ Retail Boglehead Action:</strong>
            <span>${item.retailAction || item.retailBogleheadAction || "Maintain disciplined automated DCA into broad market index ETFs."}</span>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = cardsHtml;
  }

  return {
    init
  };
})();
