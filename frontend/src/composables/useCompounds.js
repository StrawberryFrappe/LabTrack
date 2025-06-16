/**
 * Compounds Composable
 * 
 * This composable manages all compound-related state and operations.
 * It provides reactive data and methods for compound management.
 * 
 * Key Features:
 * - Reactive compound data with real-time filtering
 * - Loading states and error handling
 * - Search and filter functionality
 * - CRUD operations ready for API integration
 * - Helper methods for common operations
 */

import { ref, computed, onMounted } from 'vue'
import { compoundService } from '../services/compoundService.js'

export function useCompounds() {
  // State management
  const compounds = ref([])
  const searchQuery = ref('')
  const selectedHazardClass = ref('')
  const selectedLocation = ref('')
  const loading = ref(false)
  const error = ref(null)
  /**
   * Load Compounds from API
   * 
   * Fetches all compounds from the backend.
   * Called automatically when composable is used.
   * 
   * INSIGHT: This is speculative - assumes standard REST API patterns
   * The choice to auto-load on mount may not be optimal for large datasets
   * but provides immediate data availability for the proof-of-concept phase
   */
  const loadCompounds = async () => {
    loading.value = true
    error.value = null
    
    try {
      compounds.value = await compoundService.getAll()
    } catch (err) {
      error.value = 'Failed to load compounds: ' + err.message
      console.error('Failed to load compounds:', err)
    } finally {
      loading.value = false
    }
  }

  // Computed properties for dynamic data
  const hazardClasses = computed(() => 
    [...new Set(compounds.value.map(c => c.hazardClass))]
  )

  const locations = computed(() => 
    [...new Set(compounds.value.map(c => c.location))]
  )

  const lowStockItems = computed(() =>
    compounds.value.filter(item => item.quantity < item.threshold)
  )

  const expiringItems = computed(() => {
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    
    return compounds.value.filter(item => {
      if (!item.expiryDate) return false
      const expiryDate = new Date(item.expiryDate)
      return expiryDate <= threeMonthsFromNow
    })
  })

  const filteredCompounds = computed(() => {
    let filtered = compounds.value

    // Text search across multiple fields
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(compound =>
        compound.name.toLowerCase().includes(query) ||
        (compound.casNumber && compound.casNumber.toLowerCase().includes(query)) ||
        (compound.synonyms && compound.synonyms.toLowerCase().includes(query)) ||
        compound.supplier.toLowerCase().includes(query)
      )
    }

    // Filter by hazard class
    if (selectedHazardClass.value) {
      filtered = filtered.filter(compound =>
        compound.hazardClass === selectedHazardClass.value
      )
    }

    // Filter by location
    if (selectedLocation.value) {
      filtered = filtered.filter(compound =>
        compound.location === selectedLocation.value
      )
    }    return filtered
  })

  /**
   * Find Compound by Various Identifiers
   * 
   * Helper method to find a compound by ID, CAS number, batch number, or name.
   * Useful for barcode scanning and search functionality.
   */
  const findCompound = (identifier) => {
    return compounds.value.find(c => 
      c.id === identifier || 
      c.casNumber === identifier || 
      c.batchNumber === identifier ||
      c.name.toLowerCase().includes(identifier.toLowerCase())
    )
  }

  /**
   * Update Compound Quantity
   * 
   * Updates the quantity of a compound (used during inventory counts).
   * For production, this would sync with the backend.
   */
  const updateCompoundQuantity = async (compoundId, newQuantity) => {
    try {
      // Find the compound locally
      const compound = compounds.value.find(c => c.id === compoundId)
      if (!compound) {
        throw new Error('Compound not found')
      }

      // Update locally for immediate UI feedback (optimistic update)
      // INSIGHT: This is speculative - assumes the API call will succeed
      // Optimistic updates provide better UX but require rollback logic for failures
      // The choice to update immediately trades consistency for perceived performance
      compound.quantity = newQuantity

      // TODO: In production, sync with backend
      // await compoundService.update(compoundId, { quantity: newQuantity })
      
      // TODO: Create audit trail entry
      // TODO: Send notification if quantity crosses threshold
    } catch (err) {
      error.value = 'Failed to update quantity: ' + err.message
      // Reload data to ensure consistency
      await loadCompounds()
    }
  }

  /**
   * Create New Compound
   * 
   * Adds a new compound to the system.
   */
  const createCompound = async (compoundData) => {
    loading.value = true
    error.value = null
    
    try {
      const newCompound = await compoundService.create(compoundData)
      // Add to local array for immediate UI update
      compounds.value.push(newCompound)
      return newCompound
    } catch (err) {
      error.value = 'Failed to create compound: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update Existing Compound
   * 
   * Updates compound data.
   */
  const updateCompound = async (compoundId, updates) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedCompound = await compoundService.update(compoundId, updates)
      
      // Update local array
      const index = compounds.value.findIndex(c => c.id === compoundId)
      if (index !== -1) {
        compounds.value[index] = updatedCompound
      }
      
      return updatedCompound
    } catch (err) {
      error.value = 'Failed to update compound: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete Compound
   * 
   * Removes a compound from the system.
   */
  const deleteCompound = async (compoundId) => {
    loading.value = true
    error.value = null
    
    try {
      await compoundService.delete(compoundId)
      
      // Remove from local array
      compounds.value = compounds.value.filter(c => c.id !== compoundId)
    } catch (err) {
      error.value = 'Failed to delete compound: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear Error Message
   * 
   * Helper to clear error messages (useful for dismissing error alerts).
   */
  const clearError = () => {
    error.value = null
  }

  // Auto-load compounds when composable is first used
  onMounted(() => {
    loadCompounds()
  })

  return {
    // State
    compounds,
    loading,
    error,
    
    // Search and filter state
    searchQuery,
    selectedHazardClass,
    selectedLocation,
    
    // Computed properties
    hazardClasses,
    locations,
    lowStockItems,
    expiringItems,
    filteredCompounds,
    
    // Methods
    loadCompounds,
    findCompound,
    updateCompoundQuantity,
    createCompound,
    updateCompound,
    deleteCompound,
    clearError
  }
}
