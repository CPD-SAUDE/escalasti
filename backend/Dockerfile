# Dockerfile para o Backend (Node.js Express)

# Usa a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
# para aproveitar o cache do Docker e instalar as dependências primeiro
COPY package.json package-lock.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta em que a aplicação Express será executada
EXPOSE 3001

# Comando para iniciar a aplicação
# O 'npm run init-db' garante que o banco de dados seja inicializado
# antes de iniciar o servidor.
CMD ["sh", "-c", "npm run init-db && npm start"]
