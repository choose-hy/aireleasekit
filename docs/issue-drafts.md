# GitHub Issue Drafts

These drafts are ready to turn into GitHub issues after launch.

## 1. Add npm Publishing Support

**Title:** Add npm publishing support for `@aireleasekit/core` and `@aireleasekit/cli`

**Labels:** `enhancement`, `release`, `good first issue`

**Body:**

AIReleaseKit v0.1.0 is currently source-first. Users clone the repository and run the CLI from the pnpm workspace. The next step is to publish the core and CLI packages to npm.

Scope:

- Keep the monorepo root private.
- Publish `@aireleasekit/core`.
- Publish `@aireleasekit/cli`.
- Add package export checks.
- Add release dry-run documentation.
- Document `pnpm dlx` or `npx` usage once packages are published.
- Make sure package contents do not include reports, eval artifacts, secrets, or local files.

Acceptance criteria:

- `pnpm pack --dry-run` output is reviewed for each publishable package.
- npm install docs are added only after publishing is ready.
- Existing source-based install docs remain valid.
- CI still passes.

## 2. Add MCP Schema Scanner

**Title:** Add MCP-like schema scanning for agent tool definitions

**Labels:** `enhancement`, `agent-safety`, `tooling`

**Body:**

The current tool-risk scanner handles common tool schema shapes. Many agent stacks expose MCP-like server manifests or tool definitions. AIReleaseKit should scan those formats and map tools into release policies.

Scope:

- Add parser support for MCP-like tool definitions.
- Detect risky capabilities such as shell execution, file write, delete/update mutations, external network requests, email sending, payments, refunds, and personal-data access.
- Preserve deterministic behavior without requiring an API key.
- Generate recommended policy YAML.
- Add examples and tests.

Acceptance criteria:

- A sample MCP-like schema is scanned successfully.
- Risky tools are categorized as `warn`, `require_human_approval`, or `block`.
- Read-only tools can be categorized as `allow`.
- Tests cover at least one safe and one high-risk tool.

## 3. Add PR Baseline Comparison

**Title:** Add baseline comparison for pull request release gates

**Labels:** `enhancement`, `ci`, `reports`

**Body:**

AIReleaseKit currently reports a single run. For pull requests, teams also need to know what changed from the previous baseline.

Scope:

- Compare current results against a saved baseline JSON report.
- Highlight newly failing cases.
- Highlight pass-rate changes by category.
- Highlight latency and cost regressions.
- Produce Markdown suitable for GitHub PR summaries.
- Add CLI options for `--baseline` and `--compare-out` or similar.

Acceptance criteria:

- Baseline comparison works with two JSON reports.
- New failures are clearly separated from existing failures.
- Cost and latency regressions are visible.
- Tests cover improved, unchanged, and regressed cases.

## 4. Add More Synthetic Eval Templates

**Title:** Add more synthetic eval templates for common AI product risks

**Labels:** `enhancement`, `evals`, `good first issue`

**Body:**

AIReleaseKit should include more deterministic eval templates so users get useful coverage without an API key or training data.

Suggested template areas:

- SaaS support agents.
- Refund and payment flows.
- RAG policy bots.
- Internal knowledge assistants.
- Healthcare-style safety disclaimers.
- Education tutors.
- Legal-information disclaimers.
- Enterprise access-control scenarios.
- Prompt injection and jailbreak attempts.

Acceptance criteria:

- New templates include category, risk, severity, expected behavior, assertions, and tags.
- Templates are deterministic.
- Tests confirm generated cases include the new categories when enabled.
- Docs mention the new coverage.

## 5. Add Real-World RAG Example

**Title:** Add a more realistic RAG policy-bot example with citations and failure cases

**Labels:** `documentation`, `examples`, `rag`

**Body:**

The current examples are intentionally small. A more realistic RAG example would help users understand groundedness, citation requirements, and business policy hallucination checks.

Scope:

- Add a sample policy document set under `examples/`.
- Add a PRD with explicit launch quality bars.
- Add a mock target that intentionally passes some cases and fails others.
- Add expected report excerpts under `examples/sample-output/` or docs assets.
- Document how to run the example.

Acceptance criteria:

- The example runs locally without an API key.
- Reports include RAG citation and groundedness behavior.
- Failure cases are product-facing and understandable.
- No proprietary or personal data is included.
