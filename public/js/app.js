/**
 * Application Controller
 * Handles global state, data loading, theme switching, tab navigation, and modal management.
 * Designed with guaranteed fallback to window.APEX_DATA_STORE for immediate execution.
 */

window.App = (function () {
  let etfsData = [];
  let correlationsData = null;
  let newsData = [];
  let educationData = null;

  async function start() {
    initTheme();
    bindNavigation();
    bindModal();
    bindOnboarding();
    bindLiveSync();
    await loadInitialData();
    switchTab("screener");
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("etf_dashboard_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      updateThemeButton(savedTheme);
      toggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("etf_dashboard_theme", newTheme);
        updateThemeButton(newTheme);
      });
    }
  }

  function updateThemeButton(theme) {
    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) return;
    toggleBtn.innerHTML = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  }

  function bindNavigation() {
    const tabs = document.querySelectorAll(".nav-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetTab = tab.dataset.tab;
        switchTab(targetTab);
      });
    });
  }

  function switchTab(targetTab) {
    document.querySelectorAll(".nav-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === targetTab);
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${targetTab}`);
    });

    if (targetTab === "comparison" && window.ComparisonMatrixModule) {
      window.ComparisonMatrixModule.renderInterface();
    }

    // Synchronize active stage card in the roadmap navigator
    document.querySelectorAll(".stage-step-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.stage === targetTab);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindOnboarding() {
    const onboardingModal = document.getElementById("onboarding-modal");
    const openBtn = document.getElementById("open-onboarding-btn");
    const guideTourLink = document.getElementById("guide-tour-link");
    const closeBtn = document.getElementById("onboarding-close");

    function openModal() {
      if (onboardingModal) onboardingModal.classList.add("active");
    }

    function closeModal() {
      if (onboardingModal) onboardingModal.classList.remove("active");
    }

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (guideTourLink) guideTourLink.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    if (onboardingModal) {
      onboardingModal.addEventListener("click", (e) => {
        if (e.target === onboardingModal) closeModal();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && onboardingModal.classList.contains("active")) {
          closeModal();
        }
      });
    }

    // Stage navigator cards click to switch tabs
    document.querySelectorAll(".stage-step-card").forEach((card) => {
      card.addEventListener("click", () => {
        const stage = card.dataset.stage;
        if (stage) switchTab(stage);
      });
    });

    // Jump buttons inside onboarding modal
    document.querySelectorAll(".jump-stage-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        if (target) {
          switchTab(target);
          closeModal();
        }
      });
    });
  }

  function bindLiveSync() {
    const syncBtn = document.getElementById("sync-live-data-btn");
    const syncBtnText = document.getElementById("sync-btn-text");
    if (!syncBtn) return;

    syncBtn.addEventListener("click", async () => {
      syncBtn.disabled = true;
      if (syncBtnText) syncBtnText.innerText = "⏳ Syncing Feeds...";

      try {
        const res = await fetch("/api/sync", { method: "POST" });
        if (res.ok) {
          await loadInitialData();
          if (syncBtnText) syncBtnText.innerText = "✅ Live Synced!";
        } else {
          if (syncBtnText) syncBtnText.innerText = "⚠️ Offline Mode";
        }
      } catch (err) {
        if (syncBtnText) syncBtnText.innerText = "⚠️ Offline Mode";
      }

      setTimeout(() => {
        syncBtn.disabled = false;
        if (syncBtnText) syncBtnText.innerText = "🔄 Live Sync";
      }, 2500);
    });
  }

  function bindModal() {
    const modal = document.getElementById("detail-modal");
    const closeBtn = document.getElementById("modal-close");

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
          modal.classList.remove("active");
        }
      });
    }
  }

  async function loadInitialData() {
    // 1. Initialise with APEX_DATA_STORE if present
    if (window.APEX_DATA_STORE) {
      etfsData = window.APEX_DATA_STORE.etfs || [];
      correlationsData = window.APEX_DATA_STORE.correlations || null;
      newsData = window.APEX_DATA_STORE.news || [];
      educationData = window.APEX_DATA_STORE.education || null;
    }

    // 2. Fetch live from server endpoints if reachable
    try {
      const [etfsRes, corrRes, newsRes, eduRes] = await Promise.all([
        fetch("/api/etfs"),
        fetch("/api/correlations"),
        fetch("/api/news"),
        fetch("/api/education")
      ]);

      if (etfsRes.ok) etfsData = await etfsRes.json();
      if (corrRes.ok) correlationsData = await corrRes.json();
      if (newsRes.ok) newsData = await newsRes.json();
      if (eduRes.ok) educationData = await eduRes.json();
    } catch (err) {
      // Offline or local file mode: gracefully use in-memory store
    }

    updateHeaderStats();

    // Initialize all modular components
    window.ScreenerModule?.init(etfsData);
    window.ComparisonMatrixModule?.init(etfsData);
    window.OverlapModule?.init(etfsData, correlationsData);
    window.CurvoModule?.init(etfsData);
    window.PortfolioVisualizerModule?.init(etfsData);
    window.NewsSignalsModule?.init(newsData);
    window.VerificationDocsModule?.init(etfsData);
    window.BogleheadsAcademyModule?.init(educationData);
  }

  function updateHeaderStats() {
    const totalAum = etfsData.reduce((acc, e) => acc + (e.aumMillionsEUR || 0), 0);
    const accCount = etfsData.filter((e) => e.isAccumulating).length;
    const aumEl = document.getElementById("stat-total-aum");

    if (aumEl) aumEl.innerText = `${(totalAum / 1000).toFixed(0)}B €`;
  }

  return {
    start,
    switchTab,
    getEtfs: () => [...etfsData],
    getNews: () => [...newsData],
    getEtfByTicker: (ticker) => etfsData.find(e => e.ticker.toUpperCase() === (ticker || "").toUpperCase())
  };
})();

// Global DataStore access helper for standalone and modular access
window.DataStore = {
  getEtfs: () => window.App?.getEtfs() || window.APEX_DATA_STORE?.etfs || [],
  getNews: () => window.App?.getNews() || window.APEX_DATA_STORE?.news || [],
  getEtfByTicker: (ticker) => (window.App?.getEtfs() || window.APEX_DATA_STORE?.etfs || []).find(e => e.ticker.toUpperCase() === (ticker || "").toUpperCase())
};

document.addEventListener("DOMContentLoaded", () => {
  window.App.start();
});
