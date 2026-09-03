# PARAKH AI - Launch Script
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  PARAKH AI — AI-Powered Bid Compliance Platform for GeM" -ForegroundColor Yellow
Write-Host "  Smart India Hackathon 2026 Prototype (SIH26100)" -ForegroundColor Cyan
Write-Host "  Team: BUTTER CHICKEN | Category: Software | Theme: Smart Automation" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Cyan

$pythonExe = "C:\Users\moasi\AppData\Local\Programs\Python\Python311\python.exe"
if (Test-Path $pythonExe) {
    & $pythonExe main.py
} else {
    python main.py
}
