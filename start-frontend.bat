@echo off
echo Iniciando o frontend em modo de desenvolvimento...

REM Navega para o diretório raiz do projeto (onde está o package.json do frontend)
cd %~dp0

REM Define a variável de ambiente NEXT_PUBLIC_API_URL
REM Se o backend estiver rodando localmente, use localhost.
REM Se estiver usando Docker Compose, o frontend se conectará ao serviço 'backend'
REM dentro da rede Docker, entao esta variavel nao e estritamente necessaria
REM para o container, mas e util para o desenvolvimento local sem Docker.
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

echo NEXT_PUBLIC_API_URL definido como: %NEXT_PUBLIC_API_URL%

REM Inicia o servidor de desenvolvimento do Next.js
echo Iniciando npm run dev...
call npm run dev

echo Frontend iniciado.
pause
