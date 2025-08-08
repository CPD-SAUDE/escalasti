# Sistema de Escala de Sobreaviso

Este é um sistema para gerenciar escalas de sobreaviso, permitindo a organização de profissionais, horários e o registro de histórico.

## Tecnologias Utilizadas

*   **Frontend:** Next.js (React), TypeScript, Tailwind CSS, Shadcn/ui
*   **Backend:** Node.js (Express.js)
*   **Banco de Dados:** SQLite (usando `sqlite3`)

## Estrutura do Projeto

*   `app/`: Contém os arquivos do frontend Next.js (páginas, layouts, etc.).
*   `backend/`: Contém o código do servidor Node.js (API REST).
    *   `backend/controllers/`: Lógica de negócio para cada rota.
    *   `backend/database/`: Configuração e operações do banco de dados SQLite.
    *   `backend/routes/`: Definição das rotas da API.
    *   `backend/scripts/`: Scripts utilitários (ex: para obter IP de rede, inicializar DB).
    *   `backend/server.js`: Ponto de entrada principal do servidor.
*   `components/`: Componentes React reutilizáveis do frontend.
*   `hooks/`: Hooks personalizados do React.
*   `lib/`: Funções utilitárias e definições de tipos.
*   `public/`: Ativos estáticos (imagens, etc.).
*   `docker-compose.yml`: Arquivo para orquestrar os serviços Docker (frontend e backend).
*   `Dockerfile`: Dockerfile para o frontend.
*   `backend/Dockerfile`: Dockerfile para o backend.

## Como Rodar o Sistema (Localmente - Sem Docker)

**Pré-requisitos:**

*   Node.js (versão 18 ou superior) e npm instalados.

1.  **Clonar o Repositório:**
    \`\`\`bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <nome_da_pasta_do_projeto>
    \`\`\`

2.  **Instalar Dependências do Backend:**
    \`\`\`bash
    cd backend
    npm install
    cd ..
    \`\`\`

3.  **Instalar Dependências do Frontend:**
    \`\`\`bash
    npm install
    \`\`\`

4.  **Inicializar o Banco de Dados (Backend):**
    O banco de dados SQLite será criado automaticamente na primeira execução do backend. Você pode forçar a inicialização das tabelas com:
    \`\`\`bash
    node backend/scripts/init-database.js
    \`\`\`

5.  **Configurar Variáveis de Ambiente (Frontend):**
    Crie um arquivo `.env.local` na raiz do projeto (onde está o `package.json` do frontend) com o seguinte conteúdo:
    \`\`\`
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    PORT=3000
    \`\`\`

6.  **Iniciar o Backend:**
    Abra um novo terminal, navegue até a pasta `backend` e execute:
    \`\`\`bash
    npm start
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

7.  **Iniciar o Frontend:**
    Abra outro terminal, navegue até a raiz do projeto e execute:
    \`\`\`bash
    npm run dev
    \`\`\`
    O frontend estará rodando em `http://localhost:3000`.

## Como Rodar o Sistema (Com Docker Compose)

**Pré-requisitos:**

*   Docker Desktop instalado e em execução.

1.  **Clonar o Repositório:**
    \`\`\`bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <nome_da_pasta_do_projeto>
    \`\`\`

2.  **Construir e Iniciar os Containers:**
    Na raiz do projeto (onde está o `docker-compose.yml`), execute:
    \`\`\`bash
    docker compose up --build -d
    \`\`\`
    *   `--build`: Garante que as imagens Docker sejam construídas.
    *   `-d`: Executa os containers em segundo plano.

3.  **Acessar a Aplicação:**
    Abra seu navegador e acesse: `http://localhost:3000`

4.  **Parar a Aplicação Docker:**
    Na raiz do projeto, execute:
    \`\`\`bash
    docker compose down
    \`\`\`
    Para remover também os volumes (incluindo o banco de dados), use:
    \`\`\`bash
    docker compose down -v
    \`\`\`

## Rotas da API (Backend)

*   `GET /api/status`: Verifica o status do backend.
*   `GET /api/professionals`: Lista todos os profissionais.
*   `POST /api/professionals`: Adiciona um novo profissional.
*   `PUT /api/professionals/:id`: Atualiza um profissional existente.
*   `DELETE /api/professionals/:id`: Remove um profissional.
*   `GET /api/schedule/:year/:month`: Obtém a escala de um mês/ano específico.
*   `POST /api/schedule`: Salva a escala de um mês/ano.
*   `GET /api/history`: Lista o histórico de escalas salvas.
*   `POST /api/history`: Salva uma escala no histórico.
*   `GET /api/history/:id`: Obtém uma escala específica do histórico.
*   `DELETE /api/history/:id`: Remove uma entrada do histórico.
*   `GET /api/config`: Obtém as configurações do sistema.
*   `PUT /api/config`: Atualiza as configurações do sistema.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.
