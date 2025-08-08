@echo off
echo ========================================
echo  SISTEMA DE ESCALA DE SOBREAVISO
echo  Construindo Frontend para Producao
echo ========================================

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado. Por favor, instale o Node.js (versao 18 ou superior) e o npm.
    echo Visite https://nodejs.org/
    pause
    exit /b 1
)

REM Navega para o diretório raiz do projeto (onde o frontend esta)
cd /d "%~dp0"

REM Verificar se as dependências estão instaladas
echo Verificando e instalando dependencias do frontend...
npm install

REM Obter IP da rede para configurar o .env.local antes da build
echo Obtendo o IP da rede local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do (
    set "IP_ADDRESS=%%a"
    set "IP_ADDRESS=!IP_ADDRESS:~1!"
    goto :found_ip
)
:found_ip
if not defined IP_ADDRESS (
    echo Nao foi possivel obter o IP da rede. Usando localhost.
    set "IP_ADDRESS=localhost"
) else (
    echo IP da rede local detectado: %IP_ADDRESS%
)

REM Atualizar .env.local para a build...
echo Atualizando .env.local com NEXT_PUBLIC_API_URL=http://%IP_ADDRESS%:3001/api
echo NEXT_PUBLIC_API_URL=http://%IP_ADDRESS%:3001/api > .env.local

REM Executar o build do Next.js
echo Executando npm run build...
npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir o frontend!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  FRONTEND CONSTRUIDO COM SUCESSO!
echo ========================================
echo.
echo Os arquivos de producao estao na pasta .next/
echo.
echo Agora voce pode iniciar o frontend em modo de producao:
echo npm start
echo.
echo Ou use 'start-system-network.bat' para iniciar tudo.
echo.
pause
