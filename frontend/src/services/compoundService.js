/**
 * Compound Service
 * 
 * This service handles all compound-related API operations.
 * It's designed to work with JSON Server for development but
 * can easily be adapted for real backend APIs.
 * 
 * All methods return promises, so you can use async/await
 * or .then/.catch to handle the responses.
 * 
 * For Production:
 * Just change the API endpoints to match your backend URLs.
 * The method signatures stay the same!
 */

import api from './api.js'

export const compoundService = {
  /**
   * Get All Compounds
   * 
   * Fetches all compounds from the API.
   * You can add query parameters for filtering, pagination, etc.
   */
  async getAll(params = {}) {
    const response = await api.get('/compounds', { params })
    return response.data
  },

  /**
   * Get Single Compound
   * 
   * Fetches a specific compound by its ID.
   * 
   * @param {string|number} id - The compound ID
   */
  async getById(id) {
    const response = await api.get(`/compounds/${id}`)
    return response.data
  },

  /**
   * Create New Compound
   * 
   * Adds a new compound to the database.
   * 
   * @param {Object} compound - The compound data
   */
  async create(compound) {
    const response = await api.post('/compounds', compound)
    return response.data
  },

  /**
   * Update Existing Compound
   * 
   * Updates a compound with new data.
   * 
   * @param {string|number} id - The compound ID
   * @param {Object} compound - The updated compound data
   */
  async update(id, compound) {
    const response = await api.put(`/compounds/${id}`, compound)
    return response.data
  },

  /**
   * Delete Compound
   * 
   * Removes a compound from the database.
   * 
   * @param {string|number} id - The compound ID
   */
  async delete(id) {
    const response = await api.delete(`/compounds/${id}`)
    return response.data
  },

  /**
   * Search Compounds
   * 
   * Searches compounds by name, CAS number, or other fields.
   * 
   * @param {string} query - The search query
   */
  async search(query) {
    // For JSON Server, we use the q parameter for full-text search
    // For production, you might have a dedicated search endpoint
    const response = await api.get(`/compounds?q=${encodeURIComponent(query)}`)
    return response.data
  },

  /**
   * Get Low Stock Items
   * 
   * Fetches compounds that are below their threshold quantity.
   * This could be a separate endpoint in production for better performance.
   */
  async getLowStock() {
    // For JSON Server, we fetch all and filter
    // In production, this would be a dedicated endpoint like /compounds/low-stock
    const compounds = await this.getAll()
    return compounds.filter(c => c.quantity <= c.threshold)
  },

  /**
   * Get Expiring Items
   * 
   * Fetches compounds that are expiring soon.
   * 
   * @param {number} days - Number of days ahead to check (default: 30)
   */
  async getExpiring(days = 30) {
    // For JSON Server, we fetch all and filter
    // In production, this would be a dedicated endpoint
    const compounds = await this.getAll()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    
    return compounds.filter(c => {
      if (!c.expiryDate) return false
      const expiryDate = new Date(c.expiryDate)
      return expiryDate <= futureDate
    })
  }
}
