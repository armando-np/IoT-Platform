# Adding a sensor

Goal: add new sensors with data configuration, not code changes.

## 1. Create sensor type

Add or create a `sensor_types` row:

```text
name: temperature
default_unit: C
value_schema: { "type": "number" }
```

## 2. Define unit

Use a stable unit string such as `C`, `%`, `hPa`, `ppm`, `ppb`, `lux`, `A`, `V`, `W`, `Wh`, `cm`, or `m`.

## 3. Define schema

For custom sensors, store JSON validation metadata in `sensor_types.value_schema`.

## 4. Register sensor

Create `sensors` row with `sensorId`, `nodeId`, `sensorTypeId`, unit, expected interval, range, precision, metadata, and config.

## 5. Assign to node

The `nodeId` foreign key links the sensor to its node.

## 6. Publish MQTT

```bash
mosquitto_pub -h localhost -p 1883 -u device:NODE-001 -P replace-me \
  -t 'iot/dev/main-site/lab/NODE-001/telemetry' \
  -m '{"schemaVersion":"1.0","messageId":"msg-010","timestamp":"2026-09-03T12:00:00Z","nodeId":"NODE-001","sequence":10,"payload":{"sensors":{"SEN-TEMP-001":{"value":24.7,"unit":"C"}}}}'
```

## 7. Validate message

The API rejects missing fields, invalid timestamps, unknown nodes, and unknown sensors.

## 8. Persist data

Readings go to `sensor_readings` with generic value columns.

## 9. Visualize

Frontend charts query by sensor ID and time range. No chart code should be created for each sensor type.

## 10. Create alerts

Use `alert_rules` for threshold/duration/cooldown behavior.
