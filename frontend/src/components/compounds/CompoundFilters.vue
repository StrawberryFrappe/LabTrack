<template>
  <div class="space-y-4">
    <!-- Search and Basic Filters -->
    <div class="bg-white border border-slate-200 rounded-lg p-4">
      <div class="mb-4">
        <h3 class="text-lg font-medium text-slate-900">{{ $t('compounds.filters') }}</h3>
      </div>

      <!-- Main Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Text Search -->
        <div>
          <Input
            v-model="searchQuery"
            :placeholder="$t('search.simplePlaceholder')"
            :label="$t('compounds.search')"
          />
        </div>
        
        <!-- Hazard Class Filter -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">{{ $t('compounds.hazardClass') }}</label>
          <select
            v-model="selectedHazardClass"
            class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          >
            <option value="">{{ $t('compounds.allHazardClasses') }}</option>
            <option v-for="hazardClass in hazardClasses" :key="hazardClass" :value="hazardClass">
              {{ hazardClass }}
            </option>
          </select>
        </div>
        
        <!-- Location Filter -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">{{ $t('compounds.location') }}</label>
          <select
            v-model="selectedLocation"
            class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          >
            <option value="">{{ $t('compounds.allLocations') }}</option>
            <option v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>
      </div>

      <!-- Quick Filters -->
      <div class="flex items-center justify-between pt-4 border-t border-slate-200">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="quickFilter in quickFilters"
            :key="quickFilter.key"
            @click="applyQuickFilter(quickFilter)"
            class="inline-flex items-center px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            :class="{ 'bg-blue-100 text-blue-700': isQuickFilterActive(quickFilter) }"
          >
            <span class="mr-1">{{ quickFilter.icon }}</span>
            {{ $t(`compounds.quickFilters.${quickFilter.key}`) }}
          </button>
        </div>
        
        <div v-if="hasActiveFilters" class="flex items-center gap-2">
          <span class="text-sm text-slate-600">
            {{ activeFiltersCount }} {{ $t('compounds.filtersActive') }}
          </span>
          <button
            @click="clearAllFilters"
            class="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          >
            {{ $t('compounds.clearFilters') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Simplified Compound Filters Component
 * 
 * Provides simple and intuitive filtering capabilities for compounds.
 * Focuses on the most commonly used filters for better usability.
 * 
 * Features:
 * - Text search across compound name, CAS number, and synonyms
 * - Hazard class filtering
 * - Location filtering  
 * - Quick filter buttons for common searches
 * - Clear all filters functionality
 */
import { computed, watch } from 'vue'
import Input from '@/components/ui/Input.vue'
import { useCompounds } from '@/composables/useCompounds'

// Get compound data and filter state
const {
  searchQuery,
  selectedHazardClass,
  selectedLocation,
  hazardClasses,
  locations,
  resetPagination,
  resetFilters
} = useCompounds()

// Quick filter definitions
const quickFilters = [
  {
    key: 'lowStock',
    icon: '📉',
    action: () => {
      clearAllFilters()
      // This will be handled by computed properties in the useCompounds composable
      // We can add a specific filter for low stock items if needed
    }
  },
  {
    key: 'expiringSoon', 
    icon: '⏰',
    action: () => {
      clearAllFilters()
      // This will be handled by computed properties in the useCompounds composable
      // We can add a specific filter for expiring items if needed
    }
  },
  {
    key: 'flammable',
    icon: '🔥',
    action: () => {
      clearAllFilters()
      selectedHazardClass.value = 'Flammable'
    }
  },
  {
    key: 'corrosive',
    icon: '⚠️', 
    action: () => {
      clearAllFilters()
      selectedHazardClass.value = 'Corrosive'
    }
  }
]

// Computed properties
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || 
         selectedHazardClass.value !== '' || 
         selectedLocation.value !== ''
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value.trim()) count++
  if (selectedHazardClass.value) count++
  if (selectedLocation.value) count++
  return count
})

// Methods
const applyQuickFilter = (filter) => {
  filter.action()
  if (resetPagination) {
    resetPagination()
  }
}

const isQuickFilterActive = (filter) => {
  if (filter.key === 'flammable') {
    return selectedHazardClass.value === 'Flammable'
  }
  if (filter.key === 'corrosive') {
    return selectedHazardClass.value === 'Corrosive'
  }
  // For low stock and expiring, we'd need additional logic
  // This is simplified for now
  return false
}

const clearAllFilters = () => {
  if (resetFilters) {
    resetFilters()
  }
  if (resetPagination) {
    resetPagination()
  }
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedHazardClass, selectedLocation], () => {
  if (resetPagination) {
    resetPagination()
  }
}, { deep: true })
</script>
