# AIReleaseKit GitHub Action

Use this action to generate AI release evals, run them against a target, publish a Markdown summary, and fail the workflow when the launch decision is `BLOCK`.

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

The action assumes your repository contains an `airelease.yaml` with PRD, prompt, optional RAG docs, optional tool schema, target, budgets, and quality bars.

