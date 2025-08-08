@echo off
echo Installing System Dependencies...

echo.
echo --- Installing Backend Dependencies ---
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error: Backend npm install failed.
    pause
    exit /b %errorlevel%
)
echo Backend dependencies installed.

echo.
echo --- Initializing Backend Database ---
call npm run init-db
if %errorlevel% neq 0 (
    echo Error: Backend database initialization failed.
    pause
    exit /b %errorlevel%
)
echo Backend database initialized.
cd ..

echo.
echo --- Installing Frontend Dependencies ---
call npm install
if %errorlevel% neq 0 (
    echo Error: Frontend npm install failed.
    pause
    exit /b %errorlevel%
)
echo Frontend dependencies installed.

echo.
echo --- Building Frontend for Production ---
call npm run build
if %errorlevel% neq 0 (
    echo Error: Frontend build failed.
    pause
    exit /b %errorlevel%
)
echo Frontend build complete.

echo.
echo System installation and build complete.
echo You can now run 'start-system.bat' to start the application.
pause
