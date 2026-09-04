# Architecture overview

NexaIoT starts as a modular monolith with clear boundaries:

```text
Cloudflare Pages / Next.js static dashboard
        |
        | REST / WebSocket
        v
NestJS API modular monolith
        |-- Auth / RBAC
        |-- Nodes / sensors / telemetry
        |-- MQTT consumer and publisher
        |-- Alerts and commands
        |-- Audit and logs
        |
        |-- PostgreSQL / TimescaleDB
        |-- EMQX
```

## Why a modular monolith

The first production version should avoid unnecessary microservice overhead. Modules are separated by domain so they can be split later if volume justifies it:

- `mqtt`: message ingestion and command publishing.
- `telemetry`: historical time-series reads and aggregation.
- `alerts`: rule evaluation and incident lifecycle.
- `commands`: command audit trail and result tracking.
- `nodes` and `sensors`: master data.
- `auth`: web users, JWT, roles, and permissions.

## Component responsibilities

| Component | Responsibility |
| --- | --- |
| Next.js frontend | Static UI, dashboard, search/filter UX, calls REST/WebSocket only. |
| NestJS API | Authentication, authorization, business rules, device registry, telemetry API, command API. |
| EMQX | MQTT broker, retained messages, LWT, sessions, QoS, ACL enforcement. |
| PostgreSQL | Master data, users, roles, nodes, sensors, commands, alerts, audit logs. |
| TimescaleDB | High-volume time-series tables: sensor readings and MQTT message history. |
| Nginx | Local reverse proxy and production reference config. |

## Data ownership

Devices do not write to the database. They publish to EMQX. The API consumes MQTT and owns validation, persistence, alert evaluation, and WebSocket fanout.

## Production boundary

The frontend must not receive database credentials, MQTT admin credentials, or EMQX management API credentials. Administrative actions go through the API.
