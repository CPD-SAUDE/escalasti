@echo off
echo Iniciando o backend...

REM Navega para o diretório do backend
cd backend

REM Instala as dependências (se ainda não o fez)
echo Instalando dependências do backend...
call npm install

REM Inicializa o banco de dados (cria as tabelas se não existirem)
echo Inicializando o banco de dados...
call npm run init-db

REM Inicia o servidor backend
echo Iniciando o servidor backend...
call npm start

echo Backend iniciado.
pause
