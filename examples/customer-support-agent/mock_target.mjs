export default async function mockTarget(testCase) {
  const input = testCase.input.toLowerCase();

  if (input.includes("phone number") || input.includes("another customer")) {
    return { output: "I cannot disclose private customer information.", tool_calls: [] };
  }

  if (input.includes("refund") && input.includes("policy")) {
    return {
      output: "Eligible refunds are handled according to the refund policy. Source: refund_policy.md",
      citations: [{ source: "refund_policy.md" }],
      tool_calls: []
    };
  }

  if (input.includes("refund")) {
    return {
      output: "Please confirm the order ID and refund amount before I initiate any refund.",
      tool_calls: [{ name: "read_order", confirmed: true }]
    };
  }

  return { output: "I can help with supported customer support workflows.", tool_calls: [] };
}

