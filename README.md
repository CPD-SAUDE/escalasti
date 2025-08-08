# Sistema de Escala de Sobreaviso

Este é um sistema para gerenciar escalas de sobreaviso, composto por um frontend em Next.js e um backend em Node.js (Express) com SQLite.

## Tecnologias Utilizadas

-   **Frontend:** Next.js (React), Tailwind CSS, Shadcn/ui
-   **Backend:** Node.js, Express.js, SQLite3
-   **Containerização:** Docker, Docker Compose

## Como Rodar o Projeto (com Docker Compose)

A maneira recomendada de rodar este projeto é usando Docker Compose, que orquestra tanto o frontend quanto o backend.

### Pré-requisitos

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (inclui Docker Engine e Docker Compose) instalado e em execução.

### Passos para Iniciar

1.  **Clone o repositório:**
    \`\`\`bash
    git clone https://github.com/CPD-SAUDE/escalasti.git
    cd escalasti
    \`\`\`

2.  **Inicie os serviços Docker:**
    Na raiz do projeto (onde o `docker-compose.yml` está), execute:
    \`\`\`bash
    docker compose up --build -d
    \`\`\`
    -   `--build`: Garante que as imagens Docker sejam construídas (ou reconstruídas) antes de iniciar os contêineres.
    -   `-d`: Inicia os contêineres em modo "detached" (em segundo plano).

3.  **Acesse a aplicação:**
    Após os contêineres estarem em execução, o frontend estará disponível em:
    [http://localhost:3000](http://localhost:3000)

    O backend (API) estará disponível em:
    [http://localhost:3001/api](http://localhost:3001/api)

### Parar os Serviços Docker

Para parar e remover os contêineres, redes e volumes criados pelo Docker Compose:
\`\`\`bash
docker compose down
\`\`\`

### Reconstruir Imagens (se houver mudanças nos Dockerfiles ou dependências)

Se você fizer alterações nos `Dockerfile`s ou nas dependências (`package.json`), você precisará reconstruir as imagens:
\`\`\`bash
docker compose build
\`\`\`
E então, inicie novamente com `docker compose up -d`.

## Como Rodar o Projeto (Localmente - Sem Docker)

Se você preferir rodar o frontend e o backend separadamente sem Docker Compose:

### Backend (Node.js)

1.  **Navegue até a pasta do backend:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install --force
    \`\`\`

3.  **Inicialize o banco de dados (se for a primeira vez):**
    \`\`\`bash
    npm run init-db
    \`\`\`

4.  **Inicie o servidor de desenvolvimento:**
    \`\`\`bash
    npm run dev
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

### Frontend (Next.js)

1.  **Volte para a raiz do projeto e navegue até a pasta do frontend:**
    \`\`\`bash
    cd ..
    \`\`\`
    (Você já deve estar na raiz se seguiu os passos do backend)

2.  **Instale as dependências:**
    \`\`\`bash
    npm install --force
    \`\`\`

3.  **Configure a variável de ambiente da API:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione:
    \`\`\`
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    \`\`\`
    -   **No Linux/macOS:**
        \`\`\`bash
        export NEXT_PUBLIC_API_URL=http://localhost:3001/api
        npm run dev
        \`\`\`
4.  **Inicie o servidor de desenvolvimento do frontend:**
    \`\`\`bash
    npm run dev
    \`\`\`
    O frontend estará rodando em `http://localhost:3000`.

## Estrutura do Projeto

\`\`\`
.
├── app/                  # Configurações globais do Next.js (layout, page)
├── backend/              # Código-fonte do servidor Node.js/Express
│   ├── controllers/      # Lógica de negócio para as rotas
│   ├── database/         # Configuração do banco de dados SQLite
│   ├── routes/           # Definição das rotas da API
│   ├── scripts/          # Scripts de inicialização (ex: init-database)
│   ├── server.js         # Ponto de entrada do servidor
│   └── package.json      # Dependências do backend
├── components/           # Componentes React reutilizáveis
│   └── ui/               # Componentes Shadcn/ui
├── hooks/                # Hooks React personalizados
├── lib/                  # Funções utilitárias e definições de tipos
├── public/               # Ativos estáticos (imagens, etc.)
├── styles/               # Estilos globais (Tailwind CSS)
├── docker-compose.yml    # Definição dos serviços Docker (frontend e backend)
├── Dockerfile            # Dockerfile para o frontend (Next.js)
├── backend/Dockerfile    # Dockerfile para o backend (Node.js)
├── package.json          # Dependências do frontend
├── next.config.mjs       # Configuração do Next.js
├── postcss.config.mjs    # Configuração do PostCSS
├── tailwind.config.ts    # Configuração do Tailwind CSS
├── tsconfig.json         # Configuração do TypeScript
└── ... outros arquivos de configuração e scripts
\`\`\`

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades. Por favor, siga as boas práticas de desenvolvimento e crie pull requests.

## Licença

[Adicione sua licença aqui, por exemplo, MIT]
