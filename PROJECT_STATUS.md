# Project Status

## Current Phase

PHASE 5C — MYSQL INSTALLATION AND VERIFICATION (COMPLETE)

## Current State

LOCAL_TOOLCHAIN_READY

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
Java: 21 LTS, INSTALLED: Eclipse Temurin 21.0.12.1+1 (JAVA_HOME set by installer at Machine level)  
Spring Boot: 3.5.16  
Build Tool: Maven + Maven Wrapper  
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

PHASE 5C MySQL 8.4.9 installation and verification

## Last Verification

Phase 5C on 2026-10-07: fresh terminal `java`/`javac` 21.0.12.1 Temurin, JAVA_HOME set. `winget install --id Oracle.MySQL --exact --source winget` installed 8.4.9 (hash verified); `mysql.exe` and `mysqld.exe` report 8.4.9. Service `MySQL84` Running, StartType Automatic. Port 3306 Listen. User verified `mysql -u root -p` login and `SELECT VERSION()` = 8.4.9 (password not recorded). No database, schema, table or application user created. No remote, nothing pushed. `prompt.md` gitignored.

## Known Blockers

- Toolchain blockers: NONE
- Production: Render MySQL free-tier feasibility UNRESOLVED

## Next Approved Task

PHASE 6 — PROJECT SCAFFOLD AND BACKEND/FRONTEND INITIALIZATION

## Do Not Start Yet

- application feature implementation
- database schema/migration creation
- authentication implementation
- UI implementation
- API implementation
- production deployment
