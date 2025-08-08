@echo off
setlocal

:: Este script inicia o sistema de escala de sobreaviso.
:: Ele inicia o backend e o frontend.

echo.
echo ==================================================
echo Iniciando o Sistema de Escala de Sobreaviso
echo ==================================================
echo.

:: Define a variável de ambiente para o frontend
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: Iniciar o backend em uma nova janela
echo Iniciando o backend...
start cmd /k "call backend\start-backend.bat"
echo.

:: Aguardar um pouco para o backend iniciar
timeout /t 5 /nobreak >nul
echo.

:: Iniciar o frontend em uma nova janela
echo Iniciando o frontend...
start cmd /k "call start-frontend.bat"
echo.

echo ==================================================
echo Sistema Iniciado!
echo O frontend deve estar acessivel em http://localhost:3000
echo ==================================================
echo.

pause
endlocal
