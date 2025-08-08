@echo off
echo Testando a conectividade de rede com o backend...

REM Tenta fazer uma requisição HTTP simples para o endpoint de status do backend
REM Assume que o backend está rodando em localhost:3001
curl http://localhost:3001/api/status

if %errorlevel% equ 0 (
    echo.
    echo Teste de conectividade bem-sucedido! O backend está respondendo.
) else (
    echo.
    echo Erro: Não foi possível conectar ao backend. Verifique se o backend está rodando e se o firewall permite a conexão.
)

pause
