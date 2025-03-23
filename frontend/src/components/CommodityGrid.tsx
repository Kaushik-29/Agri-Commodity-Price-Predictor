import React from 'react';
import { Grid, Box, Typography, Container } from '@mui/material';
import CommodityCard from './CommodityCard';

interface Commodity {
  id: string | number;
  name: string;
  price: number;
  change: number;
  currency?: string;
}

interface CommodityGridProps {
  commodities: Commodity[];
  title?: string;
}

const CommodityGrid: React.FC<CommodityGridProps> = ({ 
  commodities, 
  title = 'Commodity Prices' 
}) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: 3,
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            pb: 1,
            display: 'inline-block'
          }}
        >
          {title}
        </Typography>
        
        <Grid container spacing={3}>
          {commodities.map((commodity) => (
            <Grid item key={commodity.id} xs={12} sm={6} md={4} lg={3}>
              <CommodityCard
                name={commodity.name}
                price={commodity.price}
                change={commodity.change}
                currency={commodity.currency}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CommodityGrid; 