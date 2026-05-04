import { UsageStats } from "../types.js";

const DEFAULT_COST_PER_1K_TOKENS_USD = 0.0005;

export function approximateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function normalizeUsage(input: string, output: string, usage?: UsageStats): Required<UsageStats> {
  const inputTokens = usage?.input_tokens ?? approximateTokens(input);
  const outputTokens = usage?.output_tokens ?? approximateTokens(output);
  const totalTokens = usage?.total_tokens ?? inputTokens + outputTokens;
  const cost = usage?.cost_usd ?? (totalTokens / 1000) * DEFAULT_COST_PER_1K_TOKENS_USD;

  return {
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: totalTokens,
    cost_usd: Number(cost.toFixed(8))
  };
}

export function percentile(values: number[], percentileRank: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((percentileRank / 100) * sorted.length) - 1);
  return sorted[index] ?? 0;
}
