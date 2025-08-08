# Configuração de Rede para o Sistema de Escala de Sobreaviso

Este documento descreve as configurações de rede necessárias para o correto funcionamento do Sistema de Escala de Sobreaviso, especialmente em ambientes de desenvolvimento e produção que utilizam Docker.

## 1. Visão Geral da Arquitetura de Rede

O sistema é composto por dois serviços principais:
- **Backend:** Uma API Node.js/Express que gerencia a lógica de negócio e interage com o banco de dados.
- **Frontend:** Uma aplicação Next.js que fornece a interface do usuário.

Ambos os serviços são conteinerizados usando Docker e se comunicam através de uma rede Docker interna.

## 2. Configuração com Docker Compose

O arquivo `docker-compose.yml` define a rede `app_network` que permite a comunicação entre os contêineres do frontend e do backend.

\`\`\`yaml
version: '3.8'

services:
  backend:
    # ... outras configurações ...
    networks:
      - app_network # Conecta ao contêiner do frontend na mesma rede

  frontend:
    # ... outras configurações ...
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001/api # 'backend' é o nome do serviço no Docker Compose
    networks:
      - app_network # Conecta ao contêiner do backend na mesma rede

volumes:
  backend_data: # Volume nomeado para persistência do banco de dados

networks:
  app_network:
    driver: bridge # Define uma rede bridge para os contêineres se comunicarem
\`\`\`

**Explicação:**
- `app_network`: É uma rede do tipo `bridge` criada pelo Docker Compose. Contêineres conectados à mesma rede bridge podem se comunicar entre si usando os nomes dos serviços como nomes de host (ex: `http://backend:3001/api`).
- `NEXT_PUBLIC_API_URL`: Esta variável de ambiente no frontend é crucial. Ela informa ao frontend onde encontrar o backend. Dentro da rede Docker, o nome do serviço `backend` é resolvido para o IP interno do contêiner do backend.

## 3. Acesso Externo (Host para Contêiner)

Para acessar o frontend e o backend do seu navegador (no host), as portas são mapeadas:
- **Frontend:** `3000:3000` (porta 3000 do host mapeada para a porta 3000 do contêiner). Acesse via `http://localhost:3000`.
- **Backend:** `3001:3001` (porta 3001 do host mapeada para a porta 3001 do contêiner). Acesse via `http://localhost:3001` (útil para testar a API diretamente).

## 4. Configuração de Rede em Ambiente de Desenvolvimento Local (sem Docker)

Se você estiver executando o frontend e o backend diretamente no seu ambiente local (sem Docker Compose), você precisará garantir que o frontend saiba onde o backend está rodando.

1.  **Inicie o Backend:**
    Navegue até a pasta `backend` e inicie o servidor:
    \`\`\`bash
    cd backend
    npm install
    npm start
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

2.  **Configure a variável de ambiente para o Frontend:**
    Antes de iniciar o frontend, defina a variável de ambiente `NEXT_PUBLIC_API_URL` para apontar para o backend local.
    -   **No Windows (PowerShell):**
        ```powershell
        $env:NEXT_PUBLIC_API_URL="http://localhost:3001/api"
