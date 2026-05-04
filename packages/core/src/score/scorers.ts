import { AIReleaseConfig, AssertionResult, CaseRunResult, EvalCase, NormalizedTargetResponse } from "../types.js";
import { scoreDeterministicAssertion } from "./deterministic.js";
import { runLlmJudge } from "./llmJudge.js";

export async function scoreCase(
  testCase: EvalCase,
  response: NormalizedTargetResponse,
  config: AIReleaseConfig
): Promise<CaseRunResult> {
  const assertions: AssertionResult[] = [];

  for (const assertion of testCase.assertions) {
    const deterministic = scoreDeterministicAssertion(assertion, testCase, response);
    if (deterministic) {
      assertions.push(deterministic);
      continue;
    }

    if (assertion.type === "llm_judge") {
      assertions.push(await runLlmJudge(assertion, testCase, response, config));
    }
  }

  const failed = assertions.some((assertion) => assertion.status === "fail");
  return {
    case: testCase,
    response,
    assertions,
    passed: !failed,
    latency_ms: response.latency_ms ?? 0,
    cost_usd: response.usage?.cost_usd ?? 0
  };
}
