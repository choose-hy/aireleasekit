# AIReleaseKit v0.1.0 Launch Posts

Use these as starting points for launch announcements. Adjust tone and links for each channel.

## English Launch Post

I just released AIReleaseKit v0.1.0:

**Turn PRDs into AI release gates.**

AIReleaseKit is an open-source toolkit for AI product teams that need to decide whether an LLM, RAG, or agent feature is safe and good enough to ship.

It is not another chatbot framework. It is a release gate for AI product quality.

Instead of requiring labeled training data or fine-tuning, AIReleaseKit starts from the artifacts teams already have:

- PRDs
- system prompts
- RAG docs
- agent tool schemas
- launch quality bars

Then it generates synthetic eval cases, red-team tests, tool-safety checks, cost and latency budget checks, and a final product-facing release decision:

`SHIP` / `WARN` / `BLOCK`

The MVP includes:

- TypeScript CLI
- deterministic checks that run without an API key
- optional LLM-as-judge support
- mock and REST targets
- tool-risk scanning
- Markdown and static HTML reports
- examples for support agents, RAG policy bots, and refund tools
- GitHub Action support
- bilingual English/Chinese docs

The goal is simple: help AI PMs and engineers catch risky AI changes before merge.

Try it from source:

```bash
git clone https://github.com/choose-hy/aireleasekit.git
cd aireleasekit
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm build
pnpm --filter @aireleasekit/cli airelease demo
```

GitHub: https://github.com/choose-hy/aireleasekit

I would love feedback from teams building AI agents, RAG systems, and PM-owned launch review workflows.

## Hacker News Version

Show HN: AIReleaseKit - turn PRDs into AI release gates

I built AIReleaseKit, an open-source TypeScript toolkit for release-gating AI features.

The idea is that many teams already have PRDs, prompts, RAG docs, and agent tool schemas, but they do not have training data or mature eval infrastructure. AIReleaseKit turns those existing artifacts into synthetic eval cases, deterministic checks, tool-safety scans, cost/latency budgets, and a final launch decision: SHIP / WARN / BLOCK.

It is PM-first rather than prompt-test-first. The output is meant to answer "is this safe and good enough to ship?" with product-facing reasons like "refund tool can be called without confirmation" or "RAG answer did not cite source documents."

The MVP works locally with mock targets and does not require an API key. Optional LLM-as-judge mode can be enabled later.

Repo: https://github.com/choose-hy/aireleasekit

I am especially interested in feedback on the release-decision model, synthetic case templates, and what CI gates would be useful for real AI product teams.

## LinkedIn Version

I am launching AIReleaseKit v0.1.0, an open-source release-gating toolkit for AI products.

AI teams often ask:

"Our prompt changed. Our agent gained a new tool. Our RAG docs changed. Are we still safe to ship?"

AIReleaseKit helps answer that with a PM-readable release decision:

`SHIP` / `WARN` / `BLOCK`

It generates synthetic eval cases from PRDs, prompts, RAG docs, and agent tool schemas, then runs deterministic checks against a mock or real target. The report includes pass rates, failed cases, tool-risk findings, latency/cost summaries, and recommended product/prompt/engineering fixes.

No training dataset required.
No fine-tuning required.
No backend or database required for the MVP.

This is for AI product managers, AI engineers, and startup teams who want a lightweight gate before risky AI changes merge.

Repo: https://github.com/choose-hy/aireleasekit

Feedback welcome, especially from teams building RAG apps, tool-calling agents, and AI launch-review workflows.

## Chinese Launch Post

我发布了 AIReleaseKit v0.1.0：

**把 PRD 转成 AI 上线门禁。**

AIReleaseKit 是一个开源的 AI 产品上线评测工具，面向 AI 产品经理、AI 工程团队和正在做 AI Agent / RAG 应用的创业团队。

它不是聊天机器人框架，也不是普通 prompt 测试工具。

它解决的是一个更产品化的问题：

> 这个 AI 功能现在是否安全、可靠、足够好，可以上线？

AIReleaseKit 可以从团队已经有的材料开始：

- PRD
- system prompt
- RAG 文档
- Agent tool schema
- 上线质量标准

自动生成 synthetic eval cases、红队测试、工具调用安全检查、成本和延迟预算检查，并输出最终上线决策：

`SHIP` / `WARN` / `BLOCK`

比如它可以发现：

- 隐私红队测试未达到上线阈值
- refund 工具可以在没有用户确认时被调用
- RAG 回答没有引用来源文档
- P95 延迟超过预算
- 业务政策被模型编造

v0.1.0 是一个可运行的 MVP：

