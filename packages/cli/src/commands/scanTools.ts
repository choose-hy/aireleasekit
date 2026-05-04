import fs from "node:fs/promises";
import path from "node:path";
import { scanToolRisks } from "@aireleasekit/core";

interface ScanToolsOptions {
  tools: string;
  out: string;
}

export async function scanToolsCommand(options: ScanToolsOptions): Promise<void> {
  const schema = JSON.parse(await fs.readFile(options.tools, "utf8"));
  const report = scanToolRisks(schema);
  await fs.mkdir(path.dirname(path.resolve(options.out)), { recursive: true });
  await fs.writeFile(options.out, JSON.stringify(report, null, 2), "utf8");
  console.log(`Scanned ${report.findings.length} tools at ${options.out}.`);
}
