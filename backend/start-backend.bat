@echo off
echo ========================================
echo  SISTEMA DE ESCALA DE SOBREAVISO
echo  Iniciando Backend...
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
    echo Instalando dependencias...
    cd backend
    npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependencias!
        pause
        exit /b 1
    )
)

REM Inicializar banco de dados
echo Inicializando banco de dados...
npm run init-db
if %errorlevel% neq 0 (
    echo ERRO: Falha ao inicializar banco de dados!
    pause
    exit /b 1
)

REM Iniciar servidor
echo Iniciando servidor...
cd backend
npm start
cd ..

pause
