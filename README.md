# Sistema de Escala de Sobreaviso

Este é um sistema para gerenciar escalas de sobreaviso, composto por um frontend em Next.js e um backend em Node.js/Express com SQLite.

## Tecnologias Utilizadas

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, Shadcn/ui
- **Backend:** Node.js, Express.js, SQLite3
- **Containerização:** Docker, Docker Compose

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Docker Desktop (ou Docker Engine e Docker Compose)

## Como Rodar com Docker Compose (Recomendado)

A maneira mais fácil de colocar o sistema em funcionamento é usando o Docker Compose.

1.  **Clone o repositório:**
    \`\`\`bash
    git clone https://github.com/CPD-SAUDE/escalasti.git
    cd escalasti
    \`\`\`

2.  **Construa e inicie os contêineres:**
    Na raiz do projeto (onde o `docker-compose.yml` está), execute:
    \`\`\`bash
    docker compose up --build -d
    \`\`\`
    - `--build`: Reconstrói as imagens Docker (útil na primeira vez ou após alterações nos Dockerfiles).
    - `-d`: Executa os contêineres em modo detached (em segundo plano).

3.  **Acesse o sistema:**
    Abra seu navegador e vá para `http://localhost:3000`.

4.  **Parar o sistema:**
    Para parar e remover os contêineres, redes e volumes criados pelo Docker Compose, execute:
    \`\`\`bash
    docker compose down -v
    \`\`\`
    - `-v`: Remove também os volumes, o que apagará o banco de dados SQLite persistido. Use com cautela.

## Como Rodar Localmente (para Desenvolvimento)

Se você preferir rodar o frontend e o backend separadamente para desenvolvimento:

### 1. Backend

1.  **Navegue até a pasta do backend:**
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
    Isso criará o arquivo `database.sqlite` na pasta `backend/database`.

4.  **Inicie o servidor backend:**
    \`\`\`bash
    npm start
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

### 2. Frontend

1.  **Navegue de volta para a raiz do projeto:**
    \`\`\`bash
    cd ..
    \`\`\`

2.  **Instale as dependências (com --force se necessário):**
    \`\`\`bash
    npm install --force
    \`\`\`
    (Use `--force` apenas se `npm install` falhar devido a problemas de dependência).

3.  **Configure a variável de ambiente da API:**
    O frontend precisa saber onde o backend está rodando.
    - **No Windows (CMD/PowerShell):**
        \`\`\`cmd
        set NEXT_PUBLIC_API_URL=http://localhost:3001/api
        npm run dev
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
\`\`\`
