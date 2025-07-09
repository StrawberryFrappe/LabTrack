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

// Generate a simple UUID for instances when needed
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const instanceService = {
  /**
   * Normalize Instance Data
   * 
   * Ensures instance data has proper structure and required fields.
   */
  normalizeInstance(instance) {
    // Define default structure for a compound instance
    const defaultInstance = {
      id: instance.id && instance.id.trim() ? instance.id : generateId(),
      compoundId: instance.compoundId || '',
      location: instance.location || '',
      batchNumber: instance.batchNumber || '',
      quantity: parseFloat(instance.quantity) || 0,
      unit: instance.unit || '',
      receivedDate: instance.receivedDate || '',
      expiryDate: instance.expiryDate || '',
      openedDate: instance.openedDate || '',
      status: instance.status || (parseFloat(instance.quantity) > 0 ? 'active' : 'used_up'),
      description: instance.description || '',
      createdAt: instance.createdAt || new Date().toISOString()
    }

    return { ...defaultInstance, ...instance }
  },

  /**
   * Get All Instances
   * 
   * Fetches all compound instances with optional filtering.
   */
  async getAll(params = {}) {
    const response = await api.get('/compoundInstances', { params })
    // Normalize all instances to ensure consistent structure
    return response.data.map(instance => this.normalizeInstance(instance))
  },

  /**
   * Get Instance by ID
   * 
   * Fetches a specific compound instance.
   */
  async getById(id) {
    const response = await api.get(`/compoundInstances/${id}`)
    return this.normalizeInstance(response.data)
  },

  /**
   * Get Instances for Compound
   * 
   * Fetches all instances of a specific compound.
   */
  async getByCompoundId(compoundId) {
    const response = await api.get(`/compoundInstances?compoundId=${compoundId}`)
    return response.data.map(instance => this.normalizeInstance(instance))
  },

  /**
   * Create New Instance
   * 
   * Adds a new compound instance.
   */
  async create(instanceData) {
    const instanceWithDefaults = this.normalizeInstance({
      ...instanceData,
      status: instanceData.status || 'active',
      createdAt: new Date().toISOString()
    })
    
    // Remove ID to let JSON Server auto-generate, fallback to our generated ID
    const dataToSend = { ...instanceWithDefaults }
    delete dataToSend.id
    
    const response = await api.post('/compoundInstances', dataToSend)
    return this.normalizeInstance(response.data)
  },

  /**
   * Update Instance
   * 
   * Updates an existing compound instance.
   */
  async update(id, updates) {
    // Get current instance data first to ensure we maintain all fields
    const currentInstance = await this.getById(id)
    const normalizedUpdates = this.normalizeInstance({ ...currentInstance, ...updates })
    
    const response = await api.put(`/compoundInstances/${id}`, normalizedUpdates)
    return this.normalizeInstance(response.data)
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
   * Get Instances by Location
   * 
   * Fetches instances at a specific location.
   */
  async getByLocation(location) {
    const response = await api.get(`/compoundInstances?location=${encodeURIComponent(location)}`)
    return response.data.map(instance => this.normalizeInstance(instance))
  },

  /**
   * Update Instance Quantity
   * 
   * Helper method to update just the quantity of an instance.
   * This is commonly used during transactions.
   * Ensures proper status management when quantity changes.
   */
  async updateQuantity(id, quantity) {
    // Prepare update object with quantity and status
    const updates = { 
      quantity: parseFloat(quantity) || 0
    }
    
    // Automatically update status based on quantity
    if (updates.quantity <= 0) {
      updates.status = 'used_up'
      updates.quantity = 0
    } else {
      updates.status = 'active'
    }
    
    return this.update(id, updates)
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
    return response.data.map(instance => this.normalizeInstance(instance))
  }
}
