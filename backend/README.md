# Backend do Sistema de Escala de Sobreaviso

Este é o backend da aplicação de gerenciamento de escala de sobreaviso, construído com Node.js e Express, utilizando SQLite como banco de dados.

## Estrutura de Pastas

- `backend/`: Contém todo o código do servidor.
  - `controllers/`: Lógica de negócio para cada recurso (profissionais, escala, histórico, configurações).
  - `database/`: Configuração e inicialização do banco de dados SQLite.
  - `routes/`: Definição das rotas da API.
  - `scripts/`: Scripts utilitários (ex: `init-database.js` para criar tabelas).
  - `server.js`: Ponto de entrada principal do servidor.
  - `package.json`: Dependências e scripts do Node.js.
  - `.gitignore`: Arquivos e pastas a serem ignorados pelo Git.
  - `README.md`: Este arquivo.

## Como Rodar o Backend

1.  **Navegue até a pasta `backend`:**
    \`\`\`bash
    cd backend
    \`\`\`
2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`
3.  **Inicialize o banco de dados (se for a primeira vez):**
    \`\`\`bash
    npm run init-db
    \`\`\`
    Isso criará o arquivo `schedule.db` na pasta `backend/database/` e as tabelas necessárias.
4.  **Inicie o servidor:**
    \`\`\`bash
    npm start
    \`\`\`
    O servidor estará rodando em `http://localhost:3001` (ou a porta configurada).

## Endpoints da API

### Profissionais (`/api/professionals`)

-   `GET /api/professionals`: Retorna todos os profissionais.
-   `GET /api/professionals/:id`: Retorna um profissional específico por ID.
-   `POST /api/professionals`: Cria um novo profissional.
    -   Corpo da requisição (JSON): `{ "name": "Nome do Profissional", "color": "bg-blue-500", "default_hours": 12 }`
-   `PUT /api/professionals/:id`: Atualiza um profissional existente.
    -   Corpo da requisição (JSON): `{ "name": "Novo Nome", "color": "bg-green-500", "default_hours": 8 }`
-   `DELETE /api/professionals/:id`: Deleta um profissional.

### Escala (`/api/schedule`)

-   `GET /api/schedule?year=YYYY&month=MM`: Retorna todas as entradas de escala para um mês e ano específicos.
-   `POST /api/schedule`: Cria ou atualiza uma entrada de escala para uma data.
    -   Corpo da requisição (JSON): `{ "date": "YYYY-MM-DD", "professionalId": "uuid-do-profissional", "hours": 12, "observation": "Opcional" }`
-   `DELETE /api/schedule/:date`: Deleta a entrada de escala para uma data específica.
-   `POST /api/schedule/clear-month`: Limpa todas as entradas de escala para um mês e ano específicos.
    -   Corpo da requisição (JSON): `{ "year": YYYY, "month": MM }`

### Histórico (`/api/history`)

-   `GET /api/history`: Retorna todos os registros de histórico.
-   `POST /api/history`: Salva um registro de escala no histórico.
    -   Corpo da requisição (JSON): `{ "month_year": "YYYY-MM", "schedule_data": [...], "professionals_data": [...] }`
-   `DELETE /api/history/:id`: Deleta um registro de histórico.

### Configurações (`/api/config`)

-   `GET /api/config`: Retorna as configurações da aplicação.
-   `PUT /api/config`: Atualiza as configurações da aplicação.
    -   Corpo da requisição (JSON): `{ "company_name": "Nova Empresa", "department_name": "Novo Departamento", "system_title": "Novo Título" }`

## Dependências

-   `express`: Framework web para Node.js.
-   `sqlite3`: Driver SQLite para Node.js.
-   `cors`: Middleware para habilitar Cross-Origin Resource Sharing.
-   `uuid`: Para gerar IDs únicos.
-   `nodemon` (devDependencies): Para reiniciar automaticamente o servidor durante o desenvolvimento.
