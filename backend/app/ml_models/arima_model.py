import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
from datetime import datetime, timedelta
import logging
import pickle
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ARIMAPredictor:
    def __init__(self):
        self.model = None
        self.model_fit = None
        self.order = None
        self.model_path = 'arima_model.pkl'
        self.min_training_samples = 30

    def determine_order(self, data):
        """Determine optimal ARIMA order based on data characteristics"""
        try:
            # Check stationarity
            adf_result = adfuller(data)
            d = 0 if adf_result[1] < 0.05 else 1
            
            # Simple heuristic for p and q
            p = min(5, len(data) // 10)
            q = min(5, len(data) // 10)
            
            logger.info(f"Determined ARIMA order: ({p}, {d}, {q})")
            return (p, d, q)
        except Exception as e:
            logger.error(f"Error in determine_order: {str(e)}")
            return (1, 1, 1)  # fallback to default order

    def train(self, prices):
        try:
            if len(prices) < self.min_training_samples:
                raise ValueError(f"Need at least {self.min_training_samples} data points for training")

            logger.info("Converting prices to time series...")
            self.prices = np.array(prices)
            
            # Determine optimal order
            self.order = self.determine_order(self.prices)
            
            logger.info("Fitting ARIMA model...")
            self.model = ARIMA(self.prices, order=self.order)
            self.model_fit = self.model.fit()
            
            # Save the model
            with open(self.model_path, 'wb') as f:
                pickle.dump({
                    'model_fit': self.model_fit,
                    'order': self.order
                }, f)
            logger.info("Model trained and saved successfully")
            
            return self.model_fit.aic
        except Exception as e:
            logger.error(f"Error in train: {str(e)}")
            raise

    def predict(self, prices, days_ahead):
        try:
            if self.model_fit is None:
                if os.path.exists(self.model_path):
                    logger.info("Loading saved model...")
                    with open(self.model_path, 'rb') as f:
                        saved_model = pickle.load(f)
                        self.model_fit = saved_model['model_fit']
                        self.order = saved_model['order']
                else:
                    raise ValueError("Model needs to be trained first")

            if len(prices) < self.min_training_samples:
                raise ValueError(f"Need at least {self.min_training_samples} prices for prediction")

            logger.info(f"Making predictions for {days_ahead} days...")
            # Make predictions
            forecast = self.model_fit.forecast(steps=days_ahead)
            predictions = forecast.values

            # Generate dates
            dates = [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') 
                    for i in range(1, days_ahead + 1)]

            # Calculate confidence intervals
            forecast_conf = self.model_fit.get_forecast(days_ahead)
            conf_int = forecast_conf.conf_int()
            
            confidence = []
            for lower, upper in conf_int:
                confidence.append({
                    'lower': float(max(0, lower)),  # Ensure non-negative
                    'upper': float(upper)
                })

            logger.info("Predictions generated successfully")
            return {
                'dates': dates,
                'predictions': predictions.tolist(),
                'confidence': confidence,
                'model_info': {
                    'order': self.order,
                    'aic': self.model_fit.aic
                }
            }
        except Exception as e:
            logger.error(f"Error in predict: {str(e)}")
            raise 