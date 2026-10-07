# Requirements

## Confirmed

- full-stack web application
- planning through real deployment
- React frontend
- Spring Boot backend
- MySQL database
- Git/GitHub version control
- VS Code development
- Claude Code assisted development
- frontend deployment through Vercel
- backend deployment through Render
- database deployment requirement from the assignment: Render MySQL

## Assignment stack (fixed; changes only by explicit user instruction)

```text
Frontend: React
Backend: Spring Boot
Database: MySQL
Version Control: Git / GitHub
Frontend Deployment: Vercel
Backend Deployment: Render
Database Deployment Requirement: Render MySQL
```

Assignment requirement: Render MySQL

Required database engine: MySQL

Current deployment feasibility: UNRESOLVED (free Render-hosted MySQL is not confirmed). Do not replace MySQL merely to satisfy hosting convenience.

Supporting tools (Node/npm, Vite, JDK, Maven/Gradle, Docker) only help run the fixed stack and never replace it.

## Product Domain

Space Reservation Service

## User Types

- MEMBER
- ADMIN

## Access Requirement

Reservations require authenticated membership.

## Core Capability

Registered users can browse spaces and reserve an available time period.

## Core Business Constraint

Overlapping reservations for the same active space must be rejected.

Details: `mvp-scope.md`, `business-rules.md`.

## OPEN

- authentication: JWT planned; design details OPEN (Phase 4)
- other open product decisions: see `mvp-scope.md`
- non-functional requirements (performance, availability): OPEN
