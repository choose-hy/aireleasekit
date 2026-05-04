# Security

AIReleaseKit is a local-first release-gating toolkit. It does not require telemetry, committed API keys, proprietary training data, or fine-tuning.

## Reporting Issues

Please report security issues privately to the maintainers before public disclosure. Include:

- Affected version or commit.
- Reproduction steps.
- Impact and any suggested mitigation.

## Handling Secrets

- Do not commit `.env` files.
- Use `OPENAI_API_KEY` only for optional LLM-as-judge mode.
- Deterministic checks should remain fully functional without network access.

