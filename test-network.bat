@echo off
echo Testando a conectividade de rede...

REM Este script tenta pingar um endereco IP para verificar a conectividade.
REM Pode ser usado para diagnosticar problemas de rede entre containers ou maquinas.

REM Define o endereco IP para testar (pode ser o IP do backend ou outro)
set TEST_IP=127.0.0.1
REM Ou, se quiser testar o IP da rede:
REM for /f "delims=" %%i in ('node backend\scripts\get-network-ip.js') do set TEST_IP=%%i

echo Tentando pingar %TEST_IP%...

ping %TEST_IP% -n 4

if %errorlevel% equ 0 (
    echo Conectividade com %TEST_IP% OK.
) else (
    echo ERRO: Nao foi possivel conectar a %TEST_IP%. Verifique sua configuracao de rede.
)

pause
