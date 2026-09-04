# MQTT topic convention

Base structure:

```text
iot/{environment}/{site}/{area}/{nodeId}/status
iot/{environment}/{site}/{area}/{nodeId}/telemetry
iot/{environment}/{site}/{area}/{nodeId}/event
iot/{environment}/{site}/{area}/{nodeId}/command
iot/{environment}/{site}/{area}/{nodeId}/config
iot/{environment}/{site}/{area}/{nodeId}/response
iot/{environment}/{site}/{area}/{nodeId}/{sensorId}/telemetry
```

## Rules

- Lowercase environment, site, and area slugs.
- Stable `nodeId` and `sensorId` values.
- No spaces.
- Use `/` only as hierarchy separator.
- Do not place secrets in topics.
- `status` should be retained.
- `telemetry` should not be retained.

## Wildcards

API consumer:

```text
$share/api-consumers/iot/dev/+/+/+/telemetry
$share/api-consumers/iot/dev/+/+/+/status
```

Site dashboard:

```text
iot/prod/main-site/+/+/status
```

Node command topic:

```text
iot/prod/main-site/lab/NODE-001/command
```

## Versioning

Payload version lives in `schemaVersion`. Topic versioning should be avoided until a breaking topic structure is required. If needed, use `iot/v2/{environment}/...`.
