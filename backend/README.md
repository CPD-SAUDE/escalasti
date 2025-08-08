# Backend do Sistema de Escala de Sobreaviso

Este é o backend do sistema de escala de sobreaviso, construído com Node.js e Express.js, utilizando SQLite como banco de dados.

## Tecnologias Utilizadas

- Node.js
- Express.js
- SQLite3 (com `sqlite3` npm package)
- `cors` para lidar com requisições de diferentes origens
- `body-parser` para parsear corpos de requisição HTTP

## Estrutura de Pastas

- `controllers/`: Contém a lógica de negócio para cada rota da API.
- `database/`: Gerencia a conexão com o banco de dados SQLite e a inicialização do schema.
- `routes/`: Define as rotas da API e as associa aos controladores.
- `scripts/`: Scripts utilitários, como o de inicialização do banco de dados.
- `server.js`: O ponto de entrada principal do servidor Express.

## Como Rodar Localmente (para Desenvolvimento)

1.  **Navegue até a pasta `backend`:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Inicialize o banco de dados:**
    Este script criará o arquivo `database.sqlite` na pasta `backend/database` e configurará as tabelas necessárias.
    \`\`\`bash
    npm run init-db
    \`\`\`

4.  **Inicie o servidor:**
    \`\`\`bash
    npm start
    \`\`\`
    O servidor estará rodando em `http://localhost:3001`.

## Endpoints da API

O backend expõe os seguintes endpoints sob o prefixo `/api`:

-   **Configurações (`/api/config`)**
    -   `GET /api/config`: Obtém a configuração atual (ex: IP da rede).
    -   `POST /api/config`: Atualiza a configuração.

-   **Profissionais (`/api/professionals`)**
    -   `GET /api/professionals`: Lista todos os profissionais cadastrados.
    -   `POST /api/professionals`: Adiciona um novo profissional.
    -   `PUT /api/professionals/:id`: Atualiza um profissional existente.
    -   `DELETE /api/professionals/:id`: Remove um profissional.

-   **Escala (`/api/schedule`)**
    -   `GET /api/schedule/:year/:month`: Obtém a escala para um mês e ano específicos.
    -   `POST /api/schedule`: Adiciona ou atualiza uma entrada na escala para uma data.

-   **Histórico (`/api/history`)**
    -   `GET /api/history`: Lista todas as entradas do histórico.
    -   `POST /api/history`: Adiciona uma nova entrada ao histórico.

## Banco de Dados

O banco de dados é um arquivo SQLite (`database.sqlite`) localizado em `backend/database`. Ele é criado e inicializado pelo script `npm run init-db`.

## Variáveis de Ambiente

Atualmente, não há variáveis de ambiente críticas para o funcionamento do backend, mas você pode adicionar se precisar de configurações como portas, strings de conexão de DB externas, etc.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.
\`\`\`
