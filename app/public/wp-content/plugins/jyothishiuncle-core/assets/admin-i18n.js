(function () {
  function activateLang(root, lang) {
    root.querySelectorAll(".nav-tab").forEach(function (tab) {
      tab.classList.toggle("nav-tab-active", tab.getAttribute("data-lang") === lang);
    });
    document.querySelectorAll(".ju-i18n-panel").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-lang") !== lang;
    });
  }

  function activateSection(nav, section) {
    var root = nav.closest(".ju-i18n-panel") || document;
    nav.querySelectorAll(".nav-tab").forEach(function (tab) {
      tab.classList.toggle("nav-tab-active", tab.getAttribute("data-section") === section);
    });
    root.querySelectorAll(".ju-section-panel").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-section") !== section;
    });
  }

  document.querySelectorAll("[data-ju-tabs]").forEach(function (nav) {
    nav.addEventListener("click", function (event) {
      var tab = event.target.closest(".nav-tab");
      if (!tab) return;
      event.preventDefault();
      activateLang(nav, tab.getAttribute("data-lang"));
    });
  });

  document.querySelectorAll("[data-ju-section-tabs]").forEach(function (nav) {
    nav.addEventListener("click", function (event) {
      var tab = event.target.closest(".nav-tab");
      if (!tab) return;
      event.preventDefault();
      activateSection(nav, tab.getAttribute("data-section"));
    });
  });
})();
