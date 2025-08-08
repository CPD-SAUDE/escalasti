# Configuração de Rede para o Sistema de Escala de Sobreaviso

Este documento descreve como configurar a rede para o sistema de escala de sobreaviso, garantindo que o frontend e o backend possam se comunicar corretamente, especialmente em ambientes Docker.

## 1. Visão Geral da Rede Docker

O `docker-compose.yml` define uma rede bridge chamada `app_network`. Esta rede permite que os contêineres `frontend` e `backend` se comuniquem entre si usando seus nomes de serviço como nomes de host.

- **Frontend:** Acessível externamente na porta `3000` do host.
- **Backend:** Acessível externamente na porta `3001` do host. Internamente, o frontend se comunica com o backend usando `http://backend:3001/api`.

## 2. Variáveis de Ambiente

O frontend precisa saber onde encontrar o backend. Isso é configurado através da variável de ambiente `NEXT_PUBLIC_API_URL`.

- **No `docker-compose.yml`:**
  \`\`\`yaml
  frontend:
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001/api
  \`\`\`
  Quando rodando via Docker Compose, `backend` é resolvido para o IP interno do contêiner do backend dentro da `app_network`.

## 3. Acesso Externo (Host)

Para acessar o sistema do seu navegador no host, você usará:

- **Frontend:** `http://localhost:3000`
- **Backend (API):** `http://localhost:3001/api` (para testes diretos da API, se necessário)

## 4. Solução de Problemas de Rede

### Contêineres não se comunicam:

- **Verifique a rede Docker:**
  \`\`\`bash
  docker network ls
  docker network inspect app_network
  \`\`\`
  Certifique-se de que ambos os contêineres (`frontend` e `backend`) estão conectados à `app_network`.

- **Verifique os logs dos contêineres:**
  \`\`\`bash
  docker logs <nome_do_container_frontend>
  docker logs <nome_do_container_backend>
  \`\`\`
  Procure por erros de conexão ou mensagens relacionadas à API.

- **Firewall:**
  Certifique-se de que seu firewall local não está bloqueando as portas `3000` e `3001`.

### Frontend não consegue se conectar ao Backend:

- **Variável `NEXT_PUBLIC_API_URL`:**
  Confirme se a variável `NEXT_PUBLIC_API_URL` no `docker-compose.yml` está configurada corretamente para `http://backend:3001/api`. O nome `backend` deve corresponder ao nome do serviço do backend no `docker-compose.yml`.

- **Ordem de inicialização:**
  O `depends_on: - backend` no serviço `frontend` do `docker-compose.yml` garante que o backend seja iniciado antes do frontend, mas não garante que o backend esteja *pronto* para aceitar conexões. Se o backend demorar para iniciar, o frontend pode tentar se conectar muito cedo. Isso geralmente é mitigado com lógicas de retry no frontend ou com ferramentas como `wait-for-it.sh` no Dockerfile (não implementado aqui, mas uma opção avançada).

## 5. Configuração de Rede para Desenvolvimento Local (sem Docker Compose)

Se você estiver rodando o frontend e o backend separadamente (sem Docker Compose), você precisará configurar a variável `NEXT_PUBLIC_API_URL` para apontar para o IP ou hostname do seu backend no host.

- **Exemplo (se o backend estiver rodando localmente na porta 3001):**
  - **No Windows (CMD/PowerShell):**
    \`\`\`cmd
    set NEXT_PUBLIC_API_URL=http://localhost:3001/api
    npm run dev
    \`\`\`
  - **No Linux/macOS:**
    \`\`\`bash
    export NEXT_PUBLIC_API_URL=http://localhost:3001/api
    npm run dev
    \`\`\`

Lembre-se de que, ao usar o Docker Compose, a comunicação interna entre os contêineres é gerenciada pela rede Docker, e `localhost` dentro de um contêiner se refere ao próprio contêiner, não ao host ou a outros contêineres. Por isso, usamos `http://backend:3001/api`.
