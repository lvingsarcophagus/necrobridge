@echo off
REM NecroBridge Anchor Program Build Script for Windows (via WSL2)
REM This script builds the Anchor program using WSL2 Ubuntu

echo Building NecroBridge Anchor Program via WSL2...
echo.

REM Check if WSL2 is installed
wsl --list --quiet >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: WSL2 is not installed or not in PATH
    echo Please install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install-win10
    pause
    exit /b 1
)

REM Convert Windows path to WSL2 path
setlocal enabledelayedexpansion
set "WIN_PATH=%CD%"
set "WIN_PATH=!WIN_PATH:\=/!
set "WSL_PATH=/mnt/!WIN_PATH:C:=c!"

echo WSL Path: %WSL_PATH%
echo.

REM Run build in WSL2
echo Running build in WSL2...
wsl bash -c "cd %WSL_PATH% && bash ./build.sh"

if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Build complete!
echo The compiled program should be at: target\release\necro_migrate.so
pause
