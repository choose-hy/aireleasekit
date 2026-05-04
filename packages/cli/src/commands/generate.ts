import fs from "node:fs/promises";
import path from "node:path";
import {
  EvalCase,
  EvalCaseSchema,
  generateEvalCases,
  loadConfig,
  readOptionalText,
  resolveFromConfig,
  stringifyJsonl
} from "@aireleasekit/core";

interface GenerateOptions {
  config?: string;
  prd?: string;
  prompt?: string;
  tools?: string;
  out: string;
  count?: number;
  llm?: boolean;
}

export async function generateCommand(options: GenerateOptions): Promise<void> {
  const config = options.config ? await loadConfig(options.config) : undefined;
  const prdPath = options.prd ?? (options.config ? resolveFromConfig(options.config, config?.inputs.prd) : undefined);
  const promptPath =
    options.prompt ?? (options.config ? resolveFromConfig(options.config, config?.inputs.system_prompt) : undefined);
  const toolsPath = options.tools ?? (options.config ? resolveFromConfig(options.config, config?.inputs.tool_schema) : undefined);

  if (!prdPath || !promptPath) {
    throw new Error("generate requires --prd and --prompt, or a config with inputs.prd and inputs.system_prompt.");
  }

  const prd = await readOptionalText(prdPath);
  const systemPrompt = await readOptionalText(promptPath);
  const toolSchema = toolsPath ? JSON.parse(await fs.readFile(toolsPath, "utf8")) : undefined;
  const requestedCount = options.count ?? config?.generation.count;
  const deterministicCases = generateEvalCases({
    prd,
    systemPrompt,
    toolSchema,
    count: requestedCount,
    includeRedTeam: config?.generation.include_red_team,
    includeBusinessPolicyCases: config?.generation.include_business_policy_cases,
    includePrivacyCases: config?.generation.include_privacy_cases,
    includeToolSafetyCases: config?.generation.include_tool_safety_cases,
    includeRagGroundednessCases: config?.generation.include_rag_groundedness_cases
  });
  const llmCases = await maybeExpandWithLlm({
    enabled: Boolean(options.llm),
    prd,
    systemPrompt,
    toolSchema,
    count: Math.min(10, Math.max(3, Math.ceil((requestedCount ?? 60) * 0.2))),
    model: config?.judges.llm_judge.model,
    apiKeyEnv: config?.judges.llm_judge.api_key_env
  });
  const cases = mergeCases(llmCases, deterministicCases).slice(0, requestedCount ?? deterministicCases.length);

  await fs.mkdir(path.dirname(path.resolve(options.out)), { recursive: true });
  await fs.writeFile(options.out, stringifyJsonl(cases), "utf8");

  if (options.llm && llmCases.length === 0) {
    console.log("LLM expansion did not run; generated deterministic template cases only.");
  }

  console.log(`Generated ${cases.length} eval cases at ${options.out}.`);
}

async function maybeExpandWithLlm(options: {
  enabled: boolean;
  prd: string;
  systemPrompt: string;
  toolSchema?: unknown;
  count: number;
  model?: string;
  apiKeyEnv?: string;
}): Promise<EvalCase[]> {
  if (!options.enabled) return [];
  const apiKey = process.env[options.apiKeyEnv ?? "OPENAI_API_KEY"];
  if (!apiKey) return [];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model ?? "gpt-4.1-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Generate AI release-gate eval cases as JSON. Return {\"cases\": EvalCase[]} only. Cases must be product-facing, synthetic, and must not contain private or proprietary data."
          },
          {
            role: "user",
            content: JSON.stringify({
              count: options.count,
              prd: options.prd.slice(0, 6000),
              system_prompt: options.systemPrompt.slice(0, 4000),
              tool_schema: options.toolSchema
            })
          }
        ]
      })
    });
    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content ?? "{}");
    const rawCases = Array.isArray(parsed.cases) ? parsed.cases : [];
    const validCases: EvalCase[] = [];
    rawCases.forEach((rawCase: unknown, index: number) => {
      if (!isRecord(rawCase)) return;
      const parsedCase = EvalCaseSchema.safeParse({
        ...rawCase,
        id: String(rawCase.id ?? `llm_generated_${String(index + 1).padStart(3, "0")}`)
      });
      if (parsedCase.success) validCases.push(parsedCase.data);
    });
    return validCases;
  } catch {
    return [];
  }
}

function mergeCases(preferred: EvalCase[], fallback: EvalCase[]): EvalCase[] {
  const seen = new Set<string>();
  const merged: EvalCase[] = [];
  for (const testCase of [...preferred, ...fallback]) {
    if (seen.has(testCase.id)) continue;
    seen.add(testCase.id);
    merged.push(testCase);
  }
  return merged;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
