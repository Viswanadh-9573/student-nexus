@echo off
set "PATH=C:\Users\viswanadh\nodejs;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo    Starting StudentNexus (LinkedIn MERN Collegiate Web)
echo ========================================================
echo.
echo Launching server at http://localhost:5000 ...
start http://localhost:5000
node server/server.js
pause
