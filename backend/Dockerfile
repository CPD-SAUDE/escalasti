# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta em que o backend será executado
EXPOSE 3001

# Comando para inicializar o banco de dados e depois iniciar o servidor
# O `npm run init-db` garante que o arquivo database.sqlite e as tabelas sejam criados
# antes do servidor tentar se conectar a ele.
CMD ["sh", "-c", "npm run init-db && npm start"]
