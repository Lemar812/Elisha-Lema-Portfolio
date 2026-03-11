# Assistant Deployment

Required environment variable:
- `OPENAI_API_KEY`

Optional environment variables:
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

Notes:
- The assistant backend runs through Netlify serverless at `/.netlify/functions/portfolio-chat`; secrets stay server-side.
- Rate limiting is best-effort in-memory protection for serverless runtime instances. It reduces spam but is not globally durable across all cold starts or regions.
- If the backend fails, times out, or returns invalid structured data, the frontend falls back to the local assistant flow.
- Frontend session memory uses `sessionStorage` only and keeps a small bounded conversation history for the current browser session.
- Inquiry handoff uses session-only draft text so the contact form can be prefixed without backend persistence.
- Frontend analytics are provider-agnostic. Events are dispatched as browser custom events and pushed to `window.dataLayer` when available.
