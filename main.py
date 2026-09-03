import sys
import os
from pathlib import Path
import uvicorn

# Ensure UTF-8 output on Windows console
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure backend is on pythonpath
CURRENT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(CURRENT_DIR / "backend"))

if __name__ == "__main__":
    print("=" * 70)
    print("  PARAKH AI — AI-Powered Bid Compliance Platform for GeM")
    print("  Smart India Hackathon 2026 | Problem Statement: SIH26100")
    print("  Team: BUTTER CHICKEN | Category: Software | Theme: Smart Automation")
    print("=" * 70)
    print("  🚀 Starting server on http://127.0.0.1:8000 ...")
    print("  📄 Swagger API documentation available at http://127.0.0.1:8000/docs")
    print("  🖥️  Demo Credentials: officer / demo123")
    print("=" * 70)
    
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
