@echo off
title PARAKH AI - AI-Powered Bid Compliance Platform (SIH26100)
echo ======================================================================
echo   PARAKH AI - AI-Powered Bid Compliance Verification Platform for GeM
echo   Smart India Hackathon 2026 Prototype (SIH26100)
echo   Team: BUTTER CHICKEN ^| Category: Software ^| Theme: Smart Automation
echo ======================================================================
echo.
echo Checking Python environment...
if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" main.py
) else (
    py -3.11 main.py 2>nul || py main.py 2>nul || python main.py
)
pause

