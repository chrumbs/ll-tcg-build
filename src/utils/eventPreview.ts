import type { ProductNode } from '../events/types';
import { REGISTRATION_BUFFER_MS } from './eventStatus';

export function isPreviewEventId(id: string | null | undefined): boolean {
  return /^test-(open|closed|passed|sold-out)$/.test(id || '');
}

export function getPreviewEvent(
  id: string | null | undefined,
  hostname = window.location.hostname
): ProductNode | null {
  if (!id || !isPreviewEventId(id)) return null;
  const previewHost =
    hostname.endsWith('.webflow.io') || ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
  if (!previewHost) return null;

  const state = id.slice('test-'.length);
  const hour = REGISTRATION_BUFFER_MS / 2;
  const startOffset = state === 'passed' ? -hour : state === 'closed' ? hour : 4 * hour;

  return {
    id,
    handle: id,
    title: `Test Event (${state})`,
    gameType: { value: 'magic' },
    startTime: { value: new Date(Date.now() + startOffset).toISOString() },
    duration: { value: '120' },
    format: { value: 'Standard' },
    totalCap: { value: '16' },
    variants: {
      edges: [
        {
          node: {
            id: `${id}-ticket`,
            title: 'Single Entry',
            quantityAvailable: state === 'sold-out' ? 0 : 8,
            price: { amount: '10.00', currencyCode: 'USD' },
          },
        },
      ],
    },
  };
}
