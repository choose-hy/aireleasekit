import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { callTarget, EvalCase } from "@aireleasekit/core";

const baseCase: EvalCase = {
  id: "mock_001",
  title: "Custom mock",
  category: "happy_path",
  risk: "launch_quality",
  severity: "low",
  input: "hello custom mock",
  expected_behavior: "reply",
  assertions: [],
  tags: []
};

describe("target adapters", () => {
  it("loads custom .mjs mock target modules", async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), "aireleasekit-mock-"));
    const modulePath = path.join(temp, "mock_target.mjs");
    await fs.writeFile(
      modulePath,
      "export default async function mockTarget(testCase) { return { output: `custom:${testCase.id}`, citations: [], tool_calls: [] }; }\n",
      "utf8"
    );

    const response = await callTarget({ type: "mock", module: modulePath, timeout_ms: 10000 }, baseCase);
    expect(response.output).toBe("custom:mock_001");
  });

  it("fails with a helpful error for TypeScript mock modules in the built CLI", async () => {
    await expect(callTarget({ type: "mock", module: "mock_target.ts", timeout_ms: 10000 }, baseCase)).rejects.toThrow(
      "TypeScript mock modules are not loaded by the built CLI"
    );
  });
});

