@echo off
echo Configurando a rede para o sistema de escala de sobreaviso...

REM Este script tenta obter o IP da rede e configurar o frontend.
REM É mais útil para ambientes de desenvolvimento sem Docker.

REM Obtém o IP da rede do backend
echo Obtendo o IP da rede...
for /f "delims=" %%i in ('node backend\scripts\get-network-ip.js') do set NETWORK_IP=%%i

if "%NETWORK_IP%"=="" (
    echo ERRO: Nao foi possivel obter o IP da rede. Verifique sua conexao.
    pause
    exit /b 1
)

echo IP da rede detectado: %NETWORK_IP%

REM Define a variavel de ambiente NEXT_PUBLIC_API_URL para o frontend
REM Isso permite que o frontend se conecte ao backend usando o IP da rede
echo Definindo NEXT_PUBLIC_API_URL para o frontend...
set NEXT_PUBLIC_API_URL=http://%NETWORK_IP%:3001/api

echo Variavel NEXT_PUBLIC_API_URL definida como: %NEXT_PUBLIC_API_URL%
echo.
echo Para usar esta configuracao, inicie o frontend na mesma sessao do CMD:
echo npm run dev
echo.
echo Se estiver usando Docker, esta configuracao nao e necessaria, pois o Docker Compose gerencia a rede.

pause
