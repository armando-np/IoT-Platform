# Retention policy

Recommended initial retention:

- Raw sensor readings: 180 days.
- Aggregated readings: 2 years or business requirement.
- MQTT message history: 30 days.
- Audit logs: 1 year minimum.
- System logs: 30-90 days depending on storage.

Use TimescaleDB retention policies after production retention requirements are approved.
