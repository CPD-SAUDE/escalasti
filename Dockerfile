# Use a imagem oficial do Node.js como base
FROM node:18-alpine AS base

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
# Usa --force conforme solicitado pelo usuário
RUN npm install --force

# Copia o restante do código da aplicação
COPY . .

# Define a variável de ambiente para a URL da API do backend
# Esta variável será substituída pelo docker-compose.yml em produção
# Mas é útil para builds independentes ou para referência
ENV NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Expõe a porta em que o Next.js será executado
EXPOSE 3000

# Comando para iniciar o servidor de desenvolvimento do Next.js
# Para produção, você usaria `npm run build` e `npm start`
CMD ["npm", "run", "dev"]

# --- Estágio de Build para Produção (Opcional, mas boa prática) ---
FROM base AS builder

# Instala as dependências de produção e constrói a aplicação Next.js
RUN npm run build

# --- Estágio Final para Produção ---
FROM node:18-alpine AS runner

WORKDIR /app

# Define o usuário 'nextjs' para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos de produção do estágio 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Define a variável de ambiente para a URL da API do backend
# Esta variável será substituída pelo docker-compose.yml em produção
ENV NEXT_PUBLIC_API_URL=http://backend:3001/api

# Define o usuário para executar a aplicação
USER nextjs

# Expõe a porta em que o Next.js será executado
EXPOSE 3000

# Comando para iniciar a aplicação Next.js em produção
CMD ["node", "server.js"]
