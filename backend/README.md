# Backend do Sistema de Escala de Sobreaviso

Este é o backend da aplicação, construído com Node.js e Express.js, utilizando SQLite como banco de dados.

## Estrutura de Pastas

*   `controllers/`: Contém a lógica de negócio para cada rota da API.
*   `database/`: Gerencia a conexão e as operações com o banco de dados SQLite.
*   `routes/`: Define as rotas da API e as associa aos controladores.
*   `scripts/`: Scripts utilitários, como `get-network-ip.js` para obter o IP da máquina e `init-database.js` para inicializar as tabelas do banco de dados.
*   `server.js`: O arquivo principal que inicializa o servidor Express.

## Como Rodar Localmente (sem Docker)

**Pré-requisitos:**

*   Node.js (versão 18 ou superior) e npm instalados.

1.  **Navegue até a pasta `backend`:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Inicialize o Banco de Dados (Opcional, mas recomendado na primeira vez):**
    Este script garante que as tabelas necessárias sejam criadas no arquivo `database.db`.
    \`\`\`bash
    npm run init-db
    \`\`\`
    (Este comando executa `node scripts/init-database.js`)

4.  **Inicie o Servidor:**
    \`\`\`bash
    npm start
    \`\`\`
    O servidor estará rodando em `http://localhost:3001`.

## Rotas da API

As rotas da API são definidas na pasta `routes/` e manipuladas pelos `controllers/`.

*   **Status:**
    *   `GET /api/status`: Retorna o status do servidor.

*   **Profissionais:**
    *   `GET /api/professionals`: Lista todos os profissionais.
    *   `POST /api/professionals`: Adiciona um novo profissional.
    *   `PUT /api/professionals/:id`: Atualiza um profissional existente.
    *   `DELETE /api/professionals/:id`: Remove um profissional.

*   **Escalas:**
    *   `GET /api/schedule/:year/:month`: Obtém a escala de um mês/ano específico.
    *   `POST /api/schedule`: Salva a escala de um mês/ano.

*   **Histórico:**
    *   `GET /api/history`: Lista o histórico de escalas salvas.
    *   `POST /api/history`: Salva uma escala no histórico.
    *   `GET /api/history/:id`: Obtém uma escala específica do histórico.
    *   `DELETE /api/history/:id`: Remove uma entrada do histórico.

*   **Configurações:**
    *   `GET /api/config`: Obtém as configurações do sistema (nome da empresa, departamento, etc.).
    *   `PUT /api/config`: Atualiza as configurações do sistema.

## Banco de Dados

O banco de dados é um arquivo SQLite chamado `database.db` que será criado na raiz da pasta `backend`. Ele contém as tabelas para `professionals`, `schedules`, `history` e `config`.

## Scripts Úteis

*   `npm run init-db`: Executa o script para inicializar as tabelas do banco de dados.
*   `npm start`: Inicia o servidor Express.
