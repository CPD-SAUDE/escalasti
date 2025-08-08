@echo off
echo ========================================
echo  SISTEMA DE ESCALA DE SOBREAVISO
echo  Iniciando Sistema Completo
echo ========================================

REM Verificar se o Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado. Por favor, instale o Node.js (versao 18 ou superior) e o npm.
    echo Visite https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se as instalações foram feitas
if not exist "backend\node_modules" (
    echo ERRO: Backend nao instalado!
    echo Execute 'install-system.bat' primeiro.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo ERRO: Frontend nao instalado!
    echo Execute 'install-system.bat' primeiro.
    pause
    exit /b 1
)

REM Navega para o diretorio raiz do projeto
cd /d "%~dp0"

echo Iniciando backend...
start "Backend - Sistema de Escala" cmd /k "cd backend && npm install && npm run init-db && npm start"

REM Aguardar alguns segundos para o backend inicializar
timeout /t 5 /nobreak >nul

REM Cria ou atualiza o arquivo .env.local para apontar para localhost
echo Criando/Atualizando .env.local para localhost...
echo NEXT_PUBLIC_API_URL=http://localhost:3001/api > .env.local

echo Iniciando frontend...
start "Frontend - Sistema de Escala" cmd /k "npm install && npm run dev"

echo.
echo ========================================
echo  SISTEMA INICIADO!
echo ========================================
echo.
echo O sistema esta sendo iniciado em duas janelas:
echo 1. Backend (API) - Porta 3001
echo 2. Frontend (Interface) - Porta 3000
echo.
echo Aguarde alguns segundos e acesse:
echo http://localhost:3000
echo.
echo Para acessar de outros dispositivos na rede:
echo http://[SEU_IP]:3000
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
