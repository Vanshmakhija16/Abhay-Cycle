@echo off
title Abhay Cycle Shop - Dev Server

echo.
echo  =============================================
echo   🚴  Abhay Cycle Shop - Starting Dev Servers
echo  =============================================
echo.

REM ── Start Backend ──────────────────────────────
echo [1/2] Starting Backend (Express + MongoDB)...
start "Abhay Cycle - Backend" cmd /k "cd /d %~dp0server && npm install && npm run dev"

REM Wait 4 seconds for backend to boot
timeout /t 4 /nobreak >nul

REM ── Start Frontend ─────────────────────────────
echo [2/2] Starting Frontend (React)...
start "Abhay Cycle - Frontend" cmd /k "cd /d %~dp0client && npm install && npm start"

echo.
echo  ✅  Both servers started!
echo  🌐  Frontend : http://localhost:3000
echo  ⚙️   Backend  : http://localhost:5000
echo  📚  API Docs : http://localhost:5000/api/health
echo.
echo  Admin Login : admin@abhaycycle.com / admin123
echo.
pause
