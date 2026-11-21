# Multi-stage Dockerfile for LÉARGAS Java Spring Boot Backend
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies in separate layer
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S leargas && adduser -S leargas -G leargas
RUN mkdir -p /app/uploads && chown -R leargas:leargas /app
USER leargas
COPY --from=builder /app/target/leargas-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "/app/app.jar"]
