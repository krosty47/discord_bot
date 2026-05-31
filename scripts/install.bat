@echo off
setlocal
cd /d "%~dp0\.."

where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm no esta disponible. Intentando habilitarlo con Corepack...
  call corepack enable
  if errorlevel 1 (
    echo.
    echo ERROR: No se pudo habilitar pnpm. Instalá pnpm o ejecutá: corepack enable
    pause
    exit /b 1
  )
)

echo Instalando dependencias con pnpm...
call pnpm install
if errorlevel 1 (
  echo.
  echo ERROR: No se pudieron instalar las dependencias.
  pause
  exit /b 1
)

echo.
echo Dependencias instaladas correctamente.
pause
