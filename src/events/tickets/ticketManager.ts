import { debounce } from '$utils/debounce';
import { moneyFormatter } from '$utils/formatters';

import type { CartManager, ProductNode, VariantNode } from '../types';

export class TicketManager {
  private variants: VariantNode[] = [];
  private chosenVariantId: string | null = null;
  private hasSelectedVariant = false;
  private currency: string;
  private totalCap: number | null = null;

  constructor(
    private product: ProductNode,
    private cartManager: CartManager
  ) {
    this.variants = (product.variants?.edges || []).map((e) => e.node);
    this.currency = this.variants[0]?.price?.currencyCode || 'USD';
    this.totalCap = product.totalCap?.value ? Number(product.totalCap.value) : null;
  }

  async render(): Promise<void> {
    const ticketTemplate = document.querySelector<HTMLElement>('[data-role="ticket"]');
    const ticketsContainer = ticketTemplate?.parentElement || null;

    if (!ticketsContainer || !ticketTemplate) {
      console.error('Ticket template or container not found');
      // Fallback to first variant
      this.chosenVariantId = this.variants[0]?.id || null;
      return;
    }

    // Hide template
    ticketTemplate.classList.add('hide');

    // Clear container
    ticketsContainer.innerHTML = '';

    // Sort variants by price (lowest first)
    const sortedVariants = [...this.variants].sort((a, b) => {
      const priceA = Number(a.price?.amount || '0');
      const priceB = Number(b.price?.amount || '0');
      return priceA - priceB;
    });

    // Create tickets for each variant
    sortedVariants.forEach((variant) => {
      // console.info('Creating ticket for variant', variant);
      this.createTicketElement(variant, ticketTemplate, ticketsContainer);
    });

    // Handle fallback if no variants were created
    // if (!this.hasSelectedVariant && this.variants.length > 0) {
    //   console.error('No available variants to select, defaulting to first variant');
    //   this.createFallbackTicket(ticketTemplate, ticketsContainer);
    // }
  }

  getChosenVariantId(): string | null {
    return this.chosenVariantId;
  }

  private createTicketElement(
    variant: VariantNode,
    template: HTMLElement,
    container: HTMLElement
  ): void {
    const variantTitle = this.getVariantTitle(variant);

    // Skip "Default Title" variants if there are multiple options
    if (variantTitle === 'Default Title' && this.variants.length > 1) {
      return;
    }

    const finalTitle = variantTitle === 'Default Title' ? 'Single Entry' : variantTitle;
    const qty = variant.quantityAvailable || 0;
    const price = Number(variant.price?.amount || '0');

    // Clone template
    const ticketEl = template.cloneNode(true) as HTMLElement;
    ticketEl.classList.remove('hide');

    // Set ticket data
    this.setTicketData(ticketEl, finalTitle, qty, price);

    // Handle sold out vs available tickets
    if (qty <= 0) {
      // console.info('Setting up sold out ticket for variant', variant);
      this.setupSoldOutTicket(ticketEl);
    } else {
      this.setupAvailableTicket(ticketEl, variant, finalTitle);
    }

    container.appendChild(ticketEl);
  }

  private getVariantTitle(variant: VariantNode): string {
    let variantTitle = variant.title;

    if (variant.selectedOptions && variant.selectedOptions.length > 0) {
      const meaningfulOption = variant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() !== 'title' && opt.value !== 'Default Title'
      );

      if (meaningfulOption) {
        variantTitle = meaningfulOption.value;
      } else {
        const titleOption = variant.selectedOptions.find(
          (opt) => opt.name.toLowerCase() === 'title' && opt.value !== 'Default Title'
        );
        if (titleOption) {
          variantTitle = titleOption.value;
        }
      }
    }

