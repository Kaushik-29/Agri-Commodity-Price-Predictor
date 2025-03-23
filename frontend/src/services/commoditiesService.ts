import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Commodity {
  id: string;
  name: string;
  category: string;
  current_price: number;
  unit: string;
  last_updated: string;
}

// Static commodity data
const staticCommodities: Commodity[] = [
  {
    id: 'wheat-001',
    name: 'Wheat',
    category: 'Cereals',
    current_price: 12500,
    unit: 'INR per Metric Ton',
    last_updated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'rice-001',
    name: 'Rice',
    category: 'Cereals',
    current_price: 13200,
    unit: 'INR per Metric Ton',
    last_updated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'corn-001',
    name: 'Corn',
    category: 'Cereals',
    current_price: 11800,
    unit: 'INR per Metric Ton',
    last_updated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'bananas-001',
    name: 'Bananas',
    category: 'Fruits',
    current_price: 45,
    unit: 'INR per Dozen',
    last_updated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'tea-001',
    name: 'Tea',
    category: 'Beverages',
    current_price: 350,
    unit: 'INR per Kilogram',
    last_updated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'dap-fertilizer-001',
    name: 'DAP Fertilizer',
    category: 'Agricultural Inputs',
    current_price: 1350,
    unit: 'INR per 50kg Bag',
    last_updated: new Date().toISOString().split('T')[0],
  },
  {
    id: 'robusta-coffee-001',
    name: 'Robusta Coffee',
    category: 'Beverages',
    current_price: 280,
    unit: 'INR per Kilogram',
    last_updated: new Date().toISOString().split('T')[0],
  }
];

export const commoditiesService = {
  getCommodities: async (): Promise<Commodity[]> => {
    try {
      console.log('Fetching commodities from API');
      const response = await axios.get(`${API_URL}/commodities`, {
        timeout: 5000,
      });

      if (response.data && Array.isArray(response.data)) {
        console.log('Received commodities from API:', response.data);
        return response.data;
      }

      console.warn('Invalid API response, using static data');
      return staticCommodities;
    } catch (error) {
      console.warn('Failed to fetch from API, using static data:', error);
      return staticCommodities;
    }
  },

  getCommodity: async (id: string): Promise<Commodity> => {
    try {
      console.log(`Fetching commodity ${id} from API`);
      const response = await axios.get(`${API_URL}/commodities/${id}`, {
        timeout: 5000,
      });

      if (response.data) {
        console.log('Received commodity from API:', response.data);
        return response.data;
      }

      throw new Error('Invalid API response');
    } catch (error) {
      console.warn('Failed to fetch from API, using static data:', error);
      const commodity = staticCommodities.find(c => c.id === id);
      if (!commodity) {
        throw new Error('Commodity not found');
      }
      return commodity;
    }
  },
};
