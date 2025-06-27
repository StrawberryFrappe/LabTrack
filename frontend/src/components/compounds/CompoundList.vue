<template>
  <div class="space-y-6">
    <!-- Toolbar with filters and actions -->
    <div class="space-y-4">
      <!-- Filters Section -->
      <CompoundFilters />
      <!-- Actions Section -->
      <div class="flex items-center justify-between">
        <!-- Results summary and badges -->
        <div class="flex items-center gap-4">
          <div class="text-sm text-slate-600">
            {{$t('compounds.showing')}} {{ paginatedCompounds.length }} {{$t('compounds.of')}} {{ filteredCompounds.length }} {{$t('compounds.compounds')}}
          </div>
          <div class="flex gap-2">
            <Badge variant="warning" v-if="lowStockItems.length > 0">
              {{ lowStockItems.length }} {{$t('compounds.lowStock')}}
            </Badge>
            <Badge variant="destructive" v-if="expiringItems.length > 0">
              {{ expiringItems.length }} {{$t('compounds.expiringSoon')}}
            </Badge>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <!-- View Toggle -->
          <div class="flex items-center bg-slate-100 rounded-lg p-1" role="group" :aria-label="$t('compounds.viewModeToggle')">
            <button
              @click="viewMode = 'grid'"
              :class="[ 'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200', viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' ]"
              :aria-pressed="viewMode === 'grid'"
              :title="$t('compounds.switchToGrid')"
            >
              <span class="inline-flex items-center gap-1">
                ⊞ <span class="hidden sm:inline">{{$t('compounds.cards')}}</span>
              </span>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[ 'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200', viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' ]"
              :aria-pressed="viewMode === 'list'"
              :title="$t('compounds.switchToList')"
            >
              <span class="inline-flex items-center gap-1">
                ☰ <span class="hidden sm:inline">{{$t('compounds.list')}}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Pagination Controls -->
    <PaginationControls
      v-if="filteredCompounds.length > pagination.pageSize"
      v-bind="pagination"
      @goToPage="pagination.goToPage"
      @nextPage="pagination.nextPage"
      @prevPage="pagination.prevPage"
      @firstPage="pagination.firstPage"
      @lastPage="pagination.lastPage"
      @setPageSize="pagination.setPageSize"
    />

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center space-x-3 text-slate-600">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span>{{$t('compounds.loading')}}</span>
      </div>
    </div>
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="text-red-400 text-xl">⚠️</span>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{$t('compounds.errorLoading')}}</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          <button 
            @click="loadCompounds"
            class="mt-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
          >
            {{$t('compounds.tryAgain')}}
          </button>
        </div>
      </div>
    </div>
    <!-- Empty state -->
    <EmptyState
      v-else-if="filteredCompounds.length === 0 && !loading"
      :title="$t('compounds.noCompoundsFound')"
      :description="$t('compounds.tryAdjustingFilters')"
      icon="🔍"
      :show-actions="false"
    />
    <!-- Content based on view mode -->
    <div v-else-if="!loading && !error">
      <!-- Grid View (Cards) -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CompoundCard
          v-for="compound in paginatedCompounds"
          :key="compound.id"
          :compound="compound"
          :show-instances-preview="true"
          @edit="handleEdit"
          @delete="handleDelete"
          @view-instances="handleViewInstances"
          @add-instance="handleAddInstance"
          @view-detail="handleViewDetail"
        />
      </div>
      <!-- List View (Table) -->
      <CompoundTable
        v-else-if="viewMode === 'list'"
        :compounds="paginatedCompounds"
        @edit="handleEdit"
        @delete="handleDelete"
        @view-instances="handleViewInstances"
        @add-instance="handleAddInstance"
        @view-detail="handleViewDetail"
      />
    </div>

    <!-- Bottom Pagination Controls -->
    <PaginationControls
      v-if="filteredCompounds.length > pagination.pageSize"
      v-bind="pagination"
      @goToPage="pagination.goToPage"
      @nextPage="pagination.nextPage"
      @prevPage="pagination.prevPage"
      @firstPage="pagination.firstPage"
      @lastPage="pagination.lastPage"
      @setPageSize="pagination.setPageSize"
    />
  </div>
</template>

<script setup>
/**
 * Compound List Component with Pagination
 * 
 * Main compound display component with grid/list views, integrated filtering,
 * and pagination support for handling large datasets efficiently.
 * 
 * ✅ IMPLEMENTED FEATURES:
 * - Grid and list view modes with user toggle
 * - Integrated filtering and search via CompoundFilters
 * - Pagination with configurable page sizes
 * - Real-time compound statistics (low stock, expiring)
 * - Event-driven CRUD operations (emits to parent)
 * - Loading and error states
 * - Responsive design with Tailwind CSS
 * - URL state management for pagination
 * 
 * 🔄 ARCHITECTURE:
 * - Uses usePagination composable for pagination state
 * - Integrates with useCompounds for data management
 * - Event-driven pattern for better separation of concerns
 * - Shared state pattern for consistent data across components
 */
import { ref } from 'vue'
import CompoundCard from './CompoundCard.vue'
import CompoundTable from './CompoundTable.vue'
import CompoundFilters from './CompoundFilters.vue'
import Badge from '@/components/ui/Badge.vue'
import PaginationControls from '@/components/ui/PaginationControls.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useCompounds } from '@/composables/useCompounds.js'
import { usePagination } from '@/composables/usePagination.js'
import { useAdvancedSearch } from '@/composables/useAdvancedSearch.js'

// Initialize pagination
const pagination = usePagination({
  defaultPageSize: 25,
  pageSizeOptions: [10, 25, 50, 100]
})

// Initialize advanced search
const advancedSearch = useAdvancedSearch()

// Initialize compounds with pagination and advanced search support
const { 
  filteredCompounds, 
  paginatedCompounds,
  compounds, 
  lowStockItems, 
  expiringItems, 
  loading, 
  error, 
  loadCompounds 
} = useCompounds(pagination, advancedSearch)

// View mode state
const viewMode = ref('grid') // 'grid' or 'list'

// Define events that this component can emit
const emit = defineEmits(['edit', 'delete', 'view-instances', 'add-instance', 'view-detail'])

const handleEdit = (compound) => {
  emit('edit', compound)
}

const handleDelete = (compound) => {
  emit('delete', compound)
}

const handleViewInstances = (compound) => {
  emit('view-instances', compound)
}

const handleAddInstance = (compound) => {
  emit('add-instance', compound)
}

const handleViewDetail = (compound) => {
  console.log('CompoundList handleViewDetail called with:', compound)
  emit('view-detail', compound)
}
</script>
