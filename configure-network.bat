@echo off
echo Configurando rede...

:: Obtém o IP da máquina local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do set "LOCAL_IP=%%a"
set "LOCAL_IP=%LOCAL_IP:~1%"

echo IP Local detectado: %LOCAL_IP%

:: Atualiza o arquivo .env.local do frontend
echo NEXT_PUBLIC_API_URL=http://%LOCAL_IP%:3001/api > .env.local
echo .env.local atualizado com o IP do backend.

:: Atualiza a configuração do backend no banco de dados (se o backend estiver rodando)
echo.
echo Tentando atualizar o IP do backend no banco de dados...
node backend/scripts/update-backend-ip.js %LOCAL_IP%

echo.
echo Configuração de rede concluída.
pause
