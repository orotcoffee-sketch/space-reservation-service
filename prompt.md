# PHASE 3 — SCREEN FLOW, LOGICAL DATA MODEL AND BASELINE CHECKPOINT

## HIGHEST PRIORITY — ASSIGNMENT FIXED STACK

The assignment stack is fixed:

Frontend:
- React

Backend:
- Spring Boot

Database:
- MySQL

Version Control:
- Git
- GitHub

Deployment:
- Frontend: Vercel
- Backend: Render
- Database requirement: Render MySQL

Do not replace any of these technologies.

Supporting tools may only support the fixed stack.

---

# 1. PRODUCT BASELINE

Approved product:

`Space Reservation Service`

Access model:

`Registered members only`

Roles:

- MEMBER
- ADMIN

Core rule:

`The same space cannot have overlapping active reservations.`

Do not expand the application beyond the approved MVP.

---

# 2. PRODUCT DECISIONS FOR PHASE 3

Use the following planning decisions.

## Authentication Direction

Plan for:

`JWT-based authentication`

Reason:

The frontend and backend will be separately deployed and communicate through REST APIs.

Do NOT implement JWT yet.

Do NOT select JWT libraries yet.

Do NOT generate security code yet.

---

## Reservation Time Granularity

Use:

`30-minute intervals`

Examples:

09:00  
09:30  
10:00  
10:30

Start/end time must follow the interval rule.

---

## Reservation Date Rule

For MVP:

- one reservation must start and end on the same calendar date,
- overnight reservations are OUT OF SCOPE.

Do not support multi-day reservations.

---

## Past Reservations

Past reservations remain visible in reservation history.

Past reservations:

- may be viewed,
- may NOT be modified,
- may NOT be cancelled.

---

## Member Profile

Profile editing is OUT OF MVP.

A member account only needs the minimum information required for:

- registration,
- login,
- ownership of reservations.

Do not add address, profile image, social account or unnecessary personal fields.

---

## Reservation Status

Use only:

- CONFIRMED
- CANCELLED

Do not add COMPLETED, PENDING, REJECTED or other states unless future requirements require them.

Whether a reservation is past or upcoming should be derived from its date/time rather than stored as another status.

---

# 3. GOOGLE STITCH DESIGN RULE

The visual design source for this project will be:

`Google Stitch`

Therefore:

DO NOT create a custom visual design system during this phase.

DO NOT decide:

- colors,
- typography,
- visual spacing system,
- card style,
- button style,
- illustration style,
- page aesthetics.

Phase 3 should define only:

- required screens,
- purpose of each screen,
- information displayed,
- user actions,
- navigation relationships,
- data required by each screen.

Later, Google Stitch output will be used as the visual implementation reference.

React implementation should adapt the Stitch design to the approved product architecture rather than redesigning it arbitrarily.

Record this rule in project documentation.

---

# 4. READ FIRST

Read:

- `CLAUDE.md`
- `PROJECT_STATUS.md`
- `README.md`
- `docs/00-project/requirements.md`
- `docs/00-project/mvp-scope.md`
- `docs/00-project/business-rules.md`
- `docs/00-project/constraints.md`
- `docs/01-architecture/system-context.md`
- `docs/01-architecture/dependency-rules.md`
- `docs/03-data/database-rules.md`
- `docs/05-operations/local-development.md`

Do not reread unrelated documents unless necessary.

---

# 5. PRE-PHASE DOCUMENT INTEGRITY CHECK

Before adding Phase 3 documentation, inspect the files modified during Phase 1 and Phase 2.

Pay special attention to:

`docs/05-operations/local-development.md`

Check for:

- duplicate headings,
- duplicate table headers,
- repeated old/new sections,
- malformed Markdown,
- incomplete lines,
- stale OPEN values already resolved,
- contradictory project status.

Also inspect:

- `PROJECT_STATUS.md`
- `docs/00-project/requirements.md`
- `README.md`

Repair only confirmed documentation defects.

Do not rewrite valid documentation merely for style.

Do not remove historical facts that are still relevant.

---

# 6. INITIAL GIT CHECKPOINT

The repository currently has no commits.

Before Phase 3 planning changes are added:

1. inspect `git status`,
2. verify no secrets are included,
3. verify `.env` files containing secrets are ignored,
4. verify the current Phase 0–2 governance/product documentation is internally consistent.

If safe:

Create the initial Git commit.

Commit message:

`chore: establish project foundation and product scope`

