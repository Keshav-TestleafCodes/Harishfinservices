# ── Stage 1: Build ──────────────────────────────────────────
FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /app
COPY pom.xml .
# Download dependencies first (layer-cached)
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn clean package -DskipTests -q

# ── Stage 2: Run ────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create upload dir
RUN mkdir -p /tmp/finfolio-uploads

COPY --from=build /app/target/*.jar app.jar

# Render sets PORT automatically; default 8080
EXPOSE 8080

# Activate the prod Spring profile
ENTRYPOINT ["java", \
  "-Dspring.profiles.active=prod", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
