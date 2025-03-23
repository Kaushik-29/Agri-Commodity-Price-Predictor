import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ReferenceLine,
  ReferenceArea,
  Label
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { Prediction } from '../services/predictionsService';
import { colors } from '../theme/colors';

interface EnhancedChartProps {
  data: Prediction[];
  selectedModels: string[];
}

const EnhancedChart: React.FC<EnhancedChartProps> = ({ data, selectedModels }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<any[]>([]);
  const [todayDate, setTodayDate] = useState<string>('');

  // Process data when it changes
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Set today's date for reference line
    const today = new Date();
    setTodayDate(today.toISOString().split('T')[0]);
    
    console.log('Processing chart data:', data);

    // Group predictions by date and model
    const grouped: Record<string, any> = {};
    
    data.forEach(prediction => {
      const date = prediction.prediction_date;
      
      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          formattedDate: formatDate(date)
        };
      }
      
      // Add prediction for specific model
      grouped[date][`${prediction.model_name.toLowerCase()}_price`] = prediction.predicted_price;
      
      // Add confidence intervals if they exist (using any to bypass type checking)
      if ((prediction as any).lower_bound) {
        grouped[date][`${prediction.model_name.toLowerCase()}_lower`] = (prediction as any).lower_bound;
      }
      if ((prediction as any).upper_bound) {
        grouped[date][`${prediction.model_name.toLowerCase()}_upper`] = (prediction as any).upper_bound;
      }
      
      // Store actual price if available (this will be the same for all models on the same date)
      if (prediction.actual_price !== null && prediction.actual_price !== undefined) {
        grouped[date].actual_price = prediction.actual_price;
      }
    });
    
    // Convert to array and sort by date
    const formattedData = Object.values(grouped).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    console.log('Formatted chart data:', formattedData);
    setChartData(formattedData);
  }, [data]);

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  // Get custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: `1px solid ${colors.border}`,
            borderRadius: 1,
            boxShadow: 2,
            maxWidth: '250px',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>
          
          {/* Actual price if available */}
          {payload.find((p: any) => p.name === 'Actual Price') && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%',
                  bgcolor: colors.chart.actual,
                  mr: 1 
                }} 
              />
              <Typography variant="body2" sx={{ mr: 1 }}>
                Actual:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                ${Number(payload.find((p: any) => p.name === 'Actual Price').value).toFixed(2)}
              </Typography>
            </Box>
          )}
          
          {/* LSTM prediction */}
          {selectedModels.includes('lstm') && payload.find((p: any) => p.name === 'LSTM') && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%',
                  bgcolor: colors.chart.lstm,
                  mr: 1 
                }} 
              />
              <Typography variant="body2" sx={{ mr: 1 }}>
                LSTM:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                ${Number(payload.find((p: any) => p.name === 'LSTM').value).toFixed(2)}
              </Typography>
            </Box>
          )}
          
          {/* ARIMA prediction */}
          {selectedModels.includes('arima') && payload.find((p: any) => p.name === 'ARIMA') && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%',
                  bgcolor: colors.chart.arima,
                  mr: 1 
                }} 
              />
              <Typography variant="body2" sx={{ mr: 1 }}>
                ARIMA:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                ${Number(payload.find((p: any) => p.name === 'ARIMA').value).toFixed(2)}
              </Typography>
            </Box>
          )}
          
          {/* Date */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {new Date(payload[0].payload.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Render empty state
  if (!chartData.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>No chart data available</Typography>
      </Box>
    );
  }

  // Find the last actual price date to mark the transition to predictions
  const lastActualDate = chartData.filter(item => item.actual_price !== undefined)
    .map(item => item.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  // Calculate domain for price axis
  const allPrices = chartData.flatMap(item => {
    const prices = [];
    if (item.actual_price !== undefined) prices.push(item.actual_price);
    if (item.lstm_price !== undefined) prices.push(item.lstm_price);
    if (item.arima_price !== undefined) prices.push(item.arima_price);
    if (item.lstm_lower !== undefined) prices.push(item.lstm_lower);
    if (item.lstm_upper !== undefined) prices.push(item.lstm_upper);
    if (item.arima_lower !== undefined) prices.push(item.arima_lower);
    if (item.arima_upper !== undefined) prices.push(item.arima_upper);
    return prices;
  });
  
  // Safety check for empty or invalid prices array
  if (allPrices.length === 0 || allPrices.some(price => isNaN(price))) {
    console.error('Invalid price data detected:', allPrices);
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">Error in chart data processing</Typography>
      </Box>
    );
  }
  
  const minPrice = Math.min(...allPrices) * 0.9;
  const maxPrice = Math.max(...allPrices) * 1.1;

  return (
    <Box sx={{ width: '100%', height: 500, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colors.chart.grid} 
            vertical={false}
          />
          
          <XAxis 
            dataKey="formattedDate"
            tick={{ fill: colors.text.secondary }}
            axisLine={{ stroke: colors.chart.axis }}
            tickLine={{ stroke: colors.chart.axis }}
            padding={{ left: 15, right: 15 }}
          />
          
          <YAxis 
            domain={[minPrice, maxPrice]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            tick={{ fill: colors.text.secondary }}
            axisLine={{ stroke: colors.chart.axis }}
            tickLine={{ stroke: colors.chart.axis }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: 10 }}
          />
          
          {/* Reference line for today/last actual data */}
          {lastActualDate && (
            <ReferenceLine
              x={formatDate(lastActualDate)}
              stroke={theme.palette.grey[700]}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              label={
                <Label 
                  value="Today" 
                  position="insideBottomRight" 
                  style={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
              }
            />
          )}
          
          {/* Reference area for prediction zone */}
          {lastActualDate && (
            <ReferenceArea
              x1={formatDate(lastActualDate)}
              x2={formatDate(chartData[chartData.length - 1].date)}
              fill={theme.palette.grey[100]}
              fillOpacity={0.2}
              label={
                <Label
                  value="Predictions"
                  position="insideTop"
                  offset={15}
                  style={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                />
              }
            />
          )}
          
          {/* LSTM confidence interval */}
          {selectedModels.includes('lstm') && chartData.some(item => item.lstm_lower !== undefined) && (
            <Area
              type="monotone"
              dataKey="lstm_upper"
              stroke="transparent"
              fill={colors.chart.lstmConfidence}
              fillOpacity={0.7}
              activeDot={false}
              name="LSTM Confidence (Upper)"
              isAnimationActive={false}
              legendType="none"
            />
          )}
          
          {selectedModels.includes('lstm') && chartData.some(item => item.lstm_lower !== undefined) && (
            <Area
              type="monotone"
              dataKey="lstm_lower"
              stroke="transparent"
              fill={colors.chart.lstmConfidence}
              fillOpacity={0.7}
              baseLine={0}
              activeDot={false}
              name="LSTM Confidence (Lower)"
              isAnimationActive={false}
              legendType="none"
            />
          )}
          
          {/* ARIMA confidence interval */}
          {selectedModels.includes('arima') && chartData.some(item => item.arima_upper !== undefined) && (
            <Area
              type="monotone"
              dataKey="arima_upper"
              stroke="transparent"
              fill={colors.chart.arimaConfidence}
              fillOpacity={0.7}
              activeDot={false}
              name="ARIMA Confidence (Upper)"
              isAnimationActive={false}
              legendType="none"
            />
          )}
          
          {selectedModels.includes('arima') && chartData.some(item => item.arima_lower !== undefined) && (
            <Area
              type="monotone"
              dataKey="arima_lower"
              stroke="transparent"
              fill={colors.chart.arimaConfidence}
              fillOpacity={0.7}
              baseLine={0}
              activeDot={false}
              name="ARIMA Confidence (Lower)"
              isAnimationActive={false}
              legendType="none"
            />
          )}
          
          {/* Actual price line */}
          {chartData.some(item => item.actual_price !== undefined) && (
            <Line
              type="monotone"
              dataKey="actual_price"
              name="Actual Price"
              stroke={colors.chart.actual}
              strokeWidth={3}
              dot={{ stroke: colors.chart.actual, strokeWidth: 2, fill: 'white', r: 4 }}
              activeDot={{ stroke: colors.chart.actual, strokeWidth: 2, fill: 'white', r: 6 }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          )}
          
          {/* LSTM prediction line */}
          {selectedModels.includes('lstm') && chartData.some(item => item.lstm_price !== undefined) && (
            <Line
              type="monotone"
              dataKey="lstm_price"
              name="LSTM"
              stroke={colors.chart.lstm}
              strokeWidth={3}
              dot={{ stroke: colors.chart.lstm, strokeWidth: 2, fill: 'white', r: 4 }}
              activeDot={{ stroke: colors.chart.lstm, strokeWidth: 2, fill: 'white', r: 6 }}
              isAnimationActive={true}
              animationDuration={1200}
              connectNulls
            />
          )}
          
          {/* ARIMA prediction line */}
          {selectedModels.includes('arima') && chartData.some(item => item.arima_price !== undefined) && (
            <Line
              type="monotone"
              dataKey="arima_price"
              name="ARIMA"
              stroke={colors.chart.arima}
              strokeWidth={3}
              dot={{ stroke: colors.chart.arima, strokeWidth: 2, fill: 'white', r: 4 }}
              activeDot={{ stroke: colors.chart.arima, strokeWidth: 2, fill: 'white', r: 6 }}
              isAnimationActive={true}
              animationDuration={1400}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default EnhancedChart; 