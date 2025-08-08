@echo off
echo ========================================
echo  CONFIGURACAO DE REDE LOCAL
echo  Sistema de Escala de Sobreaviso
echo ========================================

REM **IMPORTANTE: Execute este script como ADMINISTRADOR**

REM Obter IP da rede
echo Detectando IP da rede local...
for /f "tokens=*" %%i in ('node backend\scripts\get-network-ip.js ^| findstr "IP Principal"') do (
    set "LINE=%%i"
    for /f "tokens=2 delims=:" %%j in ("!LINE!") do set LOCAL_IP=%%j
)
set LOCAL_IP=%LOCAL_IP: =%

if "%LOCAL_IP%"=="" (
    echo ERRO: Nao foi possivel detectar o IP local.
    echo Verifique sua conexao de rede.
    pause
    exit /b 1
)

echo IP detectado: %LOCAL_IP%

echo.
echo ========================================
echo  CONFIGURANDO FIREWALL DO WINDOWS
echo ========================================

echo Adicionando regras do firewall para as portas 3000 (Frontend) e 3001 (Backend)...
echo (Pode ser necessaria permissao de Administrador)

REM Adicionar regras do firewall para as portas
netsh advfirewall firewall add rule name="Sistema Escala - Frontend (3000)" dir=in action=allow protocol=TCP localport=3000 enable=yes
netsh advfirewall firewall add rule name="Sistema Escala - Backend (3001)" dir=in action=allow protocol=TCP localport=3001 enable=yes

if %errorlevel% equ 0 (
    echo ✅ Regras do firewall configuradas com sucesso!
) else (
    echo ⚠️  Erro ao configurar firewall. Certifique-se de executar como Administrador.
    echo Se o problema persistir, desative o firewall temporariamente para teste.
)

echo.
echo ========================================
echo  CONFIGURANDO VARIAVEIS DE AMBIENTE
echo ========================================

REM Atualizar arquivo .env.local
echo Atualizando configuracao do frontend (NEXT_PUBLIC_API_URL)...
echo NEXT_PUBLIC_API_URL=http://%LOCAL_IP%:3001/api > .env.local
echo PORT=3000 >> .env.local

echo ✅ Arquivo .env.local atualizado!

echo.
echo ========================================
echo  CONFIGURACAO CONCLUIDA!
echo ========================================
echo.
echo O sistema foi configurado para rede local!
echo.
echo INFORMACOES IMPORTANTES:
echo - IP do servidor (este computador): %LOCAL_IP%
echo - Frontend (para outros computadores): http://%LOCAL_IP%:3000
echo - Backend (API): http://%LOCAL_IP%:3001
echo.
echo PARA OUTROS COMPUTADORES ACESSAREM:
echo 1. Certifique-se que este computador esta ligado e na mesma rede.
echo 2. No navegador de outro computador, digite: http://%LOCAL_IP%:3000
echo.
echo Agora execute 'start-system-network.bat' para iniciar o sistema!
echo.
pause
