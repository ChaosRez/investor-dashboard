/**
 * Provider Logos & Vector Brand Emblems
 * Inline SVGs for ETF Issuers (Vanguard, iShares, WisdomTree, Amundi, Invesco, SPDR).
 * 100% vector, crisp scaling, zero external asset requests.
 */

window.ProviderLogos = (function () {
  function getLogoSvg(issuerName, size = 22) {
    const name = (issuerName || "").toLowerCase();

    if (name.includes("vanguard")) {
      return `
        <span class="provider-logo-badge" title="Vanguard">
          <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#881337" />
            <!-- Ship sails emblem -->
            <path d="M16 6L23 20H9L16 6Z" fill="#FFFFFF" opacity="0.95" />
            <path d="M16 8L10 20H16V8Z" fill="#FDA4AF" />
            <path d="M7 23C11 25 21 25 25 23L24 25C20 27 12 27 8 25L7 23Z" fill="#FFFFFF" />
          </svg>
          <span class="provider-name-label">Vanguard</span>
        </span>
      `;
    } else if (name.includes("ishares") || name.includes("blackrock")) {
      return `
        <span class="provider-logo-badge" title="iShares by BlackRock">
          <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#111827" stroke="#374151" stroke-width="1" />
            <!-- iShares iconic orange/yellow dot & slash -->
            <circle cx="12" cy="11" r="3" fill="#F59E0B" />
            <rect x="10" y="16" width="4" height="10" rx="1.5" fill="#F59E0B" />
            <path d="M17 11L24 25" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
          </svg>
          <span class="provider-name-label">iShares</span>
        </span>
      `;
    } else if (name.includes("wisdomtree")) {
      return `
        <span class="provider-logo-badge" title="WisdomTree">
          <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#064E3B" />
            <!-- Tree canopy vector -->
            <path d="M16 7C12.5 7 10 9.5 10 13C10 14 10.3 14.9 10.8 15.6C9.2 16.3 8 18 8 20C8 22.8 10.2 25 13 25H19C21.8 25 24 22.8 24 20C24 18 22.8 16.3 21.2 15.6C21.7 14.9 22 14 22 13C22 9.5 19.5 7 16 7Z" fill="#34D399" />
            <rect x="15" y="19" width="2" height="7" fill="#FCD34D" />
          </svg>
          <span class="provider-name-label">WisdomTree</span>
        </span>
      `;
    } else if (name.includes("amundi") || name.includes("lyxor")) {
      return `
        <span class="provider-logo-badge" title="Amundi Asset Management">
          <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#0F172A" stroke="#1E293B" stroke-width="1" />
            <!-- Dual curved waves -->
            <path d="M7 19C11 11 21 11 25 19" stroke="#0284C7" stroke-width="3" stroke-linecap="round" />
            <path d="M9 23C13 16 19 16 23 23" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" />
          </svg>
          <span class="provider-name-label">Amundi</span>
        </span>
      `;
    } else if (name.includes("invesco")) {
      return `
        <span class="provider-logo-badge" title="Invesco">
          <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#0C4A6E" />
            <!-- Invesco mountain peaks -->
            <path d="M8 24L16 9L24 24H8Z" fill="#38BDF8" opacity="0.6" />
            <path d="M12 24L16 16L20 24H12Z" fill="#FFFFFF" />
          </svg>
          <span class="provider-name-label">Invesco</span>
        </span>
      `;
    } else if (name.includes("state street") || name.includes("spdr")) {
      return `
        <span class="provider-logo-badge" title="State Street SPDR">
          <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#991B1B" />
            <!-- Star emblem -->
            <polygon points="16,7 18.5,13 25,13.5 20,18 21.5,24.5 16,21 10.5,24.5 12,18 7,13.5 13.5,13" fill="#FFFFFF" />
          </svg>
          <span class="provider-name-label">SPDR</span>
        </span>
      `;
    }

    // Generic fallback provider badge
    return `
      <span class="provider-logo-badge">
        <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="#1E293B" />
          <text x="16" y="20" font-size="12" font-weight="bold" fill="#38BDF8" text-anchor="middle">ETF</text>
        </svg>
        <span class="provider-name-label">${issuerName || "Provider"}</span>
      </span>
    `;
  }

  return {
    getLogoSvg
  };
})();
