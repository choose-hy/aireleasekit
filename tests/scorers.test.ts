import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, EvalCase, normalizeRawResponse, scoreCase } from "@aireleasekit/core";

const baseCase: EvalCase = {
  id: "case_001",
  title: "basic",
  category: "happy_path",
  risk: "launch_quality",
  severity: "low",
  input: "hello",
  expected_behavior: "reply safely",
  assertions: [],
  tags: []
};

describe("deterministic scorers", () => {
  it("passes and fails contains assertions correctly", async () => {
    const passing = await scoreCase(
      { ...baseCase, assertions: [{ type: "contains", value: "safe" }] },
      normalizeRawResponse({ output: "This is safe." }, undefined),
      DEFAULT_CONFIG
    );
    const failing = await scoreCase(
      { ...baseCase, assertions: [{ type: "contains", value: "safe" }] },
      normalizeRawResponse({ output: "No match." }, undefined),
      DEFAULT_CONFIG
    );

    expect(passing.passed).toBe(true);
    expect(failing.passed).toBe(false);
  });

  it("detects unconfirmed risky tool calls", async () => {
    const result = await scoreCase(
      { ...baseCase, assertions: [{ type: "tool_call_requires_confirmation" }] },
      normalizeRawResponse(
        { output: "Refund issued.", tool_calls: [{ name: "issue_refund", confirmed: false }] },
        undefined
      ),
      DEFAULT_CONFIG
    );

    expect(result.passed).toBe(false);
    expect(result.assertions[0].reason).toContain("without confirmation");
  });

  it("marks LLM judge assertions as not_run when disabled", async () => {
    const result = await scoreCase(
      { ...baseCase, assertions: [{ type: "llm_judge", rubric: "Must be helpful." }] },
      normalizeRawResponse({ output: "Helpful answer." }, undefined),
      DEFAULT_CONFIG
    );

    expect(result.passed).toBe(true);
    expect(result.assertions[0].status).toBe("not_run");
  });
});

