import fs from "node:fs/promises";
import path from "node:path";
import {
  generateEvalCases,
  generateHtmlReport,
  generateMarkdownReport,
  loadConfig,
  runReleaseGate,
  scanToolRisks,
  stringifyJsonl
} from "@aireleasekit/core";

interface DemoOptions {
  cwd?: string;
}

export async function demoCommand(options: DemoOptions = {}): Promise<void> {
  const repoRoot = await findRepoRoot(process.cwd());
  const outputRoot = path.resolve(options.cwd ?? repoRoot);
  const exampleDir = path.join(repoRoot, "examples", "customer-support-agent");
  const prdPath = path.join(exampleDir, "PRD.md");
  const promptPath = path.join(exampleDir, "system_prompt.txt");
  const toolsPath = path.join(exampleDir, "tool_schema.json");
  const configPath = path.join(exampleDir, "airelease.yaml");

  const prd = await fs.readFile(prdPath, "utf8");
  const systemPrompt = await fs.readFile(promptPath, "utf8");
  const toolSchema = JSON.parse(await fs.readFile(toolsPath, "utf8"));
  const config = await loadConfig(configPath);
  config.target = { type: "mock", name: "customer-support-agent", timeout_ms: 10000 };
  config.generation.count = 24;

  const cases = generateEvalCases({
    prd,
    systemPrompt,
    toolSchema,
    count: config.generation.count,
    includeRedTeam: true,
    includeBusinessPolicyCases: true,
    includePrivacyCases: true,
    includeToolSafetyCases: true,
    includeRagGroundednessCases: true
  });
  const toolRisk = scanToolRisks(toolSchema);
  const report = await runReleaseGate({ config, cases, toolRisk });

  const evalDir = path.join(outputRoot, "evals");
  const reportDir = path.join(outputRoot, "reports");
  await fs.mkdir(evalDir, { recursive: true });
  await fs.mkdir(reportDir, { recursive: true });

  await fs.writeFile(path.join(evalDir, "generated.jsonl"), stringifyJsonl(cases), "utf8");
  await fs.writeFile(path.join(reportDir, "tool-risk.json"), JSON.stringify(toolRisk, null, 2), "utf8");
  await fs.writeFile(path.join(reportDir, "latest.json"), JSON.stringify(report, null, 2), "utf8");
  await fs.writeFile(path.join(reportDir, "summary.md"), generateMarkdownReport(report), "utf8");
  await fs.writeFile(path.join(reportDir, "index.html"), generateHtmlReport(report), "utf8");

  console.log("AIReleaseKit demo complete.");
  console.log(`Decision: ${report.decision?.decision}`);
  console.log(`Eval cases: ${path.join(evalDir, "generated.jsonl")}`);
  console.log(`Markdown report: ${path.join(reportDir, "summary.md")}`);
  console.log(`HTML report: ${path.join(reportDir, "index.html")}`);
  console.log("Next: inspect failed cases, tighten the PRD quality bar, then wire the gate into CI.");
}

async function findRepoRoot(start: string): Promise<string> {
  let current = path.resolve(start);
  while (true) {
    try {
      const pkg = JSON.parse(await fs.readFile(path.join(current, "package.json"), "utf8"));
      if (pkg.name === "aireleasekit") return current;
    } catch {
      // keep walking
    }
    const parent = path.dirname(current);
    if (parent === current) return start;
    current = parent;
  }
}
