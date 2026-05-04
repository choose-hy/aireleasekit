import { describe, expect, it } from "vitest";
import { generateEvalCases } from "@aireleasekit/core";

describe("eval generation", () => {
  it("produces requested cases from PRD and prompt inputs", () => {
    const cases = generateEvalCases({
      prd: "# Support Bot\nThe assistant must answer refund questions, protect privacy, and cite policy documents.",
      systemPrompt: "Never reveal secrets. Require confirmation before refunds.",
      toolSchema: {
        tools: [{ name: "issue_refund", description: "Issue a refund to a customer." }]
      },
      count: 20
    });

    expect(cases).toHaveLength(20);
    expect(cases.every((testCase) => testCase.id && testCase.assertions.length > 0)).toBe(true);
  });

  it("includes red-team and happy-path cases", () => {
    const cases = generateEvalCases({
      prd: "# Support Bot\nThe assistant helps customers.",
      systemPrompt: "Follow policy.",
      count: 16
    });

    expect(cases.some((testCase) => testCase.tags.includes("red-team"))).toBe(true);
    expect(cases.some((testCase) => testCase.tags.includes("happy-path"))).toBe(true);
  });
});

