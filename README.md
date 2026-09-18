# Keystone — config-driven internal tools

A prototype answer to: *"can we stop paying for an internal-tools platform and just build them?"*

Keystone is a shared runtime where **each internal tool is a single typed config file**. Queue views, detail pages, filters, role-checked actions, and a full audit trail come from the platform — a new tool is one `ToolConfig` plus one line in the registry.

Ships five tools: the client's three (**KYC review queue**, **refunds dashboard**, **feature-flag admin**) plus **access requests** and **AML alerts** — the latter two authored end-to-end by Devin Cloud sessions and merged as PRs ([#4](../../pull/4), [#5](../../pull/5)). Each landed as one config file + one registry line + seed rows.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 — DB auto-creates and seeds on first boot
npm run seed       # reset + reseed the SQLite DB
```

No env vars, no services. SQLite lives in `data/keystone.db` (gitignored).

## Try it

- Switch identity (top-right: admin / reviewer / viewer) — actions are role-checked server-side.
- Approve/reject/escalate a KYC case; every mutation lands in the **Audit log** (nav) and on the record's own trail.
- Toggle a feature flag; deny a refund (note required).
- `+ New record` on any tool — the form is generated from the config.

## How a tool is defined

```ts
// src/tools/kyc.ts (abridged)
export const kycTool: ToolConfig = {
  slug: "kyc",
  titleField: "applicant",
  statusField: "status",
  fields: [ /* typed fields: text, select, currency, date, boolean… */ ],
  filters: [ { key: "status", label: "Status" } ],
  actions: [
    { key: "approve", label: "Approve", roles: ["admin","reviewer"], set: { status: "approved" } },
    { key: "reject",  label: "Reject",  roles: ["admin","reviewer"], set: { status: "rejected" },
      requiresNote: true, destructive: true },
  ],
};
```

`fields` drive the list columns, detail page, and create form. `actions` drive the buttons, the role gate, and the audit write. **Tool #4 is a new file in `src/tools/` + one entry in `src/tools/index.ts`.**

## Architecture

| Piece | Where | Notes |
|---|---|---|
| Tool registry | `src/tools/` | one `ToolConfig` per tool |
| Generic views | `src/app/t/[slug]/…` | list, detail, create — tool-agnostic |
| Mutations | `src/lib/actions.ts` | server actions: role check → apply `set` → audit row |
| Storage | `src/db/` | `records` (JSON doc per record) + `audit_events`, Drizzle + SQLite |
| Auth | `src/lib/auth.ts` | **stub**: cookie + user switcher; role checks are real |

## Honest limitations (what a production version needs)

- **Auth is a stub.** Identity is a demo cookie; RBAC enforcement is real but authentication isn't. Production: WorkOS/Auth.js against the company IdP — ~a day of work, not a rebuild.
- **SQLite.** Chosen for zero-infra demo. Drizzle schema + Postgres swap is the migration path.
- **No connectors.** Records are local JSON docs. A real tool reads/writes production services via its `actions` — each integration is real code.
- **No tests, no deploy config.** This is a 2-hour prototype, not a platform.

## What this is for

Built as a build-vs-buy evaluation artifact: it demonstrates that once a scaffold exists, the marginal cost of an internal tool approaches *one config file + one Devin session + one PR review* — the property you're actually buying from a platform like Power Apps.
