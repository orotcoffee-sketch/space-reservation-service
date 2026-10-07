# Project Status

## Current Phase

PHASE 5 — TOOLCHAIN LOCK AND INSTALLATION PLAN

## Current State

TOOLCHAIN_LOCKED_INSTALLATION_PENDING

## Product

Product: Space Reservation Service  
Access Model: Registered members only  
Roles: MEMBER / ADMIN  
Authentication: JWT Bearer access token (implementation not started)  
Refresh Token: OUT OF MVP  
Token Lifetime: 60 minutes planned  
Frontend token storage: sessionStorage planned  
Password: BCrypt planned  
Admin provisioning: environment bootstrap planned  
API base: /api  
Contracts: `docs/02-contracts/api-contract.md`, `auth-architecture.md`, `authorization-matrix.md`, `screen-api-map.md`, `error-contract.md`  
Reservation granularity: 30 minutes  
Past reservation behavior: visible / read-only  
Business Timezone: Asia/Seoul (BR-014: reservations must start in the future in this timezone)  
Operating hours: none defined for MVP (do not invent openingTime/closingTime/businessHours without approval)  
Admin reservation detail endpoint: OUT OF MVP  
Profile editing: OUT OF MVP  
Visual design source: Google Stitch  
Core entities: MEMBER, SPACE, RESERVATION  
Documents: `docs/00-project/mvp-scope.md`, `docs/00-project/business-rules.md`, `docs/01-architecture/screen-flow.md`, `docs/01-architecture/screen-data-map.md`, `docs/03-data/logical-data-model.md`  

## Approved Toolchain

Node: 24.21.0 APPROVED (installed)  
npm: 11.19.0 APPROVED (installed)  
Frontend Tooling: React + Vite 8.x  
Java: 21 LTS (Eclipse Temurin JDK preferred)  
Spring Boot: 3.5.16  
Build Tool: Maven + Maven Wrapper  
Global Maven: not required  
Gradle: not used  
MySQL: 8.4 LTS  
Local MySQL target: 8.4.11 (official MSI; winget `Oracle.MySQL` only offers 8.4.9)  
Winget JDK package: `EclipseAdoptium.Temurin.21.JDK`  
Decision record: `docs/06-decisions/ADR-0002-toolchain.md`; plan: `docs/05-operations/toolchain-installation.md`

## Toolchain State

NOT fully operational: JDK 21 and MySQL 8.4 are not installed.

## Fixed Stack

Frontend: React  
Backend: Spring Boot  
Database: MySQL  
Version Control: Git / GitHub  
Frontend Hosting: Vercel  
Backend Hosting: Render  
Database Deployment Requirement: Render MySQL (assignment); feasibility UNRESOLVED  

## Open Decisions

- JWT library and signing algorithm
- production MySQL deployment (assignment requires Render MySQL; free feasibility UNRESOLVED)

Do not resolve these silently.

## Known Deployment Constraint

Render free backend instances may sleep when inactive.

Assignment requirement: Render MySQL. Required engine: MySQL. Current deployment feasibility: UNRESOLVED (free Render-hosted MySQL must not be assumed). Do not replace MySQL merely to satisfy hosting convenience.

## Last Completed Task

PHASE 5 toolchain lock and installation plan (documentation only; nothing installed)

## Last Verification

Phase 5 on 2026-10-07: `node --version` v24.21.0, `npm --version` 11.19.0, `git --version` 2.56.0.windows.1, winget v1.29.380. `java` and `javac` not found. Winget search (source `winget`): `EclipseAdoptium.Temurin.21.JDK` found; `Oracle.MySQL` max 8.4.9 (target 8.4.11 not available). No remote, nothing pushed. `prompt.md` gitignored. No code, dependencies, SQL or schema created.

## Known Blockers

- JDK 21 not installed (backend cannot be built).
- MySQL 8.4 not installed (server access not tested).

## Next Approved Task

PHASE 5B — INSTALL AND VERIFY LOCAL TOOLCHAIN

## Do Not Start Yet

- application feature implementation
- database schema/migration creation
- authentication implementation
- UI implementation
- API implementation
- production deployment
