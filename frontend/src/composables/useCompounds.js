import { ref, computed } from 'vue'
import { compounds as mockCompounds } from '@/data/mockData'

export function useCompounds() {
  const compounds = ref(mockCompounds)
  const searchQuery = ref('')
  const selectedHazardClass = ref('')
  const selectedLocation = ref('')

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
      const expiryDate = new Date(item.expiryDate)
      return expiryDate <= threeMonthsFromNow
    })
  })

  const filteredCompounds = computed(() => {
    let filtered = compounds.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(compound =>
        compound.name.toLowerCase().includes(query) ||
        compound.casNumber.toLowerCase().includes(query) ||
        compound.synonyms.toLowerCase().includes(query) ||
        compound.supplier.toLowerCase().includes(query)
      )
    }

    if (selectedHazardClass.value) {
      filtered = filtered.filter(compound =>
        compound.hazardClass === selectedHazardClass.value
      )
    }

    if (selectedLocation.value) {
      filtered = filtered.filter(compound =>
        compound.location === selectedLocation.value
      )
    }

    return filtered
  })

  const findCompound = (identifier) => {
    return compounds.value.find(c => 
      c.id === identifier || 
      c.casNumber === identifier || 
      c.batchNumber === identifier ||
      c.name.toLowerCase().includes(identifier.toLowerCase())
    )
  }

  const updateCompoundQuantity = (compoundId, newQuantity) => {
    const compound = compounds.value.find(c => c.id === compoundId)
    if (compound) {
      compound.quantity = newQuantity
    }
  }

  return {
    compounds,
    searchQuery,
    selectedHazardClass,
    selectedLocation,
    hazardClasses,
    locations,
    lowStockItems,
    expiringItems,
    filteredCompounds,
    findCompound,
    updateCompoundQuantity
  }
}
