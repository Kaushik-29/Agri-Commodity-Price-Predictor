import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Box,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';

interface PriceFactorProps {
  commodityType?: string;
}

// Define the Factor interface
interface Factor {
  factor: string;
  severity: number; // 1-4, where 4 is highest impact
}

interface CommodityFactors {
  increaseFactors: Factor[];
  decreaseFactors: Factor[];
  seasonalPatterns: string;
}

// Commodity-specific factors data
const commodityFactors: Record<string, CommodityFactors> = {
  wheat: {
    increaseFactors: [
      { factor: "Adverse weather conditions in major producing regions", severity: 4 },
      { factor: "Export restrictions from key producers", severity: 4 },
      { factor: "Low global inventory levels", severity: 3 },
      { factor: "Increased biofuel production", severity: 2 },
      { factor: "Higher input costs (fertilizer, fuel)", severity: 3 }
    ],
    decreaseFactors: [
      { factor: "Bumper harvests globally", severity: 4 },
      { factor: "Reduction in demand from key importers", severity: 3 },
      { factor: "Favorable weather during growing season", severity: 4 },
      { factor: "Government subsidy programs", severity: 2 },
      { factor: "Increased competition from other grains", severity: 2 }
    ],
    seasonalPatterns: "Prices typically increase during planting seasons and decrease post-harvest. In India, wheat is harvested in March-April, which often leads to price decreases in April-May."
  },
  rice: {
    increaseFactors: [
      { factor: "Monsoon failures in major producing regions", severity: 4 },
      { factor: "Export restrictions from major exporters", severity: 4 },
      { factor: "Increased demand from importing countries", severity: 3 },
      { factor: "Reduced planted acreage", severity: 3 },
      { factor: "Crop diseases affecting yield", severity: 3 }
    ],
    decreaseFactors: [
      { factor: "Above-normal monsoon rainfall", severity: 4 },
      { factor: "Increased production in major exporters", severity: 3 },
      { factor: "Government price support reductions", severity: 3 },
      { factor: "Decreased global demand", severity: 2 },
      { factor: "Lower shipping costs", severity: 2 }
    ],
    seasonalPatterns: "Price fluctuations follow monsoon cycles, with prices typically decreasing after the kharif harvest in November-December. Secondary price decreases often occur after the rabi harvest in some regions."
  },
  corn: {
    increaseFactors: [
      { factor: "Drought conditions in major producing areas", severity: 4 },
      { factor: "Increased ethanol production", severity: 3 },
      { factor: "Higher feed demand for livestock", severity: 3 },
      { factor: "Lower ending stocks globally", severity: 3 },
      { factor: "Trade disputes affecting global supply", severity: 2 }
    ],
    decreaseFactors: [
      { factor: "Record global production", severity: 4 },
      { factor: "Reduced biofuel mandates", severity: 3 },
      { factor: "Oversupply in major producing countries", severity: 3 },
      { factor: "Decrease in feed demand", severity: 3 },
      { factor: "Favorable growing conditions", severity: 4 }
    ],
    seasonalPatterns: "In India, kharif corn is harvested in September-October, causing price decreases, while rabi corn is harvested in March-April, leading to a secondary price decline period."
  },
  tea: {
    increaseFactors: [
      { factor: "Drought in major tea-growing regions", severity: 4 },
      { factor: "Labor shortages during plucking season", severity: 3 },
      { factor: "Pest outbreaks affecting quality", severity: 3 },
      { factor: "Increased global consumption", severity: 2 },
      { factor: "Rising production costs", severity: 3 }
    ],
    decreaseFactors: [
      { factor: "Favorable weather in tea regions", severity: 3 },
      { factor: "Oversupply from major producers", severity: 4 },
      { factor: "Reduced export demand", severity: 3 },
      { factor: "Currency fluctuations", severity: 2 },
      { factor: "Increased mechanization reducing costs", severity: 2 }
    ],
    seasonalPatterns: "First flush (March-April) and second flush (May-June) teas command premium prices. Prices typically decline during monsoon production (July-September) when quality is lower."
  },
  bananas: {
    increaseFactors: [
      { factor: "Disease outbreaks like Panama disease", severity: 4 },
      { factor: "Adverse weather events in growing regions", severity: 4 },
      { factor: "Rising transportation costs", severity: 3 },
      { factor: "Increased global demand", severity: 2 },
      { factor: "Labor shortages during harvest", severity: 3 }
    ],
    decreaseFactors: [
      { factor: "Bumper harvests in major producing states", severity: 4 },
      { factor: "Improved distribution infrastructure", severity: 2 },
      { factor: "Reduced export demand", severity: 3 },
      { factor: "Introduction of disease-resistant varieties", severity: 2 },
      { factor: "Seasonal demand fluctuations in importing countries", severity: 3 }
    ],
    seasonalPatterns: "Production occurs year-round but peaks between March and May in many Indian states. Prices typically decrease during peak harvest periods and increase during off-seasons."
  },
  "dap fertilizer": {
    increaseFactors: [
      { factor: "Rising natural gas prices (key input in production)", severity: 4 },
      { factor: "Increased global agricultural demand", severity: 3 },
      { factor: "Supply chain disruptions in major producing regions", severity: 3 },
      { factor: "Export restrictions in countries like China and Russia", severity: 4 },
      { factor: "Increased phosphate mining costs", severity: 3 }
    ],
    decreaseFactors: [
      { factor: "Government subsidies for fertilizers", severity: 4 },
      { factor: "Increased production capacity", severity: 3 },
      { factor: "Decreased natural gas prices", severity: 4 },
      { factor: "Lower crop planting forecasts", severity: 3 },
      { factor: "Oversupply in global markets", severity: 3 }
    ],
    seasonalPatterns: "Prices typically rise during planting seasons (pre-monsoon and pre-rabi) and decrease during off-seasons. Strongest demand typically occurs between January-March and June-August in India."
  },
  "robusta coffee": {
    increaseFactors: [
      { factor: "Droughts in major producing countries (Vietnam, Brazil)", severity: 4 },
      { factor: "Increased global coffee consumption", severity: 3 },
      { factor: "Crop diseases like coffee rust", severity: 4 },
      { factor: "Reduced global inventory levels", severity: 3 },
      { factor: "Rising shipping and logistics costs", severity: 2 }
    ],
    decreaseFactors: [
      { factor: "Bumper crops in major producing regions", severity: 4 },
      { factor: "Currency depreciation in producing countries", severity: 3 },
      { factor: "Lower than expected consumption", severity: 3 },
      { factor: "Higher Arabica-to-Robusta substitution ratio", severity: 2 },
      { factor: "Increased production area", severity: 3 }
    ],
    seasonalPatterns: "Vietnam's harvest (largest producer) runs from November to January, while Brazil's secondary harvest is from May to September. Prices often stabilize after harvest periods and rise during off-season months."
  }
};

