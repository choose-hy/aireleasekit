import { RunReport } from "../types.js";

export function generateGithubSummary(report: RunReport): string {
  const decision = report.decision?.decision ?? "UNKNOWN";
  const icon = decision === "SHIP" ? "PASS" : decision === "WARN" ? "WARN" : "BLOCK";
  return `### AIReleaseKit: ${icon} ${decision}

- Overall pass rate: ${(report.summary.overall_pass_rate * 100).toFixed(1)}%
- Critical failures: ${report.summary.critical_failures}
- P95 latency: ${report.summary.p95_latency_ms} ms
- Cost per 1,000 calls: $${report.summary.cost_per_1000_calls_usd}

${report.decision?.reasons.map((reason) => `- ${reason}`).join("\n") ?? ""}
`;
}