- TypeScript CLI
- 不需要训练数据
- 不需要微调模型
- 默认不需要 API Key
- 支持本地 mock target
- 支持 REST target
- 支持工具风险扫描
- 生成 Markdown 和静态 HTML 报告
- 包含英文和中文文档
- 支持 GitHub Action 集成

试用：

```bash
git clone https://github.com/choose-hy/aireleasekit.git
cd aireleasekit
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm build
pnpm --filter @aireleasekit/cli airelease demo
```

GitHub: https://github.com/choose-hy/aireleasekit

如果你正在做 AI Agent、RAG、LLM 应用上线流程，欢迎试用和提建议。

## Chinese Community Version

分享一个刚做完 v0.1.0 的开源项目：AIReleaseKit。

一句话：把 PRD、Prompt、RAG 文档和 Agent 工具 schema 转成可执行的 AI 上线门禁。

现在很多 AI 应用的问题不是“能不能聊起来”，而是上线前没人能系统回答：

- 隐私是否安全？
- Agent 工具调用是否越权？
- RAG 回答是否有来源？
- 成本和延迟是否超预算？
- 改了一版 prompt 以后有没有退化？

AIReleaseKit 的目标是让这些问题进入 CI 和发布流程。它会生成 synthetic eval cases，跑本地 mock target 或 REST target，最后给出 SHIP / WARN / BLOCK。

这个项目默认不需要训练数据、不需要微调、不需要 API Key。适合还没有复杂 eval 平台的小团队先把 AI release gate 建起来。

Repo: https://github.com/choose-hy/aireleasekit

欢迎拍砖，尤其想听听大家在 Agent / RAG 上线评审里最痛的风险点是什么。

## Tweet-Style Variants

### Variant 1

AIReleaseKit v0.1.0 is live.

Turn PRDs, prompts, RAG docs, and agent tool schemas into executable AI release gates:

`SHIP` / `WARN` / `BLOCK`

No training data required. Runs locally. Built for AI PMs and engineers.

https://github.com/choose-hy/aireleasekit

### Variant 2

Most AI eval tools test prompts.

AIReleaseKit asks a product question:

Is this AI feature safe and good enough to ship?

It generates evals from PRDs, prompts, docs, and tool schemas, then blocks risky changes before merge.

https://github.com/choose-hy/aireleasekit

### Variant 3

Launching AIReleaseKit v0.1.0:

- synthetic evals from PRDs
- red-team checks
- RAG citation gates
- agent tool-risk scanner
- cost and latency budgets
- Markdown/HTML reports
- GitHub Action support

Final output: SHIP / WARN / BLOCK.

https://github.com/choose-hy/aireleasekit

## Technical Blog Outline

Title: Building AIReleaseKit: Product-First Release Gates for LLM, RAG, and Agent Apps

1. The problem
   - AI features are easy to demo and hard to release safely.
   - Prompt tests alone do not answer product launch questions.
   - Small teams often lack labeled datasets, eval platforms, or dedicated AI safety infrastructure.

2. The design principle
   - Start from artifacts teams already maintain: PRDs, prompts, RAG docs, tool schemas, and launch quality bars.
   - Turn product intent into executable checks.
   - Make the output useful to PMs and engineers.

3. Why SHIP / WARN / BLOCK
   - Teams need a decision, not only raw metrics.
   - BLOCK reasons should be product-facing and actionable.
   - WARN should separate release risk from non-blocking operational concerns.

4. Synthetic eval generation without training data
   - Deterministic templates for happy path, edge cases, red-team cases, privacy, business policy, RAG groundedness, and tool safety.
   - Optional LLM expansion later, but not required for the MVP.

5. Deterministic checks first
   - Contains and must-not-contain checks.
   - Citation-required checks.
   - PII and secret-leak checks.
   - Tool-call authorization and confirmation checks.
   - Latency and cost budget checks.

6. Tool-risk scanning
   - Why agent tools change the release-risk profile.
   - Detecting file writes, shell execution, refunds, payments, deletes, updates, email sending, personal-data access, and missing confirmation controls.
   - Producing recommended policy YAML.

7. Reports for launch review
   - JSON for automation.
   - Markdown for PR summaries.
   - Static HTML for product review.
   - Product, prompt, and engineering fix recommendations.

8. GitHub Action integration
   - Running release gates on pull requests.
   - Failing CI on BLOCK.
   - Keeping WARN visible without blocking by default.

9. Lessons from v0.1.0
   - Project references and clean CI matters.
   - Mock targets make examples shippable.
   - PM-facing language is part of the product.

10. Roadmap
   - npm publishing.
   - MCP scanner.
   - baseline comparison.
   - provider adapters.
   - richer PRD parser.
   - richer report artifacts.

11. Invitation
   - Ask for feedback from AI PMs, AI engineers, and agent/RAG teams.
   - Link to good first issues and roadmap.
