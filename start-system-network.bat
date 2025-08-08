@echo off
setlocal

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

REM Configurando a Rede do Sistema
echo ==================================================
echo Configurando a Rede do Sistema
echo ==================================================
echo.

REM Tenta obter o IP da rede local usando o script Node.js
echo Obtendo o IP da rede local do sistema...
node backend\scripts\get-network-ip.js > temp_ip.txt
set /p SYSTEM_IP=<temp_ip.txt
del temp_ip.txt

if "%SYSTEM_IP%"=="" (
    echo ERRO: Nao foi possivel obter o IP da rede local.
    echo Por favor, verifique sua conexao de rede.
    goto :eof
)

echo IP da rede local detectado: %SYSTEM_IP%
echo.

REM Define a URL do backend. Ajuste se o backend estiver em uma porta diferente ou host.
set BACKEND_URL=http://localhost:3001/api/config/network-ip

echo Enviando o IP (%SYSTEM_IP%) para o backend em %BACKEND_URL%...

REM Usa curl para enviar o IP para o backend
REM Se curl nao estiver disponivel, voce pode precisar instala-lo ou usar outra ferramenta.
curl -X POST -H "Content-Type: application/json" -d "{\"networkIp\": \"%SYSTEM_IP%\"}" %BACKEND_URL%

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao enviar o IP para o backend.
    echo Certifique-se de que o backend esta rodando em http://localhost:3001.
) else (
    echo.
    echo IP da rede configurado com sucesso no backend.
)

echo.
echo ==================================================
echo Configuracao de Rede Concluida
echo ==================================================
echo.

pause

REM Iniciando o sistema via Docker Compose...
echo Iniciando o sistema via Docker Compose...

:: Este script assume que você está na raiz do projeto onde o docker-compose.yml está.

:: Constrói e inicia os serviços em segundo plano
docker compose up --build -d

if %errorlevel% neq 0 (
    echo Erro ao iniciar o sistema Docker.
    echo Verifique se o Docker Desktop está rodando e se não há conflitos de porta.
    pause
    exit /b %errorlevel%
)

echo.
echo Sistema iniciado com sucesso!
echo O frontend deve estar acessível em http://localhost:3000
echo O backend deve estar acessível em http://localhost:3001
echo.
echo Para parar o sistema, execute: docker compose down
echo.

pause

REM Starting system with network configuration...
echo Starting system with network configuration...
call backend\start-backend.bat
call start-frontend.bat

endlocal
