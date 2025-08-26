import type { CartItem } from '../types';

export class CartManager {
  private items: CartItem[] = [];
  private onUpdateCallback?: () => void;

  constructor(onUpdate?: () => void) {
    this.onUpdateCallback = onUpdate;
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  updateEventItem(id: string, title: string, variant: string, price: number): void {
    this.items = this.items.filter((item) => item.id !== 'event');
    this.items.push({ id: 'event', title, variant, price });
    this.triggerUpdate();
  }

  addUpsellItem(item: CartItem): boolean {
    const existingIndex = this.items.findIndex((i) => i.id === item.id);

    if (existingIndex >= 0) {
      const existing = this.items[existingIndex];
      this.items[existingIndex] = {
        ...existing,
        quantity: (existing.quantity || 1) + (item.quantity || 1),
        price: item.price * ((existing.quantity || 1) + (item.quantity || 1)),
      };
    } else {
      this.items.push(item);
    }

    this.triggerUpdate();
    return true;
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.triggerUpdate();
  }

  private triggerUpdate(): void {
    this.onUpdateCallback?.();
  }
}
