# MVP Scope

## Product Goal

A web application where registered users can browse available spaces and reserve them for a selected date and time. Generic enough for meeting rooms, study rooms, practice rooms and shared spaces; not specialized to one industry.

## Target Users

- MEMBER: registered user
- ADMIN: administrator; a role inside the same system, not a separate application

## MEMBER Capabilities

- sign up, log in, log out
- browse spaces, view space details
- check reservation availability
- create a reservation
- view own reservations
- modify own reservation
- cancel own reservation

Primary flow:

```text
Sign up / Login → Browse spaces → View space details → Select date
→ Select start/end time → Check availability → Create reservation
→ View My Reservations → Modify or Cancel
```

## ADMIN Capabilities

- log in
- create spaces, modify spaces, deactivate spaces
- view all reservations, inspect reservation details

Flow:

```text
Admin Login → Manage spaces → View all reservations
```

## Must Have

Authentication:

- member registration, login, logout
- member/admin role distinction

Space:

- space list, space detail
- space active/inactive status
- admin space creation and update

Reservation:

- create reservation
- view own reservations
- modify own reservation
- cancel own reservation
- admin view all reservations

Reservation conflict rule: overlapping reservations for the same space must be prevented (BR-004).

## Should Have

- filter spaces by availability
- filter reservations by date/status
- responsive UI
- basic form validation
- clear error messages
- reservation status display

## Out of Scope

- payment
- real-time chat
- AI functionality
- SMS notification
- email notification
- social login
- map integration
- review/rating system
- coupon system
- multi-tenant organization management
- recurring reservations
- waitlists

These may only be added later by explicit user decision. The product must not expand into a marketplace or SaaS platform.

## Core Business Rules

See `business-rules.md` (BR-001 to BR-008). Core rule: a space cannot have overlapping active reservations; cancelled reservations do not block time; inactive spaces accept no new reservations.

## Open Product Decisions

- exact authentication mechanism (JWT/session not decided)
- reservation time granularity
- whether past reservations remain visible
- whether members may edit profile information
- exact space fields
- exact reservation status model
