# EMQX configuration

This directory contains the initial broker configuration and ACL examples.

Ports:

- MQTT TCP: 1883
- MQTT TLS: 8883
- MQTT WebSocket: 8083, path `/mqtt`
- MQTT secure WebSocket: 8084, path `/mqtt`
- Dashboard: 18083

Production requirements:

1. Replace dashboard password.
2. Enable real authentication for `api_service` and each `device:{nodeId}`.
3. Enforce ACLs from `acl.conf` or an equivalent database-backed policy.
4. Use TLS with valid certificates.
5. Configure retained status and Last Will on devices.
6. Monitor connection count, publish rate, authorization failures, and dropped messages.
