import { dateFormatter, moneyFormatter, timeFormatter } from '$utils/formatters';
import { setTextByAttr } from '$utils/setText';
import { getEventByHandle } from '$utils/shopify';

import { CartDisplay } from './cart/cartDisplay';
import { CartManager } from './cart/cartManager';
import { FormManager } from './form/formManager';
import { FormSubmission } from './form/formSubmission';
import { TicketManager } from './tickets/ticketManager';
import type { ProductNode, VariantNode } from './types';
import { UpsellManager } from './upsells/upsellManager';

window.Webflow ||= [];
window.Webflow.push(async () => {
  console.log('Webflow at src/events initialized');

  // Resolve product handle
  const metaEl = document.querySelector<HTMLElement>('#event-meta');
  const cmsHandle = metaEl?.getAttribute('data-handle') || undefined;
  const urlHandle = location.pathname.split('/').filter(Boolean).pop();
  const handle = cmsHandle || urlHandle || '';

  // Fetch product
  const product: ProductNode | null = await getEventByHandle(handle);
  if (!product) {
    console.error('[events] No product for handle', handle);
    return;
  }

  // Initialize managers
  const cartEl = document.querySelector<HTMLElement>('[data-role="cart"]');
  const cartManager = new CartManager();
  const cartDisplay = new CartDisplay(cartManager, cartEl);

  // Update cart display when cart changes
  cartManager['onUpdateCallback'] = () => {
    const currency = product.variants?.edges?.[0]?.node?.price?.currencyCode || 'USD';
    cartDisplay.update(currency);
  };

  const formManager = new FormManager(product);
  const ticketManager = new TicketManager(product, cartManager);
  const upsellManager = new UpsellManager(product, cartManager);
  const formSubmission = new FormSubmission(product, cartManager, formManager, () =>
    ticketManager.getChosenVariantId()
  );

  // Set basic product info
  setProductInfo(product);

  // Initialize components
  await ticketManager.render();
  await upsellManager.render();
  formSubmission.setupFormHandler();
});

function setProductInfo(product: ProductNode): void {
  const variants: VariantNode[] = (product.variants?.edges || []).map((e) => e.node);
  const seatsLeft = variants.reduce((s, v) => s + (v.quantityAvailable || 0), 0);
  const prices = variants
    .map((v) => Number(v.price?.amount || '0'))
    .filter((n) => Number.isFinite(n));
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const currency = variants[0]?.price?.currencyCode || 'USD';

  const start = product.startTime?.value ? new Date(product.startTime.value) : null;
  if (start) {
    setTextByAttr(document, 'date', dateFormatter(start));
    setTextByAttr(document, 'time', timeFormatter(start));
  }

  setTextByAttr(document, 'gameType', product.gameType?.value || '');
  setTextByAttr(document, 'format', product.format?.value || '');
  setTextByAttr(
    document,
    'duration',
    product.duration?.value ? `${Number(product.duration.value)} min` : ''
  );
  setTextByAttr(document, 'seats', seatsLeft > 0 ? `${seatsLeft} seats left` : 'Sold out');

  if (minPrice != null) {
    setTextByAttr(
      document,
      'priceRange',
      maxPrice != null && maxPrice !== minPrice
        ? `${moneyFormatter(minPrice, currency)} - ${moneyFormatter(maxPrice, currency)}`
        : minPrice === 0
          ? 'Free'
          : moneyFormatter(minPrice, currency)
    );
  }
}
