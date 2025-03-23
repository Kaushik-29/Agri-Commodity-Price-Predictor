import React from 'react';
import CommodityGrid from '../components/CommodityGrid';

// Sample commodity data
const commoditiesData = [
  {
    id: 1,
    name: 'wheat',
    price: 638.75,
    change: 2.34,
    currency: 'INR'
  },
  {
    id: 2,
    name: 'rice',
    price: 18.92,
    change: 0.85,
    currency: 'INR'
  },
  {
    id: 3,
    name: 'corn',
    price: 450.25,
    change: -1.23,
    currency: 'INR'
  },
  {
    id: 4,
    name: 'tea',
    price: 3.85,
    change: 0.62,
    currency: 'INR'
  },
  {
    id: 5,
    name: 'bananas',
    price: 1.29,
    change: -0.38,
    currency: 'INR'
  },
  {
    id: 6,
    name: 'dap fertilizer',
    price: 712.50,
    change: 3.75,
    currency: 'INR'
  },
  {
    id: 7,
    name: 'robusta coffee',
    price: 2360.00,
    change: -2.15,
    currency: 'INR'
  },
  {
    id: 8,
    name: 'sugar',
    price: 19.22,
    change: 1.47,
    currency: 'INR'
  }
];

const CommoditiesPage: React.FC = () => {
  return (
    <div>
      <CommodityGrid
        commodities={commoditiesData}
        title="Global Commodity Market (₹)"
      />
    </div>
  );
};

export default CommoditiesPage; 