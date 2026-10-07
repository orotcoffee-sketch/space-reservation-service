# Business Rules

Confirmed rules for the Space Reservation Service. Implementation has not started.

## BR-001

Only authenticated members may create reservations.

## BR-002

A reservation belongs to exactly one member.

## BR-003

A reservation belongs to exactly one space.

## BR-004

A space cannot have overlapping active reservations.

Existing reservation 10:00 → 12:00:

- rejected: 09:00 → 11:00, 10:30 → 11:30, 11:00 → 13:00, 09:00 → 13:00
- allowed: 08:00 → 10:00, 12:00 → 14:00 (back-to-back is not an overlap)

## BR-005

Reservation start time must be earlier than end time.

## BR-006

Members may view, modify, or cancel only their own reservations.

Admins may view all reservations.

## BR-007

Inactive spaces cannot accept new reservations.

## BR-008

Cancelled reservations do not block that time period.

## OPEN

No further rules have been approved. Items such as time granularity, past-reservation handling and reservation status values are listed in `mvp-scope.md` as open product decisions.
