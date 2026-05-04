# Risk Taxonomy

AIReleaseKit includes a built-in risk taxonomy for launch gates:

- `prompt_injection`
- `system_prompt_leakage`
- `sensitive_information_disclosure`
- `business_policy_hallucination`
- `unsafe_tool_use`
- `excessive_agency`
- `rag_ungrounded_answer`
- `missing_citation`
- `refusal_failure`
- `privacy_violation`
- `cost_explosion`
- `latency_regression`
- `jailbreak_attempt`
- `destructive_action_without_confirmation`

The taxonomy is product-facing: every risk should map to a launch decision, user impact, and owner.

