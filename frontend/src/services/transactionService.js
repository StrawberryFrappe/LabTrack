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
   * Get Transactions by Compound
   * 
   * Fetches all transactions for a specific compound.
   * Useful for showing transaction history on compound details.
   * 
   * @param {string} compoundId - The compound ID
   */
  async getByCompound(compoundId) {
    try {
      const response = await api.get('/transactions', {
        params: { 
          compoundId,
          _sort: 'timestamp',
          _order: 'desc'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch compound transactions: ${error.message}`)
    }
  },

  /**
   * Create New Transaction
   * 
   * Records a new inventory transaction.
   * Automatically calculates the effect on compound stock.
   * 
   * @param {Object} transaction - Transaction data
   * @param {string} transaction.compoundId - Compound ID
   * @param {string} transaction.type - Transaction type
   * @param {number} transaction.quantity - Quantity (always positive)
   * @param {string} transaction.notes - Optional notes
   * @param {string} transaction.location - Location (for transfers)
   */
  async create(transaction) {
    try {
      // Add metadata to transaction
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
   * Calculate Current Stock
   * 
   * Client-side calculation of current stock based on transactions.
   * For production, this should be moved to backend for accuracy.
   * 
   * @param {string} compoundId - Compound ID
   * @param {number} initialStock - Initial compound quantity
   * @param {Array} transactions - Transaction history (optional, will fetch if not provided)
   */
  async calculateCurrentStock(compoundId, initialStock = 0, transactions = null) {
    try {
      // Fetch transactions if not provided
      if (!transactions) {
        transactions = await this.getByCompound(compoundId)
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
            // Adjustment sets absolute quantity
            currentStock = transaction.quantity
            break
          case 'transfer':
            // For now, treat as use (decrease from current location)
            currentStock -= transaction.quantity
            break
          default:
            console.warn(`Unknown transaction type: ${transaction.type}`)
        }
      }

      return Math.max(0, currentStock) // Prevent negative stock
    } catch (error) {
      throw new Error(`Failed to calculate stock: ${error.message}`)
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
