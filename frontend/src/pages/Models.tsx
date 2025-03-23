import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
} from '@mui/material';

const modelsData = [
  {
    id: 'lstm-001',
    name: 'LSTM Price Predictor',
    type: 'LSTM',
    description: 'Deep learning model for long-term price predictions with multiple features',
    accuracy: 0.88,
    lastTrained: '2024-03-18',
    status: 'active',
  },
  {
    id: 'arima-001',
    name: 'ARIMA Price Predictor',
    type: 'ARIMA',
    description: 'Time series forecasting model using ARIMA for short-term predictions',
    accuracy: 0.85,
    lastTrained: '2024-03-15',
    status: 'active',
  },
  {
    id: 'prophet-001',
    name: 'Prophet Forecaster',
    type: 'Prophet',
    description: 'Facebook Prophet model for seasonal price predictions',
    accuracy: 0.82,
    lastTrained: '2024-03-17',
    status: 'training',
  },
];

const Models: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant='h4' gutterBottom>
        ML Models
      </Typography>

      <Grid container spacing={3}>
        {modelsData.map(model => (
          <Grid item xs={12} md={4} key={model.id}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  {model.name}
                </Typography>
                <Typography color='textSecondary' gutterBottom>
                  Type: {model.type}
                </Typography>
                <Typography variant='body2' paragraph>
                  {model.description}
                </Typography>
                <Typography variant='body2'>
                  Accuracy: {(model.accuracy * 100).toFixed(1)}%
                </Typography>
                <Typography variant='body2'>Last Trained: {model.lastTrained}</Typography>
                {model.status === 'training' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant='body2' color='primary'>
                      Training in progress...
                    </Typography>
                    <LinearProgress sx={{ mt: 1 }} />
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button size='small' color='primary'>
                  View Details
                </Button>
                <Button size='small' color='primary' disabled={model.status === 'training'}>
                  Retrain Model
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Models;
