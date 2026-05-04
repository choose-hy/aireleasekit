import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("release readiness metadata", () => {
  it("documents source-first installation instead of implying npm publication", () => {
    const readme = fs.readFileSync("README.md", "utf8");
    expect(readme).toContain("git clone https://github.com/choose-hy/aireleasekit.git");
    expect(readme).toContain("npm package publishing is planned");
    expect(readme).not.toContain("For a new project:");
  });

  it("documents GitHub Action inputs and BLOCK behavior", () => {
    const docs = fs.readFileSync("docs/github-action.md", "utf8");
    expect(docs).toContain("config");
    expect(docs).toContain("report-dir");
    expect(docs).toContain("target");
    expect(docs).toMatch(/`BLOCK` exits non-zero/);
    expect(docs).toMatch(/`WARN` does not fail CI/);
  });

  it("keeps the composite action input surface stable", () => {
    const action = fs.readFileSync("action.yml", "utf8");
    expect(action).toContain("using: composite");
    expect(action).toContain("config:");
    expect(action).toContain("report-dir:");
    expect(action).toContain("target:");
    expect(action).toContain("GITHUB_STEP_SUMMARY");
  });
});
