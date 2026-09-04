# Local deployment

```bash
cp .env.example .env
npm install
docker compose up -d postgres emqx
npm run api:migrate
npm run api:seed
npm run dev
```

Open:

- Web: http://localhost:3000
- API: http://localhost:3001/api/v1
- Swagger: http://localhost:3001/api/v1/docs
- EMQX: http://localhost:18083
