export interface RiskDefinition {
  id: string;
  category: string;
  launchImpact: string;
  defaultSeverity: "low" | "medium" | "high" | "critical";
  productQuestion: string;
}

export const RISK_TAXONOMY: RiskDefinition[] = [
  {
    id: "prompt_injection",
    category: "security",
    defaultSeverity: "high",
    launchImpact: "The model may follow hostile user instructions over product policy.",
    productQuestion: "Can users override the intended assistant behavior?"
  },
  {
    id: "system_prompt_leakage",
    category: "security",
    defaultSeverity: "high",
    launchImpact: "Internal instructions or business controls may be exposed.",
    productQuestion: "Can users obtain hidden system or developer instructions?"
  },
  {
    id: "sensitive_information_disclosure",
    category: "privacy",
    defaultSeverity: "critical",
    launchImpact: "Private customer or company data may be disclosed.",
    productQuestion: "Can the assistant reveal personal, secret, or unrelated customer data?"
  },
  {
    id: "business_policy_hallucination",
    category: "business_policy",
    defaultSeverity: "high",
    launchImpact: "The assistant may invent product, refund, pricing, or compliance policy.",
    productQuestion: "Does the assistant stay inside approved business policy?"
  },
  {
    id: "unsafe_tool_use",
    category: "tool_safety",
    defaultSeverity: "critical",
    launchImpact: "The agent may call tools that mutate user, financial, or system state unsafely.",
    productQuestion: "Can risky tools run without user confirmation or policy checks?"
  },
  {
    id: "excessive_agency",
    category: "tool_safety",
    defaultSeverity: "high",
    launchImpact: "The AI may take autonomous action beyond the user-approved scope.",
    productQuestion: "Does the agent ask before acting in consequential workflows?"
  },
  {
    id: "rag_ungrounded_answer",
    category: "rag_groundedness",
    defaultSeverity: "high",
    launchImpact: "The assistant may answer from model prior knowledge instead of source documents.",
    productQuestion: "Are RAG answers grounded in retrieved source documents?"
  },
  {
    id: "missing_citation",
    category: "rag_groundedness",
    defaultSeverity: "medium",
    launchImpact: "Users cannot audit the source of factual product claims.",
    productQuestion: "Do important answers cite the documents they came from?"
  },
  {
    id: "refusal_failure",
    category: "safety",
    defaultSeverity: "high",
    launchImpact: "The assistant may comply with unsafe or disallowed requests.",
    productQuestion: "Does the assistant refuse the right things without being unhelpful?"
  },
  {
    id: "privacy_violation",
    category: "privacy",
    defaultSeverity: "critical",
    launchImpact: "The assistant may expose PII, secrets, or private account state.",
    productQuestion: "Can a user get another user's private information?"
  },
  {
    id: "cost_explosion",
    category: "cost",
    defaultSeverity: "medium",
    launchImpact: "The feature may exceed launch cost budgets at expected volume.",
    productQuestion: "Can this feature ship within its unit economics?"
  },
  {
    id: "latency_regression",
    category: "latency",
    defaultSeverity: "medium",
    launchImpact: "The feature may feel too slow for the intended workflow.",
    productQuestion: "Does the feature meet the product latency budget?"
  },
  {
    id: "jailbreak_attempt",
    category: "security",
    defaultSeverity: "high",
    launchImpact: "The model may comply with adversarial roleplay or bypass requests.",
    productQuestion: "Does the assistant hold policy under adversarial phrasing?"
  },
  {
    id: "destructive_action_without_confirmation",
    category: "tool_safety",
    defaultSeverity: "critical",
    launchImpact: "Destructive or financial actions may happen without explicit user approval.",
    productQuestion: "Are irreversible actions confirmed and logged?"
  }
];

export function getRiskDefinition(id: string): RiskDefinition | undefined {
  return RISK_TAXONOMY.find((risk) => risk.id === id);
}

