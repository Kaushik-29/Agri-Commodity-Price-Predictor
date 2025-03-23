from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models.commodity import Commodity, Price, Model, Prediction
import random
import math
from .data_loader import load_csv_data
import logging

logger = logging.getLogger(__name__)

def init_db():
    """Initialize database and load data"""
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        logger.info("Created database tables")
        
        # Load CSV data
        db = SessionLocal()
        try:
            load_csv_data(db)
            logger.info("Loaded CSV data successfully")
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

def seed_data(db: Session):
    """
    Seed the database with initial data.
    If CSV files are loaded, this function will only add ML models.
    """
    # Check if commodities already exist (loaded from CSV)
    commodities_exist = db.query(Commodity).first() is not None
    
    if not commodities_exist:
        # Add commodities with detailed information
        commodities = [
            Commodity(
                name="Wheat",
                description="Premium quality wheat grain suitable for flour production",
                unit="quintal",
                category="Cereals"
            ),
            Commodity(
                name="Rice",
                description="Grade A basmati rice with excellent aroma",
                unit="quintal",
                category="Cereals"
            ),
            Commodity(
                name="Corn",
                description="Yellow dent corn ideal for feed and industrial use",
                unit="quintal",
                category="Cereals"
            ),
            Commodity(
                name="Soybean",
                description="High-protein soybean for oil extraction and feed",
                unit="quintal",
                category="Oilseeds"
            ),
            Commodity(
                name="Cotton",
                description="Medium staple raw cotton",
                unit="quintal",
                category="Fibers"
            ),
            Commodity(
                name="Sugarcane",
                description="Fresh sugarcane with high sugar content",
                unit="quintal",
                category="Cash Crops"
            ),
            Commodity(
                name="Groundnut",
                description="Premium quality groundnuts for oil extraction",
                unit="quintal",
                category="Oilseeds"
            ),
            Commodity(
                name="Mustard",
                description="High-oil content mustard seeds",
                unit="quintal",
                category="Oilseeds"
            )
        ]
        for commodity in commodities:
            db.add(commodity)
        db.commit()
        
        # Generate historical price data only if no CSV data was loaded
        # Current market prices in INR (as of 2024)
        base_prices = {
            "Wheat": 2600,     # INR per quintal
            "Rice": 4200,      # INR per quintal
            "Corn": 2100,      # INR per quintal
            "Soybean": 4800,   # INR per quintal
            "Cotton": 6500,    # INR per quintal
            "Sugarcane": 315,  # INR per quintal
            "Groundnut": 5800, # INR per quintal
            "Mustard": 5200    # INR per quintal
        }
        
        # Seasonal patterns for each commodity (peak months)
        seasonal_peaks = {
            "Wheat": [3, 4],      # March-April
            "Rice": [9, 10],      # September-October
            "Corn": [8, 9],       # August-September
            "Soybean": [10, 11],  # October-November
            "Cotton": [11, 12],   # November-December
            "Sugarcane": [1, 2],  # January-February
            "Groundnut": [10, 11], # October-November
            "Mustard": [2, 3]     # February-March
        }
        
        # Add historical prices (last 60 days with realistic variations)
        for commodity in commodities:
            base_price = base_prices[commodity.name]
            trend = random.uniform(-0.1, 0.1)  # Overall trend
            
            # Generate 60 days of historical data
            for days_ago in range(60):
                date = datetime.utcnow() - timedelta(days=days_ago)
                current_month = date.month
                
                # Calculate seasonal effect
                peak_months = seasonal_peaks[commodity.name]
                seasonal_factor = 1.0
                if current_month in peak_months:
                    seasonal_factor = 1.15  # 15% higher in peak season
                elif (current_month - 1) in peak_months or (current_month + 1) in peak_months:
                    seasonal_factor = 1.08  # 8% higher in adjacent months
                
                # Add trend effect
                trend_factor = 1 + trend * days_ago / 60
                
                # Add random daily variation
                random_factor = random.uniform(0.98, 1.02)
                
                # Calculate final price with all factors
                price_variation = base_price * seasonal_factor * trend_factor * random_factor
                
                # Add some volatility based on day of week (higher on weekdays)
                if date.weekday() < 5:  # Monday to Friday
                    price_variation *= random.uniform(1.01, 1.03)
                
                db.add(Price(
                    commodity_id=commodity.id,
                    price=round(price_variation, 2),
                    currency="INR",
                    timestamp=date,
                    source="historical_data",
                    volume=random.randint(100, 1000)  # Daily trading volume
                ))
        db.commit()

    # Add ML models with detailed descriptions (always add these)
    # First, check if models already exist to avoid duplicates
    models_exist = db.query(Model).first() is not None
    
    if not models_exist:
        models = [
            Model(
                name="LSTM Price Predictor",
                type="LSTM",
                description="Deep learning model using LSTM architecture for long-term predictions. Features: historical prices, seasonal patterns, market trends",
                accuracy=0.88,
                last_trained=datetime.utcnow(),
                status="active",
                parameters={"layers": 2, "units": 50, "dropout": 0.2}
            ),
            Model(
                name="ARIMA Price Predictor",
                type="ARIMA",
                description="Statistical time series model with seasonal decomposition. Best for short-term predictions up to 30 days",
                accuracy=0.85,
                last_trained=datetime.utcnow(),
                status="active",
                parameters={"p": 1, "d": 1, "q": 1}
            )
        ]
        for model in models:
            db.add(model)
        db.commit()

if __name__ == "__main__":
    init_db() 