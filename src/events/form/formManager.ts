import { showError as utilShowError } from '$utils/errorHandler';

import type { FormState, ProductNode, ValidationResult } from '../types';

export class FormManager {
  private state: FormState = {
    participant: 'self',
    requirePlayerName: false,

    // Initialize all game-specific fields to false
    requireMtgAccount: false,
    requireTcgAccount: false,
    requireTcgUsername: false,
    requireRphAccount: false,
    requireRphUsername: false,
    requirePokemonAccount: false,
    requirePokemonId: false,
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
    this.setupAccountRadioListeners('mtg-account', 'mtg-username');
    this.setupAccountRadioListeners('tcg-account', 'tcg-username');
    this.setupAccountRadioListeners('rph-account', 'rph-username');
    this.setupAccountRadioListeners('pokemon-account', 'pokemon-id');
  }

  private setupAccountRadioListeners(accountRadioName: string, fieldsetToToggle: string): void {
    const trueRadio = document.querySelector<HTMLInputElement>(
      `input[name="${accountRadioName}"][id="${accountRadioName}-true"]`
    );
    const falseRadio = document.querySelector<HTMLInputElement>(
      `input[name="${accountRadioName}"][id="${accountRadioName}-false"]`
    );
    const fieldset = document.querySelector<HTMLElement>(`[data-role="${fieldsetToToggle}"]`);

    if (trueRadio && falseRadio && fieldset) {
      // Function to update field visibility
      const updateFieldVisibility = () => {
        const showField = trueRadio.checked;
        fieldset.classList.toggle('hide', !showField);

        // Update required state for inputs inside
        const inputs = fieldset.querySelectorAll('input');
        inputs.forEach((input) => {
          input.required = showField;
        });
      };

      // Add listeners
      trueRadio.addEventListener('change', updateFieldVisibility);
      falseRadio.addEventListener('change', updateFieldVisibility);

      // Initial state check (if radio is already selected)
      updateFieldVisibility();
    }
  }

  private updateFieldVisibility(): void {
    this.updatePlayerNameFields();
    this.updateGameSpecificFields();
    this.recheckAllAccountRadios();
  }

  private recheckAllAccountRadios(): void {
    // Check all account radio buttons and update fields accordingly
    const accountTypes = [
      { radio: 'mtg-account', field: 'mtg-username' },
      { radio: 'tcg-account', field: 'tcg-username' },
      { radio: 'rph-account', field: 'rph-username' },
      { radio: 'pokemon-account', field: 'pokemon-id' },
    ];

    accountTypes.forEach(({ radio, field }) => {
      // Only check if this account type is currently required
      console.log(
        `Checking ${radio}: ${this.state[`require${this.capitalizeFirst(radio.replace('-', ''))}` as keyof FormState]}`
      );
      if (this.state[`require${this.capitalizeFirst(radio.replace('-', ''))}` as keyof FormState]) {
        const trueRadio = document.querySelector<HTMLInputElement>(
          `input[name="${radio}"][id="${radio}-true"]`
        );

        // If "Yes" is already selected, show the username field
        if (trueRadio?.checked) {
          const fieldset = document.querySelector<HTMLElement>(`[data-role="${field}"]`);
          if (fieldset) {
            fieldset.classList.remove('hide');

            // Make inputs required
            const inputs = fieldset.querySelectorAll('input');
            inputs.forEach((input) => {
              input.required = true;
            });
          }
        }
      }
    });
  }

  // Helper method to capitalize first letter
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

  private updateGameSpecificFields(): void {
    // Get game type from product (lowercase for case-insensitive comparison)
    const gameType = (this.product.gameType?.value || '').toLowerCase();

    // Hide all game-specific fieldsets first
    this.hideAllGameFields();

    // Reset all requirements
    this.state.requireMtgAccount = false;
    this.state.requireTcgAccount = false;
    this.state.requireTcgUsername = false;
    this.state.requireRphAccount = false;
    this.state.requireRphUsername = false;
    this.state.requirePokemonAccount = false;
    this.state.requirePokemonId = false;

    // Show only relevant fieldsets based on game type
    if (gameType === 'magic') {
      this.showMtgFields();
    } else if (gameType === 'gundam' || gameType === 'one piece') {
      this.showTcgFields();
    } else if (gameType === 'lorcana') {
      this.showRphFields();
    } else if (gameType === 'pokemon') {
      this.showPokemonFields();
    }
  }

