import type { ToolConfig } from "@/lib/types";

export const amlAlertsTool: ToolConfig = {
  slug: "aml-alerts",
  name: "AML Alerts",
  description: "Triage transaction-monitoring alerts for analyst disposition.",
  titleField: "customer",
  statusField: "status",
  fields: [
    { key: "customer", label: "Customer", type: "text", showInList: true, required: true },
    { key: "alertType", label: "Alert type", type: "select", options: ["structuring", "high_velocity", "sanctioned_jurisdiction", "unusual_pattern"], showInList: true, required: true },
    { key: "amount", label: "Amount", type: "currency", showInList: true },
    { key: "riskLevel", label: "Risk", type: "select", options: ["low", "medium", "high"], showInList: true, required: true },
    { key: "status", label: "Status", type: "select", options: ["open", "dismissed", "escalated", "sar_filed"], showInList: true },
    { key: "openedAt", label: "Opened", type: "date", showInList: true },
    { key: "analystNotes", label: "Analyst notes", type: "textarea" },
  ],
  filters: [
    { key: "status", label: "Status" },
    { key: "alertType", label: "Alert type" },
  ],
  actions: [
    { key: "dismiss", label: "Dismiss", roles: ["admin", "reviewer"], set: { status: "dismissed" }, requiresNote: true },
    { key: "escalate", label: "Escalate", roles: ["admin", "reviewer"], set: { status: "escalated" } },
    { key: "file-sar", label: "File SAR", roles: ["admin"], set: { status: "sar_filed" }, requiresNote: true },
  ],
};
