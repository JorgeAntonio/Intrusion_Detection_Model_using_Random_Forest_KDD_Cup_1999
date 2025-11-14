@echo off
echo ========================================
echo  INICIANDO FRONTEND - REACT APP
echo ========================================
echo.

cd frontend

REM Verificar si existen node_modules
if not exist "node_modules" (
    echo Instalando dependencias de Node.js...
    echo Esto puede tomar varios minutos...
    call npm install
    echo.
)

REM Iniciar aplicación React
echo ========================================
echo  APLICACION REACT INICIADA
echo  URL: http://localhost:3000
echo ========================================
echo.
call npm start

pause
