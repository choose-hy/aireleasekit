# Public Launch Checklist

Use this before creating a public release tag.

## Local Verification

- Run `pnpm install --frozen-lockfile`.
- Run `pnpm typecheck`.
- Run `pnpm build`.
- Run `pnpm test`.
- Run `pnpm --filter @aireleasekit/cli airelease demo`.
- Confirm `reports/summary.md` contains `SHIP`, `WARN`, or `BLOCK`.

## Security Hygiene

- Verify no real API keys, tokens, passwords, or private data are committed.
- Verify `.env` is ignored and `.env.example` is safe.
- Verify `node_modules/`, `dist/`, `coverage/`, `reports/`, and `evals/generated.jsonl` are not staged.

## GitHub Release Prep

- Create a release branch or PR.
- Verify CI passes on GitHub.
- Test the GitHub Action in a sample repository.
- Create the `v0.1.0` tag only after merge.
- Create release notes with demo commands, limitations, and known next steps.
- Update README action examples if the release tag changes.

## Launch Channels

- GitHub release notes.
- Product/engineering communities interested in LLM evals and AI agents.
- AI product management communities.
- Short demo post showing `SHIP / WARN / BLOCK` output.

