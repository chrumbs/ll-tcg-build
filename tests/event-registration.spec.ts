import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { build } from 'esbuild';

import type { ProductNode } from '../src/events/types';
import { getPreviewEvent } from '../src/utils/eventPreview';
import {
  getEventStatus,
  getProductEventStatus,
  REGISTRATION_BUFFER_MS,
} from '../src/utils/eventStatus';

const start = new Date('2026-11-01T18:00:00-08:00');
const cutoff = start.getTime() - REGISTRATION_BUFFER_MS;
let listingScript: string;
let detailScript: string;

declare global {
  interface Window {
    registrationTest: {
      product: ProductNode;
      carts: number;
      reads: number;
      requestedIds?: (string | null)[];
    };
  }
}

test.beforeAll(async () => {
  const bundle = async (entry: string) => {
    const result = await build({
      entryPoints: [entry],
      bundle: true,
      write: false,
      plugins: [
        {
          name: 'shopify-fixture',
          setup(builder) {
            builder.onResolve({ filter: /^\$utils\/shopify$/ }, () => ({
              path: 'shopify',
              namespace: 'fixture',
            }));
            builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({
              contents: `
                export const formatProductId = id => id;
                export const getProductsByIDs = async ids => {
                  window.registrationTest.reads++;
                  window.registrationTest.requestedIds = ids;
                  return [window.registrationTest.product];
                };
                export const getEventByHandle = async () => {
                  window.registrationTest.reads++;
                  return window.registrationTest.product;
                };
                export const getEventByID = getEventByHandle;
                export const createCartWithLines = async () => {
                  window.registrationTest.carts++;
                  return { checkoutUrl: '#checkout' };
                };
              `,
            }));
          },
        },
      ],
    });
    return result.outputFiles[0].text;
  };
  [listingScript, detailScript] = await Promise.all([
    bundle('src/index.ts'),
    bundle('src/events/index.ts'),
  ]);
});

function product(seats = 5): ProductNode {
  return {
    id: 'event-1',
    handle: 'test-event',
    title: 'Test event',
    startTime: { value: start.toISOString() },
    variants: {
      edges: [
        {
          node: {
            id: 'variant-1',
            title: 'Single Entry',
            quantityAvailable: seats,
            price: { amount: '10', currencyCode: 'USD' },
          },
        },
      ],
    },
  };
}

async function initialize(page: Page, script: string, seats = 5) {
  await page.evaluate((fixture) => {
    window.registrationTest = { product: fixture, carts: 0, reads: 0 };
  }, product(seats));
  await page.addScriptTag({ content: script });
  await page.evaluate(async () => {
    const callbacks = window.Webflow as unknown as (() => Promise<void>)[];
    for (const callback of callbacks) await callback();
  });
}

const detailMarkup = `
  <style>.hide, .w-condition-invisible { display: none; }</style>
  <div id="event-meta" data-handle="test-event"></div>
  <main class="event_content_wrapper">
    <div class="event_content_warning hide"><h4></h4></div>
    <p data-field="seats"></p>
    <div><div data-role="ticket">
      <span data-field="variant-title"></span>
      <span data-field="seats"></span><span data-field="price"></span>
    </div></div>
    <div class="event_content_form">
      <form data-role="event-form">
        <input data-role="field-first-name" value="Test" required>
        <input data-role="field-last-name" value="Player" required>
        <input data-role="field-phone" value="5551234567" required>
        <input data-role="field-bday" type="date" value="1990-01-01" required>
        <input data-role="submit" type="submit" value="Register">
        <div data-role="error" class="hide"></div>
      </form>
    </div>
    <div class="event_content_upsell">Add-ons</div>
    <div data-role="cart">Cart</div>
  </main>
`;

test('two-hour boundary, start boundary, inventory and timezone offsets', () => {
  expect(getEventStatus(start, 5, cutoff - 1)).toBe('open');
  expect(getEventStatus(start, 5, cutoff)).toBe('closed');
  expect(getEventStatus(start, 5, start.getTime() - 1)).toBe('closed');
  expect(getEventStatus(start, 5, start.getTime())).toBe('passed');
  expect(getEventStatus(start, 0, cutoff - 1)).toBe('sold-out');
  expect(getEventStatus(start, 0, cutoff)).toBe('closed');
  expect(getEventStatus(start, 0, start.getTime())).toBe('passed');
  expect(getEventStatus(new Date('2026-11-02T02:00:00Z'), 5, cutoff)).toBe('closed');
  expect(getEventStatus(null, 5, cutoff)).toBe('open');
  expect(getEventStatus(new Date('invalid'), 0, cutoff)).toBe('sold-out');
});

