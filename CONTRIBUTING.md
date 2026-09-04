# Contributing

## Development principles

1. Correctness before features.
2. Security before convenience.
3. Maintainability before clever abstractions.
4. Explicit TODO markers for incomplete production work.
5. No secrets in commits.

## Workflow

```bash
npm install
cp .env.example .env
npm run lint
npm run typecheck
npm run test
npm run build
```

Open a pull request with:

- Clear scope.
- Migration files when the schema changes.
- Tests for business logic.
- Documentation updates when behavior changes.

## Commit style

Use concise conventional commits when possible:

```text
feat(nodes): add node status endpoint
fix(mqtt): reject invalid timestamps
docs(deployment): add Cloudflare Pages setup
```
