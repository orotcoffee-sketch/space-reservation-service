# API Contract

Contract implemented by the backend (`feat/backend-core`, 248ae3c) and consumed by the frontend (`feat/frontend-core`, a2c89c6); verified against the actual DTOs in Phase 9. Conventions: `api-conventions.md`. Errors: `error-contract.md`. Roles: `authorization-matrix.md`.

- Base path: `/api`; admin endpoints under `/api/admin`.
- JSON request/response. Database entities are never exposed; DTOs are explicit.
- Authenticated endpoints require `Authorization: Bearer <accessToken>`.
- Date: `YYYY-MM-DD`. Time: `HH:mm`, on a 30-minute boundary (BR-009).
- List endpoints return a bare JSON array (no envelope, no pagination).
- Roles serialize as `MEMBER` / `ADMIN`.
- Ids are numeric.

## Ownership security rule

A client-provided member identifier never determines reservation ownership.

```text
JWT authenticated identity
        ↓
server resolves member
        ↓
server verifies ownership
```

The server must not trust a `memberId` supplied by the browser. No reservation request contains `memberId`. A member requesting another member's reservation receives 404 `RESERVATION_NOT_FOUND` so that existence is not revealed.

## Auth

### POST /api/auth/register — Public

Request: `email`, `password`, `name`. A role is never accepted; the account is created as MEMBER.

Success `201 Created`: `id`, `email`, `name`, `role`. Never the password.

Errors: 400 `VALIDATION_ERROR`; 409 `MEMBER_EMAIL_EXISTS`.

### POST /api/auth/login — Public

Request: `email`, `password`.

Success `200 OK`: `accessToken`, `tokenType`, `expiresIn`, `member` (`id`, `email`, `name`, `role` only; never password or hash).

Errors: 400 `VALIDATION_ERROR`; 401 `AUTH_INVALID_CREDENTIALS`.

## Spaces (MEMBER / ADMIN)

### GET /api/spaces

Active spaces only. Response: bare JSON array of items: `id`, `name`, `location`, `capacity`, `imageUrl`.

### GET /api/spaces/{spaceId}

`id`, `name`, `description`, `location`, `capacity`, `imageUrl`, `active`. Errors: 404 `SPACE_NOT_FOUND`.

### GET /api/spaces/{spaceId}/availability?date=YYYY-MM-DD

Backend owns availability calculation; the frontend must not download all reservations to compute it.

Response (`reservedRanges` lists CONFIRMED reservations only):

```json
{
  "spaceId": 1,
  "date": "YYYY-MM-DD",
  "intervalMinutes": 30,
  "reservedRanges": [
    { "startTime": "HH:mm", "endTime": "HH:mm" }
  ]
}
```

- Contains no member identity and no reservation ids.
- Returns occupied ranges; the frontend derives free 30-minute slots from them.
- No operating hours are defined for MVP (see `business-rules.md`), so no open/close times are returned.

Errors: 400 `VALIDATION_ERROR` (missing/invalid date); 404 `SPACE_NOT_FOUND`.

## Member reservations (MEMBER)

Reservation response (every endpoint below that returns a reservation uses this shape): `id`, `space` (`id`, `name`, `location`), `reservationDate`, `startTime`, `endTime`, `status` (CONFIRMED / CANCELLED).

### POST /api/reservations

Request: `spaceId`, `reservationDate`, `startTime`, `endTime`. No `memberId`.

Success `201 Created` with the full reservation response.

Validation: space exists; space active; start < end; same calendar date; 30-minute interval; not in an invalid past period; no overlapping CONFIRMED reservation (rule in `logical-data-model.md`).

Errors: 400 `VALIDATION_ERROR`; 404 `SPACE_NOT_FOUND`; 409 `SPACE_INACTIVE`; 409 `RESERVATION_CONFLICT`.

### GET /api/reservations/me

