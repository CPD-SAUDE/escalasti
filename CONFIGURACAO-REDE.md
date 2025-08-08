# Configuração de Rede para o Sistema de Escala de Sobreaviso

Este documento descreve como configurar a rede para o sistema de escala de sobreaviso, garantindo que o frontend e o backend possam se comunicar corretamente, especialmente em ambientes de desenvolvimento ou em redes locais.

## 1. Visão Geral da Rede

O sistema é composto por dois serviços principais:
- **Backend:** Um servidor Node.js/Express que expõe uma API REST e interage com um banco de dados SQLite.
- **Frontend:** Uma aplicação Next.js que consome a API do backend.

Em um ambiente Docker Compose, esses serviços são executados em uma rede Docker interna, onde podem se comunicar usando seus nomes de serviço (ex: `http://backend:3001/api`). No entanto, para acesso externo (do seu navegador) ou para depuração, é importante entender como as portas são mapeadas e como o frontend se conecta ao backend.

## 2. Configuração no `docker-compose.yml`

O arquivo `docker-compose.yml` define a rede e a comunicação entre os serviços:

\`\`\`yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001" # Mapeia a porta 3001 do host para a porta 3001 do contêiner
    volumes:
      - backend_data:/app/database # Volume persistente para o banco de dados
    restart: always
    networks:
      - app_network # Conecta à rede interna

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000" # Mapeia a porta 3000 do host para a porta 3000 do contêiner
    environment:
      # Define a URL da API para o frontend. 'backend' é o nome do serviço no Docker Compose.
      NEXT_PUBLIC_API_URL: http://backend:3001/api
    depends_on:
      - backend
    restart: always
    networks:
      - app_network # Conecta à rede interna

volumes:
  backend_data:

networks:
  app_network:
    driver: bridge # Define uma rede bridge para os contêineres se comunicarem
\`\`\`

**Pontos Chave:**
- **`ports`:** As portas `3000` (frontend) e `3001` (backend) são mapeadas do contêiner para o seu host, permitindo que você acesse as aplicações do seu navegador (ex: `http://localhost:3000`).
- **`networks`:** Ambos os serviços estão na `app_network`, o que permite que eles se comuniquem internamente usando seus nomes de serviço (`backend` e `frontend`).
- **`NEXT_PUBLIC_API_URL`:** Esta variável de ambiente no serviço `frontend` é crucial. Ela informa ao frontend onde encontrar o backend. Dentro da rede Docker, o nome do serviço (`backend`) é resolvido para o IP interno do contêiner do backend.

## 3. Acesso Externo e Teste de Conectividade

### Acessando as Aplicações

- **Frontend:** Após iniciar os contêineres, você pode acessar a aplicação frontend no seu navegador através de `http://localhost:3000`.
- **Backend (API):** Você pode testar a API do backend diretamente através de `http://localhost:3001/api` (ou rotas específicas como `http://localhost:3001/api/professionals`).

### Verificando a Conectividade (Opcional)

Se você tiver problemas de comunicação, pode depurar a rede Docker:

1.  **Listar redes Docker:**
    \`\`\`bash
    docker network ls
    \`\`\`
    Procure por `escalasti_app_network` (o nome da rede será prefixado com o nome da sua stack Docker).

2.  **Inspecionar a rede:**
    \`\`\`bash
    docker network inspect <ID_DA_REDE>
    \`\`\`
    Isso mostrará os contêineres conectados à rede e seus IPs internos.

3.  **Acessar um contêiner para testar a conectividade:**
    Você pode entrar no contêiner do frontend e tentar "pingar" o backend:
    \`\`\`bash
    docker exec -it <ID_DO_CONTÊINER_FRONTEND> sh
    ping backend
    \`\`\`
    (Você pode precisar instalar `iputils-ping` dentro do contêiner se não estiver disponível).

## 4. Considerações para Produção

Em um ambiente de produção, a configuração de rede pode ser mais complexa, envolvendo:
-   **Reverse Proxy:** Usar Nginx ou Caddy para rotear o tráfego para os contêineres Docker.
-   **Domínios:** Configurar nomes de domínio para suas aplicações.
-   **HTTPS:** Implementar certificados SSL/TLS para comunicação segura.
-   **Orquestração:** Usar ferramentas como Kubernetes para gerenciar a implantação e escalabilidade.

Para este projeto, a configuração do Docker Compose é suficiente para ambientes de desenvolvimento e demonstração.
