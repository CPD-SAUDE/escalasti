@echo off
setlocal

:: Este script automatiza a instalação completa do sistema de escala de sobreaviso.
:: Ele remove instalações anteriores, clona o repositório e executa os scripts de inicialização.

echo.
echo ==================================================
echo Instalador do Sistema de Escala de Sobreaviso
echo ==================================================
echo.

:: 1. Remover instalações anteriores (opcional, mas recomendado para limpeza)
echo 1. Removendo instalacoes anteriores (se existirem)...
if exist "escalasti" (
    rmdir /s /q "escalasti"
    echo Pasta 'escalasti' removida.
) else (
    echo Pasta 'escalasti' nao encontrada. Pulando remocao.
)
echo.

:: 2. Clonar o repositório
echo 2. Clonando o repositorio 'escalasti' do GitHub...
git clone https://github.com/CPD-SAUDE/escalasti.git
if %errorlevel% neq 0 (
    echo ERRO: Falha ao clonar o repositorio. Verifique sua conexao com a internet ou o URL.
    pause
    goto :eof
)
echo Repositorio clonado com sucesso.
echo.

:: 3. Navegar para o diretório do projeto
cd escalasti
if %errorlevel% neq 0 (
    echo ERRO: Nao foi possivel entrar no diretorio 'escalasti'.
    pause
    goto :eof
)
echo Entrou no diretorio 'escalasti'.
echo.

:: 4. Instalar dependencias do backend e inicializar DB
echo 4. Instalando dependencias do backend e inicializando o banco de dados...
call backend\start-backend.bat
if %errorlevel% neq 0 (
    echo ERRO: Falha na instalacao ou inicializacao do backend.
    pause
    goto :eof
)
echo Backend configurado e iniciado.
echo.

:: 5. Instalar dependencias do frontend e construir
echo 5. Instalando dependencias do frontend e construindo...
call build-frontend.bat
if %errorlevel% neq 0 (
    echo ERRO: Falha na instalacao ou construcao do frontend.
    pause
    goto :eof
)
echo Frontend construido com sucesso.
echo.

:: 6. Configurar IP de rede para backend
echo 6. Configurando IP de rede para backend...
call configure-network.bat
if %errorlevel% neq 0 (
    echo ERRO: Falha na configuracao do IP de rede.
    pause
    goto :eof
)
echo IP de rede configurado com sucesso.
echo.

echo ==================================================
echo Instalacao Concluida!
echo O sistema deve estar acessivel em http://localhost:3000
echo ==================================================
echo.

echo Para iniciar o sistema, execute start-system.bat
pause

endlocal
