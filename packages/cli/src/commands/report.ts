import fs from "node:fs/promises";
import path from "node:path";
import { decideRelease, generateHtmlReport, generateMarkdownReport, RunReport } from "@aireleasekit/core";

interface ReportOptions {
  input: string;
  html?: string;
  markdown?: string;
  json?: string;
}

export async function reportCommand(options: ReportOptions): Promise<void> {
  const report = JSON.parse(await fs.readFile(options.input, "utf8")) as RunReport;
  report.decision = report.decision ?? decideRelease(report, report.config);

  if (options.html) {
    await fs.mkdir(path.dirname(path.resolve(options.html)), { recursive: true });
    await fs.writeFile(options.html, generateHtmlReport(report), "utf8");
  }

  if (options.markdown) {
    await fs.mkdir(path.dirname(path.resolve(options.markdown)), { recursive: true });
    await fs.writeFile(options.markdown, generateMarkdownReport(report), "utf8");
  }

  if (options.json) {
    await fs.mkdir(path.dirname(path.resolve(options.json)), { recursive: true });
    await fs.writeFile(options.json, JSON.stringify(report, null, 2), "utf8");
  }

  console.log(`Decision: ${report.decision.decision}`);
  if (options.html) console.log(`HTML report: ${options.html}`);
  if (options.markdown) console.log(`Markdown report: ${options.markdown}`);
}
