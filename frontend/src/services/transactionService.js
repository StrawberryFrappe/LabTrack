/**
 * Transaction Service
 * 
 * Handles all inventory transaction operations.
 * Designed to work with JSON Server (development) and easily adaptable
 * for real backend APIs (production).
 * 
 * Transaction Types:
 * - use: Consume stock (decreases quantity)
 * - restock: Add stock (increases quantity)  
 * - adjust: Manual adjustment (sets absolute quantity)
 * - transfer: Move between locations
 * - waste: Disposal (decreases quantity)
 * 
 * Backend Agnostic Design:
 * - Simple REST endpoints that any backend can implement
 * - Standard HTTP methods (GET, POST, PUT, DELETE)
 * - JSON request/response format
 * - Predictable error handling
 */

import api from './api.js'

export const transactionService = {
  /**
   * Get All Transactions
   * 
   * Supports filtering by compound, type, date range, etc.
   * 
   * @param {Object} params - Query parameters
   * @param {string} params.compoundId - Filter by compound
   * @param {string} params.type - Filter by transaction type
   * @param {string} params.startDate - Filter by date range start
   * @param {string} params.endDate - Filter by date range end
   * @param {number} params._limit - Limit results (pagination)
   * @param {number} params._page - Page number (pagination)
   * @param {string} params._sort - Sort field
   * @param {string} params._order - Sort order (asc/desc)
   */
  async getAll(params = {}) {
    try {
      const response = await api.get('/transactions', { params })
      return {
        data: response.data,
        total: parseInt(response.headers['x-total-count'] || response.data.length),
        success: true
      }
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`)
    }
  },

  /**
   * Get Transactions by Entity (Compound or Instance)
   * 
   * Unified method to fetch transactions for either compound or instance.
   * 
   * @param {string} entityId - The compound or instance ID
   * @param {string} entityType - Either 'compound' or 'instance'
   */
  async getByEntity(entityId, entityType = 'instance') {
    try {
      const param = entityType === 'compound' ? 'compoundId' : 'instanceId'
      const response = await api.get('/transactions', {
        params: { 
          [param]: entityId,
          _sort: 'timestamp',
          _order: 'desc'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch ${entityType} transactions: ${error.message}`)
    }
  },

  // Legacy methods for backward compatibility
  async getByCompound(compoundId) {
    return this.getByEntity(compoundId, 'compound')
  },

  async getByInstance(instanceId) {
    return this.getByEntity(instanceId, 'instance')
  },

  /**
   * Create New Transaction
   * 
   * Simplified transaction creation with validation.
   * 
   * @param {Object} transaction - Transaction data
   * @param {string} transaction.instanceId - Instance ID (required)
   * @param {string} transaction.type - Transaction type
   * @param {number} transaction.quantity - Quantity (always positive)
   * @param {string} transaction.notes - Optional notes
   * @param {string} transaction.location - Location (for transfers)
   */
  async create(transaction) {
    try {
      // Basic validation
      if (!transaction.instanceId) {
        throw new Error('Instance ID is required')
      }
      if (!transaction.type) {
        throw new Error('Transaction type is required')
      }
      if (!transaction.quantity || transaction.quantity <= 0) {
        throw new Error('Quantity must be greater than 0')
      }

      // Create transaction with metadata
      const enhancedTransaction = {
        ...transaction,
        timestamp: new Date().toISOString(),
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      const response = await api.post('/transactions', enhancedTransaction)
      return response.data
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`)
    }
  },

  /**
   * Update Transaction
   * 
   * Allows editing of existing transactions.
   * Note: Changing quantity may affect stock calculations.
   * 
   * @param {string} id - Transaction ID
   * @param {Object} updates - Fields to update
   */
  async update(id, updates) {
    try {
      const response = await api.put(`/transactions/${id}`, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to update transaction: ${error.message}`)
    }
  },

  /**
   * Delete Transaction
   * 
   * Removes a transaction from the system.
   * Warning: This will affect stock calculations!
   * 
   * @param {string} id - Transaction ID
   */
  async delete(id) {
    try {
      await api.delete(`/transactions/${id}`)
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`)
    }
  },

  /**
   * Calculate Current Stock for Instance
   * 
   * Unified stock calculation method.
   * 
   * @param {string} instanceId - Instance ID
   * @param {number} initialStock - Initial instance quantity
   * @param {Array} transactions - Transaction history (optional)
   */
  async calculateStock(instanceId, initialStock = 0, transactions = null) {
    try {
      // Fetch transactions if not provided
      if (!transactions) {
        transactions = await this.getByInstance(instanceId)
      }

      // Calculate stock based on transaction types
      let currentStock = initialStock
      
      for (const transaction of transactions) {
        switch (transaction.type) {
          case 'use':
          case 'waste':
            currentStock -= transaction.quantity
            break
          case 'restock':
            currentStock += transaction.quantity
            break
          case 'adjust':
            currentStock = transaction.quantity
            break
          case 'transfer':
            currentStock -= transaction.quantity
            break
          default:
            console.warn(`Unknown transaction type: ${transaction.type}`)
        }
      }

      return Math.max(0, currentStock)
    } catch (error) {
      throw new Error(`Failed to calculate stock: ${error.message}`)
    }
  },

  // Legacy methods for backward compatibility
  async calculateInstanceStock(instanceId, initialStock = 0, transactions = null) {
    return this.calculateStock(instanceId, initialStock, transactions)
  },

  async calculateCurrentStock(compoundId, initialStock = 0, transactions = null) {
    try {
      if (!transactions) {
        transactions = await this.getByCompound(compoundId)
      }
      return this.calculateStock(compoundId, initialStock, transactions)
    } catch (error) {
      throw new Error(`Failed to calculate compound stock: ${error.message}`)
    }
  },

  /**
   * Get Transaction Statistics
   * 
   * Returns summary statistics for reporting.
   * 
   * @param {Object} filters - Optional filters
   */
  async getStatistics(filters = {}) {
    try {
      const transactions = await this.getAll(filters)
      
      const stats = {
        total: transactions.data.length,
        byType: {},
        totalQuantityUsed: 0,
        totalQuantityAdded: 0,
        dateRange: {
          earliest: null,
          latest: null
        }
      }

      // Process transactions for statistics
      transactions.data.forEach(transaction => {
        // Count by type
        stats.byType[transaction.type] = (stats.byType[transaction.type] || 0) + 1
        
        // Sum quantities
        if (['use', 'waste'].includes(transaction.type)) {
          stats.totalQuantityUsed += transaction.quantity
        } else if (transaction.type === 'restock') {
          stats.totalQuantityAdded += transaction.quantity
        }
        
        // Track date range
        const date = new Date(transaction.timestamp)
        if (!stats.dateRange.earliest || date < stats.dateRange.earliest) {
          stats.dateRange.earliest = date
        }
        if (!stats.dateRange.latest || date > stats.dateRange.latest) {
          stats.dateRange.latest = date
        }
      })

      return stats
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`)
    }
  }
}
