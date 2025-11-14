@echo off
echo ========================================
echo  INICIANDO BACKEND - FLASK SERVER
echo ========================================
echo.

cd backend

REM Verificar si existe el entorno virtual
if not exist "venv" (
    echo Creando entorno virtual...
    python -m venv venv
    echo.
)

REM Activar entorno virtual
echo Activando entorno virtual...
call venv\Scripts\activate
echo.

REM Instalar dependencias
echo Instalando dependencias...
pip install -r requirements.txt
echo.

REM Iniciar servidor
echo ========================================
echo  SERVIDOR FLASK INICIADO
echo  URL: http://localhost:5000
echo ========================================
echo.
python app.py

pause
