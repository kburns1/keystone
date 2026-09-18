import type { ToolConfig } from "@/lib/types";

export const featureFlagsTool: ToolConfig = {
  slug: "feature-flags",
  name: "Feature Flags",
  description: "Administer feature flags and rollout percentages.",
  titleField: "key",
  statusField: "enabled",
  fields: [
    { key: "key", label: "Flag key", type: "text", showInList: true, required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "enabled", label: "Enabled", type: "boolean", showInList: true },
    { key: "owner", label: "Owning team", type: "text", showInList: true },
    { key: "rolloutPct", label: "Rollout %", type: "number", showInList: true },
  ],
  filters: [{ key: "enabled", label: "State" }],
  actions: [
    { key: "enable", label: "Enable (100%)", roles: ["admin", "reviewer"], set: { enabled: true, rolloutPct: 100 } },
    { key: "disable", label: "Disable", roles: ["admin", "reviewer"], set: { enabled: false, rolloutPct: 0 }, destructive: true },
  ],
};
