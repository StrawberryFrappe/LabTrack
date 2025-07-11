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

// Helper para inyectar el JWT
function authHeaders() {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const compoundService = {
  /**
   * Get All Compounds
   * 
   * Fetches all compounds from the API.
   * You can add query parameters for filtering, pagination, etc.
   */
  async getAll(params = {}) {
    const response = await api.get('/compounds', {
      params,
      headers: authHeaders()
    })
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
    const response = await api.get(`/compounds/${id}`, {
      headers: authHeaders()
    })
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
    const response = await api.post('/compounds', compound, {
      headers: authHeaders()
    })
    return response.data
  },

  /**
   * Update Existing Compound
   * 
   * Updates a compound with new data.
   * npm run client 
   * @param {string|number} id - The compound ID
   * @param {Object} compound - The updated compound data
   */
  async update(id, compound) {
    const formatted = toSnakeCaseCompound(compound)
    console.log(formatted)
    console.log('Updating compound:', id, formatted)
    const response = await api.put(`/compounds/${id}`, formatted, {
      headers: authHeaders()
    })
    console.log("aaa",response)
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
    const response = await api.delete(`/compounds/${id}`, {
      headers: authHeaders()
    })
    await this.getAll()
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
    const response = await api.get(`/compounds?q=${encodeURIComponent(query)}`, {
      headers: authHeaders()
    })
    return response.data
  },

  /**
   * Get Low Stock Items
   * 
   * Fetches compounds that are below their threshold quantity.
   * This could be a separate endpoint in production for better performance.
   */
  async getLowStock() {
    try {
      const response = await api.get('/compounds/low-stock', {
        headers: authHeaders()
      })
      return response.data
    } catch {
      const compounds = await this.getAll()
      return compounds.filter(c => c.quantity <= c.threshold)
    }
  },

  /**
   * Get Expiring Items
   * 
   * Fetches compounds that are expiring soon.
   * 
   * @param {number} days - Number of days ahead to check (default: 30)
   */
  async getExpiring(days = 30) {
    try {
      const response = await api.get('/compounds/expiring', {
        params: { days },
        headers: authHeaders()
      })
      return response.data
    } catch {
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
}



function toSnakeCaseCompound(obj) {
  const map = {
    casNumber: 'cas_number',
    hazardClass: 'hazard_class'
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [map[key] || key, val])
  )
}
