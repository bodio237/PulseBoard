from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import analytics

load_dotenv()

app = FastAPI(title="PulseBoard Analytics", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics.router, prefix="/analytics")

@app.get("/health")
def health():
    return {"status": "OK", "message": "Analytics service running"}