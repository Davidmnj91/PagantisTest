FROM maven:3.6.3-openjdk-11-slim as MAVEN_BUILD
COPY pom.xml ./
COPY src ./src/

RUN mvn package


FROM openjdk:11-jdk-slim
WORKDIR /app

COPY --from=MAVEN_BUILD ./target/pagantis*.jar pagantis.jar

EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "./pagantis.jar"]