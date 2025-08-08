# Estágio 1: Construção da aplicação Next.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do Node.js, usando --force conforme solicitado
RUN npm install --force

# Copia o restante do código da aplicação
COPY . .

# Define a variável de ambiente NEXT_PUBLIC_API_URL para o processo de build
# Isso garante que o frontend saiba onde encontrar o backend durante a construção
ENV NEXT_PUBLIC_API_URL=http://backend:3001/api

# Constrói a aplicação Next.js para produção
RUN npm run build

# Estágio 2: Execução da aplicação Next.js
FROM node:20-alpine AS runner

WORKDIR /app

# Copia os arquivos de build do estágio anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Define as variáveis de ambiente para o tempo de execução
# O frontend se conectará ao serviço 'backend' dentro da rede Docker
ENV NEXT_PUBLIC_API_URL=http://backend:3001/api
ENV PORT=3000

# Expõe a porta em que o frontend será executado
EXPOSE 3000

# Comando para iniciar a aplicação em modo de produção
CMD ["npm", "start"]
