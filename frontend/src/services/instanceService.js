/**
 * Compound Instance Service
 * 
 * This service handles all compound instance-related API operations.
 * Compound instances represent physical containers/bottles of compounds
 * stored in specific locations with individual batch numbers and quantities.
 * 
 * Each instance belongs to a compound and tracks:
 * - Physical location and batch information
 * - Individual quantities and status
 * - Expiry and received dates
 * - Transaction history through instance ID
 */

import api from './api.js'

export const instanceService = {
  /**
   * Get All Instances
   * 
   * Fetches all compound instances with optional filtering.
   */
  async getAll(params = {}) {
    const response = await api.get('/compoundInstances', { params })
    return response.data
  },

  /**
   * Get Instance by ID
   * 
   * Fetches a specific compound instance.
   */
  async getById(id) {
    const response = await api.get(`/compoundInstances/${id}`)
    return response.data
  },

  /**
   * Get Instances for Compound
   * 
   * Fetches all instances of a specific compound.
   */
  async getByCompoundId(compoundId) {
    const response = await api.get(`/compoundInstances?compoundId=${compoundId}`)
    return response.data
  },

  /**
   * Create New Instance
   * 
   * Adds a new compound instance.
   */
  async create(instanceData) {
    const instanceWithDefaults = {
      ...instanceData,
      status: instanceData.status || 'active',
      createdAt: new Date().toISOString()
    }
    const response = await api.post('/compoundInstances', instanceWithDefaults)
    return response.data
  },

  /**
   * Update Instance
   * 
   * Updates an existing compound instance.
   */
  async update(id, updates) {
    const response = await api.put(`/compoundInstances/${id}`, updates)
    return response.data
  },

  /**
   * Delete Instance
   * 
   * Removes a compound instance.
   */
  async delete(id) {
    const response = await api.delete(`/compoundInstances/${id}`)
    return response.data
  },

  /**
   * Get Low Stock Instances
   * 
   * Fetches instances with low quantities.
   * Since thresholds are defined at compound level, we need compound data too.
   */
  async getLowStock() {
    const instances = await this.getAll()
    const compoundsResponse = await api.get('/compounds')
    const compounds = compoundsResponse.data
    
    return instances.filter(instance => {
      const compound = compounds.find(c => c.id === instance.compoundId)
      if (!compound) return false
      
      // Calculate total stock for this compound across all instances
      const compoundInstances = instances.filter(i => i.compoundId === compound.id)
      const totalStock = compoundInstances.reduce((sum, i) => sum + (i.quantity || 0), 0)
      
      return totalStock <= compound.threshold
    })
  },

  /**
   * Get Expiring Instances
   * 
   * Fetches instances expiring within specified days.
   */
  async getExpiring(days = 30) {
    const instances = await this.getAll()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    
    return instances.filter(instance => {
      if (!instance.expiryDate) return false
      const expiryDate = new Date(instance.expiryDate)
      return expiryDate <= futureDate && instance.status === 'active'
    })
  },

  /**
   * Get Instances by Location
   * 
   * Fetches instances at a specific location.
   */
  async getByLocation(location) {
    const response = await api.get(`/compoundInstances?location=${encodeURIComponent(location)}`)
    return response.data
  },

  /**
   * Update Instance Quantity
   * 
   * Helper method to update just the quantity of an instance.
   * This is commonly used during transactions.
   */
  async updateQuantity(id, quantity) {
    return this.update(id, { quantity })
  },

  /**
   * Mark Instance as Used Up
   * 
   * Changes instance status when quantity reaches zero.
   */
  async markAsUsedUp(id) {
    return this.update(id, { 
      status: 'used_up',
      quantity: 0 
    })
  },

  /**
   * Search Instances
   * 
   * Search instances by batch number, location, or other fields.
   */
  async search(query) {
    const response = await api.get(`/compoundInstances?q=${encodeURIComponent(query)}`)
    return response.data
  }
}
