# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace

# Resolve dependencies first so this layer is cached until pom.xml changes.
# `sh mvnw` avoids depending on the executable bit of the wrapper script.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN sh mvnw -B -q dependency:go-offline

COPY src/ src/
RUN sh mvnw -B -DskipTests package \
    && cp target/backend-*.jar /workspace/app.jar

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN groupadd --system app && useradd --system --gid app --no-create-home app
COPY --from=build --chown=app:app /workspace/app.jar app.jar
USER app

# Render injects PORT; default to 8080 for local runs.
# All configuration (datasource, JWT, etc.) must come from runtime environment variables.
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java -XX:MaxRAMPercentage=75 -Dserver.port=${PORT} -jar app.jar"]
