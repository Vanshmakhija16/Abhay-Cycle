@echo off
title Abhay Cycle Shop - First Time Setup

echo.
echo  =====================================================================
echo   🚴  Abhay Cycle Shop — First Time Install + Setup
echo  =====================================================================
echo.
echo  This will:
echo    1. Install backend dependencies  (server/node_modules)
echo    2. Install frontend dependencies (client/node_modules)
echo    3. Seed MongoDB with sample data
echo    4. Start both dev servers
echo.
echo  ⚠️  Make sure MongoDB is running before proceeding!
echo.
pause

cd /d %~dp0

echo.
echo [1/3] Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 ( echo ❌ Backend install failed & pause & exit /b 1 )
echo ✅ Backend dependencies installed.

echo.
echo [2/3] Installing frontend dependencies...
cd ..\client
call npm install
if %ERRORLEVEL% NEQ 0 ( echo ❌ Frontend install failed & pause & exit /b 1 )
echo ✅ Frontend dependencies installed.

echo.
echo [3/3] Seeding database with sample products + admin user...
cd ..\server
call node seed.js
if %ERRORLEVEL% NEQ 0 ( echo ❌ Seeding failed. Is MongoDB running? & pause & exit /b 1 )
echo ✅ Database seeded successfully.

echo.
echo  =====================================================================
echo   ✅  Setup complete! Starting servers now...
echo  =====================================================================
echo.

REM Start backend
start "Abhay Cycle - Backend" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 4 /nobreak >nul

REM Start frontend
start "Abhay Cycle - Frontend" cmd /k "cd /d %~dp0client && npm start"

echo.
echo  🌐  Frontend  →  http://localhost:3000
echo  ⚙️   API       →  http://localhost:5000/api/health
echo.
echo  Admin Login:
echo    Email    → admin@abhaycycle.com
echo    Password → admin123
echo.
pause
