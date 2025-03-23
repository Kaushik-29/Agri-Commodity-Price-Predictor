from .lstm_model import LSTMPredictor
from .arima_model import ARIMAPredictor
import logging
import numpy as np
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self):
        self.models = {
            'lstm': LSTMPredictor(),
            'arima': ARIMAPredictor()
        }
        self.trained_models = set()
        self.min_prices = 60  # Minimum number of prices needed

    def get_model(self, model_name):
        """Get a specific model by name"""
        if model_name.lower() not in self.models:
            raise ValueError(f"Model {model_name} not found. Available models: {list(self.models.keys())}")
        return self.models[model_name.lower()]

    def validate_input(self, prices, days_ahead):
        """Validate input data"""
        if not prices or len(prices) < self.min_prices:
            raise ValueError(f"Need at least {self.min_prices} historical prices for prediction")
        
        if not all(isinstance(p, (int, float)) for p in prices):
            raise ValueError("All prices must be numeric")
            
        if any(p < 0 for p in prices):
            raise ValueError("All prices must be non-negative")
            
        if days_ahead < 1 or days_ahead > 365:
            raise ValueError("Prediction horizon must be between 1 and 365 days")

    def preprocess_prices(self, prices):
        """Preprocess price data"""
        # Convert to numpy array
        prices = np.array(prices)
        
        # Remove any NaN values
        prices = prices[~np.isnan(prices)]
        
        # Handle outliers (clip at 3 standard deviations)
        mean = np.mean(prices)
        std = np.std(prices)
        prices = np.clip(prices, mean - 3*std, mean + 3*std)
        
        return prices.tolist()

    def train_model(self, model_name, prices):
        """Train a specific model"""
        try:
            logger.info(f"Training {model_name} model...")
            model = self.get_model(model_name)
            
            # Preprocess prices
            processed_prices = self.preprocess_prices(prices)
            
            # Train the model
            training_metric = model.train(processed_prices)
            self.trained_models.add(model_name.lower())
            
            logger.info(f"{model_name} model trained successfully. Metric: {training_metric}")
            return training_metric
        except Exception as e:
            logger.error(f"Error training {model_name} model: {str(e)}")
            raise

    def predict(self, model_name, prices, days_ahead):
        """Make predictions using a specific model"""
        try:
            # Validate inputs
            self.validate_input(prices, days_ahead)
            
            # Preprocess prices
            processed_prices = self.preprocess_prices(prices)
            
            # Get and possibly train the model
            model_name = model_name.lower()
            if model_name not in self.trained_models:
                self.train_model(model_name, processed_prices)
            
            # Make predictions
            logger.info(f"Making predictions with {model_name} model...")
            model = self.get_model(model_name)
            predictions = model.predict(processed_prices, days_ahead)
            
            # Add metadata to predictions
            predictions['model_name'] = model_name
            predictions['input_prices_count'] = len(prices)
            predictions['prediction_generated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            return predictions
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            raise

    def get_model_info(self, model_name):
        """Get information about a specific model"""
        model = self.get_model(model_name)
        return {
            'name': model_name,
            'is_trained': model_name in self.trained_models,
            'min_prices_required': self.min_prices,
            'max_prediction_days': 365
        }

# Create a global instance of ModelManager
model_manager = ModelManager() 