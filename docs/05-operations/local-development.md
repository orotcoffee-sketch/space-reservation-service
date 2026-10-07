# Local Development

Status: PHASE 1 verification recorded. Setup instructions are NOT yet written (frontend/backend not initialized).

## Verified Environment

Verified 2026-10-07 (re-verified in Phase 1B; results unchanged).

- OS: Windows 11 Pro 10.0.26200
- Shells: PowerShell (primary), Git Bash
- Project path: `C:\Users\ds-115\Desktop\AI`
- Git: repository on branch `main`, no commits, no remote; user name/email configured (values not recorded)
- `frontend/` and `backend/` do not exist

## Available Tools

| Tool | Version | Status |
|---|---|---|
| Git | 2.56.0.windows.1 | AVAILABLE |
| Node | v24.21.0 | AVAILABLE |
| npm | 11.19.0 | AVAILABLE |

Availability is not approval: compatibility with the project is not yet confirmed.

## Missing Tools

| Tool | Status | Marker |
|---|---|---|
| Java runtime (`java`) | NOT_AVAILABLE | JDK_REQUIRED |
| JDK compiler (`javac`) | NOT_AVAILABLE | JDK_REQUIRED |
| Maven (`mvn`) | NOT_AVAILABLE | UNRESOLVED (choice between Maven/Gradle) |
| Gradle (`gradle`) | NOT_AVAILABLE | UNRESOLVED (choice between Maven/Gradle) |
| MySQL client (`mysql`) | NOT_AVAILABLE | MYSQL_LOCAL_REQUIRED |
| MySQL server/service | NOT_AVAILABLE (no `mysqld`; no mysql/maria Windows service) | MYSQL_LOCAL_REQUIRED |

Detection covered PATH, `JAVA_HOME`, standard install directories and Windows services only.

## Pending Decisions

- Java/JDK version
- Spring Boot version
- Maven vs Gradle
- MySQL version and local server setup
- Node/npm version approval
- Vite/React tooling versions
- production MySQL deployment (assignment requires Render MySQL; free feasibility UNRESOLVED)
