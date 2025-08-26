import { debounce } from '$utils/debounce';
import { moneyFormatter } from '$utils/formatters';

import type { CartManager, ProductNode } from '../types';

type UpsellVariant = {
  id: string;
  title: string;
  price?: { amount?: string; currencyCode?: string };
  quantityAvailable: number;
  selectedOptions?: { name: string; value: string }[];
};

type UpsellProduct = {
  id: string;
  title: string;
  variants: UpsellVariant[];
};

export class UpsellManager {
  private upsellProducts: UpsellProduct[] = [];

  constructor(
    private product: ProductNode,
    private cartManager: CartManager
  ) {
    this.extractUpsells();
  }

  async render(): Promise<void> {
    const upsellTemplate = document.querySelector<HTMLElement>('[data-role="upsell"]');
    const upsellContainer = upsellTemplate?.parentElement;

    if (!this.upsellProducts.length || !upsellContainer || !upsellTemplate) {
      if (upsellContainer?.parentElement) {
        upsellContainer.parentElement.classList.add('hide');
      }
      return;
    }

    // Hide template
    upsellTemplate.classList.add('hide');

    // Clear container
    upsellContainer.innerHTML = '';

    // Create upsell elements for each product
    this.upsellProducts.forEach((upsellProduct) => {
      this.createUpsellElement(upsellProduct, upsellTemplate, upsellContainer);
    });
  }

  private extractUpsells(): void {
    this.upsellProducts = (this.product.complementaryProducts?.references?.edges || [])
      .map((e) => e.node)
      .filter((product) => !!product?.id)
      .map((product) => ({
        id: product?.id as string,
        title: product?.title || 'Add-on',
        variants: (product?.variants?.edges || [])
          .map((variantEdge) => variantEdge.node)
          .filter((variant) => !!variant?.id)
          .map((variant) => ({
            id: variant?.id as string,
            title: variant?.title ?? 'Untitled Variant',
            price: variant?.price,
            quantityAvailable: variant?.quantityAvailable || 0,
            selectedOptions: variant?.selectedOptions || [],
          })),
      }))
      .filter((product) => product.variants.length > 0);
  }

  private createUpsellElement(
    upsellProduct: UpsellProduct,
    template: HTMLElement,
    container: HTMLElement
  ): void {
    const upsellEl = template.cloneNode(true) as HTMLElement;
    upsellEl.classList.remove('hide');

    // Set product title
    this.setProductTitle(upsellEl, upsellProduct.title);

    // Default to first available variant
    const defaultVariant = this.findDefaultVariant(upsellProduct.variants);
    let selectedVariant = defaultVariant;

    // Create variant selector if multiple variants exist
    if (upsellProduct.variants.length > 1) {
      // ← Changed from >= 1 to > 1
      this.createVariantSelector(upsellEl, upsellProduct.variants, (variant) => {
        selectedVariant = variant;
        this.updateUpsellDisplay(upsellEl, variant);
        this.setupUpsellControls(upsellEl, upsellProduct.title, variant);
      });
    } else {
      // Hide variant selector for single variant products
      this.hideVariantSelector(upsellEl);
    }

    // Initial setup with selected variant
    if (selectedVariant) {
      this.updateUpsellDisplay(upsellEl, selectedVariant);
      this.setupUpsellControls(upsellEl, upsellProduct.title, selectedVariant);
    }

    container.appendChild(upsellEl);
  }

  private setProductTitle(upsellEl: HTMLElement, title: string): void {
    const titleEl = upsellEl.querySelector('[data-field="upsell-title"]');
    if (titleEl) titleEl.textContent = title;
  }

  private findDefaultVariant(variants: UpsellVariant[]): UpsellVariant | null {
    // Prefer available variants, then lowest price
    const availableVariants = variants.filter((v) => v.quantityAvailable > 0);
    const variantsToSort = availableVariants.length > 0 ? availableVariants : variants;

    return (
      variantsToSort.sort((a, b) => {
        const priceA = Number(a.price?.amount || '0');
        const priceB = Number(b.price?.amount || '0');
        return priceA - priceB;
      })[0] || null
    );
  }

