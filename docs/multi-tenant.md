# Multi-tenant preparation

Initial model is single-tenant but can evolve to:

```text
Tenant
  -> Sites
     -> Areas
        -> Nodes
           -> Sensors
```

Required changes to enable multi-tenancy:

1. Add `tenants` table.
2. Add `tenant_id` to users, sites, nodes, sensors, alerts, commands, and audit logs.
3. Add tenant-scoped unique constraints, for example `(tenant_id, node_id)`.
4. Prefix MQTT topics with tenant, for example `iot/{tenant}/{environment}/...`.
5. Add tenant claims to JWT.
6. Enforce tenant filters in every API query.
7. Add tenant-specific retention and quotas.
