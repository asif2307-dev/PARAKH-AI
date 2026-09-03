import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.routes import router as api_router

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="PARAKH AI — GeM Bid Compliance Platform",
    description="AI-Assisted Integrated Bid Compliance Verification Platform for GeM Procurement (SIH26100, Team: Butter Chicken)",
    version="2.0.0"
)

# Enable CORS for local dev / API calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")

# Mount Static Files if static dir exists
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/")
async def root():
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {
        "message": "PARAKH AI API is operational.",
        "docs": "/docs",
        "health": "OK"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "PARAKH AI Procurement Core",
        "version": "2.0.0",
        "sih_problem_statement": "SIH26100",
        "team": "BUTTER CHICKEN"
    }
