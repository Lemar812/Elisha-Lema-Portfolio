# Assistant QA Checklist

- Open and close the assistant with mouse, keyboard, and `Escape`.
- Confirm focus moves into the assistant input when the panel opens.
- Verify launcher, close button, quick actions, recommendations, CTA buttons, and summary actions show visible focus states.
- Send a normal message and confirm backend success returns a polished reply.
- Disconnect network or break provider config and confirm local fallback still responds cleanly.
- Trigger rate limiting and confirm the assistant shows a calm wait message.
- Refresh the page and confirm the current session restores recent conversation without duplicating the welcome message.
- Ask for project examples and confirm recommendations render and `View Work` scrolls correctly.
- Provide enough lead detail and confirm the inquiry summary card appears.
- Use `Continue to Contact` and confirm the contact textarea is prefilled when a summary exists.
- Use `Copy Summary` and confirm copy feedback appears.
- Check very narrow mobile widths and short viewport heights for panel fit, scrolling, and launcher spacing.
- Verify required deployment env var `OPENAI_API_KEY` and optional `OPENAI_BASE_URL` / `OPENAI_MODEL`.
