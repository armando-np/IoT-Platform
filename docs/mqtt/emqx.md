# EMQX integration

EMQX is the MQTT broker.

Ports:

- 1883: MQTT TCP.
- 8883: MQTT over TLS.
- 8083: MQTT over WebSocket.
- 8084: MQTT over secure WebSocket.
- 18083: EMQX Dashboard.

The backend connects as `api_service`, subscribes to shared telemetry/status topics, and publishes commands/configuration.

## Features to use

- Authentication: separate MQTT identity from web identity.
- ACL: restrict each node to its own topic space.
- Rules Engine: future route to database/queue/webhook if ingestion is split.
- Webhooks: future node connection/disconnection integration.
- Retained Messages: current status/config snapshots.
- LWT: offline detection.
- Shared Subscriptions: horizontal API consumers.
- Session management: persistent API consumer sessions.
