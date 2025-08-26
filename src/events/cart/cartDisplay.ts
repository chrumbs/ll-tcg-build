import { moneyFormatter } from '$utils/formatters';

import type { CartItem } from '../types';
import type { CartManager } from './cartManager';

export class CartDisplay {
  private cartEl: HTMLElement | null;
  private cartManager: CartManager;

  constructor(cartManager: CartManager, cartElement: HTMLElement | null) {
    this.cartManager = cartManager;
    this.cartEl = cartElement;
    this.hideCartItemTemplate();
  }

  update(currency: string = 'USD'): void {
    if (!this.cartEl) {
      console.error('Cart element not found');
      return;
    }

    const cartItemsContainer = this.cartEl.querySelector('[data-field="cart-items"]');
    const subtotalEl = this.cartEl.querySelector('[data-field="cart-subtotal"]');
    const cartItemTemplate = document.querySelector('[data-field="cart-line-item"]');

    if (!cartItemsContainer || !subtotalEl || !cartItemTemplate) {
      console.error('Required cart elements not found');
      return;
    }

    console.info('Updating cart display');

    this.hideTemplate(cartItemTemplate as HTMLElement);
    cartItemsContainer.innerHTML = '';

    const items = this.cartManager.getItems();
    const subtotal = this.cartManager.getSubtotal();

    items.forEach((item) => {
      const itemEl = this.createCartItemElement(cartItemTemplate as HTMLElement, item, currency);
      cartItemsContainer.appendChild(itemEl);
    });

    subtotalEl.textContent = moneyFormatter(subtotal, currency);
  }

  private hideTemplate(template: HTMLElement): void {
    template.classList.add('hide');
  }

  private hideCartItemTemplate(): void {
    const cartItemTemplate = document.querySelector<HTMLElement>('[data-field="cart-line-item"]');
    if (cartItemTemplate) {
      cartItemTemplate.classList.add('hide');
    }
  }

  private createCartItemElement(
    template: HTMLElement,
    item: CartItem,
    currency: string
  ): HTMLElement {
    const itemEl = template.cloneNode(true) as HTMLElement;
    itemEl.classList.remove('hide');

    const titleEl = itemEl.querySelector('[data-field="cart-line-title"]');
    if (titleEl) {
      const displayTitle =
        item.quantity && item.quantity > 1 ? `${item.title} (${item.quantity}x)` : item.title;
      titleEl.textContent = displayTitle;
    }

    const variantEl = itemEl.querySelector('[data-field="cart-line-variant"]');
    if (variantEl) variantEl.textContent = item.variant;

    const priceEl = itemEl.querySelector('[data-field="cart-line-price"]');
    if (priceEl) priceEl.textContent = moneyFormatter(item.price, currency);

    const removeBtn = itemEl.querySelector('[data-role="cart-line-clear"]');
    if (item.id !== 'event' && removeBtn) {
      removeBtn.classList.remove('hide');
      removeBtn.addEventListener('click', () => this.cartManager.removeItem(item.id));
    } else if (removeBtn) {
      removeBtn.classList.add('hide');
    }

    return itemEl;
  }
}
