@echo off
echo Starting frontend server...
cd %~dp0
npm install

:: Define a variável de ambiente para o frontend
:: No ambiente Docker, esta variável será definida no Dockerfile
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: Inicia o servidor de desenvolvimento do Next.js
call npm run dev

pause
