# Sistema de Escala de Sobreaviso

Este é um sistema para gerenciar escalas de sobreaviso, desenvolvido com Next.js para o frontend e Node.js/Express para o backend, utilizando SQLite como banco de dados. O sistema é conteinerizado com Docker para facilitar a implantação e o desenvolvimento.

## Funcionalidades

-   Gerenciamento de profissionais (cadastro, edição, exclusão).
-   Criação e visualização de escalas de sobreaviso por mês.
-   Atribuição de profissionais a dias específicos na escala.
-   Visualização do histórico de escalas.
-   Configuração de feriados e dias não úteis.

## Tecnologias Utilizadas

**Frontend:**
-   Next.js (React Framework)
-   TypeScript
-   Tailwind CSS
-   Shadcn/ui
-   Lucide React Icons

**Backend:**
-   Node.js
-   Express.js
-   SQLite (com `sqlite3` e `better-sqlite3`)
-   CORS

**Conteinerização:**
-   Docker
-   Docker Compose

## Pré-requisitos

-   Node.js (versão 18 ou superior)
-   npm (gerenciador de pacotes do Node.js)
-   Docker Desktop (inclui Docker Engine e Docker Compose)

## Como Rodar o Projeto

Existem duas formas principais de rodar o projeto: via Docker Compose (recomendado para desenvolvimento e produção) ou localmente (para desenvolvimento específico de uma parte).

### Opção 1: Com Docker Compose (Recomendado)

Esta é a forma mais fácil e consistente de rodar o sistema, pois ele gerencia o frontend, o backend e o banco de dados em contêineres isolados.

1.  **Clone o repositório:**
    \`\`\`bash
    git clone https://github.com/CPD-SAUDE/escalasti.git
    cd escalasti
    \`\`\`
2.  **Construa e inicie os contêineres:**
    Na raiz do projeto (onde está o `docker-compose.yml`), execute:
    \`\`\`bash
    docker compose up --build -d
    \`\`\`
    -   `--build`: Constrói as imagens Docker para o frontend e o backend.
    -   `-d`: Executa os contêineres em modo "detached" (em segundo plano).

    Este comando irá:
    -   Construir a imagem do backend (baseada no `backend/Dockerfile`).
    -   Construir a imagem do frontend (baseada no `Dockerfile` na raiz).
    -   Criar uma rede Docker para que os serviços possam se comunicar.
    -   Iniciar o contêiner do backend na porta 3001.
    -   Iniciar o contêiner do frontend na porta 3000, configurado para se comunicar com o backend usando o nome do serviço (`http://backend:3001/api`).
    -   Inicializar o banco de dados SQLite no backend (se ainda não existir) e persistir os dados em um volume Docker chamado `backend_data`.

3.  **Acesse o sistema:**
    Abra seu navegador e acesse:
    \`\`\`
    http://localhost:3000
    \`\`\`

4.  **Para parar o sistema:**
    Na raiz do projeto, execute:
    \`\`\`bash
    docker compose down
    \`\`\`
    Isso irá parar e remover os contêineres e a rede. O volume `backend_data` (com seus dados) será mantido por padrão. Para remover também o volume, use `docker compose down --volumes`.

### Opção 2: Localmente (para Desenvolvimento)

Se você preferir rodar o frontend e/ou o backend diretamente na sua máquina para desenvolvimento, siga os passos abaixo.

#### 2.1. Rodar o Backend Localmente

1.  **Navegue até a pasta do backend:**
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
4.  **Inicie o servidor:**
    \`\`\`bash
    npm start
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

#### 2.2. Rodar o Frontend Localmente

1.  **Certifique-se de que o Backend está rodando** (seja localmente ou via Docker Compose).
2.  **Navegue até a raiz do projeto:**
    \`\`\`bash
    cd .. # Se você estiver na pasta backend
    \`\`\`
3.  **Instale as dependências do frontend:**
    \`\`\`bash
    npm install --force
    \`\`\`
    **Nota:** O uso de `--force` é necessário devido a possíveis problemas de resolução de dependências.

4.  **Defina a variável de ambiente `NEXT_PUBLIC_API_URL`:**
    Esta variável informa ao frontend onde a API do backend está localizada.
    -   **No Windows (PowerShell):**
        ```powershell
        $env:NEXT_PUBLIC_API_URL="http://localhost:3001/api"
