# GitHub Action

Add this workflow:

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

The action writes a Markdown summary and fails the job when the decision is `BLOCK`.

