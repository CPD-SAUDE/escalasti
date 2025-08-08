@echo off
echo Configurando a rede para o sistema de escala de sobreaviso...

:: Verifica se o Docker está em execução
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Docker não está em execução. Por favor, inicie o Docker Desktop.
    pause
    exit /b 1
)

:: Nome da rede Docker
set NETWORK_NAME=app_network

:: Verifica se a rede já existe
docker network inspect %NETWORK_NAME% >nul 2>&1
if %errorlevel% equ 0 (
    echo A rede '%NETWORK_NAME%' já existe.
) else (
    :: Cria a rede Docker
    echo Criando a rede '%NETWORK_NAME%'...
    docker network create %NETWORK_NAME%
    if %errorlevel% neq 0 (
        echo Erro ao criar a rede '%NETWORK_NAME%'.
        pause
        exit /b 1
    )
    echo Rede '%NETWORK_NAME%' criada com sucesso.
)

echo Obtendo o IP da rede local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do (
    set "IP_ADDRESS=%%a"
)
set "IP_ADDRESS=%IP_ADDRESS: =%"
set "IP_ADDRESS=%IP_ADDRESS:~1%"

echo IP da rede local detectado: %IP_ADDRESS%

REM Atualizar o arquivo .env.local do frontend
echo NEXT_PUBLIC_API_URL=http://%IP_ADDRESS%:3001/api > .env.local

echo Arquivo .env.local atualizado com o IP do backend.
echo Agora voce pode iniciar o frontend com 'npm run dev'.

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

echo Configuração de rede concluída.
pause
