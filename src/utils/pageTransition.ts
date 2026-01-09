export function pageTransition() {
  // Configuration
  const introDurationMS = 1300;
  const exitDurationMS = 800;
  const excludedSelector = '.no-transition';

  // Get loader element
  const loader = document.querySelector<HTMLElement>('[ll-selector="loader"]');
  //console.log('Loader element:', loader);
  if (!loader) return;

  loader.style.opacity = '1';
  loader.style.display = 'flex';
  loader.style.transition = `opacity ${introDurationMS}ms ease`;

  // Function to hide loader
  const hideLoader = () => {
    // console.log('Hiding loader');
    if (!loader) return;
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, introDurationMS);
  };

  // Function to show loader
  const showLoader = () => {
    if (!loader) return;
    loader.style.display = 'flex';
    void loader.offsetWidth;
    loader.style.opacity = '1';
  };

  // EXECUTE DIRECTLY instead of using load event listener
  // console.log('Executing intro animation directly');
  document.body.classList.add('no-scroll-transition');
  setTimeout(() => {
    hideLoader();
    document.body.classList.remove('no-scroll-transition');
  }, 500);

  // Handle link clicks
  document.addEventListener('click', (e) => {
    // Find closest anchor tag if click was on a child element
    const target = e.target as Element;
    const anchor = target.closest('a');

    if (!anchor) return;

    const href = anchor.getAttribute('href');

    // Skip transitions for specific links
    if (
      anchor.hostname !== window.location.hostname || // External link
      !href || // No href attribute
      href.includes('#') || // Any hash link (like #visit)
      (href.endsWith('/') && href.indexOf('#') !== -1) || // Hash with trailing slash (like /#visit)
      anchor.matches(excludedSelector) || // Excluded class
      anchor.getAttribute('target') === '_blank' || // New tab
      anchor.getAttribute('download') !== null // Download link
    ) {
      return;
    }

    e.preventDefault();

    // Get destination URL
    const transitionURL = anchor.getAttribute('href');
    if (!transitionURL) return;

    // Add no-scroll class
    document.body.classList.add('no-scroll-transition');

    // Show loader with animation
    showLoader();

    // Navigate after animation completes
    setTimeout(() => {
      window.location.href = transitionURL;
    }, exitDurationMS);
  });

  // Handle back/forward navigation
  window.addEventListener('pageshow', (event) => {
    // console.log('Page show');
    if (event.persisted) {
      // Page is coming from browser cache (back/forward)
      hideLoader();
      document.body.classList.remove('no-scroll-transition');
    }
  });

  // Handle resize (optional, like in your jQuery version)
  let resizeTimeout: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      if (loader) loader.style.display = 'none';
    }, 50);
  });
}
