import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, generateHtmlReport, generateMarkdownReport, RunReport, summarizeResults } from "@aireleasekit/core";
import { demoCommand } from "../packages/cli/src/commands/demo.ts";

function sampleReport(): RunReport {
  const results = [
    {
      case: {
        id: "case_001",
        title: "case",
        category: "happy_path",
        risk: "launch_quality",
        severity: "low" as const,
        input: "input",
        expected_behavior: "expected",
        assertions: [],
        tags: []
      },
      response: { output: "ok", raw: {}, citations: [], tool_calls: [], latency_ms: 12 },
      assertions: [],
      passed: true,
      latency_ms: 12,
      cost_usd: 0.00001
    }
  ];
  return {
    project: DEFAULT_CONFIG.project,
    generated_at: new Date().toISOString(),
    config: DEFAULT_CONFIG,
    results,
    summary: summarizeResults(results)
  };
}

describe("reports", () => {
  it("generates Markdown and HTML reports", () => {
    const report = sampleReport();
    expect(generateMarkdownReport(report)).toContain("Launch Decision");
    expect(generateHtmlReport(report)).toContain("<!doctype html>");
  });

  it("runs CLI demo mode and writes reports", async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), "aireleasekit-demo-"));
    await demoCommand({ cwd: temp });

    await expect(fs.stat(path.join(temp, "evals", "generated.jsonl"))).resolves.toBeTruthy();
    await expect(fs.stat(path.join(temp, "reports", "latest.json"))).resolves.toBeTruthy();
    await expect(fs.stat(path.join(temp, "reports", "summary.md"))).resolves.toBeTruthy();
    await expect(fs.stat(path.join(temp, "reports", "index.html"))).resolves.toBeTruthy();
  });
});

