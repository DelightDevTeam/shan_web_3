@echo off
echo Unity WebGL Development Server
echo =============================
echo.
echo Choose a port to start the server:
echo 1. Port 3000 (default)
echo 2. Port 5000 (alternative)
echo 3. Auto-assign port (recommended)
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo Starting server on port 3000...
    npx http-server . -p 3000 -c-1 --cors
) else if "%choice%"=="2" (
    echo Starting server on port 5000...
    npx http-server . -p 5000 -c-1 --cors
) else if "%choice%"=="3" (
    echo Starting server with auto-assigned port...
    npx http-server . -p 0 -c-1 --cors
) else if "%choice%"=="4" (
    echo Exiting...
    exit
) else (
    echo Invalid choice. Starting on port 3000...
    npx http-server . -p 3000 -c-1 --cors
)

pause
