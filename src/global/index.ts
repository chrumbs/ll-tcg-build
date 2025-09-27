window.Webflow ||= [];
window.Webflow.push(async () => {
  const menuCloseEls = document.querySelectorAll('[ll-selector="menu-close"]');
  const menuTrigger = document.querySelector<HTMLElement>('[ll-selector="menu-trigger"]');

  if (menuCloseEls && menuTrigger) {
    menuCloseEls.forEach((el) => {
      if (el.getAttribute('href')) return;
      el.addEventListener('click', () => {
        menuTrigger.click();
      });
    });
  }
});
