/**
 * ETF Comparison Matrix Module
 * Side-by-side comparative analytics for 2 to 5 ETFs simultaneously.
 * Compares live market quotes, TER, tracking difference, AUM, tax domicile,
 * replication, Curvo CAGR, PV risk metrics, top holdings, and official KIDs.
 */

window.ComparisonMatrixModule = (function () {
  let allEtfs = [];
  let etfsByTicker = {};
  let selectedTickers = ["IUSQ", "SXR8", "IMAE", "XEON", "WTAI"]; // Default to user watchlist top picks

  const comparisonPresets = {
    "user-watchlist": {
      name: "⭐ My Watchlist Core & Tilts",
      description: "Side-by-side view of your 5 primary watchlist ETFs",
      tickers: ["IUSQ", "SXR8", "IMAE", "XEON", "WTAI"]
    },
    "all-world-core": {
      name: "🌍 Global Core Shootout",
      description: "VWCE vs IWDA vs IUSQ (MSCI ACWI) vs FWRA (Invesco All-World)",
      tickers: ["VWCE", "IWDA", "IUSQ", "FWRA"]
    },
    "tech-ai": {
      name: "🤖 AI & Tech Showdown",
      description: "S&P 500 Tech (QDVE) vs Pure-Play AI (WTAI) vs AI Infrastructure (AII)",
      tickers: ["QDVE", "WTAI", "AII"]
    },
    "cash-yield": {
      name: "🛡️ Cash & Yield Alternatives",
      description: "Overnight €STR Cash (XEON) vs Global Bonds (AGGU) vs High Dividend (VHYL)",
      tickers: ["XEON", "AGGU", "VHYL"]
    },
    "batteries-resources": {
      name: "⚡ Energy Transition & Materials",
      description: "Battery Value-Chain (BATT) vs Rare Earths (RARE) vs China A-Shares (XCS6)",
      tickers: ["BATT", "RARE", "XCS6"]
    }
  };

  function init(etfs) {
    allEtfs = etfs || [];
    etfsByTicker = {};
    allEtfs.forEach((e) => {
      etfsByTicker[e.ticker.toUpperCase()] = e;
    });

    // Check localStorage for saved comparison list
    const saved = localStorage.getItem("apex_comparison_list");
    if (saved) {
      try {
        const parsed = jsonParseSafe(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          selectedTickers = parsed.filter((t) => etfsByTicker[t]);
        }
      } catch (e) {}
    }

    renderInterface();
    updateCompareBadge();
  }

  function jsonParseSafe(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  function addTicker(ticker) {
    ticker = ticker.toUpperCase();
    if (!etfsByTicker[ticker]) return false;
    if (selectedTickers.includes(ticker)) return false;
    if (selectedTickers.length >= 5) {
      alert("You can compare up to 5 ETFs simultaneously. Please remove one first.");
      return false;
    }
    selectedTickers.push(ticker);
    saveState();
    renderInterface();
    updateCompareBadge();
    return true;
  }

  function removeTicker(ticker) {
    ticker = ticker.toUpperCase();
    selectedTickers = selectedTickers.filter((t) => t !== ticker);
    saveState();
    renderInterface();
    updateCompareBadge();
  }

  function toggleTicker(ticker) {
    ticker = ticker.toUpperCase();
    if (selectedTickers.includes(ticker)) {
      removeTicker(ticker);
      return false;
    } else {
      return addTicker(ticker);
    }
  }

  function isComparing(ticker) {
    return selectedTickers.includes((ticker || "").toUpperCase());
  }

  function saveState() {
    localStorage.setItem("apex_comparison_list", JSON.stringify(selectedTickers));
  }

  function updateCompareBadge() {
    const badge = document.getElementById("compare-count-badge");
    if (badge) {
      badge.innerText = selectedTickers.length;
    }
  }

  function renderInterface() {
    const container = document.getElementById("comparison-matrix-container");
    if (!container) return;

    const comparedEtfs = selectedTickers.map((t) => etfsByTicker[t]).filter(Boolean);

    // Preset buttons HTML
    const presetsHtml = Object.entries(comparisonPresets)
      .map(([key, p]) => `
        <button class="btn btn-secondary btn-sm compare-preset-btn" data-preset="${key}" style="text-align: left; padding: 8px 12px; font-size: 0.78rem;">
          <strong>${p.name}</strong>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${p.description}</div>
        </button>
      `)
      .join("");

    // Selector Dropdown to add more funds
    const availableToAdd = allEtfs.filter((e) => !selectedTickers.includes(e.ticker));
    const addSelectHtml = `
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <select id="compare-add-select" class="filter-select" style="min-width: 220px; font-size: 0.82rem;">
          <option value="">+ Add ETF to Comparison Matrix...</option>
          ${availableToAdd.map((e) => `<option value="${e.ticker}">${e.ticker} - ${e.name.substring(0, 32)}...</option>`).join("")}
        </select>
        <button id="compare-clear-btn" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.3);">
          ✕ Clear All
        </button>
      </div>
    `;

    // Side-by-side Table Columns
    let tableHtml = "";
    if (comparedEtfs.length === 0) {
      tableHtml = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <p style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">No ETFs currently selected for comparison.</p>
          <p style="font-size: 0.88rem; margin-bottom: 18px;">Pick a preset above or add funds from your watchlist or the ETF Screener.</p>
          <button class="btn btn-primary btn-sm compare-preset-btn" data-preset="user-watchlist">
            ⭐ Load My Watchlist Comparison
          </button>
        </div>
      `;
    } else {
      tableHtml = buildComparisonTable(comparedEtfs);
    }

    container.innerHTML = `
      <div class="card" style="margin-bottom: 20px;">
        <div class="card-header" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 class="card-title" style="margin-bottom: 0;">⚖️ Side-by-Side ETF Comparison Matrix</h3>
              <span class="badge badge-acc">Comparing ${comparedEtfs.length} of max 5</span>
            </div>
            <span class="card-subtitle">Comprehensive multi-dimensional evaluation: Live Price, TER, 5Y Tracking Difference, Tax Domicile, Curvo CAGR, and PRIIPs SRI Risk</span>
          </div>
          ${addSelectHtml}
        </div>

        <!-- Comparison Presets Bar -->
        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
            Quick Comparison Blueprints:
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
            ${presetsHtml}
          </div>
        </div>

        <div class="table-responsive" style="margin-top: 14px;">
          ${tableHtml}
        </div>
      </div>
    `;

    bindEvents(container);
  }

  function buildComparisonTable(etfs) {
    const colCount = etfs.length;

    // Helper row builder
    function makeRow(label, tip, valueExtractor, isHeader = false) {
      const tipHtml = tip ? `<span class="info-tip" data-tip="${tip}">?</span>` : "";
      const cells = etfs
        .map((etf, i) => {
          const val = valueExtractor(etf, i);
          return `<td style="vertical-align: middle; text-align: center; border-left: 1px solid var(--border-color);">${val}</td>`;
        })
        .join("");

      return `
        <tr>
          <td style="font-weight: 700; font-size: 0.82rem; background: var(--bg-card); color: var(--text-secondary); width: 220px; white-space: nowrap;">
            ${label} ${tipHtml}
          </td>
          ${cells}
        </tr>
      `;
    }

    // Category divider row
    function makeDivider(title) {
      return `
        <tr style="background: var(--bg-secondary);">
          <td colspan="${colCount + 1}" style="font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-cyan); padding: 8px 12px;">
            ${title}
          </td>
        </tr>
      `;
    }

    let rows = [];

    // Row: Header & Remove Button
    rows.push(
      makeRow("ETF Profile", null, (e) => {
        const logo = window.ProviderLogos?.getLogoSvg(e.issuer, 24) || "";
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 0;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 800; font-size: 1.25rem; color: var(--accent-cyan);">${e.ticker}</span>
              ${logo}
            </div>
            <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary); max-width: 220px; line-height: 1.3;">${e.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">ISIN: <strong>${e.isin}</strong></div>
            <button class="btn btn-secondary btn-sm compare-remove-btn" data-ticker="${e.ticker}" style="margin-top: 6px; font-size: 0.7rem; color: var(--accent-rose); border-color: rgba(244, 63, 94, 0.3);">
              ✕ Remove
            </button>
          </div>
        `;
      })
    );

    // Section 1: Live Market & Execution
    rows.push(makeDivider("1. Live Market Execution & Traded Pricing"));
    rows.push(
      makeRow("Live Traded Price", "Current market quote fetched in real time from Yahoo Finance European exchanges.", (e) => {
        const m = e.liveMarketData;
        if (!m || !m.livePrice) return `<span style="color: var(--text-muted);">Offline Baseline</span>`;
        const chg = m.dayChangePercent || 0;
        const chgClass = chg >= 0 ? "val-positive" : "val-negative";
        const cur = m.currency === "EUR" ? "€" : (m.currency === "USD" ? "$" : m.currency + " ");
        return `
          <div>
            <strong style="font-size: 1.1rem; color: var(--text-primary);">${cur}${m.livePrice}</strong>
            <div class="${chgClass}" style="font-size: 0.76rem; font-weight: 700;">
              ${chg >= 0 ? "+" : ""}${chg}% today
            </div>
          </div>
        `;
      })
    );
    rows.push(
      makeRow("52-Week Range", "Highest and lowest traded prices over the past rolling 52 weeks.", (e) => {
        const m = e.liveMarketData || {};
        if (m.fiftyTwoWeekLow && m.fiftyTwoWeekHigh) {
          return `<strong style="font-size: 0.82rem;">${m.fiftyTwoWeekLow} – ${m.fiftyTwoWeekHigh}</strong>`;
        }
        return `<span>N/A</span>`;
      })
    );
    rows.push(
      makeRow("Primary Trading Exchange", "Official European exchange where the fund shares trade.", (e) => {
        return `<span style="font-size: 0.78rem;">${e.liveMarketData?.exchange || "XETRA (Frankfurt)"}</span>`;
      })
    );

    // Section 2: Costs & Tracking Precision
    rows.push(makeDivider("2. Costs, Tracking Difference & Liquidity"));
    rows.push(
      makeRow("Total Expense Ratio (TER)", "Ongoing annual management fee retained directly from NAV.", (e) => {
        const isLowest = etfs.every((o) => o.ter >= e.ter);
        return `
          <strong style="font-size: 1.05rem; ${isLowest ? "color: var(--accent-emerald);" : ""}">${e.ter.toFixed(2)}%</strong> p.a.
          ${isLowest ? `<div style="font-size: 0.68rem; color: var(--accent-emerald);">★ Lowest in Comparison</div>` : ""}
        `;
      })
    );
    rows.push(
      makeRow("5Y Tracking Diff (TD)", "Average annual outperformance or underperformance relative to the net index. Negative TD indicates fund beats the benchmark net of fees!", (e) => {
        const td = e.trackingDifference5Y;
        const tdClass = td < 0 ? "val-positive" : "";
        return `
          <strong class="${tdClass}" style="font-size: 1.0rem;">${td < 0 ? "" : "+"}${td}%</strong>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${td < 0 ? "Outperforming benchmark!" : "Annual tracking drag"}</div>
        `;
      })
    );
    rows.push(
      makeRow("Fund Size (AUM)", "Assets Under Management. Funds > €100M eliminate closure risk; > €10B provide institutional bid-ask spreads.", (e) => {
        const aumB = (e.aumMillionsEUR / 1000).toFixed(1);
        return `
          <strong style="font-size: 0.95rem;">${aumB}B €</strong>
          <div style="font-size: 0.7rem; color: var(--accent-emerald);">● Institutional Safe</div>
        `;
      })
    );

    // Section 3: Tax Efficiency & Structure
    rows.push(makeDivider("3. Tax Treatment & Fund Architecture"));
    rows.push(
      makeRow("Distribution Policy", "Accumulating (Acc) reinvests dividends directly without taxable events. Distributing pays cash creating annual tax friction.", (e) => {
        return e.isAccumulating
          ? `<span class="badge badge-acc">✨ Accumulating (Acc)</span><div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 3px;">Auto-compound</div>`
          : `<span class="badge badge-dist">Distributing (Dist)</span><div style="font-size: 0.68rem; color: var(--accent-rose); margin-top: 3px;">Taxable dividend payout</div>`;
      })
    );
    rows.push(
      makeRow("Tax Domicile & US WHT", "Ireland domicile offers 15% US withholding tax treaty vs 30% statutory rate, and shields investors from US Estate Tax.", (e) => {
        const isIE = e.domicile === "Ireland";
        return `
          <span class="badge ${isIE ? "badge-acc" : "badge-amber"}">${e.domicile}</span>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 3px;">
            ${isIE ? "15% US Treaty WHT • Shielded from US Estate Tax" : "Standard Treaty Rate"}
          </div>
        `;
      })
    );
    rows.push(
      makeRow("Replication Method", "Physical full replication buys underlying constituents. Synthetic swap uses central counterparty collateral.", (e) => {
        return `<span style="font-size: 0.78rem;">${e.replication || "Physical (Full)"}</span>`;
      })
    );

    // Section 4: Quantitative Performance & Risk
    rows.push(makeDivider("4. Historical Returns & Quant Risk"));
    rows.push(
      makeRow("Curvo Backtest CAGR", "Compound Annual Growth Rate verified from Curvo.eu historical data series.", (e) => {
        return `<strong style="font-size: 1.05rem; color: var(--accent-blue);">${e.historicalStatsCurvo?.cagr || "N/A"}%</strong>`;
      })
    );
    rows.push(
      makeRow("Annualized Volatility (StDev)", "Standard deviation of returns. Lower indicates smoother compounding.", (e) => {
        return `<strong>${e.historicalStatsCurvo?.stdev || "N/A"}%</strong>`;
      })
    );
    rows.push(
      makeRow("Max Drawdown & Recovery", "Deepest peak-to-trough decline during historical market crashes.", (e) => {
        return `
          <span class="val-negative" style="font-weight: 700;">${e.historicalStatsCurvo?.maxDrawdown || "N/A"}%</span>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${e.historicalStatsCurvo?.recoveryPeriod || "N/A"}</div>
        `;
      })
    );
    rows.push(
      makeRow("Sortino Ratio (Downside)", "Downside risk-adjusted return penalizing ONLY losses.", (e) => {
        return `<strong style="color: var(--accent-cyan); font-size: 0.95rem;">${e.quantitativeStatsPV?.sortino || "N/A"}</strong>`;
      })
    );
    rows.push(
      makeRow("Value-at-Risk (95% Monthly VaR)", "Worst expected monthly drawdown at 95% confidence.", (e) => {
        return `<span class="val-negative" style="font-weight: 700;">${e.quantitativeStatsPV?.var95 || "N/A"}%</span>`;
      })
    );

    // Section 5: Top 5 Holdings
    rows.push(makeDivider("5. Top Constituent Holdings"));
    rows.push(
      makeRow("Top 5 Holdings Breakdown", "Top 5 individual stock weights inside the fund.", (e) => {
        const top5 = (e.topHoldings || []).slice(0, 5);
        if (top5.length === 0) {
          return `<div style="font-size: 0.74rem; color: var(--text-muted); font-style: italic;">Sovereign Collateral / Cash Basket</div>`;
        }
        return `
          <div style="text-align: left; font-size: 0.74rem; line-height: 1.4; display: flex; flex-direction: column; gap: 3px;">
            ${top5.map((h) => `<div style="display: flex; justify-content: space-between; gap: 4px;"><span>${h.name.substring(0, 18)}:</span><strong>${h.weight}%</strong></div>`).join("")}
          </div>
        `;
      })
    );

    // Section 6: Active Macro News & Signal Radar
    rows.push(makeDivider("6. Active Macro News & Signal Radar"));
    rows.push(
      makeRow("Active Signal Bias", "Prevailing macroeconomic and regulatory news signal affecting this ETF.", (e) => {
        const relatedNews = (window.DataStore?.getNews() || []).filter(n =>
          (n.relatedEtfs || []).some(r => r.ticker.toUpperCase() === e.ticker.toUpperCase())
        );
        if (relatedNews.length === 0) {
          return `<div style="font-size: 0.74rem; color: var(--text-muted);">Standard Multi-Year Factors</div>`;
        }
        const topNews = relatedNews[0];
        const sig = topNews.signal || {};
        let signalBadgeClass = "badge-amber";
        if (sig.bias.toLowerCase().includes("bullish")) signalBadgeClass = "badge-acc";
        else if (sig.bias.toLowerCase().includes("bearish") || sig.bias.toLowerCase().includes("caution")) signalBadgeClass = "badge-red";

        return `
          <div style="display: flex; flex-direction: column; gap: 4px; align-items: center; text-align: center;">
            <span class="badge ${signalBadgeClass}" style="font-size: 0.75rem; font-weight: 700;">${sig.bias}</span>
            <div style="font-size: 0.72rem; color: var(--text-secondary); line-height: 1.3; max-width: 140px;">
              ${topNews.title.slice(0, 50)}...
            </div>
            <button class="btn btn-secondary btn-sm jump-to-news-btn" data-ticker="${e.ticker}" style="margin-top: 4px; font-size: 0.68rem; padding: 2px 8px; width: 120px;">
              📡 View News (${relatedNews.length})
            </button>
          </div>
        `;
      })
    );

    // Section 7: Official Documents & Direct Actions
    rows.push(makeDivider("7. Statutory Documents & Action"));
    rows.push(
      makeRow("PRIIPs SRI Risk Rating", "Synthetic Risk Indicator from 1 (lowest risk) to 7 (highest risk) published on statutory KID.", (e) => {
        return `
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span class="badge ${e.sriRisk <= 2 ? "badge-acc" : (e.sriRisk >= 5 ? "badge-red" : "badge-blue")}" style="font-size: 0.85rem; font-weight: 800;">
              SRI ${e.sriRisk} / 7
            </span>
          </div>
        `;
      })
    );
    rows.push(
      makeRow("Official Factsheet & KID", "Mandatory official legal documents from issuer website.", (e) => {
        return `
          <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
            <a href="${e.officialDocs?.kidUrl || '#'}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; width: 120px;">
              📑 Official KID
            </a>
            <a href="${e.officialDocs?.factsheetUrl || '#'}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; width: 120px;">
              📊 Factsheet
            </a>
          </div>
        `;
      })
    );
    rows.push(
      makeRow("Portfolio Integration", "Directly add this ETF to your custom portfolio in the Overlap Auditor.", (e) => {
        return `
          <button class="btn btn-primary btn-sm compare-add-portfolio-btn" data-ticker="${e.ticker}" style="font-size: 0.74rem; width: 130px;">
            + Add to Portfolio
          </button>
        `;
      })
    );

    return `
      <table class="data-table" style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    `;
  }

  function bindEvents(container) {
    // Add dropdown change
    const addSelect = container.querySelector("#compare-add-select");
    if (addSelect) {
      addSelect.addEventListener("change", (e) => {
        const t = e.target.value;
        if (t) {
          addTicker(t);
        }
      });
    }

    // Clear all
    const clearBtn = container.querySelector("#compare-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        selectedTickers = [];
        saveState();
        renderInterface();
        updateCompareBadge();
      });
    }

    // Remove buttons
    container.querySelectorAll(".compare-remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        removeTicker(btn.dataset.ticker);
      });
    });

    // Preset buttons
    container.querySelectorAll(".compare-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.preset;
        const p = comparisonPresets[key];
        if (p) {
          selectedTickers = [...p.tickers];
          saveState();
          renderInterface();
          updateCompareBadge();
        }
      });
    });

    // Add to Portfolio buttons
    container.querySelectorAll(".compare-add-portfolio-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ticker = btn.dataset.ticker;
        if (window.OverlapModule) {
          window.OverlapModule.addEtfToPortfolio(ticker, 20);
          window.App?.switchTab("overlap");
        }
      });
    });

    // Jump to News buttons
    container.querySelectorAll(".jump-to-news-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const ticker = e.currentTarget.dataset.ticker;
        window.App?.switchTab("news");
        window.NewsSignalsModule?.filterByEtf(ticker);
      });
    });
  }

  return {
    init,
    addTicker,
    removeTicker,
    toggleTicker,
    isComparing,
    getSelectedTickers: () => [...selectedTickers],
    renderInterface
  };
})();
