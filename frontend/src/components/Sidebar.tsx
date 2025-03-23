import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  Grain as GrainIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Predictions', icon: <TimelineIcon />, path: '/predictions' },
  { text: 'Commodities', icon: <GrainIcon />, path: '/commodities' },
  { text: 'Models', icon: <PsychologyIcon />, path: '/models' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map(item => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
