# 📋 Sistema de Gestão de Clientes

Sistema fullstack desenvolvido como prova técnica, com funcionalidades de CRUD de clientes, emissão de relatórios e autenticação de usuários.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Backend | Java 17 + Spring Boot |
| Frontend | React + Vite (Node 20) |
| Banco de Dados | PostgreSQL 16 |
| Containerização | Docker + Docker Compose |
| Build | Maven |

---

## 📁 Estrutura do Projeto

```
projeto/
├── api/                        # Backend Spring Boot
│   ├── src/
│   ├── target/
│   ├── pom.xml
│   └── Dockerfile
├── app/
│   └── prova-app/              # Frontend React
│       ├── src/
│       ├── package.json
│       └── Dockerfile (em app/)
├── database/
│   └── init.sql                # Script de inicialização do banco
├── docker-compose.yml
└── README.md
```

---

## 🔐 Acesso ao Sistema

| Campo | Valor |
|-------|-------|
| Identificador do Usuário | `123` |
| Senha | `User@1234` |

---

## 🗄️ Banco de Dados

**Schema:** `cliente_schema`  
**Tabela principal:** `cliente`

```sql
CREATE SCHEMA IF NOT EXISTS cliente_schema;

CREATE TABLE IF NOT EXISTS cliente_schema.cliente (
    codigo      SERIAL          PRIMARY KEY,
    nome        VARCHAR(40)     NOT NULL,
    cnpj        VARCHAR(14)     NOT NULL UNIQUE,
    rg          VARCHAR(17)     NOT NULL UNIQUE,
    nascimento  DATE,
    endereco    VARCHAR(40)     NOT NULL,
    complemento VARCHAR(20),
    bairro      VARCHAR(20)     NOT NULL,
    cep         INTEGER,
    cidade      VARCHAR(20)     NOT NULL,
    uf          VARCHAR(2)      NOT NULL,
    telefone    VARCHAR(13),
    celular     VARCHAR(15),
    observacao  VARCHAR(150)
);
```

**Credenciais do banco (Docker):**

| Parâmetro | Valor |
|-----------|-------|
| Host | `localhost:5432` |
| Database | `prova_db` |
| Usuário | `admin` |
| Senha | `agape123` |

---

## 🚀 Como Executar

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados
- [Java 17](https://adoptium.net/) (para build local)
- [Maven](https://maven.apache.org/) (para build local)

---

### ▶️ Opção 1 — Executar com Docker Compose (Recomendado)

#### 1. Gerar o `.jar` do backend

Antes de subir os containers, é necessário compilar o projeto:

```bash
mvn clean install -DskipTests
```

> O arquivo `app.jar` será gerado em `api/target/`.

#### 2. Subir todos os containers

```bash
docker compose up --build
```

Isso irá inicializar:
- 🐘 **PostgreSQL** — porta `5432`
- ☕ **Backend (Spring Boot)** — porta `8080`
- ⚛️ **Frontend (React/Vite)** — porta `5173`

#### 3. Acessar o sistema

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend (API) | http://localhost:8080 |

---

### ▶️ Opção 2 — Executar localmente (sem Docker)

#### Backend

```bash
cd api
mvn clean install -DskipTests
mvn spring-boot:run
```

#### Frontend

```bash
cd app/prova-app
npm install
npm run dev
```

---

## 🐳 Configuração Docker

### `docker-compose.yml`

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    container_name: cliente_postgres
    restart: always
    environment:
      POSTGRES_DB: prova_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: agape123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - cliente_network

  backend:
    build: ./api
    container_name: cliente_backend
    restart: always
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - cliente_network

  frontend:
    build: ./app
    container_name: cliente_frontend
    restart: always
    ports:
      - "5173:5173"
    depends_on:
      - backend
    networks:
      - cliente_network

networks:
  cliente_network:
    driver: bridge

volumes:
  postgres_data:
```

### `Dockerfile` — Backend (`api/Dockerfile`)

```dockerfile
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### `Dockerfile` — Frontend (`app/Dockerfile`)

```dockerfile
FROM node:20
WORKDIR /app
COPY prova-app/package*.json ./
RUN npm install
COPY prova-app .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

---

## ✅ Funcionalidades

- 🔐 **Autenticação** — Login com identificador e senha
- 👥 **CRUD de Clientes** — Cadastro, listagem, edição e exclusão
- 📄 **Emissão de Relatórios** — Geração de relatórios dos clientes cadastrados

---

## 🔧 Comandos Úteis

```bash
# Build do projeto (gera o .jar)
mvn clean install -DskipTests

# Subir os containers com rebuild
docker compose up --build

# Subir os containers em background
docker compose up -d --build

# Parar os containers
docker compose down

# Ver logs dos containers
docker compose logs -f

# Remover containers e volumes
docker compose down -v
```

---

## ⚠️ Observações

- O script `database/init.sql` é executado automaticamente pelo PostgreSQL na primeira inicialização do container.
- Caso o banco já esteja inicializado (volume existente), o script não será reexecutado. Para reinicializar, execute `docker compose down -v` antes de subir novamente.
- O frontend utiliza Vite em modo desenvolvimento com a flag `--host` para ser acessível fora do container.