  private createVariantSelector(
    upsellEl: HTMLElement,
    variants: UpsellVariant[],
    onVariantChange: (variant: UpsellVariant) => void
  ): void {
    const variantsContainer = upsellEl.querySelector('[data-field="upsell-variants"]');
    const variantTemplate = upsellEl.querySelector('[data-field="upsell-variant-item"]');

    if (!variantsContainer || !variantTemplate) return;

    // Hide template
    variantTemplate.classList.add('hide');

    // Clear container
    variantsContainer.innerHTML = '';

    variants.forEach((variant, index) => {
      const variantEl = variantTemplate.cloneNode(true) as HTMLElement;
      variantEl.classList.remove('hide');

      // Set variant option text
      const variantText = this.getVariantOptionText(variant);
      const textEl = variantEl.querySelector('div');
      if (textEl) textEl.textContent = variantText;

      // Make variant selectable
      variantEl.classList.add('variant-option');
      variantEl.setAttribute('role', 'button');
      variantEl.setAttribute('tabindex', '0');

      // Set as selected if it's the default
      if (index === 0) {
        variantEl.classList.add('selected');
        variantEl.setAttribute('aria-pressed', 'true');
      } else {
        variantEl.setAttribute('aria-pressed', 'false');
      }

      // Add event listeners
      const selectVariant = () => {
        // Remove selected state from all variants in this product
        variantsContainer.querySelectorAll('.variant-option').forEach((option) => {
          option.classList.remove('selected');
          option.setAttribute('aria-pressed', 'false');
        });

        // Set selected state
        variantEl.classList.add('selected');
        variantEl.setAttribute('aria-pressed', 'true');

        // Trigger callback
        onVariantChange(variant);
      };

      variantEl.addEventListener('click', selectVariant);
      variantEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectVariant();
        }
      });

