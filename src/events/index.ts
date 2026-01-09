import { showError } from '$utils/errorHandler';
import { dateFormatter, timeFormatter } from '$utils/formatters';
import { pageTransition } from '$utils/pageTransition';
import { renderAccordions } from '$utils/renderAccordions';
import { setTextByAttr } from '$utils/setText';
import { getEventByHandle, getEventByID } from '$utils/shopify';

import { CartDisplay } from './cart/cartDisplay';
import { CartManager } from './cart/cartManager';
import { FormManager } from './form/formManager';
import { FormSubmission } from './form/formSubmission';
import { TicketManager } from './tickets/ticketManager';
import type { ProductNode } from './types';
import { UpsellManager } from './upsells/upsellManager';

window.Webflow ||= [];
window.Webflow.push(async () => {
  pageTransition();

  const accordions = Array.from(document.querySelectorAll('[ll-selector="accordion"]'));
  if (accordions.length > 0) {
    renderAccordions(accordions);
  } else {
    console.info('No accordion elements found.');
  }

  // Resolve product handle
  const metaEl = document.querySelector<HTMLElement>('#event-meta');
  const cmsHandle = metaEl?.getAttribute('data-handle') || undefined;
  const cmsID = metaEl?.getAttribute('data-id') || undefined;
  const urlHandle = location.pathname.split('/').filter(Boolean).pop();
  const handle = cmsHandle || urlHandle || '';
  let product: ProductNode | null = await getEventByHandle(handle);

  if (handle) {
    console.info('[events] Fetching by handle:', handle);
    product = await getEventByHandle(handle);
  }

  if (!product && cmsID) {
    console.info('[events] Handle failed, trying CMS ID:', cmsID);
    try {
      product = await getEventByID(cmsID);

      if (product) {
        console.info('[events] Successfully fetched by ID:', product.title);
      } else {
        console.info('[events] No product found for ID:', cmsID);
      }
    } catch (error) {
      console.error('[events] Failed to fetch by ID:', error);
    }
  }

  if (!product) {
    eventNotFound();
    console.error('[events] No product found for handle:', handle, 'or ID:', cmsID);
    showError('Event not found.');
    return;
  }

  // console.info('[events] Loaded product:', product);

  const start = product.startTime?.value ? new Date(product.startTime.value) : null;
  const now = new Date();
  const isEventPast = start ? start < now : false;
  if (isEventPast) {
    setProductInfo(product);
    eventPassed();
    return;
  }

  const variants = product.variants?.edges?.map((e) => e.node) || [];
  const totalSeatsAvailable = variants.reduce(
    (sum, variant) => sum + (variant.quantityAvailable || 0),
    0
  );

  if (totalSeatsAvailable <= 0) {
    setProductInfo(product);
    eventSoldOut();
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

function setProductInfo(product: ProductNode) {
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
    product.duration?.value ? `${Number(product.duration.value)} MINS` : ''
  );
}

function eventPassed() {
  const submitBtn = document.querySelector<HTMLButtonElement>('[data-role="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
  }
  updateLayout();
  setTextByAttr(document, 'seats', 'Event Completed');
}

function eventNotFound() {
  const submitBtn = document.querySelector<HTMLButtonElement>('[data-role="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
  }
  const eventContent = document.querySelector<HTMLElement>('.event_content_wrapper')?.childNodes;
  eventContent?.forEach((node, i) => {
    if (i > 3 && node instanceof HTMLElement) {
      node.classList.add('hide');
      node.setAttribute('aria-hidden', 'true');
    }
  });
  const cartEl = document.querySelector<HTMLElement>('[data-role="cart"]');
  if (cartEl) {
    cartEl.classList.add('hide');
    cartEl.setAttribute('aria-hidden', 'true');
  }
}

function eventSoldOut() {
  const submitBtn = document.querySelector<HTMLButtonElement>('[data-role="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    submitBtn.textContent = 'Sold Out';
  }
  const contentEl = document.querySelector('.event_content_passed');
  if (contentEl) {
    contentEl.classList.remove('w-condition-invisible');
    const message = contentEl.querySelector('.heading-style-h4');
    if (message) {
      message.textContent = 'This event is sold out';
    }
  }
  updateLayout();
  setTextByAttr(document, 'seats', 'Sold Out');
}

function updateLayout() {
  const formEl = document.querySelector('.event_content_form');
  if (formEl) {
    formEl.classList.add('hide');
    formEl.setAttribute('aria-hidden', 'true');
  }
  const ticketsEl = document.querySelectorAll('[data-role="ticket"]');
  if (ticketsEl) {
    ticketsEl.forEach((ticketEl) => {
      ticketEl.classList.add('sold-out');
    });
  }
  const upsellsEl = document.querySelector('.event_content_upsell');
  if (upsellsEl) {
    upsellsEl.classList.add('hide');
    upsellsEl.setAttribute('aria-hidden', 'true');
  }
}
