@echo off
title PARAKH AI - AI-Powered Bid Compliance Platform (SIH26100)
echo ======================================================================
echo   PARAKH AI - AI-Powered Bid Compliance Verification Platform for GeM
echo   Smart India Hackathon 2026 Prototype (SIH26100)
echo   Team: BUTTER CHICKEN ^| Category: Software ^| Theme: Smart Automation
echo ======================================================================
echo.
echo Checking Python environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] python command not found directly. Trying explicit AppData path...
    "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" main.py
) else (
    python main.py
)
pause