      variantsContainer.appendChild(variantEl);
    });
  }

  private getVariantOptionText(variant: UpsellVariant): string {
    // Use meaningful selected options or fall back to variant title
    const meaningfulOptions =
      variant.selectedOptions?.filter(
        (option) => option.value !== 'Default Title' && option.name.toLowerCase() !== 'title'
      ) || [];

    if (meaningfulOptions.length > 0) {
      return meaningfulOptions.map((option) => option.value).join(' / ');
    }

    return variant.title === 'Default Title' ? 'Standard' : variant.title;
  }

  private hideVariantSelector(upsellEl: HTMLElement): void {
    const variantsContainer = upsellEl.querySelector<HTMLElement>('[data-field="upsell-variants"]');
    if (variantsContainer) {
      variantsContainer.classList.add('hide');
    }
  }

  private updateUpsellDisplay(upsellEl: HTMLElement, variant: UpsellVariant): void {
    const price = Number(variant.price?.amount || '0');
    const currency = variant.price?.currencyCode || 'USD';
    const stock = variant.quantityAvailable;

    // Update price
    const priceEl = upsellEl.querySelector('[data-field="upsell-price"]');
    if (priceEl) priceEl.textContent = moneyFormatter(price, currency);

    // Update stock display
    const stockCountEl = upsellEl.querySelector('[data-field="upsell-stock-count"]');
    if (stockCountEl) stockCountEl.textContent = stock.toString();

    const stockEl = upsellEl.querySelector<HTMLElement>('[data-field="upsell-stock"]');
    if (stockEl) {
      // Show stock info only if stock is 1-5
      if (stock > 0 && stock <= 5) {
        stockEl.classList.remove('hide');
      } else {
        stockEl.classList.add('hide');
      }
    }

    // Update sold out state
    if (stock <= 0) {
      upsellEl.classList.add('sold-out');
    } else {
      upsellEl.classList.remove('sold-out');
    }
  }

  private setupUpsellControls(
    upsellEl: HTMLElement,
    productTitle: string,
    variant: UpsellVariant
  ): void {
    const price = Number(variant.price?.amount || '0');
    const stock = variant.quantityAvailable;
    const maxQuantity = Math.min(10, stock);
    const upsellId = `upsell_${variant.id.split('/').pop()}`;
    const variantText = this.getVariantOptionText(variant);
    const fullTitle = `${productTitle} - ${variantText}`;

    const addBtn = upsellEl.querySelector('[data-field="upsell-add"]') as HTMLButtonElement;
    const qtyUpBtn = upsellEl.querySelector('[data-field="upsell-qty-up"]') as HTMLButtonElement;
    const qtyDownBtn = upsellEl.querySelector(
      '[data-field="upsell-qty-down"]'
    ) as HTMLButtonElement;
    const qtyCountEl = upsellEl.querySelector('[data-field="upsell-qty-count"]');

    // Reset quantity to 1 when variant changes
    let currentQty = 1;
    if (qtyCountEl) qtyCountEl.textContent = currentQty.toString();

    // Remove existing event listeners by cloning elements
    if (addBtn) {
      const newAddBtn = addBtn.cloneNode(true) as HTMLButtonElement;
      addBtn.parentNode?.replaceChild(newAddBtn, addBtn);
    }
    if (qtyUpBtn) {
      const newQtyUpBtn = qtyUpBtn.cloneNode(true) as HTMLButtonElement;
      qtyUpBtn.parentNode?.replaceChild(newQtyUpBtn, qtyUpBtn);
    }
    if (qtyDownBtn) {
      const newQtyDownBtn = qtyDownBtn.cloneNode(true) as HTMLButtonElement;
      qtyDownBtn.parentNode?.replaceChild(newQtyDownBtn, qtyDownBtn);
    }

    // Get new references after cloning
    const newAddBtn = upsellEl.querySelector('[data-field="upsell-add"]') as HTMLButtonElement;
    const newQtyUpBtn = upsellEl.querySelector('[data-field="upsell-qty-up"]') as HTMLButtonElement;
    const newQtyDownBtn = upsellEl.querySelector(
      '[data-field="upsell-qty-down"]'
    ) as HTMLButtonElement;

    if (stock <= 0) {
      // Disable controls for out of stock
      this.disableUpsellControls(upsellEl);
      return;
    }

    // Enable controls
    newAddBtn?.classList.remove('disabled');
    const buttonText = newAddBtn?.querySelector('.button-text');
    if (buttonText) buttonText.textContent = 'Add to Cart';

    // Quantity controls
    newQtyUpBtn?.addEventListener('click', () => {
      if (currentQty < maxQuantity) {
        currentQty++;
        if (qtyCountEl) qtyCountEl.textContent = currentQty.toString();
      }
    });

    newQtyDownBtn?.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        if (qtyCountEl) qtyCountEl.textContent = currentQty.toString();
      }
    });

    // Add to cart with debouncing
    const debouncedAddUpsell = debounce(() => {
      this.addUpsellToCart(upsellId, fullTitle, price, currentQty, variant);
    }, 300);

    newAddBtn?.addEventListener('click', () => {
      if (!newAddBtn.classList.contains('disabled')) {
        newAddBtn.classList.add('processing');
        debouncedAddUpsell();

        setTimeout(() => {
          newAddBtn.classList.remove('processing');
        }, 350);
      }
    });
  }

  private disableUpsellControls(upsellEl: HTMLElement): void {
    const addBtn = upsellEl.querySelector('[data-field="upsell-add"]');
    const qtyWrap = upsellEl.querySelector<HTMLElement>('[data-field="upsell-qty-wrap"]');

    if (addBtn) {
      const buttonText = addBtn.querySelector('.button-text');
      if (buttonText) buttonText.textContent = 'Out of Stock';
      addBtn.classList.add('disabled');
    }

    if (qtyWrap) qtyWrap.style.opacity = '0.5';
  }

  private addUpsellToCart(
    upsellId: string,
    title: string,
    price: number,
    quantity: number,
    variant: UpsellVariant
  ): void {
    // Validate inventory
    const currentItems = this.cartManager.getItems();
    const existingItem = currentItems.find((item) => item.id === upsellId);
    const currentCartQuantity = existingItem?.quantity || 0;
    const totalRequestedQuantity = currentCartQuantity + quantity;

    if (totalRequestedQuantity > variant.quantityAvailable) {
      const availableToAdd = variant.quantityAvailable - currentCartQuantity;

      if (availableToAdd <= 0) {
        this.showInventoryError(title, 'This item is already at maximum quantity in your cart.');
        return;
      }
      this.showInventoryError(
        title,
        `Only ${availableToAdd} more available. ${variant.quantityAvailable} total in stock.`
      );
      return;
    }

    // Add to cart
    const success = this.cartManager.addUpsellItem({
      id: upsellId,
      title,
      variant: '',
      price: price * quantity,
      quantity,
      variantId: variant.id,
    });

    if (success) {
      console.log(`Added ${quantity}x ${title} to cart`);
    }
  }

  private showInventoryError(itemTitle: string, message: string): void {
    console.error(`Inventory Error for ${itemTitle}: ${message}`);

    const errBox = document.querySelector<HTMLElement>('[data-role="error"]');
    if (errBox) {
      errBox.textContent = `${itemTitle}: ${message}`;
      errBox.classList.remove('hide');

      setTimeout(() => {
        errBox.classList.add('hide');
      }, 5000);
    }
  }
}
