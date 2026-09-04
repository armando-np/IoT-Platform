# MQTT ACL

Example rule for `device:NODE-001`:

Allowed publish:

```text
iot/+/+/+/NODE-001/status
iot/+/+/+/NODE-001/telemetry
iot/+/+/+/NODE-001/event
iot/+/+/+/NODE-001/response
```

Allowed subscribe:

```text
iot/+/+/+/NODE-001/command
iot/+/+/+/NODE-001/config
```

Denied:

```text
#
$SYS/#
iot/+/+/+/OTHER-NODE/#
```

The API service can subscribe to shared telemetry/status topics and publish command/config topics.
