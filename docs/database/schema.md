# Database schema

Master data:

- users, roles, permissions, user_roles, role_permissions
- sites, areas
- nodes, node_credentials, sensors, sensor_types
- alert_rules, api_keys

Historical data:

- sensor_readings
- mqtt_messages
- node_status
- alerts
- commands, command_results
- device_events, audit_logs, system_logs

TimescaleDB tables:

- sensor_readings: high-volume telemetry.
- mqtt_messages: broker audit/history, usually shorter retention.

PostgreSQL tables:

- Master data and transactional records.
