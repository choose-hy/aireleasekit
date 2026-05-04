# AIReleaseKit：把 PRD 转成 AI 上线门禁

[English README](README.md)

**AIReleaseKit 不是聊天机器人框架。**  
**它也不是普通 prompt 测试工具。**

AIReleaseKit 是一个面向 AI 产品经理、AI 工程团队和创业团队的开源上线评测工具。它解决的问题是：

> 一个 AI 功能在合并和上线之前，是否足够安全、可靠、可控？

它可以把 PRD、系统提示词、RAG 文档和 Agent 工具 schema 转成可执行的评测集、红队测试、成本/延迟预算、工具风险策略，并给出最终上线决策：

`SHIP` / `WARN` / `BLOCK`

## 为什么需要它

AI 应用越来越容易做出来，但上线前的质量判断仍然很难：

- 会不会泄露用户隐私？
- 会不会编造业务政策？
- RAG 回答有没有引用来源？
- Agent 会不会在没有确认的情况下调用退款、删除、发邮件等高风险工具？
- 成本和延迟能不能接受？
- PR 里应该用什么标准判断能不能合并？

AIReleaseKit 把这些问题转成可执行的 release gate。

## 核心特点

- 不需要训练数据。
- 不需要微调模型。
- 默认不需要 API key。
- 可以本地运行。
- 可以生成合成评测用例。
- 可以扫描 Agent 工具 schema 的风险。
- 可以输出 JSON、Markdown 和静态 HTML 报告。
- 可以在 GitHub Actions 中阻断高风险 AI 改动。

## 30 秒演示

```bash
git clone https://github.com/choose-hy/aireleasekit.git
cd aireleasekit
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm build
pnpm --filter @aireleasekit/cli airelease demo
```

运行后会生成：

- `evals/generated.jsonl`
- `reports/latest.json`
- `reports/summary.md`
- `reports/index.html`

打开 `reports/index.html` 可以查看静态上线报告。

## SHIP / WARN / BLOCK

- `SHIP`：关键上线门禁通过，可以继续发布流程。
- `WARN`：没有阻断性失败，但成本、延迟、引用、通过率等指标需要关注。
- `BLOCK`：存在上线阻断问题，例如隐私失败、危险工具调用、关键用例失败。

## 安装方式

当前项目以源码运行方式为主，npm 发布计划中。

```bash
git clone https://github.com/choose-hy/aireleasekit.git
cd aireleasekit
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm build
```

## CLI 用法

生成评测用例：

```bash
pnpm --filter @aireleasekit/cli airelease generate \
  --prd PRD.md \
  --prompt system_prompt.txt \
  --tools tool_schema.json \
  --out evals/generated.jsonl \
  --count 60
```

运行评测：

```bash
pnpm --filter @aireleasekit/cli airelease run \
  --config airelease.yaml \
  --target http://localhost:3000/api/chat \
  --evals evals/generated.jsonl \
  --out reports/latest.json
```

扫描工具风险：

```bash
pnpm --filter @aireleasekit/cli airelease scan-tools \
  --tools tool_schema.json \
  --out reports/tool-risk.json
```

生成报告：

```bash
pnpm --filter @aireleasekit/cli airelease report \
  --input reports/latest.json \
  --html reports/index.html \
  --markdown reports/summary.md
```

## GitHub Action 用法

本仓库本地开发：

```yaml
- uses: ./
  with:
    config: airelease.yaml
```

首个 release tag 发布后，外部仓库可以使用：

```yaml
- uses: choose-hy/aireleasekit@v0.1.0
  with:
    config: airelease.yaml
    report-dir: reports
```

当决策为 `BLOCK` 时，Action 会以非零状态退出；`WARN` 默认不会让 CI 失败。

## 示例场景

- 客服退款 Agent：隐私、退款确认、业务政策幻觉。
- RAG 政策 Bot：答案是否基于文档、是否引用来源。
- 工具调用 Agent：高风险工具是否需要人工确认。

## Roadmap

- 发布 npm 包。
- 增强 PRD 解析和风险抽取。
- 支持更多 LLM judge provider。
- 支持 MCP 工具 schema 扫描。
- 增加 PR 前后基线对比。
- 增加更多真实项目示例。

## 安全说明

AIReleaseKit 不需要提交 API key，也不会收集遥测数据。`.env` 文件应保持本地，不要提交到仓库。默认 deterministic checks 不需要 `OPENAI_API_KEY`。

## License

MIT

