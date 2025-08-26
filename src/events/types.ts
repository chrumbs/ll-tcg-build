export type VariantNode = {
  title: string;
  id: string;
  quantityAvailable: number;
  price?: { amount?: string; currencyCode?: string };
  selectedOptions?: { name: string; value: string }[];
};

export type ProductNode = {
  id: string;
  title: string;
  handle: string;
  gameType?: { value?: string } | null;
  startTime?: { value?: string } | null;
  duration?: { value?: string } | null;
  format?: { value?: string } | null;
  bandai?: boolean | null;
  complementaryProducts?: {
    references?: {
      edges?: {
        node?: {
          id: string;
          title?: string;
          variants?: {
            edges?: {
              node?: {
                id: string;
                title?: string;
                price?: { amount?: string; currencyCode?: string };
                quantityAvailable: number;
                selectedOptions?: { name: string; value: string }[];
              };
            }[];
          };
        };
      }[];
    };
  } | null;
  variants?: { edges?: { node: VariantNode }[] };
};

export type CartItem = {
  id: string;
  title: string;
  variant: string;
  price: number;
  quantity?: number;
  variantId?: string;
};

export type FormState = {
  participant: string;
  requirePlayerName: boolean;
  requirePokemonId: boolean;
  requireTcgAccount: boolean;
};

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

// CartManager interface for type safety
export interface CartManager {
  getItems(): CartItem[];
  getSubtotal(): number;
  updateEventItem(id: string, title: string, variant: string, price: number): void;
  addUpsellItem(item: CartItem): boolean;
  removeItem(id: string): void;
}

// FormManager interface for type safety
export interface FormManager {
  getState(): FormState;
  validate(): ValidationResult;
}
