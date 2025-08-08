# Backend do Sistema de Escala de Sobreaviso

Este é o backend da aplicação de escala de sobreaviso, construído com Node.js e Express.js, utilizando SQLite como banco de dados.

## Estrutura do Projeto

\`\`\`
.
├── controllers/      # Lógica de negócio para as rotas
├── database/         # Configuração do banco de dados SQLite
├── routes/           # Definição das rotas da API
├── scripts/          # Scripts de inicialização (ex: init-database.js)
├── server.js         # Ponto de entrada do servidor
└── package.json      # Dependências do backend
\`\`\`

## Tecnologias Utilizadas

-   **Node.js:** Ambiente de execução JavaScript.
-   **Express.js:** Framework web para Node.js.
-   **SQLite:** Banco de dados leve e sem servidor.
-   **`better-sqlite3`:** Driver SQLite síncrono e rápido para Node.js.
-   **`cors`:** Middleware para habilitar Cross-Origin Resource Sharing.
-   **`dotenv`:** Para carregar variáveis de ambiente de um arquivo `.env`.

## Como Rodar Localmente

1.  **Navegue até a pasta `backend`:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Inicialize o banco de dados:**
    Este script cria o arquivo `database.sqlite` e as tabelas necessárias se elas não existirem.
    \`\`\`bash
    npm run init-db
    \`\`\`

4.  **Inicie o servidor:**
    \`\`\`bash
    npm start
    \`\`\`
    O servidor estará rodando em `http://localhost:3001`.

## Endpoints da API

A API está disponível em `http://localhost:3001/api`.

### Configurações (`/api/config`)

-   `GET /api/config`: Obtém as configurações atuais (feriados, etc.).
-   `POST /api/config`: Atualiza as configurações.

### Profissionais (`/api/professionals`)

-   `GET /api/professionals`: Lista todos os profissionais.
-   `GET /api/professionals/:id`: Obtém um profissional específico.
-   `POST /api/professionals`: Adiciona um novo profissional.
-   `PUT /api/professionals/:id`: Atualiza um profissional existente.
-   `DELETE /api/professionals/:id`: Remove um profissional.

### Escalas (`/api/schedule`)

-   `GET /api/schedule/:year/:month`: Obtém a escala para um mês e ano específicos.
-   `POST /api/schedule`: Adiciona ou atualiza uma entrada na escala.
-   `DELETE /api/schedule/:id`: Remove uma entrada da escala.

### Histórico (`/api/history`)

-   `GET /api/history`: Lista todas as entradas do histórico.
-   `GET /api/history/:year/:month`: Obtém o histórico para um mês e ano específicos.
-   `POST /api/history`: Adiciona uma nova entrada ao histórico.

## Variáveis de Ambiente

O backend utiliza variáveis de ambiente, que podem ser definidas em um arquivo `.env` na raiz da pasta `backend`.

-   `PORT`: Porta em que o servidor Express será executado (padrão: `3001`).
-   `DATABASE_PATH`: Caminho para o arquivo do banco de dados SQLite (padrão: `./database/database.sqlite`).

Exemplo de `.env`:
\`\`\`
PORT=3001
DATABASE_PATH=./database/database.sqlite
\`\`\`

## Docker

Este backend é projetado para ser executado em um contêiner Docker. Consulte o `Dockerfile` na raiz da pasta `backend` e o `docker-compose.yml` na raiz do projeto para detalhes sobre a conteinerização.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.
