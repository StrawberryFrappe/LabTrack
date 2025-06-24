// Inventory Count Service
// Handles all API operations for inventory count sessions
// Works with JSON Server and can be adapted for real backend APIs

import api from './api.js'

export const inventoryCountService = {
  /**
   * Get all inventory count sessions
   */
  async getAll() {
    const response = await api.get('/countSessions')
    return response.data
  },

  /**
   * Get a single count session by ID
   */
  async getById(id) {
    const response = await api.get(`/countSessions/${id}`)
    return response.data
  },

  /**
   * Create a new count session
   */
  async create(session) {
    const response = await api.post('/countSessions', session)
    return response.data
  },

  /**
   * Update an existing count session
   */
  async update(id, session) {
    const response = await api.put(`/countSessions/${id}`, session)
    return response.data
  },

  /**
   * Delete a count session
   */
  async delete(id) {
    const response = await api.delete(`/countSessions/${id}`)
    return response.data
  }
}
