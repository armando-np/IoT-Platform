# Production deployment

Recommended split:

- Cloudflare Pages: `apps/web` static dashboard.
- VPS/cloud/container platform: NestJS API, EMQX, PostgreSQL/TimescaleDB, Nginx or managed load balancer.

Cloudflare Pages:

```text
Root directory: repository root
Build command: npm install && npm run build --workspace=@nexaiot/shared && npm run build --workspace=@nexaiot/web
Build output directory: apps/web/out
```

API production requirements:

- HTTPS.
- Locked CORS origin.
- Long random JWT secrets.
- Rate limiting.
- Database backups.
- EMQX TLS and ACL.
- Observability and alerts.
