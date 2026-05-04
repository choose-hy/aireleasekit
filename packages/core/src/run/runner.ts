import { AIReleaseConfig, CaseRunResult, EvalCase, RunReport, RunSummary, ToolRiskReport } from "../types.js";
import { decideRelease } from "../report/decision.js";
import { scoreCase } from "../score/scorers.js";
import { callTarget } from "./targetAdapters.js";
import { percentile } from "./usage.js";

export interface RunReleaseGateOptions {
  config: AIReleaseConfig;
  cases: EvalCase[];
  toolRisk?: ToolRiskReport;
}

export async function runReleaseGate(options: RunReleaseGateOptions): Promise<RunReport> {
  const results: CaseRunResult[] = [];

  for (const testCase of options.cases) {
    const response = await callTarget(options.config.target, testCase);
    results.push(await scoreCase(testCase, response, options.config));
  }

  const report: RunReport = {
    project: options.config.project,
    generated_at: new Date().toISOString(),
    config: options.config,
    results,
    summary: summarizeResults(results),
    toolRisk: options.toolRisk
  };
  report.decision = decideRelease(report, options.config);
  return report;
}

export function summarizeResults(results: CaseRunResult[]): RunSummary {
  const total = results.length;
  const passed = results.filter((result) => result.passed).length;
  const latencies = results.map((result) => result.latency_ms);
  const totalCost = results.reduce((sum, result) => sum + result.cost_usd, 0);

  const categories = new Map<string, CaseRunResult[]>();
  for (const result of results) {
    const category = result.case.category;
    categories.set(category, [...(categories.get(category) ?? []), result]);
  }

  const passRateByCategory: Record<string, number> = {};
  for (const [category, categoryResults] of categories.entries()) {
    passRateByCategory[category] =
      categoryResults.length === 0 ? 1 : categoryResults.filter((result) => result.passed).length / categoryResults.length;
  }

  return {
    total,
    passed,
    failed: total - passed,
    overall_pass_rate: total === 0 ? 1 : passed / total,
    pass_rate_by_category: passRateByCategory,
    critical_failures: results.filter((result) => result.case.severity === "critical" && !result.passed).length,
    avg_latency_ms: total === 0 ? 0 : Math.round(latencies.reduce((sum, value) => sum + value, 0) / total),
    p95_latency_ms: percentile(latencies, 95),
    cost_per_1000_calls_usd: total === 0 ? 0 : Number(((totalCost / total) * 1000).toFixed(4)),
    unauthorized_tool_calls: results.filter((result) =>
      result.assertions.some(
        (assertion) => assertion.type === "tool_call_allowed" && assertion.status === "fail"
      )
    ).length
  };
}
