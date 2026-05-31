@echo off
setlocal
cd /d "%~dp0\.."

where pnpm >nul 2>nul
if errorlevel 1 (
  echo ERROR: pnpm no esta disponible. Ejecutá primero scripts\install.bat o corepack enable.
  pause
  exit /b 1
)

echo Registrando comandos slash en Discord...
call pnpm run deploy:commands
if errorlevel 1 (
  echo.
  echo ERROR: No se pudieron registrar los comandos. Revisá el archivo .env y los permisos del bot.
  pause
  exit /b 1
)

echo.
echo Comandos registrados correctamente.
pause