for (const state of [
  { status: 'open', now: cutoff - 1, seats: 5, label: '5 Open', warning: '' },
  {
    status: 'closed',
    now: cutoff,
    seats: 5,
    label: 'Registration Closed',
    warning: 'Event registration is closed.',
  },
  {
    status: 'sold-out',
    now: cutoff - 1,
    seats: 0,
    label: 'Sold Out',
    warning: 'This event is sold out.',
  },
  {
    status: 'passed',
    now: start.getTime(),
    seats: 5,
    label: 'Past Event',
    warning: 'This event has started. Registration is closed.',
  },
]) {
  test(`${state.status} listing keeps its link accessible`, async ({ page }) => {
    await page.clock.install({ time: state.now });
    await page.clock.pauseAt(state.now);
    await page.setContent(`
      <style>.hide { display: none; }</style>
      <article data-product-id="event-1" class="inactive" aria-disabled="true">
        <span data-field="seats"></span>
        <div class="event_item_warning hide"><span data-field="warning">Old warning</span></div>
        <a data-role="link" href="/events/test-event" style="display:none"
          aria-hidden="true" tabindex="-1">View event</a>
      </article>
    `);
    await initialize(page, listingScript, state.seats);
    await expect(page.locator('article')).toHaveAttribute('data-event-status', state.status);
    await expect(page.locator('[data-field="seats"]')).toHaveText(state.label);
    await expect(page.getByRole('link')).toBeVisible();
    await expect(page.getByRole('link')).toHaveAttribute('href', '/events/test-event');
    await expect(page.getByRole('link')).not.toHaveAttribute('tabindex', '-1');
    await expect(page.locator('article')).not.toHaveAttribute('aria-disabled');
    const warning = page.locator('.event_item_warning');
    await expect(warning).toHaveAttribute('aria-hidden', String(state.status === 'open'));
    await expect(warning.locator('[data-field="warning"]')).toHaveText(
      state.status === 'open' ? '' : state.label
    );
    if (state.status === 'open') {
      await expect(warning).toBeHidden();
    } else {
      await expect(warning).toBeVisible();
    }
  });

  test(`${state.status} detail has the correct registration controls`, async ({ page }) => {
    await page.clock.install({ time: state.now });
    await page.clock.pauseAt(state.now);
    await page.setContent(detailMarkup);
    await initialize(page, detailScript, state.seats);
    await expect(page.locator('main')).toHaveAttribute('data-event-status', state.status);
    if (state.status === 'open') {
      await expect(page.locator('.event_content_warning')).toBeHidden();
      await expect(page.locator('[data-role="submit"]')).toBeEnabled();
      await page.locator('[data-role="submit"]').click();
      expect(await page.evaluate(() => window.registrationTest.carts)).toBe(1);
    } else {
      await expect(page.locator('.event_content_warning')).toBeVisible();
      await expect(page.locator('.event_content_warning h4')).toHaveText(state.warning);
      await expect(page.locator('.event_content_form')).toBeHidden();
      await expect(page.locator('[data-role="cart"]')).toBeHidden();
      await expect(page.locator('[data-role="submit"]')).toBeDisabled();
      await expect(page.locator('[data-role="submit"]')).toHaveValue(state.label);
      await page.locator('form').dispatchEvent('submit');
      expect(await page.evaluate(() => window.registrationTest.carts)).toBe(0);
    }
  });
}

