# Sistema de Escala de Sobreaviso

Este é um sistema para gerenciar escalas de sobreaviso, desenvolvido com Next.js para o frontend e Node.js/Express para o backend, utilizando SQLite como banco de dados.

## Visão Geral

O sistema permite:
- Gerenciar profissionais (adicionar, editar, remover).
- Criar e visualizar escalas de sobreaviso por mês.
- Atribuir profissionais a dias específicos na escala.
- Visualizar o histórico de escalas.
- Configurar parâmetros do sistema.

## Tecnologias Utilizadas

**Frontend:**
- Next.js 14 (React Framework)
- Tailwind CSS
- Shadcn/ui
- Lucide React Icons

**Backend:**
- Node.js
- Express.js
- SQLite3 (para persistência de dados)

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

-   [Node.js](https://nodejs.org/en/download/) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/get-npm) (gerenciador de pacotes do Node.js, geralmente vem com o Node.js)
-   [Git](https://git-scm.com/downloads)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop) (recomendado para facilitar a execução)

## Instalação e Execução (Recomendado: Docker Compose)

A maneira mais fácil de configurar e executar o sistema é usando o Docker Compose.

1.  **Clone o repositório:**
    \`\`\`bash
    git clone https://github.com/CPD-SAUDE/escalasti.git
    cd escalasti
    \`\`\`

2.  **Inicie o sistema com Docker Compose:**
    Na raiz do projeto (onde está o `docker-compose.yml`), execute:
    \`\`\`bash
    docker compose up --build -d
    \`\`\`
    -   `--build`: Constrói as imagens Docker para o frontend e backend.
    -   `-d`: Executa os contêineres em segundo plano.

3.  **Acesse a aplicação:**
    Após os contêineres serem iniciados (pode levar alguns minutos na primeira vez), abra seu navegador e acesse:
    \`\`\`
    http://localhost:3000
    \`\`\`

4.  **Para parar o sistema:**
    Na raiz do projeto, execute:
    \`\`\`bash
    docker compose down
    \`\`\`

## Instalação e Execução (Manual - Sem Docker)

Se você preferir executar o frontend e o backend separadamente sem Docker:

### 1. Backend

1.  **Navegue até a pasta do backend:**
    \`\`\`bash
    cd backend
    \`\`\`
2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`
3.  **Inicie o servidor backend:**
    \`\`\`bash
    npm start
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

### 2. Frontend

1.  **Navegue de volta para a raiz do projeto:**
    \`\`\`bash
    cd ..
    \`\`\`
2.  **Instale as dependências do frontend:**
    \`\`\`bash
    npm install --force # Use --force se encontrar erros de dependência
    \`\`\`
3.  **Configure a URL da API:**
    Você precisa informar ao frontend onde o backend está rodando. Defina a variável de ambiente `NEXT_PUBLIC_API_URL`.
    -   **No Windows (CMD):**
        \`\`\`cmd
        set NEXT_PUBLIC_API_URL=http://localhost:3001/api
        npm run dev
        ```
    -   **No Windows (PowerShell):**
        ```powershell
        $env:NEXT_PUBLIC_API_URL="http://localhost:3001/api"
        npm run dev
        ```
    -   **No Linux/macOS:**
        \`\`\`bash
        export NEXT_PUBLIC_API_URL=http://localhost:3001/api
        npm run dev
        ```
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
