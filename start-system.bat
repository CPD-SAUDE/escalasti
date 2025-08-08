@echo off
echo ==================================================
echo  Iniciando o Sistema de Escala de Sobreaviso (Local)
echo ==================================================
echo.

REM Este script e para iniciar o sistema em um ambiente de desenvolvimento local
REM sem Docker Compose, onde ambos os servicos rodam no localhost.

REM Inicia o backend em uma nova janela do CMD
echo.
echo --- Iniciando o Backend em uma nova janela ---
start cmd /k "cd /d "%~dp0\backend" && npm start"

REM Aguarda um pouco para o backend iniciar
timeout /t 5 /nobreak >nul

REM Define a variavel de ambiente NEXT_PUBLIC_API_URL para o frontend
echo.
echo --- Iniciando o Frontend ---
echo Definindo NEXT_PUBLIC_API_URL para o frontend como: http://localhost:3001/api
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

REM Inicia o frontend na janela atual
call npm start

echo.
echo ==================================================
echo  Sistema Iniciado (Local)
echo ==================================================
echo O frontend estara disponivel em http://localhost:3000
echo O backend estara disponivel em http://localhost:3001
echo.
pause
