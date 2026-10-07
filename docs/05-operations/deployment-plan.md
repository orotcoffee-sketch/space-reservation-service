# Deployment Plan

## Confirmed architecture

Frontend: React → GitHub → Vercel

Backend: Spring Boot → GitHub → Render Web Service

Database: MySQL

- Assignment requirement: Render MySQL
- Required database engine: MySQL
- Current deployment feasibility: UNRESOLVED (OPEN_DEPLOYMENT_DECISION)
- Do not replace MySQL merely to satisfy hosting convenience.

## Render constraints

- Free backend instances may sleep after inactivity.
- Cold start must be considered normal in the free environment.
- Application data must not rely on Render backend local filesystem persistence.
- Render MySQL must not be assumed to be free.

Production deployment is not configured in Phase 0.
