# ADR-0001 — Project Foundation

Status:
ACCEPTED

## Context

A new full-stack web application is starting. The stack is fixed by the assignment, and development will use VS Code and Claude Code across multiple sessions.

## Decision

- Stack: React (Vercel), Spring Boot (Render), MySQL (assignment requirement: Render MySQL; free-tier feasibility UNRESOLVED), Git/GitHub.
- MySQL remains the database engine; it is not replaced by PostgreSQL.
- Use repository-driven harness engineering: project facts, contracts, and status live in repository documents (`CLAUDE.md`, `PROJECT_STATUS.md`, `docs/`), not in conversation memory.

## Alternatives

- Relying on conversation context only: rejected; sessions cannot resume deterministically.
- Switching to PostgreSQL for free hosting: rejected; violates the fixed stack without approval.

## Consequences

- Unresolved decisions (domain, versions, auth, MySQL host) stay recorded as OPEN.
- Every task updates `PROJECT_STATUS.md`.
- Free-tier MySQL hosting must be decided separately.

## Verification

Phase 0 checks: required files exist, no application code, no secrets, MySQL retained, MySQL hosting marked OPEN.
