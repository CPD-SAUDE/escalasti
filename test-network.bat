@echo off
echo ========================================
echo  TESTE DE CONECTIVIDADE DE REDE
echo  Sistema de Escala de Sobreaviso
echo ========================================

REM Obter IP da rede
for /f "tokens=2 delims=:" %%i in ('node backend\scripts\get-network-ip.js ^| findstr "IP Principal"') do set LOCAL_IP=%%i
set LOCAL_IP=%LOCAL_IP: =%

echo Testando conectividade...
echo IP do servidor: %LOCAL_IP%
echo.

echo Testando Backend (porta 3001)...
curl -s http://%LOCAL_IP%:3001/api/status >nul
if %errorlevel% equ 0 (
    echo ✅ Backend acessivel na rede!
    curl -s http://%LOCAL_IP%:3001/api/status
) else (
    echo ❌ Backend nao acessivel na rede
    echo Verifique se o backend esta rodando
)

echo.
echo Testando Frontend (porta 3000)...
curl -s http://%LOCAL_IP%:3000 >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend acessivel na rede!
) else (
    echo ❌ Frontend nao acessivel na rede
    echo Verifique se o frontend esta rodando
)

echo.
echo ========================================
echo  INFORMACOES PARA OUTROS COMPUTADORES
echo ========================================
echo.
echo Para acessar de outros computadores:
echo 1. Abra o navegador
echo 2. Digite: http://%LOCAL_IP%:3000
echo 3. Pressione Enter
echo.
echo Se nao funcionar:
echo 1. Verifique se estao na mesma rede
echo 2. Execute este computador como Administrador
echo 3. Execute 'configure-network.bat'
echo 4. Desative temporariamente o firewall
echo.
pause
