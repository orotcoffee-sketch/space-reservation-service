# Screen ↔ API Map

Traceability only. Contract details: `api-contract.md`.

| Screen | API |
|---|---|
| Login | POST /api/auth/login |
| Registration | POST /api/auth/register |
| Space List | GET /api/spaces |
| Space Detail | GET /api/spaces/{id}; GET /api/spaces/{id}/availability |
| Reservation Confirmation | POST /api/reservations |
| My Reservations | GET /api/reservations/me |
| Reservation Detail | GET /api/reservations/{id}; PUT /api/reservations/{id}; PATCH /api/reservations/{id}/cancel |
| Admin Space Management | GET /api/admin/spaces; POST /api/admin/spaces; PUT /api/admin/spaces/{id}; PATCH /api/admin/spaces/{id}/status |
| Admin Reservation Management | GET /api/admin/reservations |
