from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import predictions, commodities
from .database import init_db
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Agricultural Price Prediction API",
    description="API for predicting agricultural commodity prices using ML models",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(commodities.router, prefix="/api/commodities", tags=["commodities"])

@app.on_event("startup")
def startup_event():
    """Initialize database on startup"""
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

@app.get("/")
async def root():
    """Root endpoint for API health check"""
    return {
        "status": "ok",
        "message": "Agricultural Price Prediction API is running"
    } 