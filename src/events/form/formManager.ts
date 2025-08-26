import type { FormState, ProductNode, ValidationResult } from '../types';

export class FormManager {
  private state: FormState = {
    participant: 'self',
    requirePlayerName: false,
    requirePokemonId: false,
    requireTcgAccount: false,
  };

  constructor(private product: ProductNode) {
    this.setupListeners();
    this.updateFieldVisibility();
  }

  getState(): FormState {
    return { ...this.state };
  }

  private setupListeners(): void {
    const selfRadio = document.getElementById('self') as HTMLInputElement;
    const otherRadio = document.getElementById('other') as HTMLInputElement;

    if (selfRadio && otherRadio) {
      selfRadio.addEventListener('change', () => {
        if (selfRadio.checked) {
          this.state.participant = 'self';
          this.updateFieldVisibility();
        }
      });

      otherRadio.addEventListener('change', () => {
        if (otherRadio.checked) {
          this.state.participant = 'other';
          this.updateFieldVisibility();
        }
      });

      // Set default
      if (!selfRadio.checked && !otherRadio.checked) {
        selfRadio.checked = true;
        this.state.participant = 'self';
      }
    }
  }

  private updateFieldVisibility(): void {
    this.updatePlayerNameFields();
    this.updatePokemonIdField();
    this.updateTcgAccountField();
  }

  private updatePlayerNameFields(): void {
    const section = document.querySelector<HTMLElement>('[data-role="player-name"]');
    if (!section) return;

    const isOther = this.state.participant === 'other';
    section.classList.toggle('hide', !isOther);
    this.state.requirePlayerName = isOther;

    const inputs = section.querySelectorAll('input');
    inputs.forEach((input) => {
      input.required = isOther;
    });
  }

  private updatePokemonIdField(): void {
    const section = document.querySelector<HTMLElement>('[data-role="pokemon-id"]');
    if (!section) return;

    const isPokemon = (this.product.gameType?.value || '').toLowerCase() === 'pokemon';
    section.classList.toggle('hide', !isPokemon);
    this.state.requirePokemonId = isPokemon;

    const input = section.querySelector('input');
    if (input) input.required = isPokemon;
  }

  private updateTcgAccountField(): void {
    const section = document.querySelector<HTMLElement>('[data-role="tcg-account"]');
    if (!section) return;

    const isBandai = !!this.product.bandai;
    section.classList.toggle('hide', !isBandai);
    this.state.requireTcgAccount = isBandai;
  }

  validate(): ValidationResult {
    if (this.state.requirePlayerName) {
      const firstName = this.getFormValue('field-first-name');
      const lastName = this.getFormValue('field-last-name');

      if (!firstName) return { valid: false, error: "Please enter the player's first name." };
      if (!lastName) return { valid: false, error: "Please enter the player's last name." };
    }

    if (this.state.requirePokemonId) {
      const pokemonId = this.getFormValue('field-pokemon-id');
      if (!pokemonId) return { valid: false, error: 'Please enter your Pokémon ID.' };
    }

    if (this.state.requireTcgAccount) {
      const hasTcgAccount = document.querySelector('input[name="tcg-account"]:checked');
      if (!hasTcgAccount)
        return { valid: false, error: 'Please indicate if you have a TCG Plus account.' };
    }

    return { valid: true };
  }

  private getFormValue(selector: string): string {
    return (
      document.querySelector<HTMLInputElement>(`[data-role="${selector}"]`)?.value || ''
    ).trim();
  }
}
