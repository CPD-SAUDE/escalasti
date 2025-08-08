@echo off
echo Iniciando a instalação completa do sistema...

:: Define a variável de ambiente para o frontend
:: No ambiente Docker, esta variável será definida no Dockerfile
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: 1. Navega para o diretório do backend e instala dependências
echo.
echo --- Instalando dependências do backend ---
cd backend
npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependências do backend.
    pause
    exit /b %errorlevel%
)
echo Dependências do backend instaladas.

:: 2. Inicializa o banco de dados do backend
echo.
echo --- Inicializando o banco de dados do backend ---
npm run init-db
if %errorlevel% neq 0 (
    echo Erro ao inicializar o banco de dados do backend.
    pause
    exit /b %errorlevel%
)
echo Banco de dados do backend inicializado.

:: 3. Volta para o diretório raiz e instala dependências do frontend
echo.
echo --- Instalando dependências do frontend ---
cd ..
npm install --force
if %errorlevel% neq 0 (
    echo Erro ao instalar dependências do frontend.
    pause
    exit /b %errorlevel%
)
echo Dependências do frontend instaladas.

:: 4. Constrói o frontend para produção
echo.
echo --- Construindo o frontend ---
npm run build
if %errorlevel% neq 0 (
    echo Erro ao construir o frontend.
    pause
    exit /b %errorlevel%
)
echo Frontend construído.

echo.
echo --- Instalação completa! ---
echo Agora você pode iniciar o backend e o frontend separadamente ou usar o Docker Compose.
echo.
echo Para iniciar o backend: cd backend && npm start
echo Para iniciar o frontend: npm start
echo.
echo Para usar Docker Compose: docker compose up --build -d
echo.

pause
