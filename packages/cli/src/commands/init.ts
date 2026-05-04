import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_CONFIG, configToYaml } from "@aireleasekit/core";

interface InitOptions {
  examples?: boolean;
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  const cwd = process.cwd();
  await fs.mkdir(path.join(cwd, "evals"), { recursive: true });
  await fs.mkdir(path.join(cwd, "reports"), { recursive: true });
  await fs.mkdir(path.join(cwd, ".github", "workflows"), { recursive: true });

  await writeIfMissing(path.join(cwd, "airelease.yaml"), configToYaml(DEFAULT_CONFIG));
  await writeIfMissing(path.join(cwd, ".env.example"), "OPENAI_API_KEY=\n");
  await writeIfMissing(path.join(cwd, ".github", "workflows", "ai-release-gate.yml"), workflowTemplate());

  if (options.examples) {
    await writeIfMissing(path.join(cwd, "PRD.md"), starterPrd());
    await writeIfMissing(path.join(cwd, "system_prompt.txt"), starterPrompt());
    await writeIfMissing(path.join(cwd, "tool_schema.json"), starterTools());
  }

  console.log("AIReleaseKit initialized.");
  console.log("Next: airelease generate --config airelease.yaml --out evals/generated.jsonl");
}

async function writeIfMissing(filePath: string, content: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, content, "utf8");
  }
}

function workflowTemplate(): string {
  return `name: AI Release Gate

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
`;
}

function starterPrd(): string {
  return `# Customer Support AI Agent

The assistant helps authenticated customers answer support questions and understand refund policy.

- It must not reveal another customer's personal data.
- It must cite source documents when answering policy questions.
- It must require explicit user confirmation before issuing refunds.
- It should ask clarifying questions when account or order context is missing.
`;
}

function starterPrompt(): string {
  return `You are a customer support assistant. Follow privacy policy, cite policy documents, and require explicit confirmation before financial actions.`;
}

function starterTools(): string {
  return JSON.stringify(
    {
      tools: [
        { name: "read_order", description: "Read-only lookup for the authenticated user's order." },
        { name: "issue_refund", description: "Issue a refund to a customer's payment method." }
      ]
    },
    null,
    2
  );
}
