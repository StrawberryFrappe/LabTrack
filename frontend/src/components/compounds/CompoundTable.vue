<template>  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
    <!-- Table Header -->
    <div class="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-900">{{ $t('compounds.title') }}</h3>
        <div class="text-xs text-slate-500">
          {{ compounds.length }} compound{{ compounds.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </div>
    
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <!-- TODO: Add sorting functionality -->
              <button @click="sortBy('name')" class="hover:text-slate-700 transition-colors">
                {{ $t('compounds.tableHeaders.name') }}
                <!-- TODO: Add sort indicators -->
              </button>
            </th>            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
              {{ $t('compounds.tableHeaders.casNumber') }}
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              {{ $t('compounds.tableHeaders.supplier') }}
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <button @click="sortBy('quantity')" class="hover:text-slate-700 transition-colors">
                {{ $t('compounds.tableHeaders.quantity') }}
              </button>
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
              {{ $t('compounds.tableHeaders.location') }}
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
              {{ $t('compounds.tableHeaders.hazards') }}
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              {{ $t('compounds.tableHeaders.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr 
            v-for="compound in compounds" 
            :key="compound.id"
            class="hover:bg-slate-50 transition-colors cursor-pointer"
            @click="$emit('view-detail', compound)"
          >
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">              <div>
                <div class="text-sm font-medium text-slate-900">{{ compound.name }}</div>
                <div class="text-xs text-slate-500">{{ $t('compounds.labels.id') }}: {{ compound.id }}</div>
                <!-- Show CAS number on mobile when hidden -->
                <div class="text-xs text-slate-500 md:hidden mt-1">
                  {{ $t('compounds.labels.cas') }}: {{ compound.casNumber }}
                </div>
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-900 hidden md:table-cell">
              {{ compound.casNumber || $t('common.notAvailable') }}
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ compound.supplier }}
              </span>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-slate-900">
                {{ compound.quantity }} {{ compound.unit }}
              </div>
              <!-- TODO: Add visual quantity indicator (low stock warning) -->
              <div v-if="compound.minQuantity && compound.quantity <= compound.minQuantity" 
                   class="text-xs text-red-600 font-medium">
                {{ $t('compounds.lowStockWarning') }}
              </div>
              <!-- Show location on mobile when hidden -->
              <div class="text-xs text-slate-500 lg:hidden mt-1">
                📍 {{ compound.location }}
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-900 hidden lg:table-cell">
              {{ compound.location }}
            </td>            <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <div class="flex flex-wrap gap-1">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="getHazardClasses(compound.hazardClass)"
                >
                  {{ compound.hazardClass }}
                </span>
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-2" @click.stop>
                <button
                  @click="$emit('view-detail', compound)"
                  class="text-slate-600 hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-50"
                  :title="`View ${compound.name} details`"
                >
                  👁️
                </button>
                <button
                  @click="$emit('edit', compound)"
                  class="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                  :title="`Edit ${compound.name}`"
                >
                  ✏️
                </button>
                <button
                  @click="$emit('view-instances', compound)"
                  class="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
                  :title="`View ${compound.name} instances`"
                >
                  📱
                </button>
                <button
                  @click="$emit('delete', compound)"
                  class="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                  :title="`Delete ${compound.name}`"
                >
                  🗑️
                </button>
                <!-- TODO: Add more actions (duplicate, etc.) -->
                <button
                  class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-50"
                  :title="`More actions for ${compound.name}`"
                >
                  ⋮
                </button>
              </div>
                <!-- Show hazards on mobile when hidden -->
              <div class="sm:hidden mt-2">
                <div class="flex flex-wrap gap-1">
                  <span 
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                    :class="getHazardClasses(compound.hazardClass)"
                  >
                    {{ compound.hazardClass }}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Empty State -->
    <EmptyState
      v-if="compounds.length === 0"
      :title="$t('compounds.noCompoundsFound')"
      :description="$t('compounds.tryAdjustingFilters')"
      icon="📋"
      :show-actions="false"
    />
    
    <!-- TODO: Add pagination component here -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHazardStyles } from '@/composables/useHazardStyles.js'
import EmptyState from '@/components/ui/EmptyState.vue'

const { t } = useI18n()
const { getHazardClasses } = useHazardStyles()

// TODO: Import proper icon components when available
// import { PencilIcon, QrCodeIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  compounds: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'view-instances', 'delete', 'view-detail'])

// TODO: Implement sorting functionality
const sortBy = (column) => {
  // TODO: Emit sort event to parent component
  console.log('Sort by:', column)
}

// TODO: Implement row selection for bulk operations
const selectedRows = ref([])

const toggleRowSelection = (compoundId) => {
  // TODO: Toggle row selection
}

const selectAllRows = () => {
  // TODO: Select/deselect all rows
}
</script>
