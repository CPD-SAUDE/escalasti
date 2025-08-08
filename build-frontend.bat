@echo off
echo ========================================
echo  SISTEMA DE ESCALA DE SOBREAVISO
echo  Construindo Frontend para Producao
echo ========================================

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js antes de continuar.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    npm install
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependencias do frontend!
        pause
        exit /b 1
    )
)

REM Obter IP da rede para configurar o .env.local antes da build
echo Detectando IP da rede para configuracao da build...
for /f "tokens=*" %%i in ('node backend\scripts\get-network-ip.js ^| findstr "IP Principal"') do (
    set "LINE=%%i"
    for /f "tokens=2 delims=:" %%j in ("!LINE!") do set LOCAL_IP=%%j
)
set LOCAL_IP=%LOCAL_IP: =%

if "%LOCAL_IP%"=="" (
    echo ERRO: Nao foi possivel detectar o IP local para a build.
    echo Verifique sua conexao de rede.
    pause
    exit /b 1
)

echo IP detectado para build: %LOCAL_IP%

echo Atualizando .env.local para a build...
echo NEXT_PUBLIC_API_URL=http://%LOCAL_IP%:3001/api > .env.local
echo PORT=3000 >> .env.local
echo ✅ Arquivo .env.local atualizado para a build.

echo Construindo o frontend (npm run build)...
npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir o frontend!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  FRONTEND CONSTRUIDO COM SUCESSO!
echo ========================================
echo.
echo Agora voce pode iniciar o frontend em modo de producao:
echo npm start
echo.
echo Ou use 'start-system-network.bat' para iniciar tudo.
echo.
pause
