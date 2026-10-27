import { getPreviewEvent, isPreviewEventId } from '$utils/eventPreview';
import { eventStatusLabels, getEventStatus, watchEventStatus } from '$utils/eventStatus';
import { dateFormatter, moneyFormatter, timeFormatter } from '$utils/formatters';
import { pageTransition } from '$utils/pageTransition';
import { renderAccordions } from '$utils/renderAccordions';
import { setTextByAttr } from '$utils/setText';
import { formatProductId, getProductsByIDs } from '$utils/shopify';

import type { ProductInfo, VariantInfo } from './events/types';
import { renderGlobe } from './home/renderGlobe';

window.Webflow ||= [];
window.Webflow.push(async () => {
  pageTransition();

  const globeCanvas = document.querySelector<HTMLCanvasElement>('[data-role="globe-canvas"]');
  if (globeCanvas) renderGlobe(globeCanvas);

  const accordions = Array.from(document.querySelectorAll('[ll-selector="accordion"]'));
  if (accordions.length > 0) {
    renderAccordions(accordions);
  } else {
    console.info('No accordion elements found.');
  }

  const productCards = Array.from(document.querySelectorAll('[data-product-id]'));
  if (!productCards || productCards.length === 0) return;
  const productIds = [
    ...new Set(productCards.map((card) => card.getAttribute('data-product-id')).filter(Boolean)),
  ];
  const previewProducts = productIds
    .map((id) => getPreviewEvent(id))
    .filter((product) => product !== null);
  const liveIds = productIds.filter((id) => !isPreviewEventId(id));
  const data = liveIds.length ? await getProductsByIDs(liveIds) : [];
  const productMap = new Map();
  const productsArray = [...previewProducts, ...(Array.isArray(data) ? data : [])];

  productsArray.forEach((p) => {
    if (!p) {
      console.error('Invalid product data:', p);
      return;
    }
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
      totalCap: p.totalCap?.value ? Number(p.totalCap.value) : null,
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

    const productData = productMap.get(
      isPreviewEventId(productId) ? productId : formatProductId(productId)
    ) as ProductInfo | undefined;
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
    // Every event keeps its detail link, regardless of registration availability.
    card.classList.add('active');
    card.classList.remove('inactive');
    card.removeAttribute('aria-disabled');
    const overlayLink = card.querySelector<HTMLAnchorElement>('[data-role="link"]');
    if (overlayLink) {
      overlayLink.style.display = 'block';
      overlayLink.removeAttribute('aria-hidden');
      overlayLink.removeAttribute('aria-disabled');
      overlayLink.removeAttribute('tabindex');

      // Optional: ensure there is an accessible label
      if (!overlayLink.getAttribute('aria-label')) {
        overlayLink.setAttribute('aria-label', productData.title || 'View event');
      }
    }
    watchEventStatus(productData.start, () => {
      const status = getEventStatus(productData.start, productData.seatsLeft);
      card.setAttribute('data-event-status', status);
      card.classList.toggle('past-event', status === 'passed');
      card.classList.toggle('sold-out', status === 'sold-out');
      card.classList.toggle('closed', status === 'closed');
      const seatsText =
        status === 'open'
          ? `${productData.seatsLeft} ${productData.totalCap && productData.totalCap > 0 ? `/ ${productData.totalCap} Open` : 'Open'}`
          : eventStatusLabels[status];
      setTextByAttr(card, 'seats', seatsText);

      const warningEl = card.querySelector<HTMLElement>('.event_item_warning');
      if (warningEl) {
        setTextByAttr(warningEl, 'warning', status === 'open' ? '' : eventStatusLabels[status]);
        warningEl.classList.toggle('hide', status === 'open');
        warningEl.setAttribute('aria-hidden', String(status === 'open'));
      }
    });
  });
});
