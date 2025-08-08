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

REM Navega para o diretório raiz do projeto (onde está o package.json do frontend)
cd %~dp0

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo Instalando dependencias do frontend...
    call npm install --force
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependencias do frontend!
        pause
        exit /b 1
    )
)

REM Define a variável de ambiente para a URL da API (para o build)
REM No ambiente de build, pode ser localhost ou o IP do backend se não for Docker
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

REM Constrói a aplicação Next.js
echo Executando npm run build...
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir o frontend!
    pause
    exit /b 1
)

echo Frontend build complete.

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
