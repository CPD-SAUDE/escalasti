@echo off
echo Construindo o frontend para produção...

:: Navega para o diretório raiz do projeto (onde está o package.json do frontend)
:: Assumindo que este script está na raiz do projeto
cd %~dp0

:: Define a variável de ambiente para a URL da API do backend
:: Em um ambiente de produção ou Docker, esta URL deve ser a do backend conteinerizado
:: Para build local, pode ser localhost se o backend estiver rodando localmente
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: Navega para o diretório do frontend
cd frontend

:: Instala as dependências do frontend
echo Instalando dependências do frontend...
npm install --force

:: Executa o build do Next.js
echo Executando o build do Next.js...
npm run build

echo Build do frontend concluído!
pause
