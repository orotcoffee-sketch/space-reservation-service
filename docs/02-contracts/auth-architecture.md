# Authentication Architecture

Planning only. No security code, libraries or configuration exist. Values marked "default" are architecture defaults, not immutable business requirements.

## Type

JWT Bearer authentication.

```text
email + password
      ↓
Spring Boot authentication
      ↓
JWT access token
      ↓
React sends: Authorization: Bearer <token>
```

## Access token

- Access token only. No refresh token, no OAuth, no social login (all OUT OF MVP).
- Planned lifetime: 60 minutes (default).
- On expiry the user must log in again; the API answers 401 `AUTH_REQUIRED`.
- The token identifies the member; the server resolves the member and role from it (see ownership rule in `api-contract.md`).
- `JWT_SECRET` comes from the environment and has no production default.

## Frontend token handling

Planned: `sessionStorage`.

- Simpler than refresh-token infrastructure; cleared when the browser session ends; adequate for the assignment MVP.
- Limitation: JavaScript-accessible storage is exposed if the frontend has an XSS vulnerability.
- Mitigations: never render untrusted HTML, never use unsafe HTML insertion for user-controlled content, keep dependencies minimal, avoid storing unnecessary sensitive information.
- Not implemented yet.

## Password security

- Never stored as plaintext, never returned by any API, never written to logs.
- Hashing: BCrypt planned. No custom password algorithm.
- Not implemented yet.

## ADMIN provisioning

- Public registration creates MEMBER only; the client can neither submit nor choose a role.
- Planned: environment-based bootstrap administrator.
  - Environment provides `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD`.
  - On startup, if no account with that email exists, create it as ADMIN with a hashed password.
  - If it exists, do nothing (idempotent).
- No real admin credentials in Git (see `environment-contract.md`).
- Not implemented yet.

## Access model

Registered members only: space browsing is authenticated in MVP. The application is not a publicly browsable marketplace.

## Open

- JWT library and signing algorithm (toolchain/implementation phase)
- token-expiry user experience in the frontend (Stitch/implementation phase)
