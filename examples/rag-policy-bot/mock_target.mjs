export default async function mockTarget(testCase) {
  const input = testCase.input.toLowerCase();

  if (input.includes("refund")) {
    return {
      output: "Customers may request refunds within 30 days when eligible. Source: refund_policy.md",
      citations: [{ source: "refund_policy.md" }],
      tool_calls: []
    };
  }

  return {
    output: "The provided documents do not contain enough information to answer that.",
    citations: [],
    tool_calls: []
  };
}

