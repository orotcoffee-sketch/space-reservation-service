# Local Development

Status: Toolchain versions APPROVED (Phase 5). JDK and MySQL are NOT yet installed. Setup instructions are NOT yet written (frontend/backend not initialized). Installation plan: `toolchain-installation.md`.

## Verified Environment

Verified 2026-10-07 (Phase 1, 1B and 5).

- OS: Windows 11 Pro 10.0.26200
- Shells: PowerShell (primary), Git Bash
- Project path: `C:\Users\ds-115\Desktop\AI`
- Git: repository on branch `main`, no remote; user name/email configured (values not recorded)
- `frontend/` and `backend/` do not exist

## Approved Toolchain

| Tool | Decision | Status |
|---|---|---|
| Node / npm | 24.21.0 / 11.19.0 | APPROVED (installed) |
| Frontend | React + Vite 8.x | APPROVED (not initialized) |
| Java | Java 21 LTS (Eclipse Temurin JDK preferred) | INSTALLATION REQUIRED |
| Spring Boot | 3.5.16 | APPROVED |
| Build tool | Maven + Maven Wrapper | APPROVED |
| Global Maven | not needed | NOT REQUIRED |
| Gradle | not used | NOT USED |
| MySQL | 8.4 LTS / local target 8.4.11 | INSTALLATION REQUIRED |
| Business timezone | Asia/Seoul | APPROVED |
| Git | 2.56.0.windows.1 | AVAILABLE |

## Current Installation State

| Tool | Status |
|---|---|
| Git | AVAILABLE |
| Node v24.21.0 | AVAILABLE |
| npm 11.19.0 | AVAILABLE |
| `java` | NOT_AVAILABLE (JDK_REQUIRED) |
| `javac` | NOT_AVAILABLE (JDK_REQUIRED) |
| MySQL client/server/service | NOT_AVAILABLE (MYSQL_LOCAL_REQUIRED) |

## Pending Decisions

- production MySQL deployment (assignment requires Render MySQL; free feasibility UNRESOLVED)
- JWT library and signing algorithm
