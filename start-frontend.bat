@echo off
echo ========================================
echo  SISTEMA DE ESCALA DE SOBREAVISO
echo  Iniciando Frontend...
echo ========================================

REM Verificar se Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo ERRO: Node.js nao encontrado!
  echo Por favor, instale o Node.js antes de continuar.
  pause
  exit /b 1
)

REM Verificar se as dependencias estao instaladas
if not exist "node_modules" (
  echo Instalando dependencias...
  npm install
  if %errorlevel% neq 0 (
      echo ERRO: Falha ao instalar dependencias!
      pause
      exit /b 1
  )
)

REM Verificar se arquivo .env.local existe
if not exist ".env.local" (
  echo Criando arquivo de configuracao...
  echo NEXT_PUBLIC_API_URL=http://localhost:3001/api > .env.local
  echo PORT=3000 >> .env.local
)

REM Limpar o cache do Next.js para forcar a leitura das novas variaveis de ambiente
echo Limpando cache do frontend (.next)...
rd /s /q .next
if exist .next (
    echo Nao foi possivel remover a pasta .next. Por favor, remova-a manualmente e tente novamente.
    pause
    exit /b 1
)

REM Iniciar frontend
echo Iniciando frontend...

:: Navega para o diretorio raiz do projeto (onde o frontend esta)
cd /d "%~dp0"

:: Inicia o servidor de desenvolvimento do frontend
npm run dev

:: Mantem a janela aberta apos a execucao
pause
