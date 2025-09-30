@echo off
echo ========================================
echo    LogicLike Voting System Upload
echo ========================================
echo.

echo Checking Git installation...
git --version
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/downloads
    pause
    exit /b 1
)

echo.
echo Initializing Git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Making initial commit...
git commit -m "Initial commit: LogicLike voting system with IP-based voting limits"

echo.
echo Adding remote repository...
git remote add origin https://github.com/ahmed11551/LogicLike.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Uploading to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    SUCCESS! Project uploaded to GitHub
    echo ========================================
    echo.
    echo Repository URL: https://github.com/ahmed11551/LogicLike
    echo.
) else (
    echo.
    echo ========================================
    echo    ERROR! Upload failed
    echo ========================================
    echo.
    echo Please check your GitHub credentials and try again
    echo.
)

pause
