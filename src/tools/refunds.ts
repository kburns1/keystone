import type { ToolConfig } from "@/lib/types";

export const refundsTool: ToolConfig = {
  slug: "refunds",
  name: "Refunds Dashboard",
  description: "Triage and disposition customer refund requests.",
  titleField: "customer",
  statusField: "status",
  fields: [
    { key: "customer", label: "Customer", type: "text", showInList: true, required: true },
    { key: "amount", label: "Amount", type: "currency", showInList: true, required: true },
    { key: "reason", label: "Reason", type: "select", options: ["duplicate_charge", "service_issue", "fraud_claim", "billing_error"], showInList: true, required: true },
    { key: "status", label: "Status", type: "select", options: ["pending", "approved", "denied"], showInList: true },
    { key: "requestedAt", label: "Requested", type: "date", showInList: true },
  ],
  filters: [
    { key: "status", label: "Status" },
    { key: "reason", label: "Reason" },
  ],
  actions: [
    { key: "approve", label: "Approve refund", roles: ["admin", "reviewer"], set: { status: "approved" } },
    { key: "deny", label: "Deny refund", roles: ["admin", "reviewer"], set: { status: "denied" }, requiresNote: true, destructive: true },
    { key: "reopen", label: "Reopen", roles: ["admin"], set: { status: "pending" } },
  ],
};
