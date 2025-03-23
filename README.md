# Agricultural Commodity Price Prediction Platform

This platform uses AI/ML models to predict agricultural commodity prices based on historical data, weather patterns, and market trends.

## Features

- Real-time price predictions for various agricultural commodities
- Historical price analysis and visualization
- Multiple ML models (ARIMA, LSTM) for accurate predictions
- Interactive dashboards for data visualization
- API endpoints for integration with other systems

## Tech Stack

- Frontend: React with TypeScript
- Backend: FastAPI (Python)
- ML Models: TensorFlow, scikit-learn
- Database: SQLite (for development)

## Setup Instructions

1. Clone the repository
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
5. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   ├── ml_models/
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── data/
    ├── raw/
    └── processed/
``` 