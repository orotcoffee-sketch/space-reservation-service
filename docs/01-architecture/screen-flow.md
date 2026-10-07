# Screen Flow

Functional screens only. Visual styling comes from Google Stitch (see `docs/00-project/constraints.md`). No React routes are defined here; route concepts only.

## Public

### Login

- Purpose: authenticate an existing member or administrator.
- Actions: enter credentials, login, navigate to registration.

### Registration

- Purpose: create a MEMBER account.
- Public registration creates MEMBER accounts only; users cannot self-register as ADMIN (BR-012).

## MEMBER

### Space List

- Purpose: browse active reservable spaces.
- Information: space name, location, capacity, optional representative image, active availability context where applicable.
- Actions: open space detail.
- No complex search/filter behavior yet.

### Space Detail

- Purpose: inspect a space and begin reservation.
- Information: name, description, location, capacity, representative image if available, reservation date selector, available time information.
- Actions: choose date, choose start/end time (30-minute intervals), request reservation.

### Reservation Confirmation

- Purpose: review selected reservation before final submission.
- Information: space, date, start time, end time.
- Action: confirm reservation.
- May later be a page or modal, depending on the Stitch design (undecided).

### My Reservations

- Purpose: view the authenticated member's reservations.
- Conceptual groups (UI filters, not backend statuses): upcoming, past, cancelled.
- Actions for eligible upcoming CONFIRMED reservations: open detail, modify, cancel.
- Past reservations are read-only.

### Reservation Detail

- Information: reservation identifier, space information, date, start time, end time, status.
- Actions (only when business rules allow): modify, cancel.

## ADMIN

### Admin Space Management

- Purpose: manage spaces.
- Actions: view spaces, create space, edit space, activate/deactivate space.
- Spaces are never permanently deleted in MVP; historical reservation references stay valid (BR-013).

### Admin Reservation Management

- Purpose: view reservations across all members and spaces.
- Information: reservation, member, space, date, time, status.
- MVP action: view only. No admin reservation editing.

## Navigation flow (conceptual)

Public:

```text
Login
 ├─ Registration
 └─ Successful login
       ↓
     Space List
```

Member:

```text
Space List
   ↓
Space Detail
   ↓
Reservation Confirmation
   ↓
Reservation Created
   ↓
My Reservations
   ↓
Reservation Detail
```

Admin:

```text
Login
   ↓
Admin Area
   ├─ Space Management
   └─ Reservation Management
```
