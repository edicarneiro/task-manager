# Usa uma imagem base oficial do OpenJDK com a versão 17
FROM openjdk:17-jdk-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de build do Maven para o container
# Isso aproveita o cache do Docker, acelerando builds subsequentes
COPY pom.xml .
COPY mvnw .
COPY .mvn ./.mvn

# Copia todos os arquivos do projeto
COPY src ./src

# Empacota a aplicação em um arquivo JAR usando Maven
RUN ./mvnw clean package -DskipTests

# Expõe a porta 8080 para a aplicação
EXPOSE 8080

# Comando para rodar a aplicação quando o container é iniciado
ENTRYPOINT ["java", "-jar", "target/task-manager-0.0.1-SNAPSHOT.jar"]