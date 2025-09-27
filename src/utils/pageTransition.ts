export function pageTransition() {
  // Configuration
  const introDurationMS = 1300; // Initial page load fade duration
  const exitDurationMS = 800; // Exit animation duration
  const loaderSelector = '[ll-selector="loader"]';
  const excludedSelector = '.no-transition';

  // Get loader element
  const loader = document.querySelector<HTMLElement>(loaderSelector);
  if (!loader) return;

  loader.style.opacity = '1';
  loader.style.display = 'flex';
  loader.style.transition = `opacity ${introDurationMS}ms ease`;

  // Function to hide loader
  const hideLoader = () => {
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
    // Force reflow to ensure the display change is processed before opacity
    void loader.offsetWidth;
    loader.style.opacity = '1';
  };

  // Initial page load animation
  window.addEventListener('load', () => {
    document.body.classList.add('no-scroll-transition');
    setTimeout(() => {
      hideLoader();
      document.body.classList.remove('no-scroll-transition');
    }, 500); // Short delay to ensure content is ready
  });

  // Handle link clicks
  document.addEventListener('click', (e) => {
    // Find closest anchor tag if click was on a child element
    const target = e.target as Element;
    const anchor = target.closest('a');

    if (!anchor) return;

    // Skip transitions for specific links
    if (
      anchor.hostname !== window.location.hostname || // External link
      anchor.getAttribute('href')?.includes('#') || // Hash link
      anchor.matches(excludedSelector) || // Excluded class
      anchor.getAttribute('target') === '_blank' || // New tab
      anchor.getAttribute('download') !== null // Download link
    ) {
      return;
    }

    // Prevent default navigation
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
