# AIReleaseKit Roadmap

AIReleaseKit v0.1.0 is a working MVP focused on local release gates, deterministic checks, examples, reports, and GitHub Action support. The roadmap below is intentionally practical: improve the launch workflow before expanding into heavier infrastructure.

## v0.1.x Improvements

- Improve generated case variety for customer support, RAG policy, financial actions, healthcare-style disclaimers, and enterprise assistants.
- Add more deterministic assertion helpers with clearer failure messages.
- Improve report readability for product review meetings.
- Add more sample output under `examples/sample-output/` or `docs/assets/`.
- Harden Windows, macOS, and Linux CLI behavior.
- Add clearer error handling for malformed config, invalid JSONL, and unreachable REST targets.
- Improve GitHub Action examples for external repositories after the first release tag.
- Add smoke tests that mimic a clean user checkout.
- Add contributor-friendly docs for template creation and risk taxonomy updates.

## v0.2.0 Planned Features

- Baseline comparison for pull requests.
- Provider adapters for common LLM and agent endpoints.
- MCP-like schema scanning for agent tools.
- Richer PRD parser that extracts goals, user segments, non-goals, risk statements, and launch thresholds.
- Report diffs that explain what changed from the previous run.
- More configurable release policies by category and severity.
- Optional LLM case expansion with strict deterministic fallback.
- Optional LLM-as-judge rubric packs for common AI product categories.

## npm Publishing

Planned work:

- Publish `@aireleasekit/core` and `@aireleasekit/cli`.
- Keep the monorepo root private.
- Add provenance-friendly release workflow.
- Document `pnpm dlx` or `npx` usage once packages are public.
- Add semver and changelog guidelines.
- Add release checklist coverage for npm tokens, package contents, and dry-run validation.

## MCP Scanner

Planned work:

- Parse MCP-like tool definitions and server manifests.
- Identify file-system, shell, network, email, payment, refund, delete, update, and personal-data access tools.
- Detect ambiguous or deceptive tool descriptions.
- Recommend policy YAML with `allow`, `warn`, `require_human_approval`, and `block` decisions.
- Add examples for safe read-only tools and high-risk mutating tools.

## Baseline Comparison

Planned work:

- Compare PR results against a saved baseline.
- Highlight newly failing cases.
- Track pass-rate movement by category.
- Track cost and latency regressions.
- Support GitHub Action comments that summarize deltas.
- Make `WARN` configurable for small regressions and `BLOCK` configurable for critical regressions.

## Provider Adapters

Planned work:

- Add adapters for common OpenAI-compatible chat APIs.
- Add generic webhook and REST response mapping.
- Add lightweight adapters for RAG apps that return citations.
- Add adapters for tool-calling responses with structured `tool_calls`.
- Keep the core runner independent of any single provider.

## Richer PRD Parser

Planned work:

- Extract product goals, user personas, launch criteria, risks, non-goals, and policy rules.
- Improve support for markdown headings and tables.
- Detect explicit quality bars in PRDs.
- Generate category-specific cases from acceptance criteria.
- Preserve traceability from generated eval cases back to PRD sections.

## Contributions Welcome

High-impact contribution areas:

- More synthetic eval templates.
- More real-world examples.
- Better report design.
- New deterministic scorers.
- GitHub Action polish.
- Documentation for AI product launch reviews.
