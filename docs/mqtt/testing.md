# MQTT testing with mosquitto

Subscribe to telemetry:

```bash
mosquitto_sub -h localhost -p 1883 -t 'iot/dev/+/+/+/telemetry' -v
```

Publish status retained:

```bash
mosquitto_pub -h localhost -p 1883 -r \
  -t 'iot/dev/main-site/lab/NODE-001/status' \
  -m '{"schemaVersion":"1.0","messageId":"status-001","timestamp":"2026-09-03T12:00:00Z","nodeId":"NODE-001","payload":{"status":"ONLINE"}}'
```

Publish heartbeat:

```bash
mosquitto_pub -h localhost -p 1883 \
  -t 'iot/dev/main-site/lab/NODE-001/heartbeat' \
  -m '{"schemaVersion":"1.0","messageId":"hb-001","timestamp":"2026-09-03T12:00:00Z","nodeId":"NODE-001","sequence":1,"payload":{"uptimeSeconds":100}}'
```

Publish telemetry:

```bash
mosquitto_pub -h localhost -p 1883 \
  -t 'iot/dev/main-site/lab/NODE-001/telemetry' \
  -m '{"schemaVersion":"1.0","messageId":"msg-001","timestamp":"2026-09-03T12:00:00Z","nodeId":"NODE-001","sequence":1,"payload":{"sensors":{"SEN-TEMP-001":{"value":24.7,"unit":"C"}}}}'
```

Subscribe to commands:

```bash
mosquitto_sub -h localhost -p 1883 -t 'iot/dev/main-site/lab/NODE-001/command' -v
```

Publish command response:

```bash
mosquitto_pub -h localhost -p 1883 \
  -t 'iot/dev/main-site/lab/NODE-001/response' \
  -m '{"schemaVersion":"1.0","messageId":"resp-001","timestamp":"2026-09-03T12:00:05Z","nodeId":"NODE-001","payload":{"commandMessageId":"cmd-123","status":"ACKNOWLEDGED"}}'
```
