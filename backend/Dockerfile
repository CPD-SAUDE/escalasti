# Use uma imagem oficial do Node.js como base
FROM node:20-alpine

# Instala as ferramentas de build necessárias para sqlite3
RUN apk add --no-cache python3 make g++

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
# Isso permite que o Docker use o cache de camadas para as dependências
COPY package*.json ./

# Instala as dependências do Node.js, usando npm ci para builds reproduzíveis
RUN npm ci

# Copia o restante do código da aplicação para o contêiner
COPY . .

# Cria o diretório database se não existir
RUN mkdir -p database

# Expõe a porta em que o backend será executado
EXPOSE 3001

# Comando para inicializar o banco de dados e depois iniciar o servidor
CMD ["sh", "-c", "npm run init-db && npm start"]
