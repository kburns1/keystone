import type { ToolConfig } from "@/lib/types";

export const accessRequestsTool: ToolConfig = {
  slug: "access-requests",
  name: "Access Requests",
  description: "Approve or deny employee access requests to internal systems.",
  titleField: "requester",
  statusField: "status",
  fields: [
    { key: "requester", label: "Requester", type: "text", showInList: true, required: true },
    { key: "system", label: "System", type: "select", options: ["github", "aws", "salesforce", "vpn_prod"], showInList: true, required: true },
    { key: "accessLevel", label: "Access level", type: "select", options: ["read", "write", "admin"], showInList: true },
    { key: "justification", label: "Justification", type: "textarea" },
    { key: "status", label: "Status", type: "select", options: ["pending", "approved", "denied"], showInList: true },
    { key: "requestedAt", label: "Requested", type: "date", showInList: true },
  ],
  filters: [
    { key: "status", label: "Status" },
    { key: "system", label: "System" },
  ],
  actions: [
    { key: "approve", label: "Approve", roles: ["admin", "reviewer"], set: { status: "approved" } },
    { key: "deny", label: "Deny", roles: ["admin", "reviewer"], set: { status: "denied" }, requiresNote: true, destructive: true },
  ],
};
