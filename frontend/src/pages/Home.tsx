import React from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import InfoIcon from '@mui/icons-material/Info';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4} textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Agricultural Commodity Price Predictor
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Forecast agricultural commodity prices using advanced machine learning models
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%',
                backgroundImage: 'linear-gradient(to bottom right, #f3f9ea, #ffffff)',
                borderTop: '5px solid #81c784'
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <ShowChartIcon fontSize="large" sx={{ color: '#66bb6a', mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Price Predictions
                </Typography>
              </Box>
              <Typography paragraph>
                Get 12-month price forecasts for a variety of agricultural commodities
                using our advanced prediction models. Compare different prediction methodologies
                and download the results for your analysis.
              </Typography>
              <Typography paragraph>
                Our system now includes detailed information about market factors that affect each commodity's
                price, helping you understand the context behind the predictions.
              </Typography>
              <Button 
                component={RouterLink} 
                to="/predictions" 
                variant="contained" 
                color="primary" 
                endIcon={<TrendingUpIcon />}
              >
                Generate Predictions
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%',
                backgroundImage: 'linear-gradient(to bottom right, #e8f5e9, #ffffff)',
                borderTop: '5px solid #4caf50'
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <InsightsIcon fontSize="large" sx={{ color: '#43a047', mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Key Features
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Multiple Prediction Models
              </Typography>
              <Typography paragraph>
                Compare results from LSTM (deep learning) and ARIMA (statistical) models
                to get a more comprehensive view of potential price movements.
              </Typography>
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Market Factors Analysis
              </Typography>
              <Typography paragraph>
                Understand the key factors that can cause price increases or decreases for each commodity,
                including seasonal patterns and general market influences.
              </Typography>
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Offline Capability
              </Typography>
              <Typography>
                The application can still provide predictions even when the server is unavailable,
                ensuring you always have access to the information you need.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                mt: 2,
                backgroundImage: 'linear-gradient(to right, #f1f8e9, #ffffff)',
                borderLeft: '5px solid #8bc34a'
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <InfoIcon fontSize="large" sx={{ color: '#689f38', mr: 1 }} />
                <Typography variant="h5" component="h2">
                  About This Project
                </Typography>
              </Box>
              <Typography paragraph>
                This application uses machine learning models trained on historical price data to predict
                future commodity prices. The predictions should be used as one of many tools in your
                decision-making process.
              </Typography>
              <Typography>
                For best results, combine these predictions with the market factors information
                provided and your own knowledge of market conditions and trends.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 