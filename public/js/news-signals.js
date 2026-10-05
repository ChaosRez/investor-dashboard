/**
 * Market News & Signal Radar Module
 * Two-Sided Intelligence: Relates macro/regulatory events to ETFs & maps selected ETFs to active news.
 * Grounded strictly in verified sources: ECB, Fed, European Commission, PBoC, IEA, FT, Bloomberg, Reuters.
 * Labels signal levels (Bullish/Neutral/Bearish, High/Moderate Impact, Strategic/Tactical).
 * Explains explicit transmission mechanisms (no baseless correlations) with disciplined Boglehead actions.
 *
 * Security: headlines and summaries come from third-party RSS feeds, so EVERY field is
 * escaped (UI.esc) and every link is protocol-checked (UI.safeUrl) before it reaches the DOM.
 */

window.NewsSignalsModule = (function () {
  const { esc, icon, fmt } = UI;

  let allNews = [];
  let filteredNews = [];
  let bound = false;
  const filters = { etf: "all", signal: "all", impact: "all" };

  // Watchlist reference for badging and grouping
  const WATCHLIST_TICKERS = ["IUSQ", "SXR8", "IMAE", "XEON", "VHYL", "AII", "WTAI", "BATT", "RARE", "XCS6"];

  const TONE_COLOR = { acc: "var(--accent-emerald)", amber: "var(--accent-amber)", red: "var(--accent-rose)" };
  const TONE_LABEL = { acc: "Bullish", amber: "Watch", red: "Caution" };

  const bias = (item) => String(item.signal?.bias || "").toLowerCase();
  const touches = (item, ticker) =>
    (item.relatedEtfs || []).some((e) => String(e.ticker).toUpperCase() === String(ticker).toUpperCase());

  /* ------------------------------------------------------------- lifecycle */
  function init(news) {
    allNews = news || [];
    renderFilters();
    applyNewsFilters({ announce: false });
    bindOnce();
  }

  function bindOnce() {
    if (bound) return;
    bound = true;

    const feed = document.getElementById("news-feed-container");
    feed.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const ticker = btn.dataset.ticker;

      if (btn.matches(".news-action-filter, [data-action='filter-etf']")) filterByEtf(ticker);
      else if (btn.matches(".news-action-modal, .jump-etf-modal-btn")) window.ScreenerModule?.showDetailModal(ticker, btn);
      else if (btn.matches(".jump-etf-compare-btn")) {
        window.ComparisonMatrixModule?.addTicker(ticker);
        window.App?.switchTab("comparison");
      } else if (btn.matches(".jump-etf-portfolio-btn")) {
        window.OverlapModule?.addEtfToPortfolio(ticker);
        window.App?.switchTab("overlap");
      } else if (btn.matches(".empty-state-reset-btn")) resetFilters();
    });

    const bar = document.getElementById("news-filters-container");
    bar.addEventListener("change", (e) => {
      if (e.target.id === "news-etf-filter") { filters.etf = e.target.value; applyNewsFilters(); }
      else if (e.target.id === "news-impact-filter") { filters.impact = e.target.value; applyNewsFilters(); }
    });
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.signal) {
        filters.signal = btn.dataset.signal;
        syncSignalPills();
        applyNewsFilters();
      } else if (btn.id === "reset-news-filters-btn") resetFilters();
    });
  }

  /* --------------------------------------------------------------- filters */
  function filtersActive() {
    return filters.etf !== "all" || filters.signal !== "all" || filters.impact !== "all";
  }

  function resetFilters() {
    Object.assign(filters, { etf: "all", signal: "all", impact: "all" });
    renderFilters();
    applyNewsFilters();
  }

  function renderFilters() {
    const container = document.getElementById("news-filters-container");
    if (!container) return;

    const tickers = new Set();
    allNews.forEach((item) => (item.relatedEtfs || []).forEach((e) => tickers.add(String(e.ticker).toUpperCase())));
    const unique = [...tickers].sort();
    const watch = unique.filter((t) => WATCHLIST_TICKERS.includes(t));
    const other = unique.filter((t) => !WATCHLIST_TICKERS.includes(t));
    const sel = (v) => (filters.etf === v ? " selected" : "");

    const pills = [
      ["all", "All signals"],
      ["watchlist", `${icon("star", "icon-fill")} My watchlist`],
      ["bullish", "Bullish"],
      ["watch", "Watch / neutral"],
      ["bearish", "Bearish / caution"],
    ]
      .map(([key, label]) => `<button type="button" class="pill-btn${filters.signal === key ? " active" : ""}" data-signal="${key}" aria-pressed="${filters.signal === key}">${label}</button>`)
      .join("");

    container.innerHTML = `
      <div class="filter-bar" role="group" aria-label="News filters">
        <label class="sr-only" for="news-etf-filter">Filter by ETF</label>
        <select id="news-etf-filter" class="filter-select">
          <option value="all">All affected ETFs (${unique.length})</option>
          <optgroup label="My watchlist">${watch.map((t) => `<option value="${esc(t)}"${sel(t)}>★ ${esc(t)}</option>`).join("")}</optgroup>
          <optgroup label="Global core &amp; other ETFs">${other.map((t) => `<option value="${esc(t)}"${sel(t)}>${esc(t)}</option>`).join("")}</optgroup>
        </select>

        <div class="pill-group" id="news-signal-pill-group" role="group" aria-label="Signal bias">${pills}</div>

        <label class="sr-only" for="news-impact-filter">Filter by impact level</label>
        <select id="news-impact-filter" class="filter-select">
          <option value="all"${filters.impact === "all" ? " selected" : ""}>All impact levels</option>
          <option value="critical"${filters.impact === "critical" ? " selected" : ""}>Critical / high impact only</option>
          <option value="medium"${filters.impact === "medium" ? " selected" : ""}>Moderate impact</option>
        </select>

        ${filtersActive() ? `<button type="button" id="reset-news-filters-btn" class="btn btn-ghost btn-sm filter-reset">${icon("x")} Reset filters</button>` : ""}
      </div>`;
  }

  function syncSignalPills() {
    document.querySelectorAll("#news-signal-pill-group .pill-btn").forEach((b) => {
      const on = b.dataset.signal === filters.signal;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }

  function applyNewsFilters({ announce = true } = {}) {
    filteredNews = allNews.filter((item) => {
      if (filters.etf !== "all" && !touches(item, filters.etf)) return false;

      const b = bias(item);
      if (filters.signal === "watchlist" && !(item.relatedEtfs || []).some((e) => WATCHLIST_TICKERS.includes(String(e.ticker).toUpperCase()))) return false;
      if (filters.signal === "bullish" && !b.includes("bullish")) return false;
      if (filters.signal === "watch" && !(b.includes("watch") || b.includes("neutral"))) return false;
      if (filters.signal === "bearish" && !(b.includes("bearish") || b.includes("caution"))) return false;

      if (filters.impact !== "all" && String(item.signal?.impactBadge || "").toLowerCase() !== filters.impact) return false;
      return true;
    });
    renderFeed(announce);
    // The reset button appears/disappears with the filter state
    const hasReset = !!document.getElementById("reset-news-filters-btn");
    if (hasReset !== filtersActive()) renderFilters();
  }

  /* ------------------------------------------------------------------ feed */
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
      VWCE: "Global Market-Cap Diversification • 3,600+ Underlying Constituents • Total Market Equity Resiliency",
    };
    return map[String(ticker).toUpperCase()] || "Macroeconomic Growth • Central Bank Interest Rate Cycle • Corporate Earnings Resilience";
  }

  /** "Live feed" for items from this sync; "Cached" for the last good copy of a feed that stopped answering. */
  function liveBadge(item) {
    if (!item.isStale) return `<span class="badge badge-neutral badge-sm">Live feed</span>`;
    const when = item.fetchedAt ? ` (fetched ${fmt.relative(item.fetchedAt)})` : "";
    return `<span class="badge badge-amber badge-sm" data-tip="${esc(`This feed did not answer on the latest Live Sync, so this is the last copy we fetched${when}.`)}">Cached</span>`;
  }

  function formatNewsDate(raw) {
    const s = String(raw || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return new Intl.DateTimeFormat(UI.locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${s}T00:00:00Z`));
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? s : fmt.dateTimeUtc(d.toISOString());
  }

  function bannerHtml() {
    const t = filters.etf;
    const etf = window.DataStore?.getEtfByTicker(t);
    const news = allNews.filter((n) => touches(n, t));
    const count = (re) => news.filter((n) => re.test(bias(n))).length;
    const bullish = count(/bullish/);
    const watch = count(/watch|neutral/);
    const caution = count(/bearish|caution/);
    const price = etf?.liveMarketData?.livePrice ?? etf?.currentPriceEUR;

    return `
      <section id="macro-profile-banner" class="card banner-card" aria-label="${esc(t)} macro profile">
        <div class="row-between wrap-gap mb-3">
          <div>
            <div class="cluster">
              <span class="etf-tag etf-tag-lg">${esc(t)}</span>
              ${WATCHLIST_TICKERS.includes(t.toUpperCase()) ? `<span class="badge badge-watchlist">${icon("star", "icon-fill")} Watchlist fund</span>` : ""}
              <strong>${esc(etf ? etf.name : t)}</strong>
            </div>
            <p class="text-muted text-sm mt-1">
              Provider <strong>${esc(etf?.issuer || "UCITS issuer")}</strong> · ISIN <code>${esc(etf?.isin || "N/A")}</code> ·
              TER <strong>${etf?.ter != null ? esc(fmt.pct(etf.ter, 2)) : "N/A"}</strong> ·
              Price <strong>${price != null ? esc(`€${price}`) : "Live NAV"}</strong>
            </p>
          </div>
          <div class="cluster">
            <button type="button" class="btn btn-secondary btn-sm jump-etf-modal-btn" data-ticker="${esc(t)}">${icon("file-text")} Factsheet / details</button>
            <button type="button" class="btn btn-secondary btn-sm jump-etf-compare-btn" data-ticker="${esc(t)}">${icon("scale")} Compare</button>
            <button type="button" class="btn btn-primary btn-sm jump-etf-portfolio-btn" data-ticker="${esc(t)}">${icon("plus")} Add to portfolio</button>
          </div>
        </div>

        <div class="panel mb-3">
          <div class="section-label">${icon("zap")} Macro drivers &amp; fundamental transmission channels</div>
          <div class="fw-600">${esc(getMacroSensitivityRationale(t))}</div>
        </div>

        <div class="cluster text-sm">
          <strong>${news.length} active ${news.length === 1 ? "catalyst" : "catalysts"}:</strong>
          ${bullish ? `<span class="badge badge-acc">${bullish} bullish</span>` : ""}
          ${watch ? `<span class="badge badge-amber">${watch} watch / neutral</span>` : ""}
          ${caution ? `<span class="badge badge-red">${caution} caution</span>` : ""}
        </div>
      </section>`;
  }

  function cardHtml(item) {
    const sig = item.signal || {};
    const tone = UI.signalTone(sig.bias);

    const etfRows = (item.relatedEtfs || [])
      .map((e) => {
        const t = String(e.ticker).toUpperCase();
        const watch = WATCHLIST_TICKERS.includes(t);
        const current = filters.etf.toUpperCase() === t;
        return `
          <div class="transmission${current ? " is-current" : ""}">
            <div class="row-between wrap-gap">
              <div class="cluster">
                <button type="button" class="etf-tag" data-action="filter-etf" data-ticker="${esc(t)}" data-tip="Filter the feed by ${esc(t)}">${watch ? icon("star", "icon-fill") : ""}${esc(t)}</button>
                ${window.ProviderLogos?.getLogoSvg(e.issuer || e.ticker, 16, { label: false }) || ""}
                <span class="text-sm fw-600">${esc(e.issuer || "")}</span>
                ${watch ? `<span class="badge badge-watchlist badge-sm">Watchlist</span>` : ""}
              </div>
              <div class="cluster">
                <button type="button" class="btn btn-secondary btn-sm news-action-filter" data-ticker="${esc(t)}">${icon("search")} Filter to ${esc(t)}</button>
                <button type="button" class="btn btn-secondary btn-sm news-action-modal" data-ticker="${esc(t)}">${icon("file-text")} Inspect</button>
              </div>
            </div>
            <p class="transmission-text"><strong>Transmission mechanism:</strong> ${esc(e.relation)}</p>
          </div>`;
      })
      .join("");

    const source = item.sourceUrl
      ? UI.link(item.sourceUrl, `${item.source || "Source"} ↗`)
      : `<strong>${esc(item.source || "Source")}</strong>`;

    return `
      <article class="news-card" style="border-left-color:${TONE_COLOR[tone]}">
        <div class="news-header">
          <div class="cluster">
            <span class="badge badge-${tone} signal-pill">${esc(sig.bias || "Watch / Neutral")}</span>
            <span class="badge ${sig.impactBadge === "critical" ? "badge-red" : "badge-amber"}">${esc(sig.impact || "")}</span>
            <span class="badge badge-blue">${esc(sig.timeframe || "")}</span>
            ${item.isLiveStream ? liveBadge(item) : ""}
          </div>
          <div class="news-date">${esc(formatNewsDate(item.date))} · Source: ${source}</div>
        </div>

        <h3 class="news-title">${esc(item.title)}</h3>
        ${item.summary ? `<p class="news-summary">${esc(item.summary)}</p>` : ""}

        <div class="panel transmission-box">
          <div class="row-between wrap-gap section-label">
            <span>Target ETFs affected &amp; financial transmission channel</span>
            <span class="grounding-note">${icon("check")} Zero-speculation fundamental grounding</span>
          </div>
          ${etfRows}
        </div>

        <div class="retail-action-box">
          <strong>${icon("shield")} Retail Boglehead action:</strong>
          <span>${esc(item.retailAction || item.retailBogleheadAction || "Maintain disciplined automated DCA into broad market index ETFs without attempting to front-run rate cycles.")}</span>
        </div>
      </article>`;
  }

  function renderFeed(announce = true) {
    const container = document.getElementById("news-feed-container");
    if (!container) return;

    const banner = filters.etf !== "all" ? bannerHtml() : "";
    const summary = `<div class="results-bar"><span class="results-count"${announce ? ' role="status"' : ""}>Showing <strong>${filteredNews.length}</strong> of ${allNews.length} stories</span></div>`;

    if (filteredNews.length === 0) {
      container.innerHTML = `${banner}${summary}
        <div class="empty-state">
          <div class="empty-state-title">No market news matches this filter combination</div>
          <p class="text-sm mb-4">Try selecting "All affected ETFs" or resetting the signal filters.</p>
          <button type="button" class="btn btn-secondary btn-sm empty-state-reset-btn">Show all news</button>
        </div>`;
      return;
    }
    container.innerHTML = `${banner}${summary}${filteredNews.map(cardHtml).join("")}`;
  }

  function filterByEtf(ticker) {
    filters.etf = (ticker || "all").toUpperCase();
    filters.signal = "all";
    renderFilters();
    applyNewsFilters();
    // Bring the (now filtered) feed into view without fighting the tab-switch scroll
    document.getElementById("news-filters-container")?.scrollIntoView({ behavior: UI.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }

  function getNewsForEtf(ticker) {
    return allNews.filter((n) => touches(n, ticker));
  }

  return { init, filterByEtf, getNewsForEtf };
})();
