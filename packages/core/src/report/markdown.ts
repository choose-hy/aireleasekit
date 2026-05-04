import { RunReport } from "../types.js";
import { decideRelease } from "./decision.js";

export function generateMarkdownReport(input: RunReport): string {
  const report = { ...input, decision: input.decision ?? decideRelease(input, input.config) };
  const failed = report.results.filter((result) => !result.passed).slice(0, 10);
  const categories = Object.entries(report.summary.pass_rate_by_category)
    .map(([category, rate]) => `| ${category} | ${(rate * 100).toFixed(1)}% |`)
    .join("\n");

  return `# AIReleaseKit Report

## Launch Decision: ${report.decision.decision}

${report.decision.reasons.map((reason) => `- ${reason}`).join("\n")}

## Scorecard

| Metric | Value |
| --- | ---: |
| Overall pass rate | ${(report.summary.overall_pass_rate * 100).toFixed(1)}% |
| Passed cases | ${report.summary.passed}/${report.summary.total} |
| Critical failures | ${report.summary.critical_failures} |
| Average latency | ${report.summary.avg_latency_ms} ms |
| P95 latency | ${report.summary.p95_latency_ms} ms |
| Cost per 1,000 calls | $${report.summary.cost_per_1000_calls_usd} |

## Pass Rate By Category

| Category | Pass rate |
| --- | ---: |
${categories || "| none | 100.0% |"}

## Top Failed Cases

${
  failed.length
    ? failed
        .map(
          (result) =>
            `- **${result.case.id}** (${result.case.category}, ${result.case.severity}): ${result.case.title}\n  - ${result.assertions
              .filter((assertion) => assertion.status === "fail")
              .map((assertion) => assertion.reason)
              .join("; ")}`
        )
        .join("\n")
    : "- No failed cases."
}

## Tool Risk Matrix

${
  report.toolRisk?.findings.length
    ? report.toolRisk.findings
        .map((finding) => `- **${finding.tool}**: ${finding.decision} - ${finding.reason}`)
        .join("\n")
    : "- No tool risk report attached."
}

## Recommended Product Fixes

${report.decision.recommended_product_fixes.map((fix) => `- ${fix}`).join("\n")}

## Recommended Prompt Fixes

${report.decision.recommended_prompt_fixes.map((fix) => `- ${fix}`).join("\n")}

## Recommended Engineering Fixes

${report.decision.recommended_engineering_fixes.map((fix) => `- ${fix}`).join("\n")}

## GitHub PR Summary

${githubStyleSummary(report)}
`;
}

function githubStyleSummary(report: RunReport): string {
  return `AI release gate: **${report.decision?.decision ?? "UNKNOWN"}**. Overall pass rate ${(report.summary.overall_pass_rate * 100).toFixed(1)}%, critical failures ${report.summary.critical_failures}, p95 latency ${report.summary.p95_latency_ms} ms.`;
}
