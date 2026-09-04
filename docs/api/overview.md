# API overview

Base path:

```text
/api/v1
```

Swagger:

```text
/api/v1/docs
```

Main endpoints:

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/nodes
POST   /api/v1/nodes
GET    /api/v1/nodes/:id
PATCH  /api/v1/nodes/:id
DELETE /api/v1/nodes/:id
GET    /api/v1/sensors
POST   /api/v1/sensors
GET    /api/v1/telemetry
GET    /api/v1/alerts
POST   /api/v1/alerts/rules
POST   /api/v1/nodes/:id/commands
```

Standard error shape:

```json
{
  "statusCode": 400,
  "method": "POST",
  "path": "/api/v1/nodes",
  "correlationId": "uuid",
  "error": "Validation failed",
  "timestamp": "2026-09-03T12:00:00Z"
}
```
