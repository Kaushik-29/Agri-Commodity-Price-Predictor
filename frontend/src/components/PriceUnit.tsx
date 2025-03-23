import React from 'react';

interface PriceUnitProps {
  commodityName: string;
}

// Map of commodities to their standard units of measurement in Indian markets
const commodityUnits: Record<string, { unit: string, weight: string }> = {
  wheat: { unit: 'quintal', weight: '100 kg' },
  rice: { unit: 'quintal', weight: '100 kg' },
  corn: { unit: 'quintal', weight: '100 kg' },
  tea: { unit: 'kg', weight: '1 kg' },
  bananas: { unit: 'dozen', weight: '12 pieces' },
  "dap fertilizer": { unit: 'bag', weight: '50 kg' },
  "robusta coffee": { unit: 'kg', weight: '1 kg' },
  // Default for other commodities
  default: { unit: 'quintal', weight: '100 kg' }
};

const PriceUnit: React.FC<PriceUnitProps> = ({ commodityName }) => {
  // Convert commodity name to lowercase and handle spaces
  const normalizedName = commodityName.toLowerCase().trim();
  
  // Find the specific commodity unit or use default
  const unitInfo = Object.keys(commodityUnits).includes(normalizedName) 
    ? commodityUnits[normalizedName] 
    : commodityUnits.default;
  
  return (
    <span>
      ₹ per {unitInfo.unit} ({unitInfo.weight})
    </span>
  );
};

export const getPriceUnit = (commodityName: string): string => {
  const normalizedName = commodityName.toLowerCase().trim();
  const unitInfo = Object.keys(commodityUnits).includes(normalizedName) 
    ? commodityUnits[normalizedName] 
    : commodityUnits.default;
  return unitInfo.unit;
};

export default PriceUnit; 