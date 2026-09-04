# Troubleshooting

## API cannot connect to database

Check `DATABASE_URL`, compose service name, and `docker compose ps`.

## MQTT messages not appearing

Check:

- EMQX health.
- Device credentials.
- Topic path.
- ACL denial logs.
- API MQTT consumer logs.

## Cloudflare Pages build fails

Ensure root directory is `apps/web`, build command is `npm install && npm run build`, and output directory is `out`.
