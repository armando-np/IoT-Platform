# Cloudflare Pages

`apps/web` is configured with `output: 'export'`, so `next build` produces an `out` directory.

Cloudflare Pages build settings for this monorepo:

```text
Root directory: repository root
Framework preset: Next.js (Static HTML Export)
Build command: npm install && npm run build --workspace=@nexaiot/shared && npm run build --workspace=@nexaiot/web
Build output directory: apps/web/out
Production branch: main
```

Set Pages environment variables:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
NEXT_PUBLIC_WS_URL=https://api.example.com/realtime
NEXT_PUBLIC_APP_NAME=NexaIoT
```

Do not deploy the backend or EMQX to Cloudflare Pages. Pages should host the static dashboard only.
