# AIReleaseKit GitHub Action

Use this composite action to generate AI release evals, run them against a target, publish a Markdown summary, and fail the workflow when the launch decision is `BLOCK`.

Local development inside this repository:

```yaml
- uses: ./
  with:
    config: airelease.yaml
```

External usage after the first release tag:

```yaml
- uses: choose-hy/aireleasekit@v0.1.0
  with:
    config: airelease.yaml
    report-dir: reports
```

Inputs:

- `config`: path to `airelease.yaml`.
- `evals`: generated eval JSONL path.
- `report-dir`: report output directory.
- `target`: optional REST URL or `mock://name` override.

`BLOCK` exits non-zero. `WARN` is reported but does not fail CI by default.

