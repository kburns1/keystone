import type { ToolConfig } from "@/lib/types";
import { accessRequestsTool } from "./access-requests";
import { featureFlagsTool } from "./feature-flags";
import { kycTool } from "./kyc";
import { refundsTool } from "./refunds";

// The registry is the whole "platform": adding tool N+1 means adding one
// config file and one line here. See AGENTS.md.
export const TOOLS: ToolConfig[] = [kycTool, refundsTool, featureFlagsTool, accessRequestsTool];

export function getTool(slug: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
