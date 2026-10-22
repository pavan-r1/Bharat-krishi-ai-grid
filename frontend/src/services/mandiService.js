import { MOCK_CROPS, MOCK_STATES, MOCK_PRICE_RECORDS } from '../data/mockMandiPrices';
import apiClient, { IS_MOCK_MODE } from './apiClient';

export const mandiService = {
  /**
   * Get supported crops list
   */
  async getCrops() {
    if (IS_MOCK_MODE) {
      return MOCK_CROPS;
    }
    return apiClient.get('/api/v1/mandi/crops');
  },

  /**
   * Get states, districts, and markets list
   */
  async getStates() {
    if (IS_MOCK_MODE) {
      return MOCK_STATES;
    }
    return apiClient.get('/api/v1/mandi/states');
  },

  /**
   * Get commodity price intelligence & historical trend
   */
  async getCommodityPrices(commodityName = 'Ragi (Finger Millet)', filters = {}) {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const record = MOCK_PRICE_RECORDS[commodityName] || MOCK_PRICE_RECORDS['Ragi (Finger Millet)'];
      let comparisons = [...record.marketComparisons];

      if (filters.state && filters.state !== 'all') {
        comparisons = comparisons.filter(m => m.state === filters.state);
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        comparisons = comparisons.filter(m =>
          m.market.toLowerCase().includes(q) ||
          m.district.toLowerCase().includes(q)
        );
      }

      return {
        ...record,
        marketComparisons: comparisons,
        isSampleData: true
      };
    }

    // Backend endpoint when available
    const params = new URLSearchParams({ commodity: commodityName });
    Object.entries(filters).forEach(([key, value]) => { if (value && value !== 'all') params.set(key, value); });
    return apiClient.get(`/api/v1/mandi/prices?${params.toString()}`);
  }
};

export default mandiService;
