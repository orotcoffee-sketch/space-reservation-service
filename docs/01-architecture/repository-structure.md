# Repository Structure

Current structure (after Phase 9 integration):

```text
frontend/   React + Vite (JavaScript) application, deployed to Vercel
  package.json, package-lock.json, vite.config.js, index.html, vercel.json
  .env.example   (VITE_API_BASE_URL)
  src/
    main.jsx, App.jsx (React Router routes), index.css, hooks.js, time.js
    api/          client.js (fetch wrapper, error mapping), endpoints.js
    auth/         AuthProvider.jsx, RequireAuth.jsx, authContext.js
    components/   Layout.jsx, Status.jsx
    pages/        Login, Register, SpaceList, SpaceDetail, ReservationConfirm,
                  MyReservations, ReservationDetail
    pages/admin/  AdminSpaces, AdminSpaceForm, AdminReservations
backend/    Spring Boot 3.5.16 application (Maven Wrapper), deployed to Render
  pom.xml, mvnw, mvnw.cmd, .mvn/, Dockerfile, .dockerignore
  db/local-setup.sql   (local database/user setup template; no real password)
  src/main/java/com/spacereservation/backend/
    BackendApplication.java
    auth/          AuthController, AuthService, AuthDtos, JwtService
    member/        Member, MemberRepository, Role
    space/         SpaceController, AdminSpaceController, SpaceService, SpaceDtos, Space, SpaceRepository
    reservation/   ReservationController, AdminReservationController, ReservationService,
                   ReservationRules, ReservationDtos, Reservation, ReservationRepository, ReservationStatus
    config/        SecurityConfig, AppProperties, AdminBootstrap
    common/        ApiException, ErrorCode, ErrorResponse, GlobalExceptionHandler
  src/main/resources/  application.properties, db/migration/V1__core_schema.sql (Flyway)
  src/test/            BackendApplicationTests, ReservationApiTests, application-test.properties
docs/       project documentation
```

Backend layering follows `dependency-rules.md`: controllers delegate to services; reservation business rules live in `ReservationRules` and `ReservationService`.

Frontend and backend must remain independently buildable.
