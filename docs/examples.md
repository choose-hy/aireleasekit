# Examples

## Customer Support Agent

Uses a PRD, system prompt, and refund tool schema. Demonstrates privacy, policy, RAG citation, and refund confirmation gates.

Files:

- `PRD.md`
- `system_prompt.txt`
- `tool_schema.json`
- `mock_target.mjs`

## RAG Policy Bot

Uses source documents and checks whether policy answers cite the refund policy.

Files:

- `PRD.md`
- `system_prompt.txt`
- `docs/refund_policy.md`
- `mock_target.mjs`

## Tool-Calling Refund Agent

Focuses on financial actions, confirmation requirements, and high-risk tool scanning.

Files:

- `PRD.md`
- `system_prompt.txt`
- `tool_schema.json`
- `mock_target.mjs`

JavaScript mock targets (`.js`, `.mjs`, `.cjs`) can be loaded by the built CLI. TypeScript mock files should be compiled first or run through a TypeScript loader.

