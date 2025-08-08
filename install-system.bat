@echo off
echo ==================================================
echo  Instalador do Sistema de Escala de Sobreaviso
echo ==================================================
echo.

REM Verifica se o Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado. Por favor, instale o Node.js (versao 18 ou superior) e tente novamente.
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js detectado.

REM Verifica se o npm esta instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: npm nao encontrado. Por favor, instale o Node.js (npm vem junto) e tente novamente.
    pause
    exit /b 1
)
echo npm detectado.

REM Verifica se o Git esta instalado
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Git nao encontrado. Por favor, instale o Git e tente novamente.
    echo Baixe em: https://git-scm.com/downloads
    pause
    exit /b 1
)
echo Git detectado.

echo.
echo Iniciando a instalacao...

REM Navega para o diretorio do script
cd /d "%~dp0"

REM Instala as dependencias do backend
echo.
echo --- Instalando dependencias do Backend ---
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do backend.
    pause
    exit /b 1
)
echo Dependencias do backend instaladas.

REM Inicializa o banco de dados do backend
echo.
echo --- Inicializando o Banco de Dados do Backend ---
call npm run init-db
if %errorlevel% neq 0 (
    echo ERRO: Falha ao inicializar o banco de dados do backend.
    pause
    exit /b 1
)
echo Banco de dados do backend inicializado.
cd ..

REM Instala as dependencias do frontend
echo.
echo --- Instalando dependencias do Frontend ---
REM Usar --force devido a possiveis problemas de resolucao de dependencias
call npm install --force
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do frontend.
    pause
    exit /b 1
)
echo Dependencias do frontend instaladas.

REM Constrói o frontend para producao
echo.
echo --- Construindo o Frontend para Producao ---
REM Define a variavel de ambiente NEXT_PUBLIC_API_URL para o build
set NEXT_PUBLIC_API_URL=http://localhost:3001/api
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir o frontend.
    pause
    exit /b 1
)
echo Frontend construido.

echo.
echo ==================================================
echo  Instalacao Concluida!
echo ==================================================
echo.
echo Para iniciar o sistema:
echo 1. Abra um novo terminal e navegue ate a pasta 'backend'.
echo    Execute: npm start
echo 2. Abra outro terminal e navegue ate a pasta raiz do projeto.
echo    Defina a variavel de ambiente NEXT_PUBLIC_API_URL:
echo    set NEXT_PUBLIC_API_URL=http://localhost:3001/api (Windows CMD)
echo    $env:NEXT_PUBLIC_API_URL="http://localhost:3001/api" (Windows PowerShell)
echo    export NEXT_PUBLIC_API_URL=http://localhost:3001/api (Linux/macOS)
echo    Execute: npm start
echo.
echo Alternativamente, use Docker Compose para iniciar ambos os servicos:
echo    docker compose up --build -d
echo.
echo O frontend estara disponivel em http://localhost:3000
echo O backend estara disponivel em http://localhost:3001
echo.
pause
