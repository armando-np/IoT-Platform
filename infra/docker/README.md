# Docker notes

Use root-level compose files:

```bash
docker compose up --build
```

Development override:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Production should use managed secrets and TLS certificates. Do not reuse local `.env` values.
