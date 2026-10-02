/**
 * UI Toolkit
 * Shared, dependency-free helpers used by every view. Loaded before all other
 * scripts and exposed as window.UI (classic script, so file:// keeps working).
 *
 *   Safety      esc(), safeUrl(), link()          — ALWAYS use for external text
 *   Formatting  fmt.*                              — viewer-locale numbers/dates
 *   Icons       icon()                             — inline SVG sprite in index.html
 *   Dialogs     dialog.open/close                  — focus trap, inert page, Esc
 *   Tooltips    [data-tip] on any element          — hover, keyboard, touch
 *   Toasts      toast()                            — aria-live feedback
 *   Colour      color.*                            — OKLab ramps, readable text
 *   Charts      chart.*                            — scales, tooltip, table twin
 */

window.UI = (function () {
  "use strict";

  const LOCALE =
    (navigator.languages && navigator.languages[0]) || navigator.language || "en-IE";

  /* ------------------------------------------------------------------------
   * Safety
   * --------------------------------------------------------------------- */
  const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  /** Escape text for safe interpolation into HTML text or attribute values. */
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ESC_MAP[c]);
  }

  /** Allow only http(s)/mailto URLs; anything else (javascript:, data:) becomes "#". */
  function safeUrl(url) {
    try {
      const u = new URL(String(url ?? ""), window.location.href);
      return u.protocol === "http:" || u.protocol === "https:" || u.protocol === "mailto:"
        ? u.href
        : "#";
    } catch (e) {
      return "#";
    }
  }

  /** Safe external link. `label` is escaped; pass {html:true} only for trusted markup. */
  function link(url, label, { cls = "", html = false, external = true } = {}) {
    const text = html ? label : esc(label);
    const ext = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${esc(safeUrl(url))}"${ext}${cls ? ` class="${esc(cls)}"` : ""}>${text}</a>`;
  }

  /* ------------------------------------------------------------------------
   * Formatting (viewer locale; one formatter instance per option set)
   * --------------------------------------------------------------------- */
  const fmtCache = new Map();
  function numberFormat(key, options) {
    let f = fmtCache.get(key);
    if (!f) {
      f = new Intl.NumberFormat(LOCALE, options);
      fmtCache.set(key, f);
    }
    return f;
  }

  const isNum = (n) => n !== null && n !== undefined && n !== "" && Number.isFinite(Number(n));

  const fmt = {
    locale: LOCALE,

    num(n, digits = 0) {
      if (!isNum(n)) return "—";
      return numberFormat(`n${digits}`, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(Number(n));
    },

    /** Value is already a percentage (0.10 → "0.10%"). */
    pct(n, digits = 2, { sign = false } = {}) {
      if (!isNum(n)) return "—";
      const f = numberFormat(`p${digits}${sign}`, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        signDisplay: sign ? "exceptZero" : "auto",
      });
      return `${f.format(Number(n))}%`;
    },

    eur(n, digits = 0) {
      if (!isNum(n)) return "—";
      return numberFormat(`e${digits}`, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(Number(n));
    },

    /** Fund size given in millions of EUR → "€22.9B" / "€900M". */
    aum(millions) {
      if (!isNum(millions)) return "—";
      return numberFormat("aum", {
        style: "currency",
        currency: "EUR",
        notation: "compact",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(Number(millions) * 1e6);
    },

    /** Axis tick for EUR amounts. */
    eurCompact(n) {
      return numberFormat("ec", {
        style: "currency",
        currency: "EUR",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(Number(n));
    },

    dateTimeUtc(iso) {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      const f = new Intl.DateTimeFormat(LOCALE, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      });
      return `${f.format(d)} UTC`;
    },

    relative(iso, now = Date.now()) {
      const d = new Date(iso).getTime();
      if (Number.isNaN(d)) return "";
      const diffSec = Math.round((d - now) / 1000);
      const abs = Math.abs(diffSec);
      const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });
      if (abs < 60) return rtf.format(diffSec, "second");
      if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
      if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
      return rtf.format(Math.round(diffSec / 86400), "day");
    },
  };

  /* ------------------------------------------------------------------------
   * Icons (sprite lives in index.html as <symbol id="i-NAME">)
   * --------------------------------------------------------------------- */
  function icon(name, cls = "") {
    return `<svg class="icon${cls ? " " + cls : ""}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
  }

  /* ------------------------------------------------------------------------
   * Small utilities
   * --------------------------------------------------------------------- */
  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function debounce(fn, ms = 150) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  async function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      /* fall through to legacy path */
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  }

  /**
   * Lazy work: run `fn` now if the tab is showing, else the first time it is
   * activated. One pending slot per (tab, key) so repeated init() calls never
   * queue duplicates.
   */
  const pendingTabWork = new Map();
  function whenTabActive(tabId, fn, key = "default") {
    const panel = document.getElementById(`tab-${tabId}`);
    const slot = `${tabId}:${key}`;
    if (panel && panel.classList.contains("active")) {
      pendingTabWork.delete(slot);
      fn();
      return;
    }
    pendingTabWork.set(slot, fn);
  }
  document.addEventListener("apex:tab", (e) => {
    const tab = e.detail && e.detail.tab;
    for (const [slot, fn] of [...pendingTabWork]) {
      if (slot.startsWith(`${tab}:`)) {
        pendingTabWork.delete(slot);
        fn();
      }
    }
  });

  /* ------------------------------------------------------------------------
   * Toasts
   * --------------------------------------------------------------------- */
  const TOAST_ICON = { info: "info", success: "check", warning: "alert", error: "alert" };

  function toast(message, { type = "info", timeout = 3600 } = {}) {
    let region = document.getElementById("toast-region");
    if (!region) {
      region = document.createElement("div");
      region.id = "toast-region";
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }

    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.innerHTML =
      icon(TOAST_ICON[type] || "info") +
      '<div class="toast-body"></div>' +
      `<button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Dismiss notification">${icon("x")}</button>`;
    el.querySelector(".toast-body").textContent = message;
    region.appendChild(el);
    while (region.children.length > 4) region.firstElementChild.remove();

    let timer = null;
    const dismiss = () => {
      clearTimeout(timer);
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 220);
    };
    el.querySelector("button").addEventListener("click", dismiss);
    if (timeout > 0) timer = setTimeout(dismiss, timeout);
    return { dismiss };
  }

  /* ------------------------------------------------------------------------
   * Dialogs
   * --------------------------------------------------------------------- */
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  const dialogStack = [];

  function focusablesIn(root) {
    return [...root.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.hasAttribute("hidden") && el.getClientRects().length > 0
    );
  }

  function setBackgroundInert(on) {
    for (const el of document.body.children) {
      if (
        el.classList.contains("modal-overlay") ||
        el.id === "toast-region" ||
        el.id === "ui-tooltip" ||
        el.tagName === "SCRIPT"
      ) {
        continue;
      }
      if (on) {
        if (!el.hasAttribute("inert")) {
          el.setAttribute("inert", "");
          el.dataset.uiInert = "1";
        }
      } else if (el.dataset.uiInert) {
        el.removeAttribute("inert");
        delete el.dataset.uiInert;
      }
    }
  }

  const dialog = {
    open(id, { opener } = {}) {
      const overlay = document.getElementById(id);
      if (!overlay || overlay.classList.contains("active")) return;
      const content = overlay.querySelector('[role="dialog"]') || overlay.firstElementChild;
      if (content && !content.hasAttribute("tabindex")) content.setAttribute("tabindex", "-1");

      dialogStack.push({ overlay, content, opener: opener || document.activeElement });
      overlay.classList.add("active");
      document.documentElement.classList.add("has-modal");
      setBackgroundInert(true);
      // The overlay is displayed now, so focus can move synchronously (no rAF —
      // it is throttled in background tabs and would leave focus on <body>).
      const target = overlay.querySelector("[data-autofocus]") || content;
      if (target) target.focus({ preventScroll: true });
      overlay.dispatchEvent(new CustomEvent("dialog:open", { bubbles: true }));
    },

    close(id) {
      const idx = dialogStack.findIndex((d) => d.overlay.id === id);
      if (idx === -1) return;
      const [entry] = dialogStack.splice(idx, 1);
      entry.overlay.classList.remove("active");
      if (!dialogStack.length) {
        document.documentElement.classList.remove("has-modal");
        setBackgroundInert(false);
      }
      const opener = entry.opener;
      const fallback = document.getElementById("main");
      const target = opener && document.contains(opener) && opener.focus ? opener : fallback;
      if (target) target.focus({ preventScroll: true });
      entry.overlay.dispatchEvent(new CustomEvent("dialog:close", { bubbles: true }));
    },

    closeAll() {
      [...dialogStack].reverse().forEach((d) => dialog.close(d.overlay.id));
    },

    isOpen: (id) => dialogStack.some((d) => d.overlay.id === id),
  };

  function initDialogs() {
    document.addEventListener("keydown", (e) => {
      const top = dialogStack[dialogStack.length - 1];
      if (!top) return;
      if (e.key === "Escape") {
        e.preventDefault();
        dialog.close(top.overlay.id);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusablesIn(top.content);
      if (!items.length) {
        e.preventDefault();
        top.content.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === top.content)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Close on backdrop click — only when the press AND release hit the backdrop,
    // so selecting text inside the dialog and releasing outside never dismisses it.
    let downTarget = null;
    document.addEventListener("pointerdown", (e) => { downTarget = e.target; }, true);
    document.addEventListener("click", (e) => {
      const closer = e.target instanceof Element ? e.target.closest("[data-dialog-close]") : null;
      if (closer) {
        const overlay = closer.closest(".modal-overlay");
        if (overlay) dialog.close(overlay.id);
        return;
      }
      const t = e.target;
      if (t instanceof Element && t.classList.contains("modal-overlay") && t === downTarget) {
        dialog.close(t.id);
      }
    });
  }

  /* ------------------------------------------------------------------------
   * Tooltips — any element with data-tip; one shared, viewport-clamped node.
   * ".info-tip" triggers are made keyboard-focusable automatically.
   * --------------------------------------------------------------------- */
  function initTooltips() {
    const tip = document.createElement("div");
    tip.id = "ui-tooltip";
    tip.className = "ui-tooltip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);

    let owner = null;

    function place(target) {
      const r = target.getBoundingClientRect();
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      const gap = 8;
      const pad = 8;
      let top = r.top - th - gap;
      if (top < pad) top = r.bottom + gap;
      let left = r.left + r.width / 2 - tw / 2;
      left = Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
      tip.style.left = `${Math.round(left)}px`;
      tip.style.top = `${Math.round(top)}px`;
    }

    function show(target) {
      const text = target.getAttribute("data-tip");
      if (!text) return;
      if (owner && owner !== target) owner.removeAttribute("aria-describedby");
      owner = target;
      tip.textContent = text;
      place(target);
      tip.classList.add("visible");
      target.setAttribute("aria-describedby", "ui-tooltip");
    }

    function hide() {
      if (!owner) return;
      owner.removeAttribute("aria-describedby");
      owner = null;
      tip.classList.remove("visible");
    }

    const tipTarget = (e) =>
      e.target instanceof Element ? e.target.closest("[data-tip]") : null;

    document.addEventListener("pointerover", (e) => {
      if (e.pointerType === "touch") return;
      const t = tipTarget(e);
      if (t && t !== owner) show(t);
    }, true);

    document.addEventListener("pointerout", (e) => {
      if (!owner) return;
      const to = e.relatedTarget;
      if (to instanceof Node && owner.contains(to)) return;
      if (tipTarget(e) === owner) hide();
    }, true);

    document.addEventListener("focusin", (e) => {
      const t = tipTarget(e);
      if (t) show(t);
    });
    document.addEventListener("focusout", hide);

    // Touch: tap toggles; tapping anywhere else dismisses.
    document.addEventListener("pointerdown", (e) => {
      const t = tipTarget(e);
      if (e.pointerType === "touch" && t) {
        if (owner === t) hide(); else show(t);
      } else if (owner && !t) {
        hide();
      }
    }, true);

    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);

    // Make every ".info-tip" a real, focusable control with an accessible name.
    function enhance(root) {
      const nodes = root.matches && root.matches(".info-tip") ? [root] : [];
      if (root.querySelectorAll) nodes.push(...root.querySelectorAll(".info-tip"));
      for (const el of nodes) {
        if (el.dataset.enhanced) continue;
        el.dataset.enhanced = "1";
        el.tabIndex = 0;
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", `More information: ${el.getAttribute("data-tip") || ""}`);
      }
    }
    enhance(document.body);
    new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((n) => { if (n.nodeType === 1) enhance(n); });
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ------------------------------------------------------------------------
   * Colour — OKLab interpolation and readable text
   * --------------------------------------------------------------------- */
  const color = {
    /** Read a CSS custom property from :root (resolved, trimmed). */
    cssVar(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },

    parse(input) {
      const s = String(input).trim();
      let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (m) {
        let h = m[1];
        if (h.length === 3) h = h.split("").map((c) => c + c).join("");
        return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
      }
      m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
      if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
      return [128, 128, 128];
    },

    toOklab([r, g, b]) {
      const lin = (c) => {
        c /= 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      const R = lin(r), G = lin(g), B = lin(b);
      const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
      const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
      const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
      return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
      ];
    },

    fromOklab([L, a, b]) {
      const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
      const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
      const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
      const lin = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
      ];
      return lin.map((c) => {
        const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
        return Math.round(Math.max(0, Math.min(1, v)) * 255);
      });
    },

    /** Piecewise OKLab ramp through `stops` (hex strings). Returns t∈[0,1] → [r,g,b]. */
    ramp(stops) {
      const labs = stops.map((s) => color.toOklab(color.parse(s)));
      return (t) => {
        const x = Math.max(0, Math.min(1, t)) * (labs.length - 1);
        const i = Math.min(labs.length - 2, Math.floor(x));
        const f = x - i;
        const a = labs[i];
        const b = labs[i + 1];
        return color.fromOklab([
          a[0] + (b[0] - a[0]) * f,
          a[1] + (b[1] - a[1]) * f,
          a[2] + (b[2] - a[2]) * f,
        ]);
      };
    },

    luminance([r, g, b]) {
      const lin = (c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    },

    contrast(a, b) {
      const la = color.luminance(a);
      const lb = color.luminance(b);
      return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    },

    /** Pick white or near-black text, whichever reads better on `rgb`. */
    readableText(rgb) {
      const white = [255, 255, 255];
      const ink = [11, 18, 34];
      return color.contrast(rgb, white) >= color.contrast(rgb, ink) ? "#ffffff" : "#0b1222";
    },

    css: ([r, g, b]) => `rgb(${r}, ${g}, ${b})`,
  };

  /* ------------------------------------------------------------------------
   * Charts — scales, responsive mounting, shared tooltip, table twin
   * --------------------------------------------------------------------- */
  function niceNum(range, round) {
    const exp = Math.floor(Math.log10(range));
    const f = range / Math.pow(10, exp);
    let nf;
    if (round) nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    else nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return nf * Math.pow(10, exp);
  }

  /** Clean axis ticks: { min, max, step, ticks }. */
  function niceScale(min, max, maxTicks = 5) {
    if (!(max > min)) max = min + 1;
    const range = niceNum(max - min, false);
    const step = niceNum(range / (maxTicks - 1), true);
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Number(v.toFixed(10)));
    return { min: lo, max: hi, step, ticks };
  }

  /**
   * Call render(width) whenever `el` has a usable width and it changes.
   * Handles charts first drawn inside a hidden tab (width 0) and window resizes.
   * Returns { redraw, destroy }.
   */
  const mounts = new WeakMap();
  function mountResponsive(el, render) {
    if (!el) return { redraw() {}, destroy() {} };
    const prev = mounts.get(el);
    if (prev) prev.destroy();

    let lastW = -1;
    let raf = 0;
    const run = () => {
      raf = 0;
      if (!el.isConnected) {
        handle.destroy();
        return;
      }
      const w = Math.round(el.clientWidth);
      if (w <= 0 || w === lastW) return;
      lastW = w;
      render(w);
    };
    const ro = new ResizeObserver(() => {
      if (!raf) raf = requestAnimationFrame(run);
    });
    const handle = {
      redraw() { lastW = -1; run(); },
      destroy() {
        ro.disconnect();
        if (raf) cancelAnimationFrame(raf);
        mounts.delete(el);
      },
    };
    mounts.set(el, handle);
    ro.observe(el);
    run();
    return handle;
  }

  /**
   * Single tooltip for a chart host (position: relative). Values lead, labels
   * follow; every string goes through textContent.
   */
  function createChartTooltip(host) {
    const el = document.createElement("div");
    el.className = "chart-tooltip";
    el.setAttribute("aria-hidden", "true");
    host.appendChild(el);

    return {
      el,
      show({ x, y, title, rows }) {
        el.textContent = "";
        if (title) {
          const t = document.createElement("div");
          t.className = "tt-title";
          t.textContent = title;
          el.appendChild(t);
        }
        for (const row of rows || []) {
          const r = document.createElement("div");
          r.className = "tt-row";
          const key = document.createElement("span");
          key.className = `tt-key${row.dot ? " is-dot" : ""}`;
          key.style.setProperty("--c", row.color || "var(--series-1)");
          const val = document.createElement("strong");
          val.className = "tt-val";
          val.textContent = row.value;
          const label = document.createElement("span");
          label.className = "tt-label";
          label.textContent = row.label;
          r.append(key, val, label);
          el.appendChild(r);
        }
        el.classList.add("visible");
        const hw = host.clientWidth;
        const tw = el.offsetWidth;
        const th = el.offsetHeight;
        let left = x + 14;
        if (left + tw > hw - 4) left = x - tw - 14;
        left = Math.max(4, left);
        let top = y - th / 2;
        top = Math.max(4, Math.min(top, host.clientHeight - th - 4));
        el.style.left = `${Math.round(left)}px`;
        el.style.top = `${Math.round(top)}px`;
      },
      hide() { el.classList.remove("visible"); },
    };
  }

  /** Accessible table twin of a chart. Built with textContent only. */
  function dataTable({ caption, columns, rows }) {
    const table = document.createElement("table");
    table.className = "data-table";
    if (caption) {
      const cap = document.createElement("caption");
      cap.className = "sr-only";
      cap.textContent = caption;
      table.appendChild(cap);
    }
    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    for (const col of columns) {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = col.label;
      if (col.align === "right") th.className = "num";
      hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const row of rows) {
      const tr = document.createElement("tr");
      columns.forEach((col, i) => {
        const td = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) td.scope = "row";
        td.textContent = col.format ? col.format(row[col.key], row) : row[col.key];
        if (col.align === "right") td.className = "num";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
  }

  /** Wire the Chart | Table toggle inside any [data-chart-frame]. */
  function wireChartFrame(root) {
    const frame = root.matches && root.matches("[data-chart-frame]") ? root : root.querySelector("[data-chart-frame]");
    if (!frame || frame.dataset.wired) return;
    frame.dataset.wired = "1";
    const buttons = frame.querySelectorAll(".view-toggle [data-view]");
    const panels = frame.querySelectorAll("[data-view-panel]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        panels.forEach((p) => { p.hidden = p.dataset.viewPanel !== view; });
        const legend = frame.querySelector(".chart-legend");
        if (legend) legend.hidden = view !== "chart"; // a chart legend means nothing above a table
        if (view === "chart") frame.dispatchEvent(new CustomEvent("chart:show", { bubbles: true }));
      });
    });
  }

  /** Markup for the shared chart frame header + toggle (module fills the panels). */
  function chartFrameHtml({ title, subtitle = "", legend = "", plotClass = "", plotStyle = "" }) {
    return `
      <figure class="chart-frame" data-chart-frame>
        <figcaption class="chart-head">
          <div>
            <h4 class="chart-title">${esc(title)}</h4>
            ${subtitle ? `<p class="chart-sub">${esc(subtitle)}</p>` : ""}
          </div>
          <div class="view-toggle" role="group" aria-label="Chart or table view">
            <button type="button" data-view="chart" aria-pressed="true">Chart</button>
            <button type="button" data-view="table" aria-pressed="false">Table</button>
          </div>
        </figcaption>
        ${legend ? `<div class="chart-legend" role="list" aria-label="Legend">${legend}</div>` : ""}
        <div class="chart-container ${esc(plotClass)}" data-view-panel="chart" ${plotStyle ? `style="${esc(plotStyle)}"` : ""}></div>
        <div class="chart-table" data-view-panel="table" hidden></div>
      </figure>`;
  }

  const chart = {
    niceScale,
    mountResponsive,
    tooltip: createChartTooltip,
    dataTable,
    wireFrame: wireChartFrame,
    frameHtml: chartFrameHtml,
  };

  /* ------------------------------------------------------------------------
   * Init
   * --------------------------------------------------------------------- */
  function init() {
    initDialogs();
    initTooltips();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  /** Badge tone for a news signal bias: bullish → acc (green), bearish/caution → red, else amber. */
  function signalTone(bias) {
    const b = String(bias || "").toLowerCase();
    if (b.includes("bullish")) return "acc";
    if (b.includes("bearish") || b.includes("caution")) return "red";
    return "amber";
  }

  return {
    locale: LOCALE,
    esc, safeUrl, link,
    fmt, icon,
    prefersReducedMotion, debounce, copy, whenTabActive, signalTone,
    toast, dialog, color, chart,
  };
})();
