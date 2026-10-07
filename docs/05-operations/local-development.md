# Local Development

Status: INTEGRATED_MVP_LOCAL_VERIFIED (Phase 10). JDK 21 and MySQL 8.4.9 installed; the integrated frontend, backend and MySQL were run locally end to end. Installation plan: `toolchain-installation.md`.

## Verified Environment

Verified 2026-10-07 (Phase 1, 1B and 5).

- OS: Windows 11 Pro 10.0.26200
- Shells: PowerShell (primary), Git Bash
- Project path: `C:\Users\ds-115\Desktop\AI`
- Git: repository on branch `main`, no remote; user name/email configured (values not recorded)
- `frontend/` (React + Vite, JavaScript, React Router) and `backend/` (Spring Boot 3.5.16, Spring Security + Nimbus JWT, Flyway, Maven Wrapper) are implemented

## Approved Toolchain

| Tool | Decision | Status |
|---|---|---|
| Node / npm | 24.21.0 / 11.19.0 | APPROVED (installed) |
| Frontend | React + Vite 8.x | IMPLEMENTED (react 19.3.0, react-dom 19.3.0, vite 8.3.3, react-router-dom 7.18.4) |
| Java | Java 21 LTS (Eclipse Temurin JDK preferred) | INSTALLED |
| Spring Boot | 3.5.16 | IMPLEMENTED (pinned in `backend/pom.xml`) |
| Build tool | Maven + Maven Wrapper | IN USE (Maven 3.9.16) |
| Authentication | Spring Security OAuth2 Resource Server (Nimbus), HS256, 60-minute access token, BCrypt | IMPLEMENTED |
| Migrations | Flyway (`V1__core_schema.sql`), Hibernate `ddl-auto=validate` | IN USE |
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
| Build tool | Maven Wrapper in `backend/` (Maven 3.9.16) |

The installer added the JDK `bin` directory to the Machine `PATH`. Bare `java`/`javac`/`JAVA_HOME` verified in a fresh terminal. `mysql` is not on PATH; use `C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe`.

## Local database

The application database is created locally from `backend/db/local-setup.sql` (run as the MySQL administrator; the template contains no real password, which is supplied at run time and never committed). It defines the application schema `space_reservation`, the test schema `space_reservation_test` and the application user `space_app`. Flyway creates the tables on first backend start. The backend connects to MySQL only; H2 or another database is not used, including for tests.

## Backend environment (process environment, never committed)

| Variable | Required | Notes |
|---|---|---|
| `DB_PASSWORD` | yes | password of the application database user; no default |
| `JWT_SECRET` | yes | at least 32 bytes; no default |
| `DB_URL` | no | default `jdbc:mysql://localhost:3306/space_reservation` |
| `DB_USERNAME` | no | default `space_app` |
| `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` | no | when both are set (password at least 8 characters), an ADMIN account is created on startup if it does not exist; otherwise bootstrap is skipped |
| `FRONTEND_ORIGIN` | no | single allowed CORS origin; default `http://localhost:5173` |

`DB_PASSWORD` is also required by `.\mvnw.cmd test` (the test profile uses the dedicated schema `space_reservation_test`; the JWT secret is supplied by the test profile).

## Build and test commands

Executed successfully (Phase 9):

```text
cd frontend
npm install
npm run lint
npm run build

cd backend
.\mvnw.cmd -v
.\mvnw.cmd test
.\mvnw.cmd package
```

## Run the integrated application locally

Executed successfully (Phase 10), with the backend environment above set for the backend process only:

```text
cd backend
java -jar target\backend-0.0.1-SNAPSHOT.jar        # listens on http://localhost:8080

cd frontend
$env:VITE_API_BASE_URL = "http://localhost:8080/api"   # PowerShell; or copy .env.example to .env (ignored by Git)
npm run dev -- --host localhost --port 5173 --strictPort   # http://localhost:5173
```

The frontend must be served from `FRONTEND_ORIGIN` (CORS). Phase 10 verified the member and admin flows over HTTP against the running backend and MySQL (see `PROJECT_STATUS.md`); the browser UI itself was not driven by automation.

## Scaffold note

Spring Initializr no longer directly generates Spring Boot 3.5.16 (supported range is now >=4.0.0). A supported scaffold version (4.0.8) was used only to obtain the project structure and Maven Wrapper; `backend/pom.xml` was then pinned to 3.5.16. The final verified project remains Spring Boot 3.5.16.

## Remaining Open Infrastructure Issue

- production MySQL deployment (assignment requires Render MySQL; free feasibility UNRESOLVED)

