import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LSTMPredictor:
    def __init__(self):
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.sequence_length = 10
        self.model_path = 'lstm_model.h5'
        self.min_training_samples = 20

    def prepare_data(self, data):
        try:
            # Ensure data is numpy array
            data = np.array(data).reshape(-1, 1)
            
            # Scale the data
            scaled_data = self.scaler.fit_transform(data)
            
            # Create sequences
            X, y = [], []
            for i in range(len(scaled_data) - self.sequence_length):
                X.append(scaled_data[i:(i + self.sequence_length)])
                y.append(scaled_data[i + self.sequence_length])
            
            return np.array(X), np.array(y)
        except Exception as e:
            logger.error(f"Error in prepare_data: {str(e)}")
            raise

    def build_model(self, input_shape):
        try:
            model = Sequential([
                LSTM(100, activation='relu', input_shape=input_shape, return_sequences=True),
                Dropout(0.2),
                LSTM(100, activation='relu'),
                Dropout(0.2),
                Dense(50, activation='relu'),
                Dense(1)
            ])
            model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
            return model
        except Exception as e:
            logger.error(f"Error in build_model: {str(e)}")
            raise

    def train(self, prices):
        try:
            if len(prices) < self.min_training_samples:
                raise ValueError(f"Need at least {self.min_training_samples} data points for training")

            logger.info("Preparing training data...")
            X, y = self.prepare_data(prices)
            
            logger.info("Building and training model...")
            self.model = self.build_model((self.sequence_length, 1))
            history = self.model.fit(
                X, y,
                epochs=100,
                batch_size=32,
                validation_split=0.1,
                verbose=0
            )
            
            # Save the model
            self.model.save(self.model_path)
            logger.info("Model trained and saved successfully")
            
            return history.history['loss'][-1]
        except Exception as e:
            logger.error(f"Error in train: {str(e)}")
            raise

    def predict(self, prices, days_ahead):
        try:
            if self.model is None:
                if os.path.exists(self.model_path):
                    logger.info("Loading saved model...")
                    self.model = load_model(self.model_path)
                else:
                    raise ValueError("Model needs to be trained first")

            if len(prices) < self.sequence_length:
                raise ValueError(f"Need at least {self.sequence_length} prices for prediction")

            # Prepare last sequence
            last_sequence = np.array(prices[-self.sequence_length:])
            scaled_sequence = self.scaler.fit_transform(last_sequence.reshape(-1, 1))
            
            predictions = []
            current_sequence = scaled_sequence.copy()

            logger.info(f"Making predictions for {days_ahead} days...")
            for i in range(days_ahead):
                # Reshape for prediction
                current_sequence_reshaped = current_sequence.reshape(1, self.sequence_length, 1)
                
                # Get prediction
                next_pred = self.model.predict(current_sequence_reshaped, verbose=0)
                predictions.append(next_pred[0, 0])
                
                # Update sequence
                current_sequence = np.roll(current_sequence, -1)
                current_sequence[-1] = next_pred

            # Inverse transform predictions
            predictions = np.array(predictions).reshape(-1, 1)
            predictions = self.scaler.inverse_transform(predictions)

            # Generate dates
            dates = [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') 
                    for i in range(1, days_ahead + 1)]
            
            # Calculate confidence intervals
            std_dev = np.std(prices) * 1.96  # 95% confidence interval
            confidence = []
            for pred in predictions:
                confidence.append({
                    'lower': float(max(0, pred - std_dev)),  # Ensure non-negative
                    'upper': float(pred + std_dev)
                })

            logger.info("Predictions generated successfully")
            return {
                'dates': dates,
                'predictions': predictions.flatten().tolist(),
                'confidence': confidence
            }
        except Exception as e:
            logger.error(f"Error in predict: {str(e)}")
            raise 