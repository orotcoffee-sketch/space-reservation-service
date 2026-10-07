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

## BR-009

Reservations use 30-minute time intervals.

## BR-010

Reservation start and end must occur on the same calendar date.

## BR-011

Past reservations remain visible but cannot be modified or cancelled.

## BR-012

Public registration creates MEMBER accounts only.

## BR-013

Spaces are deactivated rather than permanently deleted during MVP operation.

## BR-014

A new or modified reservation must start in the future according to the application business timezone `Asia/Seoul`.

Past reservation determination (BR-011) also uses `Asia/Seoul`.

No timezone columns are added to MEMBER, SPACE or RESERVATION for MVP.

## Operating Hours (decision, not a numbered rule)

No separate space operating-hours restriction is defined for MVP. Availability is determined only from the selected date, the 30-minute interval rule, the future-time rule (BR-014), existing CONFIRMED reservations, and the active/inactive space state.

Do not invent `openingTime`, `closingTime`, `businessHours` or similar fields without user approval.

## Admin Reservation Detail (decision)

Separate admin reservation detail endpoint: OUT OF MVP. The approved admin reservation list provides what the current admin screen needs. Revisit only if the Stitch design or future requirements require it.

## OPEN

No further rules have been approved.
