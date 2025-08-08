# Backend do Sistema de Escala de Sobreaviso

Este é o backend da aplicação de escala de sobreaviso, construído com Node.js e Express.js, utilizando SQLite como banco de dados para persistência de dados.

## Estrutura do Projeto

\`\`\`
.
├── controllers/      # Lógica de negócio para as rotas da API
├── database/         # Configuração e inicialização do banco de dados SQLite
├── routes/           # Definição das rotas da API
├── scripts/          # Scripts utilitários (ex: inicialização do banco de dados)
├── server.js         # Ponto de entrada principal do servidor
├── package.json      # Metadados e dependências do projeto
└── Dockerfile        # Dockerfile para construir a imagem do backend
\`\`\`

## Tecnologias

-   **Node.js**: Ambiente de execução JavaScript.
-   **Express.js**: Framework web para Node.js, usado para construir a API REST.
-   **SQLite3**: Banco de dados leve e sem servidor, ideal para aplicações pequenas e médias.
-   **CORS**: Middleware para habilitar o Cross-Origin Resource Sharing.

## Rotas da API

O backend expõe as seguintes rotas:

### Configurações (`/api/config`)

-   `GET /api/config`: Retorna as configurações atuais do sistema.
-   `PUT /api/config`: Atualiza as configurações do sistema.

### Profissionais (`/api/professionals`)

-   `GET /api/professionals`: Retorna a lista de todos os profissionais.
-   `POST /api/professionals`: Adiciona um novo profissional.
-   `PUT /api/professionals/:id`: Atualiza um profissional existente.
-   `DELETE /api/professionals/:id`: Remove um profissional.

### Escala (`/api/schedule`)

-   `GET /api/schedule/:year/:month`: Retorna a escala de sobreaviso para um determinado mês e ano.
-   `POST /api/schedule`: Salva ou atualiza a escala de sobreaviso para um mês.

### Histórico (`/api/history`)

-   `GET /api/history`: Retorna o histórico de alterações na escala.

## Como Executar (Localmente)

1.  **Navegue até o diretório `backend`:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Inicialize o banco de dados (se for a primeira vez):**
    Este script cria as tabelas necessárias no banco de dados SQLite.
    \`\`\`bash
    npm run init-db
    \`\`\`
    O arquivo do banco de dados `database.sqlite` será criado na pasta `database/`.

4.  **Inicie o servidor:**
    \`\`\`bash
    npm start
    \`\`\`
    O servidor estará rodando em `http://localhost:3001`.

## Como Executar (com Docker)

A maneira recomendada de executar o backend é usando Docker Compose, que também orquestra o frontend. Consulte o `README.md` principal na raiz do projeto para instruções completas sobre como usar o Docker Compose.

Se você quiser construir e rodar apenas o contêiner do backend:

1.  **Navegue até o diretório `backend`:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Construa a imagem Docker:**
    \`\`\`bash
    docker build -t escalasti-backend .
    \`\`\`

3.  **Execute o contêiner:**
    \`\`\`bash
    docker run -p 3001:3001 -v backend_data:/app/database escalasti-backend
    \`\`\`
    -   `-p 3001:3001`: Mapeia a porta 3001 do contêiner para a porta 3001 do seu host.
    -   `-v backend_data:/app/database`: Cria um volume nomeado para persistir o banco de dados.

## Variáveis de Ambiente

Nenhuma variável de ambiente é estritamente necessária para o funcionamento básico, mas você pode configurar a porta do servidor no `server.js` se necessário.

## Contribuição

Para contribuir com o desenvolvimento do backend, siga as diretrizes de contribuição do projeto principal.
