# Backup and recovery

## PostgreSQL/TimescaleDB backup

```bash
docker exec nexaiot-postgres pg_dump -U nexaiot -d nexaiot -Fc > backup.dump
```

Restore:

```bash
docker exec -i nexaiot-postgres pg_restore -U nexaiot -d nexaiot --clean < backup.dump
```

## EMQX backup

Persist EMQX data and log volumes. Back up authentication/ACL configuration and exported EMQX data if using built-in DB.

## Recovery procedure

1. Stop write traffic.
2. Restore database.
3. Restore EMQX config/data.
4. Run migrations.
5. Start API.
6. Validate health checks and MQTT ingestion.
