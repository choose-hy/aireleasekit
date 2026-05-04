import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import { AIReleaseConfig, AIReleaseConfigSchema, EvalCase, EvalCaseSchema } from "./types.js";

export const DEFAULT_CONFIG: AIReleaseConfig = AIReleaseConfigSchema.parse({});

export async function loadConfig(configPath: string): Promise<AIReleaseConfig> {
  const raw = await fs.readFile(configPath, "utf8");
  const parsed = YAML.parse(raw) ?? {};
  return AIReleaseConfigSchema.parse(parsed);
}

export function parseConfig(raw: string): AIReleaseConfig {
  return AIReleaseConfigSchema.parse(YAML.parse(raw) ?? {});
}

export function configToYaml(config: AIReleaseConfig = DEFAULT_CONFIG): string {
  return YAML.stringify(config);
}

export function resolveFromConfig(configPath: string, maybeRelative?: string): string | undefined {
  if (!maybeRelative) return undefined;
  if (path.isAbsolute(maybeRelative)) return maybeRelative;
  return path.resolve(path.dirname(configPath), maybeRelative);
}

export function parseEvalCase(raw: unknown): EvalCase {
  return EvalCaseSchema.parse(raw);
}

export function stringifyJsonl(cases: EvalCase[]): string {
  return cases.map((testCase) => JSON.stringify(testCase)).join("\n") + "\n";
}

export function parseJsonl(raw: string): EvalCase[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseEvalCase(JSON.parse(line)));
}

export async function loadEvalCases(filePath: string): Promise<EvalCase[]> {
  const raw = await fs.readFile(filePath, "utf8");
  if (filePath.endsWith(".jsonl")) {
    return parseJsonl(raw);
  }
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return parsed.map(parseEvalCase);
  }
  if (Array.isArray(parsed.cases)) {
    return parsed.cases.map(parseEvalCase);
  }
  throw new Error(`Unsupported eval case file shape: ${filePath}`);
}

export async function readOptionalText(filePath?: string): Promise<string> {
  if (!filePath) return "";
  return fs.readFile(filePath, "utf8");
}
