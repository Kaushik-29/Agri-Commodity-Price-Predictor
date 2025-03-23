import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { getCommodityImageUrl, getCommodityDescription } from '../utils/commodityUtils';

interface CommodityCardProps {
  name: string;
  price: number;
  change: number;
  currency?: string;
}

// Conversion rate from USD to INR (approximately)
const USD_TO_INR_RATE = 83.12;

// Fallback image in case the main image fails to load
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=500&q=80";

const CommodityCard: React.FC<CommodityCardProps> = ({ 
  name, 
  price, 
  change, 
  currency = 'INR' // Changed default to INR
}) => {
  const [imgSrc, setImgSrc] = useState(getCommodityImageUrl(name));
  const description = getCommodityDescription(name);
  
  // Handle image load error
  const handleImageError = () => {
    setImgSrc(FALLBACK_IMAGE);
  };
  
  // Convert price to INR if currency is INR
  const convertedPrice = currency === 'INR' ? price * USD_TO_INR_RATE : price;
  
  // Format change with + sign for positive values
  const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  const changeColor = change >= 0 ? 'success.main' : 'error.main';

  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 3,
      }
    }}>
      <CardMedia
        component="img"
        height="140"
        image={imgSrc}
        alt={name}
        onError={handleImageError}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ textTransform: 'capitalize' }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {convertedPrice.toLocaleString('en-IN', { 
              style: 'currency', 
              currency: currency,
              maximumFractionDigits: 2
            })}
          </Typography>
          <Typography variant="body1" sx={{ color: changeColor, fontWeight: 'bold' }}>
            {formattedChange}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CommodityCard; 