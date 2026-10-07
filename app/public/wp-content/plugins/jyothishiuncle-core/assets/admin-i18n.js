(function () {
  function activate(root, lang) {
    root.querySelectorAll(".nav-tab").forEach(function (tab) {
      tab.classList.toggle("nav-tab-active", tab.getAttribute("data-lang") === lang);
    });
    document.querySelectorAll(".ju-i18n-panel").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-lang") !== lang;
    });
  }

  document.querySelectorAll("[data-ju-tabs]").forEach(function (nav) {
    nav.addEventListener("click", function (event) {
      var tab = event.target.closest(".nav-tab");
      if (!tab) return;
      event.preventDefault();
      activate(nav, tab.getAttribute("data-lang"));
    });
  });
})();
