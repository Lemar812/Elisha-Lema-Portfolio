# Start both frontend and backend servers
Write-Host "Starting Elisha Lema Portfolio Website..." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Start Backend Server
Write-Host "`nStarting Backend Server (MongoDB + Express)..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c", "cd $PSScriptRoot\server && node index.js"
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "Starting Frontend Server (Vite + React)..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c", "cd $PSScriptRoot && npm run dev"
Start-Sleep -Seconds 3

Write-Host "`n======================================" -ForegroundColor Green
Write-Host "✅ Servers Started Successfully!" -ForegroundColor Green
Write-Host "`n📱 Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "🔗 Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "🔐 Admin:    http://localhost:5173/admin" -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C in each terminal to stop servers" -ForegroundColor Gray
