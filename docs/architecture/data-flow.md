# Data flow

## Telemetry

```text
Device -> EMQX -> API MQTT consumer -> validation -> TimescaleDB -> WebSocket -> Browser
```

1. Device publishes JSON telemetry to `iot/{environment}/{site}/{area}/{nodeId}/telemetry`.
2. EMQX authenticates the device and checks ACL.
3. API consumes with shared subscriptions.
4. API validates JSON schema, timestamp, node identity, and sensor identity.
5. API writes readings in batch when possible.
6. API emits `sensor.value.updated` to WebSocket clients.

## Status

Devices publish retained `status` and configure Last Will to publish `OFFLINE`. The API also uses heartbeat age to mark devices offline.

## Commands

```text
Browser -> API -> command audit row -> EMQX -> Device -> response topic -> API -> command result -> WebSocket
```

Commands are synchronous only until the API validates authorization and persists a command row. Device execution is asynchronous.

## Synchronous vs asynchronous

Synchronous:

- Login.
- CRUD for nodes and sensors.
- Command creation and publish request.
- Querying historical telemetry.

Asynchronous:

- MQTT ingestion.
- Alert evaluation.
- Command completion.
- Notification delivery.
- Firmware updates.
