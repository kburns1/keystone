import type { ToolConfig } from "@/lib/types";
import { amlAlertsTool } from "./aml-alerts";
import { featureFlagsTool } from "./feature-flags";
import { kycTool } from "./kyc";
import { refundsTool } from "./refunds";

// The registry is the whole "platform": adding tool N+1 means adding one
// config file and one line here. See AGENTS.md.
export const TOOLS: ToolConfig[] = [kycTool, refundsTool, featureFlagsTool, amlAlertsTool];

export function getTool(slug: string): ToolConfig | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
