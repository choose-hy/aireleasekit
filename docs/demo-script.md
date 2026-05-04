# AIReleaseKit Demo Scripts

These scripts are designed for live demos, launch videos, and conference-style walkthroughs.

## 60-Second Demo Script - English

**Opening, 0-10 seconds**

"AI teams often change prompts, RAG docs, or agent tools, then ask: is this still safe and good enough to ship? AIReleaseKit turns those product artifacts into an executable release gate."

**Problem, 10-20 seconds**

"This is not a chatbot framework and not only a prompt tester. It generates launch-focused evals from PRDs, prompts, RAG docs, and tool schemas, then returns a product decision: SHIP, WARN, or BLOCK."

**Command, 20-35 seconds**

```bash
pnpm --filter @aireleasekit/cli airelease demo
```

"The demo uses built-in examples and a mock target, so it runs locally without training data, fine-tuning, or an API key."

**Output, 35-50 seconds**

"AIReleaseKit generates eval cases, runs them against the target, checks privacy, RAG groundedness, tool safety, cost, and latency, then writes a JSON report, Markdown summary, and static HTML report."

**Decision, 50-60 seconds**

"The key output is SHIP, WARN, or BLOCK with product-facing reasons. For example: privacy threshold failed, refund tool called without confirmation, missing RAG citation, or latency budget exceeded."

## 3-Minute Demo Script - English

**Opening, 0-20 seconds**

"AIReleaseKit is an open-source release-gating toolkit for AI apps. The goal is to help AI product managers and engineers answer one question before merge: is this AI feature safe, reliable, and good enough to ship?"

**Context, 20-45 seconds**

"Most teams already have a PRD, a system prompt, RAG documents, maybe an agent tool schema, and some quality expectations. What they often do not have is a training dataset, fine-tuning pipeline, or mature eval platform. AIReleaseKit starts from those existing product artifacts."

**Show Inputs, 45-75 seconds**

"In the examples folder we have a customer support agent, a RAG policy bot, and a tool-calling refund agent. Each example includes a PRD, prompt, config, and sometimes a tool schema or docs."

```bash
pnpm --filter @aireleasekit/cli airelease demo
```

"This command runs the full local flow: generate synthetic eval cases, run the mock target, score the outputs, and create reports."

**Generation, 75-115 seconds**

"The generated cases include happy paths, edge cases, red-team cases, privacy checks, business policy checks, RAG groundedness checks, and tool-safety checks. The default path is deterministic and does not require an API key."

**Scoring, 115-150 seconds**

"During the run, AIReleaseKit measures latency, estimates cost when possible, evaluates assertions, checks citations, checks whether personal data or secrets appear, and validates risky tool calls. Optional LLM-as-judge mode can be enabled separately, but the MVP does not require it."

**Report, 150-170 seconds**

"The report is generated as structured JSON, Markdown, and static HTML. It includes overall pass rate, pass rate by category, critical failures, top failed cases, latency and cost summaries, tool-risk findings, and recommended product, prompt, and engineering fixes."

**Decision, 170-180 seconds**

"SHIP means required gates pass. WARN means the feature is mostly acceptable but has non-blocking risks like latency or cost budget issues. BLOCK means a launch gate failed, such as a critical privacy failure or unsafe tool call. That makes the output useful in GitHub Actions and in PM launch review."

## 60 秒演示脚本 - 中文

**开场，0-10 秒**

"AI 团队经常会改 prompt、RAG 文档或者 Agent 工具，但上线前真正的问题是：这个功能现在还安全吗？够好吗？AIReleaseKit 就是把这些产品材料转成可执行的上线门禁。"

**问题，10-20 秒**

"它不是聊天机器人框架，也不是普通 prompt 测试工具。它从 PRD、prompt、RAG 文档和 tool schema 生成上线评测，最后输出 SHIP、WARN 或 BLOCK。"

**命令，20-35 秒**

```bash
pnpm --filter @aireleasekit/cli airelease demo
```

"这个 demo 使用内置示例和 mock target，本地即可运行，不需要训练数据、不需要微调，也不需要 API Key。"

**输出，35-50 秒**

"AIReleaseKit 会生成 eval cases，调用目标应用，检查隐私、RAG 引用、工具调用安全、成本和延迟，然后生成 JSON、Markdown 和静态 HTML 报告。"

**决策，50-60 秒**

"核心结果是 SHIP / WARN / BLOCK，并给出产品可理解的原因，比如隐私阈值未通过、退款工具缺少用户确认、RAG 没有引用来源、延迟超过预算。"

## 3 分钟演示脚本 - 中文

**开场，0-20 秒**

"AIReleaseKit 是一个开源的 AI 应用上线门禁工具。它帮助 AI 产品经理和工程团队在合并代码前回答一个问题：这个 AI 功能是否安全、可靠、足够好，可以上线？"

**背景，20-45 秒**

"很多团队已经有 PRD、系统提示词、RAG 文档、Agent 工具 schema 和一些上线质量要求，但没有训练数据、微调流程，也没有复杂的 eval 平台。AIReleaseKit 从这些已有材料开始工作。"

**展示输入，45-75 秒**

"examples 目录里有客户支持 Agent、RAG 政策 Bot、退款工具调用 Agent。每个示例都有 PRD、prompt、config，有的还有 tool schema 或文档。"

```bash
pnpm --filter @aireleasekit/cli airelease demo
```

"这个命令会跑完整本地流程：生成 synthetic eval cases，调用 mock target，评分，并生成报告。"

**生成评测，75-115 秒**

"生成的 cases 包括 happy path、edge case、红队测试、隐私测试、业务政策测试、RAG groundedness 测试和工具安全测试。默认路径是确定性的，不需要 API Key。"

**评分，115-150 秒**

"运行时，AIReleaseKit 会测量延迟，在可能时估算成本，执行断言，检查引用，检查是否泄露个人信息或密钥，并验证高风险工具调用是否有授权和确认。LLM-as-judge 是可选模式，不是 MVP 必需条件。"

**报告，150-170 秒**

"报告会输出 JSON、Markdown 和静态 HTML。里面包含总体通过率、按类别通过率、critical failures、失败用例、延迟和成本摘要、工具风险矩阵，以及产品、prompt 和工程修复建议。"

**决策，170-180 秒**

"SHIP 表示关键门禁通过。WARN 表示存在非阻塞风险，比如延迟或成本超预算。BLOCK 表示上线门禁失败，比如隐私失败或危险工具调用。这个结果既适合 GitHub Actions，也适合产品上线评审。"
