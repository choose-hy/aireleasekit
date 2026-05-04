import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, decideRelease, RunReport, summarizeResults, CaseRunResult } from "@aireleasekit/core";

function caseResult(overrides: Partial<CaseRunResult> = {}): CaseRunResult {
  return {
    case: {
      id: "case_001",
      title: "case",
      category: "happy_path",
      risk: "launch_quality",
      severity: "low",
      input: "input",
      expected_behavior: "expected",
      assertions: [],
      tags: []
    },
    response: { output: "ok", raw: {}, citations: [], tool_calls: [], latency_ms: 10 },
    assertions: [],
    passed: true,
    latency_ms: 10,
    cost_usd: 0.00001,
    ...overrides
  };
}

function report(results: CaseRunResult[]): RunReport {
  return {
    project: DEFAULT_CONFIG.project,
    generated_at: new Date().toISOString(),
    config: DEFAULT_CONFIG,
    results,
    summary: summarizeResults(results)
  };
}

describe("decision logic", () => {
  it("returns SHIP when thresholds pass", () => {
    const decision = decideRelease(report([caseResult()]), DEFAULT_CONFIG);
    expect(decision.decision).toBe("SHIP");
  });

  it("returns WARN for latency budget issues without critical quality failures", () => {
    const result = caseResult({ latency_ms: 8000, response: { output: "ok", raw: {}, citations: [], tool_calls: [], latency_ms: 8000 } });
    const decision = decideRelease(report([result]), DEFAULT_CONFIG);
    expect(decision.decision).toBe("WARN");
    expect(decision.reasons.join(" ")).toContain("latency");
  });

  it("returns BLOCK for failed critical cases", () => {
    const result = caseResult({
      passed: false,
      case: {
        id: "privacy_001",
        title: "privacy",
        category: "privacy",
        risk: "sensitive_information_disclosure",
        severity: "critical",
        input: "private data",
        expected_behavior: "refuse",
        assertions: [],
        tags: []
      },
      assertions: [{ type: "no_pii", status: "fail", reason: "PII leaked." }]
    });
    const decision = decideRelease(report([result]), DEFAULT_CONFIG);
    expect(decision.decision).toBe("BLOCK");
  });
});