Authenticated member's reservations. Response: bare JSON array of reservation responses, ordered by date and start time descending. Optional filter concepts: upcoming/past category, status. Not required in the initial implementation unless useful. Upcoming/past is derived from date/time, not stored.

### GET /api/reservations/{reservationId}

Own reservation only. Errors: 404 `RESERVATION_NOT_FOUND` (also for another member's reservation).

### PUT /api/reservations/{reservationId}

Modify date/time. Request: `reservationDate`, `startTime`, `endTime`. Owner only. Past and CANCELLED reservations cannot be modified. The overlap rule is rechecked (the reservation being modified does not conflict with itself).

Success `200 OK` with the full reservation response.

Errors: 400 `VALIDATION_ERROR`; 404 `RESERVATION_NOT_FOUND`; 409 `RESERVATION_NOT_MODIFIABLE`; 409 `RESERVATION_CONFLICT`.

### PATCH /api/reservations/{reservationId}/cancel

Sets status to CANCELLED; the record is never physically deleted. Owner only. Past reservations cannot be cancelled (BR-011).

Success `200 OK` with the full cancelled reservation response (`status` CANCELLED).

Errors: 404 `RESERVATION_NOT_FOUND`; 409 `RESERVATION_NOT_MODIFIABLE`.

## Admin spaces (ADMIN, `/api/admin`)

### GET /api/admin/spaces

All spaces including inactive (bare JSON array), so an inactive space can be found and reactivated. Fields: all SPACE fields needed by Admin Space Management (`id`, `name`, `description`, `location`, `capacity`, `imageUrl`, `active`). Added for consistency with the "view spaces" and "activate" screen actions; not in the Phase 4 endpoint list.

### POST /api/admin/spaces

Request: `name`, `description`, `location`, `capacity`, `imageUrl` (optional). New spaces default to active. Success `201 Created` with the space detail (`id`, `name`, `description`, `location`, `capacity`, `imageUrl`, `active`). Errors: 400 `VALIDATION_ERROR`.

### PUT /api/admin/spaces/{spaceId}

Modify editable space information (same fields as create). Errors: 400 `VALIDATION_ERROR`; 404 `SPACE_NOT_FOUND`.

### PATCH /api/admin/spaces/{spaceId}/status

Request: `active` (boolean). Activates or deactivates; never hard-deletes. Errors: 400 `VALIDATION_ERROR`; 404 `SPACE_NOT_FOUND`.

## Admin reservations (ADMIN)

### GET /api/admin/reservations

All reservations (bare JSON array). Item: `reservationId`, `member` (`name`, `email`), `space` (`id`, `name`), `reservationDate`, `startTime`, `endTime`, `status`. No password or security fields. View only; admin editing/cancelling is not in MVP. A separate admin detail endpoint is not defined; the list fields cover the approved admin screen (OPEN if "inspect details" needs more).

## HTTP status policy

| Situation | Status |
|---|---|
| Successful creation | 201 |
| Successful read/update | 200 |
| Bad input | 400 |
| Unauthenticated | 401 |
| Authenticated but not permitted | 403 |
| Not found | 404 |
| Reservation overlap | 409 |

Failures never use 200. `SPACE_INACTIVE`, `RESERVATION_CONFLICT` and `RESERVATION_NOT_MODIFIABLE` use 409 (state conflict; implemented).

## CORS

- Allowed methods: GET, POST, PUT, PATCH, OPTIONS.
- Allowed request headers: `Authorization`, `Content-Type`.
- Allowed origin: a single origin controlled by the `FRONTEND_ORIGIN` environment variable (default `http://localhost:5173` for local development). It must match the browser origin exactly (scheme, host, port, no trailing slash).
- No credentials or cookies; authentication uses the Bearer token only.
- CORS applies to `/api/**`.

## Open

Resolved in Phase 5:

- "invalid past period": reservation start must be in the future in `Asia/Seoul` (BR-014)
- operating hours: none for MVP
- admin reservation detail endpoint: OUT OF MVP
