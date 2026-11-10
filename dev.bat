@echo off
set "PATH=C:\Users\viswanadh\nodejs;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   Starting StudentNexus in Development Mode
echo ========================================================
echo.
echo Launching client and server...
start http://localhost:3000
npm run dev
pause
