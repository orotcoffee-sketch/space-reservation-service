# Dependency Rules

Future rules; no code exists yet.

## Backend (conceptual direction)

```text
Controller
  ↓
Application/Service
  ↓
Domain
  ↓
Repository/Infrastructure
```

- Controllers must not contain core business logic.
- Database-specific logic must not leak into controllers.

## Frontend (conceptual direction)

```text
Page
  ↓
Feature/Component
  ↓
API Client
  ↓
HTTP configuration
```

- React components must not contain production host URLs.
- API base URLs must use environment configuration.
- Shared business rules should not be duplicated across random components.
