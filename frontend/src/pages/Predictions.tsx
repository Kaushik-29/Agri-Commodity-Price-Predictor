import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  ListItemText,
  Avatar
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import DownloadIcon from '@mui/icons-material/Download';
import { predictionsService, Prediction } from '../services/predictionsService';
import { commoditiesService, Commodity } from '../services/commoditiesService';
import Chart from '../components/Chart';
import PriceFactorsInfo from '../components/PriceFactorsInfo';
import PriceUnit, { getPriceUnit } from '../components/PriceUnit';
import CommodityImage from '../components/CommodityImage';
import { colors } from '../theme/colors';
import { getCommodityImageUrl, getCommodityDescription } from '../utils/commodityUtils';

const Predictions: React.FC = () => {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [selectedCommodityName, setSelectedCommodityName] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('both');
  const [predictionHorizon, setPredictionHorizon] = useState<number>(12);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await commoditiesService.getCommodities();
      setCommodities(data);
      if (data.length > 0) {
        setSelectedCommodity(data[0].id);
        setSelectedCommodityName(data[0].name);
      }
    } catch (err) {
      setError('Failed to fetch commodities');
      console.error('Error fetching commodities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrediction = async () => {
    if (!selectedCommodity) {
      setError('Please select a commodity');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setIsOfflineMode(false);
      console.log('Generating prediction for:', selectedCommodity, 'with model:', selectedModel, 'for', predictionHorizon, 'months');

      const data = await predictionsService.createPrediction({
        commodity_id: selectedCommodity,
        model_name: selectedModel === 'both' ? 'lstm_arima' : selectedModel,
        prediction_horizon: predictionHorizon,
      });

      console.log('Received predictions:', data);
      setPredictions(data);

      if (data.length === 0) {
        setError('No predictions generated');
      }

      // Check if we're in offline mode based on the fact that we got data
      // but the network error still exists
      try {
        await fetch('http://localhost:8000/api', {
          method: 'HEAD',
          signal: AbortSignal.timeout(1000),
        });
      } catch (e) {
        setIsOfflineMode(true);
        setNotification('Using offline prediction mode - server is not available');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Network Error')) {
        setError('Failed to connect to server. Using offline prediction mode.');
        setIsOfflineMode(true);
      } else {
        setError(`Failed to generate predictions: ${err.message || 'Unknown error'}`);
      }
      console.error('Error generating predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedCommodity) {
      setError('Please select a commodity');
      return;
    }

    try {
      setError('');
      const blob = await predictionsService.downloadPredictions(selectedCommodity);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `predictions_${selectedCommodity}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      if (isOfflineMode) {
        setNotification('Downloaded offline predictions - actual data may vary');
      }
    } catch (err) {
      setError('Failed to download predictions');
      console.error('Error downloading predictions:', err);
    }
  };

  const closeNotification = () => {
    setNotification('');
  };

  const handleCommodityChange = (e: any) => {
    const commodityId = e.target.value;
    setSelectedCommodity(commodityId);
    
    // Find the commodity name for the selected ID
    const commodity = commodities.find(c => c.id === commodityId);
    if (commodity) {
      setSelectedCommodityName(commodity.name);
    }
  };

  const filteredPredictions = predictions.filter(p => {
    if (selectedModel === 'both') return true;
    return p.model_name.toLowerCase() === selectedModel.toLowerCase();
  });

  /* Styles for commodity images in dropdown */
  const renderCommodityMenuItem = (commodity: Commodity) => {
    const imageUrl = getCommodityImageUrl(commodity.name);
    
    return (
      <MenuItem key={commodity.id} value={commodity.id} sx={{ py: 1 }}>
        <Box display="flex" alignItems="center">
          <Avatar 
            src={imageUrl} 
            alt={commodity.name}
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 2,
              border: `1px solid ${colors.border}`
            }}
          />
          <ListItemText primary={commodity.name} />
        </Box>
      </MenuItem>
    );
  };

  return (
    <Container maxWidth='lg'>
      <Box my={4}>
        <Typography variant='h4' component='h1' gutterBottom>
          Price Predictions
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isOfflineMode && (
          <Alert severity='warning' sx={{ mb: 2 }}>
            Running in offline mode. Predictions are simulated and may not reflect actual data.
          </Alert>
        )}

        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 3,
            backgroundImage: 'linear-gradient(to right, rgba(243, 249, 234, 0.6), rgba(255, 255, 255, 0.8))',
            borderLeft: `5px solid ${colors.primary.main}`
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Select Commodity</InputLabel>
                <Select
                  value={selectedCommodity}
                  onChange={handleCommodityChange}
                  disabled={loading}
                  renderValue={(selected) => {
                    const commodity = commodities.find(c => c.id === selected);
                    if (!commodity) return '';
                    
                    const imageUrl = getCommodityImageUrl(commodity.name);
                    
                    return (
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={imageUrl} 
                          alt={commodity.name}
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            mr: 1,
                            border: `1px solid ${colors.border}`
                          }}
                        />
                        <Typography>{commodity.name}</Typography>
                      </Box>
                    );
                  }}
                >
                  {commodities.map(renderCommodityMenuItem)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <ToggleButtonGroup
                color="primary"
                value={selectedModel}
                exclusive
                onChange={(e, value) => value && setSelectedModel(value)}
                aria-label='prediction model'
                disabled={loading}
                sx={{ 
                  height: '56px',
                  width: '100%',
                  '& .MuiToggleButton-root': {
                    flex: 1,
                    borderRadius: 1
                  }
                }}
              >
                <ToggleButton value='lstm' aria-label='lstm model'>
                  LSTM
                </ToggleButton>
                <ToggleButton value='arima' aria-label='arima model'>
                  ARIMA
                </ToggleButton>
                <ToggleButton value='both' aria-label='both models'>
                  Both
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={predictionHorizon}
                  onChange={(e) => setPredictionHorizon(Number(e.target.value))}
                  disabled={loading}
                >
                  <MenuItem value={1}>Next 30 Days</MenuItem>
                  <MenuItem value={3}>Next 3 Months</MenuItem>
                  <MenuItem value={6}>Next 6 Months</MenuItem>
                  <MenuItem value={12}>Next 12 Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display='flex' gap={2}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleCreatePrediction}
                  disabled={!selectedCommodity || loading}
                  startIcon={<TimelineIcon />}
                  fullWidth
                  sx={{ 
                    py: 1.5,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                      backgroundColor: colors.primary.dark
                    }
                  }}
                >
                  Generate Prediction
                </Button>
                <Button
                  variant='outlined'
                  onClick={handleDownload}
                  disabled={!predictions.length || loading}
                  startIcon={<DownloadIcon />}
                  sx={{ minWidth: '120px' }}
                >
                  CSV
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {loading && (
          <Box display='flex' justifyContent='center' my={4}>
            <CircularProgress />
          </Box>
        )}

        {!loading && filteredPredictions.length > 0 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedCommodityName}
                  </Typography>
                  <CommodityImage 
                    commodityName={selectedCommodityName} 
                    height={200}
                  />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {getCommodityDescription(selectedCommodityName)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Chart
                  data={filteredPredictions}
                  selectedModels={selectedModel === 'both' ? ['lstm', 'arima'] : [selectedModel]}
                  predictionHorizon={predictionHorizon}
                  commodityName={selectedCommodityName}
                />
              </Grid>
            </Grid>
            
            {/* Add prediction summary */}
            <Box mt={3} p={2} bgcolor="rgba(0, 0, 0, 0.02)" borderRadius={1}>
              <Typography variant="h6" gutterBottom>
                Prediction Summary
              </Typography>
              <Typography variant="body2" paragraph>
                The chart above shows price predictions in Indian Rupees (₹) per quintal for {selectedCommodityName} over the next {predictionHorizon === 1 ? '30 days' : `${predictionHorizon} months`}.
                {selectedModel === 'both' ? (
                  <> Both LSTM (deep learning) and ARIMA (statistical) models are displayed for comparison.</>
                ) : (
                  <> The {selectedModel.toUpperCase()} model was used for this prediction.</>
                )}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Price Unit:</strong> All prices are displayed in <PriceUnit commodityName={selectedCommodityName} /> of {selectedCommodityName}, which is the standard trading unit for this commodity in Indian markets.
              </Typography>
              <Typography variant="body2">
                These predictions should be considered alongside market factors that may influence future prices.
                Explore the factors below to better understand what could affect {selectedCommodityName} prices.
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Only show price factors when a commodity is selected */}
        {selectedCommodityName && (
          <PriceFactorsInfo commodityType={selectedCommodityName.toLowerCase()} />
        )}

        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={closeNotification}
          message={notification}
        />
      </Box>
    </Container>
  );
};

export default Predictions;
