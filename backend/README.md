# Backend do Sistema de Escala de Sobreaviso

Este é o backend da aplicação de escala de sobreaviso, construído com Node.js, Express e SQLite.

## Estrutura de Pastas

- `controllers/`: Contém a lógica de negócio para cada recurso (profissionais, escala, histórico, configuração).
- `database/`: Contém o arquivo de conexão com o banco de dados SQLite.
- `routes/`: Define as rotas da API para cada recurso.
- `scripts/`: Contém scripts utilitários, como o de inicialização do banco de dados.
- `server.js`: O arquivo principal do servidor Express.
- `package.json`: Define as dependências e scripts do projeto.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express.js**: Framework web para Node.js.
- **SQLite3**: Banco de dados leve e sem servidor.
- **CORS**: Middleware para habilitar o Cross-Origin Resource Sharing.
- **nodemon**: Ferramenta para reiniciar automaticamente o servidor durante o desenvolvimento.

## Como Rodar Localmente

1.  **Navegue até este diretório (`backend/`):**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Inicialize o banco de dados:**
    \`\`\`bash
    npm run init-db
    \`\`\`
    Este script criará o arquivo `database.sqlite` no diretório `database/` e as tabelas necessárias (`professionals`, `schedule`, `history`, `config`).

4.  **Inicie o servidor:**
    \`\`\`bash
    npm start
    \`\`\`
    O servidor estará rodando em `http://localhost:3001`.

    Para desenvolvimento com reinício automático:
    \`\`\`bash
    npm run dev
    \`\`\`

## Endpoints da API

Todos os endpoints são prefixados com `/api`.

-   **Profissionais (`/api/professionals`)**
    -   `GET /api/professionals`: Retorna todos os profissionais.
    -   `POST /api/professionals`: Adiciona um novo profissional.
    -   `PUT /api/professionals/:id`: Atualiza um profissional existente.
    -   `DELETE /api/professionals/:id`: Exclui um profissional.

-   **Escala (`/api/schedule`)**
    -   `GET /api/schedule/:year/:month`: Retorna a escala para um mês e ano específicos.
    -   `POST /api/schedule`: Adiciona ou atualiza uma entrada na escala.

-   **Histórico (`/api/history`)**
    -   `GET /api/history`: Retorna todas as entradas do histórico.
    -   `POST /api/history`: Adiciona uma nova entrada ao histórico.
    -   `DELETE /api/history/:id`: Exclui uma entrada do histórico.

-   **Configuração (`/api/config`)**
    -   `GET /api/config`: Retorna as configurações do sistema.
    -   `POST /api/config`: Atualiza as configurações do sistema.

-   **Status (`/api/status`)**
    -   `GET /api/status`: Retorna o status do backend e da conexão com o banco de dados.

## Banco de Dados

O banco de dados é um arquivo SQLite (`database.sqlite`) localizado no diretório `database/`. Ele é criado e inicializado automaticamente pelo script `npm run init-db`.

## Variáveis de Ambiente

Atualmente, não há variáveis de ambiente críticas para a execução local, mas você pode usar um arquivo `.env` para configurar a porta ou outras opções se necessário.
