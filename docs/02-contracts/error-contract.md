# Error Contract

Conceptual standard error shape (future):

- `timestamp`
- `status`
- `code`
- `message`
- `path`

## Conceptual error codes

Only codes required by the current contract (`api-contract.md`).

| Code | Status | Meaning |
|---|---|---|
| VALIDATION_ERROR | 400 | invalid input (format, 30-minute interval, start ≥ end, date mismatch, ...) |
| AUTH_INVALID_CREDENTIALS | 401 | wrong email or password |
| AUTH_REQUIRED | 401 | missing, invalid or expired token |
| ACCESS_DENIED | 403 | authenticated but role not permitted |
| MEMBER_EMAIL_EXISTS | 409 | email already registered |
| SPACE_NOT_FOUND | 404 | space does not exist |
| SPACE_INACTIVE | 409 | space cannot accept new reservations |
| RESERVATION_NOT_FOUND | 404 | reservation does not exist or is not owned by the caller |
| RESERVATION_CONFLICT | 409 | overlaps an existing CONFIRMED reservation |
| RESERVATION_NOT_MODIFIABLE | 409 | reservation is past or CANCELLED |

`AUTH_INVALID_CREDENTIALS` must not reveal whether the email exists.

Error messages exposed to clients must not reveal:

- stack traces,
- SQL details,
- passwords,
- tokens,
- internal filesystem paths.
