import pandas as pd
import numpy as np
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from .models.commodity import Commodity
from .models.price import Price
from .models.prediction import Prediction
from .models.lstm_arima import LSTMARIMAModel

def read_csv_file(file_path: str) -> pd.DataFrame:
    """Read a CSV file and return a pandas DataFrame"""
    try:
        return pd.read_csv(file_path)
    except Exception as e:
        raise Exception(f"Error reading CSV file: {str(e)}")

def process_commodity_csv(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Process commodity CSV data and return a list of dictionaries"""
    required_columns = ['name', 'description', 'unit', 'category']
    if not all(col in df.columns for col in required_columns):
        raise ValueError("CSV file missing required columns")
    
    commodities = []
    for _, row in df.iterrows():
        commodity = {
            'name': row['name'],
            'description': row['description'],
            'unit': row['unit'],
            'category': row['category'],
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        commodities.append(commodity)
    return commodities

def process_price_csv(df: pd.DataFrame) -> List[Dict[str, Any]]:
    """Process price CSV data and return a list of dictionaries"""
    required_columns = ['commodity_id', 'price', 'date']
    if not all(col in df.columns for col in required_columns):
        raise ValueError("CSV file missing required columns")
    
    prices = []
    for _, row in df.iterrows():
        price = {
            'commodity_id': row['commodity_id'],
            'price': float(row['price']),
            'date': pd.to_datetime(row['date']),
            'created_at': datetime.now()
        }
        prices.append(price)
    return prices

def save_predictions_to_csv(predictions: List[Dict[str, Any]], file_path: str):
    """Save predictions to a CSV file"""
    df = pd.DataFrame(predictions)
    df.to_csv(file_path, index=False)

def insert_commodity_data(db: Session, commodities: List[Dict[str, Any]]):
    """Insert commodity data into the database"""
    for commodity_data in commodities:
        commodity = Commodity(**commodity_data)
        db.add(commodity)
    db.commit()

def insert_price_data(db: Session, prices: List[Dict[str, Any]]):
    """Insert price data into the database"""
    for price_data in prices:
        price = Price(**price_data)
        db.add(price)
    db.commit()

def get_price_data_for_commodity(db: Session, commodity_id: int) -> np.ndarray:
    """Get historical price data for a commodity"""
    prices = db.query(Price).filter(Price.commodity_id == commodity_id).order_by(Price.date).all()
    return np.array([price.price for price in prices])

def save_prediction(db: Session, commodity_id: int, predictions: np.ndarray, model_name: str):
    """Save prediction results to the database"""
    for i, pred_value in enumerate(predictions):
        prediction = Prediction(
            commodity_id=commodity_id,
            value=float(pred_value),
            prediction_date=datetime.now(),
            model_name=model_name,
            days_ahead=i + 1
        )
        db.add(prediction)
    db.commit()

def load_and_prepare_model() -> LSTMARIMAModel:
    """Load and prepare the LSTM-ARIMA model"""
    model = LSTMARIMAModel()
    try:
        model.load_models()
    except Exception as e:
        raise Exception(f"Error loading model: {str(e)}")
    return model 