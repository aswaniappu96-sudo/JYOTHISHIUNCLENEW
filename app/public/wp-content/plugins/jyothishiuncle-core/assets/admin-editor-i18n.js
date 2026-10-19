(function () {
  var data = window.JU_EDITOR_I18N || {};
  var locales = Array.isArray(data.locales) ? data.locales : [];
  if (!locales.length) return;

  function norm(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function tabButtons() {
    return Array.prototype.slice.call(
      document.querySelectorAll(".acf-tab-wrap .acf-tab-button, .acf-tab-group li a, .acf-tab-button")
    );
  }

  function clickTab(lang) {
    var wanted = "";
    locales.forEach(function (locale) {
      if (locale.id === lang) wanted = norm(locale.native || locale.id);
    });
    if (lang === "en") wanted = wanted || "english";

    var tabs = tabButtons();
    var match = null;
    tabs.forEach(function (tab) {
      var label = norm(tab.textContent);
      if (!match && (label === wanted || label.indexOf(wanted) !== -1 || (lang === "en" && label.indexOf("english") !== -1))) {
        match = tab;
      }
    });
    if (match) match.click();
  }

  function setActive(bar, lang) {
    bar.querySelectorAll("[data-lang]").forEach(function (btn) {
      var on = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("button-primary", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    clickTab(lang);
    if (lang === "en") {
      var title = document.getElementById("title") || document.querySelector(".editor-post-title__input");
      if (title && typeof title.focus === "function") title.focus();
      return;
    }
    var translations = null;
    document.querySelectorAll(".acf-postbox h2, .postbox h2, .hndle, .acf-fields").forEach(function (heading) {
      if (/language|translation|headings/i.test(heading.textContent || "")) {
        translations = heading.closest(".acf-postbox, .postbox, .acf-fields") || heading;
      }
    });
    if (translations && translations.scrollIntoView) {
      translations.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function buildBar() {
    var bar = document.createElement("div");
    bar.className = "ju-lang-bar";
    var label = document.createElement("span");
    label.className = "ju-lang-bar-label";
    label.textContent = "Edit language";
    bar.appendChild(label);

    locales.forEach(function (locale, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "button" + (index === 0 ? " button-primary" : "");
      btn.setAttribute("data-lang", locale.id);
      btn.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      btn.textContent = locale.native || locale.id;
      bar.appendChild(btn);
    });

    if (data.hint) {
      var hint = document.createElement("p");
      hint.className = "ju-lang-bar-hint";
      hint.textContent = data.hint;
      bar.appendChild(hint);
    }

    bar.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-lang]");
      if (!btn) return;
      event.preventDefault();
      setActive(bar, btn.getAttribute("data-lang"));
    });
    return bar;
  }

  function findMount() {
    return (
      document.querySelector(".editor-visual-editor__post-title-wrapper") ||
      document.querySelector(".edit-post-visual-editor__post-title-wrapper") ||
      document.querySelector(".editor-post-title") ||
      document.querySelector(".edit-post-visual-editor") ||
      document.querySelector(".interface-interface-skeleton__content") ||
      document.querySelector(".wrap h1")
    );
  }

  function mount() {
    if (document.querySelector(".ju-lang-bar")) return;
    var target = findMount();
    if (!target || !target.parentNode) return;
    var bar = buildBar();
    if (target.classList && target.classList.contains("interface-interface-skeleton__content")) {
      target.insertBefore(bar, target.firstChild);
      return;
    }
    if (target.nextSibling) target.parentNode.insertBefore(bar, target.nextSibling);
    else target.parentNode.appendChild(bar);
  }

  function start() {
    mount();
    if (document.querySelector(".ju-lang-bar")) return;
    var body = document.body;
    if (!body || typeof MutationObserver === "undefined") return;
    var tries = 0;
    var obs = new MutationObserver(function () {
      mount();
      tries += 1;
      if (document.querySelector(".ju-lang-bar") || tries > 40) obs.disconnect();
    });
    obs.observe(body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  window.addEventListener("load", mount);
})();
