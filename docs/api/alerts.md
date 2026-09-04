# Alerts API

Create alert rule:

```bash
curl -X POST http://localhost:3001/api/v1/alerts/rules \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Temperature > 40","sensorId":"...","operator":"GT","threshold":40,"severity":"CRITICAL"}'
```

Rules support threshold, duration, severity, enabled flag, and cooldown. Full rule engine scheduling is marked as future implementation in this base.