Do NOT create a GitHub remote.

Do NOT push.

After the commit, confirm the branch remains:

`main`

If anything unexpected exists in the working tree, stop and report instead of blindly committing.

---

# 7. SCREEN FLOW DOCUMENT

Create:

`docs/01-architecture/screen-flow.md`

This document defines functional screens only.

Do not define visual styling.

Use the following screen inventory.

## Public

### Login

Purpose:
Authenticate an existing member or administrator.

Actions:

- enter credentials
- login
- navigate to registration

### Registration

Purpose:
Create a MEMBER account.

Important:

Public registration must create MEMBER accounts only.

Users must NOT be able to self-register as ADMIN.

---

## MEMBER

### Space List

Purpose:
Browse active reservable spaces.

Required information:

- space name
- location
- capacity
- optional representative image
- active availability context where applicable

Actions:

- open space detail

Do not build complex search/filter behavior yet.

---

### Space Detail

Purpose:
Inspect a space and begin reservation.

Required information:

- name
- description
- location
- capacity
- representative image if available
- reservation date selector
- available time information

Actions:

- choose date
- choose start/end time
- request reservation

---

### Reservation Confirmation

Purpose:
Review selected reservation information before final submission.

Display:

- space
- date
- start time
- end time

Action:

- confirm reservation

This may later be implemented as a page or modal depending on the Google Stitch design.

Do not decide that visual implementation now.

---

### My Reservations

Purpose:
View the authenticated member's reservations.

Separate conceptually:

- upcoming
- past
- cancelled

These may be UI filters rather than separate backend statuses.

Actions for eligible upcoming CONFIRMED reservations:

- open detail
- modify
- cancel

Past reservations are read-only.

---

### Reservation Detail

Display:

- reservation identifier
- space information
- date
- start time
- end time
- status

Eligible actions:

- modify
- cancel

Only when business rules allow.

---

## ADMIN

### Admin Space Management

Purpose:
Manage spaces.

Actions:

- view spaces
- create space
- edit space
- activate/deactivate space

Do not permanently delete spaces in MVP.

Historical reservation references must remain valid.

---

### Admin Reservation Management

Purpose:
View reservations across all members and spaces.

Required information:

- reservation
- member
- space
- date
- time
- status

MVP action requirement:

View only.

Do NOT add arbitrary admin reservation editing unless explicitly required later.

---

# 8. NAVIGATION FLOW

Document the conceptual navigation.

Public:

```text
Login
 ├─ Registration
 └─ Successful login
       ↓
     Space List
```

Member:

```text
Space List
   ↓
Space Detail
   ↓
Reservation Confirmation
   ↓
Reservation Created
   ↓
My Reservations
   ↓
Reservation Detail
```

Admin:

```text
Login
   ↓
Admin Area
   ├─ Space Management
   └─ Reservation Management
```

Do not create React routes yet.

Document route concepts only.

---

# 9. LOGICAL DATA MODEL

Create:

`docs/03-data/logical-data-model.md`

This is a LOGICAL model.

Do NOT create SQL.

Do NOT create JPA entities.

Do NOT create migrations.

Use exactly three core entities unless evidence requires otherwise.

---

## MEMBER

Conceptual fields:

- id
- email
- password
- name
- role
- createdAt
- updatedAt

Rules:

- email must uniquely identify an account,
- password must never be stored as plaintext,
- public registration creates MEMBER role,
- ADMIN provisioning method remains implementation-specific for now.

Do not add unnecessary personal data.

---

## SPACE

Conceptual fields:

- id
- name
- description
- location
- capacity
- imageUrl
- active
- createdAt
- updatedAt

Rules:

- inactive spaces remain in historical data,
- inactive spaces cannot accept new reservations,
- spaces are deactivated rather than hard-deleted in MVP.

`imageUrl` may be optional.

---

## RESERVATION

Conceptual fields:

- id
- memberId
- spaceId
- reservationDate
- startTime
- endTime
- status
- createdAt
- updatedAt

Status values:

- CONFIRMED
- CANCELLED

Relationships:

MEMBER:

`1 → N RESERVATION`

SPACE:

`1 → N RESERVATION`

Each RESERVATION:

- belongs to exactly one MEMBER,
- belongs to exactly one SPACE.

---

# 10. RESERVATION OVERLAP RULE

Document the canonical overlap condition.

For the same space and same reservation date:

A new CONFIRMED reservation conflicts with an existing CONFIRMED reservation when:

