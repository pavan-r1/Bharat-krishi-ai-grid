import { MOCK_SCHEMES, MOCK_SCHEME_CATEGORIES } from '../data/mockSchemes';
import apiClient, { IS_MOCK_MODE } from './apiClient';

export const schemesService = {
  /**
   * Get all scheme categories
   */
  async getCategories() {
    if (IS_MOCK_MODE) return MOCK_SCHEME_CATEGORIES;
    return apiClient.get('/api/v1/schemes/categories');
  },

  /**
   * Retrieve agricultural schemes with keyword search and category filtering
   */
  async getSchemes(filters = {}) {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 250));
      let results = [...MOCK_SCHEMES];

      if (filters.category && filters.category !== 'All Categories') {
        results = results.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }

      return results;
    }

    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All Categories') params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    return apiClient.get(`/api/v1/schemes/?${params.toString()}`);
  },

  /**
   * Get single scheme by ID
   */
  async getSchemeById(id) {
    if (IS_MOCK_MODE) {
      const scheme = MOCK_SCHEMES.find(s => s.id === id);
      if (!scheme) throw new Error('Scheme not found');
      return scheme;
    }

    return apiClient.get(`/api/v1/schemes/${id}`);
  }
};

export default schemesService;
