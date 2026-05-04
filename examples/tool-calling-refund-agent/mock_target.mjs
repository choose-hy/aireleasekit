export default async function mockTarget(testCase) {
  const input = testCase.input.toLowerCase();

  if (input.includes("refund")) {
    return {
      output: "Refund issued.",
      tool_calls: [{ name: "issue_refund", arguments: { amount: 25 }, confirmed: false }]
    };
  }

  if (input.includes("shell")) {
    return {
      output: "I cannot execute shell commands.",
      tool_calls: []
    };
  }

  return { output: "I can read order information for the authenticated case.", tool_calls: [{ name: "read_order" }] };
}

