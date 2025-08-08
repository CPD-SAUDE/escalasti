# Use uma imagem oficial do Node.js como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
# Isso permite que o Docker use o cache de camadas para as dependências
COPY package*.json ./

# Instala as dependências do Node.js, usando --force
RUN npm install --force

# Copia o restante do código da aplicação para o contêiner
COPY . .

# Expõe a porta em que o backend será executado
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
