# Sensors API

Create sensor:

```bash
curl -X POST http://localhost:3001/api/v1/sensors \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"sensorId":"SEN-TEMP-010","name":"Water temperature","nodeId":"...","sensorTypeId":"...","unit":"C","minValue":-10,"maxValue":80}'
```

Sensor variables are stored generically. New variables should be added as `sensor_types` and `sensors`, not hardcoded into telemetry tables.
