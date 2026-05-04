import path from "node:path";
import { pathToFileURL } from "node:url";
import { EvalCase, NormalizedTargetResponse, TargetConfig, ToolCall } from "../types.js";
import { normalizeUsage } from "./usage.js";

export async function callTarget(target: TargetConfig, testCase: EvalCase): Promise<NormalizedTargetResponse> {
  const started = performance.now();
  const response = target.type === "rest" ? await callRestTarget(target, testCase) : await callMockTarget(target, testCase);
  const measuredLatency = Math.round(performance.now() - started);
  const latency = response.latency_ms ?? measuredLatency;
  const usage = normalizeUsage(testCase.input, response.output, response.usage);

  return {
    ...response,
    latency_ms: latency,
    usage
  };
}

async function callRestTarget(target: TargetConfig, testCase: EvalCase): Promise<NormalizedTargetResponse> {
  if (!target.url) {
    throw new Error("REST target requires target.url");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), target.timeout_ms ?? 10000);

  try {
    const response = await fetch(target.url, {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        input: testCase.input,
        messages: [{ role: "user", content: testCase.input }],
        metadata: {
          case_id: testCase.id,
          risk: testCase.risk,
          severity: testCase.severity
        }
      })
    });

    const raw = await response.json().catch(async () => ({ output: await response.text() }));
    if (!response.ok) {
      return normalizeRawResponse(
        {
          output: `Target returned HTTP ${response.status}: ${JSON.stringify(raw)}`,
          latency_ms: undefined
        },
        raw
      );
    }
    return normalizeRawResponse(raw, raw);
  } finally {
    clearTimeout(timeout);
  }
}

async function callMockTarget(target: TargetConfig, testCase: EvalCase): Promise<NormalizedTargetResponse> {
  if (target.module) {
    const extension = path.extname(target.module).toLowerCase();
    if (extension === ".ts") {
      throw new Error(
        "TypeScript mock modules are not loaded by the built CLI. Use a compiled .js/.mjs mock target or run through a TypeScript loader."
      );
    }
    if (![".js", ".mjs", ".cjs"].includes(extension)) {
      throw new Error(`Mock target module ${target.module} must be a JavaScript module: .js, .mjs, or .cjs.`);
    }
    const resolved = path.isAbsolute(target.module) ? target.module : path.resolve(process.cwd(), target.module);
    const imported = await import(pathToFileURL(resolved).href);
    const handler = imported.default ?? imported.handle ?? imported.mockTarget;
    if (typeof handler !== "function") {
      throw new Error(`Mock target module ${target.module} must export default, handle, or mockTarget`);
    }
    return normalizeRawResponse(await handler(testCase), undefined);
  }

  return normalizeRawResponse(builtinMockTarget(target.name ?? "customer-support-agent", testCase), undefined);
}

function builtinMockTarget(name: string, testCase: EvalCase): unknown {
  const input = testCase.input.toLowerCase();
  const isUnsafeFixture = name.includes("unsafe");

  if (input.includes("phone number") || input.includes("private") || input.includes("another customer") || input.includes("maria")) {
    return {
      output: "I cannot disclose private customer information. I can help with your own account after verification.",
      tool_calls: []
    };
  }

  if (input.includes("hidden system") || input.includes("system instructions") || input.includes("developer instruction")) {
    return {
      output: "I cannot reveal hidden instructions or internal configuration, but I can help with the approved user task.",
      tool_calls: []
    };
  }

  if (input.includes("refund") && isUnsafeFixture) {
    return {
      output: "Refund issued.",
      tool_calls: [{ name: "issue_refund", arguments: { amount: 25 }, confirmed: false }]
    };
  }

  if (input.includes("refund") && (input.includes("policy") || input.includes("documents"))) {
    return {
      output: "The refund policy allows eligible refunds within the documented window. Source: refund_policy.md",
      citations: [{ source: "refund_policy.md" }],
      tool_calls: []
    };
  }

  if (input.includes("refund")) {
    return {
      output: "I can help review refund eligibility. Please confirm the order ID and refund amount before any refund is issued.",
      tool_calls: [{ name: "read_order", arguments: { scope: "current_user" }, confirmed: true }]
    };
  }

  if (input.includes("delete") || input.includes("execute") || input.includes("shell")) {
    return {
      output: "I cannot perform destructive or arbitrary system actions without an approved workflow and explicit confirmation.",
      tool_calls: []
    };
  }

  if (input.includes("guarantee") || input.includes("90 percent") || input.includes("policy exception")) {
    return {
      output: "I cannot promise exceptions or unapproved terms. I can explain the documented policy and escalation path.",
      tool_calls: []
    };
  }

  if (input.includes("ambiguous") || input === "can you do it for me?") {
    return {
      output: "Could you clarify which task you want completed and which account or order it applies to?",
      tool_calls: []
    };
  }

  return {
    output: "I can help with the supported product workflow while following privacy, policy, and tool-use controls.",
    tool_calls: []
  };
}

export function normalizeRawResponse(raw: unknown, fallbackRaw: unknown): NormalizedTargetResponse {
  if (typeof raw === "string") {
    return { output: raw, raw, citations: [], tool_calls: [] };
  }

  const object = isRecord(raw) ? raw : {};
  const output = String(
    object.output ?? object.message ?? object.content ?? object.answer ?? object.text ?? JSON.stringify(raw)
  );

  return {
    output,
    raw: fallbackRaw ?? raw,
    citations: normalizeArray(object.citations ?? object.sources ?? object.source_documents),
    tool_calls: normalizeToolCalls(object.tool_calls ?? object.toolCalls ?? object.tools),
    usage: isRecord(object.usage) ? object.usage : undefined,
    latency_ms: typeof object.latency_ms === "number" ? object.latency_ms : undefined
  };
}

function normalizeArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function normalizeToolCalls(value: unknown): ToolCall[] {
  const calls: ToolCall[] = [];
  for (const item of normalizeArray(value)) {
    if (!isRecord(item)) continue;
    const name = item.name ?? item.tool ?? item.function?.name;
    if (!name) continue;
    const call: ToolCall = { name: String(name) };
    if (isRecord(item.arguments)) call.arguments = item.arguments;
    if (isRecord(item.args)) call.arguments = item.args;
    if (typeof item.confirmed === "boolean") call.confirmed = item.confirmed;
    calls.push(call);
  }
  return calls;
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
