import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from statsmodels.tsa.arima.model import ARIMA
import pickle
import os

class LSTMARIMAModel:
    def __init__(self):
        self.lstm_model = None
        self.arima_model = None
        self.scaler = MinMaxScaler()
        self.sequence_length = 10
        
    def prepare_data(self, data):
        scaled_data = self.scaler.fit_transform(data.reshape(-1, 1))
        X, y = [], []
        for i in range(len(scaled_data) - self.sequence_length):
            X.append(scaled_data[i:(i + self.sequence_length), 0])
            y.append(scaled_data[i + self.sequence_length, 0])
        return np.array(X), np.array(y)
    
    def build_lstm_model(self):
        model = Sequential([
            LSTM(50, activation='relu', input_shape=(self.sequence_length, 1), return_sequences=True),
            LSTM(50, activation='relu'),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model
    
    def train(self, data, epochs=100, batch_size=32):
        X, y = self.prepare_data(data)
        X = X.reshape((X.shape[0], X.shape[1], 1))
        
        # Train LSTM
        self.lstm_model = self.build_lstm_model()
        self.lstm_model.fit(X, y, epochs=epochs, batch_size=batch_size, verbose=1)
        
        # Train ARIMA
        self.arima_model = ARIMA(data, order=(5,1,0))
        self.arima_model = self.arima_model.fit()
        
    def predict(self, data, forecast_steps=30):
        # LSTM prediction
        X = self.scaler.transform(data[-self.sequence_length:].reshape(-1, 1))
        X = X.reshape(1, self.sequence_length, 1)
        lstm_pred = self.lstm_model.predict(X)
        lstm_pred = self.scaler.inverse_transform(lstm_pred)
        
        # ARIMA prediction
        arima_pred = self.arima_model.forecast(steps=forecast_steps)
        
        # Combine predictions (simple average)
        combined_pred = (lstm_pred + arima_pred.values.reshape(-1, 1)) / 2
        return combined_pred
    
    def save_models(self, path='backend/app/ml_models/'):
        # Save LSTM model
        self.lstm_model.save(os.path.join(path, 'lstm_model.h5'))
        
        # Save ARIMA model
        with open(os.path.join(path, 'arima_model.pkl'), 'wb') as f:
            pickle.dump(self.arima_model, f)
        
        # Save scaler
        with open(os.path.join(path, 'scaler.pkl'), 'wb') as f:
            pickle.dump(self.scaler, f)
    
    def load_models(self, path='backend/app/ml_models/'):
        # Load LSTM model
        self.lstm_model = load_model(os.path.join(path, 'lstm_model.h5'))
        
        # Load ARIMA model
        with open(os.path.join(path, 'arima_model.pkl'), 'rb') as f:
            self.arima_model = pickle.load(f)
        
        # Load scaler
        with open(os.path.join(path, 'scaler.pkl'), 'rb') as f:
            self.scaler = pickle.load(f) 