@echo off
echo Iniciando o sistema (backend e frontend) localmente...

:: Define a variável de ambiente para o frontend
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: Inicia o backend em uma nova janela do terminal
echo Iniciando o backend em uma nova janela...
start cmd /k "cd backend && npm start"

:: Aguarda um pouco para o backend iniciar
timeout /t 5 /nobreak > NUL

:: Inicia o frontend na janela atual
echo Iniciando o frontend...
npm run dev

pause
