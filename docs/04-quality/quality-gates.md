# Quality Gates

A phase cannot be marked DONE when applicable checks fail.

Result values: `PASS`, `FAIL`, `BLOCKED`, `NOT_APPLICABLE`.

Never report PASS without executing the corresponding check.

## Frontend

- dependency installation
- lint
- test
- production build

## Backend

- Maven/Gradle dependency resolution
- compile
- test
- package

## Integration

- API health
- frontend-backend connection
- database connection

## Deployment

- production frontend accessible
- production backend health endpoint accessible
- backend database connectivity confirmed
