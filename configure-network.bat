@echo off
setlocal

echo Configurando a rede para o sistema...

:: Este script é um exemplo e pode precisar de ajustes dependendo do seu ambiente.
:: Ele tenta obter o IP da máquina e exibi-lo.

echo Obtendo o IP da rede local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do set "IP_ADDRESS=%%a"
set "IP_ADDRESS=%IP_ADDRESS:~1%"

echo.
echo Seu IP de rede local (provável): %IP_ADDRESS%
echo.
echo Se estiver usando Docker Compose, a comunicação entre frontend e backend
echo ocorre internamente na rede Docker, usando os nomes dos serviços (ex: http://backend:3001/api).
echo.
echo Para acesso externo (do seu navegador para o frontend/backend Docker),
echo as portas são mapeadas no docker-compose.yml (ex: 3000:3000 e 3001:3001).
echo.
echo Se estiver rodando o frontend e backend localmente (sem Docker Compose),
echo você precisará definir a variável de ambiente NEXT_PUBLIC_API_URL no frontend:
echo set NEXT_PUBLIC_API_URL=http://localhost:3001/api
echo.

echo.
echo ==================================================
echo Configurando o IP da Rede para o Backend
echo ==================================================
echo.

:: Tenta obter o IP da rede local usando o script Node.js
echo Getting network IP...
node backend\scripts\get-network-ip.js > network_ip.txt
set /p NETWORK_IP=<network_ip.txt
del network_ip.txt
echo Network IP: %NETWORK_IP%

echo Updating backend config with network IP...
curl -X POST -H "Content-Type: application/json" -d "{\"networkIp\": \"%NETWORK_IP%\"}" http://localhost:3001/api/config
echo.
echo Network configuration complete.

echo.
echo ==================================================
echo Configuracao Concluida
echo ==================================================
echo.

pause
endlocal
