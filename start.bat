@echo off
REM Tattoo Studio - Quick Start Script for Windows
REM This script starts both frontend and backend services

echo.
echo 🎨 Starting Tattoo Studio Project...
echo.

REM Check for Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

echo 1️⃣  Starting Docker services (Odoo + PostgreSQL)...
docker-compose up -d

echo.
echo 2️⃣  Waiting for services to be ready...
timeout /t 10

echo.
echo 3️⃣  Installing frontend dependencies...
npm install

echo.
echo ✅ Services started successfully!
echo.
echo 📍 Access points:
echo    - Frontend: http://localhost:3000 (run 'npm run dev')
echo    - Odoo: http://localhost:8000
echo    - PostgreSQL: localhost:5432
echo.
echo 🔧 Next steps:
echo    1. Open another terminal and run: npm run dev
echo    2. Navigate to http://localhost:8000 in your browser
echo    3. Create master password and complete Odoo setup
echo    4. Install the 'Tattoo Studio' module in Odoo
echo.
echo 📊 To view logs:
echo    docker-compose logs -f odoo
echo    docker-compose logs -f db
echo.
echo 🛑 To stop services:
echo    docker-compose down
