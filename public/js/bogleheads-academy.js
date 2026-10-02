/**
 * Investment Education Academy
 * Based on Bogleheads Wiki and Morningstar frameworks.
 * Explains tax domicile, accumulating vs distributing math, and retail investing discipline.
 */

window.BogleheadsAcademyModule = (function () {
  const { esc, icon, fmt } = UI;

  // Calculator inputs survive re-renders (e.g. after a data refresh)
  const calc = { portfolio: 50000, yield: 2.0, tax: 26.375, years: 25 };
  const GROWTH_RATE = 0.07; // 7% base total return

  const num = (v, lo, hi, fallback) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
  };

  function init() {
    renderAcademy();
    initCompoundingDragCalculator();
  }

  function renderAcademy() {
    const container = document.getElementById("education-academy-container");
    if (!container) return;

    container.innerHTML = `
      <section class="card callout-edge-emerald" aria-labelledby="acad-drag">
        <div class="card-header">
          <div>
            <h2 id="acad-drag" class="card-title">✨ Accumulating (Acc) vs Distributing (Dist): the compounding drag calculator</h2>
            <span class="card-subtitle">Why Accumulating ETFs compound faster for retail wealth building</span>
          </div>
          <span class="badge badge-acc">Bogleheads principle</span>
        </div>

        <p class="text-secondary text-sm mb-4">
          When an ETF distributes dividends you suffer three frictions: (1) <strong>immediate taxation</strong> at your country's dividend rate (e.g. 26.375% in Germany, 30% in Belgium, 26% in Italy), (2) <strong>cash drag</strong> while the money sits uninvested, and (3) <strong>broker commissions</strong> to buy new shares. <strong>Accumulating ETFs reinvest 100% of the dividend into the fund NAV with zero friction.</strong>
        </p>

        <form id="drag-form" class="panel form-grid mb-4" novalidate>
          <div class="field"><label class="field-label" for="drag-portfolio">Starting portfolio (€)</label>
            <input type="number" id="drag-portfolio" class="filter-input" value="${esc(calc.portfolio)}" min="0" step="5000" inputmode="decimal" /></div>
          <div class="field"><label class="field-label" for="drag-yield">Dividend yield (%)</label>
            <input type="number" id="drag-yield" class="filter-input" value="${esc(calc.yield)}" min="0" max="10" step="0.1" inputmode="decimal" /></div>
          <div class="field"><label class="field-label" for="drag-tax">Local dividend tax rate (%)</label>
            <input type="number" id="drag-tax" class="filter-input" value="${esc(calc.tax)}" min="0" max="60" step="any" inputmode="decimal" /></div>
          <div class="field"><label class="field-label" for="drag-years">Time horizon (years)</label>
            <input type="number" id="drag-years" class="filter-input" value="${esc(calc.years)}" min="1" max="60" step="1" inputmode="numeric" /></div>
        </form>

        <div id="drag-results-display" class="grid-3" role="status" aria-live="polite" aria-atomic="true"></div>
        <p class="text-muted text-xs mt-3">Illustration assumes a ${fmt.pct(GROWTH_RATE * 100, 0)} base total return before dividend tax.</p>
      </section>

      <section class="card" aria-labelledby="acad-bogle">
        <div class="card-header">
          <div>
            <h2 id="acad-bogle" class="card-title">📖 Core Bogleheads wiki philosophy for European index investors</h2>
            <span class="card-subtitle">Timeless rules established by Vanguard founder John C. Bogle</span>
          </div>
          <span class="badge badge-blue">Bogleheads wiki</span>
        </div>

        <div class="grid-2">
          <article class="panel">
            <h3 class="acad-h">1. The 3-fund European UCITS portfolio</h3>
            <p class="acad-p">Rather than picking hundreds of individual stocks or speculative sector bets, the Boglehead holds the entire world economy through broad-market index funds:</p>
            <ul class="acad-list">
              <li><strong>Core world equity (70–80%):</strong> VWCE or IWDA + EIMI (capturing ~90% of global investable equity).</li>
              <li><strong>Small-cap factor tilt (0–10%):</strong> IUSN or ZPRV (capturing the size/value factor premium).</li>
              <li><strong>Global aggregate bonds (10–20%):</strong> AGGU (EUR hedged, mitigating portfolio drawdowns).</li>
            </ul>
          </article>

          <article class="panel">
            <h3 class="acad-h">2. Total cost: TER + tracking difference (TD)</h3>
            <p class="acad-p">Retail investors often only examine the Total Expense Ratio (TER). However, <strong>tracking difference (TD)</strong> is what you actually pay relative to the benchmark index.</p>
            <p class="acad-p">Irish UCITS ETFs tracking the S&amp;P 500 (such as SXR8 and VUAA) consistently deliver a <strong>negative tracking difference (−0.18%)</strong>: the fund beats its net benchmark by 0.18% annually thanks to the US–Ireland double tax treaty saving 15% on dividend withholding.</p>
          </article>

          <article class="panel">
            <h3 class="acad-h">3. Never attempt to time the market</h3>
            <p class="acad-p">Curvo historical backtest data reveals that between 2003 and 2026, over 70% of the FTSE All-World index's best single-day gains occurred within two weeks of its worst single-day drops. Jumping in and out of cash guarantees buying high and selling low.</p>
          </article>

          <article class="panel">
            <h3 class="acad-h">4. Automate savings plans (Sparpläne)</h3>
            <p class="acad-p">Modern European brokers (Trade Republic, Scalable Capital, ING, flatex) offer €0-commission automated ETF savings plans. Dollar-cost averaging removes human emotion, buys more fund units when prices are depressed, and enforces continuous capital accumulation.</p>
          </article>
        </div>
      </section>

      <section class="card" aria-labelledby="acad-dom">
        <div class="card-header">
          <div>
            <h2 id="acad-dom" class="card-title">🏛️ Domicile deep-dive: why Ireland (IE) is king for non-US retail investors</h2>
            <span class="card-subtitle">Understanding US withholding-tax treaties and the 40% US estate-tax trap</span>
          </div>
          <span class="badge badge-amber">Tax alpha guide</span>
        </div>

        <div class="grid-3">
          <article class="panel domicile-card" style="--tone: var(--accent-emerald)">
            <h3 class="domicile-title">🇮🇪 Ireland domicile (IE)</h3>
            <span class="badge badge-acc mb-3">Gold standard</span>
            <ul class="acad-list">
              <li><strong>US dividend withholding:</strong> reduced from 30% to <strong>15%</strong> under the US–Ireland double taxation treaty.</li>
              <li><strong>Local Irish tax:</strong> 0% withholding on accumulations and redemptions for foreign investors.</li>
              <li><strong>US estate tax:</strong> 100% exempt — non-US residents are fully shielded from IRS probate.</li>
              <li><strong>Flagships:</strong> VWCE, IWDA, SXR8, VUAA, EIMI, AGGU.</li>
            </ul>
          </article>

          <article class="panel domicile-card" style="--tone: var(--accent-cyan)">
            <h3 class="domicile-title">🇱🇺 Luxembourg domicile (LU)</h3>
            <span class="badge badge-blue mb-3">European specialist</span>
            <ul class="acad-list">
              <li><strong>US dividend withholding:</strong> often 30% unless specific sub-fund treaties apply — less efficient than Ireland for US equities.</li>
              <li><strong>European equities &amp; bonds:</strong> highly efficient for STOXX Europe 600 (MEUD) and European corporate bonds.</li>
              <li><strong>US estate tax:</strong> 100% exempt under the UCITS umbrella.</li>
              <li><strong>Flagships:</strong> MEUD, Amundi European suites.</li>
            </ul>
          </article>

          <article class="panel domicile-card" style="--tone: var(--accent-rose)">
            <h3 class="domicile-title">🇺🇸 United States domicile (US)</h3>
            <span class="badge badge-red mb-3">Dangerous for non-US</span>
            <ul class="acad-list">
              <li><strong>US estate-tax trap:</strong> if a non-US citizen dies holding more than $60,000 of US-domiciled assets (e.g. VOO, VTI, QQQ), the IRS levies up to <strong>40% estate tax</strong> on the excess.</li>
              <li><strong>PRIIPs / KID regulation:</strong> US ETFs lack EU KIDs and cannot be legally bought through European retail brokers.</li>
              <li><strong>Verdict:</strong> always buy the Irish UCITS equivalent (VUAA / SXR8 instead of VOO; VWCE instead of VT).</li>
            </ul>
          </article>
        </div>
      </section>`;
  }

  function initCompoundingDragCalculator() {
    const form = document.getElementById("drag-form");
    if (!form) return;
    const update = UI.debounce(calculateDrag, 120);
    form.addEventListener("input", update);
    form.addEventListener("submit", (e) => { e.preventDefault(); calculateDrag(); });
    calculateDrag();
  }

  function calculateDrag() {
    calc.portfolio = num(document.getElementById("drag-portfolio")?.value, 0, 1e9, calc.portfolio);
    calc.yield = num(document.getElementById("drag-yield")?.value, 0, 10, calc.yield);
    calc.tax = num(document.getElementById("drag-tax")?.value, 0, 60, calc.tax);
    calc.years = Math.round(num(document.getElementById("drag-years")?.value, 1, 60, calc.years));

    const yRate = calc.yield / 100;
    const tRate = calc.tax / 100;

    // Scenario A: Accumulating (100% of dividends reinvested gross within NAV)
    const finalAcc = calc.portfolio * Math.pow(1 + GROWTH_RATE, calc.years);

    // Scenario B: Distributing (dividends paid out, taxed annually, remainder reinvested)
    const effectiveDistReturn = (GROWTH_RATE - yRate) + (yRate * (1 - tRate));
    const finalDist = calc.portfolio * Math.pow(1 + effectiveDistReturn, calc.years);

    const lost = finalAcc - finalDist;
    const extraPct = finalDist > 0 ? ((finalAcc / finalDist - 1) * 100) : 0;

    const container = document.getElementById("drag-results-display");
    if (!container) return;
    container.innerHTML = `
      <div class="metric-box tone-emerald"><span class="metric-label">Accumulating (Acc) value</span><span class="metric-value val-positive">${esc(fmt.eur(finalAcc))}</span><span class="metric-sub">Zero annual dividend tax leakage</span></div>
      <div class="metric-box tone-amber"><span class="metric-label">Distributing (Dist) value</span><span class="metric-value accent-amber">${esc(fmt.eur(finalDist))}</span><span class="metric-sub">After ${esc(fmt.num(calc.tax, 2))}% annual dividend tax</span></div>
      <div class="metric-box tone-rose"><span class="metric-label">Lost to tax &amp; friction drag</span><span class="metric-value val-negative">−${esc(fmt.eur(lost))}</span><span class="metric-sub">Acc creates <strong>${esc(fmt.num(extraPct, 1))}%</strong> more wealth over ${esc(calc.years)} years</span></div>`;
  }

  return { init };
})();
