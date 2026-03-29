@echo off
setlocal EnableDelayedExpansion
cd /d %~dp0

echo =========================
echo   Safe Git Push Start
echo =========================

echo.
echo Checking git status...
git status

echo.
echo Pulling latest changes from GitHub...
git pull origin main --rebase --autostash
if errorlevel 1 (
    echo.
    echo [ERROR] Pull/Rebase failed.
    echo Resolve the issue first, then run this file again.
    pause
    exit /b 1
)

echo.
echo Staging changes...
git add .

echo.
echo Removing local-only files from staging...
git restore --staged .env .env.backup safe-push.bat 2>nul

git diff --cached --quiet
if errorlevel 1 (
    echo.
    set /p msg=Enter commit message: 
    if "!msg!"=="" set "msg=update"

    echo.
    echo Creating commit...
    git commit -m "!msg!"
    if errorlevel 1 (
        echo.
        echo [ERROR] Commit failed.
        pause
        exit /b 1
    )

    echo.
    echo Pushing to GitHub...
    git push origin main
    if errorlevel 1 (
        echo.
        echo [ERROR] Push failed.
        pause
        exit /b 1
    )

    echo.
    echo [DONE] Changes pushed successfully.
) else (
    echo.
    echo No changes to commit.
)

pause
endlocal