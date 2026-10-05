/**
 * Issuer Document Verification Directory
 * Final Verification Hub: Direct links to official KIDs, Factsheets, and Annual Reports.
 * Ensures retail investors verify statutory PRIIPs documents before capital deployment.
 *
 * Data honesty: a missing SRI, replication method or lending policy is shown as "—",
 * never replaced by a plausible default.
 */

window.VerificationDocsModule = (function () {
  const { esc, icon } = UI;

  let allEtfs = [];
  let bound = false;

  /** PRIIPs summary risk indicator: 1 (lowest) … 7 (highest). */
  function sriInfo(sri) {
    const n = Number(sri);
    if (!Number.isFinite(n)) return { tone: "neutral", text: "Not published" };
    if (n <= 2) return { tone: "acc", text: "Low (cash & bonds)" };
    if (n === 3) return { tone: "blue", text: "Low to moderate" };
    if (n === 4) return { tone: "blue", text: "Moderate (broad equity)" };
    if (n === 5) return { tone: "red", text: "Elevated" };
    return { tone: "red", text: "High (concentrated / sector)" };
  }

  function init(etfs) {
    allEtfs = etfs || [];
    renderDirectory();
    bindOnce();
  }

  function bindOnce() {
    if (bound) return;
    bound = true;
    document.getElementById("verification-docs-container").addEventListener("click", async (e) => {
      const btn = e.target.closest(".copy-isin-btn");
      if (!btn) return;
      const ok = await UI.copy(btn.dataset.isin);
      UI.toast(ok ? `Copied ${btn.dataset.isin}` : "Couldn't copy — select the ISIN and copy it manually.", { type: ok ? "success" : "error", timeout: 2200 });
      if (ok) {
        btn.innerHTML = icon("check");
        setTimeout(() => { btn.innerHTML = icon("copy"); }, 1500);
      }
    });
  }

  function docButton(url, label, cls) {
    return url
      ? UI.link(url, `${icon("file-text")} ${label}`, { cls: `btn btn-sm ${cls}`, html: true })
      : `<span class="btn btn-sm btn-secondary" aria-disabled="true">${label} unavailable</span>`;
  }

  function renderDirectory() {
    const container = document.getElementById("verification-docs-container");
    if (!container) return;

    const rowsHtml = allEtfs
      .map((etf) => {
        const docs = etf.officialDocs || {};
        const sri = sriInfo(etf.sriRisk);
        return `
          <tr>
            <th scope="row" class="cell-etf">
              <div class="etf-id">
                <span class="ticker etf-ticker">${esc(etf.ticker)}</span>
                ${window.ProviderLogos?.getLogoSvg(etf.issuer, 20, { label: false }) || ""}
              </div>
              <div class="etf-name">${esc(etf.name)}</div>
              <div class="etf-meta"><span class="badge ${etf.isAccumulating ? "badge-acc" : "badge-dist"} badge-sm">${etf.isAccumulating ? "Acc" : "Dist"}</span><span class="badge badge-neutral badge-sm" data-tip="${esc(etf.domicile)}">${esc(({ Ireland: "IE", Luxembourg: "LU", Germany: "DE" })[etf.domicile] || etf.domicile || "—")}</span></div>
            </th>

            <td data-label="ISIN / WKN"><div class="cell-value">
              <div class="isin-line"><code>${esc(etf.isin)}</code>
                <button type="button" class="btn btn-secondary btn-sm btn-icon copy-isin-btn" data-isin="${esc(etf.isin)}" aria-label="Copy ISIN ${esc(etf.isin)}" data-tip="Copy ISIN">${icon("copy")}</button></div>
              <div class="text-muted text-xs">WKN ${esc(etf.wkn || "—")}</div>
            </div></td>

            <td data-label="PRIIPs SRI"><div class="cell-value">
              ${Number.isFinite(Number(etf.sriRisk)) ? `<span class="badge badge-${sri.tone}">Risk ${esc(etf.sriRisk)}/7</span>` : `<span class="text-muted">—</span>`}
              <div class="text-muted text-xs">${esc(sri.text)}</div>
            </div></td>

            <td data-label="Replication"><div class="cell-value cell-wrap">
              <div class="text-sm">${esc(etf.replication || "—")}${etf.securitiesLendingRevenueShare ? ` <span class="info-tip" data-tip="${esc(`Securities lending: ${etf.securitiesLendingRevenueShare}`)}">?</span>` : ""}</div>
            </div></td>

            <td class="cell-actions">
              ${docButton(docs.kidUrl, "Official KID", "btn-primary")}
              ${docButton(docs.factsheetUrl, "Factsheet", "btn-secondary")}
            </td>
          </tr>`;
      })
      .join("");

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">${icon("file-text")} Official issuer documents &amp; final verification hub</h2>
            <span class="card-subtitle">Direct links to official PRIIPs Key Information Documents (KIDs) and monthly factsheets</span>
          </div>
          <span class="badge badge-acc">Statutory regulatory data</span>
        </div>

        <div class="callout callout-info mb-4">
          ${icon("info")}
          <div>Screeners can lag: before buying, read the issuer's <strong>Key Information Document (KID)</strong> for the risk indicator, costs and recommended holding period.</div>
        </div>

        <div class="etf-table-wrap">
          <table class="etf-table docs-table">
            <caption class="sr-only">Official documents and identifiers for every tracked ETF</caption>
            <thead>
              <tr>
                <th scope="col">ETF &amp; issuer</th>
                <th scope="col">Identifiers (ISIN / WKN)</th>
                <th scope="col">PRIIPs SRI risk</th>
                <th scope="col">Replication &amp; lending</th>
                <th scope="col"><span class="sr-only">Official documents</span></th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>`;
  }

  return { init };
})();
