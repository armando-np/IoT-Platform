# MQTT QoS policy

## QoS 0

Use for high-frequency, non-critical telemetry where occasional loss is acceptable.

## QoS 1

Default for telemetry, status, heartbeat, commands, and responses. It provides at-least-once delivery, so consumers must handle duplicates.

## QoS 2

Use only for rare critical workflows. It adds overhead and should not be used for high-volume telemetry by default.

## Retained messages

Use retained messages for current node status and configuration snapshots. Do not retain telemetry streams.

## Last Will and Testament

Each node should configure a Last Will to publish `OFFLINE` to its `status` topic when it disconnects unexpectedly.
