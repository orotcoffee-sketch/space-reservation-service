# Logical Data Model

LOGICAL model only. No SQL, JPA entities or migrations exist. Engine: MySQL (see `database-rules.md`).

Core entities: MEMBER, SPACE, RESERVATION.

## MEMBER

| Field | Purpose |
|---|---|
| id | identity |
| email | login identifier; uniquely identifies an account |
| password | authentication; never stored as plaintext |
| name | display / admin reservation view |
| role | MEMBER or ADMIN |
| createdAt | audit |
| updatedAt | audit |

Rules:

- email is unique.
- Public registration creates role MEMBER (BR-012).
- ADMIN provisioning method is implementation-specific and OPEN.
- No additional personal data (address, profile image, social account).

## SPACE

| Field | Purpose |
|---|---|
| id | identity |
| name | Space List / Detail |
| description | Space Detail |
| location | Space List / Detail |
| capacity | Space List / Detail |
| imageUrl | optional representative image |
| active | whether new reservations are accepted |
| createdAt | audit |
| updatedAt | audit |

Rules:

- Inactive spaces remain in historical data and cannot accept new reservations (BR-007).
- Spaces are deactivated, not hard-deleted, in MVP (BR-013).
- `imageUrl` is optional.

## RESERVATION

| Field | Purpose |
|---|---|
| id | identity; shown in Reservation Detail |
| memberId | owner (BR-002) |
| spaceId | reserved space (BR-003) |
| reservationDate | calendar date; start and end on the same date (BR-010) |
| startTime | 30-minute interval (BR-009) |
| endTime | 30-minute interval; after startTime (BR-005) |
| status | CONFIRMED or CANCELLED |
| createdAt | audit |
| updatedAt | audit |

Status values: CONFIRMED, CANCELLED only. Past vs upcoming is derived from date/time, not stored.

## Relationships

- MEMBER 1 → N RESERVATION
- SPACE 1 → N RESERVATION
- Each RESERVATION belongs to exactly one MEMBER and exactly one SPACE.

## Reservation overlap rule

For the same space and same reservationDate, a new CONFIRMED reservation conflicts with an existing CONFIRMED reservation when:

```text
newStart < existingEnd
AND
newEnd > existingStart
```

Existing 10:00–12:00:

- Allowed: 08:00–10:00, 12:00–14:00
- Rejected: 09:00–11:00, 10:00–11:00, 11:00–13:00, 09:00–13:00

CANCELLED reservations do not participate in overlap blocking (BR-008).

Not implemented yet.

## Data minimization

Every field above is used by an approved screen, business rule or audit need (`createdAt`/`updatedAt` are audit fields not displayed by any screen; kept as agreed conceptual fields). No speculative fields.
