import { describe, expect, it } from "vitest";
import { scanToolRisks } from "@aireleasekit/core";

describe("tool risk scanner", () => {
  it("detects high-risk tools and recommended controls", () => {
    const report = scanToolRisks({
      tools: [
        { name: "read_order", description: "Read-only order lookup." },
        { name: "issue_refund", description: "Issue a refund to a customer payment method." },
        { name: "execute_shell", description: "Execute arbitrary shell commands." }
      ]
    });

    expect(report.findings.find((finding) => finding.tool === "read_order")?.decision).toBe("allow");
    expect(report.findings.find((finding) => finding.tool === "issue_refund")?.decision).toBe("require_human_approval");
    expect(report.findings.find((finding) => finding.tool === "execute_shell")?.decision).toBe("block");
    expect(report.recommended_policy_yaml).toContain("issue_refund");
  });
});

