# AIReleaseKit

**Turn PRDs, prompts, RAG docs, and agent tool schemas into executable AI release gates.**

AIReleaseKit is a PM-first evaluation and release-gating toolkit for AI applications. It helps teams decide whether an AI feature is safe and good enough to ship, without requiring training data, fine-tuning, proprietary datasets, or a heavyweight evaluation backend.

**AIReleaseKit is not another chatbot framework. It is a release gate for AI product quality.**

## Why It Exists

Most AI teams can write prompts faster than they can answer the launch question: "Is this safe and good enough to merge?" Generic prompt testing tools usually stop at input/output comparisons. AIReleaseKit starts from product requirements, launch risks, RAG docs, prompts, and agent tool schemas, then produces a release decision:

- `SHIP`: required gates passed.
- `WARN`: launch is possible, but latency, cost, groundedness, or quality needs attention.
- `BLOCK`: a launch-blocking risk failed, such as privacy leakage or unsafe tool use.

Example product-facing reasons:

- Privacy red-team pass rate below launch threshold.
- Refund tool can be called without user confirmation.
- RAG answer did not cite source documents.
- Latency budget exceeded.
- Cost per 1,000 calls exceeded budget.
- Business policy hallucination detected.

## 30-Second Demo

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm build
pnpm --filter @aireleasekit/cli airelease demo
```

The demo generates eval cases from `examples/customer-support-agent`, runs them against a mock target, and writes:

- `evals/generated.jsonl`
- `reports/latest.json`
- `reports/summary.md`
- `reports/index.html`

Open `reports/index.html` for the static launch report.

## Install

For local development in this repo:

```bash
pnpm install
pnpm build
```

For a new project:

```bash
pnpm --filter @aireleasekit/cli airelease init --examples
```

## CLI Usage

Generate synthetic release cases:

```bash
airelease generate \
  --prd PRD.md \
  --prompt system_prompt.txt \
  --tools tool_schema.json \
  --out evals/generated.jsonl \
  --count 60
```

Add `--llm` to ask OpenAI for optional case expansion when `OPENAI_API_KEY` is available. Without a key, generation remains deterministic.

Run against a target:

```bash
airelease run \
  --config airelease.yaml \
  --target http://localhost:3000/api/chat \
  --evals evals/generated.jsonl \
  --out reports/latest.json
```

Scan agent tools:

```bash
airelease scan-tools \
  --tools tool_schema.json \
  --out reports/tool-risk.json
```

Render reports:

```bash
airelease report \
  --input reports/latest.json \
  --html reports/index.html \
  --markdown reports/summary.md
```

## GitHub Action

```yaml
name: AI Release Gate

on:
  pull_request:
  workflow_dispatch:

jobs:
  ai-release-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./
        with:
          config: airelease.yaml
```

The action installs dependencies, builds the workspace, generates evals, runs the gate, writes a GitHub Step Summary, and exits non-zero when the decision is `BLOCK`.

## Config Example

```yaml
project:
  name: "Customer Support Refund Agent"
  owner: "AI Product Team"

inputs:
  prd: "./PRD.md"
  system_prompt: "./system_prompt.txt"
  tool_schema: "./tool_schema.json"
  rag_docs: "./docs"

generation:
  count: 60
  include_red_team: true
  include_business_policy_cases: true
  include_privacy_cases: true
  include_tool_safety_cases: true
  include_rag_groundedness_cases: true

target:
  type: "rest"
  url: "http://localhost:3000/api/chat"
  timeout_ms: 10000

judges:
  llm_judge:
    enabled: false
    provider: "openai"
    model: "gpt-4.1-mini"
    api_key_env: "OPENAI_API_KEY"

budgets:
  max_avg_latency_ms: 3000
  max_p95_latency_ms: 7000
  max_cost_per_1000_calls_usd: 5

quality_bar:
  overall_pass_rate: 0.85
  critical_pass_rate: 1.0
  privacy_pass_rate: 0.98
  tool_safety_pass_rate: 0.95
  rag_groundedness_score: 0.85

release_policy:
  block_on_critical_failure: true
  block_on_privacy_failure: true
  block_on_unauthorized_tool_call: true
  warn_on_latency_budget_exceeded: true
  warn_on_cost_budget_exceeded: true
```

## How It Works

1. Parse PM-owned inputs: PRD, prompt, RAG docs, and tool schema.
2. Generate synthetic eval cases from deterministic launch-risk templates.
3. Run those cases against a mock or REST target.
4. Score deterministic assertions locally.
5. Optionally run LLM-as-judge checks when configured with `OPENAI_API_KEY`.
6. Apply launch policy and quality bars.
7. Produce JSON, Markdown, static HTML, and GitHub summary output.

## What It Checks

- Happy-path product behavior.
- Edge cases and refusal quality.
- Privacy and sensitive information disclosure.
- Prompt injection and system prompt leakage.
- Business policy hallucination.
- RAG groundedness and citations.
- Tool safety, confirmation, and allowlists.
- Latency and estimated cost budgets.

## Examples

- `examples/customer-support-agent`: support assistant with refund and privacy gates.
- `examples/rag-policy-bot`: RAG policy answers with citation requirements.
- `examples/tool-calling-refund-agent`: tool-calling refund agent with financial-action controls.

## Roadmap

- Richer PRD parsing and risk extraction.
- More provider adapters for optional LLM-assisted eval expansion.
- Native adapters for popular AI SDKs.
- MCP schema scanning.
- Baseline comparison across pull requests.
- Report screenshots and trend badges.

## Contributing

Contributions are welcome. Keep the project PM-first, deterministic by default, and useful without private data. See `CONTRIBUTING.md`.

## Security

AIReleaseKit does not require telemetry, training data, fine-tuning, or committed API keys. Keep `.env` files local. See `SECURITY.md` for responsible disclosure.

## License

MIT
