import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Button, Box, useMediaQuery } from '@mui/material';

import appTheme from './theme';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Predictions from './pages/Predictions';
import Dashboard from './pages/Dashboard';
import WelcomeScreen from './components/WelcomeScreen';
import { AnimatePresence, motion } from 'framer-motion';
import CommoditiesPage from './pages/CommoditiesPage';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [showSkip, setShowSkip] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowWelcome(false);
    } else {
      // Show skip button after a delay
      const timer = setTimeout(() => {
        setShowSkip(true);
      }, isMobile ? 3000 : 5000); // Show sooner on mobile
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const handleWelcomeComplete = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowWelcome(false);
  };

  const handleSkip = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowWelcome(false);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Router>
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ height: '100vh', width: '100vw' }}
            >
              <WelcomeScreen onDragComplete={handleWelcomeComplete} />
              {showSkip && (
                <Box
                  position="absolute"
                  bottom="40px"
                  right="40px"
                  zIndex={1000}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSkip}
                    sx={{
                      opacity: 0.9,
                      '&:hover': { opacity: 1 },
                      backdropFilter: 'blur(8px)',
                      boxShadow: 2,
                    }}
                  >
                    Skip Intro
                  </Button>
                </Box>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
            >
              <NavBar />
              <Box component="main" sx={{ flexGrow: 1, paddingTop: '64px' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/predictions" element={<Predictions />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/commodities" element={<CommoditiesPage />} />
                </Routes>
              </Box>
              
              {/* Hidden developer button to reset welcome screen */}
              <Box position="fixed" right={10} bottom={10} sx={{ opacity: 0.2, zIndex: 1000 }}>
                <Button 
                  size="small" 
                  variant="text" 
                  onClick={() => {
                    localStorage.removeItem('hasVisited');
                    window.location.reload();
                  }}
                >
                  Reset
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
};

export default App;
