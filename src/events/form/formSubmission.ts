import { showError } from '$utils/errorHandler';
import { createCartWithLines } from '$utils/shopify';

import type { CartManager, FormManager, ProductNode } from '../types';

export class FormSubmission {
  private form: HTMLFormElement | null;
  private submitBtn: HTMLButtonElement | null;
  private errBox: HTMLElement | null;

  constructor(
    private product: ProductNode,
    private cartManager: CartManager,
    private formManager: FormManager,
    private getChosenVariantId: () => string | null
  ) {
    this.form = document.querySelector<HTMLFormElement>('[data-role="event-form"]');
    this.submitBtn = document.querySelector<HTMLButtonElement>('[data-role="submit"]');
    this.errBox = document.querySelector<HTMLElement>('[data-role="error"]');

    this.setupButtonStateManagement();
  }

  setupFormHandler(): void {
    if (!this.form) {
      console.error('Form not found');
      return;
    }

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleFormSubmission();
    });
  }

  private async handleFormSubmission(): Promise<void> {
    // Clear and hide error box
    this.clearErrors();

    // Validate form
    const validation = this.validateForm();
    if (!validation.valid) {
      showError(validation.error || 'Validation error');
      return;
    }

    // Disable submit button during processing
    this.disableSubmitButton();

    try {
      // Create cart with event registration
      const cart = await this.createEventCart();

      // Redirect to checkout
      const url = cart?.checkoutUrl;
      if (!url) throw new Error('Could not create checkout.');

      window.location.href = url;
    } catch (err) {
      console.error('[events] checkout error', err);
      showError('Something went wrong. Please try again.');
      this.enableSubmitButton();
    }
  }

  private validateForm(): { valid: boolean; error?: string } {
    const chosenVariantId = this.getChosenVariantId();

    if (!chosenVariantId) {
      const error = 'This event is sold out.';
      showError(error);
      return { valid: false, error };
    }

    // Delegate to FormManager for field validation
    return this.formManager.validate();
  }

  // In the createEventCart method:

  private async createEventCart() {
    const formState = this.formManager.getState();

    // Gather player details
    const firstName = this.getFormValue('field-first-name');
    const lastName = this.getFormValue('field-last-name');
    const playerName = `${firstName} ${lastName}`.trim();
    const phone = this.getFormValue('field-phone');
    const bday = this.getFormValue('field-bday');

    // Get game-specific account information
    const mtgAccountStatus = formState.requireMtgAccount ? this.getRadioValue('mtg-account') : '';
    const tcgAccountStatus = formState.requireTcgAccount ? this.getRadioValue('tcg-account') : '';
    const tcgUsername = formState.requireTcgUsername ? this.getFormValue('field-tcg-username') : '';
    const rphAccountStatus = formState.requireRphAccount ? this.getRadioValue('rph-account') : '';
    const rphUsername = formState.requireRphUsername ? this.getFormValue('field-rph-username') : '';
    const pokemonAccountStatus = formState.requirePokemonAccount
      ? this.getRadioValue('pokemon-id')
      : '';
    const pokemonId = formState.requirePokemonId ? this.getFormValue('field-pokemon-id') : '';

    // Build main event line item
    const lines = [
      {
        merchandiseId: this.getChosenVariantId()!,
        quantity: 1,
        attributes: [
          { key: 'Game', value: this.product.gameType?.value || '' },
          { key: 'Format', value: this.product.format?.value || '' },
          { key: 'Player Name', value: playerName },
          { key: 'Phone Number', value: phone },
          { key: 'Date of Birth', value: bday },
        ],
      },
    ];

    // Add game-specific attributes
    if (mtgAccountStatus) {
      lines[0].attributes.push({ key: 'MTG Companion App', value: mtgAccountStatus });
    }

    if (tcgAccountStatus) {
      lines[0].attributes.push({ key: 'TCG Plus Account', value: tcgAccountStatus });
    }

    if (tcgUsername) {
      lines[0].attributes.push({ key: 'TCG Plus Username', value: tcgUsername });
    }

    if (rphAccountStatus) {
      lines[0].attributes.push({ key: 'Ravensburger Play Hub Account', value: rphAccountStatus });
    }

    if (rphUsername) {
      lines[0].attributes.push({ key: 'Ravensburger Play Hub Username', value: rphUsername });
    }

    if (pokemonAccountStatus) {
      lines[0].attributes.push({ key: 'Pokémon ID Account', value: pokemonAccountStatus });
    }

    if (pokemonId) {
      lines[0].attributes.push({ key: 'Pokémon ID', value: pokemonId });
    }

    // Add upsell items from cart
    const cartItems = this.cartManager.getItems();
    cartItems.forEach((item) => {
      if (item.id !== 'event' && item.variantId) {
        lines.push({
          merchandiseId: item.variantId,
          quantity: item.quantity || 1,
          attributes: [],
        });
      }
    });

    return createCartWithLines(lines);
  }

  private setupButtonStateManagement(): void {
    // Ensure submit button is enabled on page load
    this.enableSubmitButton();

    // Re-enable submit button when user makes changes
    if (this.form) {
      this.form.addEventListener('input', () => this.enableSubmitButton());
      this.form.addEventListener('change', () => this.enableSubmitButton());
    }

    // Re-enable when page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.enableSubmitButton();
      }
    });

    // Re-enable on window focus
    window.addEventListener('focus', () => this.enableSubmitButton());
  }

  private enableSubmitButton(): void {
    if (this.submitBtn && this.submitBtn.disabled) {
      this.submitBtn.disabled = false;
    }
  }

  private disableSubmitButton(): void {
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
    }
  }

  private clearErrors(): void {
    if (this.errBox) {
      this.errBox.textContent = '';
      this.errBox.classList.add('hide');
    }
  }

  private getFormValue(selector: string): string {
    return (
      document.querySelector<HTMLInputElement>(`[data-role="${selector}"]`)?.value || ''
    ).trim();
  }

  private getRadioValue(name: string): string {
    const trueRadio = document.querySelector<HTMLInputElement>(
      `input[name="${name}"][id="${name}-true"]`
    );
    const falseRadio = document.querySelector<HTMLInputElement>(
      `input[name="${name}"][id="${name}-false"]`
    );
    if (trueRadio?.checked) return 'Yes';
    if (falseRadio?.checked) return 'No';
    return '';
  }
}
