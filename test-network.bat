@echo off
REM Este script testa a conectividade de rede entre o frontend e o backend
REM quando rodando localmente (sem Docker Compose).

echo ==================================================
echo           Teste de Conectividade de Rede
echo ==================================================

REM 1. Obter o IP da rede local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do (
    set "IP_ADDRESS=%%a"
)
set "IP_ADDRESS=%IP_ADDRESS: =%"
set "IP_ADDRESS=%IP_ADDRESS:~1%"

echo IP da rede local detectado: %IP_ADDRESS%
echo.

REM 2. Testar a conexão com o backend
echo 2. Tentando conectar ao backend em http://%IP_ADDRESS%:3001/api/status...
curl -s -o NUL -w "%%{http_code}" http://%IP_ADDRESS%:3001/api/status > http_code.txt
set /p HTTP_CODE=<http_code.txt
del http_code.txt

if "%HTTP_CODE%"=="200" (
    echo SUCESSO: Backend esta respondendo (HTTP 200 OK).
) else (
    echo ERRO: Backend nao esta respondendo ou retornou codigo %HTTP_CODE%.
    echo Certifique-se de que o backend esta rodando e acessivel em http://%IP_ADDRESS%:3001.
)
echo.

REM 3. Verificar a configuracao NEXT_PUBLIC_API_URL no .env.local
echo 3. Verificando NEXT_PUBLIC_API_URL no .env.local...
if exist ".env.local" (
    for /f "tokens=*" %%a in ('findstr "NEXT_PUBLIC_API_URL" .env.local') do (
        set "ENV_VAR=%%a"
    )
    if defined ENV_VAR (
        echo NEXT_PUBLIC_API_URL encontrado: %ENV_VAR%
        if "%ENV_VAR%"=="NEXT_PUBLIC_API_URL=http://%IP_ADDRESS%:3001/api" (
            echo SUCESSO: NEXT_PUBLIC_API_URL esta configurado corretamente para o IP da rede.
        ) else (
            echo AVISO: NEXT_PUBLIC_API_URL pode nao estar apontando para o IP correto.
            echo Execute 'configure-network.bat' para corrigir.
        )
    ) else (
        echo AVISO: NEXT_PUBLIC_API_URL nao encontrado no .env.local.
        echo Execute 'configure-network.bat' para configurar.
    )
) else (
    echo AVISO: Arquivo .env.local nao encontrado.
    echo Execute 'configure-network.bat' para criar e configurar.
)
echo.

echo ==================================================
echo           Teste Concluido!
echo ==================================================
echo.
pause
