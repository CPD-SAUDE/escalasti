@echo off
echo ==================================================
echo  Iniciando o Sistema de Escala de Sobreaviso (Rede)
echo ==================================================
echo.

REM Este script e para iniciar o sistema em um ambiente de rede local
REM sem Docker Compose, onde o backend e o frontend precisam se comunicar
REM usando o IP da maquina.

REM Obtem o IP da rede do backend
echo Obtendo o IP da rede...
for /f "delims=" %%i in ('node backend\scripts\get-network-ip.js') do set NETWORK_IP=%%i

if "%NETWORK_IP%"=="" (
    echo ERRO: Nao foi possivel obter o IP da rede. Verifique sua conexao.
    pause
    exit /b 1
)

echo IP da rede detectado: %NETWORK_IP%

REM Inicia o backend em uma nova janela do CMD
echo.
echo --- Iniciando o Backend em uma nova janela ---
start cmd /k "cd /d "%~dp0\backend" && npm start"

REM Aguarda um pouco para o backend iniciar
timeout /t 5 /nobreak >nul

REM Define a variavel de ambiente NEXT_PUBLIC_API_URL para o frontend
echo.
echo --- Iniciando o Frontend ---
echo Definindo NEXT_PUBLIC_API_URL para o frontend como: http://%NETWORK_IP%:3001/api
set NEXT_PUBLIC_API_URL=http://%NETWORK_IP%:3001/api

REM Inicia o frontend na janela atual
call npm start

echo.
echo ==================================================
echo  Sistema Iniciado (Rede)
echo ==================================================
echo O frontend estara disponivel em http://localhost:3000
echo O backend estara disponivel em http://%NETWORK_IP%:3001
echo.
pause