// General market factor categories
const generalFactors = [
  {
    category: "Economic Factors",
    factors: [
      "Currency exchange rates", 
      "Interest rates", 
      "Global GDP growth", 
      "Inflation",
      "Energy prices"
    ]
  },
  {
    category: "Supply Chain Factors",
    factors: [
      "Transportation costs",
      "Storage availability",
      "Processing capacity",
      "Labor availability",
      "Logistics disruptions"
    ]
  },
  {
    category: "Climate Factors",
    factors: [
      "Monsoon performance",
      "Drought conditions",
      "Flooding events",
      "Temperature extremes",
      "Climate change impacts"
    ]
  },
  {
    category: "Geopolitical Factors",
    factors: [
      "Trade agreements",
      "Export restrictions",
      "Import tariffs",
      "Regional conflicts",
      "Sanctions"
    ]
  },
  {
    category: "Policy Factors",
    factors: [
      "Agricultural subsidies",
      "Minimum support prices",
      "Environmental regulations",
      "Land use policies",
      "Government buffer stocks"
    ]
  },
  {
    category: "Market Structure Factors",
    factors: [
      "Number of market participants",
      "Market concentration",
      "Presence of cooperatives",
      "Contract farming arrangements",
      "Futures markets development"
    ]
  }
];

const PriceFactorsInfo: React.FC<PriceFactorProps> = ({ commodityType }) => {
  const [expanded, setExpanded] = useState<string>('panel1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  // Get the commodity-specific factors if available, otherwise use general factors
  const specificFactors = commodityType && commodityType.toLowerCase() in commodityFactors 
    ? commodityFactors[commodityType.toLowerCase()] 
    : null;

  // Helper function to render severity indicator
  const renderSeverity = (severity: number) => {
    const colors = ['#e0e0e0', '#c8e6c9', '#ffecb3', '#ffcc80', '#ffab91'];
    return (
      <Box display="flex" alignItems="center">
        {[...Array(4)].map((_, i) => (
          <Box 
            key={i}
            sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%',
              bgcolor: i < severity ? colors[severity] : '#e0e0e0',
              mx: 0.2
            }} 
          />
        ))}
      </Box>
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Price Influencing Factors
        {commodityType && <Chip size="small" label={commodityType} sx={{ ml: 1 }} />}
      </Typography>

      <Accordion 
        expanded={expanded === 'panel1'} 
        onChange={handleChange('panel1')}
        sx={{ mt: 2 }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ bgcolor: 'rgba(76, 175, 80, 0.08)' }}
        >
          <Box display="flex" alignItems="center">
            <ArrowUpwardIcon color="success" sx={{ mr: 1 }} />
            <Typography>Factors That May Cause Price Increases</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {specificFactors ? (
            <List dense>
              {specificFactors.increaseFactors.map((item, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={item.factor} />
                  {renderSeverity(item.severity)}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Select a specific commodity to see detailed price increase factors.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded === 'panel2'} 
        onChange={handleChange('panel2')}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          sx={{ bgcolor: 'rgba(244, 67, 54, 0.08)' }}
        >
          <Box display="flex" alignItems="center">
            <ArrowDownwardIcon color="error" sx={{ mr: 1 }} />
            <Typography>Factors That May Cause Price Decreases</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {specificFactors ? (
            <List dense>
              {specificFactors.decreaseFactors.map((item, index) => (
                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ListItemText primary={item.factor} />
                  {renderSeverity(item.severity)}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Select a specific commodity to see detailed price decrease factors.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded === 'panel3'} 
        onChange={handleChange('panel3')}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
          sx={{ bgcolor: 'rgba(33, 150, 243, 0.08)' }}
        >
          <Box display="flex" alignItems="center">
            <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
            <Typography>Seasonal Patterns</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {specificFactors ? (
            <Typography variant="body2">
              {specificFactors.seasonalPatterns}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Select a specific commodity to see detailed seasonal patterns.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded === 'panel4'} 
        onChange={handleChange('panel4')}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
          sx={{ bgcolor: 'rgba(156, 39, 176, 0.08)' }}
        >
          <Box display="flex" alignItems="center">
            <InfoIcon sx={{ mr: 1, color: 'secondary.main' }} />
            <Typography>General Market Factors</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {generalFactors.map((category, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle2" gutterBottom>{category.category}</Typography>
              <Box component="ul" sx={{ mt: 0, pl: 2 }}>
                {category.factors.map((factor, idx) => (
                  <Typography 
                    key={idx} 
                    component="li" 
                    variant="body2" 
                    color="text.secondary"
                  >
                    {factor}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default PriceFactorsInfo; 