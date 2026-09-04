# MQTT authentication

MQTT authentication is independent from web authentication.

Recommended username patterns:

```text
api_service
device:NODE-001
device:NODE-002
```

Device credentials are stored in `node_credentials` as hashes. Do not store plain text passwords.

## Rotation

1. Create a new credential row with `is_active=true`.
2. Distribute the new credential securely.
3. Confirm connection with the new client ID.
4. Disable the old credential.
5. Audit the rotation.

## TLS

Production MQTT should use TLS on 8883 and WSS on 8084. Local 1883 is acceptable only for development.
