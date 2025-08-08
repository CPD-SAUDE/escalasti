@echo off
echo Iniciando o backend...

:: Navega para o diretório do backend
cd backend

:: Instala as dependências (se ainda não estiverem instaladas)
echo Instalando dependências do backend...
npm install

:: Inicializa o banco de dados (cria o arquivo e tabelas se não existirem)
echo Inicializando o banco de dados...
npm run init-db

:: Inicia o servidor backend
echo Iniciando o servidor backend...
npm start

pause
