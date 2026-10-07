# Local Development

Status: LOCAL_TOOLCHAIN_READY (Phase 5C). JDK 21 and MySQL 8.4.9 installed and verified. Setup instructions are NOT yet written (frontend/backend not initialized). Installation plan: `toolchain-installation.md`.

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
| Java | Java 21 LTS (Eclipse Temurin JDK preferred) | INSTALLED |
| Spring Boot | 3.5.16 | APPROVED |
| Build tool | Maven + Maven Wrapper | APPROVED |
| Global Maven | not needed | NOT REQUIRED |
| Gradle | not used | NOT USED |
| MySQL | 8.4 LTS (installed patch: 8.4.9) | INSTALLED |
| Business timezone | Asia/Seoul | APPROVED |
| Git | 2.56.0.windows.1 | AVAILABLE |

## Currently Installed

| Tool | Status |
|---|---|
| Git | 2.56.0.windows.1 |
| Node / npm | v24.21.0 / 11.19.0 |
| JDK | Eclipse Temurin 21.0.12.1+1 LTS (winget `EclipseAdoptium.Temurin.21.JDK`) |
| `java` | openjdk 21.0.12.1 (verified via full path) |
| `javac` | 21.0.12.1 (verified via full path) |
| `JAVA_HOME` (Machine) | `C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot\` |
| MySQL | 8.4.9 Community Server (winget `Oracle.MySQL`), client and server `Ver 8.4.9` |
| MySQL service | `MySQL84`, Running, Automatic |
| MySQL port | 3306, listening |
| MySQL root login | verified by user (`SELECT VERSION()` returned 8.4.9); password not recorded |
| Build tool | Maven Wrapper (created in the backend scaffold phase) |

The installer added the JDK `bin` directory to the Machine `PATH`. Bare `java`/`javac`/`JAVA_HOME` verified in a fresh terminal. `mysql` is not on PATH; use `C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe`.

## Still Required

None for the local toolchain. No application database, schema or application user exists yet (backend initialization phase).

## Remaining Open Infrastructure Issue

- production MySQL deployment (assignment requires Render MySQL; free feasibility UNRESOLVED)

Open decision: JWT library and signing algorithm.
