# Working on Keystone

## What this repo is

A config-driven internal-tools runtime. Do **not** build tool-specific pages or endpoints — tools are data (`ToolConfig`), the runtime is shared.

## Adding a new tool (the common task)

1. Create `src/tools/<slug>.ts` exporting a `ToolConfig` (see `src/lib/types.ts`).
2. Register it in `src/tools/index.ts` (`TOOLS` array).
3. Add seed rows in `src/db/seed.ts` keyed by the same `slug`.
4. `npm run seed` to reset local data; `npm run dev` to verify.

That's it — list view, filters, detail page, create form, actions, RBAC, and audit trail are automatic.

## Invariants — don't break these

- **Every mutation goes through `performAction`/`createRecord`** in `src/lib/actions.ts` and writes an `audit_events` row with actor, action, note, before/after JSON. No direct `db.update` elsewhere.
- **Role checks are server-side only.** Never trust a role passed from the client.
- **Fields are the contract.** `filters[].key` and `statusField` must reference real `fields[].key`s. `titleField` must exist.
- **Currency is integer cents** everywhere (seed, forms, display).
- **Stored values are machine-readable, the UI is not.** `select` option keys (`duplicate_charge`), field keys, action keys and role names render through the helpers in `src/lib/format.ts` (`humanize`, `formatCurrencyCents`, `booleanLabel`) — never raw.
- Keep tool configs declarative — no functions/components inside `ToolConfig`.

## Field types available

`text`, `textarea`, `number`, `currency` (cents), `date` (ISO string), `select` (with `options`), `boolean`. To add a type: extend `FieldType` in `src/lib/types.ts`, render it in `src/components/FieldValue.tsx`, parse it in `createRecord`, and give it an input in `src/app/t/[slug]/new/page.tsx`.

## Verify

`npm run build` must pass. Manual smoke: home lists tools, `/t/<slug>` filters work, actions respect the role switcher, audit log records the mutation.
