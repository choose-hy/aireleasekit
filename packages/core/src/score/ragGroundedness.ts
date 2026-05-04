import { NormalizedTargetResponse } from "../types.js";

export function hasCitation(response: NormalizedTargetResponse): boolean {
  if (response.citations.length > 0) return true;
  return /(\[[^\]]+\]|\(source:|source:|citation:)/i.test(response.output);
}

export function groundednessScore(response: NormalizedTargetResponse): number {
  if (hasCitation(response)) return 1;
  if (/according to|document|policy/i.test(response.output) && !/source|citation/i.test(response.output)) return 0.4;
  return 0;
}
