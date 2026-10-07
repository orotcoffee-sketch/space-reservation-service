# Project Status

## Current Phase

PHASE 9 — INTEGRATION AND MERGE (COMPLETE)

## Current State

INTEGRATED_MVP_LOCAL_VERIFIED

## Product

Product: Space Reservation Service  
Access Model: Registered members only  
Roles: MEMBER / ADMIN  
Authentication: JWT Bearer access token — IMPLEMENTED (Spring Security OAuth2 Resource Server / Nimbus, HS256, `JWT_SECRET` min 32 bytes from environment)  
Refresh Token: OUT OF MVP  
Token Lifetime: 60 minutes (`app.jwt.expiration-minutes`)  
Frontend token storage: sessionStorage (key `auth`) — IMPLEMENTED  
Password: BCrypt — IMPLEMENTED  
Admin provisioning: environment bootstrap (`ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`, idempotent) — IMPLEMENTED  
Migrations: Flyway (`backend/src/main/resources/db/migration`, V1 core schema) — IN USE  
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
Frontend Tooling: React + Vite 8.x (JavaScript; initialized: React 19.3.0, React DOM 19.3.0, Vite 8.3.3)  
Java: 21 LTS, INSTALLED: Eclipse Temurin 21.0.12.1+1 (JAVA_HOME set by installer at Machine level)  
Spring Boot: 3.5.16 (initialized, pinned in `backend/pom.xml`; Java 21)  
Build Tool: Maven + Maven Wrapper (Maven 3.9.16 via wrapper)  
Global Maven: not required  
Gradle: not used  
MySQL: 8.4 LTS  
Local MySQL patch: 8.4.9 INSTALLED (winget `Oracle.MySQL`), service `MySQL84` Running/Automatic, port 3306  
Winget JDK package: `EclipseAdoptium.Temurin.21.JDK`  
Decision record: `docs/06-decisions/ADR-0002-toolchain.md`; plan: `docs/05-operations/toolchain-installation.md`

## Toolchain State

LOCAL_TOOLCHAIN_READY: JDK 21 and MySQL 8.4.9 installed and verified.

## Implementation State

- Backend MVP: IMPLEMENTED on `feat/backend-core`, commit `248ae3c` (auth, spaces, reservations, admin endpoints; Flyway; Spring Security + Nimbus JWT HS256, 60-minute access token). Tests use a dedicated local MySQL schema (no H2).
- Frontend MVP: IMPLEMENTED on `feat/frontend-core`, commit `a2c89c6` (React + Vite, react-router-dom; unstyled functional UI; Google Stitch design NOT applied yet).
- Deployment prep: `feat/deploy-prep`, commit `337b541` (`backend/Dockerfile`, `backend/.dockerignore`, `frontend/vercel.json`). Not deployed.
- API integration contract: VERIFIED by static audit of the frontend against the actual backend DTOs/controllers; documented in `docs/02-contracts/api-contract.md`.
- Phase 9: all three branches merged into `main` with `--no-ff` (no conflicts); four frontend polish fixes applied (register/admin-space field limits, past-reservation actions hidden, Asia/Seoul date handling); frontend lint/build and backend test/package executed and passing (see Last Verification).

## Fixed Stack

Frontend: React  
Backend: Spring Boot  
Database: MySQL  
Version Control: Git / GitHub  
Frontend Hosting: Vercel  
Backend Hosting: Render  
Database Deployment Requirement: Render MySQL (assignment); feasibility UNRESOLVED  

## Open Decisions

- production MySQL deployment (assignment requires Render MySQL; free feasibility UNRESOLVED)

Resolved in Phases 7-9: JWT library and signing algorithm = Spring Security OAuth2 Resource Server (Nimbus), HS256.

Do not resolve open items silently.

## Known Deployment Constraint

Render free backend instances may sleep when inactive.

Assignment requirement: Render MySQL. Required engine: MySQL. Current deployment feasibility: UNRESOLVED (free Render-hosted MySQL must not be assumed). Do not replace MySQL merely to satisfy hosting convenience.

## Last Completed Task

PHASE 9 integration and merge

## Last Verification

Phase 9 on 2026-10-07 (executed): merged `feat/backend-core` (248ae3c), `feat/frontend-core` (a2c89c6) and `feat/deploy-prep` (337b541) into `main` with `--no-ff`, no conflicts. Frontend: `npm install` OK (0 vulnerabilities), `npm run lint` PASS (exit 0), `npm run build` PASS. Backend: `.\mvnw.cmd test` PASS (26 tests, 0 failures, 0 errors, 0 skipped) against the local MySQL test schema (`DB_PASSWORD` from the user environment, never committed); `.\mvnw.cmd package` PASS (`backend-0.0.1-SNAPSHOT.jar`). Not executed: browser/manual end-to-end run of the frontend against the backend, container build, any deployment. No remote, nothing pushed. `prompt.md` gitignored; `CLAUDE.md` unchanged.

## Known Blockers

- Toolchain blockers: NONE
- Production: Render MySQL free-tier feasibility UNRESOLVED

## Next Approved Task

NONE DEFINED — awaiting approval (candidates: Google Stitch UI application, manual end-to-end verification, deployment once production MySQL is decided)

## Do Not Start Yet

- Google Stitch UI implementation
- production deployment (production MySQL on Render OPEN)
- features outside `docs/00-project/mvp-scope.md`
