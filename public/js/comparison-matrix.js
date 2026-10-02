/**
 * ETF Comparison Matrix Module
 * Side-by-side comparative analytics for 2 to 5 ETFs simultaneously.
 * Compares live market quotes, TER, tracking difference, AUM, tax domicile,
 * replication, Curvo CAGR, PV risk metrics, top holdings, and official KIDs.
 *
 * Semantics: real <thead>/<th scope> markup, a sticky label column for horizontal
 * scrolling, and an "apex:compare" event so other views (screener) stay in sync.
 */

window.ComparisonMatrixModule = (function () {
  const { esc, icon, fmt } = UI;
  const MAX_COMPARE = 5;

  let allEtfs = [];
  let etfsByTicker = {};
  let selectedTickers = ["IUSQ", "SXR8", "IMAE", "XEON", "WTAI"]; // Default to user watchlist top picks
  let bound = false;

  const comparisonPresets = {
    "user-watchlist": {
      name: "⭐ My Watchlist Core & Tilts",
      description: "Side-by-side view of your 5 primary watchlist ETFs",
      tickers: ["IUSQ", "SXR8", "IMAE", "XEON", "WTAI"],
    },
    "all-world-core": {
      name: "🌍 Global Core Shootout",
      description: "VWCE vs IWDA vs IUSQ (MSCI ACWI) vs FWRA (Invesco All-World)",
      tickers: ["VWCE", "IWDA", "IUSQ", "FWRA"],
    },
    "tech-ai": {
      name: "🤖 AI & Tech Showdown",
      description: "S&P 500 Tech (QDVE) vs Pure-Play AI (WTAI) vs AI Infrastructure (AII)",
      tickers: ["QDVE", "WTAI", "AII"],
    },
    "cash-yield": {
      name: "🛡️ Cash & Yield Alternatives",
      description: "Overnight €STR Cash (XEON) vs Global Bonds (AGGU) vs High Dividend (VHYL)",
      tickers: ["XEON", "AGGU", "VHYL"],
    },
    "batteries-resources": {
      name: "⚡ Energy Transition & Materials",
      description: "Battery Value-Chain (BATT) vs Rare Earths (RARE) vs China A-Shares (XCS6)",
      tickers: ["BATT", "RARE", "XCS6"],
    },
  };

  /* ------------------------------------------------------------- lifecycle */
  function init(etfs) {
    allEtfs = etfs || [];
    etfsByTicker = {};
    allEtfs.forEach((e) => { etfsByTicker[e.ticker.toUpperCase()] = e; });

    try {
      const parsed = JSON.parse(localStorage.getItem("apex_comparison_list"));
      if (Array.isArray(parsed) && parsed.length > 0) {
        selectedTickers = parsed.filter((t) => etfsByTicker[t]).slice(0, MAX_COMPARE);
      }
    } catch (e) { /* no saved list, or storage unavailable */ }

    renderInterface();
    updateCompareBadge();
    bindOnce();
  }

  function bindOnce() {
    if (bound) return;
    bound = true;
    // Single delegated handler for the whole matrix (survives re-renders)
    document.getElementById("comparison-matrix-container").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.matches(".compare-remove-btn")) {
        removeTicker(btn.dataset.ticker);
      } else if (btn.matches("#compare-clear-btn")) {
        selectedTickers = [];
        commit();
      } else if (btn.matches(".compare-preset-btn")) {
        const preset = comparisonPresets[btn.dataset.preset];
        if (preset) {
          selectedTickers = preset.tickers.filter((t) => etfsByTicker[t]);
          commit();
        }
      } else if (btn.matches(".compare-add-portfolio-btn")) {
        window.OverlapModule?.addEtfToPortfolio(btn.dataset.ticker, 20);
        window.App?.switchTab("overlap");
      } else if (btn.matches(".jump-to-news-btn")) {
        window.App?.switchTab("news");
        window.NewsSignalsModule?.filterByEtf(btn.dataset.ticker);
      }
    });

    document.getElementById("comparison-matrix-container").addEventListener("change", (e) => {
      if (e.target.matches("#compare-add-select") && e.target.value) addTicker(e.target.value);
    });
  }

  /* ----------------------------------------------------------------- state */
  function commit() {
    try { localStorage.setItem("apex_comparison_list", JSON.stringify(selectedTickers)); } catch (e) { /* ignore */ }
    renderInterface();
    updateCompareBadge();
    document.dispatchEvent(new CustomEvent("apex:compare", { detail: { tickers: [...selectedTickers] } }));
  }

  function addTicker(ticker) {
    ticker = String(ticker).toUpperCase();
    if (!etfsByTicker[ticker] || selectedTickers.includes(ticker)) return false;
    if (selectedTickers.length >= MAX_COMPARE) {
      UI.toast(`You can compare up to ${MAX_COMPARE} ETFs at once. Remove one first.`, { type: "warning" });
      return false;
    }
    selectedTickers.push(ticker);
    commit();
    return true;
  }

  function removeTicker(ticker) {
    ticker = String(ticker).toUpperCase();
    selectedTickers = selectedTickers.filter((t) => t !== ticker);
    commit();
  }

  function toggleTicker(ticker) {
    ticker = String(ticker).toUpperCase();
    if (selectedTickers.includes(ticker)) {
      removeTicker(ticker);
      return false;
    }
    return addTicker(ticker);
  }

  const isComparing = (ticker) => selectedTickers.includes(String(ticker || "").toUpperCase());

  function updateCompareBadge() {
    const badge = document.getElementById("compare-count-badge");
    if (badge) badge.textContent = String(selectedTickers.length);
  }

  /* ---------------------------------------------------------------- render */
  function sameSet(a, b) {
    return a.length === b.length && a.every((t) => b.includes(t));
  }

  function renderInterface() {
    const container = document.getElementById("comparison-matrix-container");
    if (!container) return;

    const compared = selectedTickers.map((t) => etfsByTicker[t]).filter(Boolean);
    const available = allEtfs.filter((e) => !selectedTickers.includes(e.ticker));
    const hadFocus = container.contains(document.activeElement) ? document.activeElement.id : null;

    const presetsHtml = Object.entries(comparisonPresets)
      .map(([key, p]) => `
        <button type="button" class="preset-card compare-preset-btn" data-preset="${key}" aria-pressed="${sameSet(p.tickers, selectedTickers)}">
          <span class="preset-card-title">${esc(p.name)}</span>
          <span class="preset-card-desc">${esc(p.description)}</span>
        </button>`)
      .join("");

    const body = compared.length === 0
      ? `<div class="empty-state">
           <div class="empty-state-title">No ETFs selected for comparison</div>
           <p class="text-sm mb-4">Pick a blueprint above, add funds from the dropdown, or use the compare button in the ETF Screener.</p>
           <button type="button" class="btn btn-primary btn-sm compare-preset-btn" data-preset="user-watchlist">${icon("star", "icon-fill")} Load my watchlist comparison</button>
         </div>`
      : `<div class="table-responsive compare-wrap">${buildComparisonTable(compared)}</div>`;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="cluster">
              <h2 class="card-title">${icon("scale")} Side-by-side ETF comparison matrix</h2>
              <span class="badge badge-acc">Comparing ${compared.length} of ${MAX_COMPARE}</span>
            </div>
            <span class="card-subtitle">Live price, TER, 5Y tracking difference, tax domicile, Curvo CAGR and PRIIPs SRI risk — in one view</span>
          </div>
          <div class="cluster">
            <label class="sr-only" for="compare-add-select">Add an ETF to the comparison</label>
            <select id="compare-add-select" class="filter-select" ${available.length === 0 || compared.length >= MAX_COMPARE ? "disabled" : ""}>
              <option value="">+ Add ETF to comparison…</option>
              ${available.map((e) => `<option value="${esc(e.ticker)}">${esc(e.ticker)} — ${esc(e.name)}</option>`).join("")}
            </select>
            <button type="button" id="compare-clear-btn" class="btn btn-danger btn-sm" ${compared.length === 0 ? "disabled" : ""}>${icon("x")} Clear all</button>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="section-label">Quick comparison blueprints</h3>
          <div class="preset-grid">${presetsHtml}</div>
        </div>

        ${body}
      </div>`;

    if (hadFocus) document.getElementById(hadFocus)?.focus();
  }

  /** Best-in-set marker for objective metrics (lowest cost, largest fund, …). */
  function bestMark(etf, etfs, getter, mode, text) {
    const mine = Number(getter(etf));
    const values = etfs.map((o) => Number(getter(o))).filter(Number.isFinite);
    if (!Number.isFinite(mine) || values.length < 2) return "";
    const best = mode === "min" ? Math.min(...values) : Math.max(...values);
    return mine === best ? `<div class="best-mark">${icon("star", "icon-fill")} ${esc(text)}</div>` : "";
  }

  function buildComparisonTable(etfs) {
    const cols = etfs.length + 1;
    const tip = (t) => (t ? `<span class="info-tip" data-tip="${esc(t)}">?</span>` : "");
    const row = (label, tipText, cell) => `
      <tr>
        <th scope="row" class="compare-sticky-col">${esc(label)}${tip(tipText)}</th>
        ${etfs.map((e) => `<td>${cell(e)}</td>`).join("")}
      </tr>`;
    const section = (title) => `
      <tr class="section-row"><th scope="colgroup" colspan="${cols}"><span class="section-title">${esc(title)}</span></th></tr>`;

    const news = window.DataStore?.getNews() || [];

    const head = `
      <thead>
        <tr>
          <th scope="col" class="compare-sticky-col">ETF profile</th>
          ${etfs.map((e) => `
            <th scope="col" class="compare-etf-col">
              <div class="compare-profile">
                <div class="cluster compare-profile-id">
                  <span class="ticker compare-ticker">${esc(e.ticker)}</span>
                  ${window.ProviderLogos?.getLogoSvg(e.issuer, 22, { label: false }) || ""}
                </div>
                <div class="compare-name">${esc(e.name)}</div>
                <div class="compare-isin">ISIN <span class="mono">${esc(e.isin)}</span></div>
                <button type="button" class="btn btn-danger btn-sm compare-remove-btn" data-ticker="${esc(e.ticker)}" aria-label="Remove ${esc(e.ticker)} from comparison">${icon("x")} Remove</button>
              </div>
            </th>`).join("")}
        </tr>
      </thead>`;

    const body = [
      section("1 · Market quote"),
      row("Traded price", "Latest quote fetched from Yahoo Finance European exchanges.", (e) => {
        const m = e.liveMarketData;
        if (!m || !Number.isFinite(Number(m.livePrice))) return `<span class="text-muted">No quote</span>`;
        const chg = Number(m.dayChangePercent) || 0;
        const cur = m.currency === "EUR" ? "€" : m.currency === "USD" ? "$" : `${m.currency} `;
        return `<strong class="cell-big">${esc(cur)}${esc(m.livePrice)}</strong>
                <div class="${chg >= 0 ? "val-positive" : "val-negative"} text-xs fw-700"><span aria-hidden="true">${chg >= 0 ? "▲" : "▼"}</span> ${esc(fmt.pct(Math.abs(chg), 2))} on the day</div>
                ${m.lastPriceUpdated ? `<div class="text-muted text-xs">${esc(fmt.relative(m.lastPriceUpdated))}</div>` : ""}`;
      }),
      row("52-week range", "Highest and lowest traded prices over the past rolling 52 weeks.", (e) => {
        const m = e.liveMarketData || {};
        return m.fiftyTwoWeekLow && m.fiftyTwoWeekHigh
          ? `<strong>${esc(m.fiftyTwoWeekLow)} – ${esc(m.fiftyTwoWeekHigh)}</strong>`
          : `<span class="text-muted">N/A</span>`;
      }),
      row("Primary exchange", "Official European exchange where the fund shares trade.", (e) =>
        `<span class="text-sm">${esc(e.liveMarketData?.exchange || "XETRA (Frankfurt)")}</span>`),

      section("2 · Costs, tracking & liquidity"),
      row("Total expense ratio (TER)", "Ongoing annual management fee retained directly from NAV.", (e) =>
        `<strong class="cell-big">${esc(fmt.pct(e.ter, 2))}</strong> <span class="text-muted text-xs">p.a.</span>${bestMark(e, etfs, (x) => x.ter, "min", "Lowest cost")}`),
      row("5Y tracking difference", "Average annual out- or under-performance vs the net index. Negative means the fund beats its benchmark net of fees.", (e) => {
        const td = Number(e.trackingDifference5Y);
        return `<strong class="${td < 0 ? "val-positive" : ""}">${esc(fmt.pct(td, 2, { sign: true }))}</strong>
                <div class="text-muted text-xs">${td < 0 ? "Outperforming benchmark" : "Annual tracking drag"}</div>${bestMark(e, etfs, (x) => x.trackingDifference5Y, "min", "Best tracking")}`;
      }),
      row("Fund size (AUM)", "Above €100M removes closure risk; above €10B gives institutional bid-ask spreads.", (e) =>
        `<strong>${esc(fmt.aum(e.aumMillionsEUR))}</strong>${bestMark(e, etfs, (x) => x.aumMillionsEUR, "max", "Largest fund")}`),

      section("3 · Tax treatment & structure"),
      row("Distribution policy", "Accumulating (Acc) reinvests dividends without taxable events. Distributing pays cash, creating annual tax friction.", (e) =>
        e.isAccumulating
          ? `<span class="badge badge-acc">Accumulating (Acc)</span><div class="text-muted text-xs mt-1">Auto-compounds</div>`
          : `<span class="badge badge-dist">Distributing (Dist)</span><div class="val-negative text-xs mt-1">Taxable dividend payout</div>`),
      row("Domicile & US withholding", "Ireland offers a 15% US dividend treaty rate (vs 30%) and shields investors from US estate tax.", (e) => {
        const ie = e.domicile === "Ireland";
        return `<span class="badge ${ie ? "badge-acc" : "badge-amber"}">${esc(e.domicile)}</span>
                <div class="text-muted text-xs mt-1">${ie ? "15% US treaty WHT · shielded from US estate tax" : "Standard treaty rate"}</div>`;
      }),
      row("Replication method", "Physical replication buys the underlying constituents. Synthetic uses a swap with collateral.", (e) =>
        `<span class="text-sm">${esc(e.replication || "—")}</span>`),

      section("4 · Historical returns & risk"),
      row("Curvo backtest CAGR", "Compound annual growth rate from Curvo.eu historical data.", (e) =>
        `<strong class="cell-big accent-blue">${e.historicalStatsCurvo?.cagr != null ? esc(fmt.pct(e.historicalStatsCurvo.cagr, 2)) : "N/A"}</strong>${bestMark(e, etfs, (x) => x.historicalStatsCurvo?.cagr, "max", "Highest CAGR")}`),
      row("Annualised volatility", "Standard deviation of returns. Lower means smoother compounding.", (e) =>
        `<strong>${e.historicalStatsCurvo?.stdev != null ? esc(fmt.pct(e.historicalStatsCurvo.stdev, 2)) : "N/A"}</strong>`),
      row("Max drawdown & recovery", "Deepest peak-to-trough decline in the historical series.", (e) =>
        `<span class="val-negative fw-700">${e.historicalStatsCurvo?.maxDrawdown != null ? esc(fmt.pct(e.historicalStatsCurvo.maxDrawdown, 1)) : "N/A"}</span>
         <div class="text-muted text-xs">${esc(e.historicalStatsCurvo?.recoveryPeriod || "")}</div>`),
      row("Sortino ratio", "Downside-risk-adjusted return — penalises only losses.", (e) =>
        `<strong>${esc(fmt.num(e.quantitativeStatsPV?.sortino, 2))}</strong>`),
      row("95% monthly VaR", "Worst expected monthly loss at 95% confidence.", (e) =>
        `<span class="val-negative fw-700">${e.quantitativeStatsPV?.var95 != null ? esc(fmt.pct(e.quantitativeStatsPV.var95, 2)) : "N/A"}</span>`),

      section("5 · Top constituent holdings"),
      row("Top 5 holdings", "The five largest individual positions inside the fund.", (e) => {
        const top5 = (e.topHoldings || []).slice(0, 5);
        if (top5.length === 0) return `<span class="text-muted text-xs">Sovereign collateral / cash basket</span>`;
        return `<ul class="holdings-mini">${top5.map((h) => `<li><span>${esc(h.name)}</span><strong>${esc(fmt.pct(h.weight, 2))}</strong></li>`).join("")}</ul>`;
      }),

      section("6 · Macro news signal"),
      row("Active signal", "Prevailing macroeconomic and regulatory news signal affecting this ETF.", (e) => {
        const related = news.filter((n) => (n.relatedEtfs || []).some((r) => String(r.ticker).toUpperCase() === e.ticker.toUpperCase()));
        if (related.length === 0) return `<span class="text-muted text-xs">Standard multi-year factors</span>`;
        const top = related[0];
        return `<span class="badge badge-${UI.signalTone(top.signal?.bias)}">${esc(top.signal?.bias || "Watch / Neutral")}</span>
                <div class="compare-news-title">${esc(String(top.title).slice(0, 56))}${String(top.title).length > 56 ? "…" : ""}</div>
                <button type="button" class="btn btn-secondary btn-sm jump-to-news-btn mt-2" data-ticker="${esc(e.ticker)}">${icon("rss")} ${related.length} ${related.length === 1 ? "story" : "stories"}</button>`;
      }),

      section("7 · Statutory documents & actions"),
      row("PRIIPs SRI risk", "Synthetic Risk Indicator from 1 (lowest) to 7 (highest) published on the statutory KID.", (e) =>
        `<span class="badge ${e.sriRisk <= 2 ? "badge-acc" : e.sriRisk >= 5 ? "badge-red" : "badge-blue"}">SRI ${esc(e.sriRisk)} / 7</span>`),
      row("Official KID & factsheet", "Mandatory legal documents from the issuer.", (e) => `
        <div class="stack compare-docs">
          ${UI.link(e.officialDocs?.kidUrl, `${icon("file-text")} Official KID`, { cls: "btn btn-secondary btn-sm", html: true })}
          ${UI.link(e.officialDocs?.factsheetUrl, `${icon("file-text")} Factsheet`, { cls: "btn btn-secondary btn-sm", html: true })}
        </div>`),
      row("Portfolio", "Add this ETF to your custom portfolio in the Overlap Auditor.", (e) =>
        `<button type="button" class="btn btn-primary btn-sm compare-add-portfolio-btn" data-ticker="${esc(e.ticker)}">${icon("plus")} Add to portfolio</button>`),
    ].join("");

    return `
      <table class="compare-table">
        <caption class="sr-only">Side-by-side comparison of ${etfs.map((e) => esc(e.ticker)).join(", ")}</caption>
        ${head}
        <tbody>${body}</tbody>
      </table>`;
  }

  return {
    init,
    addTicker,
    removeTicker,
    toggleTicker,
    isComparing,
    getSelectedTickers: () => [...selectedTickers],
    renderInterface,
  };
})();
