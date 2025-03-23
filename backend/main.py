from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predictions, commodities, models

app = FastAPI(
    title="Agricultural Commodity Price Prediction API",
    description="API for predicting agricultural commodity prices using ML models",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(commodities.router, prefix="/api/commodities", tags=["commodities"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(models.router, prefix="/api/models", tags=["models"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Agricultural Commodity Price Prediction API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    } 