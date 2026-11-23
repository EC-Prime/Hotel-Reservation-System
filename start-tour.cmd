@echo off
setlocal
cd /d "%~dp0"

if "%PORT%"=="" set "PORT=4173"

echo Starting the Royal Haven static server on port %PORT%...
start "Royal Haven server" cmd /k "set PORT=%PORT%&& node web\serve.mjs"

timeout /t 2 /nobreak >nul
start "" "http://localhost:%PORT%/tour.html"

echo.
echo Tour opened at http://localhost:%PORT%/tour.html
echo Close the "Royal Haven server" window to stop it.
echo.
