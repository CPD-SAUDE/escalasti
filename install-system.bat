@echo off
echo Instalando o sistema de escala de sobreaviso...

echo.
echo --- Instalando dependências do Backend ---
cd backend
npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependências do backend.
    pause
    exit /b %errorlevel%
)
echo Dependências do backend instaladas.

echo.
echo --- Inicializando o banco de dados do Backend ---
npm run init-db
if %errorlevel% neq 0 (
    echo Erro ao inicializar o banco de dados do backend.
    pause
    exit /b %errorlevel%
)
echo Banco de dados do backend inicializado.
cd ..

echo.
echo --- Instalando dependências do Frontend ---
npm install
if %errorlevel% neq 0 (
    echo Erro ao instalar dependências do frontend.
    pause
    exit /b %errorlevel%
)
echo Dependências do frontend instaladas.

echo.
echo --- Construindo o Frontend ---
npm run build
if %errorlevel% neq 0 (
    echo Erro ao construir o frontend.
    pause
    exit /b %errorlevel%
)
echo Frontend construído.

echo.
echo Instalação e configuração do sistema concluídas com sucesso!
pause
