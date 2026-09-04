# Nodes API

Create node:

```bash
curl -X POST http://localhost:3001/api/v1/nodes \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"nodeId":"NODE-010","name":"Pico greenhouse","siteId":"...","areaId":"...","model":"Pico 2 W"}'
```

Node status is determined by retained status, LWT, and heartbeat age. Manual `MAINTENANCE` and `DISABLED` states override automatic online/offline transitions.
