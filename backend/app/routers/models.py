from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

router = APIRouter()

class ModelType(str, Enum):
    ARIMA = "ARIMA"
    LSTM = "LSTM"
    PROPHET = "PROPHET"

class ModelInfo(BaseModel):
    id: str
    name: str
    type: ModelType
    description: str
    accuracy: float
    last_trained: str
    supported_commodities: List[str]

# Sample model information (replace with database in production)
SAMPLE_MODELS = [
    {
        "id": "arima-001",
        "name": "ARIMA Price Predictor",
        "type": "ARIMA",
        "description": "Time series forecasting model using ARIMA for short-term predictions",
        "accuracy": 0.85,
        "last_trained": "2024-03-15",
        "supported_commodities": ["wheat-001", "rice-001", "corn-001"]
    },
    {
        "id": "lstm-001",
        "name": "LSTM Deep Learning Model",
        "type": "LSTM",
        "description": "Deep learning model for long-term price predictions with multiple features",
        "accuracy": 0.88,
        "last_trained": "2024-03-18",
        "supported_commodities": ["wheat-001", "rice-001"]
    }
]

@router.get("/", response_model=List[ModelInfo])
async def get_models(model_type: Optional[ModelType] = None):
    try:
        if model_type:
            return [m for m in SAMPLE_MODELS if m["type"] == model_type]
        return SAMPLE_MODELS
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{model_id}", response_model=ModelInfo)
async def get_model(model_id: str):
    try:
        model = next((m for m in SAMPLE_MODELS if m["id"] == model_id), None)
        if not model:
            raise HTTPException(status_code=404, detail="Model not found")
        return model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{model_id}/metrics")
async def get_model_metrics(model_id: str):
    try:
        # Placeholder for model metrics
        return {
            "model_id": model_id,
            "metrics": {
                "mse": 0.15,
                "mae": 0.12,
                "r2_score": 0.85
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 