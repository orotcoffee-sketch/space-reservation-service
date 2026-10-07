# Environment Contract

Credentials are always environment-driven. No real credentials appear in documentation or Git.

## Environments

- LOCAL
- TEST
- PRODUCTION

Each environment has its own configuration values; values are not shared across environments.

## Configuration categories (future)

Frontend:

- backend API base URL

Backend:

- database URL
- database username
- database password
- allowed frontend origin
- JWT signing secret
- bootstrap administrator email and initial password

## Conceptual backend variables

```text
DB_URL
DB_USERNAME
DB_PASSWORD

JWT_SECRET

ADMIN_EMAIL
ADMIN_INITIAL_PASSWORD

FRONTEND_ORIGIN
```

Names may later be adapted to Spring conventions. No real value may be committed. `JWT_SECRET` must never have a production default. Admin bootstrap behavior: `auth-architecture.md`.

Exact variable names are provisional (see `.env.example`) until the toolchain is chosen.
