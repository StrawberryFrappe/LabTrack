/**
 * Inventory Management Composable
 * 
 * Simplified inventory management with focus on instance-based transactions.
 * Removes redundant validation and complex state management.
 */

import { ref, computed, reactive } from 'vue'
import { useToast } from './useToast.js'
import { useAuth } from './useAuth.js'
import { useCompoundInstances } from './useCompoundInstances.js'
import { transactionService } from '../services/transactionService.js'

// Shared state
const transactions = ref([])
const loading = ref(false)
const error = ref(null)
let isInitialized = false

// Transaction types configuration
const TRANSACTION_TYPES = {
  use: { 
    multiplier: -1, 
    icon: 'minus',
    color: 'red',
    requiresConfirmation: false
  },
  adjust: { 
    multiplier: 0, 
    icon: 'edit',
    color: 'blue',
    requiresConfirmation: true
  },
  transfer: { 
    multiplier: 0, 
    icon: 'arrow-right',
    color: 'yellow',
    requiresConfirmation: true
  },
  waste: { 
    multiplier: -1, 
    icon: 'trash',
    color: 'red',
    requiresConfirmation: true
  }
}

export function useInventory() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { updateInstanceQuantity } = useCompoundInstances()

  /**
   * Initialize inventory data
   */
  const initialize = async () => {
    if (isInitialized) return
    
    try {
      loading.value = true
      await loadTransactions()
      isInitialized = true
    } catch (err) {
      error.value = err.message
      console.error('Failed to initialize inventory:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Load transactions from server
   */
  const loadTransactions = async (filters = {}) => {
    try {
      loading.value = true
      
      const params = {
        _sort: 'timestamp',
        _order: 'desc',
        _limit: 100,
        ...filters
      }
      
    const result = await transactionService.getAll(params)
    if (!result || !Array.isArray(result.data)) {
      throw new Error('Invalid response from transaction service')
    }

    transactions.value = result.data
    error.value = null

      
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Validate transaction data
   */
  const validateTransaction = (transaction) => {
    const errors = []
    
    if (!transaction.instanceId) {
      errors.push('Instance ID is required')
    }
    
    if (!transaction.type || !TRANSACTION_TYPES[transaction.type]) {
      errors.push('Valid transaction type is required')
    }
    
    const quantity = parseFloat(transaction.quantity)
    if (isNaN(quantity) || quantity <= 0) {
      errors.push('Quantity must be a positive number')
    }
    
    // Check stock availability for consuming transactions
    const originalQuantity = parseFloat(transaction.originalQuantity) || 0
    if ((transaction.type === 'use' || transaction.type === 'waste') && 
        quantity > originalQuantity) {
      errors.push('Cannot use more than available quantity')
    }
    
    // Validate transfer destination
    if (transaction.type === 'transfer' && !transaction.location) {
      errors.push('Destination location is required for transfers')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Calculate new instance quantity after transaction
   */
  const calculateNewInstanceQuantity = (transaction) => {
    const { type, quantity, originalQuantity } = transaction
    const typeConfig = TRANSACTION_TYPES[type]
    
    if (type === 'adjust') {
      return parseFloat(quantity)
    }
    
    if (type === 'transfer') {
      return originalQuantity
    }
    
    return Math.max(0, originalQuantity + (parseFloat(quantity) * typeConfig.multiplier))
  }

  /**
   * Record a transaction (simplified)
   */
  const recordInstanceTransaction = async (transaction) => {
    try {
      loading.value = true
      
      // Validate transaction
      const validation = validateTransaction(transaction)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }
      
      // Calculate new quantity
      const newQuantity = calculateNewInstanceQuantity(transaction)
      
      // Prepare transaction data
      const transactionData = {
        ...transaction,
        userId: user.value?.id || 'unknown',
        userName: user.value?.name || 'Unknown User',
        newQuantity,
        timestamp: new Date().toISOString()
      }
      
      // Update instance quantity
      const instanceUpdates = {
        quantity: newQuantity,
        status: newQuantity <= 0 ? 'used_up' : 'active'
      }
      
      if (transaction.type === 'transfer' && transaction.location) {
        instanceUpdates.location = transaction.location
      }
      
      await updateInstanceQuantity(transaction.instanceId, newQuantity, instanceUpdates)
      
      // Save transaction
      const savedTransaction = await transactionService.create(transactionData)
      
      // Add to local state
      transactions.value.unshift(savedTransaction)
      
      return savedTransaction
      
    } catch (error) {
      const errorMessage = error?.message || 'Transaction failed'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a transaction
   */
  const deleteTransaction = async (id) => {
    try {
      loading.value = true
      
      const index = transactions.value.findIndex(t => t.id === id)
      if (index === -1) {
        throw new Error('Transaction not found')
      }
      
      // Remove from local state
      transactions.value.splice(index, 1)
      
      // Delete from server
      await transactionService.delete(id)
      
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Calculate current stock for a compound using server data
   */
  const calculateCurrentStock = async (compoundId, initialQuantity = 0) => {
    try {
      const compoundTransactions = await transactionService.getByCompound(compoundId)
      return await transactionService.calculateCurrentStock(
        compoundId, 
        initialQuantity, 
        compoundTransactions
      )
    } catch (err) {
      console.error('Failed to calculate stock:', err)
      return initialQuantity
    }
  }

  /**
   * Get stock level status for a compound
   */
  const getStockStatus = (currentStock, threshold) => {
    if (currentStock <= 0) {
      return { status: 'outOfStock', color: 'red', level: 'critical' }
    } else if (currentStock <= threshold * 0.5) {
      return { status: 'lowStock', color: 'red', level: 'warning' }
    } else if (currentStock <= threshold) {
      return { status: 'adequate', color: 'yellow', level: 'caution' }
    } else {
      return { status: 'adequate', color: 'green', level: 'good' }
    }
  }

  /**
   * Get transaction statistics
   */
  const getStatistics = async (filters = {}) => {
    try {
      return await transactionService.getStatistics(filters)
    } catch (err) {
      console.error('Failed to get statistics:', err)
      return {
        total: 0,
        byType: {},
        totalQuantityUsed: 0,
        totalQuantityAdded: 0,
        dateRange: { earliest: null, latest: null }
      }
    }
  }

  // Computed properties
  const recentTransactions = computed(() => 
    transactions.value.slice(0, 10)
  )
  
  const transactionsByType = computed(() => {
    return Object.keys(TRANSACTION_TYPES).reduce((acc, type) => {
      acc[type] = transactions.value.filter(t => t.type === type)
      return acc
    }, {})
  })

  // Auto-initialize when composable is used
  if (!isInitialized) {
    initialize()
  }

  return {
    // State
    transactions,
    loading,
    error,
    
    // Actions
    initialize,
    loadTransactions,
    recordInstanceTransaction,
    deleteTransaction,
    
    // Utilities
    calculateCurrentStock,
    calculateNewInstanceQuantity,
    getStockStatus,
    validateTransaction,
    getStatistics,
    
    // Computed
    recentTransactions,
    transactionsByType,
    
    // Constants
    TRANSACTION_TYPES
  }
}
