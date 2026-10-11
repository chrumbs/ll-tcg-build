# LL TCG Build

LL TCG built with Webflow and Shopify Storefront API.

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
