# GitHub Action

AIReleaseKit ships as a composite GitHub Action. It generates release evals, runs them against your target, writes a GitHub Step Summary, and fails CI when the launch decision is `BLOCK`.

## Local Development In This Repository

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

## External Repository After Release

After the first release tag is created:

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
      - uses: choose-hy/aireleasekit@v0.1.0
        with:
          config: airelease.yaml
          report-dir: reports
```

## Inputs

| Input | Default | Description |
| --- | --- | --- |
| `config` | `airelease.yaml` | Path to the AIReleaseKit YAML config in the calling repository. |
| `evals` | `evals/generated.jsonl` | Path where generated eval cases are written. |
| `report-dir` | `reports` | Directory where `latest.json`, `summary.md`, and `index.html` are written. |
| `target` | empty | Optional REST URL or `mock://name` override for `target` in config. |

## CI Behavior

- `BLOCK` exits non-zero and fails CI.
- `WARN` does not fail CI by default.
- `SHIP` passes CI.
- The Markdown report is appended to `$GITHUB_STEP_SUMMARY`.

## Upload HTML Report As Artifact

```yaml
      - uses: choose-hy/aireleasekit@v0.1.0
        with:
          config: airelease.yaml
          report-dir: reports

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: aireleasekit-report
          path: reports/index.html
```

## Target Override

Use `target` when a PR workflow needs to point at a temporary deployment:

```yaml
      - uses: choose-hy/aireleasekit@v0.1.0
        with:
          config: airelease.yaml
          target: https://preview.example.com/api/chat
```

