# Database Rules

Database engine: MySQL

Rules:

- schema changes must be reproducible,
- production schema must not depend on manual undocumented edits,
- database credentials must use environment variables,
- entity/model changes require migration consideration,
- destructive schema changes require explicit approval,
- production data must never be used casually for local testing.

No application tables exist yet.
