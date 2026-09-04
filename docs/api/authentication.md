# API authentication

Web users authenticate with email and password:

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin.demo@nexaiot.local","password":"ChangeMe_DEMO_Only_123!"}'
```

The API returns access and refresh tokens. Use access token:

```bash
curl http://localhost:3001/api/v1/nodes \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Roles:

- ADMIN: full access.
- OPERATOR: operational changes and commands.
- VIEWER: read-only.
