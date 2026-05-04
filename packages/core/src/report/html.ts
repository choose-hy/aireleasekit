import { RunReport } from "../types.js";
import { decideRelease } from "./decision.js";

export function generateHtmlReport(input: RunReport): string {
  const report = { ...input, decision: input.decision ?? decideRelease(input, input.config) };
  const decisionClass = report.decision.decision.toLowerCase();
  const failedRows = report.results
    .filter((result) => !result.passed)
    .slice(0, 25)
    .map(
      (result) => `<tr>
        <td>${escapeHtml(result.case.id)}</td>
        <td>${escapeHtml(result.case.category)}</td>
        <td>${escapeHtml(result.case.severity)}</td>
        <td>${escapeHtml(result.case.title)}</td>
        <td>${escapeHtml(result.assertions.filter((assertion) => assertion.status === "fail").map((assertion) => assertion.reason).join("; "))}</td>
      </tr>`
    )
    .join("");
  const categoryRows = Object.entries(report.summary.pass_rate_by_category)
    .map(([category, rate]) => `<tr><td>${escapeHtml(category)}</td><td>${(rate * 100).toFixed(1)}%</td></tr>`)
    .join("");
  const toolRows = report.toolRisk?.findings
    .map(
      (finding) =>
        `<tr><td>${escapeHtml(finding.tool)}</td><td>${escapeHtml(finding.decision)}</td><td>${escapeHtml(finding.reason)}</td></tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AIReleaseKit Report</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; color: #17202a; background: #f7f7f4; }
    header { background: #102a43; color: white; padding: 36px max(24px, 8vw); }
    main { padding: 28px max(24px, 8vw) 56px; }
    h1, h2 { margin: 0 0 14px; letter-spacing: 0; }
    section { margin: 0 0 30px; }
    table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #d8dee4; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e6e8eb; vertical-align: top; }
    th { background: #eef2f6; color: #263442; font-size: 13px; }
    .decision { display: inline-flex; align-items: center; min-width: 96px; justify-content: center; border-radius: 6px; padding: 8px 12px; font-weight: 800; }
    .ship { background: #d7f5df; color: #0f6b2f; }
    .warn { background: #fff1c2; color: #7a4d00; }
    .block { background: #ffd9d7; color: #9f1f18; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .metric { background: white; border: 1px solid #d8dee4; border-radius: 8px; padding: 14px; }
    .metric strong { display: block; font-size: 24px; margin-top: 6px; }
    ul { background: white; border: 1px solid #d8dee4; border-radius: 8px; padding: 16px 22px; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(report.project.name)} AI Release Gate</h1>
    <div class="decision ${decisionClass}">${report.decision.decision}</div>
  </header>
  <main>
    <section>
      <h2>Reasons</h2>
      <ul>${report.decision.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
    </section>
    <section class="metrics">
      <div class="metric">Overall pass rate<strong>${(report.summary.overall_pass_rate * 100).toFixed(1)}%</strong></div>
      <div class="metric">Passed cases<strong>${report.summary.passed}/${report.summary.total}</strong></div>
      <div class="metric">Critical failures<strong>${report.summary.critical_failures}</strong></div>
      <div class="metric">P95 latency<strong>${report.summary.p95_latency_ms} ms</strong></div>
      <div class="metric">Cost per 1,000 calls<strong>$${report.summary.cost_per_1000_calls_usd}</strong></div>
    </section>
    <section>
      <h2>Pass Rate By Category</h2>
      <table><thead><tr><th>Category</th><th>Pass rate</th></tr></thead><tbody>${categoryRows}</tbody></table>
    </section>
    <section>
      <h2>Top Failed Cases</h2>
      <table><thead><tr><th>ID</th><th>Category</th><th>Severity</th><th>Title</th><th>Reason</th></tr></thead><tbody>${failedRows || "<tr><td colspan=\"5\">No failed cases.</td></tr>"}</tbody></table>
    </section>
    <section>
      <h2>Tool Risk Matrix</h2>
      <table><thead><tr><th>Tool</th><th>Decision</th><th>Reason</th></tr></thead><tbody>${toolRows || "<tr><td colspan=\"3\">No tool risk report attached.</td></tr>"}</tbody></table>
    </section>
  </main>
</body>
</html>`;
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
