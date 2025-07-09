<template>
  <div class="space-y-4">
    <!-- Saved Searches -->
    <div v-if="savedSearches.length > 0">
      <h4 class="text-sm font-medium text-slate-900 mb-2">{{ $t('search.savedSearches') }}</h4>
      <div class="space-y-2">
        <div
          v-for="search in savedSearches"
          :key="search.id"
          class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div class="flex-1 min-w-0">
            <button
              @click="loadSearch(search)"
              class="text-left w-full group"
            >
              <div class="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                {{ search.name }}
              </div>
              <div class="text-xs text-slate-500 mt-1">
                {{ formatSearchDescription(search) }}
              </div>
              <div class="text-xs text-slate-400 mt-1">
                {{ $t('search.created') }}: {{ formatDate(search.createdAt) }}
              </div>
            </button>
          </div>
          
          <div class="flex items-center gap-2 ml-3">
            <button
              @click="loadSearch(search)"
              :title="$t('search.loadSearch')"
              class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <button
              @click="deleteSearch(search.id)"
              :title="$t('search.deleteSearch')"
              class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Searches -->
    <div v-if="searchHistory.length > 0">
      <h4 class="text-sm font-medium text-slate-900 mb-2">{{ $t('search.recentSearches') }}</h4>
      <div class="space-y-2">
        <div
          v-for="search in searchHistory"
          :key="search.id + '-history'"
          class="flex items-center justify-between p-2 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
        >
          <button
            @click="loadSearch(search)"
            class="flex-1 text-left"
          >
            <div class="text-sm text-slate-700">{{ search.name }}</div>
            <div class="text-xs text-slate-500">
              {{ $t('search.lastUsed') }}: {{ formatDate(search.accessedAt) }}
            </div>
          </button>
          <button
            @click="loadSearch(search)"
            :title="$t('search.loadSearch')"
            class="p-1 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="savedSearches.length === 0 && searchHistory.length === 0" class="text-center py-8">
      <div class="text-slate-400 text-4xl mb-2">🔍</div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">{{ $t('search.noSavedSearches') }}</h3>
      <p class="text-slate-500">{{ $t('search.noSavedSearchesDescription') }}</p>
    </div>

    <!-- Quick Search Templates -->
    <div class="border-t border-slate-200 pt-4">
      <h4 class="text-sm font-medium text-slate-900 mb-2">{{ $t('search.quickFilters') }}</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="template in quickSearchTemplates"
          :key="template.name"
          @click="loadQuickSearch(template)"
          class="inline-flex items-center px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <span class="mr-1">{{ template.icon }}</span>
          {{ $t(`search.quickFilters.${template.key}`, template.name) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Saved Searches Component
 * 
 * Manages saved searches, recent searches, and quick filter templates.
 * Provides easy access to previously created search queries.
 * 
 * Features:
 * - Load/delete saved searches
 * - Recent searches history (last 5)
 * - Quick search templates for common filters
 * - Search metadata display
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAdvancedSearch } from '@/composables/useAdvancedSearch'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()

const {
  savedSearches,
  searchHistory,
  loadSavedSearch,
  deleteSavedSearch,
  SEARCH_FIELDS
} = useAdvancedSearch()

const { showToast } = useToast()

// Quick search templates for common scenarios
const quickSearchTemplates = [
  {
    key: 'lowStock',
    name: t('search.quickFilters.lowStock'),
    icon: '📉',
    isAdvanced: true,
    conditions: [{
      id: Date.now(),
      field: 'quantity',
      operator: 'lessThan',
      value: '100',
      logic: 'AND'
    }]
  },
  {
    key: 'expiringSoon',
    name: t('search.quickFilters.expiringSoon'),
    icon: '⏰',
    isAdvanced: true,
    conditions: [{
      id: Date.now(),
      field: 'expiryDate',
      operator: 'between',
      value: getDateRange(0, 90), // Next 90 days
      logic: 'AND'
    }]
  },
  {
    key: 'flammable',
    name: t('search.quickFilters.flammable'),
    icon: '🔥',
    isAdvanced: true,
    conditions: [{
      id: Date.now(),
      field: 'hazardClass',
      operator: 'equals',
      value: 'Flammable',
      logic: 'AND'
    }]
  },
  {
    key: 'corrosive',
    name: t('search.quickFilters.corrosive'),
    icon: '⚠️',
    isAdvanced: true,
    conditions: [{
      id: Date.now(),
      field: 'hazardClass',
      operator: 'equals',
      value: 'Corrosive',
      logic: 'AND'
    }]
  },
  {
    key: 'recentlyReceived',
    name: t('search.quickFilters.recentlyReceived'),
    icon: '📦',
    isAdvanced: true,
    conditions: [{
      id: Date.now(),
      field: 'receivedDate',
      operator: 'greaterThan',
      value: getDateDaysAgo(30), // Last 30 days
      logic: 'AND'
    }]
  }
]

// Helper functions
function getDateRange(startDays, endDays) {
  const start = new Date()
  start.setDate(start.getDate() + startDays)
  
  const end = new Date()
  end.setDate(end.getDate() + endDays)
  
  return `${start.toISOString().split('T')[0]},${end.toISOString().split('T')[0]}`
}

function getDateDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

// Load a search
const loadSearch = (search) => {
  loadSavedSearch(search)
  showToast({
    type: 'success',
    message: `Loaded search: "${search.name}"`
  })
}

// Delete a search with confirmation
const deleteSearch = (searchId) => {
  if (confirm(t('search.deleteConfirm'))) {
    deleteSavedSearch(searchId)
    showToast({
      type: 'success',
      message: t('search.deleteSuccess')
    })
  }
}

// Load quick search template
const loadQuickSearch = (template) => {
  const searchData = {
    id: Date.now(),
    name: template.name,
    isAdvanced: template.isAdvanced,
    query: template.query || '',
    conditions: template.conditions || []
  }
  
  loadSavedSearch(searchData)
  showToast({
    type: 'success',
    message: `Applied quick filter: "${template.name}"`
  })
}

// Format search description
const formatSearchDescription = (search) => {
  if (!search.isAdvanced) {
    return search.query ? `Text search: "${search.query}"` : 'Simple search'
  }
  
  const conditionCount = search.conditions?.length || 0
  return `${conditionCount} condition${conditionCount !== 1 ? 's' : ''}`
}

// Format date for display
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  } catch {
    return 'Unknown'
  }
}
</script>
