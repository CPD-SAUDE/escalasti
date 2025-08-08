FROM node:20-alpine

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Remover package-lock.json se existir e instalar dependências
RUN rm -f package-lock.json && \
    npm cache clean --force && \
    npm install --force --no-package-lock

# Copiar o resto dos arquivos
COPY . .

# Definir variáveis de ambiente
ENV NEXT_PUBLIC_API_URL=http://backend:3001/api
ENV NODE_ENV=production

# Build da aplicação
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
