# Docker deployment

```bash
cp .env.example .env
docker compose up --build
```

The compose stack includes TimescaleDB, EMQX, API, frontend development server, and Nginx local reverse proxy.

For production, build immutable images, use real secrets, enable TLS, and run migrations before starting the API.
