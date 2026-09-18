import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { auditEvents, records } from "./schema";

const DAY = 86_400_000;

function rec(
  tool: string,
  data: Record<string, unknown>,
  ageDays: number,
  actor = "system",
) {
  const id = crypto.randomUUID();
  const t = Date.now() - ageDays * DAY;
  return {
    record: {
      id,
      tool,
      data: JSON.stringify(data),
      createdAt: t,
      updatedAt: t,
    },
    event: {
      id: crypto.randomUUID(),
      tool,
      recordId: id,
      actor,
      action: "create",
      note: null,
      before: null,
      after: JSON.stringify(data),
      createdAt: t,
    },
  };
}

export function seed(db: BetterSQLite3Database) {
  const kyc = [
    { applicant: "Nora Okafor", entityType: "individual", jurisdiction: "US", riskLevel: "low", status: "pending", submittedAt: "2026-09-14", notes: "" },
    { applicant: "Meridian Logistics LLC", entityType: "business", jurisdiction: "US", riskLevel: "high", status: "pending", submittedAt: "2026-09-13", notes: "UBO chain has a Cayman layer — needs second look." },
    { applicant: "Tomas Reyes", entityType: "individual", jurisdiction: "MX", riskLevel: "medium", status: "pending", submittedAt: "2026-09-13", notes: "" },
    { applicant: "Bluefin Trading Corp", entityType: "business", jurisdiction: "GB", riskLevel: "high", status: "escalated", submittedAt: "2026-09-11", notes: "Director matched on sanctions-adjacent list; escalated to compliance." },
    { applicant: "Aiko Tanaka", entityType: "individual", jurisdiction: "JP", riskLevel: "low", status: "approved", submittedAt: "2026-09-10", notes: "" },
    { applicant: "Harbor & Main LLC", entityType: "business", jurisdiction: "US", riskLevel: "medium", status: "pending", submittedAt: "2026-09-10", notes: "" },
    { applicant: "Felix Braun", entityType: "individual", jurisdiction: "DE", riskLevel: "low", status: "approved", submittedAt: "2026-09-09", notes: "" },
    { applicant: "Sable Peak Ventures", entityType: "business", jurisdiction: "US", riskLevel: "medium", status: "pending", submittedAt: "2026-09-08", notes: "Waiting on articles of incorporation." },
    { applicant: "Priya Nair", entityType: "individual", jurisdiction: "IN", riskLevel: "medium", status: "rejected", submittedAt: "2026-09-07", notes: "Document expiration date unreadable after two resubmissions." },
    { applicant: "Cormorant Freight SA", entityType: "business", jurisdiction: "BR", riskLevel: "high", status: "pending", submittedAt: "2026-09-06", notes: "" },
    { applicant: "Jonah Whitfield", entityType: "individual", jurisdiction: "US", riskLevel: "low", status: "pending", submittedAt: "2026-09-05", notes: "" },
    { applicant: "Kestrel Pay GmbH", entityType: "business", jurisdiction: "DE", riskLevel: "high", status: "escalated", submittedAt: "2026-09-04", notes: "MSB license verification pending with BaFin equivalent." },
  ];

  const refunds = [
    { customer: "cst_8f31d2", amount: 12900, reason: "duplicate_charge", status: "pending", requestedAt: "2026-09-15" },
    { customer: "cst_2a77bc", amount: 45250, reason: "service_issue", status: "pending", requestedAt: "2026-09-14" },
    { customer: "cst_9d01ef", amount: 9900, reason: "duplicate_charge", status: "approved", requestedAt: "2026-09-13" },
    { customer: "cst_44caa1", amount: 210000, reason: "fraud_claim", status: "pending", requestedAt: "2026-09-12" },
    { customer: "cst_76be30", amount: 7500, reason: "service_issue", status: "denied", requestedAt: "2026-09-11" },
    { customer: "cst_1d59f8", amount: 33800, reason: "billing_error", status: "approved", requestedAt: "2026-09-10" },
    { customer: "cst_65e2c4", amount: 15000, reason: "duplicate_charge", status: "pending", requestedAt: "2026-09-09" },
    { customer: "cst_3b90d7", amount: 52400, reason: "fraud_claim", status: "pending", requestedAt: "2026-09-08" },
    { customer: "cst_88a1e9", amount: 6100, reason: "billing_error", status: "approved", requestedAt: "2026-09-06" },
    { customer: "cst_50f6b2", amount: 18750, reason: "service_issue", status: "pending", requestedAt: "2026-09-05" },
  ];

  const flags = [
    { key: "instant_payouts", description: "Enable same-day payout rails for eligible merchants.", enabled: true, owner: "payments", rolloutPct: 100 },
    { key: "kyc_v2_flow", description: "New document-capture KYC flow with liveness check.", enabled: true, owner: "compliance", rolloutPct: 40 },
    { key: "dark_mode_dashboard", description: "Dark theme for the merchant dashboard.", enabled: false, owner: "growth", rolloutPct: 0 },
    { key: "ach_same_day", description: "Same-day ACH settlement option at checkout.", enabled: false, owner: "payments", rolloutPct: 0 },
    { key: "risk_engine_v3", description: "Shadow-mode scoring from the new risk engine.", enabled: true, owner: "risk", rolloutPct: 15 },
    { key: "multi_currency_wallets", description: "Hold balances in EUR/GBP in addition to USD.", enabled: false, owner: "core", rolloutPct: 0 },
  ];

  const accessRequests = [
    { requester: "Dana Whitlock", system: "github", accessLevel: "write", justification: "Joining the payments service team; needs to open PRs on the core repos.", status: "pending", requestedAt: "2026-09-16" },
    { requester: "Marcus Bell", system: "aws", accessLevel: "admin", justification: "On-call rotation for the platform team starting next sprint.", status: "pending", requestedAt: "2026-09-15" },
    { requester: "Sofia Marchetti", system: "salesforce", accessLevel: "read", justification: "Needs pipeline reporting for the quarterly revenue review.", status: "approved", requestedAt: "2026-09-13" },
    { requester: "Owen Park", system: "vpn_prod", accessLevel: "admin", justification: "Debugging a production incident from a personal laptop.", status: "denied", requestedAt: "2026-09-11" },
  ];

  const amlAlerts = [
    { customer: "cst_c41a0e", alertType: "structuring", amount: 985000, riskLevel: "high", status: "open", openedAt: "2026-09-16", analystNotes: "Eleven cash deposits just under $10k across three branches in 48 hours." },
    { customer: "cst_7e2b93", alertType: "high_velocity", amount: 2340000, riskLevel: "medium", status: "open", openedAt: "2026-09-15", analystNotes: "" },
    { customer: "cst_19fd6a", alertType: "sanctioned_jurisdiction", amount: 415000, riskLevel: "high", status: "escalated", openedAt: "2026-09-13", analystNotes: "Counterparty bank domiciled in a comprehensively sanctioned country." },
    { customer: "cst_a05c72", alertType: "unusual_pattern", amount: 62000, riskLevel: "low", status: "dismissed", openedAt: "2026-09-11", analystNotes: "Seasonal payroll spike; matches prior-year activity." },
    { customer: "cst_d8e314", alertType: "structuring", amount: 1875000, riskLevel: "high", status: "sar_filed", openedAt: "2026-09-08", analystNotes: "SAR filed after confirming layered transfers through two shell entities." },
  ];

  const rows = [
    ...kyc.map((d, i) => rec("kyc", d, i + 1)),
    ...refunds.map((d, i) => rec("refunds", d, i + 1)),
    ...flags.map((d, i) => rec("feature-flags", d, i + 1)),
    ...accessRequests.map((d, i) => rec("access-requests", d, i + 1)),
    ...amlAlerts.map((d, i) => rec("aml-alerts", d, i + 1)),
  ];

  for (const { record, event } of rows) {
    db.insert(records).values(record).run();
    db.insert(auditEvents).values(event).run();
  }
}
