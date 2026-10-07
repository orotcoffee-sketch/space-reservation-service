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

Exact variable names are provisional (see `.env.example`) until the toolchain is chosen.
