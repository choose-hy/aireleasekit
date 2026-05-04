import YAML from "yaml";
import { ToolRiskFinding, ToolRiskReport } from "../types.js";

interface ToolDefinition {
  name: string;
  description: string;
  raw: unknown;
}

const RISK_PATTERNS = [
  { tag: "shell_execution", pattern: /(shell|command|terminal|exec|execute_shell|bash|powershell)/i },
  { tag: "file_write", pattern: /(write file|file write|save file|filesystem|upload|download|path|directory)/i },
  { tag: "external_network", pattern: /(http|webhook|external|network|request|fetch|url|api call)/i },
  { tag: "email_send", pattern: /(send email|email|message customer|notify|sms)/i },
  { tag: "financial_action", pattern: /(refund|payment|charge|invoice|transfer|payout|credit)/i },
  { tag: "mutation", pattern: /(delete|update|create|modify|mutate|cancel|close|issue|change|remove)/i },
  { tag: "personal_data", pattern: /(personal|pii|customer data|phone|email address|address|ssn|account)/i },
  { tag: "ambiguous_description", pattern: /(anything|arbitrary|whatever|all access|bypass|ignore|unrestricted)/i }
];

export function scanToolRisks(schema: unknown): ToolRiskReport {
  const tools = extractTools(schema);
  const findings = tools.map(classifyTool);
  return {
    generated_at: new Date().toISOString(),
    findings,
    recommended_policy_yaml: recommendedPolicyYaml(findings)
  };
}

export function extractTools(schema: unknown): ToolDefinition[] {
  if (!schema) return [];
  if (Array.isArray(schema)) {
    return schema.flatMap(extractToolFromItem);
  }
  if (isRecord(schema)) {
    for (const key of ["tools", "functions", "tool_definitions"]) {
      if (Array.isArray(schema[key])) return schema[key].flatMap(extractToolFromItem);
    }
    if (schema.name || schema.function) return extractToolFromItem(schema);
    return Object.entries(schema)
      .filter(([, value]) => isRecord(value))
      .map(([name, value]) => ({
        name,
        description: String(value.description ?? value.summary ?? ""),
        raw: value
      }));
  }
  return [];
}

function extractToolFromItem(item: unknown): ToolDefinition[] {
  if (!isRecord(item)) return [];
  const functionDef = isRecord(item.function) ? item.function : item;
  const name = functionDef.name ?? item.name;
  if (!name) return [];
  return [
    {
      name: String(name),
      description: String(functionDef.description ?? item.description ?? ""),
      raw: item
    }
  ];
}

function classifyTool(tool: ToolDefinition): ToolRiskFinding {
  const haystack = `${tool.name} ${tool.description} ${JSON.stringify(tool.raw)}`;
  const tags = RISK_PATTERNS.filter((item) => item.pattern.test(haystack)).map((item) => item.tag);
  const hasConfirmation = /(confirm|confirmation|approval|human|operator|explicit user)/i.test(haystack);
  const readOnly = /(^|_)(read|get|lookup|list|search|fetch)(_|$)/i.test(tool.name) || /(read-only|read only|lookup|retrieve|view only)/i.test(haystack);
  const readOnlyTags = tags.filter((tag) => tag !== "financial_action");

  if (tags.includes("shell_execution")) {
    return {
      tool: tool.name,
      decision: "block",
      reason: "Arbitrary command execution is not safe for this agent.",
      risk_tags: tags,
      required_controls: []
    };
  }

  if (readOnly && !tags.some((tag) => ["mutation", "email_send", "file_write"].includes(tag))) {
    if (readOnlyTags.includes("personal_data") || readOnlyTags.includes("external_network") || readOnlyTags.includes("ambiguous_description")) {
      return {
        tool: tool.name,
        decision: "warn",
        reason: "Read-only tool may expose sensitive or external data and should be scoped before launch.",
        risk_tags: readOnlyTags,
        required_controls: ["Scope reads to authenticated user", "Mask sensitive fields by default"]
      };
    }

    return {
      tool: tool.name,
      decision: "allow",
      reason: "Read-only lookup with low launch risk based on schema description.",
      risk_tags: readOnlyTags,
      required_controls: []
    };
  }

  if (tags.includes("financial_action")) {
    return {
      tool: tool.name,
      decision: hasConfirmation ? "warn" : "require_human_approval",
      reason: "Financial action that mutates customer account state.",
      risk_tags: missingConfirmationTag(tags, hasConfirmation),
      required_controls: [
        "Show refund or payment amount to user",
        "Require explicit user confirmation",
        "Log operator and case ID"
      ]
    };
  }

  if (tags.includes("mutation") || tags.includes("email_send") || tags.includes("file_write")) {
    return {
      tool: tool.name,
      decision: hasConfirmation ? "warn" : "require_human_approval",
      reason: "Tool can mutate external state or communicate externally.",
      risk_tags: missingConfirmationTag(tags, hasConfirmation),
      required_controls: ["Require explicit user confirmation", "Log action inputs and actor", "Provide undo or escalation path"]
    };
  }

  if (tags.includes("personal_data")) {
    return {
      tool: tool.name,
      decision: "warn",
      reason: "Tool can access personal data and should be scoped to the authenticated user.",
      risk_tags: tags,
      required_controls: ["Scope reads to authenticated user", "Mask sensitive fields by default"]
    };
  }

  if (tags.includes("external_network") || tags.includes("ambiguous_description")) {
    return {
      tool: tool.name,
      decision: "warn",
      reason: "Tool description or network access requires tighter policy before launch.",
      risk_tags: tags,
      required_controls: ["Restrict domains or destinations", "Clarify tool description and allowed use"]
    };
  }

  return {
    tool: tool.name,
    decision: "allow",
    reason: "Read-only or low-risk tool based on schema description.",
    risk_tags: tags,
    required_controls: []
  };
}

function missingConfirmationTag(tags: string[], hasConfirmation: boolean): string[] {
  return hasConfirmation ? tags : [...new Set([...tags, "missing_confirmation_requirement"])];
}

function recommendedPolicyYaml(findings: ToolRiskFinding[]): string {
  const policy = {
    tools: Object.fromEntries(
      findings.map((finding) => [
        finding.tool,
        {
          decision: finding.decision,
          reason: finding.reason,
          ...(finding.required_controls.length > 0 ? { required_controls: finding.required_controls } : {})
        }
      ])
    )
  };
  return YAML.stringify(policy);
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
