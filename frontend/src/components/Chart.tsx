import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { Prediction } from '../services/predictionsService';
import { colors } from '../theme/colors';
import { getPriceUnit } from './PriceUnit';

interface ChartProps {
  data: Prediction[];
  selectedModels: string[];
  predictionHorizon: number;
  commodityName: string;
}

const Chart: React.FC<ChartProps> = ({ data, selectedModels, predictionHorizon, commodityName }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  // Process and format data for the chart
  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    console.log('Chart data:', data);

    // Group predictions by date
    const grouped: Record<string, any> = {};
    
    data.forEach(prediction => {
      const date = prediction.prediction_date;
      
      if (!grouped[date]) {
        grouped[date] = {
          date: date,
          formattedDate: formatDate(date, predictionHorizon)
        };
      }
      
      // Add prediction for specific model
      grouped[date][`${prediction.model_name.toLowerCase()}_price`] = prediction.predicted_price;
      
      // Add confidence intervals if they exist
      if (prediction.lower_bound) {
        grouped[date][`${prediction.model_name.toLowerCase()}_lower`] = prediction.lower_bound;
      }
      if (prediction.upper_bound) {
        grouped[date][`${prediction.model_name.toLowerCase()}_upper`] = prediction.upper_bound;
      }
      
      // Store actual price if available
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
  }, [data, predictionHorizon]);

  // Format date for display based on prediction horizon
  const formatDate = (dateStr: string, horizon: number) => {
    const date = new Date(dateStr);
    
    // For shorter periods (1 month), show day and month
    if (horizon === 1) {
      return new Intl.DateTimeFormat('en-IN', { 
        day: 'numeric', 
        month: 'short' 
      }).format(date);
    } 
    // For 3 months, show date with month abbreviated
    else if (horizon === 3) {
      return new Intl.DateTimeFormat('en-IN', { 
        day: 'numeric', 
        month: 'short' 
      }).format(date);
    }
    // For longer periods (6-12 months), just show month and year
    else {
      return new Intl.DateTimeFormat('en-IN', { 
        month: 'short', 
        year: 'numeric' 
      }).format(date);
    }
  };

  // Custom tooltip to show price values in rupees
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const unit = getPriceUnit(commodityName);
      
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            border: `1px solid ${colors.border}`,
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            {label}
          </Typography>
          
          {payload.map((entry: any) => (
            <Box key={entry.name} display="flex" alignItems="center" mb={0.5}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%',
                  bgcolor: entry.color,
                  mr: 1 
                }} 
              />
              <Typography variant="body2" sx={{ mr: 1 }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                ₹{Number(entry.value).toFixed(2)}/{unit}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // If no data, show message
  if (chartData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>No chart data available</Typography>
      </Box>
    );
  }

  // Find today's date or the last actual price date to mark on chart
  const lastActualDate = chartData.find(item => item.actual_price !== undefined)?.date;

  // Get the appropriate unit for the Y-axis label
  const unit = getPriceUnit(commodityName);

  // Determine how many ticks to show based on prediction horizon
  const getTickCount = () => {
    if (predictionHorizon === 1) return 6; // For 30 days, show 6 ticks
    if (predictionHorizon === 3) return 6; // For 3 months, show 6 ticks
    if (predictionHorizon === 6) return 6; // For 6 months, show 6 ticks
    return 6; // For 12 months, show 6 ticks
  };

  return (
    <Box sx={{ width: '100%', height: 400, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} vertical={false} />
          
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fill: colors.text.secondary }}
            axisLine={{ stroke: colors.chart.axis }}
            tickLine={{ stroke: colors.chart.axis }}
            interval="preserveStartEnd"
            tickCount={getTickCount()}
          />
          
          <YAxis 
            tickFormatter={(value) => `₹${value.toFixed(0)}`} 
            tick={{ fill: colors.text.secondary }}
            axisLine={{ stroke: colors.chart.axis }}
            tickLine={{ stroke: colors.chart.axis }}
            label={{ value: `Price (₹/${unit})`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: colors.text.secondary } }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend verticalAlign="top" height={36} />
          
          {/* Actual price data */}
          {chartData.some(item => item.actual_price !== undefined) && (
            <Line
              type="monotone"
              dataKey="actual_price"
              name="Actual Price"
              stroke={colors.chart.actual}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'white' }}
            />
          )}

          {/* Divider for prediction start */}
          {lastActualDate && (
            <ReferenceLine
              x={formatDate(lastActualDate, predictionHorizon)}
              stroke={colors.chart.axis}
              strokeDasharray="5 5"
              label={{ value: 'Today', position: 'top', fill: colors.text.secondary }}
            />
          )}
          
          {/* LSTM model */}
          {selectedModels.includes('lstm') && (
            <>
              {/* Confidence interval as area */}
              {chartData.some(item => item.lstm_lower !== undefined && item.lstm_upper !== undefined) && (
                <>
                  <Area
                    type="monotone"
                    dataKey="lstm_lower"
                    stroke="transparent"
                    fill={colors.chart.lstmConfidence}
                    fillOpacity={0.4}
                    name="LSTM Lower Bound"
                    isAnimationActive={false}
                    legendType="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="lstm_upper"
                    stroke="transparent"
                    fill={colors.chart.lstmConfidence}
                    fillOpacity={0.4}
                    name="LSTM Confidence"
                    isAnimationActive={false}
                  />
                </>
              )}
              
              {/* Main prediction line */}
              <Line
                type="monotone"
                dataKey="lstm_price"
                name="LSTM"
                stroke={colors.chart.lstm}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </>
          )}
          
          {/* ARIMA model */}
          {selectedModels.includes('arima') && (
            <>
              {/* Confidence interval as area */}
              {chartData.some(item => item.arima_lower !== undefined && item.arima_upper !== undefined) && (
                <>
                  <Area
                    type="monotone"
                    dataKey="arima_lower"
                    stroke="transparent"
                    fill={colors.chart.arimaConfidence}
                    fillOpacity={0.4}
                    name="ARIMA Lower Bound" 
                    isAnimationActive={false}
                    legendType="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="arima_upper"
                    stroke="transparent"
                    fill={colors.chart.arimaConfidence}
                    fillOpacity={0.4}
                    name="ARIMA Confidence"
                    isAnimationActive={false}
                  />
                </>
              )}
              
              {/* Main prediction line */}
              <Line
                type="monotone"
                dataKey="arima_price"
                name="ARIMA"
                stroke={colors.chart.arima}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart;
