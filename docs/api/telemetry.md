# Telemetry API

Query recent telemetry:

```bash
curl "http://localhost:3001/api/v1/telemetry?sensorId=SEN-TEMP-001&limit=100" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

For dashboard ranges, query aggregates or downsampled data instead of raw rows. Raw high-volume data should be paginated with cursor/time windows.
