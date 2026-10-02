/**
 * ETF Explorer & Screener Module
 * Real data sourced from justETF, extraETF, and Trackinsight.
 * Evaluates ETFs on retail priorities: Accumulating, TER, TD, fund size, domicile, tax, brokers.
 *
 * UI notes
 *  - Dense, sortable table on desktop; each row becomes a card below 1000px.
 *  - One delegated click handler (no per-render re-binding); filter state survives re-init.
 *  - Every interpolated value is escaped; URLs are sanitised (see UI.esc / UI.safeUrl).
 */

window.ScreenerModule = (function () {
  const { esc, icon, fmt } = UI;

  let allEtfs = [];
  let filteredEtfs = [];
  let newsCounts = {};
  let bound = false;

  // Filter + sort state lives at module scope so a data refresh keeps the user's view.
  const state = { query: "", acc: "watchlist", domicile: "all", broker: "all", sort: "score", reverse: false };

  const SORTS = {
    score: { label: "Retail multi-factor score", get: (e) => e.retailScores?.composite, best: "desc" },
    ter: { label: "Lowest cost (TER)", get: (e) => e.ter, best: "asc" },
    td: { label: "Best tracking difference", get: (e) => e.trackingDifference5Y, best: "asc" },
    aum: { label: "Largest fund size", get: (e) => e.aumMillionsEUR, best: "desc" },
    cagr: { label: "Highest CAGR", get: (e) => e.historicalStatsCurvo?.cagr, best: "desc" },
  };

  const DOMICILE_CODES = {
    Ireland: "IE", Luxembourg: "LU", "United States": "US", Germany: "DE", Jersey: "JE", France: "FR", Switzerland: "CH",
  };
  const domicileCode = (d) => DOMICILE_CODES[d] || String(d || "—").slice(0, 2).toUpperCase();

  /* ------------------------------------------------------------- lifecycle */
  function init(etfs) {
    allEtfs = etfs || [];
    refreshNewsCounts();
    renderFilters();
    applyFilters();
    bindOnce();
  }

  function refreshNewsCounts() {
    newsCounts = {};
    (window.DataStore?.getNews() || []).forEach((n) => {
      new Set((n.relatedEtfs || []).map((e) => String(e.ticker).toUpperCase())).forEach((t) => {
        newsCounts[t] = (newsCounts[t] || 0) + 1;
      });
    });
  }

  function bindOnce() {
    if (bound) return;
    bound = true;

    const table = document.getElementById("screener-table-container");
    table.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.matches(".th-sort")) {
        const key = btn.dataset.sort;
        if (state.sort === key) state.reverse = !state.reverse;
        else { state.sort = key; state.reverse = false; }
        const select = document.getElementById("sort-filter");
        if (select) select.value = key;
        applyFilters();
        document.querySelector(`.th-sort[data-sort="${key}"]`)?.focus();
        return;
      }

      const ticker = btn.dataset.ticker;
      if (btn.matches(".view-profile-btn")) {
        showDetailModal(ticker, btn);
      } else if (btn.matches(".compare-btn")) {
        window.ComparisonMatrixModule?.toggleTicker(ticker);
        refreshCompareStates();
      } else if (btn.matches(".add-portfolio-btn")) {
        window.OverlapModule?.addEtfToPortfolio(ticker);
        window.App?.switchTab("overlap");
      } else if (btn.matches(".screener-news-badge")) {
        window.App?.switchTab("news");
        window.NewsSignalsModule?.filterByEtf(ticker);
      } else if (btn.matches(".clear-filters-btn")) {
        resetFilters();
      }
    });

    // Keep compare toggles truthful when the selection changes elsewhere
    document.addEventListener("apex:compare", refreshCompareStates);
  }

  function refreshCompareStates() {
    document.querySelectorAll("#screener-table-container .compare-btn").forEach((btn) => {
      const on = !!window.ComparisonMatrixModule?.isComparing(btn.dataset.ticker);
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("data-tip", on ? "Remove from comparison matrix" : "Add to comparison matrix");
    });
  }

  /* --------------------------------------------------------------- filters */
  function renderFilters() {
    const container = document.getElementById("screener-filters");
    if (!container) return;

    const watchCount = allEtfs.filter((e) => e.isUserWatchlist).length;
    const pill = (acc, label, extra = "") =>
      `<button type="button" class="pill-btn${state.acc === acc ? " active" : ""}" data-acc="${acc}" aria-pressed="${state.acc === acc}"${extra}>${label}</button>`;
    const opt = (value, label, current) =>
      `<option value="${esc(value)}"${current === value ? " selected" : ""}>${esc(label)}</option>`;

    container.innerHTML = `
      <div class="filter-bar" role="search" aria-label="Filter ETFs">
        <div class="search-field">
          ${icon("search")}
          <input type="search" id="screener-search" class="filter-input" value="${esc(state.query)}"
                 placeholder="Search ticker, ISIN, index…  ( / )" autocomplete="off" spellcheck="false"
                 aria-label="Search ETFs by ticker, ISIN, WKN or benchmark index" />
        </div>

        <div class="pill-group" id="acc-filter-group" role="group" aria-label="Fund selection">
          ${pill("all", "All Funds")}
          ${pill("watchlist", `${icon("star", "icon-fill")} My Watchlist (${watchCount})`, ' id="filter-watchlist-btn"')}
          ${pill("acc", "Accumulating (Acc)")}
          ${pill("dist", "Distributing (Dist)")}
        </div>

        <select id="domicile-filter" class="filter-select" aria-label="Domicile">
          ${opt("all", "All domiciles", state.domicile)}
          ${opt("ireland", "Ireland (IE)", state.domicile)}
          ${opt("luxembourg", "Luxembourg (LU)", state.domicile)}
        </select>

        <select id="broker-filter" class="filter-select" aria-label="Savings-plan broker">
          ${opt("all", "Any broker (Sparplan)", state.broker)}
          ${opt("Trade Republic", "Trade Republic", state.broker)}
          ${opt("Scalable Capital", "Scalable Capital", state.broker)}
          ${opt("Interactive Brokers", "Interactive Brokers", state.broker)}
          ${opt("DEGIRO", "DEGIRO", state.broker)}
          ${opt("ING", "ING", state.broker)}
          ${opt("flatex", "flatex", state.broker)}
        </select>

        <select id="sort-filter" class="filter-select" aria-label="Sort by">
          ${Object.entries(SORTS).map(([k, s]) => opt(k, `Sort: ${s.label}`, state.sort)).join("")}
        </select>
      </div>`;

    document.getElementById("screener-search").addEventListener("input", (e) => {
      state.query = e.target.value;
      applyFilters();
    });

    container.querySelectorAll("#acc-filter-group .pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.acc = btn.dataset.acc;
        container.querySelectorAll("#acc-filter-group .pill-btn").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-pressed", String(on));
        });
        applyFilters();
      });
    });

    document.getElementById("domicile-filter").addEventListener("change", (e) => { state.domicile = e.target.value; applyFilters(); });
    document.getElementById("broker-filter").addEventListener("change", (e) => { state.broker = e.target.value; applyFilters(); });
    document.getElementById("sort-filter").addEventListener("change", (e) => { state.sort = e.target.value; state.reverse = false; applyFilters(); });
  }

  function resetFilters() {
    Object.assign(state, { query: "", acc: "all", domicile: "all", broker: "all" });
    renderFilters();
    applyFilters();
  }

  function compareBy(key) {
    const { get, best } = SORTS[key];
    const sign = (best === "desc" ? -1 : 1) * (state.reverse ? -1 : 1);
    return (a, b) => {
      const va = Number(get(a));
      const vb = Number(get(b));
      const missingA = !Number.isFinite(va);
      const missingB = !Number.isFinite(vb);
      if (missingA || missingB) return missingA === missingB ? 0 : missingA ? 1 : -1; // missing last
      return (va - vb) * sign;
    };
  }

  function applyFilters() {
    const query = state.query.toLowerCase().trim();

    filteredEtfs = allEtfs.filter((etf) => {
      const haystack = [etf.ticker, etf.isin, etf.name, etf.benchmarkIndex, etf.wkn, ...(etf.secondaryTickers || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (query && !haystack.includes(query)) return false;

      if (state.acc === "watchlist" && etf.isUserWatchlist !== true) return false;
      if (state.acc === "acc" && etf.isAccumulating !== true) return false;
      if (state.acc === "dist" && etf.isAccumulating !== false) return false;

      if (state.domicile !== "all" && (etf.domicile || "").toLowerCase() !== state.domicile) return false;
      if (state.broker !== "all" && etf.brokerAvailability?.[state.broker]?.sparplan !== true) return false;
      return true;
    });

    filteredEtfs.sort(compareBy(state.sort));
    renderTable();
  }

  /* ----------------------------------------------------------------- table */
  function money(value, currency) {
    const cur = /^[A-Z]{3}$/.test(currency || "") ? currency : "EUR";
    try {
      return new Intl.NumberFormat(UI.locale, { style: "currency", currency: cur, minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(value);
    } catch (e) {
      return `${cur} ${value}`;
    }
  }

  function ariaSort(key) {
    if (state.sort !== key) return "";
    const descending = (SORTS[key].best === "desc") !== state.reverse;
    return ` aria-sort="${descending ? "descending" : "ascending"}"`;
  }

  function sortHeader(key, label, tip, cls = "") {
    const active = state.sort === key;
    const descending = active && (SORTS[key].best === "desc") !== state.reverse;
    const glyph = active ? (descending ? "arrow-down" : "arrow-up") : "sort";
    return `<th scope="col" class="${cls}"${ariaSort(key)}>
      <button type="button" class="th-sort${active ? " is-active" : ""}" data-sort="${key}">${esc(label)}${icon(glyph)}</button>${
        tip ? `<span class="info-tip" data-tip="${esc(tip)}">?</span>` : ""
      }</th>`;
  }

  function rowHtml(etf) {
    const t = esc(etf.ticker);
    const score = Number(etf.retailScores?.composite);
    const hasScore = Number.isFinite(score);
    const comparing = !!window.ComparisonMatrixModule?.isComparing(etf.ticker);
    const td = Number(etf.trackingDifference5Y);
    const tdBeats = Number.isFinite(td) && td < 0;
    const live = etf.liveMarketData;
    const news = newsCounts[String(etf.ticker).toUpperCase()] || 0;
    const isIreland = etf.domicile === "Ireland";

    let priceHtml = `<span class="text-muted">—</span>`;
    if (live && Number.isFinite(Number(live.livePrice))) {
      const chg = Number(live.dayChangePercent) || 0;
      const up = chg >= 0;
      const lo = live.fiftyTwoWeekLow ?? etf.fiftyTwoWeekLow;
      const hi = live.fiftyTwoWeekHigh ?? etf.fiftyTwoWeekHigh;
      priceHtml = `
        <div class="price">
          <span class="price-value">${esc(money(live.livePrice, live.currency))}</span>
          <span class="price-change ${up ? "val-positive" : "val-negative"}" aria-label="${up ? "up" : "down"} ${esc(fmt.num(Math.abs(chg), 2))} percent today"><span aria-hidden="true">${up ? "▲" : "▼"}</span> ${esc(fmt.num(Math.abs(chg), 2))}%</span>
        </div>
        ${lo && hi ? `<div class="price-sub" data-tip="52-week range from ${esc(live.exchange || "the exchange")}">52W ${esc(lo)}–${esc(hi)}</div>` : ""}`;
    }

    return `
      <tr data-ticker="${t}">
        <th scope="row" class="cell-etf">
          <div class="etf-id">
            <span class="ticker etf-ticker">${t}</span>
            ${window.ProviderLogos?.getLogoSvg(etf.issuer, 20, { label: false }) || ""}
            ${etf.isUserWatchlist ? `<span class="watch-star" role="img" aria-label="In your watchlist" data-tip="In your personal 10-ETF watchlist">${icon("star", "icon-fill")}</span>` : ""}
            ${news > 0 ? `<button type="button" class="badge badge-blue screener-news-badge" data-ticker="${t}" aria-label="${news} market news items affecting ${t}" data-tip="${news} active market ${news === 1 ? "catalyst" : "catalysts"} — open the news radar">${icon("rss")} ${news}</button>` : ""}
          </div>
          <div class="etf-name">${esc(etf.name)}</div>
          <div class="etf-meta"><span class="mono">${esc(etf.isin)}</span>${etf.wkn ? ` · WKN ${esc(etf.wkn)}` : ""}</div>
        </th>

        <td data-label="Score" class="cell-score"><div class="cell-value">
          ${hasScore
            ? `<div class="score"><strong>${esc(score)}</strong><span>/100</span></div>
               <div class="score-bar${score < 85 ? " is-low" : ""}" role="img" aria-label="Retail score ${esc(score)} out of 100"><span style="width:${Math.max(0, Math.min(100, score))}%"></span></div>`
            : `<span class="text-muted">—</span>`}
        </div></td>

        <td data-label="Distribution"><div class="cell-value">
          ${etf.isAccumulating
            ? `<span class="badge badge-acc" data-tip="Accumulating: dividends are reinvested automatically — no annual tax event, no cash drag.">Acc</span>`
            : `<span class="badge badge-dist" data-tip="Distributing: pays out cash dividends — a taxable event every distribution.">Dist</span>`}
        </div></td>

        <td data-label="TER" class="num"><div class="cell-value">${esc(fmt.pct(etf.ter, 2))}</div></td>

        <td data-label="5Y tracking diff." class="num"><div class="cell-value">
          <span class="${tdBeats ? "val-positive" : ""}">${esc(fmt.pct(td, 2, { sign: true }))}</span>
          ${tdBeats ? `<div class="cell-sub val-positive">beats index</div>` : ""}
        </div></td>

        <td data-label="Fund size" class="num"><div class="cell-value">${esc(fmt.aum(etf.aumMillionsEUR))}</div></td>

        <td data-label="Domicile"><div class="cell-value">
          <span class="badge ${isIreland ? "badge-acc" : "badge-amber"}" data-tip="${esc(etf.domicile)}${isIreland ? " — 15% US dividend treaty withholding, no US estate-tax exposure" : " — standard treaty rate"}">${esc(domicileCode(etf.domicile))}</span>
        </div></td>

        <td data-label="Curvo CAGR" class="num"><div class="cell-value">${etf.historicalStatsCurvo?.cagr != null ? esc(fmt.pct(etf.historicalStatsCurvo.cagr, 2)) : "—"}</div></td>

        <td data-label="Price" class="cell-price"><div class="cell-value">${priceHtml}</div></td>

        <td class="cell-actions">
          <button type="button" class="btn btn-secondary btn-sm view-profile-btn" data-ticker="${t}" aria-label="View ${t} details">${icon("eye")} Details</button>
          <button type="button" class="btn btn-secondary btn-sm btn-icon compare-btn" data-ticker="${t}" aria-pressed="${comparing}" aria-label="Compare ${t}" data-tip="${comparing ? "Remove from comparison matrix" : "Add to comparison matrix"}">${icon("scale")}</button>
          <button type="button" class="btn btn-secondary btn-sm btn-icon add-portfolio-btn" data-ticker="${t}" aria-label="Add ${t} to overlap audit" data-tip="Add to portfolio overlap audit">${icon("plus")}</button>
        </td>
      </tr>`;
  }

  function newestQuote() {
    const stamps = allEtfs
      .map((e) => e.liveMarketData?.lastPriceUpdated)
      .filter(Boolean)
      .map((s) => new Date(s).getTime())
      .filter(Number.isFinite);
    return stamps.length ? new Date(Math.max(...stamps)).toISOString() : null;
  }

  function renderTable() {
    const container = document.getElementById("screener-table-container");
    if (!container) return;

    const filtersActive = state.query || state.acc !== "all" || state.domicile !== "all" || state.broker !== "all";

    if (filteredEtfs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-title">No ETFs match these filters</div>
          <p class="text-sm mb-4">Try a different search term, or widen the selection.</p>
          <button type="button" class="btn btn-secondary btn-sm clear-filters-btn">Show all funds</button>
        </div>`;
      return;
    }

    const newest = newestQuote();
    container.innerHTML = `
      <div class="results-bar">
        <span class="results-count" role="status">Showing <strong>${filteredEtfs.length}</strong> of ${allEtfs.length} funds</span>
        ${filtersActive && state.acc !== "all" ? `<button type="button" class="btn btn-ghost btn-sm clear-filters-btn">${icon("x")} Show all funds</button>` : ""}
        <span class="results-note">Quotes via Yahoo Finance · AUM via justETF${newest ? ` · newest quote ${esc(fmt.dateTimeUtc(newest))}` : ""}</span>
      </div>

      <div class="etf-table-wrap">
        <table class="etf-table">
          <caption class="sr-only">ETF screener results, sortable by score, cost, tracking difference, fund size and CAGR</caption>
          <thead>
            <tr>
              <th scope="col">ETF <span class="info-tip" data-tip="Ticker, issuer, benchmark name and statutory ISIN. The star marks your personal watchlist.">?</span></th>
              ${sortHeader("score", "Score", "Retail multi-factor score (0–100): index coverage, total cost, tracking, fund size, domicile tax efficiency and broker availability.", "")}
              <th scope="col">Type <span class="info-tip" data-tip="Accumulating (Acc) reinvests dividends to avoid tax leakage. Distributing (Dist) pays cash, creating annual tax events.">?</span></th>
              ${sortHeader("ter", "TER", "Total Expense Ratio: ongoing annual fee retained from NAV. Aim for under 0.25% for core broad-market equity.", "num")}
              ${sortHeader("td", "5Y TD", "Tracking Difference vs the net index. Negative means the fund outperformed — via tax optimisation and securities lending.", "num")}
              ${sortHeader("aum", "Fund size", "Assets under management. Above €100M removes closure risk; above €10B gives the tightest spreads.", "num")}
              <th scope="col">Domicile <span class="info-tip" data-tip="Ireland (IE): 15% US dividend treaty withholding (vs 30%) and no exposure to the 40% US estate tax.">?</span></th>
              ${sortHeader("cagr", "CAGR", "Compound annual growth rate from Curvo historical backtest data.", "num")}
              <th scope="col">Price</th>
              <th scope="col"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>${filteredEtfs.map(rowHtml).join("")}</tbody>
        </table>
      </div>`;
  }

  /* ---------------------------------------------------------- detail dialog */
  const STAGE_BADGES = {
    XEON: ["badge-essential", "Stage 4 · Overnight cash buffer (€STR)"],
    SGLD: ["badge-essential", "Stage 4 · Real commodity / gold ETC"],
    AGGU: ["badge-essential", "Stage 4/5 · Defensive shield (bonds)"],
    EIMI: ["badge-optional", "Stage 5 · Factor / regional tilt (optional)"],
    MEUD: ["badge-optional", "Stage 5 · Factor / regional tilt (optional)"],
    IUSN: ["badge-optional", "Stage 5 · Factor / regional tilt (optional)"],
    ZPRV: ["badge-optional", "Stage 5 · Factor / regional tilt (optional)"],
    GGRA: ["badge-optional", "Stage 5 · Factor / regional tilt (optional)"],
    QDVE: ["badge-optional", "Stage 5 · Satellite tech tilt (high beta)"],
    VUSA: ["badge-maintain", "Distributing benchmark"],
  };

  function aumTier(millions) {
    const m = Number(millions);
    if (!Number.isFinite(m)) return { tone: "", text: "Fund size unavailable" };
    if (m >= 10000) return { tone: "val-positive", text: "Institutional-size fund" };
    if (m >= 1000) return { tone: "val-positive", text: "Large fund — low closure risk" };
    if (m >= 100) return { tone: "", text: "Above the €100M closure threshold" };
    return { tone: "val-negative", text: "Below €100M — closure risk" };
  }

  const kv = (label, value) => `<div class="kv"><dt>${label}</dt><dd>${value}</dd></div>`;

  function barRows(entries, { max, format }) {
    const top = max || Math.max(...entries.map(([, v]) => Number(v) || 0), 1);
    return entries
      .map(([label, value, sub]) => {
        const v = Number(value) || 0;
        return `<div class="bar-row">
          <div class="bar-row-head"><span>${esc(label)}${sub ? ` <span class="text-muted text-xs">(${esc(sub)})</span>` : ""}</span><strong>${esc(format(v))}</strong></div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.max(1.5, Math.min(100, (v / top) * 100)).toFixed(1)}%"></div></div>
        </div>`;
      })
      .join("");
  }

  function modalNewsHtml(etf) {
    const related = (window.DataStore?.getNews() || []).filter((n) =>
      (n.relatedEtfs || []).some((e) => String(e.ticker).toUpperCase() === String(etf.ticker).toUpperCase())
    );
    if (related.length === 0) {
      return `<div class="callout callout-info">${icon("info")}<div>No urgent sector-specific alerts active for <strong>${esc(etf.ticker)}</strong>. Fund performance is primarily governed by broad multi-year macroeconomic drivers.</div></div>`;
    }
    return related
      .map((item) => {
        const sig = item.signal || {};
        const rel = (item.relatedEtfs || []).find((e) => String(e.ticker).toUpperCase() === String(etf.ticker).toUpperCase()) || {};
        return `
          <article class="mini-news">
            <div class="row-between mini-news-head">
              <div class="cluster">
                <span class="badge badge-${UI.signalTone(sig.bias)}">${esc(sig.bias || "Watch / Neutral")}</span>
                <span class="badge ${sig.impactBadge === "critical" ? "badge-red" : "badge-amber"}">${esc(sig.impact || "")}</span>
              </div>
              <span class="text-muted text-xs">${esc(item.date)} · ${UI.link(item.sourceUrl, `${item.source || "Source"} ↗`)}</span>
            </div>
            <h5 class="mini-news-title">${esc(item.title)}</h5>
            ${item.summary ? `<p class="text-secondary text-sm">${esc(item.summary)}</p>` : ""}
            <p class="mini-news-mech"><strong>Transmission mechanism:</strong> ${esc(rel.relation || "Systemic market transmission.")}</p>
          </article>`;
      })
      .join("");
  }

  function showDetailModal(ticker, opener) {
    const etf = allEtfs.find((e) => e.ticker.toUpperCase() === String(ticker).toUpperCase());
    const body = document.getElementById("modal-body");
    if (!etf || !body) return;

    const t = esc(etf.ticker);
    const live = etf.liveMarketData && Number.isFinite(Number(etf.liveMarketData.livePrice)) ? etf.liveMarketData : null;
    const hist = etf.historicalStatsCurvo || {};
    const pv = etf.quantitativeStatsPV || {};
    const tax = etf.taxTreatment || {};
    const docs = etf.officialDocs || {};
    const [stageTone, stageText] = STAGE_BADGES[etf.ticker] || ["badge-start-here", "Stage 1 · Core foundation (start here)"];
    const td = Number(etf.trackingDifference5Y);
    const tier = aumTier(etf.aumMillionsEUR);
    const comparing = !!window.ComparisonMatrixModule?.isComparing(etf.ticker);
    const quoteTime = live && live.lastPriceUpdated ? new Date(live.lastPriceUpdated).getTime() : NaN;
    const liveFresh = Number.isFinite(quoteTime) && (Date.now() - quoteTime) / 36e5 <= 36;

    const holdings = (etf.topHoldings || []).slice(0, 10).map((h) => [h.name, h.weight, h.symbol]);
    const sectors = Object.entries(etf.sectorBreakdown || {}).sort((a, b) => b[1] - a[1]).map(([s, v]) => [s, v]);
    const brokers = Object.entries(etf.brokerAvailability || {});

    body.innerHTML = `
      <div class="modal-head">
        <h2 id="detail-modal-title" class="modal-title etf-modal-title">
          <span class="ticker">${t}</span>
          <span class="etf-modal-name">${esc(etf.name)}</span>
        </h2>
        <div class="cluster mt-2">
          ${window.ProviderLogos?.getLogoSvg(etf.issuer, 24) || ""}
          <span class="badge ${etf.isAccumulating ? "badge-acc" : "badge-dist"}">${etf.isAccumulating ? "Accumulating (Acc)" : "Distributing (Dist)"}</span>
          ${etf.isUserWatchlist ? `<span class="badge badge-watchlist">${icon("star", "icon-fill")} My watchlist</span>` : ""}
          ${Number.isFinite(Number(etf.retailScores?.composite)) ? `<span class="badge badge-blue">Score ${esc(etf.retailScores.composite)}/100</span>` : ""}
          <span class="stage-status-badge ${stageTone}">${esc(stageText)}</span>
        </div>
        <p class="text-muted text-sm mt-2">
          ISIN <strong class="mono">${esc(etf.isin)}</strong> · WKN <strong>${esc(etf.wkn)}</strong> ·
          Provider <strong>${esc(etf.issuer)}</strong> · Domicile <strong>${esc(etf.domicile)}</strong>
        </p>
        <div class="cluster mt-3">
          <button type="button" class="btn btn-primary btn-sm modal-action-compare" data-ticker="${t}">${icon("scale")} ${comparing ? "Open comparison matrix" : "Add to comparison matrix"}</button>
          <button type="button" class="btn btn-secondary btn-sm modal-action-audit" data-ticker="${t}">${icon("plus")} Add to overlap audit</button>
        </div>
      </div>

      ${live ? `
      <section class="callout ${liveFresh ? "callout-success" : "callout-info"} live-card" aria-label="Market quote">
        <div class="live-card-inner">
          <div class="row-between">
            <strong><span class="status-dot is-inline" data-state="${liveFresh ? "fresh" : "aging"}"></span>${liveFresh ? "Live quote" : "Last quote"} · ${esc(live.exchange || "Exchange")}</strong>
            ${live.lastPriceUpdated ? `<span class="text-muted text-xs" data-tip="${esc(fmt.dateTimeUtc(live.lastPriceUpdated))}">updated ${esc(fmt.relative(live.lastPriceUpdated))}</span>` : ""}
          </div>
          <div class="grid-4 mt-3">
            <div><div class="text-muted text-xs">Traded price</div><strong class="live-figure">${esc(money(live.livePrice, live.currency))}</strong></div>
            <div><div class="text-muted text-xs">Daily change</div><strong class="live-figure ${Number(live.dayChangePercent) >= 0 ? "val-positive" : "val-negative"}">${esc(fmt.pct(live.dayChangePercent, 2, { sign: true }))}</strong></div>
            <div><div class="text-muted text-xs">52-week range</div><strong class="live-figure">${esc(live.fiftyTwoWeekLow ?? "N/A")} – ${esc(live.fiftyTwoWeekHigh ?? "N/A")}</strong></div>
            <div><div class="text-muted text-xs">Fund size (justETF)</div><strong class="live-figure">${esc(fmt.aum(etf.aumMillionsEUR))}</strong></div>
          </div>
        </div>
      </section>` : ""}

      <div class="grid-4 mb-5">
        <div class="metric-box"><span class="metric-label">TER (total cost)</span><span class="metric-value">${esc(fmt.pct(etf.ter, 2))}</span><span class="metric-sub">Annual ongoing fee</span></div>
        <div class="metric-box"><span class="metric-label">5Y tracking difference</span><span class="metric-value ${td < 0 ? "val-positive" : ""}">${esc(fmt.pct(td, 2, { sign: true }))}</span><span class="metric-sub">${td < 0 ? "Beating the index net of fees" : "Annual tracking drag"}</span></div>
        <div class="metric-box"><span class="metric-label">Fund size (AUM)</span><span class="metric-value">${esc(fmt.aum(etf.aumMillionsEUR))}</span><span class="metric-sub ${tier.tone}">${esc(tier.text)}</span></div>
        <div class="metric-box"><span class="metric-label">Constituents</span><span class="metric-value">${esc(fmt.num(etf.holdingCount))}</span><span class="metric-sub">${esc(etf.replication || "")}</span></div>
      </div>

      <div class="grid-2 mb-5">
        <section class="card modal-card" aria-labelledby="dm-curvo">
          <h3 id="dm-curvo" class="card-title">Curvo historical backtest</h3>
          <p class="text-muted text-xs mb-3">Covered period: ${esc(hist.period || "n/a")}</p>
          <dl class="kv-list">
            ${kv("Compound annual growth (CAGR)", esc(fmt.pct(hist.cagr, 2)))}
            ${kv("Sharpe ratio", esc(fmt.num(hist.sharpe, 2)))}
            ${kv("Annual volatility (StDev)", esc(fmt.pct(hist.stdev, 2)))}
            ${kv("Deepest drawdown", `<span class="val-negative">${esc(fmt.pct(hist.maxDrawdown, 1))}</span>`)}
            ${kv("Recovery time", esc(hist.recoveryPeriod || "—"))}
          </dl>
          ${hist.curvoUrl ? `<div class="mt-3">${UI.link(hist.curvoUrl, "View on Curvo.eu/backtest ↗", { cls: "btn btn-secondary btn-sm btn-block" })}</div>` : ""}
        </section>

        <section class="card modal-card" aria-labelledby="dm-pv">
          <h3 id="dm-pv" class="card-title">Portfolio Visualizer metrics</h3>
          <p class="text-muted text-xs mb-3">Advanced factor and risk statistics</p>
          <dl class="kv-list">
            ${kv("Sortino ratio (downside risk)", esc(fmt.num(pv.sortino, 2)))}
            ${kv("Calmar ratio", esc(fmt.num(pv.calmar, 2)))}
            ${kv("95% monthly VaR", `<span class="val-negative">${esc(fmt.pct(pv.var95, 2))}</span>`)}
            ${kv("Market beta", esc(fmt.num(pv.marketBeta, 2)))}
            ${kv("Morningstar style box", `<span class="badge badge-blue">${esc(etf.morningstar?.styleBox || "—")}</span>`)}
          </dl>
          ${pv.pvUrl ? `<div class="mt-3">${UI.link(pv.pvUrl, "Verify on Portfolio Visualizer ↗", { cls: "btn btn-secondary btn-sm btn-block" })}</div>` : ""}
        </section>
      </div>

      <div class="grid-2 mb-5">
        <section class="card modal-card" aria-labelledby="dm-hold">
          <h3 id="dm-hold" class="card-title">Top ${holdings.length || 10} holdings</h3>
          ${holdings.length ? barRows(holdings, { format: (v) => fmt.pct(v, 2) }) : `<p class="text-muted text-sm">Sovereign collateral / cash basket — no equity constituents.</p>`}
        </section>
        <section class="card modal-card" aria-labelledby="dm-sect">
          <h3 id="dm-sect" class="card-title">Sector exposure</h3>
          ${sectors.length ? barRows(sectors, { format: (v) => fmt.pct(v, 1) }) : `<p class="text-muted text-sm">Not applicable for this asset class.</p>`}
        </section>
      </div>

      <section class="card modal-card callout-edge-emerald mb-5" aria-labelledby="dm-tax">
        <h3 id="dm-tax" class="card-title">Domicile &amp; tax treatment</h3>
        <dl class="kv-list kv-wide">
          ${kv("Domicile rating", esc(tax.domicileEfficiency || "—"))}
          ${kv("US treaty withholding", esc(tax.usTreatyAdvantage || "—"))}
          ${kv("Local withholding", esc(tax.localDividendTax || "—"))}
          ${kv("Compounding friction", esc(tax.reinvestmentEfficiency || "—"))}
          ${kv("US estate tax", esc(tax.usEstateTax || "—"))}
        </dl>
      </section>

      <section class="card modal-card mb-5" aria-labelledby="dm-brk">
        <h3 id="dm-brk" class="card-title">Broker availability &amp; savings plans <span class="text-muted text-xs">(extraETF)</span></h3>
        <dl class="kv-list">
          ${brokers.length
            ? brokers.map(([broker, d]) => kv(`<strong>${esc(broker)}</strong>`, d.sparplan
                ? `<span class="val-positive">${icon("check")} Sparplan · ${esc(d.fee)}</span>`
                : `<span class="text-muted">${icon("x")} Manual execution</span>`)).join("")
            : `<div class="text-muted text-sm">No broker data available.</div>`}
        </dl>
      </section>

      <section class="card modal-card callout-edge-blue mb-5" aria-labelledby="dm-news">
        <div class="card-header">
          <div>
            <h3 id="dm-news" class="card-title">Active macro &amp; market news affecting ${t}</h3>
            <span class="card-subtitle">Transmission mechanisms from official sources</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm modal-jump-radar-btn" data-ticker="${t}">${icon("rss")} Open in signal radar</button>
        </div>
        ${modalNewsHtml(etf)}
      </section>

      <section class="card modal-card mb-0" aria-labelledby="dm-docs">
        <h3 id="dm-docs" class="card-title">Official issuer documents</h3>
        <p class="text-muted text-sm mb-3">Always verify the legal KID before allocating capital:</p>
        <div class="cluster">
          ${docs.kidUrl ? UI.link(docs.kidUrl, `${icon("file-text")} Key Information Document (KID)`, { cls: "btn btn-primary btn-sm", html: true }) : ""}
          ${docs.factsheetUrl ? UI.link(docs.factsheetUrl, `${icon("file-text")} Monthly factsheet (PDF)`, { cls: "btn btn-secondary btn-sm", html: true }) : ""}
          ${docs.issuerPage ? UI.link(docs.issuerPage, `${icon("globe")} Issuer fund page`, { cls: "btn btn-secondary btn-sm", html: true }) : ""}
        </div>
      </section>`;

    const overlay = document.getElementById("detail-modal");
    const tk = etf.ticker;

    overlay.querySelector(".modal-action-compare")?.addEventListener("click", () => {
      window.ComparisonMatrixModule?.addTicker(tk);
      UI.dialog.close("detail-modal");
      window.App?.switchTab("comparison");
    });
    overlay.querySelector(".modal-action-audit")?.addEventListener("click", () => {
      window.OverlapModule?.addEtfToPortfolio(tk);
      UI.dialog.close("detail-modal");
      window.App?.switchTab("overlap");
    });
    overlay.querySelector(".modal-jump-radar-btn")?.addEventListener("click", () => {
      UI.dialog.close("detail-modal");
      window.App?.switchTab("news");
      window.NewsSignalsModule?.filterByEtf(tk);
    });

    body.scrollTop = 0;
    UI.dialog.open("detail-modal", { opener: opener || document.activeElement });
  }

  return { init, showDetailModal };
})();
