@echo off
echo Iniciando o backend...

:: Navega para o diretório do backend
cd backend

:: Instala as dependências se ainda não estiverem instaladas
echo Verificando e instalando dependências do backend...
npm install

:: Inicializa o banco de dados (cria as tabelas se não existirem)
echo Inicializando o banco de dados...
npm run init-db

:: Inicia o servidor backend
echo Iniciando o servidor backend...
npm start

:: Mantém a janela aberta após a execução
pause
