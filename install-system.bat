@echo off
echo ========================================
echo  SISTEMA DE ESCALA DE SOBREAVISO
echo  Instalacao Completa
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

echo Node.js encontrado: 
node --version

echo.
echo ========================================
echo  INSTALANDO BACKEND
echo ========================================

REM Navegar para pasta backend
cd backend

REM Instalar dependências do backend
echo Instalando dependencias do backend...
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do backend!
    pause
    exit /b 1
)

REM Inicializar banco de dados
echo Inicializando banco de dados...
npm run init-db
if %errorlevel% neq 0 (
    echo ERRO: Falha ao inicializar banco de dados!
    pause
    exit /b 1
)

echo Backend instalado com sucesso!

REM Voltar para pasta raiz
cd ..

echo.
echo ========================================
echo  INSTALANDO FRONTEND
echo ========================================

REM Instalar dependências do frontend
echo Instalando dependencias do frontend...
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do frontend!
    pause
    exit /b 1
)

echo Frontend instalado com sucesso!

echo.
echo ========================================
echo  CONFIGURANDO VARIAVEIS DE AMBIENTE
echo ========================================

REM Criar arquivo .env.local se não existir
if not exist ".env.local" (
    echo Criando arquivo de configuracao...
    echo NEXT_PUBLIC_API_URL=http://localhost:3001/api > .env.local
    echo PORT=3000 >> .env.local
    echo Arquivo .env.local criado!
) else (
    echo Arquivo .env.local ja existe.
)

echo.
echo ========================================
echo  INSTALACAO CONCLUIDA!
echo ========================================
echo.
echo O sistema foi instalado com sucesso!
echo.
echo Para iniciar o sistema:
echo 1. Execute 'start-system.bat' para iniciar tudo automaticamente
echo    OU
echo 2. Execute manualmente:
echo    - Backend: execute 'start-backend.bat' na pasta backend
echo    - Frontend: execute 'start-frontend.bat' na pasta raiz
echo.
echo Acesso ao sistema:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:3001/api/status
echo.
echo Para acessar de outros dispositivos na rede:
echo - Substitua 'localhost' pelo IP deste computador
echo - Exemplo: http://192.168.1.100:3000
echo.
pause
