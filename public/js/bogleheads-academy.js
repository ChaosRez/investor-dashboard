/**
 * Investment Education Academy
 * Based on Bogleheads Wiki and Morningstar frameworks.
 * Explains tax domicile, accumulating vs distributing math, and retail investing discipline.
 */

window.BogleheadsAcademyModule = (function () {
  let educationData = null;

  function init(education) {
    educationData = education;
    renderAcademy();
    initCompoundingDragCalculator();
  }

  function renderAcademy() {
    const container = document.getElementById("education-academy-container");
    if (!container) return;

    container.innerHTML = `
      <!-- Compounding Drag Simulator Card -->
      <div class="card" style="border-left: 5px solid var(--accent-emerald);">
        <div class="card-header">
          <div>
            <h3 class="card-title">✨ Accumulating (Acc) vs Distributing (Dist): The Compounding Drag Calculator</h3>
            <span class="card-subtitle">Mathematically proving why Accumulating ETFs are mathematically superior for retail wealth building</span>
          </div>
          <span class="badge badge-acc">Bogleheads Principle</span>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
          When an ETF distributes dividends, you suffer from three major frictions: (1) <strong>Immediate taxation</strong> at your country's dividend tax rate (e.g., 26.375% in Germany, 30% in Belgium, 26% in Italy), (2) <strong>Cash drag</strong> while money sits in your broker account uninvested, and (3) <strong>Broker transaction commissions</strong> to manually buy new shares. <strong>Accumulating ETFs automatically reinvest 100% of the dividend into the fund NAV with zero friction.</strong>
        </p>

        <!-- Calculator Controls -->
        <div class="grid-4" style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 20px;">
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Starting Portfolio (€)</label>
            <input type="number" id="drag-portfolio" class="filter-input" style="width: 100%; margin-top: 4px;" value="50000" min="5000" step="5000" />
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Dividend Yield (%)</label>
            <input type="number" id="drag-yield" class="filter-input" style="width: 100%; margin-top: 4px;" value="2.0" min="0.5" max="6.0" step="0.1" />
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Local Dividend Tax Rate (%)</label>
            <input type="number" id="drag-tax" class="filter-input" style="width: 100%; margin-top: 4px;" value="26.375" min="0" max="45" step="any" />
          </div>
          <div>
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Time Horizon (Years)</label>
            <input type="number" id="drag-years" class="filter-input" style="width: 100%; margin-top: 4px;" value="25" min="5" max="40" />
          </div>
        </div>

        <!-- Real-time Comparison Results -->
        <div id="drag-results-display" class="grid-3" style="margin-bottom: 14px;">
          <!-- Injected via JavaScript -->
        </div>
      </div>

      <!-- Bogleheads Core Principles -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">📖 Core Bogleheads Wiki Philosophy for European Index Investors</h3>
            <span class="card-subtitle">Timeless rules established by Vanguard founder John C. Bogle</span>
          </div>
          <span class="badge badge-blue">Bogleheads Wiki</span>
        </div>

        <div class="grid-2">
          <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">1. The 3-Fund European UCITS Portfolio</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
              Rather than picking hundreds of individual stocks or speculative sector bets, the Boglehead holds the entire world economy through broad-market index funds:
            </p>
            <ul style="font-size: 0.82rem; color: var(--text-secondary); margin-left: 18px; margin-top: 8px; line-height: 1.6;">
              <li><strong>Core World Equity (70–80%):</strong> VWCE or IWDA + EIMI (capturing ~90% of global investable equity).</li>
              <li><strong>Small Cap Factor Tilt (0–10%):</strong> IUSN or ZPRV (capturing the size/value factor premium).</li>
              <li><strong>Global Aggregate Bonds (10–20%):</strong> AGGU (EUR Hedged, mitigating portfolio drawdowns).</li>
            </ul>
          </div>

          <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">2. Total Cost: TER + Tracking Difference (TD)</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
              Retail investors often only examine the Total Expense Ratio (TER). However, <strong>Tracking Difference (TD)</strong> is what you actually pay relative to the benchmark index!
            </p>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin-top: 6px;">
              Irish UCITS ETFs tracking the S&P 500 (such as SXR8 and VUAA) consistently deliver a <strong>negative tracking difference (-0.18%)</strong>. This means the fund beats its net benchmark by 0.18% annually due to the US-Ireland double tax treaty saving 15% on dividend withholding.
            </p>
          </div>

          <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">3. Never Attempt to Time the Market</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
              Curvo historical backtest data reveals that between 2003 and 2026, over 70% of the FTSE All-World index's best single-day gains occurred within two weeks of its worst single-day drops. Trying to jump in and out of cash guarantees buying high and selling low.
            </p>
          </div>

          <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">4. Automate Savings Plans (Sparpläne)</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
              Modern European brokers (Trade Republic, Scalable Capital, ING, flatex) offer €0 commission automated ETF savings plans. Dollar-cost averaging (DCA) removes human emotion, buys more fund units when prices are depressed, and enforces continuous capital accumulation.
            </p>
          </div>
        </div>
      </div>

      <!-- Domicile Guide (Ireland vs Lux vs US) -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">🏛️ Domicile Deep-Dive: Why Ireland (IE) is King for Non-US Retail Investors</h3>
            <span class="card-subtitle">Understanding US Withholding Tax Treaties and the 40% US Estate Tax Trap</span>
          </div>
          <span class="badge badge-amber">Tax Alpha Guide</span>
        </div>

        <div class="grid-3">
          <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); border-top: 4px solid var(--accent-emerald);">
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--accent-emerald);">🇮🇪 Ireland Domicile (IE)</h4>
            <span class="badge badge-acc" style="margin-top: 4px; margin-bottom: 8px;">Gold Standard</span>
            <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; margin-left: 18px;">
              <li><strong>US Dividend Withholding:</strong> Reduced from 30% to <strong>15%</strong> under the US-Ireland Double Taxation Treaty.</li>
              <li><strong>Local Irish Tax:</strong> 0% withholding tax on accumulations and redemptions for foreign investors.</li>
              <li><strong>US Estate Tax:</strong> 100% exempt. Non-US residents are fully shielded from IRS probate.</li>
              <li><strong>Flagships:</strong> VWCE, IWDA, SXR8, VUAA, EIMI, AGGU.</li>
            </ul>
          </div>

          <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); border-top: 4px solid var(--accent-cyan);">
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--accent-cyan);">🇱🇺 Luxembourg Domicile (LU)</h4>
            <span class="badge badge-blue" style="margin-top: 4px; margin-bottom: 8px;">European Specialist</span>
            <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; margin-left: 18px;">
              <li><strong>US Dividend Withholding:</strong> In many cases 30% (unless specific sub-fund treaties apply). Less efficient than Ireland for US equities.</li>
              <li><strong>European Equities & Bonds:</strong> Highly efficient for STOXX Europe 600 (MEUD) and European corporate bonds.</li>
              <li><strong>US Estate Tax:</strong> 100% exempt under UCITS umbrella.</li>
              <li><strong>Flagships:</strong> MEUD, Amundi European suites.</li>
            </ul>
          </div>

          <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); border-top: 4px solid var(--accent-rose);">
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--accent-rose);">🇺🇸 United States Domicile (US)</h4>
            <span class="badge badge-red" style="margin-top: 4px; margin-bottom: 8px;">Dangerous for Non-US</span>
            <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; margin-left: 18px;">
              <li><strong>US Estate Tax Trap:</strong> If a non-US citizen dies holding >$60,000 in US-domiciled assets (e.g. VOO, VTI, QQQ), the IRS levies up to <strong>40% estate tax</strong> on the excess!</li>
              <li><strong>PRIIPs / KID Regulation:</strong> US ETFs lack EU KIDs and cannot be legally bought by European retail brokers.</li>
              <li><strong>Verdict:</strong> Always purchase Irish UCITS equivalents (VUAA / SXR8 instead of VOO; VWCE instead of VT).</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function initCompoundingDragCalculator() {
    const inputs = ["drag-portfolio", "drag-yield", "drag-tax", "drag-years"];
    inputs.forEach(id => {
      document.getElementById(id)?.addEventListener("input", calculateDrag);
    });
    calculateDrag();
  }

  function calculateDrag() {
    const p = parseFloat(document.getElementById("drag-portfolio")?.value || 50000);
    const yRate = parseFloat(document.getElementById("drag-yield")?.value || 2.0) / 100.0;
    const tRate = parseFloat(document.getElementById("drag-tax")?.value || 26.375) / 100.0;
    const years = parseInt(document.getElementById("drag-years")?.value || 25);
    const growthRate = 0.07; // 7% base total return

    const formatCur = (num) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(num);

    // Scenario A: Accumulating (100% of dividends reinvested gross within NAV)
    const finalAcc = p * Math.pow(1 + growthRate, years);

    // Scenario B: Distributing (dividends paid out, taxed annually, and remainder reinvested)
    const effectiveDistReturn = (growthRate - yRate) + (yRate * (1 - tRate));
    const finalDist = p * Math.pow(1 + effectiveDistReturn, years);

    const lostWealth = finalAcc - finalDist;
    const dragPercentage = ((lostWealth / finalAcc) * 100).toFixed(1);

    const container = document.getElementById("drag-results-display");
    if (!container) return;

    container.innerHTML = `
      <div class="metric-box" style="border-color: var(--accent-emerald);">
        <span class="metric-label">✨ Accumulating (Acc) Value</span>
        <span class="metric-value val-positive">${formatCur(finalAcc)}</span>
        <span class="metric-sub">Zero annual dividend tax leakage</span>
      </div>

      <div class="metric-box" style="border-color: var(--accent-amber);">
        <span class="metric-label">Distributing (Dist) Value</span>
        <span class="metric-value" style="color: var(--accent-amber);">${formatCur(finalDist)}</span>
        <span class="metric-sub">Subject to ${ (tRate * 100).toFixed(2) }% annual dividend tax</span>
      </div>

      <div class="metric-box" style="border-color: var(--accent-rose);">
        <span class="metric-label">Lost to Tax & Friction Drag</span>
        <span class="metric-value val-negative">-${formatCur(lostWealth)}</span>
        <span class="metric-sub">Acc creates <strong>+${dragPercentage}%</strong> more wealth over ${years} years!</span>
      </div>
    `;
  }

  return {
    init
  };
})();
