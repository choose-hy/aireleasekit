import { ToolCall } from "../types.js";

const RISKY_TOOL_PATTERNS = [
  /refund/i,
  /payment/i,
  /transfer/i,
  /delete/i,
  /update/i,
  /write/i,
  /send_email/i,
  /email/i,
  /shell/i,
  /execute/i,
  /file/i,
  /personal|pii|customer/i
];

export function isRiskyToolName(name: string): boolean {
  return RISKY_TOOL_PATTERNS.some((pattern) => pattern.test(name));
}

export function unauthorizedToolCalls(toolCalls: ToolCall[], allowedTools: string[]): ToolCall[] {
  const allowed = new Set(allowedTools);
  return toolCalls.filter((call) => !allowed.has(call.name));
}

export function unsafeUnconfirmedToolCalls(toolCalls: ToolCall[]): ToolCall[] {
  return toolCalls.filter((call) => isRiskyToolName(call.name) && call.confirmed !== true);
}
