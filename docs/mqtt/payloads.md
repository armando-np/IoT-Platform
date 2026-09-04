# MQTT payload schemas

All device messages are JSON and include:

```json
{
  "schemaVersion": "1.0",
  "messageId": "msg-001",
  "timestamp": "2026-09-03T12:00:00Z",
  "nodeId": "NODE-001",
  "sequence": 1,
  "payload": {}
}
```

## Telemetry

```json
{
  "schemaVersion": "1.0",
  "messageId": "msg-001",
  "timestamp": "2026-09-03T12:00:00Z",
  "nodeId": "NODE-001",
  "sequence": 123,
  "payload": {
    "sensors": {
      "SEN-TEMP-001": { "value": 24.7, "unit": "C", "quality": "GOOD" },
      "SEN-HUM-001": { "value": 48.2, "unit": "%", "quality": "GOOD" }
    }
  }
}
```

## Status

```json
{
  "schemaVersion": "1.0",
  "messageId": "status-001",
  "timestamp": "2026-09-03T12:00:00Z",
  "nodeId": "NODE-001",
  "payload": {
    "status": "ONLINE",
    "firmwareVersion": "0.3.1",
    "ipAddress": "192.168.1.184",
    "uptimeSeconds": 301
  }
}
```

## Heartbeat

```json
{
  "schemaVersion": "1.0",
  "messageId": "hb-001",
  "timestamp": "2026-09-03T12:00:00Z",
  "nodeId": "NODE-001",
  "sequence": 124,
  "payload": { "uptimeSeconds": 301, "freeMemoryBytes": 132000 }
}
```

## Command

```json
{
  "schemaVersion": "1.0",
  "messageId": "cmd-123",
  "timestamp": "2026-09-03T12:00:00Z",
  "nodeId": "NODE-001",
  "payload": {
    "command": "request_status",
    "parameters": {}
  }
}
```

## Response

```json
{
  "schemaVersion": "1.0",
  "messageId": "resp-123",
  "timestamp": "2026-09-03T12:00:05Z",
  "nodeId": "NODE-001",
  "payload": {
    "commandMessageId": "cmd-123",
    "status": "ACKNOWLEDGED",
    "result": {}
  }
}
```

## Validation policy

- Missing required fields: reject and log.
- Unknown fields: keep in metadata only when safe.
- Old schema version: accept only with registered compatibility adapter.
- Future schema version: reject unless marked compatible.
- Out-of-range values: store with quality `WARN` or reject based on sensor rule.
- Invalid timestamps: reject.
- Duplicate message IDs: ignore for idempotent ingestion.
