/**
 * Inventory Management Composable
 * 
 * This composable manages inventory sessions, transactions, and stock movements.
 * Now integrated with JSON Server for persistent data storage.
 * 
 * Key Features:
 * - Real API integration with transaction service
 * - Transaction recording with server persistence
 * - Transaction history with server-side filtering
 * - Stock level calculations with real data
 * - Optimistic UI updates with error rollback
 * - Backend-agnostic design for easy migration
 * 
 * Transaction Types:
 * - use: Consume/use stock (decreases quantity)
 * - restock: Add new stock (increases quantity)
 * - adjust: Manual adjustment (sets absolute quantity)
 * - transfer: Move between locations
 * - waste: Dispose/discard stock (decreases quantity)
 */

import { ref, computed, reactive } from 'vue'
import { useToast } from './useToast.js'
import { useAuth } from './useAuth.js'
import { transactionService } from '../services/transactionService.js'

// Shared state (singleton pattern)
const transactions = ref([])
const loading = ref(false)
const error = ref(null)
let isInitialized = false

// Transaction form state
const transactionForm = reactive({
  compoundId: '',
  type: 'use',
  quantity: '',
  notes: '',
  location: ''
})

// Transaction types configuration
const TRANSACTION_TYPES = {
  use: { 
    multiplier: -1, 
    icon: 'minus',
    color: 'red',
    requiresConfirmation: false
  },
  restock: { 
    multiplier: 1, 
    icon: 'plus',
    color: 'green',
    requiresConfirmation: false
  },
  adjust: { 
    multiplier: 0, // Special handling for adjustments
    icon: 'edit',
    color: 'blue',
    requiresConfirmation: true
  },
  transfer: { 
    multiplier: -1, // From current location
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

  /**
   * Initialize inventory data
   * Load transactions and set up real-time updates
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
   * Load transaction history from server
   * @param {Object} filters - Optional filters for pagination/search
   */
  const loadTransactions = async (filters = {}) => {
    try {
      loading.value = true
      
      // Add default sorting (newest first)
      const params = {
        _sort: 'timestamp',
        _order: 'desc',
        _limit: 50, // Reasonable default limit
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
      toast.error('Failed to load transaction history')
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Record a new transaction with server persistence
   * @param {Object} transaction - Transaction data
   */
  const recordTransaction = async (transaction) => {
    let newTransaction = null
    
    try {
      loading.value = true
      
      // Validate transaction
      const validation = validateTransaction(transaction)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }
      
      // Prepare transaction data
      const transactionData = {
        ...transaction,
        userId: user.value?.id || 'unknown',
        userName: user.value?.name || 'Unknown User'
      }
      
      // Optimistic update - add to local state immediately
      newTransaction = {
        id: `temp_${Date.now()}`,
        ...transactionData,
        timestamp: new Date().toISOString()
      }
      transactions.value.unshift(newTransaction)
      
      // Send to server
      const savedTransaction = await transactionService.create(transactionData)
      
      // Replace temporary transaction with server response
      const index = transactions.value.findIndex(t => t.id === newTransaction.id)
      if (index !== -1) {
        transactions.value[index] = savedTransaction
      }
      
      // Show success message
      toast.success('inventorySessions.messages.transactionRecorded')
      
      // Reset form
      resetTransactionForm()
      
      return savedTransaction
      
    } catch (err) {
      // Rollback optimistic update on error
      if (newTransaction) {
        transactions.value = transactions.value.filter(t => t.id !== newTransaction.id)
      }
      
      error.value = err.message
      toast.error('inventorySessions.messages.transactionFailed')
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing transaction
   * @param {string} id - Transaction ID
   * @param {Object} updates - Updated transaction data
   */
  const updateTransaction = async (id, updates) => {
    let originalTransaction = null
    
    try {
      loading.value = true
      
      const index = transactions.value.findIndex(t => t.id === id)
      if (index === -1) {
        throw new Error('Transaction not found')
      }
      
      // Store original for rollback
      originalTransaction = { ...transactions.value[index] }
      
      // Optimistic update
      transactions.value[index] = { 
        ...originalTransaction, 
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      // Send to server
      await transactionService.update(id, updates)
      
      toast.success('Transaction updated successfully')
      
    } catch (err) {
      // Rollback on error
      if (originalTransaction) {
        const index = transactions.value.findIndex(t => t.id === id)
        if (index !== -1) {
          transactions.value[index] = originalTransaction
        }
      }
      
      error.value = err.message
      toast.error('Failed to update transaction')
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   */
  const deleteTransaction = async (id) => {
    let deletedTransaction = null
    let deletedIndex = -1
    
    try {
      loading.value = true
      
      deletedIndex = transactions.value.findIndex(t => t.id === id)
      if (deletedIndex === -1) {
        throw new Error('Transaction not found')
      }
      
      // Store for rollback
      deletedTransaction = transactions.value[deletedIndex]
      
      // Optimistic update
      transactions.value.splice(deletedIndex, 1)
      
      // Send to server
      await transactionService.delete(id)
      
      toast.success('Transaction deleted successfully')
      
    } catch (err) {
      // Rollback on error
      if (deletedTransaction && deletedIndex !== -1) {
        transactions.value.splice(deletedIndex, 0, deletedTransaction)
      }
      
      error.value = err.message
      toast.error('Failed to delete transaction')
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Calculate current stock for a compound using server data
   * @param {string} compoundId - Compound ID
   * @param {number} initialQuantity - Initial stock quantity from compound record
   * @returns {Promise<number>} Current calculated stock
   */
  const calculateCurrentStock = async (compoundId, initialQuantity = 0) => {
    try {
      // Get transactions for this compound only
      const compoundTransactions = await transactionService.getByCompound(compoundId)
      
      return await transactionService.calculateCurrentStock(
        compoundId, 
        initialQuantity, 
        compoundTransactions
      )
    } catch (err) {
      console.error('Failed to calculate stock:', err)
      // Fallback to initial quantity if calculation fails
      return initialQuantity
    }
  }

  /**
   * Get stock level status for a compound
   * @param {number} currentStock - Current stock quantity
   * @param {number} threshold - Low stock threshold
   * @returns {Object} Stock status information
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
   * Validate transaction data
   * @param {Object} transaction - Transaction to validate
   * @returns {Object} Validation result
   */
  const validateTransaction = (transaction) => {
    const errors = []
    
    if (!transaction.compoundId) {
      errors.push('Compound is required')
    }
    
    if (!transaction.type || !TRANSACTION_TYPES[transaction.type]) {
      errors.push('Valid transaction type is required')
    }
    
    if (!transaction.quantity || transaction.quantity <= 0) {
      errors.push('Quantity must be greater than 0')
    }
    
    // Additional validation for specific transaction types
    if (transaction.type === 'transfer' && !transaction.location) {
      errors.push('Destination location is required for transfers')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Reset transaction form to default state
   */
  const resetTransactionForm = () => {
    transactionForm.compoundId = ''
    transactionForm.type = 'use'
    transactionForm.quantity = ''
    transactionForm.notes = ''
    transactionForm.location = ''
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
    transactionForm,
    loading,
    error,
    
    // Actions
    initialize,
    loadTransactions,
    recordTransaction,
    updateTransaction,
    deleteTransaction,
    resetTransactionForm,
    
    // Utilities
    calculateCurrentStock,
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
