@echo off
echo Iniciando o sistema de escala de sobreaviso...

:: Define a variável de ambiente para o frontend
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: Inicia o backend em segundo plano
echo Iniciando o backend em segundo plano...
start cmd /k "cd backend && npm install && npm run init-db && npm start"

:: Aguarda um pouco para o backend iniciar
echo Aguardando o backend iniciar (5 segundos)...
timeout /t 5 /nobreak

:: Inicia o frontend na janela atual
echo Iniciando o frontend...
npm install
npm run dev

pause
