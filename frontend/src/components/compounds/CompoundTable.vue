<template>  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
    <!-- Table Header -->
    <div class="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-900">Compounds List</h3>
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
                Name
                <!-- TODO: Add sort indicators -->
              </button>
            </th>            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
              CAS Number
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Supplier
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <button @click="sortBy('quantity')" class="hover:text-slate-700 transition-colors">
                Quantity
              </button>
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
              Location
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
              Hazards
            </th>
            <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr 
            v-for="compound in compounds" 
            :key="compound.id"
            class="hover:bg-slate-50 transition-colors"
          >
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">              <div>
                <div class="text-sm font-medium text-slate-900">{{ compound.name }}</div>
                <div class="text-xs text-slate-500">ID: {{ compound.id }}</div>
                <!-- Show CAS number on mobile when hidden -->
                <div class="text-xs text-slate-500 md:hidden mt-1">
                  CAS: {{ compound.casNumber }}
                </div>
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-900 hidden md:table-cell">
              {{ compound.casNumber || 'N/A' }}
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
                ⚠️ Low stock!
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
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('edit', compound)"
                  class="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                  :title="`Edit ${compound.name}`"
                >
                  <!-- TODO: Use proper icon component -->
                  ✏️
                </button>
                <button
                  @click="$emit('scan', compound)"
                  class="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
                  :title="`Scan ${compound.name} for inventory`"
                >
                  <!-- TODO: Use proper icon component -->
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
    
    <!-- TODO: Add pagination component here -->
    <div v-if="compounds.length === 0" class="px-4 sm:px-6 py-12 text-center">
      <div class="text-slate-400 text-lg mb-2">📋</div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">No compounds to display</h3>
      <p class="text-slate-500">Start by adding your first compound.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// TODO: Import proper icon components when available
// import { PencilIcon, QrCodeIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  compounds: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'scan', 'delete'])

// TODO: Move this to a shared utility or composable
const getHazardClasses = (hazard) => {
  const hazardStyles = {
    'Non-hazardous': 'bg-green-100 text-green-800',
    'Flammable': 'bg-red-100 text-red-800',
    'Toxic': 'bg-purple-100 text-purple-800',
    'Toxic, Flammable': 'bg-red-200 text-red-900',
    'Corrosive': 'bg-orange-100 text-orange-800',
    'Oxidizing': 'bg-yellow-100 text-yellow-800',
    'Explosive': 'bg-red-200 text-red-900',
    'Carcinogenic': 'bg-pink-100 text-pink-800',
    'Carcinogenic, Flammable': 'bg-pink-200 text-pink-900',
    default: 'bg-slate-100 text-slate-800'
  }
  
  return hazardStyles[hazard] || hazardStyles.default
}

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
