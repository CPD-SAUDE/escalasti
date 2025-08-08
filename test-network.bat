@echo off
echo Testing network configuration...

:: Test frontend API URL
echo.
echo Testing frontend API URL...
ping %NEXT_PUBLIC_API_URL%

:: Test backend IP (if configured)
echo.
echo Testing backend IP...
node backend/scripts/get-network-ip.js

echo.
echo Network test complete.
pause