test('an open detail page closes at the cutoff and stays disabled on focus/input', async ({
  page,
}) => {
  await page.clock.install({ time: cutoff - 1000 });
  await page.clock.pauseAt(cutoff - 1000);
  await page.setContent(detailMarkup);
  await initialize(page, detailScript);
  await page.clock.runFor(1000);
  await expect(page.locator('.event_content_warning h4')).toHaveText(
    'Event registration is closed.'
  );
  await page.evaluate(() => {
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.locator('form').dispatchEvent('input');
  await page.locator('form').dispatchEvent('change');
  await expect(page.locator('[data-role="submit"]')).toBeDisabled();
  await page.clock.runFor(REGISTRATION_BUFFER_MS);
  await expect(page.locator('main')).toHaveAttribute('data-event-status', 'passed');
});

test('submission checks the cutoff even before the timer refreshes the page', async ({ page }) => {
  await page.clock.install({ time: cutoff - 1000 });
  await page.clock.pauseAt(cutoff - 1000);
  await page.setContent(detailMarkup);
  await initialize(page, detailScript);
  await page.clock.setFixedTime(cutoff);
  await page.locator('form').dispatchEvent('submit');
  await expect(page.locator('.event_content_warning h4')).toHaveText(
    'Event registration is closed.'
  );
  expect(await page.evaluate(() => window.registrationTest.carts)).toBe(0);
});

test('listing changes from open to closed to passed without hiding its link', async ({ page }) => {
  await page.clock.install({ time: cutoff - 1000 });
  await page.clock.pauseAt(cutoff - 1000);
  await page.setContent(`
    <style>.hide { display: none; }</style>
    <article data-product-id="event-1">
      <span data-field="seats"></span><a data-role="link" href="/events/test-event">View</a>
      <div class="event_item_warning hide"><span data-field="warning"></span></div>
    </article>
  `);
  await initialize(page, listingScript);
  await expect(page.locator('.event_item_warning')).toBeHidden();
  await page.clock.runFor(1000);
  await expect(page.locator('article')).toHaveAttribute('data-event-status', 'closed');
  await expect(page.locator('.event_item_warning')).toBeVisible();
  await expect(page.locator('[data-field="warning"]')).toHaveText('Registration Closed');
  await expect(page.getByRole('link')).toBeVisible();
  await page.clock.runFor(REGISTRATION_BUFFER_MS);
  await expect(page.locator('article')).toHaveAttribute('data-event-status', 'passed');
  await expect(page.locator('[data-field="warning"]')).toHaveText('Past Event');
  await expect(page.getByRole('link')).toBeVisible();
});

test('reserved CMS IDs are limited to staging and localhost', () => {
  for (const state of ['open', 'closed', 'passed', 'sold-out']) {
    const fixture = getPreviewEvent(`test-${state}`, 'events.webflow.io');
    expect(fixture).not.toBeNull();
    expect(getProductEventStatus(fixture!)).toBe(state);
    expect(getPreviewEvent(`test-${state}`, 'localhost')).not.toBeNull();
    expect(getPreviewEvent(`test-${state}`, '127.0.0.1')).not.toBeNull();
    expect(getPreviewEvent(`test-${state}`, 'www.lostlevelsarcade.com')).toBeNull();
    expect(getPreviewEvent(`test-${state}`, 'events.webflow.io.example.com')).toBeNull();
  }
  expect(getPreviewEvent('123456789', 'events.webflow.io')).toBeNull();
  expect(getPreviewEvent('test-unknown', 'events.webflow.io')).toBeNull();
});

async function previewPage(page: Page, markup: string, hostname = 'events.webflow.io') {
  await page.route(`https://${hostname}/**`, (route) =>
    route.fulfill({ contentType: 'text/html', body: markup })
  );
  await page.goto(`https://${hostname}/events/preview`);
}

for (const state of ['open', 'closed', 'passed', 'sold-out']) {
  test(`CMS ID test-${state} renders details without reading Shopify`, async ({ page }) => {
    // A reserved CMS ID takes priority even if an existing handle is still bound.
    await previewPage(
      page,
      detailMarkup.replace(
        'data-handle="test-event"',
        `data-handle="real-event" data-id="test-${state}"`
      )
    );
    await initialize(page, detailScript);
    await expect(page.locator('main')).toHaveAttribute('data-event-status', state);
    if (state === 'open') {
      await page.locator('[data-role="submit"]').click();
      await expect(page.locator('[data-role="error"]')).toHaveText(
        'This is a test event. Checkout is disabled.'
      );
    } else {
      await expect(page.locator('.event_content_warning')).toBeVisible();
      await expect(page.locator('[data-role="submit"]')).toBeDisabled();
    }
    expect(await page.evaluate(() => window.registrationTest.reads)).toBe(0);
    expect(await page.evaluate(() => window.registrationTest.carts)).toBe(0);
  });
}

test('all four test IDs render listing cards without reading Shopify', async ({ page }) => {
  await previewPage(
    page,
    ['open', 'closed', 'passed', 'sold-out']
      .map(
        (state) => `
    <article data-product-id="test-${state}">
      <span data-field="seats"></span><a data-role="link" href="/events/test-${state}">View</a>
    </article>
  `
      )
      .join('')
  );
  await initialize(page, listingScript);
  for (const state of ['open', 'closed', 'passed', 'sold-out']) {
    const card = page.locator(`[data-product-id="test-${state}"]`);
    await expect(card).toHaveAttribute('data-event-status', state);
    await expect(card.getByRole('link')).toBeVisible();
  }
  expect(await page.evaluate(() => window.registrationTest.reads)).toBe(0);
});

test('test cards are excluded from Shopify queries on a mixed listing', async ({ page }) => {
  await page.clock.install({ time: cutoff - 1000 });
  await page.clock.pauseAt(cutoff - 1000);
  await previewPage(
    page,
    `
    <article data-product-id="event-1"><span data-field="seats"></span></article>
    <article data-product-id="test-closed"><span data-field="seats"></span></article>
  `
  );
  await initialize(page, listingScript);
  await expect(page.locator('[data-product-id="event-1"]')).toHaveAttribute(
    'data-event-status',
    'open'
  );
  await expect(page.locator('[data-product-id="test-closed"]')).toHaveAttribute(
    'data-event-status',
    'closed'
  );
  expect(await page.evaluate(() => window.registrationTest.requestedIds)).toEqual(['event-1']);
});

test('a reserved ID on the live domain cannot fall back to a real Shopify product', async ({
  page,
}) => {
  await previewPage(
    page,
    detailMarkup.replace(
      'data-handle="test-event"',
      'data-handle="real-event" data-id="test-open"'
    ),
    'www.lostlevelsarcade.com'
  );
  await initialize(page, detailScript);
  await expect(page.locator('[data-role="submit"]')).toBeDisabled();
  expect(await page.evaluate(() => window.registrationTest.reads)).toBe(0);
  expect(await page.evaluate(() => window.registrationTest.carts)).toBe(0);
});
