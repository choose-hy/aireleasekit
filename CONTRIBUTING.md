# Contributing

Thanks for helping improve AIReleaseKit.

## Principles

- Keep the project PM-first and release-decision-oriented.
- Deterministic checks must work without an API key.
- Do not add telemetry, a database, fine-tuning, or proprietary data requirements to the MVP.
- Prefer small, testable functions with clear TypeScript types and Zod validation.

## Development

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm build
pnpm test
```

Before opening a PR, run the demo:

```bash
pnpm --filter @aireleasekit/cli airelease demo
```

