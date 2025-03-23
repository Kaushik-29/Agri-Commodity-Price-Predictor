import React from 'react';
import { Box, Paper } from '@mui/material';
import { getCommodityImageUrl } from '../utils/commodityUtils';

// Map of commodity IDs or names to their image URLs
// Using placeholder images from Unsplash for demonstration
const commodityImages: Record<string, string> = {
  // Use lowercase commodity names as keys for easier matching
  wheat: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500&q=80',
  rice: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=500&q=80',
  corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=500&q=80',
  tea: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=500&q=80',
  bananas: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80',
  // Default image if no match is found
  default: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=500&q=80'
};

interface CommodityImageProps {
  commodityName: string;
  height?: number | string;
  width?: number | string;
  elevation?: number;
}

const CommodityImage: React.FC<CommodityImageProps> = ({ 
  commodityName, 
  height = 200, 
  width = '100%',
  elevation = 2
}) => {
  // Get the image URL using the utility function
  const imageUrl = getCommodityImageUrl(commodityName);
  
  return (
    <Paper 
      elevation={elevation}
      sx={{ 
        height, 
        width, 
        overflow: 'hidden',
        borderRadius: 2,
        mb: 2
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={`${commodityName} commodity`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      />
    </Paper>
  );
};

export default CommodityImage; 