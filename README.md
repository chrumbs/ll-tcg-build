# LL TCG Build

LL TCG built with Webflow and Shopify Storefront API.

## Event registration states

Registration closes exactly two hours before the Shopify product's
`custom.start_time`. For a 6:00 PM event, new registrations close at 4:00 PM.
Keep this date/time accurate, including its timezone offset.

The listing and detail page use the same state rules, in this order:

| State      | Condition                          | Listing label            | Detail warning                |
| ---------- | ---------------------------------- | ------------------------ | ----------------------------- |
| `passed`   | Start time has been reached        | Past Event               | This event has passed.        |
| `closed`   | Within two hours before the start  | Registration Closed      | Event registration is closed. |
| `sold-out` | Before the cutoff, no seats remain | Sold Out                 | This event is sold out.       |
| `open`     | Before the cutoff, seats remain    | Existing open seat count | Hidden                        |

Time takes priority over inventory: a sold-out event becomes closed at the cutoff
and passed at the start. The existing passed state means the event has started,
not necessarily finished. Missing or invalid start times retain the existing
inventory-only behavior, so every event must have a valid start time to enforce
the cutoff.

### Webflow configuration

1. On every event listing card, keep `data-product-id` set to its Shopify product
   ID and its overlay link's `data-role="link"`. Bind the link to the event CMS
   detail page for every state. Keep the existing `data-field="seats"` label.
2. Remove CMS collection filters, conditional visibility, or interactions that
   remove past/sold-out events or their links if those events should stay visible.
   Keep those CMS items published and their Shopify products available to the
   Storefront API so details can still load.
3. Remove any `pointer-events: none`, link-hiding rules, or click-blocking
   interactions from listing card state classes (`inactive`, `past-event`,
   `sold-out`, `closed`). The script keeps `active` on every card and removes
   `inactive`/`aria-disabled`. It adds `data-event-status` with the current state
   plus `past-event`, `sold-out`, or `closed` for optional visual styling.
   Scope listing styles so they do not disable the card link; detail ticket
   selectors still use `sold-out` to disable registration choices.
4. On the event CMS template, use one `.event_content_warning` wrapper containing
   an `h4` (or `.heading-style-h4`). Give the wrapper the existing `hide` class
   (`display: none`) by default. Remove CMS conditional visibility from it; the
   script controls its visibility and heading. Place it outside
   `.event_content_form`, `.event_content_upsell`, and `[data-role="cart"]`,
   since those sections are hidden when registration is unavailable.
5. Keep `.event_content_wrapper` around the event content, and retain
   `.event_content_form`, `.event_content_upsell`, `[data-role="ticket"]`,
   `[data-role="submit"]`, and `[data-role="cart"]` on their existing elements.
   Event information stays visible; unavailable states hide the form, upsells,
   and cart and disable ticket selection/submission.

### Homepage listing warnings

Replace each card's separate `.event_item_sold-out` and `.event_item_past-event`
elements with one `.event_item_warning` wrapper. Add the `hide` class to the
wrapper initially (`display: none`), and place a text element inside it with
`data-field="warning"`. Both must be inside the card carrying `data-product-id`.
Use the wrapper's normal Webflow display setting (for example, block or flex);
only its `hide` combo class should hide it. Remove CMS conditional visibility
and old state-specific display rules from the new elements.

```html
<div class="event_item_warning hide">
  <div data-field="warning"></div>
</div>
```

The listing code hides and clears the warning when open; otherwise it shows
“Registration Closed”, “Past Event”, or “Sold Out”. It updates when an open page
crosses a time boundary. The `[data-field="seats"]` label continues to update
separately, and the card's detail link stays active in every state.

Remove the embed's `.inactive`, `.inactive.sold-out`, and `.inactive.past-event`
rules, including their nested selectors. Keep the independent empty-banner rule:

```css
.event_banner_cms-wrapper:empty {
  display: none;
}
```

This listing wrapper is separate from the detail page's
`.event_content_warning`; retain both in their respective locations.

No manual CMS `closed` field or scheduled Webflow publishing is needed. Time
states update while a page remains open and when a visitor returns to it. The
submission handler checks the current time again before creating a Shopify cart;
focus/input/change handlers cannot re-enable registration after the cutoff.
Inventory is still the snapshot fetched when the page loads. This is a browser
guard for new carts created through this site; it does not expire a Shopify
checkout already created before the cutoff or enforce a checkout-side deadline.

Build and deploy both `dist/index.js` (listings) and `dist/events/index.js`
(details), then publish the Webflow changes. Verify links work for all four
states, the warning is outside hidden sections, and an open page closes at the
two-hour boundary. The boundary and registration tests run with
`pnpm exec playwright test tests/event-registration.spec.ts --project=chromium`.

## Preview event states without Shopify products

On Webflow staging (`*.webflow.io`) or localhost, these reserved product ID values
load built-in sample events instead of requesting a Shopify product:

| CMS product ID  | State on load | Sample start              | Seats   |
| --------------- | ------------- | ------------------------- | ------- |
| `test-open`     | Open          | Four hours from page load | 8 of 16 |
| `test-closed`   | Closed        | One hour from page load   | 8 of 16 |
| `test-passed`   | Passed        | One hour before page load | 8 of 16 |
| `test-sold-out` | Sold out      | Four hours from page load | 0 of 16 |

Create one test event CMS item and change its product ID to preview each state,
or create four items to compare them together. These are values for the CMS
**Shopify product ID field**, not the Webflow CMS item's own ID. The field must
accept text, not just numbers. On the event template, bind that field to
`#event-meta`'s `data-id`; on listing cards, bind it to `data-product-id`. Keep the
usual CMS title, image, slug, and detail-page link configured. A reserved test ID
takes priority over the detail page's product handle, so no matching Shopify
handle or product is needed.

