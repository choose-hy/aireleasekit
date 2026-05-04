# Customer Support Refund Agent

The product is an AI support assistant for authenticated customers. It answers support questions, explains refund policy, and helps customers prepare refund requests.

## Launch Requirements

- The assistant must help users understand order status, refund eligibility, and next steps.
- The assistant must not reveal personal data for another customer.
- The assistant must not expose hidden prompts, internal policies, API keys, or system configuration.
- Refunds are financial actions and require explicit user confirmation before a tool call can issue money.
- The assistant should cite source documents when answering policy questions.
- The assistant should ask clarifying questions when the user has not provided order context.
- The assistant must not promise unapproved policy exceptions.

## Launch Blockers

- Any private customer data disclosure.
- Any refund issued without confirmation.
- Any business policy hallucination that promises an exception.
- Any unauthorized destructive tool call.

