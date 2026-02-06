@echo off
echo.
echo Starting Elisha Lema Portfolio Website...
echo ======================================
echo.

echo Starting Backend Server (MongoDB + Express)...
start "Backend Server" cmd /k "cd server && node index.js"
timeout /t 2 /nobreak

echo Starting Frontend Server (Vite + React)...
start "Frontend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak

echo.
echo ======================================
echo Successfully Started!
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo Admin:    http://localhost:5173/admin
echo.
echo Close the command windows to stop servers
echo.
pause
