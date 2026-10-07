# Screen ↔ Data Map

Each screen lists only the data it requires. Prevents screens from requesting unnecessary backend data. No API endpoints are designed here. Entities are defined in `docs/03-data/logical-data-model.md`.

| Screen | Required Entity/Data | Main Actions |
|---|---|---|
| Login | MEMBER: email, password (submitted credentials) | login |
| Registration | MEMBER: email, password, name (submitted) | register (role fixed to MEMBER) |
| Space List | SPACE (active only): id, name, location, capacity, imageUrl | open space detail |
| Space Detail | SPACE: name, description, location, capacity, imageUrl; RESERVATION (CONFIRMED, selected space/date): startTime, endTime only, to show available times | choose date/time, request reservation |
| Reservation Confirmation | SPACE: name; selected reservationDate, startTime, endTime | confirm reservation |
| My Reservations | RESERVATION (own): id, reservationDate, startTime, endTime, status; SPACE: name | open detail, modify, cancel |
| Reservation Detail | RESERVATION (own): id, reservationDate, startTime, endTime, status; SPACE: name, location | modify, cancel |
| Admin Space Management | SPACE: all fields incl. active | create, edit, activate/deactivate |
| Admin Reservation Management | RESERVATION: id, reservationDate, startTime, endTime, status; MEMBER: name, email; SPACE: name | view only |

Notes:

- Other members' reservations are never exposed to members; Space Detail needs only occupied time ranges, not member identity.
- `password` is never returned to any screen.
- `createdAt`/`updatedAt` are not displayed by any approved screen.
