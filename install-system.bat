@echo off
echo Iniciando a instalacao do Sistema de Escala de Sobreaviso...

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado. Por favor, instale o Node.js (versao 18 ou superior) e o npm.
    echo Visite https://nodejs.org/
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
    echo ERRO: Falha ao instalar dependencias do backend.
    pause
    exit /b 1
)
echo Dependencias do backend instaladas.

REM Inicializar banco de dados
echo Inicializando o banco de dados do backend...
npm run init-db
if %errorlevel% neq 0 (
    echo ERRO: Falha ao inicializar o banco de dados do backend.
    pause
    exit /b 1
)
echo Banco de dados do backend inicializado.

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
    echo ERRO: Falha ao instalar dependencias do frontend.
    pause
    exit /b 1
)
echo Dependencias do frontend instaladas.

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
