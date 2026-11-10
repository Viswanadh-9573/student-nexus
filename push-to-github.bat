@echo off
set "PATH=C:\Users\viswanadh\git\cmd;C:\Users\viswanadh\nodejs;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   Pushing StudentNexus to GitHub (Viswanadh-9573)
echo ========================================================
echo.
git push -u origin main
echo.
pause
