@echo off
echo Iniciando o backend...

:: Navega para o diretório do backend
cd backend

:: Instala as dependências (se ainda não estiverem instaladas)
echo Instalando dependências do backend...
npm install --force

:: Inicializa o banco de dados (cria o arquivo database.db e as tabelas se não existirem)
echo Inicializando o banco de dados...
npm run init-db

:: Inicia o servidor backend em modo de desenvolvimento (com nodemon)
echo Iniciando o servidor backend...
npm run dev

:: Mantém a janela do prompt aberta após a execução
pause
