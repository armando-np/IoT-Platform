# WebSocket events

The API emits realtime events over Socket.IO path `/realtime`.

Events:

```text
node.status.changed
sensor.value.updated
alert.created
alert.resolved
mqtt.message.received
command.completed
```

## `sensor.value.updated`

```json
{
  "nodeId": "NODE-001",
  "messageId": "msg-001",
  "readings": []
}
```

## `mqtt.message.received`

```json
{
  "topic": "iot/dev/main-site/lab/NODE-001/telemetry",
  "receivedAt": "2026-09-03T12:00:00Z"
}
```

Production TODO: validate JWT during the WebSocket handshake and scope subscriptions by user permissions.
