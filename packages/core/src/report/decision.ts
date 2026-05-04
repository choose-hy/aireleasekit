import { AIReleaseConfig, DecisionReport, RunReport } from "../types.js";

export function decideRelease(report: RunReport, config: AIReleaseConfig = report.config): DecisionReport {
  const reasons: string[] = [];
  let decision: DecisionReport["decision"] = "SHIP";
  const summary = report.summary;

  if (config.release_policy.block_on_critical_failure && summary.critical_failures > 0) {
    decision = "BLOCK";
    reasons.push(`Critical launch-blocker cases failed: ${summary.critical_failures}.`);
  }

  const privacyPassRate = summary.pass_rate_by_category.privacy ?? 1;
  if (config.release_policy.block_on_privacy_failure && privacyPassRate < config.quality_bar.privacy_pass_rate) {
    decision = "BLOCK";
    reasons.push(
      `Privacy pass rate ${(privacyPassRate * 100).toFixed(1)}% below launch threshold ${(config.quality_bar.privacy_pass_rate * 100).toFixed(1)}%.`
    );
  }

  if (config.release_policy.block_on_unauthorized_tool_call && summary.unauthorized_tool_calls > 0) {
    decision = "BLOCK";
    reasons.push(`Unauthorized tool call detected in ${summary.unauthorized_tool_calls} case(s).`);
  }

  const toolSafetyPassRate = summary.pass_rate_by_category.tool_safety ?? 1;
  if (toolSafetyPassRate < config.quality_bar.tool_safety_pass_rate) {
    decision = "BLOCK";
    reasons.push(
      `Tool-safety pass rate ${(toolSafetyPassRate * 100).toFixed(1)}% below threshold ${(config.quality_bar.tool_safety_pass_rate * 100).toFixed(1)}%.`
    );
  }

  if (summary.overall_pass_rate < config.quality_bar.overall_pass_rate) {
    decision = decision === "BLOCK" ? "BLOCK" : "WARN";
    reasons.push(
      `Overall pass rate ${(summary.overall_pass_rate * 100).toFixed(1)}% below quality bar ${(config.quality_bar.overall_pass_rate * 100).toFixed(1)}%.`
    );
  }

  const ragScore = summary.pass_rate_by_category.rag_groundedness ?? 1;
  if (ragScore < config.quality_bar.rag_groundedness_score) {
    decision = decision === "BLOCK" ? "BLOCK" : "WARN";
    reasons.push(
      `RAG groundedness pass rate ${(ragScore * 100).toFixed(1)}% below threshold ${(config.quality_bar.rag_groundedness_score * 100).toFixed(1)}%.`
    );
  }

  if (config.release_policy.warn_on_latency_budget_exceeded) {
    if (summary.avg_latency_ms > config.budgets.max_avg_latency_ms) {
      decision = decision === "BLOCK" ? "BLOCK" : "WARN";
      reasons.push(`Average latency ${summary.avg_latency_ms} ms exceeded budget ${config.budgets.max_avg_latency_ms} ms.`);
    }
    if (summary.p95_latency_ms > config.budgets.max_p95_latency_ms) {
      decision = decision === "BLOCK" ? "BLOCK" : "WARN";
      reasons.push(`P95 latency ${summary.p95_latency_ms} ms exceeded budget ${config.budgets.max_p95_latency_ms} ms.`);
    }
  }

  if (
    config.release_policy.warn_on_cost_budget_exceeded &&
    summary.cost_per_1000_calls_usd > config.budgets.max_cost_per_1000_calls_usd
  ) {
    decision = decision === "BLOCK" ? "BLOCK" : "WARN";
    reasons.push(
      `Cost per 1,000 calls $${summary.cost_per_1000_calls_usd} exceeded budget $${config.budgets.max_cost_per_1000_calls_usd}.`
    );
  }

  if (reasons.length === 0) {
    reasons.push("All required launch gates passed.");
  }

  return {
    decision,
    reasons,
    recommended_product_fixes: productFixes(report),
    recommended_prompt_fixes: promptFixes(report),
    recommended_engineering_fixes: engineeringFixes(report)
  };
}

function failedCategories(report: RunReport): Set<string> {
  return new Set(report.results.filter((result) => !result.passed).map((result) => result.case.category));
}

function productFixes(report: RunReport): string[] {
  const categories = failedCategories(report);
  const fixes = [];
  if (categories.has("business_policy")) fixes.push("Clarify launch policy boundaries and approved exception language.");
  if (categories.has("privacy")) fixes.push("Define explicit privacy refusal and account-verification requirements.");
  if (categories.has("rag_groundedness")) fixes.push("Decide which claims require source citations before launch.");
  if (fixes.length === 0) fixes.push("Keep current launch scorecard and monitor new regressions.");
  return fixes;
}

function promptFixes(report: RunReport): string[] {
  const categories = failedCategories(report);
  const fixes = [];
  if (categories.has("security")) fixes.push("Strengthen instruction hierarchy and prompt-injection refusal language.");
  if (categories.has("business_policy")) fixes.push("Add concise policy boundaries and escalation phrasing to the system prompt.");
  if (categories.has("tool_safety")) fixes.push("State confirmation requirements before consequential tool calls.");
  if (fixes.length === 0) fixes.push("No urgent prompt fix required by this run.");
  return fixes;
}

function engineeringFixes(report: RunReport): string[] {
  const fixes = [];
  if (report.summary.unauthorized_tool_calls > 0) fixes.push("Enforce tool allowlists server-side, not only in the prompt.");
  if (report.summary.p95_latency_ms > report.config.budgets.max_p95_latency_ms) fixes.push("Profile retrieval, tool, and model latency hot paths.");
  if (report.summary.cost_per_1000_calls_usd > report.config.budgets.max_cost_per_1000_calls_usd) fixes.push("Add model routing, caching, or token limits before launch.");
  if (fixes.length === 0) fixes.push("No urgent engineering fix required by this run.");
  return fixes;
}
