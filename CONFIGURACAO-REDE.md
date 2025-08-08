# Configuração de Rede para o Sistema de Escala de Sobreaviso

Este documento descreve como configurar a rede para o sistema de escala de sobreaviso, permitindo que o frontend e o backend se comuniquem corretamente, seja em um ambiente de desenvolvimento local ou em produção.

## 1. Visão Geral da Arquitetura

O sistema é composto por duas partes principais:

- **Frontend (Next.js):** Uma aplicação web que roda na porta `3000`.
- **Backend (Node.js/Express):** Uma API REST que roda na porta `3001` e interage com um banco de dados SQLite.

Para que o frontend possa consumir os serviços do backend, eles precisam estar na mesma rede ou o frontend precisa saber o endereço IP e a porta do backend.

## 2. Configuração para Desenvolvimento Local (sem Docker Compose)

Se você estiver executando o frontend e o backend diretamente em sua máquina local (sem Docker Compose), siga estas etapas:

### 2.1. Iniciar o Backend

1.  Navegue até a pasta `backend`:
    \`\`\`bash
    cd backend
    \`\`\`
2.  Instale as dependências (se ainda não o fez):
    \`\`\`bash
    npm install
    \`\`\`
3.  Inicie o servidor backend:
    \`\`\`bash
    npm start
    \`\`\`
    O backend estará disponível em `http://localhost:3001`.

### 2.2. Iniciar o Frontend

1.  Navegue até a pasta raiz do projeto (onde está o `package.json` do frontend):
    \`\`\`bash
    cd .. # Se você estiver na pasta backend
    \`\`\`
2.  Instale as dependências (se ainda não o fez):
    \`\`\`bash
    npm install --force # Use --force se houver problemas de dependência
    \`\`\`
3.  Defina a variável de ambiente `NEXT_PUBLIC_API_URL` para apontar para o backend local.
    -   **No Windows (CMD):**
        \`\`\`cmd
        set NEXT_PUBLIC_API_URL=http://localhost:3001/api
        npm run dev
