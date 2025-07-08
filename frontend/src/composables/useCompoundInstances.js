/**
 * Compound Instances Composable
 * 
 * This composable manages compound instance state and operations.
 * It works alongside useCompounds to provide instance-specific functionality.
 * 
 * Key Features:
 * - Instance CRUD operations
 * - Grouping instances by compound
 * - Stock calculations across instances
 * - Location-based filtering
 * - Expiry tracking per instance
 */

import { ref, computed } from 'vue'
import { instanceService } from '../services/instanceService.js'

// Shared state
const instances = ref([])
const loading = ref(false)
const error = ref(null)
let isInitialized = false

export function useCompoundInstances() {
  /**
   * Load All Instances
   * 
   * Fetches all compound instances from the API.
   */
  const loadInstances = async () => {
    loading.value = true
    error.value = null
    
    try {
      instances.value = await instanceService.getAll()
    } catch (err) {
      error.value = 'Failed to load instances: ' + err.message
      console.error('Failed to load instances:', err)
    } finally {
      loading.value = false
    }
  }

  // Initialize on first use
  if (!isInitialized) {
    isInitialized = true
    loadInstances()
  }

  /**
   * Get Instances for Compound
   * 
   * Returns all instances of a specific compound.
   */
  const getInstancesForCompound = (compoundId) => {
    return instances.value.filter(instance => 
      instance.compoundId === compoundId && instance.status === 'active'
    )
  }

  /**
   * Calculate Total Stock for Compound
   * 
   * Sums quantities across all active instances of a compound.
   */
  const getTotalStockForCompound = (compoundId) => {
    const compoundInstances = getInstancesForCompound(compoundId)
    return compoundInstances.reduce((total, instance) => 
      total + (instance.quantity || 0), 0
    )
  }

  /**
   * Get Instance Count for Compound
   * 
   * Returns the number of active instances for a compound.
   */
  const getInstanceCountForCompound = (compoundId) => {
    return getInstancesForCompound(compoundId).length
  }

  /**
   * Get Instances by Location
   * 
   * Returns all instances at a specific location.
   */
  const getInstancesByLocation = (location) => {
    return instances.value.filter(instance => 
      instance.location === location && instance.status === 'active'
    )
  }

  /**
   * Get All Locations
   * 
   * Returns unique locations from all instances.
   */
  const allLocations = computed(() => {
    const locations = instances.value
      .filter(instance => instance.status === 'active')
      .map(instance => instance.location)
      .filter(Boolean)
    return [...new Set(locations)]
  })


  /**
   * Create New Instance
   * 
   * Adds a new compound instance.
   */
  const createInstance = async (instanceData) => {
    loading.value = true
    error.value = null
    
    try {
      const newInstance = await instanceService.create(instanceData)
      instances.value.push(newInstance)
      return newInstance
    } catch (err) {
      error.value = 'Failed to create instance: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update Instance
   * 
   * Updates an existing instance.
   */
  const updateInstance = async (instanceId, updates) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedInstance = await instanceService.update(instanceId, updates)
      
      // Update local array
      const index = instances.value.findIndex(i => i.id === instanceId)
      if (index !== -1) {
        instances.value[index] = updatedInstance
      }
      
      return updatedInstance
    } catch (err) {
      error.value = 'Failed to update instance: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete Instance
   * 
   * Removes an instance from the system.
   */
  const deleteInstance = async (instanceId) => {
    loading.value = true
    error.value = null
    
    try {
      await instanceService.delete(instanceId)
      
      // Remove from local array
      instances.value = instances.value.filter(i => i.id !== instanceId)
    } catch (err) {
      error.value = 'Failed to delete instance: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update Instance Quantity
   * 
   * Updates the quantity of a specific instance.
   * Used during transactions.
   */
  const updateInstanceQuantity = async (instanceId, newQuantity) => {
    try {
      // Optimistic update
      const instance = instances.value.find(i => i.id === instanceId)
      if (instance) {
        instance.quantity = newQuantity
        
        // Mark as used up if quantity is zero
        if (newQuantity <= 0) {
          instance.status = 'used_up'
          instance.quantity = 0
        }
      }

      // Sync with backend
      await instanceService.updateQuantity(instanceId, newQuantity)
      
      // Mark as used up if needed
      if (newQuantity <= 0) {
        await instanceService.markAsUsedUp(instanceId)
      }
      
    } catch (err) {
      error.value = 'Failed to update instance quantity: ' + err.message
      // Reload data to ensure consistency
      await loadInstances()
      throw err
    }
  }

  /**
   * Find Instance by Batch Number
   * 
   * Helper method to find instance by batch number.
   */
  const findInstanceByBatch = (batchNumber) => {
    return instances.value.find(instance => 
      instance.batchNumber === batchNumber && instance.status === 'active'
    )
  }

  /**
   * Get Instance Summary for Compound
   * 
   * Returns summary data for all instances of a compound.
   */
  const getInstanceSummary = (compoundId) => {
    const compoundInstances = getInstancesForCompound(compoundId)
    
    return {
      totalInstances: compoundInstances.length,
      totalQuantity: getTotalStockForCompound(compoundId),
      locations: [...new Set(compoundInstances.map(i => i.location))],
      expiringSoon: compoundInstances.filter(i => {
        if (!i.expiryDate) return false
        const expiryDate = new Date(i.expiryDate)
        const threeMonthsFromNow = new Date()
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
        return expiryDate <= threeMonthsFromNow
      }).length
    }
  }

  /**
   * Clear Error
   * 
   * Helper to clear error messages.
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    instances,
    loading,
    error,
    
    // Computed
    allLocations,
    
    // Methods
    loadInstances,
    getInstancesForCompound,
    getTotalStockForCompound,
    getInstanceCountForCompound,
    getInstancesByLocation,
    createInstance,
    updateInstance,
    deleteInstance,
    updateInstanceQuantity,
    findInstanceByBatch,
    getInstanceSummary,
    clearError
  }
}
