@echo off
echo Configurando a rede para o sistema de escala...

:: Verifica se o Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado. Por favor, instale o Node.js (versao 18 ou superior) e o npm.
    echo Visite https://nodejs.org/
    pause
    exit /b 1
)

:: Navega para o diretorio raiz do projeto
cd /d "%~dp0"

:: Obtem o IP da maquina na rede local usando o script Node.js
echo Obtendo o IP da rede local...
for /f "delims=" %%i in ('node backend\scripts\get-network-ip.js') do set "IP_ADDRESS=%%i"

if "%IP_ADDRESS%"=="" (
    echo Nao foi possivel obter o IP da rede. Usando localhost.
    set "IP_ADDRESS=localhost"
) else (
    echo IP da rede local detectado: %IP_ADDRESS%
)

:: Atualiza o arquivo .env.local com o IP da rede
echo Atualizando .env.local com NEXT_PUBLIC_API_URL=http://%IP_ADDRESS%:3001/api
echo NEXT_PUBLIC_API_URL=http://%IP_ADDRESS%:3001/api > .env.local

echo Configuracao de rede concluida.
echo Lembre-se de reiniciar o frontend (npm run dev) para que as alteracoes tenham efeito.
pause
