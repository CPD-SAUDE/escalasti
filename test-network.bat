@echo off
echo Testando a conectividade de rede...

:: Este script é um exemplo simples para verificar a conectividade.
:: Ele tenta pingar um site externo e o localhost.

echo.
echo Testando ping para google.com...
ping -n 1 google.com > NUL
if %errorlevel% equ 0 (
    echo Conectividade externa OK.
) else (
    echo Erro: Nao foi possivel pingar google.com. Verifique sua conexao com a internet.
)

echo.
echo Testando ping para localhost (127.0.0.1)...
ping -n 1 127.0.0.1 > NUL
if %errorlevel% equ 0 (
    echo Conectividade local OK.
) else (
    echo Erro: Nao foi possivel pingar localhost.
)

echo.
echo Se estiver usando Docker, verifique tambem a rede interna do Docker.
echo.

pause
