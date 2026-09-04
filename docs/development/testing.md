# Testing

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Test priorities:

1. MQTT payload validation.
2. Auth and RBAC guards.
3. Alert rule evaluation.
4. Command lifecycle.
5. Telemetry query boundaries and pagination.
6. End-to-end ingestion from EMQX to database to WebSocket.
