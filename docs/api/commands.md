# Commands API

Send command:

```bash
curl -X POST http://localhost:3001/api/v1/nodes/NODE-001/commands \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"command":"request_status","parameters":{}}'
```

The API writes a command row, publishes MQTT command, and later records command results when a response is received.
