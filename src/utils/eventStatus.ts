import type { ProductNode } from '../events/types';

export type EventStatus = 'open' | 'closed' | 'passed' | 'sold-out';

export const REGISTRATION_BUFFER_MS = 2 * 60 * 60 * 1000;

export const eventStatusLabels: Record<Exclude<EventStatus, 'open'>, string> = {
  closed: 'Registration Closed',
  passed: 'Past Event',
  'sold-out': 'Sold Out',
};

export const eventStatusMessages: Record<Exclude<EventStatus, 'open'>, string> = {
  closed: 'Event registration is closed.',
  passed: 'This event has passed.',
  'sold-out': 'This event is sold out.',
};

export function getEventStatus(
  start: Date | null,
  seatsAvailable: number,
  now = Date.now()
): EventStatus {
  const startTime = start?.getTime();
  if (startTime != null && Number.isFinite(startTime)) {
    if (now >= startTime) return 'passed';
    if (now >= startTime - REGISTRATION_BUFFER_MS) return 'closed';
  }
  return seatsAvailable > 0 ? 'open' : 'sold-out';
}

export function getProductEventStatus(product: ProductNode): EventStatus {
  const start = product.startTime?.value ? new Date(product.startTime.value) : null;
  const seatsAvailable = (product.variants?.edges || []).reduce(
    (sum, { node }) => sum + (node.quantityAvailable || 0),
    0
  );
  return getEventStatus(start, seatsAvailable);
}

// Refresh at each time boundary, and when returning to a suspended/cached page.
export function watchEventStatus(start: Date | null, refresh: () => void): void {
  let timer: number | undefined;
  const update = () => {
    window.clearTimeout(timer);
    refresh();
    const startTime = start?.getTime();
    if (startTime == null || !Number.isFinite(startTime)) return;
    const now = Date.now();
    const next = [startTime - REGISTRATION_BUFFER_MS, startTime].find((time) => time > now);
    if (next != null) {
      // Cap long waits to avoid the browser's maximum timeout overflow.
      timer = window.setTimeout(update, Math.min(next - now, 24 * 60 * 60 * 1000));
    }
  };

  update();
  window.addEventListener('focus', update);
  window.addEventListener('pageshow', update);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) update();
  });
}
