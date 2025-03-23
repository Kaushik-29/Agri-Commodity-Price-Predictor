import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';
import { commoditiesService, Commodity } from '../services/commoditiesService';

// Helper function to format INR currency
const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Commodities: React.FC = () => {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await commoditiesService.getCommodities();
      setCommodities(data);
    } catch (err) {
      setError('Failed to fetch commodities');
      console.error('Error fetching commodities:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant='h4' gutterBottom>
        Commodities Overview
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display='flex' justifyContent='center' my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align='right'>Current Price</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commodities.map(commodity => (
                    <TableRow key={commodity.id}>
                      <TableCell>{commodity.name}</TableCell>
                      <TableCell>{commodity.category}</TableCell>
                      <TableCell align='right'>{formatINR(commodity.current_price)}</TableCell>
                      <TableCell>{commodity.unit}</TableCell>
                      <TableCell>{commodity.last_updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Commodities;
