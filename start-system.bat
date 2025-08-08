@echo off
echo ==================================================
echo           Iniciando Sistema Localmente
echo ==================================================

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

:: 3. Constrói e inicia os contêineres Docker
echo Construindo e iniciando os contêineres Docker...
docker compose up --build -d
if %errorlevel% neq 0 (
    echo Erro: Falha ao construir ou iniciar os contêineres Docker. Verifique os logs acima.
    pause
    exit /b 1
)
echo Contêineres Docker iniciados com sucesso!

REM 4. Iniciar o Backend
echo.
echo 1. Iniciando o Backend...
start cmd /k "cd backend && npm install --force && npm run init-db && npm run dev"
echo Aguardando o backend iniciar (5 segundos)...
timeout /t 5 /nobreak >nul
echo.

REM 5. Iniciar o Frontend
echo 2. Iniciando o Frontend...
REM Certifique-se de que NEXT_PUBLIC_API_URL esteja configurado para localhost:3001 no .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:3001/api > .env.local
start cmd /k "npm install --force && npm run dev"
echo.

echo ==================================================
echo           Sistema Iniciado!
echo ==================================================
echo.
echo O frontend deve estar acessivel em http://localhost:3000
echo O backend deve estar acessivel em http://localhost:3001
echo.
echo Pressione qualquer tecla para fechar esta janela.
pause >nul
