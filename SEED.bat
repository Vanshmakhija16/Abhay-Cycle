@echo off
title Abhay Cycle Shop - Seed Database

echo.
echo  =============================================
echo   🌱  Abhay Cycle Shop - Seeding Database
echo  =============================================
echo.
echo  Make sure MongoDB is running before seeding!
echo.

cd /d %~dp0server
npm install
node seed.js

echo.
pause
