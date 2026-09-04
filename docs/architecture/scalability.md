# Scalability

## 10 nodes

- Single API instance.
- Single EMQX node.
- Single TimescaleDB/PostgreSQL instance.
- Direct API WebSocket fanout.

## 100 nodes

- Add query pagination and dashboard downsampling.
- Use batch inserts for MQTT readings.
- Add database indexes by `sensor_id,time` and `node_id,time`.
- Keep message payloads small and versioned.

## 1,000 nodes

- Run multiple API MQTT consumers with EMQX shared subscriptions.
- Move alert evaluation to a queue-backed worker if rule count grows.
- Add read replicas for dashboard queries.
- Add compression and strict retention policies.

## 10,000 nodes

- Cluster EMQX.
- Separate write-heavy telemetry ingestion from user-facing API.
- Use TimescaleDB compression and continuous aggregates.
- Use Redis or another broker for WebSocket fanout across API instances.

## 100,000+ sensors

- Partition by time and tenant/site where applicable.
- Use rollups for dashboard ranges.
- Store raw data for short retention and aggregate data for long retention.
- Split modules into services only when operational metrics prove bottlenecks.

## First components to scale

1. EMQX when concurrent connections grow.
2. Telemetry ingestion when MQTT message rate grows.
3. TimescaleDB writes and storage when readings grow.
4. WebSocket fanout when browser sessions grow.
5. Alert workers when rules and durations grow.
