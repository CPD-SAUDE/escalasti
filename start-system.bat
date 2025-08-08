@echo off
echo ========================================
echo  SISTEMA DE ESCALA DE SOBREAVISO
echo  Iniciando Sistema Completo
echo ========================================

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

echo Iniciando backend...
start "Backend - Sistema de Escala" cmd /k "cd backend && npm start"

REM Aguardar alguns segundos para o backend inicializar
timeout /t 5 /nobreak >nul

echo Iniciando frontend...
start "Frontend - Sistema de Escala" cmd /k "npm run dev"

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
