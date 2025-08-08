@echo off
echo Iniciando o frontend...

:: Define a variável de ambiente para o frontend
:: No ambiente Docker, esta variável será definida no Dockerfile
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: Inicia o servidor de desenvolvimento do Next.js
npm run dev

pause
