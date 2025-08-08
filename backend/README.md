# Backend do Sistema de Escala de Sobreaviso

Este é o backend da aplicação de escala de sobreaviso, construído com Node.js e Express.js, utilizando SQLite como banco de dados.

## Estrutura do Projeto

\`\`\`
backend/
├── controllers/      # Lógica de negócio para as rotas
├── database/         # Configuração do banco de dados SQLite
├── routes/           # Definição das rotas da API
├── scripts/          # Scripts de inicialização (ex: init-database.js)
├── server.js         # Ponto de entrada do servidor
└── package.json      # Dependências do backend
\`\`\`

## Como Rodar Localmente (sem Docker)

1.  **Navegue até a pasta do backend:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install --force
    \`\`\`

3.  **Inicialize o banco de dados:**
    Este script cria o arquivo `database.db` e as tabelas necessárias se elas não existirem.
    \`\`\`bash
    npm run init-db
    \`\`\`

4.  **Inicie o servidor de desenvolvimento:**
    \`\`\`bash
    npm run dev
    \`\`\`
    O servidor estará rodando em `http://localhost:3001`.

## Endpoints da API

A API está disponível em `http://localhost:3001/api`.

### Profissionais

-   \`GET /api/professionals\`: Retorna todos os profissionais cadastrados.
-   \`POST /api/professionals\`: Adiciona um novo profissional.
    \`\`\`json
    {
        "name": "Nome do Profissional",
        "color": "#HEXCOLOR"
    }
    \`\`\`
-   \`PUT /api/professionals/:id\`: Atualiza um profissional existente.
    \`\`\`json
    {
        "name": "Novo Nome",
        "color": "#NEWHEXCOLOR"
    }
    \`\`\`
-   \`DELETE /api/professionals/:id\`: Remove um profissional.

### Escala

-   \`GET /api/schedule/:year/:month\`: Retorna a escala para um mês e ano específicos.
-   \`POST /api/schedule\`: Adiciona ou atualiza uma entrada na escala.
    \`\`\`json
    {
        "date": "YYYY-MM-DD",
        "professionalId": 123
    }
    \`\`\`
    (Se `professionalId` for `null`, remove a atribuição para a data.)

### Histórico

-   \`GET /api/history\`: Retorna todas as entradas do histórico.
-   \`POST /api/history\`: Adiciona uma nova entrada ao histórico.
    \`\`\`json
    {
        "date": "YYYY-MM-DD",
        "description": "Descrição do evento"
    }
    \`\`\`

### Configurações

-   \`GET /api/config\`: Retorna as configurações atuais (ex: IP do backend).
-   \`POST /api/config\`: Atualiza as configurações.
    \`\`\`json
    {
        "backendIp": "192.168.1.100"
    }
    \`\`\`

## Banco de Dados (SQLite)

O banco de dados é um arquivo SQLite (`database.db`) localizado na pasta `backend/database`. Ele é criado e inicializado pelo script `scripts/init-database.js`.

## Dependências

As dependências estão listadas no `package.json` e incluem:
-   `express`: Framework web para Node.js.
-   `sqlite3` ou `better-sqlite3`: Driver para SQLite.
-   `cors`: Middleware para habilitar Cross-Origin Resource Sharing.
-   `nodemon` (dev): Para reiniciar o servidor automaticamente durante o desenvolvimento.
-   `dotenv` (dev): Para carregar variáveis de ambiente de um arquivo `.env`.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.
