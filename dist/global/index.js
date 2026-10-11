"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/global/index.ts
  window.Webflow ||= [];
  window.Webflow.push(async () => {
    const menuCloseEls = document.querySelectorAll('[ll-selector="menu-close"]');
    const menuTrigger = document.querySelector('[ll-selector="menu-trigger"]');
    if (menuCloseEls && menuTrigger) {
      menuCloseEls.forEach((el) => {
        if (el.getAttribute("href")) return;
        el.addEventListener("click", () => {
          menuTrigger.click();
        });
      });
    }
  });
})();
//# sourceMappingURL=index.js.map
