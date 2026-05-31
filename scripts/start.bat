@echo off
setlocal
cd /d "%~dp0\.."

where pnpm >nul 2>nul
if errorlevel 1 (
  echo ERROR: pnpm no esta disponible. Ejecutá primero scripts\install.bat o corepack enable.
  pause
  exit /b 1
)

echo Iniciando bot...
call pnpm run build
if errorlevel 1 (
  echo.
  echo ERROR: El proyecto no compiló. Revisá los mensajes anteriores.
  pause
  exit /b 1
)

call pnpm start
if errorlevel 1 (
  echo.
  echo ERROR: El bot se cerró con error. Revisá los mensajes anteriores.
  pause
  exit /b 1
)
