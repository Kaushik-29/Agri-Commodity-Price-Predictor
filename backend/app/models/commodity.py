from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Commodity(Base):
    __tablename__ = "commodities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    description = Column(String(200))
    unit = Column(String(20))  # e.g., "quintal", "metric ton"
    category = Column(String(50))  # e.g., "Cereals", "Oilseeds"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    prices = relationship("Price", back_populates="commodity")
    predictions = relationship("Prediction", back_populates="commodity")

class Price(Base):
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity_id = Column(Integer, ForeignKey("commodities.id"))
    price = Column(Float)
    currency = Column(String(3), default="INR")
    timestamp = Column(DateTime, default=datetime.utcnow)
    source = Column(String(50))  # e.g., "historical_data", "market_api"
    volume = Column(Integer)  # Daily trading volume

    # Relationships
    commodity = relationship("Commodity", back_populates="prices")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    commodity_id = Column(Integer, ForeignKey("commodities.id"))
    model_id = Column(Integer, ForeignKey("models.id"))
    predicted_price = Column(Float)
    confidence_lower = Column(Float)
    confidence_upper = Column(Float)
    prediction_date = Column(DateTime)  # When the prediction was made
    target_date = Column(DateTime)      # Date for which price is predicted
    accuracy = Column(Float)            # Accuracy of this specific prediction
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    commodity = relationship("Commodity", back_populates="predictions")
    model = relationship("Model", back_populates="predictions")

class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)
    type = Column(String(50))  # "LSTM", "ARIMA", "Prophet"
    description = Column(String(500))
    accuracy = Column(Float)
    parameters = Column(JSON)  # Store model parameters as JSON
    last_trained = Column(DateTime)
    status = Column(String(20))  # "active", "training", "inactive"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    predictions = relationship("Prediction", back_populates="model") 