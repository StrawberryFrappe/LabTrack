/**
 * Advanced Search Composable
 * 
 * Provides advanced search capabilities with query building, saved searches,
 * and complex filter evaluation for compound management.
 * 
 * Features:
 * - Query building with multiple criteria and operators
 * - Search persistence in localStorage
 * - Search history management (last 5 searches)
 * - Complex filter evaluation with AND/OR logic
 * - Date range and numeric range filtering
 * - Multi-select filtering options
 */

import { ref, computed, watch } from 'vue'

// Search operators with their evaluation functions
const OPERATORS = {
  contains: {
    label: 'Contains',
    evaluate: (value, criteria) => 
      value?.toString().toLowerCase().includes(criteria.toLowerCase()),
    types: ['text']
  },
  equals: {
    label: 'Equals',
    evaluate: (value, criteria) => 
      value?.toString().toLowerCase() === criteria.toLowerCase(),
    types: ['text', 'select']
  },
  startsWith: {
    label: 'Starts with',
    evaluate: (value, criteria) => 
      value?.toString().toLowerCase().startsWith(criteria.toLowerCase()),
    types: ['text']
  },
  endsWith: {
    label: 'Ends with',
    evaluate: (value, criteria) => 
      value?.toString().toLowerCase().endsWith(criteria.toLowerCase()),
    types: ['text']
  },
  greaterThan: {
    label: 'Greater than',
    evaluate: (value, criteria) => {
      const numValue = parseFloat(value)
      const numCriteria = parseFloat(criteria)
      return !isNaN(numValue) && !isNaN(numCriteria) && numValue > numCriteria
    },
    types: ['number', 'date']
  },
  lessThan: {
    label: 'Less than',
    evaluate: (value, criteria) => {
      const numValue = parseFloat(value)
      const numCriteria = parseFloat(criteria)
      return !isNaN(numValue) && !isNaN(numCriteria) && numValue < numCriteria
    },
    types: ['number', 'date']
  },
  between: {
    label: 'Between',
    evaluate: (value, criteria) => {
      const numValue = parseFloat(value)
      const [min, max] = criteria.split(',').map(v => parseFloat(v.trim()))
      return !isNaN(numValue) && !isNaN(min) && !isNaN(max) && 
             numValue >= min && numValue <= max
    },
    types: ['number', 'date']
  },
  isEmpty: {
    label: 'Is empty',
    evaluate: (value) => !value || value.toString().trim() === '',
    types: ['text', 'number', 'date']
  },
  isNotEmpty: {
    label: 'Is not empty',
    evaluate: (value) => value && value.toString().trim() !== '',
    types: ['text', 'number', 'date']
  }
}

// Available search fields with their metadata
const SEARCH_FIELDS = {
  name: {
    label: 'Compound Name',
    type: 'text',
    path: 'name'
  },
  casNumber: {
    label: 'CAS Number',
    type: 'text',
    path: 'casNumber'
  },
  synonyms: {
    label: 'Synonyms',
    type: 'text',
    path: 'synonyms'
  },
  supplier: {
    label: 'Supplier',
    type: 'text',
    path: 'supplier'
  },
  location: {
    label: 'Location',
    type: 'select',
    path: 'location'
  },
  hazardClass: {
    label: 'Hazard Class',
    type: 'select',
    path: 'hazardClass'
  },
  quantity: {
    label: 'Quantity',
    type: 'number',
    path: 'quantity'
  },
  threshold: {
    label: 'Threshold',
    type: 'number',
    path: 'threshold'
  },
  expiryDate: {
    label: 'Expiry Date',
    type: 'date',
    path: 'expiryDate'
  },
  receivedDate: {
    label: 'Received Date',
    type: 'date',
    path: 'receivedDate'
  },
  batchNumber: {
    label: 'Batch Number',
    type: 'text',
    path: 'batchNumber'
  }
}

