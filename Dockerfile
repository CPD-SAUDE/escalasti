# Dockerfile para o Frontend (Next.js)

# Fase de Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package.json yarn.lock* package-lock.json* ./

# Instala as dependências
RUN npm install --force --no-package-lock --omit=dev

# Copia o restante do código-fonte
COPY . .

# Constrói a aplicação Next.js para produção
RUN npm run build

# Fase de Produção
FROM node:18-alpine AS runner

WORKDIR /app

# Define o usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
