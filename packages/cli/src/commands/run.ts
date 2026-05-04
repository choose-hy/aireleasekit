import fs from "node:fs/promises";
import path from "node:path";
import { loadConfig, loadEvalCases, resolveFromConfig, runReleaseGate, scanToolRisks } from "@aireleasekit/core";

interface RunOptions {
  config: string;
  target?: string;
  evals: string;
  out: string;
}

export async function runCommand(options: RunOptions): Promise<void> {
  const config = await loadConfig(options.config);
  if (options.target) {
    config.target = options.target.startsWith("mock://")
      ? { ...config.target, type: "mock", name: options.target.replace("mock://", "") }
      : { ...config.target, type: "rest", url: options.target };
  }

  const cases = await loadEvalCases(options.evals);
  const toolSchemaPath = resolveFromConfig(options.config, config.inputs.tool_schema);
  const toolRisk = toolSchemaPath ? scanToolRisks(JSON.parse(await fs.readFile(toolSchemaPath, "utf8"))) : undefined;
  const report = await runReleaseGate({ config, cases, toolRisk });

  await fs.mkdir(path.dirname(path.resolve(options.out)), { recursive: true });
  await fs.writeFile(options.out, JSON.stringify(report, null, 2), "utf8");
  console.log(`Decision: ${report.decision?.decision}`);
  console.log(`Wrote run report to ${options.out}.`);
  if (report.decision?.decision === "BLOCK") {
    process.exitCode = 2;
  }
}
