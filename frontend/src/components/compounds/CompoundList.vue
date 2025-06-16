<template>
  <div class="space-y-6">    <!-- Toolbar with filters and actions -->
    <div class="space-y-4">
      <!-- Filters Section -->
      <CompoundFilters />      <!-- Actions Section -->
      <div class="flex items-center justify-between">
        <!-- Results summary and badges -->
        <div class="flex items-center gap-4">
          <div class="text-sm text-slate-600">
            Showing {{ filteredCompounds.length }} of {{ compounds.length }} compounds
          </div>
          
          <div class="flex gap-2">
            <Badge variant="warning" v-if="lowStockItems.length > 0">
              {{ lowStockItems.length }} Low Stock
            </Badge>
            <Badge variant="destructive" v-if="expiringItems.length > 0">
              {{ expiringItems.length }} Expiring Soon
            </Badge>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- View Toggle -->
          <div class="flex items-center bg-slate-100 rounded-lg p-1" role="group" aria-label="View mode toggle">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                viewMode === 'grid' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
              :aria-pressed="viewMode === 'grid'"
              title="Switch to grid view"
            >
              <!-- TODO: Use proper icon component -->
              <span class="inline-flex items-center gap-1">
                ⊞ <span class="hidden sm:inline">Cards</span>
              </span>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                viewMode === 'list' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
              :aria-pressed="viewMode === 'list'"
              title="Switch to list view"
            >
              <!-- TODO: Use proper icon component -->
              <span class="inline-flex items-center gap-1">
                ☰ <span class="hidden sm:inline">List</span>
              </span>
            </button>
          </div>
            <!-- Action buttons -->
          <!-- TODO: Add action buttons here -->
          <div class="flex gap-2">
            <!-- TODO: Add compound button -->
            <!-- TODO: Import compounds button -->
            <!-- TODO: Export compounds button -->
          </div>
        </div>
      </div>
    </div>    <!-- ✅ COMPLETED: Loading state with spinner and user feedback -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading compounds...</p>
      </div>
    </div>
    
    <!-- ✅ COMPLETED: Error state with retry functionality and user-friendly messaging -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="text-red-400 text-xl">⚠️</span>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading compounds</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          <button 
            @click="loadCompounds"
            class="mt-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
      <!-- Empty state -->
    <div v-else-if="filteredCompounds.length === 0 && !loading" class="text-center py-12">
      <div class="text-slate-400 text-lg mb-2">🔍</div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">No compounds found</h3>
      <p class="text-slate-500">Try adjusting your search filters.</p>
      <!-- TODO: Quick action to add first compound if none exist -->
    </div>
      <!-- Content based on view mode -->
    <div v-else-if="!loading && !error">
      <!-- Grid View (Cards) -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CompoundCard
          v-for="compound in filteredCompounds"
          :key="compound.id"
          :compound="compound"
          @edit="handleEdit"
          @scan="handleScan"
        />
      </div>
      
      <!-- List View (Table) -->
      <CompoundTable
        v-else-if="viewMode === 'list'"
        :compounds="filteredCompounds"
        @edit="handleEdit"
        @scan="handleScan"
      />
    </div>
    
    <!-- TODO: Add pagination for large datasets -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CompoundCard from './CompoundCard.vue'
import CompoundTable from './CompoundTable.vue'
import CompoundFilters from './CompoundFilters.vue'
import Badge from '@/components/ui/Badge.vue'
import { useCompounds } from '@/composables/useCompounds'

const { filteredCompounds, compounds, lowStockItems, expiringItems, loading, error, loadCompounds } = useCompounds()

// View mode state
const viewMode = ref('grid') // 'grid' or 'list'

// TODO: Persist view mode preference in localStorage
// TODO: Add view mode to URL query params for sharing

defineEmits(['edit-compound', 'scan-compound'])

const handleEdit = (compound) => {
  // TODO: Implement edit functionality
  // TODO: Open edit dialog/modal with compound form
  // TODO: Validate compound data before saving
  // TODO: Handle optimistic updates
  // TODO: Show success/error notifications
  console.log('Edit compound:', compound)
}

const handleScan = (compound) => {
  // TODO: Implement scan functionality
  // TODO: Add compound to current inventory count session
  // TODO: If no active session, prompt to create one
  // TODO: Navigate to scanning interface for this compound
  console.log('Scan compound:', compound)
}

// TODO: Implement bulk operations
const handleBulkEdit = (compoundIds) => {
  // TODO: Bulk edit selected compounds
}

const handleBulkDelete = (compoundIds) => {
  // TODO: Bulk delete selected compounds with confirmation
}

const handleBulkExport = (compoundIds) => {
  // TODO: Export selected compounds to CSV/Excel
}

// TODO: Implement compound addition
const handleAddCompound = () => {
  // TODO: Open add compound form/modal
}

// TODO: Implement import functionality
const handleImportCompounds = () => {
  // TODO: Show file upload dialog for importing compounds
}

// TODO: Implement keyboard shortcuts for view switching (e.g., Ctrl+1 for grid, Ctrl+2 for list)
</script>
