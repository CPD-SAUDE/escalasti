@echo off
echo Starting system...

:: Define a variável de ambiente para o frontend
set NEXT_PUBLIC_API_URL=http://localhost:3001/api

:: Start backend
echo.
echo Starting backend...
start cmd /k "cd backend && npm start"

:: Start frontend
echo.
echo Starting frontend...
start cmd /k "npm run dev"

echo.
echo System started. Check your browser at http://localhost:3000
pause
