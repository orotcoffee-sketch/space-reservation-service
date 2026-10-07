# Project Status

## Current Phase

PHASE 6 — PROJECT SCAFFOLD AND BACKEND/FRONTEND INITIALIZATION

## Current State

PROJECT_SCAFFOLD_READY

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

PHASE 6 project scaffold and backend/frontend initialization

## Last Verification

Phase 6 on 2026-10-07: `frontend/` created with `create-vite` 9.2.1 (React, JavaScript); installed react 19.3.0, react-dom 19.3.0, vite 8.3.3 (npm stable `latest` 8.3.3). `npm run build` PASS, `npm run lint` (oxlint) PASS, exit 0. `backend/` obtained from Spring Initializr (Maven, Jar, Java 21, `com.spacereservation:backend`, Spring Web + Validation). Spring Initializr no longer directly generates Spring Boot 3.5.16 (its supported range is now >=4.0.0; HTTP 400 on a 3.5.16 request). A supported scaffold version (4.0.8) was used only to obtain the project structure and Maven Wrapper; the generated `pom.xml` was then pinned to 3.5.16 and the 4.x-specific starters were replaced (`spring-boot-starter-webmvc` -> `spring-boot-starter-web`; `spring-boot-starter-validation-test` and `spring-boot-starter-webmvc-test` -> `spring-boot-starter-test`). The final verified project is Spring Boot 3.5.16. `mvnw.cmd -v`: Apache Maven 3.9.16, Java 21.0.12.1. `mvnw.cmd test` PASS (1 test), `mvnw.cmd package` PASS (`backend-0.0.1-SNAPSHOT.jar`). MySQL 8.4.9 installed; application database NOT CREATED; no datasource configured. No remote, nothing pushed. `prompt.md` gitignored; `CLAUDE.md` unchanged.

## Known Blockers

- Toolchain blockers: NONE
- Production: Render MySQL free-tier feasibility UNRESOLVED

## Next Approved Task

PHASE 7 — BACKEND DATA MODEL AND MYSQL INTEGRATION

## Do Not Start Yet

- application feature implementation
- database schema/migration creation
- authentication implementation
- UI implementation
- API implementation
- production deployment
