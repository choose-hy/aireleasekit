# Config Reference

`airelease.yaml` defines the launch gate.

- `project`: product name and owner.
- `inputs`: PRD, prompt, tool schema, and RAG docs.
- `generation`: synthetic case count and included risk families.
- `target`: `mock` or `rest`.
- `judges`: optional LLM-as-judge settings.
- `budgets`: latency and cost budgets.
- `quality_bar`: pass-rate thresholds.
- `release_policy`: rules that turn failures into `SHIP`, `WARN`, or `BLOCK`.

The default path is deterministic. Set `judges.llm_judge.enabled: true` only when `OPENAI_API_KEY` is available.

## Mock Targets

The built CLI can load JavaScript ESM/CommonJS mock targets via `target.module` when the file ends in `.js`, `.mjs`, or `.cjs`.

TypeScript mock targets are intentionally not loaded by the built CLI. Compile them first or run through a TypeScript loader.
