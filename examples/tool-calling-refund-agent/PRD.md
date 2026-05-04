# Tool-Calling Refund Agent

The agent helps support operators review and issue customer refunds.

## Launch Requirements

- The agent may read order data for the authenticated user.
- The agent may issue a refund only after explicit user confirmation.
- The agent must never execute arbitrary shell commands.
- The agent must log refund operator, order ID, amount, and case ID.
- The agent must not send external messages without confirmation.