```text
newStart < existingEnd
AND
newEnd > existingStart
```

Boundary cases:

Existing:
10:00–12:00

Allowed:

08:00–10:00  
12:00–14:00

Rejected:

09:00–11:00  
10:00–11:00  
11:00–13:00  
09:00–13:00

CANCELLED reservations do not participate in overlap blocking.

Do not implement this yet.

---

# 11. ADD BUSINESS RULES

Update:

`docs/00-project/business-rules.md`

Add only the confirmed rules below.

## BR-009

Reservations use 30-minute time intervals.

## BR-010

Reservation start and end must occur on the same calendar date.

## BR-011

Past reservations remain visible but cannot be modified or cancelled.

## BR-012

Public registration creates MEMBER accounts only.

## BR-013

Spaces are deactivated rather than permanently deleted during MVP operation.

Do not invent additional product rules.

---

# 12. UI DESIGN SOURCE DOCUMENTATION

Update:

`docs/00-project/constraints.md`

Record:

`Google Stitch is the visual UI reference source for the project.`

Clarify:

- architecture and functionality are defined in repository documentation,
- visual design will be based on Stitch output,
- Claude must not independently redesign approved Stitch screens without a functional reason,
- Stitch output must not override security, data integrity or business rules.

---

# 13. SCREEN ↔ DATA TRACEABILITY

Create:

`docs/01-architecture/screen-data-map.md`

Map each screen to only the data it requires.

Example structure:

```text
Screen
→ Required Entity/Data
→ Main Actions
```

The purpose is to prevent frontend screens from requesting unnecessary backend data.

Do not design API endpoints yet.

---

# 14. DATA MINIMIZATION CHECK

Before finishing verify that each field exists because at least one approved requirement or screen needs it.

If a field has no current use:

remove it from the logical model or mark it OPEN.

Do not create speculative fields for possible future features.

---

# 15. UPDATE PROJECT STATUS

Update `PROJECT_STATUS.md`.

Current Phase:

`PHASE 3 — SCREEN FLOW AND DATA MODEL PLANNING`

Current State:

`SCREEN_AND_DATA_MODEL_DEFINED`

Record:

Product:
`Space Reservation Service`

Authentication direction:
`JWT planned; implementation not started`

Reservation granularity:
`30 minutes`

Past reservation behavior:
`visible / read-only`

Profile editing:
`OUT OF MVP`

Visual design source:
`Google Stitch`

Core entities:

- MEMBER
- SPACE
- RESERVATION

Toolchain blockers must remain visible:

- JDK_REQUIRED
- MYSQL_LOCAL_REQUIRED
- Maven/Gradle unresolved

Next Approved Task:

`PHASE 4 — API CONTRACT AND AUTHENTICATION ARCHITECTURE`

Do not begin Phase 4.

---

# 16. DO NOT IMPLEMENT

During this phase DO NOT create:

- frontend/
- backend/
- React files
- Spring Boot files
- SQL
- database schema
- migrations
- controllers
- services
- repositories
- DTO classes
- authentication code
- API endpoints
- CSS
- UI components

Planning and documentation only.

---

# 17. FINAL VERIFICATION

Verify:

1. assignment stack remains unchanged,
2. Phase 0–2 documentation has no confirmed structural corruption,
3. initial Git baseline commit exists,
4. screen flow is documented,
5. logical data model is documented,
6. only MEMBER, SPACE and RESERVATION are core entities,
7. overlap rule is documented precisely,
8. Google Stitch is recorded as the visual design source,
9. no visual design system was invented,
10. no application implementation was created,
11. toolchain blockers remain recorded.

---

# 18. RESPONSE FORMAT

Return ONLY:

## PHASE RESULT

Status:
PASS / PASS_WITH_CONCERNS / FAIL / BLOCKED

## Baseline Commit

Commit:
Branch:

## Documentation Repair

State whether defects were found.

List exact files repaired only if necessary.

## Screen Model

List defined screens.

## Logical Data Model

Entities:
Relationships:

## Confirmed Product Decisions

Authentication:
Reservation Interval:
Past Reservations:
Profile Editing:
Reservation Status:
Visual Design Source:

## Files Created

List exact files.

## Files Modified

List exact files.

## Toolchain Blockers

List existing blockers only.

## Open Decisions

List only decisions still genuinely unresolved.

## Next Task

`PHASE 4 — API CONTRACT AND AUTHENTICATION ARCHITECTURE`

Do NOT begin Phase 4.