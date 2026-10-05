/**
 * Short-Horizon Planner
 * Compare candidates on facts and measured risk, test your own split against a market drop,
 * and plan the orders at Trade Republic. The planner does the arithmetic; it never proposes
 * instruments or amounts.
 *
 * Notes
 *  - Facts and risk statistics render from the bundled store, so they work offline. The
 *    calculations (stress test, one-year risk, orders, tax) come from POST /api/planner/analyze:
 *    one tested implementation instead of a second copy in the browser (DECISIONS 10.11). Without
 *    the local server those sections say so and offer Retry.
 *  - Inputs are remembered in localStorage, in this browser only.
 *  - Typing never re-renders the inputs: results update their own cells and sections.
 */

window.PlannerModule = (function () {
  const { esc, icon, fmt } = UI;
  const STORE_KEY = "apex_planner_v1";

  let dataset = null;
  let risk = null;
  let state = null;
  let result = null;
  let lastError = null; // { kind: "unreachable" | "invalid", message }
  let runId = 0;
  let bound = false;
  let hydrated = false;

  const $ = (id) => document.getElementById(id);
  const byId = () => Object.fromEntries((dataset?.instruments || []).map((i) => [i.id, i]));
  const statsOf = (id) => risk?.instruments?.[id] || null;
  const cashId = () => dataset?.cashInstrument || "CASH";
  const episodeLabel = (e) => e?.label || (e ? `${e.peak} → ${e.trough}` : "");
  // Amounts that round to zero at the shown precision are zero: no sign, no colour, no "-€0".
  const shown = (n, d = 0) => (Math.abs(Number(n)) < 0.5 * 10 ** -d ? 0 : Number(n));
  const signedEur = (n, d = 0) => (shown(n, d) > 0 ? "+" : "") + fmt.eur(shown(n, d), d);
  const tone = (n) => (shown(n) < 0 ? "val-negative" : shown(n) > 0 ? "val-positive" : "");

  const KIND_LABEL = { cash: "Cash", "money-market": "Money market", bond: "Bonds", gold: "Gold", crypto: "Crypto", equity: "Equity" };
  const KIND_BADGE = { cash: "badge-acc", "money-market": "badge-acc", bond: "badge-blue", gold: "badge-amber", crypto: "badge-purple", equity: "badge-cyan" };

  /* ------------------------------------------------------------- lifecycle */
  function init(bundledDataset, bundledRisk) {
    if (bundledDataset && !hydrated) {
      dataset = bundledDataset;
      risk = bundledRisk || {};
    }
    if (!dataset || !dataset.instruments) {
      const c = $("planner-container");
      if (c) c.innerHTML = `<div class="callout callout-warning">${icon("alert")}<div><div class="callout-title">Planner data missing</div>public/data/planner.json was not found. Rebuild the data store with <code>python3 scripts/build_js_store.py</code>.</div></div>`;
      return;
    }
    if (!state) state = loadState();
    renderInterface();
    bindOnce();
    UI.whenTabActive("planner", () => { hydrate(); }, "hydrate");
  }

  function defaultState() {
    const def = dataset.defaultPortfolio || {};
    const today = { ...(def.today || {}) };
    const rows = [cashId(), ...Object.keys(today), ...(def.candidates || [])].filter((id, i, a) => byId()[id] && a.indexOf(id) === i);
    const iso = new Date();
    return {
      rows,
      today,
      targets: {},
      drop: -10,
      horizon: 12,
      cashRate: byId()[cashId()]?.interestRate ?? 2.5,
      lossLimit: "",
      allowance: dataset.tax?.saversAllowance ?? 1000,
      allowanceUsed: 0,
      execution: {
        strategy: "lump", tranches: 3, intervalWeeks: 4, frequency: "monthly", executions: 3,
        orderFee: dataset.broker?.orderFee ?? 1,
        startDate: `${iso.getFullYear()}-${String(iso.getMonth() + 1).padStart(2, "0")}-${String(iso.getDate()).padStart(2, "0")}`,
      },
    };
  }

  function loadState() {
    const base = defaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (saved && typeof saved === "object") {
        const known = byId();
        const merged = { ...base, ...saved, execution: { ...base.execution, ...(saved.execution || {}) } };
        merged.rows = (Array.isArray(saved.rows) ? saved.rows : base.rows).filter((id) => known[id]);
        if (!merged.rows.includes(cashId())) merged.rows.unshift(cashId());
        return merged;
      }
    } catch (e) { /* private mode or corrupt entry: start fresh */ }
    return base;
  }

  const saveState = UI.debounce(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }, 300);

  async function hydrate() {
    try {
      const res = await fetch("/api/planner");
      if (res.ok) {
        const data = await res.json();
        if (data && data.dataset && data.dataset.instruments) {
          const changed = JSON.stringify([data.dataset, data.risk]) !== JSON.stringify([dataset, risk]);
          dataset = data.dataset;
          risk = data.risk || {};
          hydrated = true;
          if (changed) renderInterface();
        }
      }
    } catch (e) { /* offline: keep the bundled copy */ }
    analyze();
  }

  /* --------------------------------------------------------------- markup */
  function renderInterface() {
    const c = $("planner-container");
    if (!c) return;
    c.innerHTML = `
      ${introHtml()}
      <section class="card" aria-labelledby="pl-compare-title">
        <div class="card-header">
          <div>
            <div class="cluster"><span class="step-pill step-1">Step 1</span><h3 id="pl-compare-title" class="card-title">Compare the candidates</h3></div>
            <span class="card-subtitle">Costs, tax treatment and how each instrument actually behaved, measured from daily prices. Add the ones you want to model to your split.</span>
          </div>
        </div>
        <div class="table-responsive" id="pl-compare">${compareTableHtml()}</div>
        <p class="text-muted text-xs mt-2" id="pl-compare-note">${compareNoteHtml()}</p>
      </section>

      <section class="card" aria-labelledby="pl-split-title">
        <div class="card-header">
          <div>
            <div class="cluster"><span class="step-pill step-2">Step 2</span><h3 id="pl-split-title" class="card-title">Your split</h3></div>
            <span class="card-subtitle">Enter what you hold today and what you want to hold. Money you do not place elsewhere stays in the cash account.</span>
          </div>
        </div>
        ${scenarioControlsHtml()}
        <div class="table-responsive mt-4" id="pl-editor">${editorTableHtml()}</div>
        <div class="row-between wrap-gap mt-3">
          <label class="cluster text-sm" for="pl-add-select"><span class="field-label">Add an instrument</span>
            <select id="pl-add-select" class="filter-select">${addOptionsHtml()}</select>
          </label>
          <span id="pl-split-status" class="text-sm" role="status" aria-live="polite"></span>
        </div>
      </section>

      <section class="card" aria-labelledby="pl-stress-title">
        <div class="card-header">
          <div>
            <div class="cluster"><span class="step-pill step-3">Step 3</span><h3 id="pl-stress-title" class="card-title">What if the market drops?</h3></div>
            <span class="card-subtitle" id="pl-stress-sub"></span>
          </div>
        </div>
        <div id="pl-stress"></div>
      </section>

      <section class="card" aria-labelledby="pl-exec-title">
        <div class="card-header">
          <div>
            <div class="cluster"><span class="step-pill step-1">Step 4</span><h3 id="pl-exec-title" class="card-title">Order plan at ${esc(dataset.broker?.name || "your broker")}</h3></div>
            <span class="card-subtitle">All at once, in tranches, or as free savings plans: dates, amounts, fees and how much is exposed while you buy.</span>
          </div>
        </div>
        ${executionControlsHtml()}
        <div id="pl-exec" class="mt-4"></div>
        ${howToHtml()}
      </section>

      <section class="card" aria-labelledby="pl-tax-title">
        <div class="card-header">
          <div>
            <div class="cluster"><span class="step-pill step-2">Step 5</span><h3 id="pl-tax-title" class="card-title">Taxes (Germany, simplified)</h3></div>
            <span class="card-subtitle">Your saver's allowance, the interest it has to cover, and how each instrument is taxed. Not tax advice.</span>
          </div>
        </div>
        <div class="form-grid mb-4">
          <label class="field"><span class="field-label">Saver's allowance (€ per year)</span>
            <input type="number" class="filter-input" id="pl-allowance" min="0" step="1" inputmode="decimal" value="${esc(state.allowance)}" /></label>
          <label class="field"><span class="field-label">Already used elsewhere this year (€)</span>
            <input type="number" class="filter-input" id="pl-allowance-used" min="0" step="1" inputmode="decimal" value="${esc(state.allowanceUsed)}" />
            <span class="field-hint">e.g. interest on your emergency fund</span></label>
        </div>
        <div id="pl-tax"></div>
      </section>

      ${sourcesHtml()}`;

    renderResults();
  }

  function introHtml() {
    const ctx = (dataset.marketContext || []).map((m) => `
      <div class="metric-box">
        <span class="metric-label">${esc(m.label)}</span>
        <span class="metric-value">${esc(m.value)}</span>
        <span class="metric-sub">${esc(m.detail || "")} ${m.source ? UI.link(m.source.url, "Source") : ""}</span>
      </div>`).join("");
    return `
      <div class="card planner-intro">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon("target")} Short-horizon planner</h2>
            <span class="card-subtitle">For money you may need again within a few years: compare instruments, test your own split against a market drop and plan the orders.</span>
          </div>
          <div class="cluster">
            <span class="text-muted text-xs" id="pl-risk-asof">${riskAsOfText()}</span>
            <button type="button" class="btn btn-secondary btn-sm" id="pl-refresh-risk" data-tip="Downloads fresh daily prices and recomputes volatility, beta, drawdowns and the market-fall episodes. Needs the local server.">${icon("refresh")} Refresh risk data</button>
          </div>
        </div>
        <div class="callout callout-info mb-4">${icon("info")}<div>
          <div class="callout-title">Facts and arithmetic, not advice</div>
          The planner never suggests instruments or amounts: every number below follows from what you enter. Past behaviour is measured, not predicted — the next fall can be deeper or hit different assets. Check each instrument's Key Information Document before buying.
        </div></div>
        <h4 class="section-label">Market context</h4>
        <div class="planner-context">${ctx}</div>
      </div>`;
  }

  function riskAsOfText() {
    if (!risk || !risk.asOf) return "No risk data yet";
    return `Prices up to ${risk.asOf} · ${risk.source || ""}`;
  }

  /* --------------------------------------------------------- step 1: compare */
  function taxShort(inst) {
    const t = dataset.tax || {};
    const flat = Number(t.flatRate ?? 26.375);
    const tfs = Number(t.equityFundPartialExemption ?? 30);
    const months = t.privateSales?.holdingMonths ?? 12;
    switch (inst.taxClass) {
      case "interest": return `${fmt.num(flat, 3)}% above the allowance`;
      case "fund-equity": return `${fmt.num(flat * (1 - tfs / 100), 2)}% of gains (${fmt.num(tfs, 0)}% exempt)`;
      case "fund-other": return `${fmt.num(flat, 3)}% of gains`;
      case "etc-delivery": return `Tax-free after ${months} months`;
      case "etc-taxable": return `${fmt.num(flat, 3)}% of gains, always`;
      case "crypto-direct": return `Tax-free after ${months} months (reform planned)`;
      default: return "—";
    }
  }

  function moveCell(st, ep) {
    if (!ep) return `<td class="num">—</td>`;
    const m = st?.episodes?.[ep.id];
    if (!m || m.move == null) return `<td class="num"><span class="text-muted" data-tip="This instrument did not exist yet.">n/a</span></td>`;
    const proxy = m.basis === "proxy" ? `<sup data-tip="${esc(`Did not exist yet: shows ${m.proxy}, which holds the same underlying.`)}">*</sup>` : "";
    return `<td class="num"><span class="${tone(m.move)}">${esc(fmt.pct(m.move, 1, { sign: true }))}</span>${proxy}</td>`;
  }

  function compareTableHtml() {
    const eps = (risk?.episodes || []).slice(-2).reverse(); // two most recent falls
    const groups = dataset.groups || [];
    const head = `
      <thead><tr>
        <th scope="col">Instrument</th>
        <th scope="col" class="num">Cost p.a.</th>
        <th scope="col" class="num"><span data-tip="Annualised standard deviation of weekly returns, last 3 years or since launch.">Volatility</span></th>
        <th scope="col" class="num"><span data-tip="Average move per 1% move of world equity (${esc(dataset.benchmark)}), weekly returns.">Beta</span></th>
        ${eps.map((e) => `<th scope="col" class="num"><span data-tip="${esc(`${e.peak} → ${e.trough}: world equity ${fmt.pct(e.benchmarkMove, 1)}`)}">${esc(episodeLabel(e))}<br><span class="text-muted">world ${esc(fmt.pct(e.benchmarkMove, 1))}</span></span></th>`).join("")}
        <th scope="col" class="num"><span data-tip="Worst return over any 12-month holding period in the last 5 years (or since launch).">Worst 12 months</span></th>
        <th scope="col" class="num"><span data-tip="Deepest fall from a peak in the last 5 years (or since launch).">Max. fall</span></th>
        <th scope="col">Tax on gains</th>
        <th scope="col"><span data-tip="${esc(`Savings plan offered at ${dataset.broker?.name || "the broker"} (source: justETF)`)}">Savings plan</span></th>
        <th scope="col"><span class="sr-only">In your split</span></th>
      </tr></thead>`;

    const rows = groups.map((g) => {
      const members = dataset.instruments.filter((i) => i.group === g.id);
      if (!members.length) return "";
      return `<tr class="planner-group-row"><th scope="rowgroup" colspan="${9 + eps.length}">${esc(g.label)}</th></tr>` + members.map((inst) => {
        const st = statsOf(inst.id);
        const w12 = st?.worst12m;
        const shortHistory = w12 && w12.windows < 365;
        const inSplit = state.rows.includes(inst.id);
        const isCash = inst.kind === "cash";
        const cost = isCash ? `${esc(fmt.pct(inst.interestRate, 2))} interest`
          : inst.ter != null ? esc(fmt.pct(inst.ter, 2)) : `<span data-tip="${esc(inst.costNote || "")}">spread</span>`;
        const plan = inst.tradeRepublic?.savingsPlan;
        return `
          <tr${inSplit ? ' class="highlight-row"' : ""}>
            <th scope="row">
              <span class="table-etf-title">${esc(inst.shortName || inst.name)} <span class="info-tip" data-tip="${esc(`${inst.name}. ${inst.summary || ""}${inst.inception ? ` Launched ${inst.inception}.` : ""}`)}">?</span></span>
              <span class="cluster planner-badges"><span class="badge ${KIND_BADGE[inst.kind] || "badge-neutral"} badge-sm">${esc(KIND_LABEL[inst.kind] || inst.kind)}</span>${inst.role === "benchmark" ? '<span class="badge badge-neutral badge-sm">Benchmark</span>' : ""}${inst.isin ? `<span class="table-etf-sub mono">${esc(inst.isin)}</span>` : ""}</span>
              ${inst.exposure ? `<span class="table-etf-sub planner-summary">${esc(inst.exposure)}</span>` : ""}
            </th>
            <td class="num">${cost}</td>
            <td class="num">${isCash ? "0%" : st?.volatility != null ? esc(fmt.pct(st.volatility, 1)) : "—"}</td>
            <td class="num">${isCash ? "0.00" : st?.beta != null ? `<span data-tip="${esc(`${st.weeks} weeks from ${st.statsFrom}; beta in falling weeks ${fmt.num(st.downBeta, 2)}`)}">${esc(fmt.num(st.beta, 2))}</span>` : "—"}</td>
            ${eps.map((e) => (isCash ? `<td class="num">0.0%</td>` : moveCell(st, e))).join("")}
            <td class="num">${isCash ? "—" : w12 ? `<span class="${tone(w12.value)}" data-tip="${esc(`${w12.from} → ${w12.to}; ${w12.windows} holding periods${shortHistory ? " — short history, so this says little" : ""}`)}">${esc(fmt.pct(w12.value, 1, { sign: true }))}</span>${shortHistory ? '<br><span class="text-muted text-xs">short history</span>' : ""}` : "—"}</td>
            <td class="num">${isCash ? "—" : st?.maxDrawdown?.value != null ? `<span class="val-negative" data-tip="${esc(`${st.maxDrawdown.peak} → ${st.maxDrawdown.trough}`)}">${esc(fmt.pct(st.maxDrawdown.value, 1))}</span>` : "—"}</td>
            <td><span class="text-sm">${esc(taxShort(inst))}</span>${inst.taxNote ? ` <span class="info-tip" data-tip="${esc(inst.taxNote)}">?</span>` : ""}</td>
            <td>${plan === true ? `<span class="badge badge-acc badge-sm">Yes</span>` : plan === false ? `<span class="badge badge-neutral badge-sm">No</span>` : `<span class="text-muted text-xs" data-tip="${esc(inst.tradeRepublic?.note || "")}">${isCash ? "—" : "Check app"}</span>`}</td>
            <td>${isCash ? "" : `<button type="button" class="btn ${inSplit ? "btn-ghost" : "btn-secondary"} btn-sm pl-toggle" data-id="${esc(inst.id)}" aria-pressed="${inSplit}">${inSplit ? `${icon("check")} In split` : `${icon("plus")} Add`}</button>`}</td>
          </tr>`;
      }).join("");
    }).join("");
    return `<table class="data-table planner-compare"><caption class="sr-only">Candidate instruments compared</caption>${head}<tbody>${rows}</tbody></table>`;
  }

  function compareNoteHtml() {
    if (!risk?.asOf) return "Risk statistics are missing. Press “Refresh risk data” (needs the local server).";
    return `Statistics from ${esc(risk.source)} up to ${esc(risk.asOf)}. “n/a”: the instrument did not exist yet. * a proxy with the same underlying. Hover a figure for its dates.`;
  }

  /* ---------------------------------------------------------- step 2: split */
  function scenarioControlsHtml() {
    return `
      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="pl-drop">World equity falls by (%)</label>
          <input type="number" class="filter-input" id="pl-drop" min="-60" max="-1" step="1" inputmode="decimal" value="${esc(state.drop)}" />
          <div class="pill-group" role="group" aria-label="Quick scenarios">
            ${[-10, -20, -30].map((v) => `<button type="button" class="pill-btn pl-drop-pill" data-drop="${v}" aria-pressed="${Number(state.drop) === v}">${v}%</button>`).join("")}
          </div>
        </div>
        <label class="field"><span class="field-label">Horizon (months)</span>
          <input type="number" class="filter-input" id="pl-horizon" min="1" max="120" step="1" value="${esc(state.horizon)}" /></label>
        <label class="field"><span class="field-label">Cash account rate (% p.a.)</span>
          <input type="number" class="filter-input" id="pl-cash-rate" min="0" max="20" step="0.05" inputmode="decimal" value="${esc(state.cashRate)}" /></label>
        <label class="field"><span class="field-label">Most I would accept losing in that fall (€)</span>
          <input type="number" class="filter-input" id="pl-loss-limit" min="0" step="10" inputmode="decimal" placeholder="optional" value="${esc(state.lossLimit)}" />
          <span class="field-hint">Compared with the worst estimate below</span></label>
      </div>`;
  }

  function editorTableHtml() {
    const known = byId();
    const rows = state.rows.map((id) => {
      const inst = known[id];
      const isCash = id === cashId();
      return `
        <tr data-row="${esc(id)}">
          <th scope="row"><span class="table-etf-title">${esc(inst.shortName || inst.name)}</span><span class="table-etf-sub">${esc(inst.isin || KIND_LABEL[inst.kind] || "")}</span></th>
          <td class="num"><input type="number" class="filter-input planner-amount pl-today" data-id="${esc(id)}" min="0" step="10" inputmode="decimal" value="${esc(state.today[id] ?? "")}" placeholder="0" aria-label="${esc(`${inst.shortName || inst.name}: amount held today in euro`)}" /></td>
          <td class="num">${isCash
            ? `<output class="planner-cash-target" data-cell="target" data-id="${esc(id)}" aria-live="polite">—</output><div class="text-muted text-xs">whatever is left</div>`
            : `<input type="number" class="filter-input planner-amount pl-target" data-id="${esc(id)}" min="0" step="10" inputmode="decimal" value="${esc(state.targets[id] ?? "")}" placeholder="${esc(state.today[id] ?? 0)}" aria-label="${esc(`${inst.shortName || inst.name}: amount you want to hold in euro`)}" />`}</td>
          <td class="num" data-cell="change" data-id="${esc(id)}">—</td>
          <td class="num" data-cell="share" data-id="${esc(id)}">—</td>
          <td class="num" data-cell="beta" data-id="${esc(id)}">—</td>
          <td>${isCash ? "" : `<button type="button" class="remove-ticker-btn pl-remove" data-id="${esc(id)}" aria-label="${esc(`Remove ${inst.shortName || inst.name} from the split`)}">${icon("x")}</button>`}</td>
        </tr>`;
    }).join("");
    return `
      <table class="data-table planner-editor">
        <caption class="sr-only">Amounts held today and target amounts</caption>
        <thead><tr>
          <th scope="col">Instrument</th>
          <th scope="col" class="num">Today (€)</th>
          <th scope="col" class="num">Target (€)</th>
          <th scope="col" class="num">Change</th>
          <th scope="col" class="num">Share</th>
          <th scope="col" class="num"><span data-tip="Beta estimate for the fall entered above">In the fall</span></th>
          <th scope="col"><span class="sr-only">Remove</span></th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr class="totals-row">
          <th scope="row">Total</th>
          <td class="num" id="pl-total-today">—</td>
          <td class="num" id="pl-total-target">—</td>
          <td class="num"></td>
          <td class="num">100%</td>
          <td class="num" id="pl-total-beta">—</td>
          <td></td>
        </tr></tfoot>
      </table>`;
  }

  function addOptionsHtml() {
    const free = dataset.instruments.filter((i) => !state.rows.includes(i.id));
    const groups = dataset.groups || [];
    return `<option value="">Choose…</option>` + groups.map((g) => {
      const items = free.filter((i) => i.group === g.id);
      return items.length ? `<optgroup label="${esc(g.label)}">${items.map((i) => `<option value="${esc(i.id)}">${esc(i.shortName || i.name)}</option>`).join("")}</optgroup>` : "";
    }).join("");
  }

  /* ------------------------------------------------------ step 4: execution */
  function executionControlsHtml() {
    const ex = state.execution;
    const b = dataset.broker || {};
    const strategies = [["lump", "All at once"], ["tranches", "In tranches"], ["savings", "Savings plans"]];
    return `
      <div class="stack">
        <div class="pill-group" role="group" aria-label="How to buy">
          ${strategies.map(([k, label]) => `<button type="button" class="pill-btn pl-strategy" data-strategy="${k}" aria-pressed="${ex.strategy === k}">${label}</button>`).join("")}
        </div>
        <div class="form-grid">
          <label class="field" data-for="tranches"><span class="field-label">Number of tranches</span>
            <input type="number" class="filter-input" id="pl-tranches" min="2" max="12" step="1" value="${esc(ex.tranches)}" /></label>
          <label class="field" data-for="tranches"><span class="field-label">Weeks between tranches</span>
            <input type="number" class="filter-input" id="pl-interval" min="1" max="26" step="1" value="${esc(ex.intervalWeeks)}" /></label>
          <label class="field" data-for="savings"><span class="field-label">Savings-plan rhythm</span>
            <select class="filter-select" id="pl-frequency">
              ${[["weekly", "Weekly (2nd, 9th, 16th, 23rd)"], ["biweekly", "Twice a month (2nd, 16th)"], ["monthly", "Monthly"], ["quarterly", "Quarterly"]].map(([k, l]) => `<option value="${k}"${ex.frequency === k ? " selected" : ""}>${l}</option>`).join("")}
            </select></label>
          <label class="field" data-for="savings"><span class="field-label">Executions per instrument</span>
            <input type="number" class="filter-input" id="pl-executions" min="2" max="52" step="1" value="${esc(ex.executions)}" /></label>
          <label class="field" data-for="orders"><span class="field-label">Single orders</span>
            <select class="filter-select" id="pl-fee">
              <option value="${esc(b.orderFee ?? 1)}"${Number(ex.orderFee) === Number(b.orderFee ?? 1) ? " selected" : ""}>${esc(shortLabel(b.orderFeeLabel) || "Standard order")} · ${esc(fmt.eur(b.orderFee ?? 1, 2))}</option>
              ${b.orderFeeVenueChoice != null ? `<option value="${esc(b.orderFeeVenueChoice)}"${Number(ex.orderFee) === Number(b.orderFeeVenueChoice) ? " selected" : ""}>${esc(shortLabel(b.orderFeeVenueChoiceLabel) || "Venue of your choice")} · ${esc(fmt.eur(b.orderFeeVenueChoice, 2))}</option>` : ""}
            </select></label>
          <label class="field"><span class="field-label">Start date</span>
            <input type="date" class="filter-input" id="pl-start" value="${esc(ex.startDate)}" /></label>
        </div>
      </div>`;
  }

  /** "Bestpreis order (venue picked automatically)" → "Bestpreis order": the select has little room. */
  const shortLabel = (label) => String(label || "").replace(/\s*\(.*\)\s*$/, "");

  function syncExecutionControls() {
    const s = state.execution.strategy;
    document.querySelectorAll("#planner-container [data-for]").forEach((el) => {
      const f = el.dataset.for;
      el.hidden = !(f === s || (f === "orders" && s !== "savings"));
    });
    document.querySelectorAll("#planner-container .pl-strategy").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.strategy === s)));
  }

  function howToHtml() {
    const b = dataset.broker || {};
    const t = dataset.tax || {};
    return `
      <details class="panel mt-4 planner-howto">
        <summary><strong>How to place the plan in the ${esc(b.name || "broker")} app</strong></summary>
        <ol class="acad-list">
          <li><strong>Move the money by SEPA transfer</strong> — free; card, Apple Pay or Google Pay deposits cost 1%. Uninvested cash there earns ${esc(fmt.pct(b.cashInterestRate, 2))} p.a. (since ${esc(b.cashInterestSince || "")}, variable).</li>
          <li><strong>Find each instrument by its ISIN</strong> (listed in Step 1) and check the share class in the name, e.g. “USD (Acc)”.</li>
          <li><strong>Single orders:</strong> ${esc(b.orderFeeLabel || "")} costs ${esc(fmt.eur(b.orderFee ?? 1, 2))}; ${esc(b.orderFeeVenueChoiceLabel || "")} costs ${esc(fmt.eur(b.orderFeeVenueChoice ?? 2, 2))} (since ${esc(b.feeModelSince || "")}). A limit order caps the price you pay; a market order fills at the current price. Bid-ask spreads are usually widest outside the main exchange hours (Xetra 9:00–17:30).</li>
          <li><strong>Savings plans:</strong> no order fee, ${esc(fmt.eur(b.savingsPlanMin ?? 10))} to ${esc(fmt.eur(b.savingsPlanMax ?? 10000))} per execution. ${esc(b.savingsPlanSchedule || "")} Crypto savings plans have no order fee either; the spread still applies.</li>
          <li><strong>Bitcoin:</strong> ${esc(byId().BTC?.costNote || "")} Each purchase starts its own 12-month tax clock.</li>
          <li><strong>Exemption order (Freistellungsauftrag):</strong> split your ${esc(fmt.eur(t.saversAllowance ?? 1000))} allowance between your bank and the broker; together they may not exceed it.</li>
          <li><strong>Before each first purchase,</strong> open the Key Information Document (KID) from the ISIN's justETF page or the broker's product page.</li>
        </ol>
        <p class="text-muted text-xs mt-2">${(b.notes || []).map(esc).join(" ")} ${(b.sources || []).map((s) => UI.link(s.url, s.label)).join(" · ")}</p>
      </details>`;
  }

  function sourcesHtml() {
    const seen = new Set();
    const items = [];
    const add = (s) => { if (s && s.url && !seen.has(s.url)) { seen.add(s.url); items.push(s); } };
    (dataset.instruments || []).forEach((i) => (i.sources || []).forEach(add));
    (dataset.broker?.sources || []).forEach(add);
    (dataset.tax?.sources || []).forEach(add);
    (dataset.marketContext || []).forEach((m) => add(m.source));
    (dataset.education || []).forEach((e) => add(e.source));
    const notes = risk?.method?.notes || [];
    const edu = (dataset.education || []).map((e) => `<div class="panel"><strong>${esc(e.title)}</strong><p class="text-secondary text-sm mt-1">${esc(e.text)}</p>${e.source ? `<p class="text-xs mt-1">${UI.link(e.source.url, e.source.label)}</p>` : ""}</div>`).join("");
    return `
      <section class="card" aria-labelledby="pl-method-title">
        <div class="card-header"><div><h3 id="pl-method-title" class="card-title">Method &amp; sources</h3>
          <span class="card-subtitle">Facts checked ${esc(dataset.asOf || "")}; statistics recomputed with “Refresh risk data” or <code>uv run apex-etf planner-risk</code>.</span></div></div>
        <div class="grid-2 mb-4">${edu}</div>
        <ul class="acad-list">${notes.map((n) => `<li>${esc(n)}</li>`).join("")}<li>The one-year loss figure assumes normally distributed returns with zero drift; real markets have fatter tails.</li></ul>
        <h4 class="section-label mt-4">Sources</h4>
        <ul class="acad-list planner-sources">${items.map((s) => `<li>${UI.link(s.url, s.label)}</li>`).join("")}</ul>
      </section>`;
  }

  /* -------------------------------------------------------------- analysis */
  function request() {
    const num = (v) => (v === "" || v == null ? undefined : Number(v));
    const targets = {};
    for (const id of state.rows) {
      if (id === cashId()) continue;
      const v = state.targets[id];
      if (v !== "" && v != null) targets[id] = Number(v);
    }
    const today = {};
    for (const [id, v] of Object.entries(state.today)) if (state.rows.includes(id) && v !== "" && v != null) today[id] = Number(v);
    return {
      holdings: today,
      targets,
      scenario: { benchmarkMove: num(state.drop) },
      horizonMonths: num(state.horizon),
      cashRate: num(state.cashRate),
      lossLimit: num(state.lossLimit),
      execution: { ...state.execution },
      tax: { allowance: num(state.allowance), allowanceUsedElsewhere: num(state.allowanceUsed) },
    };
  }

  function setBusy(on) {
    // Also dimmed while the input is invalid: the figures shown belong to the last valid split.
    const dim = on || lastError?.kind === "invalid";
    ["pl-stress", "pl-exec", "pl-tax"].forEach((id) => $(id)?.classList.toggle("is-refreshing", dim));
  }

  async function analyze() {
    const myRun = ++runId;
    setBusy(true);
    let payload = null;
    let kind = null;
    try {
      const res = await fetch("/api/planner/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request()),
      });
      payload = await res.json().catch(() => null);
      // 400 carries a reason about the input; anything else means no (or an older) planner API.
      if (!payload || (payload.error && res.status !== 400)) throw new Error(`HTTP ${res.status}`);
      if (payload.error) kind = "invalid";
    } catch (e) {
      kind = "unreachable";
    }
    if (myRun !== runId) return; // superseded by newer input
    if (kind) {
      lastError = { kind, message: payload?.error || "" };
      if (kind === "unreachable") result = null; // keep the last good result while the input is merely invalid
    } else {
      lastError = null;
      result = payload;
    }
    renderResults();
    setBusy(false);
  }

  const analyzeSoon = UI.debounce(analyze, 250);

  /* ---------------------------------------------------------------- render */
  function renderResults() {
    syncExecutionControls();
    updateEditorCells();
    renderStress();
    renderExecution();
    renderTax();
  }

  function unreachableHtml() {
    return `<div class="callout callout-warning">${icon("alert")}<div>
      <div class="callout-title">Calculator unavailable</div>
      The stress test, order plan and tax figures are computed by the local server. Start (or restart) it with <code>uv run apex-etf</code> or <code>python3 server.py</code> and press Retry. The comparison above works offline.
      <div class="mt-2"><button type="button" class="btn btn-secondary btn-sm pl-retry">${icon("refresh")} Retry</button></div>
    </div></div>`;
  }

  function updateEditorCells() {
    const status = $("pl-split-status");
    const set = (sel, html) => document.querySelectorAll(sel).forEach((el) => { el.innerHTML = html; });
    if (status) {
      if (lastError?.kind === "invalid") {
        status.className = "text-sm accent-amber";
        status.textContent = lastError.message;
      } else if (result) {
        const cash = result.allocation.find((r) => r.id === cashId());
        status.className = "text-sm text-secondary";
        status.textContent = `${fmt.eur(cash ? cash.target : 0, 0)} stays in the cash account · ${fmt.pct(result.riskyPercent, 1)} outside it`;
      } else {
        status.textContent = "";
      }
    }
    if (!result) return;
    const alloc = Object.fromEntries(result.allocation.map((r) => [r.id, r]));
    const stress = Object.fromEntries(result.stress.rows.map((r) => [r.id, r]));
    for (const id of state.rows) {
      const a = alloc[id];
      const sel = (cell) => `#pl-editor [data-cell="${cell}"][data-id="${CSS.escape(id)}"]`;
      if (id === cashId()) set(sel("target"), a ? esc(fmt.eur(a.target, 0)) : "—");
      set(sel("change"), a && a.change ? `<span class="${tone(a.change)}">${esc(signedEur(a.change, 0))}</span>` : "—");
      set(sel("share"), a ? esc(fmt.pct(a.targetPercent, 1)) : "—");
      const s = stress[id];
      set(sel("beta"), s ? `<span class="${tone(s.betaChange)}">${esc(signedEur(s.betaChange, 0))}</span>` : a && a.target > 0 ? `<span class="text-muted" data-tip="No risk statistics">—</span>` : "—");
    }
    const tt = $("pl-total-today"); if (tt) tt.textContent = fmt.eur(result.total, 0);
    const tg = $("pl-total-target"); if (tg) tg.textContent = fmt.eur(result.total, 0);
    const tb = $("pl-total-beta"); if (tb) tb.innerHTML = `<span class="${tone(result.stress.totals.beta)}">${esc(signedEur(result.stress.totals.beta, 0))}</span>`;
  }

  function renderStress() {
    const host = $("pl-stress");
    const sub = $("pl-stress-sub");
    if (!host) return;
    if (lastError?.kind === "unreachable" || !result) {
      host.innerHTML = lastError?.kind === "unreachable" ? unreachableHtml() : `<p class="text-muted text-sm">Calculating…</p>`;
      if (sub) sub.textContent = "";
      return;
    }
    const s = result.stress;
    const eps = s.episodes || [];
    const epById = Object.fromEntries(eps.map((e) => [e.id, e]));
    const worstLabel = s.totals.worstMethod === "beta" ? "beta estimate" : `same pattern as the ${episodeLabel(epById[s.totals.worstMethod])}`;
    if (sub) sub.textContent = `World equity (${s.benchmark}) falls ${fmt.num(Math.abs(s.benchmarkMove), 0)}%. Measured behaviour, scaled to your scenario; amounts are what your split would gain or lose.`;

    const limitTile = s.lossLimit != null ? `
      <div class="metric-box ${s.withinLossLimit ? "tone-emerald" : "tone-rose"}">
        <span class="metric-label">Your limit</span>
        <span class="metric-value">${esc(fmt.eur(s.lossLimit, 0))}</span>
        <span class="metric-sub">${s.withinLossLimit ? "The worst estimate stays within it" : `The worst estimate exceeds it by ${esc(fmt.eur(-s.totals.worst - s.lossLimit, 0))}`}</span>
      </div>` : "";

    const h = result.horizon;
    host.innerHTML = `
      <div class="grid-4 planner-tiles">
        <div class="metric-box"><span class="metric-label">Beta estimate</span>
          <span class="metric-value ${tone(s.totals.beta)}">${esc(signedEur(s.totals.beta, 0))}</span>
          <span class="metric-sub">${esc(fmt.pct(s.totals.betaPercent, 2, { sign: true }))} of ${esc(fmt.eur(result.total, 0))}</span></div>
        <div class="metric-box tone-amber"><span class="metric-label">Worst of the estimates</span>
          <span class="metric-value ${tone(s.totals.worst)}">${esc(signedEur(s.totals.worst, 0))}</span>
          <span class="metric-sub">${esc(worstLabel)}</span></div>
        <div class="metric-box"><span class="metric-label">Interest it would cost to make up</span>
          <span class="metric-value">${esc(fmt.num(s.monthsOfInterestToRecoverWorst, 1))} months</span>
          <span class="metric-sub">of interest on everything in cash (${esc(fmt.eur(s.allCash.monthlyInterest, 2))}/month)</span></div>
        ${limitTile || `<div class="metric-box"><span class="metric-label">Everything in the cash account</span>
          <span class="metric-value">${esc(fmt.eur(0, 0))}</span><span class="metric-sub">no market loss; earns ${esc(fmt.eur(h.allCashInterest, 0))} over ${esc(h.months)} months</span></div>`}
      </div>

      <div class="panel mt-4" id="pl-stress-chart">
        ${UI.chart.frameHtml({
          title: "Gain or loss per holding in the fall",
          subtitle: "Bar: beta estimate. Line: range across the past falls scaled to your scenario.",
          legend: `<span class="legend-item" role="listitem"><span class="legend-key is-rect" style="--c:var(--series-1)"></span>Beta estimate</span><span class="legend-item" role="listitem"><span class="legend-key" style="--c:var(--text-secondary)"></span>Range across past falls</span>`,
          plotStyle: "height:auto",
        })}
      </div>

      <h4 class="section-label mt-4">Scaled to your scenario, by past fall</h4>
      <div class="table-responsive">${scaledTableHtml(s, eps)}</div>
      <p class="text-muted text-xs mt-2">Each column repeats how every holding moved relative to world equity in that fall. <span class="planner-basis">β</span> = the instrument did not exist yet, so its beta is used; * = a proxy with the same underlying.</p>

      <h4 class="section-label mt-4">If a past fall repeated in full</h4>
      <div class="table-responsive">${replayTableHtml(s, eps)}</div>

      <h4 class="section-label mt-4">Over ${esc(h.months)} months</h4>
      <div class="grid-4 planner-tiles">
        <div class="metric-box"><span class="metric-label">Volatility of your split</span><span class="metric-value">${esc(fmt.pct(h.horizonVolatility, 1))}</span><span class="metric-sub">over ${esc(h.months)} months${Number(h.months) !== 12 ? ` (${esc(fmt.pct(h.portfolioVolatility, 1))} a year)` : ""}, from measured volatilities and correlations</span></div>
        <div class="metric-box tone-amber"><span class="metric-label">A 1-in-20 loss</span><span class="metric-value val-negative">${esc(signedEur(-h.loss95, 0))}</span><span class="metric-sub">${esc(fmt.pct(-h.loss95Percent, 1))}; real markets have fatter tails</span></div>
        <div class="metric-box"><span class="metric-label">Interest on the cash part</span><span class="metric-value val-positive">${esc(signedEur(h.cashInterest, 0))}</span><span class="metric-sub">at ${esc(fmt.pct(result.cashRate, 2))}, before tax</span></div>
        <div class="metric-box"><span class="metric-label">If everything stayed in cash</span><span class="metric-value val-positive">${esc(signedEur(h.allCashInterest, 0))}</span><span class="metric-sub">no market risk; below the projected inflation rate</span></div>
      </div>
      ${h.notes && h.notes.length ? `<p class="text-muted text-xs mt-2">${h.notes.map(esc).join(" ")}</p>` : ""}
      ${(result.warnings || []).length ? `<div class="callout callout-warning mt-4">${icon("alert")}<div><div class="callout-title">Check</div><ul class="acad-list">${result.warnings.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div></div>` : ""}`;

    UI.chart.wireFrame(host.querySelector("#pl-stress-chart"));
    renderStressChart(s);
  }

  function basisMark(m) {
    if (!m) return "";
    if (m.basis === "beta") return ` <span class="planner-basis" data-tip="Did not exist yet: beta × the world move">β</span>`;
    if (m.basis === "proxy") return `<sup data-tip="${esc(`Did not exist yet: proxy ${m.proxy}`)}">*</sup>`;
    return "";
  }

  function scaledTableHtml(s, eps) {
    const known = byId();
    const rows = s.rows.filter((r) => r.amount > 0).map((r) => `
      <tr><th scope="row">${esc(known[r.id]?.shortName || r.name)}</th>
        <td class="num">${esc(fmt.eur(r.amount, 0))}</td>
        <td class="num"><span class="${tone(r.betaChange)}">${esc(signedEur(r.betaChange, 0))}</span> <span class="text-muted text-xs">(β ${esc(fmt.num(r.beta, 2))})</span></td>
        ${eps.map((e) => { const m = r.scaled[e.id]; return `<td class="num"><span class="${tone(m.change)}">${esc(signedEur(m.change, 0))}</span>${basisMark(m)}</td>`; }).join("")}
      </tr>`).join("");
    return `<table class="data-table"><caption class="sr-only">Gain or loss per holding under each method</caption>
      <thead><tr><th scope="col">Holding</th><th scope="col" class="num">Amount</th><th scope="col" class="num">Beta estimate</th>
        ${eps.map((e) => `<th scope="col" class="num">${esc(episodeLabel(e))}</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="totals-row"><th scope="row">Total</th><td class="num">${esc(fmt.eur(result.total, 0))}</td>
        <td class="num"><strong class="${tone(s.totals.beta)}">${esc(signedEur(s.totals.beta, 0))}</strong></td>
        ${eps.map((e) => `<td class="num"><strong class="${tone(s.totals.scaled[e.id])}">${esc(signedEur(s.totals.scaled[e.id], 0))}</strong></td>`).join("")}</tr></tfoot>
    </table>`;
  }

  function replayTableHtml(s, eps) {
    const known = byId();
    const rows = eps.map((e) => {
      const estimated = s.rows.filter((r) => r.amount > 0 && ["beta", "proxy"].includes(r.replay[e.id]?.basis)).map((r) => known[r.id]?.shortName || r.id);
      return `<tr><th scope="row"><span class="table-etf-title">${esc(episodeLabel(e))}</span><span class="table-etf-sub">${esc(e.peak)} → ${esc(e.trough)}${e.recovered ? ` · world index back at its peak on ${esc(e.recovered)}` : " · not yet recovered"}</span></th>
        <td class="num val-negative">${esc(fmt.pct(e.benchmarkMove, 1))}</td>
        <td class="num"><strong class="${tone(s.totals.replay[e.id])}">${esc(signedEur(s.totals.replay[e.id], 0))}</strong></td>
        <td class="num">${esc(fmt.pct(s.totals.replayPercent[e.id], 1, { sign: true }))}</td>
        <td class="text-xs text-muted">${estimated.length ? `Estimated for: ${esc(estimated.join(", "))}` : "All measured"}</td></tr>`;
    }).join("");
    return `<table class="data-table"><caption class="sr-only">Your split in past market falls</caption>
      <thead><tr><th scope="col">Fall</th><th scope="col" class="num">World equity</th><th scope="col" class="num">Your split</th><th scope="col" class="num">In %</th><th scope="col">Basis</th></tr></thead>
      <tbody>${rows}</tbody></table>`;
  }

  function renderStressChart(s) {
    const frame = $("pl-stress-chart");
    const host = frame?.querySelector('[data-view-panel="chart"]');
    const tableHost = frame?.querySelector('[data-view-panel="table"]');
    if (!host) return;
    const known = byId();
    const data = s.rows.filter((r) => r.amount > 0 && known[r.id]?.kind !== "cash").map((r) => {
      const vals = Object.values(r.scaled).map((m) => m.change);
      return { id: r.id, label: known[r.id]?.shortName || r.id, beta: r.betaChange, lo: Math.min(r.betaChange, ...vals), hi: Math.max(r.betaChange, ...vals) };
    });

    tableHost.textContent = "";
    tableHost.appendChild(UI.chart.dataTable({
      caption: "Gain or loss per holding in the fall",
      columns: [
        { key: "label", label: "Holding" },
        { key: "beta", label: "Beta estimate", align: "right", format: (v) => signedEur(v, 0) },
        { key: "lo", label: "Worst past fall", align: "right", format: (v) => signedEur(v, 0) },
        { key: "hi", label: "Mildest past fall", align: "right", format: (v) => signedEur(v, 0) },
      ],
      rows: data,
    }));

    if (!data.length) {
      host.innerHTML = `<p class="text-muted text-sm chart-empty">Nothing outside the cash account yet: add amounts in Step 2.</p>`;
      return;
    }
    host.querySelector(".chart-empty")?.remove();
    const tooltip = host._tip || (host._tip = UI.chart.tooltip(host));
    UI.chart.mountResponsive(host, (width) => {
      const rowH = 34;
      const pad = { top: 8, right: 16, bottom: 30, left: Math.min(170, Math.max(110, width * 0.28)) };
      const height = pad.top + pad.bottom + rowH * data.length;
      const plotW = Math.max(60, width - pad.left - pad.right);
      const scale = UI.chart.niceScale(Math.min(0, ...data.map((d) => d.lo)), Math.max(0, ...data.map((d) => d.hi)), 5);
      const X = (v) => pad.left + ((v - scale.min) / (scale.max - scale.min)) * plotW;
      const grid = scale.ticks.map((t) => `<line class="chart-grid-line" x1="${X(t)}" x2="${X(t)}" y1="${pad.top}" y2="${height - pad.bottom}"></line>
        <text class="chart-axis-text" x="${X(t)}" y="${height - pad.bottom + 18}" text-anchor="middle">${esc(fmt.eurCompact(t))}</text>`).join("");
      const bars = data.map((d, i) => {
        const y = pad.top + rowH * i;
        const x0 = X(Math.min(0, d.beta));
        const w = Math.max(1, Math.abs(X(d.beta) - X(0)));
        const cy = y + rowH / 2;
        return `<g class="bar-group" data-i="${i}" tabindex="0" role="img" aria-label="${esc(`${d.label}: beta estimate ${signedEur(d.beta, 0)}, past falls ${signedEur(d.lo, 0)} to ${signedEur(d.hi, 0)}`)}">
          <rect class="bar-hit" x="0" y="${y}" width="${width}" height="${rowH}" fill="transparent"></rect>
          <text class="chart-label tick-label" x="${pad.left - 8}" y="${cy + 4}" text-anchor="end">${esc(d.label)}</text>
          <rect x="${x0}" y="${cy - 8}" width="${w}" height="16" rx="3" fill="var(--series-1)"></rect>
          <line x1="${X(d.lo)}" x2="${X(d.hi)}" y1="${cy}" y2="${cy}" stroke="var(--text-secondary)" stroke-width="2"></line>
          <line x1="${X(d.lo)}" x2="${X(d.lo)}" y1="${cy - 6}" y2="${cy + 6}" stroke="var(--text-secondary)" stroke-width="2"></line>
          <line x1="${X(d.hi)}" x2="${X(d.hi)}" y1="${cy - 6}" y2="${cy + 6}" stroke="var(--text-secondary)" stroke-width="2"></line>
        </g>`;
      }).join("");
      host.style.height = `${height}px`;
      host.innerHTML = `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="group" aria-label="Horizontal bars: estimated gain or loss per holding. Open the table view for the numbers.">
        ${grid}<line class="chart-axis-line" x1="${X(0)}" x2="${X(0)}" y1="${pad.top}" y2="${height - pad.bottom}"></line>${bars}</svg>`;
      host.appendChild(tooltip.el);
      host.querySelectorAll(".bar-group").forEach((g) => {
        const d = data[Number(g.dataset.i)];
        const show = () => tooltip.show({
          x: X(d.beta), y: pad.top + rowH * Number(g.dataset.i) + rowH / 2, title: d.label,
          rows: [
            { color: "var(--series-1)", value: signedEur(d.beta, 0), label: "beta estimate" },
            { color: "var(--text-secondary)", value: `${signedEur(d.lo, 0)} … ${signedEur(d.hi, 0)}`, label: "past falls, scaled" },
          ],
        });
        g.addEventListener("pointerenter", show);
        g.addEventListener("pointerleave", () => tooltip.hide());
        g.addEventListener("focus", show);
        g.addEventListener("blur", () => tooltip.hide());
      });
    });
  }

  function renderExecution() {
    const host = $("pl-exec");
    if (!host) return;
    if (lastError?.kind === "unreachable" || !result) {
      host.innerHTML = lastError?.kind === "unreachable" ? unreachableHtml() : "";
      return;
    }
    const ex = result.execution;
    const sm = ex.summary;
    const known = byId();
    if (!ex.orders.length) {
      host.innerHTML = `<p class="text-muted text-sm">No orders: your targets equal what you hold today. Enter target amounts in Step 2.</p>`;
      return;
    }
    const orders = ex.orders.map((o) => `
      <tr><td class="nowrap">${esc(o.date)}</td>
        <th scope="row"><span class="table-etf-title">${esc(known[o.id]?.shortName || o.name)}</span><span class="table-etf-sub mono">${esc(known[o.id]?.isin || "")}</span></th>
        <td><span class="badge ${o.side === "buy" ? "badge-blue" : "badge-amber"} badge-sm">${o.side === "buy" ? "Buy" : "Sell"}</span></td>
        <td class="num">${esc(fmt.eur(o.amount, 2))}</td>
        <td class="num">${esc(fmt.eur(o.fee, 2))}${o.spreadEstimate ? `<div class="text-muted text-xs" data-tip="Estimated spread cost (included in the price, not charged separately)">+≈${esc(fmt.eur(o.spreadEstimate, 2))} spread</div>` : ""}</td>
        <td class="text-xs">${o.type === "savings plan" ? "Savings plan" : "Single order"}</td></tr>`).join("");
    const timeline = ex.timeline.map((t) => `
      <tr><td class="nowrap">${esc(t.date)}</td><td class="num">${esc(fmt.eur(t.invested, 0))}</td>
        <td class="num"><span class="${tone(t.scenarioChange)}">${esc(signedEur(t.scenarioChange, 0))}</span></td></tr>`).join("");
    host.innerHTML = `
      <div class="grid-4 planner-tiles">
        <div class="metric-box"><span class="metric-label">Orders</span><span class="metric-value">${esc(sm.orderCount)}</span>
          <span class="metric-sub">${sm.savingsPlanExecutions ? `plus ${esc(sm.savingsPlanExecutions)} savings-plan executions` : "single orders"}</span></div>
        <div class="metric-box"><span class="metric-label">Fees</span><span class="metric-value">${esc(fmt.eur(sm.fees, 2))}</span>
          <span class="metric-sub">${esc(fmt.pct(sm.feePercentOfBuys, 2))} of ${esc(fmt.eur(sm.totalBuys, 0))} bought${sm.spreadEstimate ? ` · ≈${esc(fmt.eur(sm.spreadEstimate, 2))} crypto spread` : ""}</span></div>
        <div class="metric-box"><span class="metric-label">Fully invested</span><span class="metric-value">${esc(sm.fullyInvestedOn || "—")}</span>
          <span class="metric-sub">${ex.settings.strategy === "lump" ? "one day" : "last purchase"}</span></div>
        <div class="metric-box"><span class="metric-label">Interest while waiting</span><span class="metric-value val-positive">${esc(signedEur(sm.interestWhileWaiting, 2))}</span>
          <span class="metric-sub">on money not yet invested, at ${esc(fmt.pct(result.cashRate, 2))}</span></div>
      </div>
      <div class="stack mt-4">
        <div>
          <h4 class="section-label">Orders</h4>
          <div class="table-responsive planner-orders"><table class="data-table"><caption class="sr-only">Planned orders</caption>
            <thead><tr><th scope="col">Date</th><th scope="col">Instrument</th><th scope="col">Side</th><th scope="col" class="num">Amount</th><th scope="col" class="num">Fee</th><th scope="col">Type</th></tr></thead>
            <tbody>${orders}</tbody></table></div>
        </div>
        <div>
          <h4 class="section-label">Exposure while buying</h4>
          <div class="table-responsive"><table class="data-table"><caption class="sr-only">Money outside the cash account after each date</caption>
            <thead><tr><th scope="col">After</th><th scope="col" class="num">Outside cash</th><th scope="col" class="num">If the ${esc(fmt.num(Math.abs(result.stress.benchmarkMove), 0))}% fall came next</th></tr></thead>
            <tbody>${timeline}</tbody></table></div>
          <p class="text-muted text-xs mt-2">Beta estimate. Buying in steps lowers what a fall right after the first purchase can cost; if prices rise meanwhile, later purchases cost more.</p>
        </div>
      </div>`;
  }

  function renderTax() {
    const host = $("pl-tax");
    if (!host) return;
    if (lastError?.kind === "unreachable" || !result) {
      host.innerHTML = lastError?.kind === "unreachable" ? unreachableHtml() : "";
      return;
    }
    const t = result.tax;
    const known = byId();
    const rows = t.treatments.map((r) => `
      <tr><th scope="row">${esc(known[r.id]?.shortName || r.name)}</th>
        <td class="num">${r.onGainsPercent == null ? "see note" : esc(fmt.pct(r.onGainsPercent, 2))}</td>
        <td class="text-sm">${esc(r.summary)}${r.note ? `<div class="text-muted text-xs mt-1">${esc(r.note)}</div>` : ""}</td></tr>`).join("");
    const vorab = t.vorabpauschale.length ? `
      <h4 class="section-label mt-4">Advance tax on accumulating funds (Vorabpauschale), upper bound</h4>
      <div class="table-responsive"><table class="data-table"><caption class="sr-only">Vorabpauschale upper bound</caption>
        <thead><tr><th scope="col">Fund</th><th scope="col" class="num">Year</th><th scope="col" class="num">Vorabpauschale</th><th scope="col" class="num">Taxable part</th></tr></thead>
        <tbody>${t.vorabpauschale.map((v) => `<tr><th scope="row">${esc(known[v.id]?.shortName || v.id)}</th><td class="num">${esc(v.year)}</td><td class="num">${esc(fmt.eur(v.upperBound, 2))}</td><td class="num">${esc(fmt.eur(v.taxableUpperBound, 2))}</td></tr>`).join("")}</tbody></table></div>
      <p class="text-muted text-xs mt-2">Based on the purchase amount; the real figure uses the fund's value on 1 January and is zero if the fund falls over the year. Deducted in January of the following year, counted against that year's allowance.</p>` : "";
    host.innerHTML = `
      <div class="grid-4 planner-tiles">
        <div class="metric-box"><span class="metric-label">Interest on the cash part</span><span class="metric-value">${esc(fmt.eur(t.cashInterest, 0))}</span><span class="metric-sub">over ${esc(t.cashInterestMonths)} months</span></div>
        <div class="metric-box"><span class="metric-label">Allowance left for it</span><span class="metric-value">${esc(fmt.eur(t.allowanceLeft, 0))}</span><span class="metric-sub">of ${esc(fmt.eur(t.allowance, 0))}</span></div>
        <div class="metric-box ${t.taxOnInterest > 0 ? "tone-amber" : "tone-emerald"}"><span class="metric-label">Tax on that interest</span><span class="metric-value">${esc(fmt.eur(t.taxOnInterest, 2))}</span><span class="metric-sub">${esc(fmt.pct(t.flatRate, 3))} on ${esc(fmt.eur(t.taxableInterest, 0))}</span></div>
        <div class="metric-box"><span class="metric-label">Allowance left afterwards</span><span class="metric-value">${esc(fmt.eur(t.allowanceLeftAfterInterest, 0))}</span><span class="metric-sub">for fund gains, dividends and the Vorabpauschale</span></div>
      </div>
      <h4 class="section-label mt-4">How each holding is taxed</h4>
      <div class="table-responsive"><table class="data-table"><caption class="sr-only">Tax treatment per holding</caption>
        <thead><tr><th scope="col">Holding</th><th scope="col" class="num">On gains</th><th scope="col">Details</th></tr></thead>
        <tbody>${rows}</tbody></table></div>
      ${vorab}
      <ul class="acad-list mt-4">${t.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`;
  }

  /* ---------------------------------------------------------------- events */
  function bindOnce() {
    if (bound) return;
    bound = true;
    const root = $("planner-container");

    root.addEventListener("input", (e) => {
      const el = e.target;
      if (!(el instanceof HTMLInputElement)) return;
      const v = el.value;
      if (el.classList.contains("pl-today")) state.today[el.dataset.id] = v;
      else if (el.classList.contains("pl-target")) state.targets[el.dataset.id] = v;
      else if (el.id === "pl-drop") { state.drop = v; root.querySelectorAll(".pl-drop-pill").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.drop) === Number(v)))); }
      else if (el.id === "pl-horizon") state.horizon = v;
      else if (el.id === "pl-cash-rate") state.cashRate = v;
      else if (el.id === "pl-loss-limit") state.lossLimit = v;
      else if (el.id === "pl-allowance") state.allowance = v;
      else if (el.id === "pl-allowance-used") state.allowanceUsed = v;
      else if (el.id === "pl-tranches") state.execution.tranches = v;
      else if (el.id === "pl-interval") state.execution.intervalWeeks = v;
      else if (el.id === "pl-executions") state.execution.executions = v;
      else if (el.id === "pl-start") state.execution.startDate = v;
      else return;
      saveState();
      analyzeSoon();
    });

    root.addEventListener("change", (e) => {
      const el = e.target;
      if (el.id === "pl-add-select" && el.value) {
        addRow(el.value);
      } else if (el.id === "pl-frequency") {
        state.execution.frequency = el.value; saveState(); analyze();
      } else if (el.id === "pl-fee") {
        state.execution.orderFee = Number(el.value); saveState(); analyze();
      }
    });

    root.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.classList.contains("pl-toggle")) {
        const id = btn.dataset.id;
        if (state.rows.includes(id)) removeRow(id); else addRow(id);
      } else if (btn.classList.contains("pl-remove")) {
        removeRow(btn.dataset.id);
      } else if (btn.classList.contains("pl-drop-pill")) {
        state.drop = Number(btn.dataset.drop);
        const input = $("pl-drop"); if (input) input.value = state.drop;
        root.querySelectorAll(".pl-drop-pill").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        saveState(); analyze();
      } else if (btn.classList.contains("pl-strategy")) {
        state.execution.strategy = btn.dataset.strategy;
        syncExecutionControls(); saveState(); analyze();
      } else if (btn.classList.contains("pl-retry")) {
        hydrate();
      } else if (btn.id === "pl-refresh-risk") {
        refreshRisk(btn);
      }
    });
  }

  function addRow(id) {
    if (!byId()[id] || state.rows.includes(id)) return;
    state.rows.push(id);
    saveState();
    rerenderTables();
    analyze();
  }

  function removeRow(id) {
    if (id === cashId()) return;
    if (Number(state.today[id]) > 0) {
      // Still held today, so it is part of today's total; a sale is planned with a target of 0.
      UI.toast("You hold this today, so it stays in the split. Set its target to 0 to plan a sale.", { type: "info" });
      return;
    }
    state.rows = state.rows.filter((r) => r !== id);
    delete state.targets[id];
    delete state.today[id];
    saveState();
    rerenderTables();
    analyze();
  }

  function rerenderTables() {
    const editor = $("pl-editor"); if (editor) editor.innerHTML = editorTableHtml();
    const compare = $("pl-compare"); if (compare) compare.innerHTML = compareTableHtml();
    const add = $("pl-add-select"); if (add) add.innerHTML = addOptionsHtml();
    updateEditorCells();
  }

  async function refreshRisk(btn) {
    btn.disabled = true;
    btn.classList.add("is-loading");
    const progress = UI.toast("Downloading daily prices and recomputing risk statistics…", { type: "info", timeout: 0 });
    try {
      const res = await fetch("/api/planner/refresh-risk", { method: "POST" });
      const payload = await res.json().catch(() => null);
      if (res.status === 409) {
        UI.toast("A refresh is already running. Try again in a moment.", { type: "warning" });
      } else if (!payload || payload.error || payload.status === "failed") {
        UI.toast(`Refresh failed: ${payload?.error || `HTTP ${res.status}`}`, { type: "error", timeout: 9000 });
      } else {
        const warn = (payload.warnings || []).join(" ");
        UI.toast(`Risk data ${payload.status === "success" ? "refreshed" : "partly refreshed"}: ${payload.instrumentsUpdated} instruments, prices up to ${payload.asOf}. ${warn}`.trim(),
          { type: payload.status === "success" ? "success" : "warning", timeout: 8000 });
        await hydrate();
      }
    } catch (e) {
      UI.toast("Couldn't reach the local server. Start it with “uv run apex-etf”.", { type: "error", timeout: 8000 });
    } finally {
      progress.dismiss();
      btn.disabled = false;
      btn.classList.remove("is-loading");
    }
  }

  return { init };
})();
