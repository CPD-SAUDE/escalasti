# Backend do Sistema de Escala de Sobreaviso

Este diretório contém o código-fonte do backend do Sistema de Escala de Sobreaviso, construído com Node.js e Express, utilizando SQLite como banco de dados.

## Estrutura do Diretório

-   `controllers/`: Contém a lógica de negócio para cada recurso (profissionais, escala, histórico, configurações). Cada arquivo aqui é responsável por processar as requisições e interagir com o banco de dados.
-   `database/`: Contém o arquivo `database.js`, que é responsável pela inicialização e conexão com o banco de dados SQLite. O arquivo do banco de dados (`database.sqlite`) será criado aqui.
-   `routes/`: Define as rotas da API RESTful. Cada arquivo de rota mapeia URLs para as funções dos controladores correspondentes.
-   `scripts/`: Contém scripts utilitários, como `init-database.js` para criar as tabelas iniciais no banco de dados.
-   `server.js`: O ponto de entrada principal da aplicação backend. Ele configura o servidor Express, carrega as rotas e inicia o servidor.
-   `package.json`: Lista as dependências do projeto e os scripts npm para execução e outras tarefas.

## Tecnologias Utilizadas

-   **Node.js:** Ambiente de execução JavaScript.
-   **Express.js:** Framework web para Node.js, usado para construir a API RESTful.
-   **SQLite:** Banco de dados leve e baseado em arquivo, ideal para aplicações pequenas e médias ou para desenvolvimento local.
-   **CORS:** Middleware para habilitar o Cross-Origin Resource Sharing, permitindo que o frontend (em uma origem diferente) acesse a API.

## Instalação e Execução (Local)

Para rodar o backend localmente (sem Docker), siga estes passos:

1.  **Navegue até o diretório `backend`:**
    \`\`\`bash
    cd backend
    \`\`\`

2.  **Instale as dependências:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Inicialize o banco de dados (apenas na primeira vez):**
    Este script criará o arquivo `database.sqlite` e as tabelas necessárias.
    \`\`\`bash
    npm run init-db
    \`\`\`

4.  **Inicie o servidor backend:**
    \`\`\`bash
    npm start
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

## Rotas da API

As rotas da API são definidas na pasta `routes/`. Aqui estão as principais:

-   `/api/professionals`: Gerenciamento de profissionais.
-   `/api/schedule`: Gerenciamento da escala.
-   `/api/history`: Gerenciamento do histórico de escalas.
-   `/api/config`: Gerenciamento das configurações do sistema.

Consulte os arquivos em `routes/` e `controllers/` para detalhes sobre os endpoints e suas funcionalidades.

## Persistência de Dados

O banco de dados SQLite (`database.sqlite`) é armazenado na pasta `database/`. Se você apagar este arquivo, todos os seus dados serão perdidos.

Ao usar Docker Compose, o volume `backend_data` é configurado para persistir este arquivo, garantindo que seus dados não sejam perdidos mesmo se os contêineres forem removidos e recriados.

## Variáveis de Ambiente

O backend pode usar variáveis de ambiente para configuração, embora este projeto use principalmente configurações internas ou via API. Para portas, o `server.js` define a porta 3001.

## Solução de Problemas

-   **"Port 3001 already in use"**: Outro processo está usando a porta 3001. Você pode parar o outro processo ou alterar a porta no `server.js`.
-   **Erros de banco de dados**: Verifique se você executou `npm run init-db` pelo menos uma vez.
-   **Erros de CORS**: Certifique-se de que o middleware `cors()` está configurado corretamente no `server.js` para permitir requisições do seu frontend.
