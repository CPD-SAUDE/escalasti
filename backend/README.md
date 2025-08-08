# Backend do Sistema de Escala de Sobreaviso

Este é o backend da aplicação de escala de sobreaviso, construído com Node.js, Express e SQLite.

## Estrutura do Projeto

- `controllers/`: Contém a lógica de negócio para cada recurso (profissionais, escala, histórico, configuração).
- `database/`: Contém o arquivo de conexão com o banco de dados SQLite.
- `routes/`: Define as rotas da API para cada recurso.
- `scripts/`: Scripts utilitários, como o de inicialização do banco de dados.
- `server.js`: O arquivo principal do servidor Express.
- `package.json`: Define as dependências e scripts do projeto.

## Requisitos

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Como Rodar

1.  **Navegue até o diretório `backend`**:
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências**:
    \`\`\`bash
    npm install
    \`\`\`

3.  **Inicialize o banco de dados**:
    Este script criará o arquivo `database.sqlite` (se não existir) e as tabelas necessárias.
    \`\`\`bash
    npm run init-db
    \`\`\`

4.  **Inicie o servidor**:
    \`\`\`bash
    npm start
    \`\`\`
    O servidor estará rodando em `http://localhost:3001`.

    Para desenvolvimento com recarregamento automático (hot-reload), você pode usar:
    \`\`\`bash
    npm run dev
    \`\`\`

## Endpoints da API

A API está disponível em `http://localhost:3001/api`.

### Profissionais (`/api/professionals`)

-   `GET /api/professionals`: Retorna todos os profissionais.
-   `POST /api/professionals`: Adiciona um novo profissional.
    -   Corpo da requisição (JSON): `{ "name": "Nome do Profissional", "color": "#HEXCOLOR" }`
-   `PUT /api/professionals/:id`: Atualiza um profissional existente.
    -   Corpo da requisição (JSON): `{ "name": "Novo Nome", "color": "#NOVOHEXCOLOR" }`
-   `DELETE /api/professionals/:id`: Exclui um profissional.

### Escala (`/api/schedule`)

-   `GET /api/schedule/:year/:month`: Retorna a escala para um mês e ano específicos.
-   `POST /api/schedule`: Adiciona ou atualiza uma entrada na escala.
    -   Corpo da requisição (JSON): `{ "date": "YYYY-MM-DD", "professionalId": "ID_DO_PROFISSIONAL" }`

### Histórico (`/api/history`)

-   `GET /api/history`: Retorna todas as entradas do histórico.
-   `POST /api/history`: Adiciona uma nova entrada ao histórico.
    -   Corpo da requisição (JSON): `{ "date": "YYYY-MM-DD", "description": "Descrição do evento" }`
-   `DELETE /api/history/:id`: Exclui uma entrada do histórico.

### Configuração (`/api/config`)

-   `GET /api/config`: Retorna as configurações atuais.
-   `POST /api/config`: Atualiza as configurações.
    -   Corpo da requisição (JSON): `{ "backendIp": "192.168.1.100" }` (exemplo)

### Status (`/api/status`)

-   `GET /api/status`: Retorna o status do backend e da conexão com o banco de dados.

## Banco de Dados

O banco de dados é um arquivo SQLite (`database.sqlite`) localizado no diretório `backend/database`. Ele é inicializado automaticamente pelo script `init-database.js` quando você executa `npm run init-db`.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.
