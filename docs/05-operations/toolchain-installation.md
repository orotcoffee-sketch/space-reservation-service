# Toolchain Installation Plan

Status: PLAN ONLY. Nothing in this document has been executed. Decisions: `docs/06-decisions/ADR-0002-toolchain.md`.

## Already Installed

Verified 2026-10-07 (Phase 5):

- Git 2.56.0.windows.1
- Node v24.21.0 (approved; do not reinstall/upgrade)
- npm 11.19.0 (approved; do not reinstall/upgrade)

## JDK Installation

Required:

- Eclipse Temurin JDK 21
- Windows x64
- JDK, not JRE

Winget discovery (2026-10-07, `winget search Temurin --source winget`): `EclipseAdoptium.Temurin.21.JDK` (listed version 21.0.12.101). The JRE package `EclipseAdoptium.Temurin.21.JRE` must NOT be used.

Installation must result in both of these working:

```text
java -version
javac -version
```

`JAVA_HOME` must point to the JDK installation directory. The exact path is recorded only after installation evidence exists.

## Maven

Global Maven installation: `NOT REQUIRED`

The future Spring Boot project must contain:

```text
mvnw
mvnw.cmd
.mvn/
```

The wrapper is the authoritative Maven runtime. Gradle is not used and must not be installed.

## MySQL Installation

Required:

- MySQL Community Server 8.4.11
- Windows x64 MSI
- MySQL Configurator
- Windows Service

Winget discovery (2026-10-07): `Oracle.MySQL` exists, but its newest 8.4 version is 8.4.9 (also 8.4.8, 8.4.6, and 8.0.x). It does not provide the 8.4.11 target, so the plan is: `Use official MySQL Community Server 8.4 MSI`. Do not substitute MySQL 8.0, MariaDB, PostgreSQL or SQLite.

No password is recorded in this document. The root password is chosen by the user at install time and kept out of Git.

Later verification requires:

```text
mysql --version
```

and confirmation that the MySQL Windows service is running.

The application database is NOT created in this phase.
