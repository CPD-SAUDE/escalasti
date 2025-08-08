@echo off
echo Iniciando o backend...
cd %~dp0
npm install
npm run init-db
npm start
pause
