/**
 * Provider Logos & Vector Brand Emblems
 * Inline SVGs for ETF Issuers (Vanguard, iShares, WisdomTree, Amundi, Invesco, SPDR).
 * 100% vector, crisp scaling, zero external asset requests.
 *
 *   getLogoSvg(issuer, size, { label: true })  → badge with the issuer name
 *   getLogoSvg(issuer, size, { label: false }) → icon only (dense tables), still named for AT
 */

window.ProviderLogos = (function () {
  const LOGOS = [
    {
      match: ["vanguard"],
      title: "Vanguard",
      short: "Vanguard",
      body: `<rect width="32" height="32" rx="6" fill="#881337" />
             <path d="M16 6L23 20H9L16 6Z" fill="#FFFFFF" opacity="0.95" />
             <path d="M16 8L10 20H16V8Z" fill="#FDA4AF" />
             <path d="M7 23C11 25 21 25 25 23L24 25C20 27 12 27 8 25L7 23Z" fill="#FFFFFF" />`,
    },
    {
      match: ["ishares", "blackrock"],
      title: "iShares by BlackRock",
      short: "iShares",
      body: `<rect width="32" height="32" rx="6" fill="#111827" stroke="#374151" stroke-width="1" />
             <circle cx="12" cy="11" r="3" fill="#F59E0B" />
             <rect x="10" y="16" width="4" height="10" rx="1.5" fill="#F59E0B" />
             <path d="M17 11L24 25" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />`,
    },
    {
      match: ["wisdomtree"],
      title: "WisdomTree",
      short: "WisdomTree",
      body: `<rect width="32" height="32" rx="6" fill="#064E3B" />
             <path d="M16 7C12.5 7 10 9.5 10 13C10 14 10.3 14.9 10.8 15.6C9.2 16.3 8 18 8 20C8 22.8 10.2 25 13 25H19C21.8 25 24 22.8 24 20C24 18 22.8 16.3 21.2 15.6C21.7 14.9 22 14 22 13C22 9.5 19.5 7 16 7Z" fill="#34D399" />
             <rect x="15" y="19" width="2" height="7" fill="#FCD34D" />`,
    },
    {
      match: ["amundi", "lyxor"],
      title: "Amundi Asset Management",
      short: "Amundi",
      body: `<rect width="32" height="32" rx="6" fill="#0F172A" stroke="#1E293B" stroke-width="1" />
             <path d="M7 19C11 11 21 11 25 19" stroke="#0284C7" stroke-width="3" stroke-linecap="round" fill="none" />
             <path d="M9 23C13 16 19 16 23 23" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" fill="none" />`,
    },
    {
      match: ["invesco"],
      title: "Invesco",
      short: "Invesco",
      body: `<rect width="32" height="32" rx="6" fill="#0C4A6E" />
             <path d="M8 24L16 9L24 24H8Z" fill="#38BDF8" opacity="0.6" />
             <path d="M12 24L16 16L20 24H12Z" fill="#FFFFFF" />`,
    },
    {
      match: ["state street", "spdr"],
      title: "State Street SPDR",
      short: "SPDR",
      body: `<rect width="32" height="32" rx="6" fill="#991B1B" />
             <polygon points="16,7 18.5,13 25,13.5 20,18 21.5,24.5 16,21 10.5,24.5 12,18 7,13.5 13.5,13" fill="#FFFFFF" />`,
    },
    {
      match: ["xtrackers", "dws"],
      title: "Xtrackers by DWS",
      short: "Xtrackers",
      body: `<rect width="32" height="32" rx="6" fill="#032541" />
             <path d="M9 8L15 16L9 24H12.5L16.5 18.5L20.5 24H24L18 16L24 8H20.5L16.5 13.5L12.5 8H9Z" fill="#00D2C4" />`,
    },
    {
      match: ["legal & general", "l&g", "lgim"],
      title: "Legal & General (L&G)",
      short: "L&G",
      body: `<rect width="32" height="32" rx="6" fill="#18181B" />
             <path d="M16 8C10 8 7 13 7 17H25C25 13 22 8 16 8Z" fill="#E11D48" />
             <path d="M10 17C10 13 12.5 9 16 8C19.5 9 22 13 22 17H10Z" fill="#FBBF24" />
             <path d="M13 17C13 13.5 14.5 9.5 16 8C17.5 9.5 19 13.5 19 17H13Z" fill="#10B981" />
             <path d="M16 17V24C16 25 15 25.5 14 25.5C13 25.5 12.5 25 12.5 24" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" fill="none" />`,
    },
  ];

  function getLogoSvg(issuerName, size = 22, { label = true } = {}) {
    const name = String(issuerName || "").toLowerCase();
    const logo = LOGOS.find((l) => l.match.some((m) => name.includes(m)));
    const esc = window.UI ? window.UI.esc : (s) => String(s);

    const title = logo ? logo.title : String(issuerName || "Provider");
    const short = logo ? logo.short : String(issuerName || "Provider");
    const art = logo
      ? logo.body
      : `<rect width="32" height="32" rx="6" fill="#1E293B" />
         <text x="16" y="20" font-size="12" font-weight="bold" fill="#38BDF8" text-anchor="middle">ETF</text>`;

    // With a visible label the SVG is decorative; icon-only mode names the image itself.
    const a11y = label ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${esc(title)}"`;

    return `<span class="provider-logo-badge${label ? "" : " is-icon"}" ${label ? "" : `data-tip="${esc(title)}"`}>
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" ${a11y}>${art}</svg>${
        label ? `<span class="provider-name-label">${esc(short)}</span>` : ""
      }</span>`;
  }

  return { getLogoSvg };
})();
