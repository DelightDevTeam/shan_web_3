# Unity WebGL Development Server PowerShell Script
Write-Host "Unity WebGL Development Server" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""

# Check if http-server is available
try {
    $httpServerVersion = npx http-server --version 2>$null
    Write-Host "✓ http-server is available" -ForegroundColor Green
} catch {
    Write-Host "✗ http-server not found. Installing..." -ForegroundColor Yellow
    npm install -g http-server
}

Write-Host ""
Write-Host "Choose a port to start the server:" -ForegroundColor Cyan
Write-Host "1. Port 3000 (default)" -ForegroundColor White
Write-Host "2. Port 5000 (alternative)" -ForegroundColor White
Write-Host "3. Auto-assign port (recommended)" -ForegroundColor White
Write-Host "4. Check available ports" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "Starting server on port 3000..." -ForegroundColor Yellow
        Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
        npx http-server . -p 3000 -c-1 --cors
    }
    "2" {
        Write-Host "Starting server on port 5000..." -ForegroundColor Yellow
        Write-Host "Server will be available at: http://localhost:5000" -ForegroundColor Green
        npx http-server . -p 5000 -c-1 --cors
    }
    "3" {
        Write-Host "Starting server with auto-assigned port..." -ForegroundColor Yellow
        Write-Host "Server will automatically find an available port" -ForegroundColor Green
        npx http-server . -p 0 -c-1 --cors
    }
    "4" {
        Write-Host "Checking available ports..." -ForegroundColor Yellow
        $ports = @(3000, 5000, 8000, 8080, 9000)
        foreach ($port in $ports) {
            try {
                $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
                if ($connection.TcpTestSucceeded) {
                    Write-Host "✗ Port $port is in use" -ForegroundColor Red
                } else {
                    Write-Host "✓ Port $port is available" -ForegroundColor Green
                }
            } catch {
                Write-Host "✓ Port $port is available" -ForegroundColor Green
            }
        }
        Write-Host ""
        Read-Host "Press Enter to continue"
    }
    "5" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host "Invalid choice. Starting on port 3000..." -ForegroundColor Yellow
        Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
        npx http-server . -p 3000 -c-1 --cors
    }
}
