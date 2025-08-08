@echo off
echo Iniciando o sistema de escala de sobreaviso com rede Docker...

:: 1. Verifica se o Docker está em execução
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Docker não está em execução. Por favor, inicie o Docker Desktop.
    pause
    exit /b 1
)

:: 2. Navega para o diretório raiz do projeto
:: Assumindo que este script está na raiz do repositório clonado
cd %~dp0

REM Este script inicia o backend e o frontend em redes separadas,
REM configurando o IP do backend no frontend.
REM Útil para depuração ou cenários específicos de rede.

echo ==================================================
echo           Iniciando Sistema com Rede Separada
echo ==================================================

REM 1. Iniciar o Backend
echo.
echo 1. Iniciando o Backend...
start cmd /k "cd backend && npm install --force && npm run init-db && npm run dev"
echo Aguardando o backend iniciar (5 segundos)...
timeout /t 5 /nobreak >nul
echo.

REM 2. Obter o IP do Backend
echo 2. Obtendo o IP do Backend...
for /f "tokens=*" %%i in ('node backend\scripts\get-network-ip.js') do set "BACKEND_IP=%%i"
echo IP do Backend: %BACKEND_IP%
echo.

REM 3. Configurar o Frontend com o IP do Backend
echo 3. Configurando o Frontend com o IP do Backend...
echo NEXT_PUBLIC_API_URL=http://%BACKEND_IP%:3001/api > .env.local
echo Arquivo .env.local do frontend atualizado.
echo.

REM 4. Iniciar o Frontend
echo 4. Iniciando o Frontend...
start cmd /k "npm install --force && npm run dev"
echo.

echo ==================================================
echo           Sistema Iniciado!
echo ==================================================
echo.
echo O frontend deve estar acessivel em http://localhost:3000
echo O backend deve estar acessivel em http://%BACKEND_IP%:3001
echo.
echo Pressione qualquer tecla para fechar esta janela.
pause >nul
