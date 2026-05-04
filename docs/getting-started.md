# Getting Started

AIReleaseKit turns PRDs, prompts, RAG docs, and agent tool schemas into executable AI release gates.

## Run From Source

```bash
git clone https://github.com/choose-hy/aireleasekit.git
cd aireleasekit
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm build
pnpm --filter @aireleasekit/cli airelease demo
```

The demo writes:

- `evals/generated.jsonl`
- `reports/latest.json`
- `reports/summary.md`
- `reports/index.html`

## Bring Your Own AI App

1. Create `airelease.yaml`.
2. Point `inputs.prd`, `inputs.system_prompt`, and optional `inputs.tool_schema` at your product files.
3. Generate eval cases.
4. Run against a mock target first.
5. Point `target.url` at your staging AI API.

```bash
pnpm --filter @aireleasekit/cli airelease generate --config airelease.yaml --out evals/generated.jsonl
pnpm --filter @aireleasekit/cli airelease run --config airelease.yaml --evals evals/generated.jsonl --out reports/latest.json
pnpm --filter @aireleasekit/cli airelease report --input reports/latest.json --html reports/index.html --markdown reports/summary.md
```

Deterministic checks work without an API key. Optional LLM-as-judge checks require `OPENAI_API_KEY`.

