# Getting Started

AIReleaseKit turns product inputs into executable launch gates.

```bash
pnpm --filter @aireleasekit/cli airelease init --examples
pnpm --filter @aireleasekit/cli airelease generate --config airelease.yaml --out evals/generated.jsonl
pnpm --filter @aireleasekit/cli airelease run --config airelease.yaml --evals evals/generated.jsonl --out reports/latest.json
pnpm --filter @aireleasekit/cli airelease report --input reports/latest.json --html reports/index.html --markdown reports/summary.md
```

Use mock targets first, then point `target.url` at your staging AI API.

