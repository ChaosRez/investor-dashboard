/**
 * Application Controller
 *  - Theme: saved choice → system preference → dark (applied pre-paint by index.html)
 *  - Tabs: WAI-ARIA tab pattern, arrow-key navigation, hash routing, lazy view work
 *  - Roadmap: the numbered tabs ARE the 7-stage roadmap; a context bar explains the
 *    active stage and links to the previous/next one
 *  - Data: render instantly from the bundled store (works offline / file://), then
 *    hydrate from the REST API in the background and re-render only if it differs
 */

window.App = (function () {
  const THEME_KEY = "etf_dashboard_theme";

  const TABS = ["screener", "comparison", "overlap", "curvo", "parity", "pv", "news", "verification", "academy"];

  const STAGES = {
    screener: {
      stage: 1, status: "start", statusLabel: "Start Here (Essential)", short: "Foundation",
      title: "Foundation & Core Selection",
      desc: "Pick 1 or 2 low-cost, broad-market Accumulating (Acc) ETFs (e.g. VWCE or IWDA+EIMI). Check TER < 0.25%, AUM > €1B, and Ireland domicile.",
    },
    overlap: {
      stage: 2, status: "essential", statusLabel: "Essential (If >1 Fund)", short: "Overlap audit",
      title: "Overlap & Redundancy Audit",
      desc: "Verify you aren't unintentionally double-dipping into the same tech giants (Apple, NVIDIA, Microsoft). Avoid holding VWCE + IWDA together.",
    },
    curvo: {
      stage: 3, status: "essential", statusLabel: "Planning Phase", short: "DCA plan",
      title: "DCA & Compounding Plan",
      desc: "Simulate your monthly Sparplan contributions using Curvo historical data. Project real inflation-adjusted purchasing power over 10–30 years.",
    },
    parity: {
      stage: 4, status: "essential", statusLabel: "Regime Resilience", short: "Parity & stress-test",
      title: "Robust Parity & Stress-Test",
      desc: "Size positions with HRP or Equal Risk Contribution (Risk Parity). Stress-test downside across 2000, 2008 & 2022 crises against behavioral drawdown limits.",
    },
    pv: {
      stage: 5, status: "optional", statusLabel: "Optional / Advanced", short: "Risk tuning",
      title: "Risk Tuning & Factor Tilts",
      desc: "Optional: Add a 10–20% bond shield (AGGU) or small-cap tilt (IUSN) if you want to smooth drawdowns along the Markowitz Efficient Frontier.",
    },
    news: {
      stage: 6, status: "maintain", statusLabel: "Maintenance Phase", short: "News radar",
      title: "News Radar & Discipline",
      desc: "Monitor macro interest rate & earnings signals. Follow Boglehead action rules: never panic-trade on headlines; maintain automated monthly DCA.",
    },
    verification: {
      stage: 7, status: "start", statusLabel: "Mandatory Check", short: "Verification",
      title: "Statutory Verification",
      desc: "Before buying, verify the official PRIIPs KID for SRI risk rating and ongoing charges. Download factsheets from the issuer.",
    },
  };
  const STAGE_ORDER = ["screener", "overlap", "curvo", "parity", "pv", "news", "verification"];
  const STATUS_BADGE = {
    start: "badge-start-here",
    essential: "badge-essential",
    optional: "badge-optional",
    maintain: "badge-maintain",
  };

  let etfsData = [];
  let correlationsData = null;
  let newsData = [];
  let educationData = null;
  let currentTab = null;
  let lastSyncAttempt = null; // { at, summary } for the freshness tooltip; session only

  const $ = (id) => document.getElementById(id);
  const smooth = () => (UI.prefersReducedMotion() ? "auto" : "smooth");

  /* ------------------------------------------------------------------ boot */
  function start() {
    initTheme();
    bindTabs();
    bindGuide();
    bindLiveSync();
    bindMenus();
    bindShortcuts();

    useBundledStore();
    renderAll();

    const fromHash = window.location.hash.slice(1);
    switchTab(TABS.includes(fromHash) ? fromHash : "screener", { initial: true });

    window.addEventListener("hashchange", () => {
      const tab = window.location.hash.slice(1);
      switchTab(TABS.includes(tab) ? tab : "screener", { source: "hash" });
    });

    hydrateFromApi();

    // "Prices updated 14 seconds ago" must not still be on screen twenty minutes later.
    setInterval(updateFreshness, 60000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) updateFreshness(); });
  }

  /* ----------------------------------------------------------------- theme */
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme, { persist = false } = {}) {
    document.documentElement.setAttribute("data-theme", theme);
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
    }
    updateThemeButton(theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#ffffff" : "#0f1729");
    document.dispatchEvent(new CustomEvent("apex:theme", { detail: { theme } }));
  }

  function updateThemeButton(theme) {
    const btn = $("theme-toggle");
    if (!btn) return;
    const next = theme === "dark" ? "light" : "dark";
    btn.innerHTML = UI.icon(theme === "dark" ? "sun" : "moon");
    btn.setAttribute("aria-label", `Switch to ${next} mode`);
    btn.setAttribute("data-tip", `Switch to ${next} mode`);
  }

  function initTheme() {
    updateThemeButton(currentTheme());
    const btn = $("theme-toggle");
    if (btn) {
      btn.addEventListener("click", () => {
        applyTheme(currentTheme() === "dark" ? "light" : "dark", { persist: true });
      });
    }
    // Follow the OS while the viewer has not made an explicit choice.
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onSystemChange = (e) => {
      let saved = null;
      try { saved = localStorage.getItem(THEME_KEY); } catch (err) { /* ignore */ }
      if (saved !== "light" && saved !== "dark") applyTheme(e.matches ? "light" : "dark");
    };
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
  }

  /* ------------------------------------------------------------------ tabs */
  function bindTabs() {
    const tablist = $("tablist");
    if (!tablist) return;

    tablist.addEventListener("click", (e) => {
      const tab = e.target.closest(".nav-tab");
      if (tab) switchTab(tab.dataset.tab, { source: "tab" });
    });

    tablist.addEventListener("keydown", (e) => {
      const tabs = [...tablist.querySelectorAll(".nav-tab")];
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
        switchTab(next.dataset.tab, { source: "tab" });
      }
    });

    // Fade hints when the tab strip overflows horizontally
    const scroller = $("tab-scroller");
    const update = () => {
      const max = tablist.scrollWidth - tablist.clientWidth;
      scroller.toggleAttribute("data-overflow-start", tablist.scrollLeft > 4);
      scroller.toggleAttribute("data-overflow-end", tablist.scrollLeft < max - 4);
    };
    tablist.addEventListener("scroll", update, { passive: true });
    new ResizeObserver(update).observe(tablist);
    update();
  }

  /**
   * source: "tab"  — user pressed a tab (focus stays on the tab)
   *         "hash" — browser navigation
   *         "code" — another module asked for a jump (focus moves into the panel)
   */
  function switchTab(target, { source = "code", initial = false } = {}) {
    if (!TABS.includes(target)) target = "screener";
    const changed = target !== currentTab;
    currentTab = target;

    document.querySelectorAll(".nav-tab").forEach((t) => {
      const on = t.dataset.tab === target;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${target}`);
    });

    renderStageContext(target);

    if (target === "comparison" && window.ComparisonMatrixModule) {
      window.ComparisonMatrixModule.renderInterface();
    }

    if (!initial && source !== "hash" && window.location.hash.slice(1) !== target) {
      window.location.hash = target;
    }

    if (changed && !initial) {
      // Scroll so the new tab starts at the top, but never past where the bar rests.
      const resting = document.querySelector(".app-bar")?.offsetHeight || 0;
      if (window.scrollY > resting) window.scrollTo({ top: resting, behavior: smooth() });
      if (source === "code") {
        const panel = $(`tab-${target}`);
        if (panel) panel.focus({ preventScroll: true });
      }
    }

    // Keep the active tab visible inside the horizontally scrollable strip
    const activeTab = $(`tab-btn-${target}`);
    const strip = $("tablist");
    if (activeTab && strip) {
      const left = activeTab.offsetLeft - (strip.clientWidth - activeTab.offsetWidth) / 2;
      strip.scrollTo({ left: Math.max(0, left), behavior: initial ? "auto" : smooth() });
    }

    document.dispatchEvent(new CustomEvent("apex:tab", { detail: { tab: target } }));
  }

  /* -------------------------------------------------- roadmap context bar */
  function renderStageContext(tab) {
    const el = $("stage-context");
    if (!el) return;
    const meta = STAGES[tab];
    if (!meta) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    const idx = STAGE_ORDER.indexOf(tab);
    const prev = STAGE_ORDER[idx - 1];
    const next = STAGE_ORDER[idx + 1];
    const esc = UI.esc;

    el.dataset.status = meta.status;
    el.hidden = false;
    el.innerHTML = `
      <div class="stage-context-main">
        <div class="stage-context-head">
          <span class="stage-context-step">Stage ${meta.stage} of ${STAGE_ORDER.length}</span>
          <span class="stage-status-badge ${STATUS_BADGE[meta.status]}">${esc(meta.statusLabel)}</span>
          <h2 class="stage-context-title">${esc(meta.title)}</h2>
        </div>
        <p class="stage-context-desc">${esc(meta.desc)}</p>
      </div>
      <div class="stage-context-nav">
        ${prev ? `<button type="button" class="btn btn-ghost btn-sm" data-goto="${prev}">${UI.icon("arrow-left")} ${esc(STAGES[prev].short)}</button>` : ""}
        <button type="button" class="btn btn-ghost btn-sm" data-open-guide>${UI.icon("compass")} Roadmap</button>
        ${next ? `<button type="button" class="btn btn-secondary btn-sm" data-goto="${next}">Next: ${esc(STAGES[next].short)} ${UI.icon("arrow-right")}</button>` : ""}
      </div>`;
  }

  /* ------------------------------------------------------------ guide modal */
  function openGuide() {
    UI.dialog.open("onboarding-modal", { opener: document.activeElement });
  }

  function bindGuide() {
    document.addEventListener("click", (e) => {
      const goto = e.target.closest("[data-goto]");
      if (goto) {
        switchTab(goto.dataset.goto, { source: "code" });
        return;
      }
      if (e.target.closest("[data-open-guide]") || e.target.closest("#open-onboarding-btn")) openGuide();
    });

    const stepper = $("guide-stepper");
    if (stepper) {
      stepper.innerHTML = STAGE_ORDER.map((tab) => {
        const s = STAGES[tab];
        return `<li><button type="button" class="guide-stepper-btn" data-guide-step="${s.stage}" data-status="${s.status}">
          <span class="guide-stepper-num">${s.stage}</span><span>${UI.esc(s.short)}</span></button></li>`;
      }).join("");
      stepper.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-guide-step]");
        const target = btn && $(`guide-step-${btn.dataset.guideStep}`);
        if (target) target.scrollIntoView({ behavior: smooth(), block: "start" });
      });
    }

    document.querySelectorAll(".jump-stage-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        UI.dialog.close("onboarding-modal");
        if (target) switchTab(target, { source: "code" });
      });
    });
  }

  /* ------------------------------------------------------------- live sync */
  function bindLiveSync() {
    const btn = $("sync-live-data-btn");
    const label = $("sync-btn-text");
    if (!btn) return;

    if (window.location.protocol === "file:") {
      btn.setAttribute("data-tip", "Live Sync needs the local server (run: uv run apex-etf).");
    }

    btn.addEventListener("click", async () => {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.classList.add("is-loading");
      btn.setAttribute("aria-busy", "true");
      label.textContent = "Syncing…";
      const progress = UI.toast("Syncing prices, fund sizes and news — this can take up to a minute.", { type: "info", timeout: 0 });

      const syncedBefore = new Map(etfsData.map((e) => [e.ticker, e.lastSyncedAt]));
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 180000);
      try {
        const res = await fetch("/api/sync", { method: "POST", signal: ctrl.signal });
        let payload = null;
        try { payload = await res.json(); } catch (e) { /* not JSON, e.g. a static server's error page */ }
        // The ApexETF server always answers JSON. Anything else (a static server's 501 page, a proxy
        // error) means there is no sync API behind this origin.
        if (!payload) throw new Error(`HTTP ${res.status}`);
        if (res.status === 409) throw Object.assign(new Error("busy"), { busy: true });
        if (payload.error || !res.ok) {
          const reason = payload.error || `HTTP ${res.status}`;
          throw Object.assign(new Error(reason), { serverMessage: reason });
        }

        await hydrateFromApi({ force: true });
        const outcome = describeSync(payload, syncedBefore);
        lastSyncAttempt = { at: Date.now(), summary: outcome.summary };
        updateFreshness();
        label.textContent = outcome.label;
        UI.toast(outcome.message, { type: outcome.type, timeout: outcome.type === "success" ? 4500 : 12000 });
      } catch (err) {
        label.textContent = err && err.busy ? "Busy" : "Sync failed";
        let message, short, type = "error";
        if (err && err.busy) {
          // Another sync (another tab, the CLI via the same server) already holds the lock: nothing failed.
          message = "A sync is already running. Wait for it to finish, then try again.";
          short = "another sync was already running.";
          type = "warning";
        } else if (err && err.name === "AbortError") {
          message = "Sync timed out. The server may still be working — reload in a minute.";
          short = "timed out.";
        } else if (err && err.serverMessage) {
          message = `Sync failed on the server: ${err.serverMessage}`;
          short = `server error (${err.serverMessage}).`;
        } else {
          message = "Couldn't reach the sync endpoint. Start the local server with “uv run apex-etf” (Live Sync is unavailable when index.html is opened directly).";
          short = "server unreachable.";
        }
        lastSyncAttempt = { at: Date.now(), summary: `${type === "error" ? "failed" : "not run"} — ${short}` };
        updateFreshness();
        UI.toast(message, { type, timeout: 8000 });
      } finally {
        clearTimeout(timer);
        progress.dismiss(); // the result toast replaces it; never show both
        btn.classList.remove("is-loading");
        btn.removeAttribute("aria-busy");
        setTimeout(() => {
          btn.disabled = false;
          label.textContent = "Live Sync";
        }, 1800);
      }
    });
  }

  /**
   * Turn a /api/sync payload into an honest outcome. The server reports what each source delivered;
   * an older server only says how many ETFs it processed, so fall back to which quotes actually changed.
   */
  function describeSync(payload, syncedBefore) {
    const skipped = Array.isArray(payload.quotesSkipped) ? payload.quotesSkipped.length : 0;
    const targets = Math.max(etfsData.length - skipped, 0);
    const refreshed = Number.isFinite(payload.quotesUpdated)
      ? payload.quotesUpdated
      : etfsData.filter((e) => e.lastSyncedAt && e.lastSyncedAt !== syncedBefore.get(e.ticker)).length;
    const headlines = Number.isFinite(payload.liveNewsItemsFetched) ? payload.liveNewsItemsFetched : 0;
    const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];

    const hasAccounting = Number.isFinite(payload.quotesUpdated);
    const nothing = payload.status === "failed" || (refreshed === 0 && headlines === 0);
    const problems = warnings.length > 0 || payload.status === "partial" || (!hasAccounting && refreshed < targets);
    const prices = `${refreshed} of ${targets} prices`;
    const live = `${headlines} live headline${headlines === 1 ? "" : "s"}`;

    if (nothing) {
      return {
        type: "error", label: "Sync failed", summary: `nothing refreshed. ${warnings.join(" ")}`.trim(),
        message: `Sync ran but nothing could be refreshed. ${warnings.join(" ")}`.trim(),
      };
    }
    if (problems) {
      return {
        type: "warning", label: "Partly synced", summary: `${prices} updated, ${live}. ${warnings.join(" ")}`.trim(),
        message: `Sync finished with problems — ${prices} updated, ${live}. ${warnings.join(" ")}`.trim(),
      };
    }
    return {
      type: "success", label: "Synced", summary: `${prices} updated, ${live}.`,
      message: `Live data synced — ${prices} updated, ${live}.`,
    };
  }

  function bindMenus() {
    const menu = $("sources-menu");
    if (!menu) return;
    document.addEventListener("click", (e) => {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
    menu.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.open) {
        menu.open = false;
        menu.querySelector("summary").focus();
      }
    });
  }

  function bindShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      const typing = t instanceof Element && (t.closest("input, textarea, select, [contenteditable]"));
      if (typing || document.documentElement.classList.contains("has-modal")) return;
      e.preventDefault();
      switchTab("screener", { source: "tab" });
      const search = $("screener-search");
      if (search) search.focus();
    });
  }

  /* ------------------------------------------------------------------ data */
  function useBundledStore() {
    const store = window.APEX_DATA_STORE;
    if (!store) return;
    etfsData = store.etfs || [];
    correlationsData = store.correlations || null;
    newsData = store.news || [];
    educationData = store.education || null;
  }

  const signature = () => JSON.stringify([etfsData, correlationsData, newsData, educationData]);

  async function fetchJson(url, signal) {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.json();
  }

  /** Refresh from the REST API; re-render only when the data actually differs. */
  async function hydrateFromApi({ force = false } = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const [etfs, corr, news, edu] = await Promise.all(
        ["/api/etfs", "/api/correlations", "/api/news", "/api/education"].map((u) =>
          fetchJson(u, ctrl.signal).catch(() => null)
        )
      );
      if (!etfs && !corr && !news && !edu) return false; // offline / file:// — keep bundled store

      const before = signature();
      if (etfs) etfsData = etfs;
      if (corr) correlationsData = corr;
      if (news) newsData = news;
      if (edu) educationData = edu;

      if (force || signature() !== before) {
        renderAll();
        return true;
      }
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  /** Initialise every view. A failing view never takes the others down. */
  function renderAll() {
    updateHeaderStats();

    const views = [
      ["ETF Comparison", "comparison", () => window.ComparisonMatrixModule?.init(etfsData)], // before screener: it reads the compare list
      ["ETF Screener", "screener", () => window.ScreenerModule?.init(etfsData)],
      ["Overlap Auditor", "overlap", () => window.OverlapModule?.init(etfsData, correlationsData)],
      ["Curvo Backtest", "curvo", () => window.CurvoModule?.init(etfsData)],
      ["Risk Parity Studio", "parity", () => window.RegimeRiskParityModule?.init(etfsData, correlationsData)],
      ["Quant Risk", "pv", () => window.PortfolioVisualizerModule?.init(etfsData)],
      ["Market News", "news", () => window.NewsSignalsModule?.init(newsData)],
      ["Factsheets & KIDs", "verification", () => window.VerificationDocsModule?.init(etfsData)],
      ["Academy", "academy", () => window.BogleheadsAcademyModule?.init(educationData)],
    ];

    for (const [name, tab, run] of views) {
      try {
        run();
        $(`tab-${tab}`)?.querySelector(":scope > .view-error")?.remove();
      } catch (err) {
        console.error(`[ApexETF] "${name}" failed to render`, err);
        const panel = $(`tab-${tab}`);
        if (panel && !panel.querySelector(":scope > .view-error")) {
          panel.insertAdjacentHTML(
            "afterbegin",
            `<div class="callout callout-danger view-error mb-4" role="alert">${UI.icon("alert")}<div><div class="callout-title">${UI.esc(name)} couldn't load</div>Reload the page. Technical details are in the browser console.</div></div>`
          );
        }
      }
    }
  }

  function updateHeaderStats() {
    const totalAum = etfsData.reduce((sum, e) => sum + (e.aumMillionsEUR || 0), 0);
    const aumEl = $("stat-total-aum");
    const countEl = $("stat-etf-count");
    if (aumEl) aumEl.textContent = UI.fmt.aum(totalAum);
    if (countEl) countEl.textContent = String(etfsData.length);

    const liveCount = newsData.filter((n) => n.isLiveStream && !n.isStale).length;
    const cachedCount = newsData.filter((n) => n.isLiveStream && n.isStale).length;
    const badge = $("news-count-badge");
    if (badge) {
      badge.hidden = liveCount + cachedCount === 0;
      badge.textContent = liveCount > 0 ? `${liveCount} live` : `${cachedCount} cached`;
    }

    updateFreshness();
  }

  /** Honest freshness: derived from the newest quote timestamp in the dataset. */
  function updateFreshness() {
    const chip = $("data-freshness");
    const dot = $("freshness-dot");
    const text = $("freshness-text");
    if (!chip || !dot || !text) return;

    const stamps = (values) => values.filter(Boolean).map((s) => new Date(s).getTime()).filter(Number.isFinite);
    const iso = (ms) => new Date(ms).toISOString();
    // Freshness is judged on the QUOTE time. A sync can run today and still store
    // an older exchange timestamp (market closed), so sync time is shown separately.
    const quotes = stamps(etfsData.map((e) => UI.quoteTime(e)));
    const quoteNewest = quotes.length ? Math.max(...quotes) : null;
    const quoteOldest = quotes.length ? Math.min(...quotes) : null;
    const syncs = stamps(etfsData.map((e) => e.lastSyncedAt));
    const syncAt = syncs.length ? Math.max(...syncs) : null;

    if (quoteOldest === null && syncAt === null) {
      dot.dataset.state = "unknown";
      text.textContent = "Static data snapshot";
      chip.setAttribute("data-tip", "No timestamps in the dataset. Use Live Sync (needs the local server) to fetch fresh prices.");
      return;
    }

    // Judge the table by its weakest link: after a partial sync the newest quote alone would
    // make prices that are days old look fresh.
    const basis = quoteOldest ?? syncAt;
    const ageHours = (Date.now() - basis) / 36e5;
    const state = ageHours <= 36 ? "fresh" : ageHours <= 24 * 5 ? "aging" : "stale";
    dot.dataset.state = state;
    text.textContent = `${quoteOldest === null ? "Synced" : state === "fresh" ? "Prices updated" : "Prices from"} ${UI.fmt.relative(iso(basis))}`;

    const parts = [];
    if (quoteOldest !== null) {
      parts.push(quoteNewest - quoteOldest > 6 * 36e5
        ? `Quotes range from ${UI.fmt.dateTimeUtc(iso(quoteOldest))} to ${UI.fmt.dateTimeUtc(iso(quoteNewest))}.`
        : `Quotes fetched ${UI.fmt.dateTimeUtc(iso(quoteNewest))}.`);
    }
    if (syncAt !== null) parts.push(`Last successful sync: ${UI.fmt.dateTimeUtc(iso(syncAt))}.`);
    if (lastSyncAttempt) parts.push(`Last Live Sync attempt (${UI.fmt.dateTimeUtc(iso(lastSyncAttempt.at))}): ${lastSyncAttempt.summary}`);
    if (state !== "fresh") parts.push("Run Live Sync (needs the local server) to refresh.");
    chip.setAttribute("data-tip", parts.join(" "));
  }

  return {
    start,
    switchTab,
    currentTab: () => currentTab,
    getEtfs: () => [...etfsData],
    getNews: () => [...newsData],
    getEtfByTicker: (ticker) =>
      etfsData.find((e) => e.ticker.toUpperCase() === (ticker || "").toUpperCase()),
  };
})();

// Global DataStore access helper for standalone and modular access
window.DataStore = {
  getEtfs: () => window.App?.getEtfs() || window.APEX_DATA_STORE?.etfs || [],
  getNews: () => window.App?.getNews() || window.APEX_DATA_STORE?.news || [],
  getEtfByTicker: (ticker) =>
    (window.App?.getEtfs() || window.APEX_DATA_STORE?.etfs || []).find(
      (e) => e.ticker.toUpperCase() === (ticker || "").toUpperCase()
    ),
};

document.addEventListener("DOMContentLoaded", () => {
  window.App.start();
});