    return variantTitle;
  }

  private setTicketData(ticketEl: HTMLElement, title: string, qty: number, price: number): void {
    const titleEl = ticketEl.querySelector('[data-field="variant-title"]');
    const seatsEl = ticketEl.querySelector('[data-field="seats"]');
    const priceEl = ticketEl.querySelector('[data-field="price"]');

    if (titleEl) titleEl.textContent = title;
    if (seatsEl)
      seatsEl.textContent =
        qty > 0
          ? `${qty} ${this.totalCap && this.totalCap > 0 ? `/ ${this.totalCap} Open` : 'Open'}`
          : 'Sold out';
    if (priceEl) priceEl.textContent = price === 0 ? 'Free' : moneyFormatter(price, this.currency);
  }

  private setupSoldOutTicket(ticketEl: HTMLElement): void {
    ticketEl.classList.add('sold-out');
    ticketEl.setAttribute('tabindex', '-1');
    ticketEl.setAttribute('aria-disabled', 'true');
  }

  private setupAvailableTicket(ticketEl: HTMLElement, variant: VariantNode, title: string): void {
    ticketEl.dataset.variantId = variant.id;
    ticketEl.setAttribute('aria-pressed', 'false');

    // Create debounced cart update
    const debouncedCartUpdate = debounce(() => {
      this.updateEventInCart(variant, title);
    }, 150);

    // Add event listeners
    this.addTicketEventListeners(ticketEl, variant, title, debouncedCartUpdate);

    // Select first available variant by default
    if (!this.hasSelectedVariant) {
      this.chosenVariantId = variant.id;
      this.setActiveTicket(ticketEl);
      this.updateEventInCart(variant, title);
      this.hasSelectedVariant = true;
    }
  }

  private addTicketEventListeners(
    ticketEl: HTMLElement,
    variant: VariantNode,
    title: string,
    debouncedUpdate: () => void
  ): void {
    const qty = variant.quantityAvailable || 0;

    // Click handler
    ticketEl.addEventListener('click', () => {
      if (qty <= 0) return;
      this.chosenVariantId = variant.id;
      this.setActiveTicket(ticketEl);
      debouncedUpdate();
    });

    // Keyboard handler
    ticketEl.addEventListener('keydown', (e) => {
      if (qty <= 0) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.chosenVariantId = variant.id;
        this.setActiveTicket(ticketEl);
        debouncedUpdate();
      }
    });
  }

  private setActiveTicket(activeTicketEl: HTMLElement): void {
    // Remove active class from all tickets
    document.querySelectorAll('[data-role="ticket"]').forEach((ticket) => {
      ticket.querySelector('[data-field="checkbox"]')?.classList.remove('is-active');
      ticket.setAttribute('aria-pressed', 'false');
    });

    // Add active class to selected ticket
    activeTicketEl.querySelector('[data-field="checkbox"]')?.classList.add('is-active');
    activeTicketEl.setAttribute('aria-pressed', 'true');
  }

  private updateEventInCart(variant: VariantNode, title: string): void {
    const price = Number(variant.price?.amount || '0');

    this.cartManager.updateEventItem('event', this.product.title, title, price);
  }

  // private createFallbackTicket(template: HTMLElement, container: HTMLElement): void {
  //   console.info('Creating fallback ticket');
  //   const firstVariant = this.variants[0];

  //   // Use the same title logic as createTicketElement
  //   const variantTitle = this.getVariantTitle(firstVariant);
  //   const finalTitle = variantTitle === 'Default Title' ? 'Single Entry' : variantTitle;

  //   this.chosenVariantId = firstVariant.id;

  //   template.classList.add('hide');
  //   const ticketEl = template.cloneNode(true) as HTMLElement;
  //   ticketEl.classList.remove('hide');
  //   ticketEl.classList.add('sold-out');

  //   const titleEl = ticketEl.querySelector('[data-field="variant-title"]');
  //   const seatsEl = ticketEl.querySelector('[data-field="seats"]');
  //   const priceEl = ticketEl.querySelector('[data-field="price"]');

  //   // Use the processed title instead of firstVariant.title
  //   if (titleEl) titleEl.textContent = finalTitle;
  //   if (seatsEl) seatsEl.textContent = 'Sold out';

  //   const price = Number(firstVariant.price?.amount || '0');
  //   if (priceEl) priceEl.textContent = price === 0 ? 'Free' : moneyFormatter(price, this.currency);

  //   container.appendChild(ticketEl);
  // }
}
