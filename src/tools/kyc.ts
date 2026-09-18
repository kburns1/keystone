import type { ToolConfig } from "@/lib/types";

export const kycTool: ToolConfig = {
  slug: "kyc",
  name: "KYC Review Queue",
  description: "Review and disposition inbound identity-verification cases.",
  titleField: "applicant",
  statusField: "status",
  fields: [
    { key: "applicant", label: "Applicant", type: "text", showInList: true, required: true },
    { key: "entityType", label: "Entity", type: "select", options: ["individual", "business"], showInList: true, required: true },
    { key: "jurisdiction", label: "Jurisdiction", type: "text", showInList: true },
    { key: "riskLevel", label: "Risk", type: "select", options: ["low", "medium", "high"], showInList: true, required: true },
    { key: "status", label: "Status", type: "select", options: ["pending", "approved", "rejected", "escalated"], showInList: true },
    { key: "submittedAt", label: "Submitted", type: "date", showInList: true },
    { key: "notes", label: "Analyst notes", type: "textarea" },
  ],
  filters: [
    { key: "status", label: "Status" },
    { key: "riskLevel", label: "Risk" },
    { key: "entityType", label: "Entity" },
  ],
  actions: [
    { key: "approve", label: "Approve", roles: ["admin", "reviewer"], set: { status: "approved" } },
    { key: "reject", label: "Reject", roles: ["admin", "reviewer"], set: { status: "rejected" }, requiresNote: true, destructive: true },
    { key: "escalate", label: "Escalate", roles: ["admin", "reviewer"], set: { status: "escalated" }, requiresNote: true },
    { key: "reopen", label: "Reopen", roles: ["admin"], set: { status: "pending" } },
  ],
};
