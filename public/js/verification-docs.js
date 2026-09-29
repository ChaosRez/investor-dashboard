/**
 * Issuer Document Verification Directory
 * Final Verification Hub: Direct links to official KIDs, Factsheets, and Annual Reports.
 * Ensures retail investors verify statutory PRIIPs documents before capital deployment.
 */

window.VerificationDocsModule = (function () {
  let allEtfs = [];

  function init(etfs) {
    allEtfs = etfs || [];
    renderDirectory();
  }

  function renderDirectory() {
    const container = document.getElementById("verification-docs-container");
    if (!container) return;

    const rowsHtml = allEtfs.map(etf => {
      const docs = etf.officialDocs || {};
      const sri = etf.sriRisk || 4;
      const providerLogo = window.ProviderLogos?.getLogoSvg(etf.issuer, 20) || "";

      let sriColor = "badge-blue";
      if (sri <= 2) sriColor = "badge-acc";
      else if (sri >= 5) sriColor = "badge-red";

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <strong style="font-size: 1.05rem; color: var(--accent-cyan);">${etf.ticker}</strong>
              ${providerLogo}
              <span class="badge ${etf.isAccumulating ? "badge-acc" : "badge-dist"}">${etf.distributionPolicy}</span>
            </div>
            <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary); margin-top: 2px;">${etf.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">
              Domicile: <strong>${etf.domicile}</strong>
            </div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <code style="background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; font-weight: 700; border: 1px solid var(--border-color);">${etf.isin}</code>
              <button class="btn btn-secondary btn-sm copy-isin-btn" data-isin="${etf.isin}" title="Copy ISIN to clipboard" style="padding: 2px 6px; font-size: 0.7rem;">📋</button>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">WKN: ${etf.wkn}</div>
          </td>
          <td>
            <span class="badge ${sriColor}">Risk ${sri}/7</span>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
              ${sri <= 2 ? "Conservative (Bonds)" : (sri === 4 ? "Moderate (Broad Equity)" : "Aggressive (Sector/Tech)")}
            </div>
          </td>
          <td>
            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.3;">
              ${etf.replication}
              <div style="font-size: 0.72rem; color: var(--text-muted);">${etf.securitiesLendingRevenueShare || "Standard Lending"}</div>
            </div>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <a href="${docs.kidUrl}" target="_blank" class="btn btn-primary btn-sm" style="margin-right: 6px;">
              📄 Official KID (PDF)
            </a>
            <a href="${docs.factsheetUrl}" target="_blank" class="btn btn-secondary btn-sm">
              📊 Factsheet (PDF)
            </a>
          </td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">📑 Official Issuer Documents & Final Verification Hub</h3>
            <span class="card-subtitle">Direct links to official PRIIPs Key Information Documents (KIDs) and monthly Factsheets</span>
          </div>
          <span class="badge badge-acc">Statutory Regulatory Data</span>
        </div>

        <div style="background: var(--bg-secondary); padding: 14px 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 20px; font-size: 0.85rem; line-height: 1.5;">
          ℹ️ <strong>Retail Verification Mandate:</strong> Third-party screeners may experience data latency. Before making an investment, retail investors should always consult the official <strong>Key Information Document (KID)</strong> provided directly by Vanguard, BlackRock, or Amundi to verify the PRIIPs summary risk indicator (SRI), recommended holding period, ongoing charges, and synthetic risk category.
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ETF & Issuer</th>
                <th>Identifiers (ISIN / WKN)</th>
                <th>PRIIPs SRI Risk</th>
                <th>Replication & Lending</th>
                <th style="text-align: right;">Official Documents</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind clipboard copy buttons
    container.querySelectorAll(".copy-isin-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const isin = e.currentTarget.dataset.isin;
        navigator.clipboard.writeText(isin).then(() => {
          btn.innerHTML = "✅";
          setTimeout(() => { btn.innerHTML = "📋"; }, 1500);
        });
      });
    });
  }

  return {
    init
  };
})();
