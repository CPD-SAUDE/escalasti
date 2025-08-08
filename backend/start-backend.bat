@echo off
echo Starting backend...

:: Navega para o diretório do backend
cd backend

:: Instala as dependências (se ainda não estiverem instaladas)
echo Installing backend dependencies...
npm install

:: Inicializa o banco de dados (cria o arquivo e tabelas se não existirem)
echo Initializing database...
npm run init-db

:: Inicia o servidor backend
echo Starting backend server...
npm start

pause
