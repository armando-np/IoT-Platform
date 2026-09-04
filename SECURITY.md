# Security Policy

## Supported versions

This repository starts at `0.1.x`. Security fixes should target the latest minor version.

## Reporting vulnerabilities

Do not open public issues for secrets, authentication bypasses, ACL mistakes, data exposure, or remote command flaws. Report privately to the repository maintainer.

## Security baseline

- No production secrets in Git.
- JWT secrets must be long random values.
- MQTT device credentials are independent from web users.
- Devices can only publish and subscribe to their own allowed topic space.
- Frontend never receives database credentials or EMQX administrator credentials.
- Production MQTT must use TLS.
- Remote commands must be audited.
