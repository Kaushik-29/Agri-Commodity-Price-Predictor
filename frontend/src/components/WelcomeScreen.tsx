import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, useTheme, IconButton, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import GrainIcon from '@mui/icons-material/Grain';
import SpaIcon from '@mui/icons-material/Spa';
import GrassIcon from '@mui/icons-material/Grass';
import { motion, useAnimation } from 'framer-motion';

interface WelcomeScreenProps {
  onDragComplete: () => void;
}

// Animation variants for floating icons
const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDragComplete }) => {
  const theme = useTheme();
  const [dragY, setDragY] = useState(0);
  const dragThreshold = -100; // Amount user needs to drag up to trigger transition
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  // Add a pulsing animation to the drag handle
  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    });
  }, [controls]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    setIsDragging(false);

    // Trigger completion if dragged past threshold or flicked up with velocity
    if (info.offset.y < dragThreshold || info.velocity.y < -500) {
      // Animate the card flying upward
      controls
        .start({
          y: -1000,
          opacity: 0,
          transition: { duration: 0.5 },
        })
        .then(onDragComplete);
    } else {
      // Reset if not dragged enough
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      setDragY(0);
    }
  };

  const handleDrag = (_e: any, info: { offset: { y: number } }) => {
    // Only allow upward dragging (negative y values)
    if (info.offset.y <= 0) {
      setDragY(info.offset.y);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('hasVisited');
    window.location.reload();
  };

  return (
    <Box
      component={motion.div}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Background grain pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative floating icons */}
      <Box sx={{ position: 'absolute', top: '10%', left: '10%' }}>
        <motion.div variants={floatingAnimation} animate='animate'>
          <GrainIcon sx={{ fontSize: 40, opacity: 0.6 }} />
        </motion.div>
      </Box>

      <Box sx={{ position: 'absolute', top: '15%', right: '15%' }}>
        <motion.div variants={floatingAnimation} animate='animate' transition={{ delay: 0.5 }}>
          <SpaIcon sx={{ fontSize: 50, opacity: 0.6 }} />
        </motion.div>
      </Box>

      <Box sx={{ position: 'absolute', bottom: '20%', left: '20%' }}>
        <motion.div variants={floatingAnimation} animate='animate' transition={{ delay: 1 }}>
          <GrassIcon sx={{ fontSize: 45, opacity: 0.6 }} />
        </motion.div>
      </Box>

      {/* Reset button for testing */}
      <Tooltip title='Reset welcome screen (for testing)'>
        <IconButton
          sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
          onClick={handleReset}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <Typography variant='h2' component='h1' sx={{ mb: 4, textAlign: 'center', px: 2 }}>
          Welcome to Agricultural Commodity Price Predictor
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Typography variant='h5' sx={{ mb: 8, textAlign: 'center', px: 2 }}>
          Predict prices of agricultural commodities using machine learning
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Paper
          component={motion.div}
          drag='y'
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={controls}
          whileDrag={{ scale: 1.1 }}
          sx={{
            p: 3,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'grab',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: theme.palette.primary.main,
            maxWidth: '80%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            '&:active': {
              cursor: 'grabbing',
            },
            transform: `translateY(${isDragging ? 0 : '0px'})`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <KeyboardArrowUpIcon fontSize='large' />
          </motion.div>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mt: 1 }}>
            Drag up to continue
          </Typography>
          <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
            Swipe up to explore our application
          </Typography>
        </Paper>
      </motion.div>

      {/* Progress indicator based on drag amount */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <motion.div
          animate={{
            width: `${Math.min(100, (Math.abs(dragY) / Math.abs(dragThreshold)) * 100)}%`,
            backgroundColor: dragY < dragThreshold * 0.8 ? '#4caf50' : '#fff',
          }}
          transition={{ duration: 0.1 }}
          style={{
            height: '100%',
          }}
        />
      </Box>

      {/* Instruction overlay */}
      {!isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '120px',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant='body1'
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            ↑ Drag the card upwards to enter
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default WelcomeScreen;
