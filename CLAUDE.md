# CLAUDE.md — Operational Contract

## Project stack

- Frontend: React
- Backend: Spring Boot
- Database: MySQL (must not be replaced without explicit approval)
- Version control: Git / GitHub
- Frontend deployment: Vercel
- Backend deployment: Render

Versions, application domain, auth, and production MySQL host are OPEN. See `PROJECT_STATUS.md`.

## Mandatory workflow

For every task:

1. Read `PROJECT_STATUS.md`.
2. Read only documentation relevant to the task.
3. Inspect affected files.
4. State internally the minimum change scope.
5. Implement only that scope.
6. Run applicable verification.
7. Fix failures caused by the change.
8. Update documentation if architecture/contracts changed.
9. Update `PROJECT_STATUS.md`.

## Modification rules

Do not:

- perform unrelated refactors,
- replace technologies without instruction,
- delete working code to solve a local problem,
- suppress failing tests,
- weaken validation merely to make tests pass,
- expose secrets,
- invent API/database contracts,
- silently resolve OPEN decisions (record them as OPEN or BLOCKED).

## Evidence rule

Prefer, in order:

1. executable verification,
2. repository configuration,
3. source code,
4. official documentation,
5. assumptions only when explicitly marked.

Never report PASS without executing the corresponding check.
