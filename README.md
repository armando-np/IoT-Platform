# NexaIoT Platform

![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Next.js](https://img.shields.io/badge/Next.js-static_export-black)
![NestJS](https://img.shields.io/badge/NestJS-API-red)
![MQTT](https://img.shields.io/badge/MQTT-EMQX-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

NexaIoT Platform is a production-oriented base repository for monitoring and managing IoT devices through MQTT. It is designed for EMQX, a Next.js dashboard deployed to Cloudflare Pages, a NestJS API, WebSocket realtime events, and PostgreSQL with TimescaleDB for time-series telemetry.

> Screenshot placeholder: add `docs/assets/dashboard.png` when the first deployment is available.

## What this repo contains

- Cloudflare Pages-ready frontend: `apps/web` uses Next.js static export.
- Backend API: `apps/api` uses NestJS, REST `/api/v1`, Swagger, JWT, RBAC guards, MQTT consumer, and WebSocket gateway.
- Database design: Prisma schema plus SQL migration for PostgreSQL and TimescaleDB hypertables.
- MQTT architecture: EMQX config, scalable topic conventions, payload schemas, QoS guidance, LWT, ACL examples, and testing commands.
- Docker: local stack with frontend, backend, TimescaleDB, EMQX, and Nginx reverse proxy.
- GitHub readiness: CI workflow, issue templates, PR template, security policy, contribution guide, and roadmap.

## Architecture

```text
Browser / Cloudflare Pages
        |
        | REST / WebSocket
        v
NestJS API
        |--------------> PostgreSQL + TimescaleDB
        |--------------> EMQX MQTT Broker
        |--------------> Alert engine
        |--------------> Logs / metrics
        v
Realtime WebSocket events
```

The frontend does not connect directly to PostgreSQL or to administrative EMQX APIs. Device traffic goes to EMQX. The API subscribes to allowed topic patterns, validates messages, stores telemetry, evaluates alerts, and emits WebSocket events to authenticated frontend clients.

## Cloudflare Pages deployment

This repository uses a static Next.js export because Cloudflare Pages serves static assets well and the API/MQTT stack should run separately on a VPS, container platform, or cloud service.

Cloudflare Pages settings:

```text
Root directory: repository root
Framework preset: Next.js (Static HTML Export)
Build command: npm install && npm run build --workspace=@nexaiot/shared && npm run build --workspace=@nexaiot/web
Build output directory: apps/web/out
Production branch: main
```

Required Pages environment variables:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
NEXT_PUBLIC_WS_URL=https://api.example.com/realtime
NEXT_PUBLIC_APP_NAME=NexaIoT
```

## Local setup

```bash
cp .env.example .env
npm install
docker compose up -d postgres emqx
npm run api:migrate
npm run api:seed
npm run dev
```

Useful local URLs:

```text
Frontend: http://localhost:3000
API: http://localhost:3001/api/v1
Swagger: http://localhost:3001/api/v1/docs
EMQX Dashboard: http://localhost:18083
```

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## MQTT examples

Subscribe to all development telemetry:

```bash
mosquitto_sub -h localhost -p 1883 -u device:NODE-001 -P replace-me -t 'iot/dev/+/+/+/telemetry' -v
```

Publish telemetry:

```bash
mosquitto_pub -h localhost -p 1883 -u device:NODE-001 -P replace-me \
  -t 'iot/dev/main-site/lab/NODE-001/telemetry' \
  -m '{"schemaVersion":"1.0","messageId":"msg-001","timestamp":"2026-09-03T12:00:00Z","nodeId":"NODE-001","sequence":1,"payload":{"sensors":{"SEN-TEMP-001":{"value":24.7,"unit":"C"}}}}'
```

## Testing

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Production notes

- Replace every secret in `.env`.
- Enable TLS for API, MQTT TCP, and WebSocket.
- Use EMQX authentication and ACLs independent from web users.
- Run database migrations; never create production tables manually.
- Configure backup and retention before collecting real telemetry.
- Use a real SMTP/notification provider before enabling production alerts.

## Roadmap

See [`docs/roadmap.md`](docs/roadmap.md).

## License

MIT. See [`LICENSE`](LICENSE).
