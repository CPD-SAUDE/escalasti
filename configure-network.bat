@echo off
echo Configurando a rede para o frontend...

REM Obtém o IP da rede usando o script Node.js
for /f "delims=" %%i in ('node backend\scripts\get-network-ip.js') do set "BACKEND_IP=%%i"

echo IP do Backend detectado: %BACKEND_IP%

REM Define a variável de ambiente NEXT_PUBLIC_API_URL para o frontend
REM Isso cria ou sobrescreve o arquivo .env.local na raiz do frontend
echo NEXT_PUBLIC_API_URL=http://%BACKEND_IP%:3001/api > .env.local

echo Arquivo .env.local criado/atualizado com sucesso na raiz do frontend.
echo Conteúdo de .env.local:
type .env.local

pause
