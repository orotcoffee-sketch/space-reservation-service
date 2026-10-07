# System Context

## System boundary

```text
Browser
  ↓
React Frontend
  ↓ HTTPS / REST API
Spring Boot Backend
  ↓
MySQL
```

## Deployment architecture

```text
User
  ↓
Vercel (React frontend)
  ↓
Render Web Service (Spring Boot backend)
  ↓
MySQL (assignment requirement: Render MySQL; feasibility UNRESOLVED)
```

The production MySQL deployment is UNRESOLVED. No application-domain assumptions are made in this document.
