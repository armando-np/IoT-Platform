# Development setup

Requirements:

- Node.js 20+
- npm 10+
- Docker and Docker Compose
- mosquitto clients for MQTT testing

```bash
npm install
cp .env.example .env
docker compose up -d postgres emqx
npm run api:migrate
npm run api:seed
npm run dev
```
