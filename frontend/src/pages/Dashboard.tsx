import React from 'react';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// USD to INR conversion rate
const USD_TO_INR = 83;

// Helper function to format INR currency
const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Sample data with prices in INR
const priceData = [
  {
    date: '2024-01',
    wheat: 320 * USD_TO_INR,
    rice: 450 * USD_TO_INR,
    corn: 215 * USD_TO_INR,
  },
  {
    date: '2024-02',
    wheat: 315 * USD_TO_INR,
    rice: 460 * USD_TO_INR,
    corn: 220 * USD_TO_INR,
  },
  {
    date: '2024-03',
    wheat: 330 * USD_TO_INR,
    rice: 455 * USD_TO_INR,
    corn: 218 * USD_TO_INR,
  },
];

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant='h4' gutterBottom>
        Market Overview
      </Typography>
      <Typography variant='subtitle1' color='text.secondary' gutterBottom>
        All prices are per metric ton (1,000 kg)
      </Typography>

      <Grid container spacing={3}>
        {/* Price Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant='h6' gutterBottom>
              Commodity Price Trends
            </Typography>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              Price in INR per metric ton
            </Typography>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis
                  tickFormatter={value => formatINR(value)}
                  label={{
                    value: 'Price (INR/MT)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip formatter={(value: number) => [`${formatINR(value)} per MT`, 'Price']} />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='wheat'
                  stroke='#8884d8'
                  name='Wheat'
                  strokeWidth={2}
                />
                <Line type='monotone' dataKey='rice' stroke='#82ca9d' name='Rice' strokeWidth={2} />
                <Line type='monotone' dataKey='corn' stroke='#ffc658' name='Corn' strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant='h6'>Wheat</Typography>
            <Typography variant='h4' color='primary'>
              {formatINR(320.5 * USD_TO_INR)}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body1' color='text.secondary'>
              per metric ton (1,000 kg)
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Last updated: March 20, 2024
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant='h6'>Rice</Typography>
            <Typography variant='h4' color='primary'>
              {formatINR(450.75 * USD_TO_INR)}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body1' color='text.secondary'>
              per metric ton (1,000 kg)
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Last updated: March 20, 2024
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant='h6'>Corn</Typography>
            <Typography variant='h4' color='primary'>
              {formatINR(215.3 * USD_TO_INR)}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body1' color='text.secondary'>
              per metric ton (1,000 kg)
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Last updated: March 20, 2024
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
