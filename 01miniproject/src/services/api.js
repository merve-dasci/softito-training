const BASE_URL = 'http://localhost:5000'

/**
 * Centralized API Layer Service for Bloomora.
 * Encapsulates fetch calls to JSON Server.
 */
export const api = {
  /**
   * Fetch all products from JSON Server.
   * @returns {Promise<Array>} List of products.
   */
  getProducts: async () => {
    try {
      const response = await fetch(`${BASE_URL}/products`)
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching products from API:', error)
      throw error
    }
  },

  /**
   * Fetch a single product by ID from JSON Server.
   * @param {string|number} id Product ID.
   * @returns {Promise<Object>} Single product details.
   */
  getProductById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching product ID ${id} from API:`, error)
      throw error
    }
  },

  /**
   * Fetch all product categories from JSON Server.
   * @returns {Promise<Array>} List of categories.
   */
  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories`)
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories from API:', error)
      throw error
    }
  }
}

export default api
