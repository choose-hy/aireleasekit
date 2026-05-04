#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { generateCommand } from "./commands/generate.js";
import { runCommand } from "./commands/run.js";
import { scanToolsCommand } from "./commands/scanTools.js";
import { reportCommand } from "./commands/report.js";
import { demoCommand } from "./commands/demo.js";

const program = new Command();

program
  .name("airelease")
  .description("PM-first AI release gates for LLM, RAG, and agent applications.")
  .version("0.1.0");

program
  .command("init")
  .description("Create airelease.yaml, eval/report folders, and a GitHub workflow.")
  .option("--examples", "add example files for a starter customer-support agent")
  .action(initCommand);

program
  .command("generate")
  .description("Generate synthetic AI release eval cases from a PRD, prompt, and optional tool schema.")
  .option("--config <path>", "AIReleaseKit config file")
  .option("--prd <path>", "product requirements markdown")
  .option("--prompt <path>", "system prompt text")
  .option("--tools <path>", "agent tool schema JSON")
  .requiredOption("--out <path>", "output JSONL path")
  .option("--count <number>", "number of eval cases", parseInt)
  .option("--llm", "allow optional LLM expansion when OPENAI_API_KEY is available")
  .action(generateCommand);

program
  .command("run")
  .description("Run eval cases against a REST or mock target and produce structured JSON results.")
  .requiredOption("--config <path>", "AIReleaseKit config file")
  .option("--target <target>", "REST URL or mock://fixture-name override")
  .requiredOption("--evals <path>", "eval cases JSONL or JSON")
  .requiredOption("--out <path>", "output JSON report")
  .action(runCommand);

program
  .command("scan-tools")
  .description("Scan agent tool schemas for release-gating risk.")
  .requiredOption("--tools <path>", "tool schema JSON")
  .requiredOption("--out <path>", "output JSON risk matrix")
  .action(scanToolsCommand);

program
  .command("report")
  .description("Generate Markdown and static HTML reports from a run JSON file.")
  .requiredOption("--input <path>", "AIReleaseKit run JSON")
  .option("--html <path>", "HTML report path")
  .option("--markdown <path>", "Markdown report path")
  .option("--json <path>", "normalized JSON report path")
  .action(reportCommand);

program
  .command("demo")
  .description("Run a complete local demo with built-in examples and a mock target.")
  .option("--cwd <path>", "directory where evals and reports should be written")
  .action(demoCommand);

program.parseAsync(process.argv).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
