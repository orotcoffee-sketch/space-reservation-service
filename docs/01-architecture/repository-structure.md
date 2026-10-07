# Repository Structure

Current structure (Phase 6):

```text
frontend/   React + Vite (JavaScript) application
  package.json, package-lock.json, vite.config.js, index.html
  src/        main.jsx, App.jsx, index.css
  public/     favicon.svg
  .env.example
backend/    Spring Boot 3.5.16 application (Maven Wrapper)
  pom.xml, mvnw, mvnw.cmd, .mvn/
  src/main/java/com/spacereservation/backend/BackendApplication.java
  src/test/java/com/spacereservation/backend/BackendApplicationTests.java
docs/       project documentation
```

Only the generated bootstrap application and test exist; no application features are implemented.

Frontend and backend must remain independently buildable.
