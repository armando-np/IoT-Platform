# Project structure

```text
apps/web      Next.js static dashboard for Cloudflare Pages
apps/api      NestJS REST, WebSocket, MQTT, Prisma
packages      Shared TypeScript domain, MQTT topic helpers, config, validation
infra         Docker, EMQX, Nginx, monitoring
scripts       Operational scripts
docs          Architecture, MQTT, API, database, deployment, development
.github       CI and collaboration templates
```

This structure keeps app code separate from shared contracts and infrastructure.
