/**
 * Ticker cards
 * Hover, focus or tap a ticker anywhere in the dashboard to see what it is: full name, type, costs,
 * price, and its measured performance (returns, volatility, deepest fall, one-year price line).
 *
 *  - Triggers: any element with [data-ticker-card="VWCE"], plus every `.ticker`, `.etf-tag[data-ticker]`
 *    and `.block-ticker-badge[data-ticker]` whose ticker is known (enhanced automatically, like `.info-tip`).
 *  - Mouse: opens after a short delay and stays open while the pointer is on the trigger or the card.
 *  - Keyboard: opens on focus; Enter on a ticker opens the full details; Esc closes.
 *  - Touch: tapping a ticker that is not itself a button toggles the card; buttons keep their action.
 *  - Data: the ETF dataset (via App), the planner dataset and performance.json — bundled, then refreshed
 *    once from /api/performance. Performance is measured from prices, never typed in; a missing period
 *    (shorter history) shows as "—".
 */

window.TickerCard = (function () {
  "use strict";
  const { esc, fmt, icon } = UI;

  let performance = window.APEX_DATA_STORE?.performance || null;
  let hydrating = null;
  let card = null;
  let owner = null;
  let showTimer = 0;
  let hideTimer = 0;
  let lastPointer = "mouse";

  const SELECTOR = "[data-ticker-card]";
  const AUTO = ".ticker, .etf-tag[data-ticker], .block-ticker-badge[data-ticker]";
  const KIND_LABEL = { cash: "Cash", "money-market": "Money market fund", bond: "Bond fund", gold: "Gold ETC", crypto: "Crypto", equity: "Equity fund" };
  const DOMICILE = { Ireland: "IE", Luxembourg: "LU", Germany: "DE", Jersey: "JE", France: "FR", "United States": "US" };

  /* ----------------------------------------------------------------- data */
  function plannerInstruments() {
    return window.APEX_DATA_STORE?.planner?.instruments || [];
  }

  function lookup(id) {
    const key = String(id || "").trim().toUpperCase();
    if (!key) return null;
    const etf = window.App?.getEtfByTicker(key) || (window.APEX_DATA_STORE?.etfs || []).find((e) => String(e.ticker).toUpperCase() === key);
    const inst = plannerInstruments().find((i) => i.id === key);
    if (!etf && !inst) return null;
    return { id: key, etf, inst, perf: performance?.instruments?.[key] || null };
  }

  function perf(id) {
    return performance?.instruments?.[String(id || "").toUpperCase()] || null;
  }

  async function hydrate() {
    if (hydrating) return hydrating;
    hydrating = fetch("/api/performance")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.instruments && JSON.stringify(data) !== JSON.stringify(performance)) {
          performance = data;
          document.dispatchEvent(new CustomEvent("apex:performance"));
          if (owner) render(owner);
        }
      })
      .catch(() => { /* offline: keep the bundled copy */ });
    return hydrating;
  }

  /* --------------------------------------------------------------- markup */
  const pct = (v, digits = 1) => (v == null ? "—" : fmt.pct(v, digits, { sign: true }));
  const tone = (v) => (v == null ? "" : v < 0 ? "val-negative" : v > 0 ? "val-positive" : "");
  const monthYear = (iso) => {
    const d = new Date(`${iso}T00:00:00Z`);
    return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat(fmt.locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(d);
  };
  const longDate = (iso) => {
    const d = new Date(`${iso}T00:00:00Z`);
    return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat(fmt.locale, { dateStyle: "medium", timeZone: "UTC" }).format(d);
  };

  function sparkline(values, up) {
    if (!values || values.length < 2) return "";
    const w = 268, h = 46, pad = 3;
    const lo = Math.min(...values), hi = Math.max(...values);
    const span = hi - lo || 1;
    const pts = values.map((v, i) => [pad + (i / (values.length - 1)) * (w - 2 * pad), pad + (1 - (v - lo) / span) * (h - 2 * pad)]);
    const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
    const area = `${line}L${pts[pts.length - 1][0].toFixed(1)} ${h}L${pts[0][0].toFixed(1)} ${h}Z`;
    const color = up ? "var(--accent-emerald)" : "var(--accent-rose)";
    return `<svg class="tc-spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true" focusable="false">
      <path d="${area}" fill="${color}" opacity="0.12"></path><path d="${line}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"></path></svg>`;
  }

  function cardHtml(info) {
    const { id, etf, inst, perf: p } = info;
    const name = etf?.name || inst?.name || id;
    const live = etf?.liveMarketData;
    const acc = etf ? etf.isAccumulating : inst?.accumulating;
    const domicile = etf?.domicile || inst?.domicile;
    const ter = etf?.ter ?? inst?.ter;
    const aum = etf?.aumMillionsEUR ?? inst?.aumMillionsEUR;
    const kind = etf?.assetClass || KIND_LABEL[inst?.kind] || "";
    const logo = etf ? (window.ProviderLogos?.getLogoSvg(etf.issuer, 20, { label: false }) || "") : "";

    const facts = [
      kind,
      ter != null ? `TER ${fmt.pct(ter, 2)}` : inst?.costNote ? "spread + €1/order" : "",
      aum ? fmt.aum(aum) : "",
    ].filter(Boolean).map(esc).join(" · ");
    const launched = etf?.inceptionDate || inst?.inception;
    const about = [inst?.exposure, launched ? `launched ${longDate(launched)}` : ""].filter(Boolean).join("; ");

    const badges = [
      acc === true ? `<span class="badge badge-acc badge-sm">Acc</span>` : acc === false ? `<span class="badge badge-dist badge-sm">Dist</span>` : "",
      domicile ? `<span class="badge badge-neutral badge-sm" title="${esc(domicile)}">${esc(DOMICILE[domicile] || domicile)}</span>` : "",
    ].join("");

    let priceLine = "";
    if (live && Number.isFinite(Number(live.livePrice))) {
      const chg = Number(live.dayChangePercent) || 0;
      const lo = live.fiftyTwoWeekLow, hi = live.fiftyTwoWeekHigh;
      priceLine = `<div class="tc-price"><strong>${esc(fmt.eur(live.livePrice, 2))}</strong>
        <span class="${tone(chg)}">${esc(pct(chg, 2))} today</span>
        ${lo && hi ? `<span class="text-muted">· 52 weeks ${esc(fmt.num(lo, 2))}–${esc(fmt.num(hi, 2))}</span>` : ""}</div>`;
    } else if (p) {
      priceLine = `<div class="tc-price"><strong>${esc(fmt.eur(p.lastPrice, 2))}</strong> <span class="text-muted">close ${esc(longDate(p.lastDate))}</span></div>`;
    }

    let perfHtml = `<p class="text-muted text-xs">No price history yet. Run Live Sync to fetch it.</p>`;
    if (inst?.kind === "cash") perfHtml = `<p class="text-muted text-xs">Pays ${esc(fmt.pct(inst.interestRate, 2))} a year; its balance does not move with markets.</p>`;
    if (p) {
      const r = p.returns || {};
      const cells = [["1M", r["1m"]], ["YTD", r.ytd], ["1Y", r["1y"]], ["3Y p.a.", r["3y"]], ["5Y p.a.", r["5y"]]];
      const since = p.sinceFirstPrice && r["3y"] == null
        ? `<div class="tc-row"><span>Since ${esc(longDate(p.sinceFirstPrice.from))}</span><strong class="${tone(p.sinceFirstPrice.total)}">${esc(pct(p.sinceFirstPrice.total))}</strong>${p.sinceFirstPrice.annualised != null ? `<span class="text-muted">(${esc(pct(p.sinceFirstPrice.annualised))} a year)</span>` : ""}</div>` : "";
      const mdd = p.maxDrawdown || {};
      perfHtml = `
        ${sparkline(p.spark?.values, (r["1y"] ?? 0) >= 0)}
        <dl class="tc-returns">${cells.map(([k, v]) => `<div><dt>${k}</dt><dd class="${tone(v)}">${esc(pct(v))}</dd></div>`).join("")}</dl>
        ${since}
        <div class="tc-row"><span>Volatility</span><strong>${p.volatility != null ? esc(fmt.pct(p.volatility, 1)) : "—"}</strong>
          <span>Deepest fall</span><strong class="val-negative">${mdd.value != null ? esc(fmt.pct(mdd.value, 1)) : "—"}</strong>
          ${mdd.peak ? `<span class="text-muted">${esc(monthYear(mdd.peak))}–${esc(monthYear(mdd.trough))}</span>` : ""}</div>`;
    }

    const isinLink = (etf?.isin || inst?.isin) ? UI.link(`https://www.justetf.com/en/etf-profile.html?isin=${encodeURIComponent(etf?.isin || inst?.isin)}`, "justETF ↗", { cls: "btn btn-ghost btn-sm" }) : "";
    const details = etf
      ? `<button type="button" class="btn btn-secondary btn-sm" data-tc-details="${esc(id)}">${icon("eye")} Details</button>`
      : inst ? `<button type="button" class="btn btn-secondary btn-sm" data-tc-planner="${esc(id)}">${icon("target")} Planner</button>` : "";

    return `
      <div class="tc-head">
        <div class="cluster">${logo}<strong class="tc-ticker">${esc(id)}</strong>${badges}${p?.isStale ? `<span class="badge badge-amber badge-sm" title="The last price download failed; these figures are from an earlier one.">Cached</span>` : ""}</div>
        <div class="tc-name">${esc(name)}</div>
        ${facts ? `<div class="tc-facts">${facts}</div>` : ""}
        ${about ? `<div class="tc-facts">${esc(about.charAt(0).toUpperCase() + about.slice(1))}</div>` : ""}
      </div>
      ${priceLine}
      ${perfHtml}
      <div class="tc-foot">
        <div class="cluster">${details}${isinLink}</div>
        ${p ? `<span class="text-muted text-xs">Prices to ${esc(longDate(p.lastDate))}</span>` : ""}
      </div>`;
  }

  /* ------------------------------------------------------------- behaviour */
  function ensureCard() {
    if (card) return card;
    card = document.createElement("div");
    card.id = "ticker-card";
    card.className = "ticker-card";
    card.setAttribute("role", "dialog");
    card.hidden = true;
    document.body.appendChild(card);
    card.addEventListener("pointerenter", () => clearTimeout(hideTimer));
    card.addEventListener("pointerleave", () => scheduleHide());
    card.addEventListener("click", (e) => {
      const d = e.target.closest("[data-tc-details]");
      const pl = e.target.closest("[data-tc-planner]");
      if (d) {
        const opener = owner;
        hide();
        window.ScreenerModule?.showDetails(d.dataset.tcDetails, opener);
      } else if (pl) {
        hide();
        window.App?.switchTab("planner");
      }
    });
    return card;
  }

  function place(target) {
    const r = target.getBoundingClientRect();
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const gap = 8;
    const pad = 8;
    let top = r.bottom + gap;
    if (top + ch > window.innerHeight - pad && r.top - gap - ch > pad) top = r.top - gap - ch;
    top = Math.max(pad, Math.min(top, window.innerHeight - ch - pad));
    const left = Math.max(pad, Math.min(r.left, window.innerWidth - cw - pad));
    card.style.left = `${Math.round(left)}px`;
    card.style.top = `${Math.round(top)}px`;
  }

  function render(target) {
    const info = lookup(target.getAttribute("data-ticker-card"));
    if (!info) return false;
    ensureCard();
    card.innerHTML = cardHtml(info);
    card.setAttribute("aria-label", `${info.id}: fund card`);
    return true;
  }

  function show(target) {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (owner && owner !== target) owner.removeAttribute("aria-describedby");
    if (!render(target)) return;
    owner = target;
    card.hidden = false;
    place(target);
    card.classList.add("visible");
    target.setAttribute("aria-describedby", "ticker-card");
    if (!hydrating) hydrate();
  }

  function hide() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (!card || card.hidden) return;
    card.classList.remove("visible");
    card.hidden = true;
    owner?.removeAttribute("aria-describedby");
    owner = null;
  }

  function scheduleHide(ms = 220) {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, ms);
  }

  const triggerOf = (el) => (el instanceof Element ? el.closest(SELECTOR) : null);

  function bind() {
    document.addEventListener("pointerdown", (e) => {
      lastPointer = e.pointerType || "mouse";
      if (card && !card.hidden && !card.contains(e.target) && !triggerOf(e.target)) hide();
    }, true);

    document.addEventListener("pointerover", (e) => {
      if (e.pointerType === "touch") return;
      const t = triggerOf(e.target);
      if (!t) return;
      clearTimeout(hideTimer);
      if (t === owner) return;
      clearTimeout(showTimer);
      showTimer = setTimeout(() => show(t), owner ? 80 : 320);
    }, true);

    document.addEventListener("pointerout", (e) => {
      const t = triggerOf(e.target);
      if (!t) return;
      const to = e.relatedTarget;
      if (to instanceof Node && (t.contains(to) || card?.contains(to))) return;
      clearTimeout(showTimer);
      if (t === owner) scheduleHide();
    }, true);

    document.addEventListener("focusin", (e) => {
      const t = triggerOf(e.target);
      if (t && lastPointer !== "touch") show(t);
    });
    document.addEventListener("focusout", (e) => {
      const to = e.relatedTarget;
      if (to instanceof Node && card?.contains(to)) return;
      if (triggerOf(e.target) === owner) scheduleHide(120);
    });

    // Touch: a tap on a ticker that is not itself a button toggles its card.
    document.addEventListener("click", (e) => {
      const t = triggerOf(e.target);
      if (!t || lastPointer !== "touch" || t.closest("button, a")) return;
      if (owner === t) hide(); else show(t);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && owner) {
        const back = owner;
        hide();
        if (document.activeElement !== back && back.focus) back.focus({ preventScroll: true });
        return;
      }
      if (e.key === "Enter") {
        const t = triggerOf(e.target);
        if (!t || t.matches("button, a")) return;
        const info = lookup(t.getAttribute("data-ticker-card"));
        if (info?.etf) {
          e.preventDefault();
          hide();
          window.ScreenerModule?.showDetails(info.id, t);
        }
      }
    });

    window.addEventListener("scroll", (e) => {
      if (card && !card.hidden && !(e.target instanceof Node && card.contains(e.target))) hide();
    }, true);
    window.addEventListener("resize", hide);
    document.addEventListener("apex:tab", hide);
  }

  /* --------------------------------------------------------- enhancement */
  function enhance(root) {
    if (!root.querySelectorAll) return;
    const nodes = root.matches?.(`${AUTO}, ${SELECTOR}`) ? [root] : [];
    nodes.push(...root.querySelectorAll(`${AUTO}, ${SELECTOR}`));
    for (const el of nodes) {
      if (el.dataset.tcEnhanced || el.closest(".modal-overlay, .ticker-card")) continue;
      const id = (el.getAttribute("data-ticker-card") || el.dataset.ticker || el.textContent || "").trim().toUpperCase();
      if (!lookup(id)) continue;
      el.dataset.tcEnhanced = "1";
      el.setAttribute("data-ticker-card", id);
      el.classList.add("has-ticker-card");
      if (!el.matches("button, a, input, select, textarea, [tabindex]")) {
        el.tabIndex = 0;
        el.setAttribute("role", "button");
        if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", `${id}: show fund card`);
      }
    }
  }

  function init() {
    bind();
    enhance(document.body);
    new MutationObserver((records) => {
      for (const rec of records) rec.addedNodes.forEach((n) => { if (n.nodeType === 1) enhance(n); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();

  /** Attributes that turn any element into a ticker-card trigger, e.g. `<span ${TickerCard.attrs("AII")}>`. */
  function attrs(id) {
    return `data-ticker-card="${esc(String(id || "").toUpperCase())}"`;
  }

  return { attrs, perf, hydrate, hide };
})();
