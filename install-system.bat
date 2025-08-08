@echo off
REM Este script automatiza a instalação e inicialização do sistema de escala de sobreaviso.

echo ==================================================
echo           Instalador do Sistema de Escala
echo ==================================================

REM 1. Remover instalações anteriores (opcional, mas recomendado para limpeza)
echo.
echo 1. Removendo containers e volumes Docker anteriores (se existirem)...
docker compose down -v --remove-orphans
echo.

REM 2. Clonar o repositório (se ainda não foi clonado)
REM Verifique se a pasta 'escalasti' já existe
if exist "escalasti" (
    echo 2. Repositorio 'escalasti' ja existe. Pulando clonagem.
    cd escalasti
) else (
    echo 2. Clonando o repositorio 'https://github.com/CPD-SAUDE/escalasti.git'...
    git clone https://github.com/CPD-SAUDE/escalasti.git
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao clonar o repositorio. Verifique sua conexao com a internet ou o link do repositorio.
        pause
        exit /b %errorlevel%
    )
    cd escalasti
)
echo.

REM 3. Construir e iniciar os serviços Docker
echo 3. Construindo e iniciando os servicos Docker (frontend e backend)...
docker compose up --build -d
if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir ou iniciar os servicos Docker. Verifique os logs do Docker para mais detalhes.
    pause
    exit /b %errorlevel%
)
echo.

REM 4. Verificar o status dos containers
echo 4. Verificando o status dos containers Docker...
docker compose ps
echo.

echo ==================================================
echo           Instalacao Concluida!
echo ==================================================
echo.
echo O sistema de escala de sobreaviso esta agora em execucao.
echo.
echo Acesse o Frontend em: http://localhost:3000
echo Acesse o Backend (API) em: http://localhost:3001/api
echo.
echo Para parar o sistema, execute: docker compose down
echo.
pause