  private hideAllGameFields(): void {
    const fieldSets = [
      'mtg-account',
      'tcg-account',
      'tcg-username',
      'rph-account',
      'rph-username',
      'pokemon-account',
      'pokemon-id',
    ];

    fieldSets.forEach((fieldSet) => {
      const section = document.querySelector<HTMLElement>(`[data-role="${fieldSet}"]`);
      if (section) {
        section.classList.add('hide');
        const inputs = section.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
          'input, select'
        );
        inputs.forEach((input) => {
          input.required = false;
        });
      }
    });
  }

  private showMtgFields(): void {
    // Show MTG Account fieldset
    const mtgAccountSection = document.querySelector<HTMLElement>('[data-role="mtg-account"]');
    if (mtgAccountSection) {
      mtgAccountSection.classList.remove('hide');
      this.state.requireMtgAccount = true;
    }
  }

  private showTcgFields(): void {
    const tcgAccountSection = document.querySelector<HTMLElement>('[data-role="tcg-account"]');

    if (tcgAccountSection) {
      tcgAccountSection.classList.remove('hide');
      this.state.requireTcgAccount = true;
      this.state.requireTcgUsername = true;

      const trueRadio = document.querySelector<HTMLInputElement>(
        'input[name="tcg-account"][id="tcg-account-true"]'
      );
      if (trueRadio?.checked) {
        // Show username field if YES is already selected
        const usernameSection = document.querySelector<HTMLElement>('[data-role="tcg-username"]');
        if (usernameSection) {
          usernameSection.classList.remove('hide');
          const inputs = usernameSection.querySelectorAll('input');
          inputs.forEach((input) => {
            input.required = true;
          });
        }
      }
    }
  }

  private showRphFields(): void {
    // Show RPH Account and Username fieldsets
    const rphAccountSection = document.querySelector<HTMLElement>('[data-role="rph-account"]');

    if (rphAccountSection) {
      rphAccountSection.classList.remove('hide');
      this.state.requireRphAccount = true;
      this.state.requireRphUsername = true;

      const trueRadio = document.querySelector<HTMLInputElement>(
        'input[name="rph-account"][id="rph-account-true"]'
      );
      if (trueRadio?.checked) {
        // Show username field if YES is already selected
        const usernameSection = document.querySelector<HTMLElement>('[data-role="rph-username"]');
        if (usernameSection) {
          usernameSection.classList.remove('hide');
          const inputs = usernameSection.querySelectorAll('input');
          inputs.forEach((input) => {
            input.required = true;
          });
        }
      }
    }
  }

  private showPokemonFields(): void {
    // Show Pokemon Account and ID fieldsets
    const pokemonAccountSection = document.querySelector<HTMLElement>(
      '[data-role="pokemon-account"]'
    );
    if (pokemonAccountSection) {
      pokemonAccountSection.classList.remove('hide');
      this.state.requirePokemonAccount = true;
      this.state.requirePokemonId = true;

      const trueRadio = document.querySelector<HTMLInputElement>(
        'input[name="pokemon-account"][id="pokemon-account-true"]'
      );
      if (trueRadio?.checked) {
        // Show ID field if YES is already selected
        const idSection = document.querySelector<HTMLElement>('[data-role="pokemon-id"]');
        if (idSection) {
          idSection.classList.remove('hide');
          const inputs = idSection.querySelectorAll('input');
          inputs.forEach((input) => {
            input.required = true;
          });
        }
      }
    }
  }

  validate(): ValidationResult {
    // Validate player name if required
    if (this.state.requirePlayerName) {
      const firstName = this.getFormValue('field-first-name');
      const lastName = this.getFormValue('field-last-name');

      if (!firstName) {
        const error = "Please enter the player's first name.";
        this.showError(error);
        return { valid: false, error };
      }
      if (!lastName) {
        const error = "Please enter the player's last name.";
        this.showError(error);
        return { valid: false, error };
      }
    }

    // Validate MTG Account
    if (this.state.requireMtgAccount) {
      const hasMtgAccount = document.querySelector(
        'input[name="mtg-account"]:checked'
      ) as HTMLInputElement;
      if (!hasMtgAccount) {
        const error = 'Please indicate if you have the MTG Companion App.';
        this.showError(error);
        return { valid: false, error };
      }
      if (hasMtgAccount.id === 'mtg-account-false') {
        const error = 'You need the MTG Companion App to participate in this event.';
        this.showError(error);
        return { valid: false, error };
      }
    }

    // Validate TCG Account
    if (this.state.requireTcgAccount) {
      const hasTcgAccount = document.querySelector(
        'input[name="tcg-account"]:checked'
      ) as HTMLInputElement;
      if (!hasTcgAccount) {
        const error = 'Please indicate if you have a TCG Plus account.';
        this.showError(error);
        return { valid: false, error };
      }
      if (hasTcgAccount.id === 'tcg-account-false') {
        const error = 'You need a TCG Plus account to participate in this event.';
        this.showError(error);
        return { valid: false, error };
      }
    }

    // Validate RPH Account
    if (this.state.requireRphAccount) {
      const hasRphAccount = document.querySelector(
        'input[name="rph-account"]:checked'
      ) as HTMLInputElement;
      if (!hasRphAccount) {
        const error = 'Please indicate if you have a Ravensburger Play Hub account.';
        this.showError(error);
        return { valid: false, error };
      }
      if (hasRphAccount.id === 'rph-account-false') {
        const error = 'You need a Ravensburger Play Hub account to participate in this event.';
        this.showError(error);
        return { valid: false, error };
      }
    }

    // Validate Pokemon Account
    if (this.state.requirePokemonAccount) {
      const hasPokemonAccount = document.querySelector(
        'input[name="pokemon-account"]:checked'
      ) as HTMLInputElement;
      if (!hasPokemonAccount) {
        const error = 'Please indicate if you have a Pokémon ID.';
        this.showError(error);
        return { valid: false, error };
      }
      if (hasPokemonAccount.id === 'pokemon-account-false') {
        const error = 'You need a Pokémon ID to participate in this event.';
        this.showError(error);
        return { valid: false, error };
      }
    }

    return { valid: true };
  }

  showError(message: string): void {
    utilShowError(message);
  }

  private getFormValue(selector: string): string {
    return (
      document.querySelector<HTMLInputElement>(`[data-role="${selector}"]`)?.value || ''
    ).trim();
  }
}
