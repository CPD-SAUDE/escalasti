# Configuração de Rede para o Sistema de Escala de Sobreaviso

Este documento descreve as configurações de rede necessárias para o correto funcionamento do sistema de escala de sobreaviso, tanto em ambiente de desenvolvimento quanto em produção.

## 1. Ambiente de Desenvolvimento (Local)

Para o desenvolvimento local, o sistema é composto por um frontend (Next.js) e um backend (Node.js/Express) que se comunicam.

### 1.1. Endereços Padrão

- **Frontend (Next.js)**: Geralmente acessível em `http://localhost:3000`
- **Backend (Node.js/Express)**: Geralmente acessível em `http://localhost:3001/api`

### 1.2. Configuração do Frontend (NEXT_PUBLIC_API_URL)

O frontend precisa saber onde encontrar o backend. No arquivo `.env.local` (ou diretamente no código para fins de teste, mas não recomendado para produção), a variável de ambiente `NEXT_PUBLIC_API_URL` deve ser configurada:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001/api
\`\`\`

Se você estiver executando o backend em uma máquina diferente na sua rede local, substitua `localhost` pelo IP da máquina onde o backend está rodando.

### 1.3. Configuração do Backend (CORS)

O backend precisa permitir requisições do frontend. O middleware `cors` no Express já está configurado para permitir todas as origens (`cors()`), o que é conveniente para desenvolvimento. Em produção, é recomendado restringir as origens permitidas.

## 2. Ambiente de Produção (Docker/Portainer)

Ao implantar o sistema usando Docker e Docker Compose (ou Portainer), a comunicação entre os serviços (frontend e backend) é gerenciada pela rede interna do Docker.

### 2.1. Nomes de Serviço no Docker Compose

No `docker-compose.yml`, os serviços são nomeados:
- `backend` para o serviço do backend
- `frontend` para o serviço do frontend

### 2.2. Comunicação Interna do Docker

Dentro da rede Docker, os serviços podem se comunicar usando seus nomes de serviço como nomes de host.

- **Frontend para Backend**: O frontend acessa o backend usando o nome do serviço `backend`.
  No `docker-compose.yml`, a variável de ambiente `NEXT_PUBLIC_API_URL` para o serviço `frontend` é definida como:

  \`\`\`yaml
  environment:
    NEXT_PUBLIC_API_URL: http://backend:3001/api
  \`\`\`
  Isso significa que, dentro do contêiner do frontend, `http://backend:3001/api` resolverá para o IP interno do contêiner do backend na rede `app_network`.

### 2.3. Mapeamento de Portas (Exposição Externa)

As portas são mapeadas do contêiner para o host para que o sistema possa ser acessado de fora do ambiente Docker:

- **Backend**: `3001:3001` (porta 3001 do host mapeada para a porta 3001 do contêiner)
- **Frontend**: `3000:3000` (porta 3000 do host mapeada para a porta 3000 do contêiner)

Isso significa que, após o deploy, você poderá acessar o frontend em `http://<IP_DO_SEU_SERVIDOR>:3000` e o backend (se necessário para testes diretos) em `http://<IP_DO_SEU_SERVIDOR>:3001/api`.

### 2.4. Rede Docker (`app_network`)

Uma rede bridge (`app_network`) é definida no `docker-compose.yml` para que os contêineres `frontend` e `backend` possam se comunicar entre si de forma isolada.

\`\`\`yaml
networks:
  app_network:
    driver: bridge
\`\`\`

## 3. Considerações de Segurança

- **CORS em Produção**: Em um ambiente de produção, é crucial restringir as origens permitidas no CORS do backend para apenas o domínio do seu frontend.
- **Variáveis de Ambiente**: Use um sistema de gerenciamento de variáveis de ambiente seguro (como os recursos do Portainer ou Vercel) para gerenciar `NEXT_PUBLIC_API_URL` e outras configurações sensíveis em produção.
- **Exposição de Portas**: Exponha apenas as portas necessárias para acesso externo. A porta 3001 do backend geralmente não precisa ser exposta publicamente, a menos que você tenha um motivo específico para isso.

Ao seguir estas diretrizes, você garantirá que seu sistema de escala de sobreaviso tenha uma configuração de rede robusta e segura.
