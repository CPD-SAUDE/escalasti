# Sistema de Escala de Sobreaviso

Este é um sistema para gerenciar escalas de sobreaviso, composto por um frontend desenvolvido com Next.js e um backend com Node.js/Express e SQLite.

## Estrutura do Projeto

- `frontend/`: Contém o código-fonte da aplicação Next.js (o diretório raiz do projeto).
- `backend/`: Contém o código-fonte da API Node.js/Express.
- `docker-compose.yml`: Define os serviços Docker para o frontend e o backend.
- `Dockerfile`: Dockerfile para o frontend.
- `backend/Dockerfile`: Dockerfile para o backend.

## Requisitos

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Docker e Docker Compose (para execução em contêineres)
- Git

## Como Rodar Localmente (Sem Docker)

### 1. Backend

1.  Navegue até o diretório `backend`:
    \`\`\`bash
    cd backend
    \`\`\`
2.  Instale as dependências:
    \`\`\`bash
    npm install
    \`\`\`
3.  Inicialize o banco de dados (isso criará o arquivo `database.sqlite` e as tabelas):
    \`\`\`bash
    npm run init-db
    \`\`\`
4.  Inicie o servidor backend:
    \`\`\`bash
    npm start
    # Ou para desenvolvimento com hot-reload:
    # npm run dev
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

### 2. Frontend

1.  Volte para o diretório raiz do projeto:
    \`\`\`bash
    cd ..
    \`\`\`
2.  Instale as dependências:
    \`\`\`bash
    npm install
    \`\`\`
3.  Defina a variável de ambiente para a URL da API. Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
    \`\`\`
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    \`\`\`
4.  Inicie o servidor frontend:
    \`\`\`bash
    npm run dev
    \`\`\`
    O frontend estará rodando em `http://localhost:3000`.

## Como Rodar com Docker Compose

Certifique-se de ter o Docker e o Docker Compose instalados.

1.  Navegue até o diretório raiz do projeto (onde `docker-compose.yml` está localizado).
2.  Construa e inicie os contêineres:
    \`\`\`bash
    docker compose up --build -d
    \`\`\`
    - `--build`: Constrói as imagens Docker antes de iniciar os contêineres.
    - `-d`: Executa os contêineres em modo detached (em segundo plano).

3.  Verifique o status dos contêineres:
    \`\`\`bash
    docker compose ps
    \`\`\`

4.  Acesse o frontend em seu navegador: `http://localhost:3000`

### Parar e Remover os Contêineres

Para parar e remover os contêineres, redes e volumes criados pelo Docker Compose:

\`\`\`bash
docker compose down -v
\`\`\`
- `-v`: Remove também os volumes (isso apagará o banco de dados SQLite persistido).

## Deploy no Portainer (via Git Repository)

Para implantar este sistema no Portainer usando a funcionalidade de Git Repository:

1.  **Faça o push do seu código** para um repositório Git (ex: GitHub, GitLab, Bitbucket). Certifique-se de que o `docker-compose.yml` e os Dockerfiles estejam na raiz ou em caminhos relativos corretos.
2.  No Portainer, navegue até **Stacks** e clique em **Add stack**.
3.  Selecione a opção **Git Repository**.
4.  Preencha os campos:
    -   **Name**: Um nome para sua stack (ex: `escalas-ti-system`).
    -   **Repository URL**: A URL do seu repositório Git (ex: `https://github.com/seu-usuario/seu-repositorio.git`).
    -   **Repository reference**: A branch que você deseja implantar (ex: `refs/heads/main`).
    -   **Compose path**: O caminho para o seu `docker-compose.yml` dentro do repositório (se estiver na raiz, deixe vazio ou coloque `./docker-compose.yml`).
5.  Se o seu repositório for privado, você precisará configurar a autenticação (ex: Personal Access Token).
6.  Clique em **Deploy the stack**.

O Portainer irá clonar o repositório, construir as imagens e iniciar os serviços. Você pode monitorar os logs de build e de contêineres diretamente na interface do Portainer.

## Scripts Auxiliares (Windows .bat)

Alguns scripts `.bat` são fornecidos para facilitar a execução em ambientes Windows:

-   `install-system.bat`: Instala as dependências e inicia ambos os serviços.
-   `start-frontend.bat`: Inicia apenas o frontend.
-   `backend/start-backend.bat`: Inicia apenas o backend.
-   `start-system.bat`: Inicia ambos os serviços (assumindo dependências já instaladas).
-   `start-system-network.bat`: Inicia o sistema e configura a rede (se necessário).
-   `build-frontend.bat`: Constrói o frontend para produção.
-   `configure-network.bat`: Configura a rede.
-   `test-network.bat`: Testa a configuração de rede.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.
