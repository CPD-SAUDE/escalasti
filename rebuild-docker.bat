@echo off
echo ========================================
echo  RECONSTRUINDO IMAGENS E CONTAINERS DOCKER
echo ========================================

echo 1. Parando e removendo containers e volumes existentes...
docker compose down -v
if %errorlevel% neq 0 (
    echo ERRO: Falha ao parar/remover containers.
    pause
    exit /b 1
)
echo ✅ Containers e volumes removidos.

echo 2. Limpando cache do Docker (sistema e builder)...
docker system prune -a -f
docker builder prune -a -f
if %errorlevel% neq 0 (
    echo ERRO: Falha ao limpar cache do Docker.
    pause
    exit /b 1
)
echo ✅ Cache do Docker limpo.

echo 3. Removendo package-lock.json para forcar nova resolucao de dependencias...
del package-lock.json 2>nul
echo ✅ package-lock.json removido (se existia).

echo 4. Reconstruindo imagens Docker sem cache...
docker compose build --no-cache
if %errorlevel% neq 0 (
    echo ERRO: Falha ao reconstruir imagens.
    pause
    exit /b 1
)
echo ✅ Imagens Docker reconstruidas.

echo 5. Iniciando containers em segundo plano...
docker compose up -d
if %errorlevel% neq 0 (
    echo ERRO: Falha ao iniciar containers.
    pause
    exit /b 1
)
echo ✅ Containers iniciados.

echo.
echo ========================================
echo  PROCESSO CONCLUIDO!
echo ========================================
echo.
echo Verifique os logs para confirmar que tudo esta funcionando:
echo docker compose logs -f
echo.
pause
