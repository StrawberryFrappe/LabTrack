<template>
  <div class="space-y-6">
    <!-- Enhanced Search Interface -->
    <div class="bg-white border border-slate-200 rounded-lg p-4">
      <!-- Search Mode Toggle -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-slate-900">{{ $t('compounds.filters') }}</h3>
        <button
          @click="toggleAdvancedMode"
          class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors"
          :class="isAdvancedMode 
            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
        >
          <span class="mr-2">{{ isAdvancedMode ? '⚙️' : '🔍' }}</span>
          {{ isAdvancedMode ? $t('search.switchToSimple') : $t('search.switchToAdvanced') }}
        </button>
      </div>

      <!-- Simple Mode: Basic filters (backward compatible) -->
      <div v-if="!isAdvancedMode" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Text Search -->
          <div class="relative">
            <Input
              v-model="searchQuery"
              :placeholder="$t('search.simplePlaceholder')"
              :label="$t('compounds.search')"
              class="pr-20"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pt-6">
              <button
                @click="isRegexMode = !isRegexMode"
                :title="$t('search.toggleRegex')"
                class="p-1 text-sm rounded transition-colors"
                :class="isRegexMode 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-400 hover:text-slate-600'"
              >
                .*
              </button>
            </div>
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

        <div v-if="isRegexMode" class="text-xs text-slate-500 bg-blue-50 p-2 rounded">
          {{ $t('search.regexHelp') }}
        </div>
      </div>

      <!-- Advanced Mode: Query Builder -->
      <div v-else>
        <SearchQueryBuilder />
      </div>

      <!-- Quick Actions -->
      <div v-if="!isAdvancedMode" class="flex items-center justify-between pt-4 border-t border-slate-200">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="quickFilter in quickFilters"
            :key="quickFilter.key"
            @click="applyQuickFilter(quickFilter)"
            class="inline-flex items-center px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <span class="mr-1">{{ quickFilter.icon }}</span>
            {{ $t(`search.quickFilters.${quickFilter.key}`) }}
          </button>
        </div>
        
        <div v-if="hasActiveSimpleFilters" class="flex items-center gap-2">
          <span class="text-sm text-slate-600">
            {{ activeFiltersCount }} {{ $t('compounds.filtersActive') }}
          </span>
          <button
            @click="clearSimpleFilters"
            class="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          >
            {{ $t('search.clear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Saved Searches Panel (collapsible) -->
    <div v-if="isAdvancedMode || savedSearches.length > 0" class="bg-white border border-slate-200 rounded-lg">
      <button
        @click="showSavedSearches = !showSavedSearches"
        class="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span class="font-medium text-slate-900">{{ $t('search.savedSearches') }}</span>
        <svg 
          class="w-5 h-5 text-slate-400 transition-transform"
          :class="{ 'rotate-180': showSavedSearches }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div v-if="showSavedSearches" class="border-t border-slate-200 p-4">
        <SavedSearches />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Enhanced Compound Filters Component
 * 
 * Provides both simple and advanced search capabilities with backward compatibility.
 * Integrates basic filtering with the advanced search query builder.
 * 
 * Features:
 * - Simple/Advanced search mode toggle
 * - Backward compatible basic filters
 * - Quick filter buttons for common searches
 * - Saved searches integration
 * - Automatic pagination reset on filter changes
 */
import { ref, computed, watch } from 'vue'
import Input from '@/components/ui/Input.vue'
import SearchQueryBuilder from './SearchQueryBuilder.vue'
import SavedSearches from './SavedSearches.vue'
import { useCompounds } from '@/composables/useCompounds'
import { useAdvancedSearch } from '@/composables/useAdvancedSearch'

// Get compound data and simple filter state
const {
  searchQuery,
  selectedHazardClass,
  selectedLocation,
  hazardClasses,
  locations,
  resetPagination
} = useCompounds()

// Get advanced search functionality
const {
  isAdvancedMode,
  isRegexMode,
  savedSearches,
  toggleAdvancedMode,
  loadSavedSearch
} = useAdvancedSearch()

// Local state
const showSavedSearches = ref(false)

// Quick filter definitions
const quickFilters = [
  {
    key: 'lowStock',
    icon: '📉',
    action: () => {
      // Switch to advanced mode and set up low stock filter
      if (!isAdvancedMode.value) {
        toggleAdvancedMode()
      }
      // Clear existing conditions and add low stock condition
      searchQuery.value = ''
      selectedHazardClass.value = ''
      selectedLocation.value = ''
    }
  },
  {
    key: 'expiringSoon',
    icon: '⏰',
    action: () => {
      // Switch to advanced mode for complex date filtering
      if (!isAdvancedMode.value) {
        toggleAdvancedMode()
      }
      // Clear simple filters
      searchQuery.value = ''
      selectedHazardClass.value = ''
      selectedLocation.value = ''
    }
  },
  {
    key: 'flammable',
    icon: '🔥',
    action: () => {
      searchQuery.value = ''
      selectedHazardClass.value = 'Flammable'
      selectedLocation.value = ''
    }
  },
  {
    key: 'corrosive',
    icon: '⚠️',
    action: () => {
      searchQuery.value = ''
      selectedHazardClass.value = 'Corrosive'
      selectedLocation.value = ''
    }
  }
]

// Computed properties
const hasActiveSimpleFilters = computed(() => {
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

const clearSimpleFilters = () => {
  searchQuery.value = ''
  selectedHazardClass.value = ''
  selectedLocation.value = ''
  isRegexMode.value = false
  
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

// Auto-open saved searches if there are any
if (savedSearches.value.length > 0) {
  showSavedSearches.value = true
}
</script>
