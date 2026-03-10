import type { PackSummary, PackAudit } from "./types.js";

/**
 * Render a plain serializable JSON review object.
 */
export function renderPackSummaryJson(
  summary: PackSummary,
  audit: PackAudit,
): { summary: PackSummary; audit: PackAudit } {
  return { summary, audit };
}
