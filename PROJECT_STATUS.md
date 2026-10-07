# Project Status

## Current Phase

PHASE 2 — PRODUCT SCOPE AND MVP DEFINITION

## Current State

PRODUCT_SCOPE_DEFINED

## Product

Application Domain: Space Reservation Service  
Access Model: Registered members only  
Roles: MEMBER / ADMIN  
Scope documents: `docs/00-project/mvp-scope.md`, `docs/00-project/business-rules.md`  

## Toolchain State

TOOLCHAIN_PARTIALLY_VERIFIED (Phase 1; unchanged)

## Fixed Stack

Frontend: React  
Backend: Spring Boot  
Database: MySQL  
Version Control: Git / GitHub  
Frontend Hosting: Vercel  
Backend Hosting: Render  
Database Deployment Requirement: Render MySQL (assignment); feasibility UNRESOLVED  

## Open Decisions

- exact authentication mechanism (JWT/session)
- reservation time granularity
- whether past reservations remain visible
- whether members may edit profile information
- exact space fields
- exact reservation status model
- frontend build tooling/version
- Java version
- Spring Boot version
- Maven vs Gradle
- Node version
- MySQL version
- production MySQL deployment (assignment requires Render MySQL; free feasibility UNRESOLVED)

Do not resolve these silently.

## Known Deployment Constraint

Render free backend instances may sleep when inactive.

Assignment requirement: Render MySQL. Required engine: MySQL. Current deployment feasibility: UNRESOLVED (free Render-hosted MySQL must not be assumed). Do not replace MySQL merely to satisfy hosting convenience.

## Last Completed Task

PHASE 2 product scope and MVP definition (documentation only)

## Last Verification

Phase 2: documentation review only; no code, dependencies or schema created. Phase 1/1B command output on 2026-10-07: Git 2.56.0.windows.1, Node v24.21.0, npm 11.19.0 AVAILABLE. Java, javac, Maven, Gradle, MySQL client, MySQL server/service NOT_AVAILABLE (PATH, JAVA_HOME, standard dirs, services). Markers: JDK_REQUIRED, MYSQL_LOCAL_REQUIRED; Maven/Gradle choice UNRESOLVED. Details: `docs/05-operations/local-development.md`.

## Known Blockers

- JDK_REQUIRED: no Java runtime or javac (backend cannot be built).
- Neither Maven nor Gradle installed; build-tool decision pending.
- MYSQL_LOCAL_REQUIRED: no local MySQL client/server (server access not tested).

## Next Approved Task

PHASE 3 — SCREEN FLOW AND DATA MODEL PLANNING

Toolchain installation and the initial Git commit remain pending user action; product planning may continue despite them.

## Do Not Start Yet

- application feature implementation
- database schema/migration creation
- authentication implementation
- UI implementation
- API implementation
- production deployment
