# Authentication Architecture

Implemented in `backend/` (Spring Security) and the frontend (Phase 7-9) and verified locally in Phase 10. Values marked "default" are architecture defaults, not immutable business requirements.

## Type

JWT Bearer authentication.

```text
email + password
      ↓
Spring Boot authentication (Spring Security)
      ↓
JWT access token (Nimbus, HS256)
      ↓
React sends: Authorization: Bearer <token>
```

## Access token

- Access token only. No refresh token, no OAuth, no social login (all OUT OF MVP).
- Lifetime: 60 minutes (`app.jwt.expiration-minutes`); `expiresIn` in the login response is in seconds (3600).
- Implementation: Spring Security OAuth2 Resource Server with Nimbus; HMAC-SHA256 (HS256); subject = member id; `role` claim = `MEMBER` or `ADMIN`.
- Invalid, forged or expired tokens: 401 `AUTH_REQUIRED` (JSON error body).
- On expiry the user must log in again; the API answers 401 `AUTH_REQUIRED`.
- The token identifies the member; the server resolves the member and role from it (see ownership rule in `api-contract.md`).
- `JWT_SECRET` comes from the environment, must be at least 32 bytes, and has no default (the backend refuses to start without it).

## Frontend token handling

Implemented: `sessionStorage` (key `auth`, holding the access token and member).

- Simpler than refresh-token infrastructure; cleared when the browser session ends; adequate for the assignment MVP.
- Limitation: JavaScript-accessible storage is exposed if the frontend has an XSS vulnerability.
- Mitigations: never render untrusted HTML, never use unsafe HTML insertion for user-controlled content, keep dependencies minimal, avoid storing unnecessary sensitive information.
- Any 401 on an authenticated request clears the stored session (login failures do not).

## Password security

- Never stored as plaintext, never returned by any API, never written to logs.
- Hashing: BCrypt. No custom password algorithm.
- Registration requires a password of 8 to 72 characters.
- Login performs one BCrypt comparison even for unknown emails, and wrong password and unknown email give identical 401 `AUTH_INVALID_CREDENTIALS` responses.

## ADMIN provisioning

- Public registration creates MEMBER only; the client can neither submit nor choose a role.
- Implemented: environment-based bootstrap administrator (`AdminBootstrap`).
  - Environment provides `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD`.
  - On startup, if no account with that email exists, create it as ADMIN with a hashed password.
  - If it exists, do nothing (idempotent).
- No real admin credentials in Git (see `environment-contract.md`).
- Bootstrap is skipped when `ADMIN_EMAIL` or `ADMIN_INITIAL_PASSWORD` is unset; the initial password must be at least 8 characters.

## Access model

Registered members only: space browsing is authenticated in MVP. The application is not a publicly browsable marketplace.

## Open

- token-expiry user experience in the frontend (Stitch/design phase): currently the frontend does not track `expiresIn`; an expired token yields a 401 and the user is returned to login.

Resolved: JWT library and signing algorithm (Spring Security OAuth2 Resource Server / Nimbus, HS256).
