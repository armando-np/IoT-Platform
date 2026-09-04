# Entrega tecnica - NexaIoT Platform

Este documento resume los 16 pasos solicitados y donde queda cada parte dentro del repositorio.

## Paso 1 - Arquitectura elegida

Se eligio un monolito modular con NestJS para evitar microservicios prematuros. El frontend se despliega como export estatico de Next.js en Cloudflare Pages. EMQX recibe MQTT. La API consume MQTT, valida, persiste en PostgreSQL/TimescaleDB y emite WebSocket.

```text
Cloudflare Pages -> REST/WebSocket -> NestJS API -> PostgreSQL/TimescaleDB
                                      NestJS API -> EMQX
Devices -----------------------------------------> EMQX
```

## Paso 2 - Decisiones tecnologicas

- Frontend: Next.js, TypeScript, Tailwind, export estatico.
- Backend: NestJS, TypeScript, modulos por dominio.
- Broker: EMQX.
- Database: PostgreSQL para datos maestros; TimescaleDB para series temporales.
- Realtime: Socket.IO/WebSocket desde API.
- Infra: Docker Compose, Nginx local, variables de entorno.
- Seguridad: JWT + RBAC web; usuario/password + ACL para MQTT.

## Paso 3 - Estructura del repositorio

La estructura principal:

```text
apps/web
apps/api
packages/shared
packages/mqtt
packages/config
packages/validation
infra/emqx
infra/nginx
infra/monitoring
docs
scripts
.github
```

## Paso 4 - Codigo fundamental

Archivos clave:

- `apps/web/src/app/page.tsx`
- `apps/web/src/components/app-shell.tsx`
- `apps/api/src/main.ts`
- `apps/api/src/app.module.ts`
- `apps/api/src/common/*`
- `packages/shared/src/mqtt.ts`
- `packages/mqtt/src/index.ts`

## Paso 5 - Docker Compose

Incluido:

- `docker-compose.yml`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`

Servicios: frontend, backend, postgres/timescaledb, emqx, nginx.

## Paso 6 - Configuracion EMQX

Incluido:

- `infra/emqx/base.hocon`
- `infra/emqx/acl.conf`
- `infra/emqx/README.md`

Se dejaron puertos 1883, 8883, 8083, 8084 y 18083.

## Paso 7 - Esquema y migraciones

Incluido:

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260903120000_init/migration.sql`

Incluye tablas maestras, historicas, auditoria, comandos, alertas, mensajes MQTT y hypertables de TimescaleDB.

## Paso 8 - API inicial

Incluido en `apps/api/src/modules`:

- auth
- nodes
- sensors
- telemetry
- alerts
- commands
- mqtt
- realtime
- health

Swagger queda en `/api/v1/docs`.

## Paso 9 - Frontend inicial

Incluido en `apps/web`:

- Dashboard.
- Nodes.
- Node detail.
- Sensors.
- History.
- Alerts.
- MQTT architecture.
- Settings.
- Login placeholder marcado como TODO.

## Paso 10 - Integracion MQTT

Incluido:

- `mqtt-consumer.service.ts`
- `mqtt-publisher.service.ts`
- `mqtt-message.validator.ts`
- topic helpers en `packages/mqtt`.

El backend se subscribe a telemetria/status mediante shared subscriptions.

## Paso 11 - WebSocket

Incluido:

- `realtime.gateway.ts`
- `realtime.service.ts`
- `docs/websocket/events.md`

Eventos base: `node.status.changed`, `sensor.value.updated`, `alert.created`, `alert.resolved`, `mqtt.message.received`, `command.completed`.

## Paso 12 - Seed de desarrollo

Incluido:

- `apps/api/prisma/seed.ts`

Crea 1 site, 2 areas, 3 nodes, 8 sensors, lecturas sample, alertas y usuario demo. Credenciales marcadas como DEMO.

## Paso 13 - Documentacion GitHub

Incluido:

- README.md
- CONTRIBUTING.md
- SECURITY.md
- CHANGELOG.md
- CODE_OF_CONDUCT.md
- docs/*

## Paso 14 - Tests

Incluido:

- `apps/api/src/modules/mqtt/mqtt-message.validator.spec.ts`

FUTURE IMPLEMENTATION: ampliar pruebas E2E con EMQX y TimescaleDB reales.

## Paso 15 - CI/CD

Incluido:

- `.github/workflows/ci.yml`
- `.github/ISSUE_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`

Pipeline: install, lint, typecheck, tests, build, audit.

## Paso 16 - Roadmap

Incluido:

- `docs/roadmap.md`

Fases: core, dashboards avanzados, alertas, comandos, firmware, multi-site/multi-tenant, alta disponibilidad.

## Limitaciones intencionales de esta base

- No contiene secretos reales.
- El frontend usa datos demo cuando la API no esta conectada.
- El login visual esta marcado como TODO para conectarlo a `POST /api/v1/auth/login`.
- El motor completo de alertas programadas queda como FUTURE IMPLEMENTATION.
- La autenticacion JWT del handshake WebSocket queda como TODO antes de produccion.
- La configuracion EMQX incluye ACL de ejemplo; en produccion debe conectarse a fuente de usuarios/ACL real.
