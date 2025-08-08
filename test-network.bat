@echo off
setlocal

:: Este script testa a conectividade com o backend do sistema de escala de sobreaviso.

echo.
echo ==================================================
echo Testing network connection to backend...
echo ==================================================
echo.

:: Define a URL do endpoint de status do backend
set BACKEND_STATUS_URL=http://localhost:3001/api/status

echo Tentando conectar ao backend em %BACKEND_STATUS_URL%...

:: Usa curl para fazer uma requisição GET ao endpoint de status
:: Se curl nao estiver disponivel, voce pode precisar instala-lo ou usar outra ferramenta.
curl http://localhost:3001/api/status
echo.
echo Network test complete.

echo.
echo ==================================================
echo Teste Concluido
echo ==================================================
echo.

pause
endlocal
