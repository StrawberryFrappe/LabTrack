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
            {{$t('compounds.showing')}} {{ filteredCompounds.length }} {{$t('compounds.of')}} {{ compounds.length }} {{$t('compounds.compounds')}}
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
          <!-- Action buttons -->
          <div class="flex gap-2">
            <!-- Note: Add button moved to parent view (CompoundsView) for better access control -->
          </div>
        </div>
      </div>
    </div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">{{$t('compounds.loading')}}</p>
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
    <div v-else-if="filteredCompounds.length === 0 && !loading" class="text-center py-12">
      <div class="text-slate-400 text-lg mb-2">🔍</div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">{{$t('compounds.noCompoundsFound')}}</h3>
      <p class="text-slate-500">{{$t('compounds.tryAdjustingFilters')}}</p>
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
          @delete="handleDelete"
        />
      </div>
      <!-- List View (Table) -->
      <CompoundTable
        v-else-if="viewMode === 'list'"
        :compounds="filteredCompounds"
        @edit="handleEdit"
        @scan="handleScan"
        @delete="handleDelete"
      />
    </div>
    <!-- TODO: Add pagination for large datasets -->
  </div>
</template>

/**
 * Compound List Component
 * 
 * Main compound display component with grid/list views and integrated filtering.
 * Refactored to use event-driven architecture for better separation of concerns.
 * 
 * ✅ CURRENT FEATURES:
 * - Grid and list view modes with user toggle
 * - Integrated filtering and search via CompoundFilters
 * - Real-time compound statistics (low stock, expiring)
 * - Event-driven CRUD operations (emits to parent)
 * - Loading and error states
 * - Responsive design with Tailwind CSS
 * 
 * 🔄 ARCHITECTURE CHANGE:
 * - Removed internal modal management (moved to CompoundsView)
 * - Uses emit pattern for edit/delete/scan operations
 * - Cleaner separation between display and business logic
 * - Better testability and reusability
 */
<script setup>
import { ref } from 'vue'
import CompoundCard from './CompoundCard.vue'
import CompoundTable from './CompoundTable.vue'
import CompoundFilters from './CompoundFilters.vue'
import Badge from '@/components/ui/Badge.vue'
import { useCompounds } from '@/composables/useCompounds'

const { 
  filteredCompounds, 
  compounds, 
  lowStockItems, 
  expiringItems, 
  loading, 
  error, 
  loadCompounds 
} = useCompounds()

// View mode state
const viewMode = ref('grid') // 'grid' or 'list'

// Define events that this component can emit
const emit = defineEmits(['edit', 'delete', 'scan'])

const handleEdit = (compound) => {
  emit('edit', compound)
}

const handleDelete = (compound) => {
  emit('delete', compound)
}

const handleScan = (compound) => {
  emit('scan', compound)
}
</script>
