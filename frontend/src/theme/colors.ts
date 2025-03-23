// Application color theme
export const colors = {
  // Primary colors - green shades for agricultural theme
  primary: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: '#ffffff'
  },
  
  // Secondary colors - brown/earthy tones
  secondary: {
    main: '#8d6e63',
    light: '#a58d82',
    dark: '#5f4339',
    contrastText: '#ffffff'
  },
  
  // Chart colors - for different models and confidence intervals
  chart: {
    // Model colors
    lstm: '#4caf50',  // Green for LSTM
    arima: '#1976d2', // Blue for ARIMA
    
    // Confidence interval colors (with transparency)
    lstmConfidence: 'rgba(76, 175, 80, 0.15)',
    arimaConfidence: 'rgba(25, 118, 210, 0.15)',
    
    // Actual data color
    actual: '#ff9800', // Orange for actual data
    
    // Grid and axis colors
    grid: '#eeeeee',
    axis: '#9e9e9e',
    
    // Special highlight colors
    highlight: '#f44336', // Red for important points
    annotation: '#7e57c2'  // Purple for annotations
  },
  
  // Status colors
  status: {
    success: '#66bb6a',
    warning: '#ffa726',
    error: '#e57373',
    info: '#42a5f5'
  },
  
  // Gradient backgrounds
  gradients: {
    primary: 'linear-gradient(to bottom right, #f3f9ea, #ffffff)',
    secondary: 'linear-gradient(to bottom right, #e8f5e9, #ffffff)',
    info: 'linear-gradient(to right, #f1f8e9, #ffffff)'
  },
  
  // Text colors
  text: {
    primary: '#333333',
    secondary: '#757575',
    disabled: '#bdbdbd'
  },
  
  // Background colors
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    light: '#f9f9f9'
  },
  
  // Border colors
  border: '#e0e0e0'
};

// Severity colors for the factors component
export const severityColors = {
  high: colors.status.error,
  medium: colors.status.warning,
  low: colors.status.success
};

export default colors; 