@echo off
echo Iniciando o frontend em modo de desenvolvimento...

:: Navega para o diretório raiz do projeto (onde está o package.json do frontend)
:: Assumindo que este script está na raiz do projeto
cd %~dp0

:: Define a variável de ambiente para a URL da API do backend
:: Para desenvolvimento local, o backend deve estar rodando em http://localhost:3001
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: Navega para o diretório do frontend
cd frontend

:: Instala as dependências do frontend (se ainda não estiverem instaladas)
echo Instalando dependências do frontend...
npm install --force

:: Inicia o servidor de desenvolvimento do Next.js
echo Iniciando o servidor de desenvolvimento do Next.js...
npm run dev

:: Mantém a janela do prompt aberta após a execução
pause
