# Sistema de Gerenciamento de Tarefas

## Objetivo do Projeto
Este projeto demonstra a construção de um sistema de gerenciamento de tarefas pessoais, com foco em uma arquitetura robusta e escalável, utilizando as melhores práticas do mercado. O objetivo é criar uma aplicação full stack para que usuários possam criar, visualizar, atualizar e deletar suas tarefas, organizadas por categorias.

## Arquitetura Adotada
A aplicação é baseada na **Arquitetura Hexagonal (Ports & Adapters)**, garantindo um baixo acoplamento entre o domínio do negócio e as tecnologias de infraestrutura.
-   **Domínio (Core do Negócio)**: Contém as entidades, regras de negócio e as interfaces (Ports) que definem como o domínio interage com o mundo exterior.
-   **Aplicação (Use Cases)**: Orquestra o domínio para executar as funcionalidades do negócio.
-   **Infraestrutura (Adapters)**: Implementa as interfaces do domínio para se conectar a adaptadores como banco de dados (JPA/Hibernate) e a camada de apresentação (REST Controllers).

## Tecnologias Utilizadas
-   **Backend**: Java 17, Spring Boot 3, Spring Data JPA, H2 (para desenvolvimento), PostgreSQL (para produção), JWT.
-   **Frontend**: Angular 16+, TypeScript, HTML, CSS.
-   **DevOps**: Docker, Docker Compose, GitHub Actions.

## Estrutura do Projeto
-   `/backend`: Contém toda a aplicação Spring Boot, seguindo a Arquitetura Hexagonal.
-   `/frontend`: Contém a aplicação Angular.
-   `/docker`: Arquivos de configuração para o Docker Compose, incluindo o banco de dados.
-   `/.github/workflows`: Configuração do pipeline de CI/CD.

## Como Rodar o Projeto

### Pré-requisitos
-   [Docker e Docker Compose](https://docs.docker.com/get-docker/) instalados.
-   [JDK 17](https://www.oracle.com/java/technologies/downloads/#jdk17-mac) instalado (opcional, para rodar localmente).
-   [Node.js e npm](https://nodejs.org/) instalados (opcional, para rodar localmente).

### Com Docker Compose
1.  Clone este repositório:
    `git clone https://github.com/edicarneiro/task-manager.git`
2.  Navegue até o diretório do projeto:
    `cd task-manager`
3.  Inicie os containers:
    `docker-compose up --build`
4.  A aplicação estará disponível em `http://localhost:4200` (frontend) e a API em `http://localhost:8080/api`.