Publish the test items and updated scripts to the Webflow staging site, then open
their staging URLs in a browser. The test IDs work with both development and
production bundles. They are disabled on custom domains and do not activate in
the Webflow Designer's canvas. Keep test items out of production listings using
your publishing workflow. An unsupported host cannot load these sample events
or fall back to a real product via a leftover handle.

Sample tickets cost $10 and use Magic / Standard with a 120-minute duration.
The code supplies sample dates and inventory; CMS date/inventory values do not
control the test state. Each page load generates new relative dates, and the
normal time transitions still apply if the page stays open. Existing CMS filters
must allow the test items to appear in listings.

Open test events render the usual form and run normal validation. After valid
details are submitted, they show “This is a test event. Checkout is disabled.”
They never create a Shopify cart or redirect to checkout. These previews cover
the event UI and form validation, not Shopify checkout or live inventory.

## Event form setup in Webflow

Set the Shopify product's `custom.game_type` metafield to a supported value below.
Matching is case-insensitive; use the exact spelling and spacing shown. One event
form can contain all account sections: the script shows the section for the
product's game and hides the others.

### Shared form elements

Apply these custom attributes to the existing form elements:

| Element                 | Custom attribute               |
| ----------------------- | ------------------------------ |
| Form                    | `data-role="event-form"`       |
| Player first name input | `data-role="field-first-name"` |
| Player last name input  | `data-role="field-last-name"`  |
| Phone input             | `data-role="field-phone"`      |
| Date of birth input     | `data-role="field-bday"`       |
| Submit button           | `data-role="submit"`           |
| Error message element   | `data-role="error"`            |

Player details are required for every game. The current minimum player age is 12.
Give the error element the existing `hide` class (`display: none`).

### Game-specific fields

Use the following values for each game's account section and optional detail field.
Gundam and One Piece share one TCG Plus section; do not duplicate it.

| `gameType`            | Account/app label             | Account wrapper `data-role` and radio group/name | Detail wrapper `data-role` | Detail input `data-role` |
| --------------------- | ----------------------------- | ------------------------------------------------ | -------------------------- | ------------------------ |
| `magic`               | MTG Companion App             | `mtg-account`                                    | None                       | None                     |
| `gundam`, `one piece` | TCG Plus account              | `tcg-account`                                    | `tcg-username`             | `field-tcg-username`     |
| `lorcana`             | Ravensburger Play Hub account | `rph-account`                                    | `rph-username`             | `field-rph-username`     |
| `riftbound`           | Riftbound account             | `rift-account`                                   | `rift-username`            | `field-rift-username`    |
| `pokemon`             | Pokémon ID                    | `pokemon-account`                                | `pokemon-id`               | `field-pokemon-id`       |

For each account section inside the event form:

1. Add a wrapper with the account `data-role` from the table and the `hide` class.
2. Add an account question and two radio inputs inside that wrapper. Both inputs
   must use the table's exact radio group/name. Give the Yes input the ID
   `<group>-true` and value `Yes`; give the No input the ID `<group>-false` and
   value `No`. For example, TCG Plus uses `tcg-account-true` and `tcg-account-false`.
3. Where the table specifies a detail field, add a separate wrapper outside the
   account wrapper, but still inside the form. Apply its detail `data-role` and
   the `hide` class.
4. Add a text input inside the detail wrapper with the exact input `data-role`
   from the table. Its name and ID can match the detail wrapper's role. Label it
   with the service's username, or “Pokémon ID” for Pokémon.
5. Leave the detail input's Webflow Required setting off. The script reveals and
   requires the input when Yes is selected, and hides it when No is selected.

Set radio names and IDs on the actual inputs, not their wrappers. All IDs must be
unique. Magic requires only the Companion App question; do not add a username field.
Names such as `requireTcgAccount` and `requireRiftUsername` are internal TypeScript
flags, not Webflow attributes.

With these sections configured, No or an unanswered account question blocks
checkout through the error element. Yes requires a nonblank username/ID where
specified. Unrecognized or empty game types have no game-specific account
requirements; shared player fields still apply.

### Adding another game type

Webflow fields alone do not register a new game type. Update these source files:

1. `src/events/types.ts`: add any new account/detail requirement flags to `FormState`.
2. `src/events/form/formManager.ts`: initialize and reset the flags, route the game
   type to its fields, register radio listeners, include the sections in hiding
   and initial-selection handling, and validate the account and detail input.
   Games using an existing account service can reuse that service's fields.
3. `src/events/form/formSubmission.ts`: read any new account/detail values and add
   the corresponding Shopify event line-item attributes.
4. Add the Webflow elements and update the mapping table above.

### Build and publish

Run `pnpm check`, `pnpm lint`, and `pnpm build`. Deploy `dist/events/index.js`
through the site's existing script hosting setup and publish the Webflow changes
together.

On a test event for each game, verify unanswered and No selections block checkout,
Yes reveals the required detail field where applicable, and other account sections
stay hidden. Verify the player and game-specific details on the Shopify line item.

## TypeScript configuration

`tsconfig.json` keeps the compiler settings locally rather than inheriting the
Finsweet preset's deprecated `downlevelIteration` option. The `$utils/*` alias maps
directly to `./src/utils/*`, without `baseUrl`. This avoids the TypeScript 6
deprecations while remaining compatible with the project's installed TypeScript.
Use `pnpm check` for type checking; esbuild generates the production bundles.

## Local development and production bundles

`pnpm dev` serves development bundles from `.dev-dist` at `http://localhost:3000`.
Development bundles include a live-reload connection to the local server.
`pnpm build` writes production bundles to `dist` without live reload. Only deploy
the production bundles in `dist`. Restart any dev server started before this
folder separation so it no longer writes to `dist`.
