# Indexing

Key indexes:

- `sensor_readings(sensor_id, time DESC)` for sensor detail charts.
- `sensor_readings(node_id, time DESC)` for node detail charts.
- `nodes(status)` for dashboard counts.
- `alerts(status, severity)` for active incident views.
- `audit_logs(action, created_at DESC)` for audit search.
- `mqtt_messages(topic, received_at DESC)` for MQTT troubleshooting.

Avoid wide unbounded queries. Require time windows for telemetry APIs.
