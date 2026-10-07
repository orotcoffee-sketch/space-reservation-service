# ADR-0002 — Toolchain

Status:
ACCEPTED

## Context

The assignment stack is fixed (React, Spring Boot, MySQL, Git/GitHub, Vercel, Render). Local tooling versions must be locked so every session and machine builds the same way.

## Decision

- Node.js 24.21.0 and npm 11.19.0 (already installed; approved; do not reinstall or upgrade)
- React with Vite 8.x (not Create React App)
- Java 21 LTS, full JDK; preferred distribution Eclipse Temurin JDK 21
- Spring Boot 3.5.16 (no silent move to 4.x; downgrade only for a verified compatibility blocker)
- Maven with Maven Wrapper (`mvnw`, `mvnw.cmd`, `.mvn/`)
- MySQL 8.4 LTS; local target MySQL Community Server 8.4.11
- Business timezone `Asia/Seoul` (see BR-014)

## Rationale

- Assignment technologies are unchanged; the tools above only support the fixed stack.
- LTS/stable versions are preferred.
- Maven Wrapper pins the Maven version inside the repository, improving reproducibility; no global Maven is required.
- Node/npm are already installed and compatible with Vite 8.x.
- MySQL remains mandatory; no substitute engine is acceptable.

## Alternatives

- Gradle: rejected (Maven chosen; Gradle is not installed or used).
- MariaDB, PostgreSQL, SQLite as MySQL substitutes: rejected.
- Spring Boot 4.x: not approved.
- Create React App: rejected.
- MySQL 8.0 for easier installer availability: rejected.

## Consequences

- JDK 21 and MySQL 8.4.11 are not yet installed; installation is a separate controlled phase (`docs/05-operations/toolchain-installation.md`).
- The toolchain is not fully operational until those are installed and verified.
- Production MySQL on Render remains OPEN (see ADR-0001).