export function useAdvancedSearch() {
  // State
  const isAdvancedMode = ref(false)
  const searchQuery = ref('')
  const searchConditions = ref([])
  const savedSearches = ref([])
  const searchHistory = ref([])
  const isRegexMode = ref(false)

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('labtrack-saved-searches')
      if (saved) {
        savedSearches.value = JSON.parse(saved)
      }
      
      const history = localStorage.getItem('labtrack-search-history')
      if (history) {
        searchHistory.value = JSON.parse(history)
      }
    } catch (error) {
      console.warn('Failed to load saved search data:', error)
    }
  }

  // Save data to localStorage
  const saveData = () => {
    try {
      localStorage.setItem('labtrack-saved-searches', JSON.stringify(savedSearches.value))
      localStorage.setItem('labtrack-search-history', JSON.stringify(searchHistory.value))
    } catch (error) {
      console.warn('Failed to save search data:', error)
    }
  }

  // Initialize default search condition
  const createDefaultCondition = () => ({
    id: Date.now() + Math.random(),
    field: 'name',
    operator: 'contains',
    value: '',
    logic: 'AND' // AND/OR for combining with next condition
  })

  // Add new search condition
  const addCondition = () => {
    searchConditions.value.push(createDefaultCondition())
  }

  // Remove search condition
  const removeCondition = (conditionId) => {
    searchConditions.value = searchConditions.value.filter(c => c.id !== conditionId)
  }

  // Clear all conditions
  const clearConditions = () => {
    searchConditions.value = []
    searchQuery.value = ''
  }

  // Get available operators for a field type
  const getOperatorsForField = (fieldKey) => {
    const field = SEARCH_FIELDS[fieldKey]
    if (!field) return []
    
    return Object.entries(OPERATORS)
      .filter(([key, op]) => op.types.includes(field.type))
      .map(([key, op]) => ({ key, label: op.label }))
  }

  // Evaluate a single condition against a compound
  const evaluateCondition = (condition, compound) => {
    const field = SEARCH_FIELDS[condition.field]
    const operator = OPERATORS[condition.operator]
    
    if (!field || !operator) return false
    
    const value = getNestedValue(compound, field.path)
    return operator.evaluate(value, condition.value)
  }

  // Get nested object value by path (e.g., 'location.name')
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // Evaluate all conditions with AND/OR logic
  const evaluateCompound = (compound) => {
    if (searchConditions.value.length === 0) return true
    
    let result = evaluateCondition(searchConditions.value[0], compound)
    
    for (let i = 1; i < searchConditions.value.length; i++) {
      const condition = searchConditions.value[i]
      const conditionResult = evaluateCondition(condition, compound)
      const previousCondition = searchConditions.value[i - 1]
      
      if (previousCondition.logic === 'OR') {
        result = result || conditionResult
      } else { // AND
        result = result && conditionResult
      }
    }
    
    return result
  }

  // Simple text search across all searchable fields
  const evaluateSimpleSearch = (compound) => {
    if (!searchQuery.value.trim()) return true
    
    const query = searchQuery.value.toLowerCase()
    const searchableFields = ['name', 'casNumber', 'synonyms', 'supplier', 'batchNumber']
    
    if (isRegexMode.value) {
      try {
        const regex = new RegExp(searchQuery.value, 'i')
        return searchableFields.some(fieldKey => {
          const field = SEARCH_FIELDS[fieldKey]
          const value = getNestedValue(compound, field.path)
          return value && regex.test(value.toString())
        })
      } catch (error) {
        // Invalid regex, fall back to simple search
        console.warn('Invalid regex pattern:', error)
        return false
      }
    }
    
    return searchableFields.some(fieldKey => {
      const field = SEARCH_FIELDS[fieldKey]
      const value = getNestedValue(compound, field.path)
      return value && value.toString().toLowerCase().includes(query)
    })
  }

  // Main filter function
  const filterCompounds = (compounds) => {
    return compounds.filter(compound => {
      if (isAdvancedMode.value) {
        return evaluateCompound(compound)
      } else {
        return evaluateSimpleSearch(compound)
      }
    })
  }

  // Save current search
  const saveCurrentSearch = (name) => {
    if (!name.trim()) return false
    
    const searchData = {
      id: Date.now(),
      name: name.trim(),
      isAdvanced: isAdvancedMode.value,
      query: searchQuery.value,
      conditions: [...searchConditions.value],
      createdAt: new Date().toISOString()
    }
    
    // Remove existing search with same name
    savedSearches.value = savedSearches.value.filter(s => s.name !== name.trim())
    savedSearches.value.unshift(searchData)
    
    // Keep only last 20 saved searches
    if (savedSearches.value.length > 20) {
      savedSearches.value = savedSearches.value.slice(0, 20)
    }
    
    saveData()
    return true
  }

  // Load saved search
  const loadSavedSearch = (searchData) => {
    isAdvancedMode.value = searchData.isAdvanced
    searchQuery.value = searchData.query || ''
    searchConditions.value = searchData.conditions ? [...searchData.conditions] : []
    
    // Add to history
    addToHistory(searchData)
  }

  // Delete saved search
  const deleteSavedSearch = (searchId) => {
    savedSearches.value = savedSearches.value.filter(s => s.id !== searchId)
    saveData()
  }

  // Add search to history
  const addToHistory = (searchData) => {
    const historyItem = {
      ...searchData,
      accessedAt: new Date().toISOString()
    }
    
    // Remove if already in history
    searchHistory.value = searchHistory.value.filter(h => h.id !== searchData.id)
    searchHistory.value.unshift(historyItem)
    
    // Keep only last 5 in history
    if (searchHistory.value.length > 5) {
      searchHistory.value = searchHistory.value.slice(0, 5)
    }
    
    saveData()
  }

  // Toggle between simple and advanced mode
  const toggleAdvancedMode = () => {
    isAdvancedMode.value = !isAdvancedMode.value
    
    if (isAdvancedMode.value && searchConditions.value.length === 0) {
      addCondition()
    }
  }

  // Computed properties
  const hasActiveSearch = computed(() => {
    return searchQuery.value.trim() !== '' || 
           (isAdvancedMode.value && searchConditions.value.length > 0)
  })

  const searchSummary = computed(() => {
    if (!isAdvancedMode.value) {
      return searchQuery.value.trim() ? `Text search: "${searchQuery.value}"` : ''
    }
    
    const validConditions = searchConditions.value.filter(c => c.value.trim() !== '')
    if (validConditions.length === 0) return ''
    
    return `${validConditions.length} advanced filter${validConditions.length > 1 ? 's' : ''} active`
  })

  // Initialize
  loadSavedData()

  // Watch for changes to auto-save
  watch([savedSearches, searchHistory], saveData, { deep: true })

  return {
    // State
    isAdvancedMode,
    searchQuery,
    searchConditions,
    savedSearches,
    searchHistory,
    isRegexMode,
    
    // Constants
    SEARCH_FIELDS,
    OPERATORS,
    
    // Computed
    hasActiveSearch,
    searchSummary,
    
    // Methods
    addCondition,
    removeCondition,
    clearConditions,
    getOperatorsForField,
    filterCompounds,
    saveCurrentSearch,
    loadSavedSearch,
    deleteSavedSearch,
    toggleAdvancedMode,
    createDefaultCondition
  }
}
