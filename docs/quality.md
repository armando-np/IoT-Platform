# Quality baseline

Implemented in this base:

- Strict TypeScript configuration.
- DTO validation using class-validator.
- Centralized HTTP exception filter.
- Correlation IDs.
- Prisma migrations.
- Seed data.
- MQTT payload validator tests.
- GitHub Actions CI.

Future production hardening:

- Add end-to-end tests with running EMQX and TimescaleDB.
- Add API contract tests from OpenAPI.
- Add frontend component tests.
- Add security scanning and container image scanning.
