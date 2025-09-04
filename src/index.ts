import { dateFormatter, moneyFormatter, timeFormatter } from '$utils/formatters';
import { renderAccordions } from '$utils/renderAccordions';
import { setTextByAttr } from '$utils/setText';
import { formatProductId, getProductsByIDs } from '$utils/shopify';

import { renderGlobe } from './home/renderGlobe';

type VariantInfo = { id: string; qty: number; price: number; options: Record<string, string> };
type ProductInfo = {
  id: string;
  handle: string;
  title: string;
  gameType: string;
  start: Date | null;
  durationMin: number | null;
  format: string | null;
  variants: VariantInfo[];
  seatsLeft: number;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
};

window.Webflow ||= [];
window.Webflow.push(async () => {
  const globeCanvas = document.querySelector<HTMLCanvasElement>('[data-role="globe-canvas"]');
  if (globeCanvas) renderGlobe(globeCanvas);

  const accordions = Array.from(document.querySelectorAll('[ll-selector="accordion"]'));
  if (accordions.length > 0) {
    renderAccordions(accordions);
  } else {
    console.log('No accordion elements found.');
  }

  const productCards = Array.from(document.querySelectorAll('[data-product-id]'));

  if (!productCards || productCards.length === 0) return;

  const productIds = [
    ...new Set(productCards.map((card) => card.getAttribute('data-product-id')).filter(Boolean)),
  ];

  const data = await getProductsByIDs(productIds);

  const productMap = new Map();

  const productsArray = Array.isArray(data) ? data : [];

  productsArray.forEach((p) => {
    const variants: VariantInfo[] = (p.variants?.edges || []).map((e) => {
      const n = e.node;
      const options = Object.fromEntries((n.selectedOptions || []).map((o) => [o.name, o.value]));
      return {
        id: n.id,
        qty: Number(n.quantityAvailable ?? 0),
        price: Number(n.price?.amount ?? 0),
        options,
      };
    });

    const seatsLeft = variants.reduce((sum, v) => sum + (v.qty || 0), 0);
    const prices = variants.map((v) => v.price).filter((n) => Number.isFinite(n)); // include 0 so Free events are handled
    const minPrice = prices.length ? Math.min(...prices) : null;
    const maxPrice = prices.length ? Math.max(...prices) : null;

    const info: ProductInfo = {
      id: p.id,
      handle: p.handle,
      title: p.title,
      gameType: p.gameType?.value || '',
      start: p.startTime?.value ? new Date(p.startTime.value) : null,
      durationMin: p.duration?.value ? Number(p.duration.value) : null,
      format: p.format?.value || null,
      variants,
      seatsLeft,
      minPrice,
      maxPrice,
      currency: variants[0]?.price
        ? p.variants?.edges?.[0]?.node?.price?.currencyCode || 'USD'
        : 'USD',
    };

    productMap.set(info.id, info);
  });

  productCards.forEach((card: Element) => {
    const productId = card.getAttribute('data-product-id');

    if (!productId) {
      console.error(`Product ID not found for card: ${card}`);
      return;
    }

    const productData = productMap.get(formatProductId(productId)) as ProductInfo | undefined;

    if (!productData) {
      console.error(`Product not found: ${productId}`);
      return;
    }

    if (productData.minPrice != null) {
      let priceText = '';
      if (productData.maxPrice != null && productData.maxPrice !== productData.minPrice) {
        priceText = `${moneyFormatter(productData.minPrice, productData.currency)} — ${moneyFormatter(productData.maxPrice, productData.currency)}`;
      } else {
        priceText =
          productData.minPrice === 0
            ? 'Free'
            : moneyFormatter(productData.minPrice, productData.currency);
      }
      setTextByAttr(card, 'price', priceText);
    }
    setTextByAttr(card, 'gameType', productData.gameType || '');
    setTextByAttr(card, 'format', productData.format || '');
    setTextByAttr(
      card,
      'duration',
      productData.durationMin ? `${productData.durationMin} MINS` : ''
    );
    if (productData.start) {
      setTextByAttr(card, 'date', dateFormatter(productData.start));
      setTextByAttr(card, 'time', timeFormatter(productData.start));
    }

    // Check if event is in the past
    const now = new Date();
    const isEventPast = productData.start ? productData.start < now : false;
    const hasSeatsAvailable = productData.seatsLeft > 0;

    // Event is clickable only if it has seats AND hasn't started yet
    const clickable = hasSeatsAvailable && !isEventPast;

    // Update seats text based on availability and timing
    let seatsText = '';
    if (isEventPast) {
      seatsText = 'Past Event';
    } else if (!hasSeatsAvailable) {
      seatsText = 'Sold Out';
    } else {
      seatsText = `${productData.seatsLeft} Seats Open`;
    }
    setTextByAttr(card, 'seats', seatsText);

    // Toggle clickable class for styling (e.g., cursor, hover)
    (card as HTMLElement).classList.toggle('active', clickable);

    // Overlay link approach: show/hide the full-card link based on availability
    const overlayLink = card.querySelector<HTMLAnchorElement>('[data-role="link"]');
    if (overlayLink) {
      if (clickable) {
        overlayLink.style.display = 'block';
        overlayLink.removeAttribute('aria-hidden');
        overlayLink.removeAttribute('tabindex');
      } else {
        overlayLink.style.display = 'none';
        overlayLink.setAttribute('aria-hidden', 'true');
        overlayLink.setAttribute('tabindex', '-1');
      }

      // Optional: ensure there is an accessible label
      if (!overlayLink.getAttribute('aria-label')) {
        overlayLink.setAttribute('aria-label', productData.title || 'View event');
      }
    }

    // Inactive state (styling + semantics) - applies to both sold out AND past events
    if (!clickable) {
      (card as HTMLElement).classList.add('inactive');
      (card as HTMLElement).setAttribute('aria-disabled', 'true');

      // Add specific class for past events (for different styling if needed)
      if (isEventPast) {
        (card as HTMLElement).classList.add('past-event');
      }

      // Add specific class for sold out events (for different styling if needed)
      if (!hasSeatsAvailable && !isEventPast) {
        (card as HTMLElement).classList.add('sold-out');
      }
    } else {
      // Remove inactive classes if event becomes available again
      (card as HTMLElement).classList.remove('inactive', 'past-event', 'sold-out');
      (card as HTMLElement).removeAttribute('aria-disabled');
    }
  });
});
