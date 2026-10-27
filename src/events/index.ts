import { showError } from '$utils/errorHandler';
import { getPreviewEvent, isPreviewEventId } from '$utils/eventPreview';
import type { EventStatus } from '$utils/eventStatus';
import {
  eventStatusLabels,
  eventStatusMessages,
  getProductEventStatus,
  watchEventStatus,
} from '$utils/eventStatus';
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
  const isPreview = isPreviewEventId(cmsID);
  let product: ProductNode | null = isPreview ? getPreviewEvent(cmsID) : null;

  if (!isPreview && handle) {
    console.info('[events] Fetching by handle:', handle);
    product = await getEventByHandle(handle);
  }

  if (!isPreview && !product && cmsID) {
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

  setProductInfo(product);
  const start = product.startTime?.value ? new Date(product.startTime.value) : null;
  const refreshStatus = () => renderEventStatus(getProductEventStatus(product));
  watchEventStatus(start, refreshStatus);
  if (getProductEventStatus(product) !== 'open') return;

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
  const formSubmission = new FormSubmission(
    product,
    cartManager,
    formManager,
    () => ticketManager.getChosenVariantId(),
    refreshStatus
  );

  // Initialize components
  await ticketManager.render();
  await upsellManager.render();
  formSubmission.setupFormHandler();
  refreshStatus();
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

function renderEventStatus(status: EventStatus) {
  document.querySelector('.event_content_wrapper')?.setAttribute('data-event-status', status);
  const contentEl = document.querySelector<HTMLElement>('.event_content_warning');
  if (contentEl) {
    contentEl.classList.remove('w-condition-invisible');
    contentEl.classList.toggle('hide', status === 'open');
    contentEl.setAttribute('aria-hidden', String(status === 'open'));
    const message = contentEl.querySelector('h4, .heading-style-h4');
    if (message && status !== 'open') {
      message.textContent = eventStatusMessages[status];
    }
  }
  if (status === 'open') return;

  const submitBtn = document.querySelector<HTMLButtonElement>('[data-role="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
    // Webflow submit controls can be input[type="submit"] or button elements.
    if (submitBtn instanceof HTMLInputElement) {
      submitBtn.value = eventStatusLabels[status];
    } else {
      submitBtn.textContent = eventStatusLabels[status];
    }
  }
  updateLayout();
  setTextByAttr(document, 'seats', eventStatusLabels[status]);
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
      ticketEl.setAttribute('aria-disabled', 'true');
      ticketEl.setAttribute('tabindex', '-1');
    });
  }
  const upsellsEl = document.querySelector('.event_content_upsell');
  if (upsellsEl) {
    upsellsEl.classList.add('hide');
    upsellsEl.setAttribute('aria-hidden', 'true');
  }
  const cartEl = document.querySelector<HTMLElement>('[data-role="cart"]');
  if (cartEl) {
    cartEl.classList.add('hide');
    cartEl.setAttribute('aria-hidden', 'true');
  }
}
