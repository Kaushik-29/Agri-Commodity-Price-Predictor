import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Prediction {
  id: string;
  commodity_id: string;
  model_name: string;
  prediction_date: string;
  predicted_price: number;
  actual_price?: number;
  lower_bound?: number;
  upper_bound?: number;
}

export interface PredictionRequest {
  commodity_id: string;
  model_name: string;
  prediction_horizon: number;
}

// Mock data for offline mode
const generateMockPredictions = (request: PredictionRequest): Prediction[] => {
  const { commodity_id, model_name, prediction_horizon } = request;
  const predictions: Prediction[] = [];
  
  // Base price in rupees (higher value to represent rupee pricing)
  const basePrice = Math.random() * 5000 + 2500; // Random base price between 2500 and 7500 rupees
  const today = new Date();
  
  // Calculate how many days to generate based on prediction_horizon
  // For 1 month we'll use 30 days, otherwise multiply months by 30
  const futureDays = prediction_horizon === 1 ? 30 : prediction_horizon * 30;
  
  // Generate past data with actual prices (last 30 days)
  for (let i = 30; i >= 1; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const actualPrice = basePrice + (Math.random() * 500 - 250); // Random fluctuation in rupees
    
    if (model_name === 'lstm' || model_name === 'lstm_arima') {
      predictions.push({
        id: `mock-lstm-past-${i}`,
        commodity_id,
        model_name: 'lstm',
        prediction_date: date.toISOString().split('T')[0],
        predicted_price: actualPrice * (1 + (Math.random() * 0.06 - 0.03)), // Slightly off from actual
        actual_price: actualPrice,
        lower_bound: actualPrice * 0.9,
        upper_bound: actualPrice * 1.1
      });
    }
    
    if (model_name === 'arima' || model_name === 'lstm_arima') {
      predictions.push({
        id: `mock-arima-past-${i}`,
        commodity_id,
        model_name: 'arima',
        prediction_date: date.toISOString().split('T')[0],
        predicted_price: actualPrice * (1 + (Math.random() * 0.08 - 0.04)), // Slightly more off than LSTM
        actual_price: actualPrice,
        lower_bound: actualPrice * 0.85,
        upper_bound: actualPrice * 1.15
      });
    }
  }
  
  // Generate future predictions based on the selected horizon
  for (let i = 1; i <= futureDays; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    // Scale the trend factor based on the prediction horizon
    const trendFactor = 1 + (i / futureDays) * (Math.random() > 0.5 ? 0.2 : -0.1); // Slight trend up or down
    
    if (model_name === 'lstm' || model_name === 'lstm_arima') {
      const predictedPrice = basePrice * trendFactor * (1 + (Math.random() * 0.04 - 0.02));
      predictions.push({
        id: `mock-lstm-future-${i}`,
        commodity_id,
        model_name: 'lstm',
        prediction_date: date.toISOString().split('T')[0],
        predicted_price: predictedPrice,
        lower_bound: predictedPrice * 0.9,
        upper_bound: predictedPrice * 1.1
      });
    }
    
    if (model_name === 'arima' || model_name === 'lstm_arima') {
      const predictedPrice = basePrice * trendFactor * (1 + (Math.random() * 0.06 - 0.03));
      predictions.push({
        id: `mock-arima-future-${i}`,
        commodity_id,
        model_name: 'arima',
        prediction_date: date.toISOString().split('T')[0],
        predicted_price: predictedPrice,
        lower_bound: predictedPrice * 0.85,
        upper_bound: predictedPrice * 1.15
      });
    }
  }
  
  return predictions;
};

export const predictionsService = {
  getPredictions: async (commodityId: string): Promise<Prediction[]> => {
    try {
      console.log(`Fetching predictions for commodity: ${commodityId}`);
      const response = await axios.get(`${API_URL}/predictions/${commodityId}`);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  createPrediction: async (request: PredictionRequest): Promise<Prediction[]> => {
    try {
      console.log('Creating prediction with request:', request);
      console.log('API URL:', `${API_URL}/predictions/`);

      const response = await axios.post(`${API_URL}/predictions/`, request);
      return response.data;
    } catch (error: any) {
      console.error('Error creating prediction:', error);

      // Use static mock data when server is down
      if (
        error.code === 'ECONNABORTED' ||
        (error.message && error.message.includes('Network Error'))
      ) {
        console.log('Using mock predictions due to server unavailability');
        return generateMockPredictions(request);
      }

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(`Server error: ${error.response.data.detail || 'Unknown error'}`);
      }

      throw error;
    }
  },

  downloadPredictions: async (commodityId: string): Promise<Blob> => {
    try {
      console.log(`Downloading predictions for commodity: ${commodityId}`);
      const response = await axios.get(`${API_URL}/predictions/download/${commodityId}`, {
        responseType: 'blob',
        timeout: 5000, // 5 seconds timeout
      });
      return response.data;
    } catch (error: any) {
      console.error('Error downloading predictions:', error);

      // Generate a CSV file with mock data if server is down
      if (
        error.code === 'ECONNABORTED' ||
        (error.message && error.message.includes('Network Error'))
      ) {
        const mockData = generateMockPredictions({
          commodity_id: commodityId,
          model_name: 'lstm_arima',
          prediction_horizon: 12, // Default to 12 months for downloads
        });

        // Convert to CSV
        const headers = 'date,model,predicted_price_per_quintal,actual_price_per_quintal,lower_bound,upper_bound\n';
        const rows = mockData.map(p => {
          return `${p.prediction_date},${p.model_name},${p.predicted_price},${p.actual_price || ''},${p.lower_bound || ''},${p.upper_bound || ''}`;
        }).join('\n');
        const csvContent = headers + rows;

        // Create blob
        return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      }

      throw error;
    }
  },
};
