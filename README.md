# Sistema de Escala de Sobreaviso

Este é um sistema para gerenciar escalas de sobreaviso, composto por um frontend em Next.js e um backend em Node.js com SQLite.

## Estrutura do Projeto

- `frontend/`: Contém o código da aplicação Next.js (React).
- `backend/`: Contém o código do servidor Node.js (Express) e o banco de dados SQLite.
- `docker-compose.yml`: Arquivo para orquestrar os contêineres Docker do frontend e backend.
- `Dockerfile`: Dockerfile para a aplicação frontend.
- `backend/Dockerfile`: Dockerfile para a aplicação backend.
- `install-system.bat`: Script para instalar e configurar o sistema no Windows.
- `start-system.bat`: Script para iniciar o sistema (frontend e backend) no Windows.
- `start-system-network.bat`: Script para iniciar o sistema e configurar a rede (Windows).
- `build-frontend.bat`: Script para construir a imagem Docker do frontend (Windows).
- `backend/start-backend.bat`: Script para iniciar o backend (Windows).
- `start-frontend.bat`: Script para iniciar o frontend (Windows).
- `test-network.bat`: Script para testar a conectividade de rede (Windows).
- `configure-network.bat`: Script para configurar o IP do backend no frontend (Windows).
- `CONFIGURACAO-REDE.md`: Documento detalhado sobre a configuração de rede.

## Requisitos

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Docker e Docker Compose (para execução em contêineres)
- Git

## Como Rodar (com Docker Compose - Recomendado)

1.  **Clone o repositório:**
    \`\`\`bash
    git clone https://github.com/CPD-SAUDE/escalasti.git
    cd escalasti
    \`\`\`

2.  **Construa e inicie os serviços Docker:**
    \`\`\`bash
    docker compose up --build -d
    \`\`\`
    - `--build`: Constrói as imagens Docker antes de iniciar os contêineres.
    - `-d`: Executa os contêineres em segundo plano (detached mode).

3.  **Acesse a aplicação:**
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:3001/api`

    O banco de dados SQLite será persistido em um volume Docker (`backend_data`), então seus dados não serão perdidos se os contêineres forem removidos.

## Como Rodar (Localmente - Sem Docker)

### Backend

1.  **Navegue até o diretório do backend:**
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
    Isso criará o arquivo `database.sqlite` e as tabelas necessárias.

4.  **Inicie o servidor backend:**
    \`\`\`bash
    npm start
    \`\`\`
    O backend estará disponível em `http://localhost:3001`.

### Frontend

1.  **Navegue até o diretório raiz do projeto (onde está o `package.json` do frontend):**
    \`\`\`bash
    cd .. # Se você estiver no diretório 'backend'
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Configure a URL da API do backend:**
    Crie um arquivo `.env.local` na raiz do projeto (ao lado do `package.json` do frontend) e adicione:
    \`\`\`
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    \`\`\`
    Se o backend estiver rodando em um IP diferente de `localhost`, substitua `localhost` pelo IP correto.

4.  **Inicie a aplicação frontend:**
    \`\`\`bash
    npm run dev
    \`\`\`
    O frontend estará disponível em `http://localhost:3000`.

## Scripts de Automação (Windows)

Os arquivos `.bat` fornecidos na raiz do projeto e no diretório `backend/` podem ser usados para automatizar algumas tarefas no Windows.

-   `install-system.bat`: Instala as dependências e inicializa o banco de dados.
-   `start-system.bat`: Inicia o frontend e o backend.
-   Consulte os outros scripts para funcionalidades específicas.

## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.
