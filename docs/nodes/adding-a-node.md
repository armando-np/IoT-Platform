# Adding a node

## 1. Register node

Create a node with site and area references.

## 2. Create credentials

Generate MQTT username/password and store only the hash in `node_credentials`.

## 3. Create ACL

Allow the node only in its own topic space.

## 4. Define topics

```text
iot/dev/main-site/lab/NODE-010/status
iot/dev/main-site/lab/NODE-010/telemetry
iot/dev/main-site/lab/NODE-010/command
```

## 5. Configure firmware

The firmware must publish telemetry, heartbeat, retained status, and command responses.

## 6. Configure heartbeat

Recommended heartbeat interval: 30-60 seconds for development, longer for battery devices.

## 7. Configure Last Will

LWT should publish `OFFLINE` to the retained status topic.

## 8. Test connection

```bash
mosquitto_sub -h localhost -p 1883 -t 'iot/dev/main-site/lab/NODE-010/status' -v
```

## 9. Publish telemetry

Use the payload format documented in MQTT payloads.

## 10. Verify dashboard

Node should appear online after retained status or heartbeat is processed.
