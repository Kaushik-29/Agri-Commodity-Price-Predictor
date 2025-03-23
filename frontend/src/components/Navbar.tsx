import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={onMenuClick}
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
          Agricultural Commodity Price Predictor
        </Typography>
        
        <Box sx={{ display: 'flex' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/dashboard"
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/predictions"
          >
            Predictions
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/commodities"
          >
            Commodities
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
