@echo off
setlocal
title Athar DZ - Tools Installer ^& Progress Monitor
cd /d "%~dp0"

set "PY_CMD="
where py >nul 2>&1
if %ERRORLEVEL%==0 (
    set "PY_CMD=py -3"
) else (
    where python >nul 2>&1
    if %ERRORLEVEL%==0 (
        set "PY_CMD=python"
    )
)

if "%PY_CMD%"=="" (
    echo [ERROR] Python 3.10+ was not found on PATH.
    echo Please install Python 3 from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Launching Athar DZ Tools Installer...
echo Interface URL: http://127.0.0.1:8765/
echo Press Ctrl+C in this window to stop the server.
echo.

%PY_CMD% installer.py %*
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Installer exited with code %ERRORLEVEL%.
    pause
)
endlocal
