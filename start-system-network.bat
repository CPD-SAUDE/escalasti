@echo off
echo ========================================
echo  SISTEMA DE ESCALA DE SOBREAVISO
echo  Iniciando para Rede Local
echo ========================================

REM Verificar se o Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado. Por favor, instale o Node.js (versao 18 ou superior) e o npm.
    echo Visite https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se as instalacoes foram feitas
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

REM Obter IP da rede
echo Detectando IP da rede...
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
    echo IP detectado: %IP_ADDRESS%
)

if "%IP_ADDRESS%"=="" (
    echo ERRO: Nao foi possivel detectar o IP local.
    echo Verifique sua conexao de rede e execute 'configure-network.bat'.
    pause
    exit /b 1
)

REM Atualizar configuracao do frontend para o IP atual
echo Atualizando configuracao do frontend (NEXT_PUBLIC_API_URL) para o IP da rede...
echo NEXT_PUBLIC_API_URL=http://%IP_ADDRESS%:3001/api > .env.local
echo PORT=3000 >> .env.local
echo ✅ Arquivo .env.local atualizado com o IP da rede.

echo Iniciando backend...
start "Backend - Sistema de Escala (Rede)" cmd /k "cd backend && npm install && npm run init-db && npm start"

REM Aguardar alguns segundos para o backend inicializar
echo.
echo Aguardando backend iniciar... (5 segundos)
timeout /t 5 /nobreak >nul

echo Iniciando frontend...
REM Limpar o cache do Next.js para forcar a leitura das novas variaveis de ambiente
echo Limpando cache do frontend (.next)...
rd /s /q .next
if exist .next (
    echo Nao foi possivel remover a pasta .next. Por favor, remova-a manualmente e tente novamente.
    pause
    exit /b 1
)

REM Forcar o Next.js a escutar em todas as interfaces de rede E passar a variavel de ambiente
echo Iniciando frontend server...
start "Frontend - Sistema de Escala (Rede)" cmd /k "npm install && npm run dev"

echo.
echo ========================================
echo  SISTEMA INICIADO PARA REDE LOCAL!
echo ========================================
echo.
echo SERVIDOR (este computador):
echo - IP: %IP_ADDRESS%
echo - Frontend: http://%IP_ADDRESS%:3000
echo - Backend: http://%IP_ADDRESS%:3001/api
echo.
echo OUTROS COMPUTADORES NA REDE:
echo - Acessem: http://%IP_ADDRESS%:3000
echo - Todos verao os mesmos dados!
echo.
echo IMPORTANTE:
echo - Mantenha este computador ligado
echo - Todos devem estar na mesma rede
echo - Se mudar de rede, execute 'configure-network.bat' novamente.
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
