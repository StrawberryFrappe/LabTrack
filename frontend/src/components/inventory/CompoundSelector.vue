<template>
  <div class="relative">
    <!-- Search Input -->
    <div class="relative">
      <Input
        v-model="searchQuery"
        :placeholder="placeholder"
        class="pr-10"
        @focus="showDropdown = true"
        @input="handleSearch"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <MagnifyingGlassIcon class="h-4 w-4 text-slate-400" />
      </div>
    </div>

    <!-- Dropdown Results -->
    <div
      v-if="showDropdown && (filteredCompounds.length > 0 || loading)"
      class="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <!-- Loading State -->
      <div v-if="loading" class="p-3 text-center">
        <LoadingSpinner size="sm" />
        <span class="ml-2 text-sm text-slate-600">{{ $t('common.loading') }}</span>
      </div>

      <!-- No Results -->
      <div 
        v-else-if="searchQuery && filteredCompounds.length === 0"
        class="p-3 text-sm text-slate-500 text-center"
      >
        {{ $t('inventorySessions.quickTransaction.noCompounds') }}
      </div>

      <!-- Compound Results -->
      <div v-else class="py-1">
        <button
          v-for="compound in filteredCompounds"
          :key="compound.id"
          type="button"
          class="w-full px-3 py-2 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
          @click="selectCompound(compound)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="font-medium text-slate-900 truncate">
                {{ compound.name }}
              </div>
              <div class="text-sm text-slate-500 truncate">
                {{ compound.casNumber }} • {{ compound.location }}
              </div>
            </div>
            
            <div class="ml-3 flex items-center gap-2">
              <!-- Stock Level Indicator -->
              <StockLevelIndicator 
                :current="compound.quantity"
                :threshold="compound.threshold"
                :unit="compound.unit"
                size="xs"
              />
              
              <!-- Batch Info -->
              <span class="text-xs text-slate-400 font-mono">
                {{ compound.batchNumber }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Selected Compound Display (Alternative to dropdown when compound is selected) -->
    <div 
      v-if="selectedCompound && !showDropdown" 
      class="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <div class="font-medium text-slate-900">{{ selectedCompound.name }}</div>
          <div class="text-sm text-slate-500">
            {{ selectedCompound.casNumber }} • {{ selectedCompound.location }}
          </div>
        </div>
        
        <button
          type="button"
          class="ml-2 p-1 text-slate-400 hover:text-slate-600"
          @click="clearSelection"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Click outside handler -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="showDropdown = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompounds } from '@/composables/useCompounds.js'

// Components
import Input from '@/components/ui/Input.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import StockLevelIndicator from '@/components/inventory/StockLevelIndicator.vue'

// Icons
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search compounds...'
  },
  minSearchLength: {
    type: Number,
    default: 2
  }
})

const emit = defineEmits(['update:modelValue', 'compound-selected'])

// Composables
const { compounds, loading, loadCompounds } = useCompounds()

// Local state
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedCompound = ref(null)

// Computed properties
const filteredCompounds = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < props.minSearchLength) {
    return compounds.value.slice(0, 10) // Show first 10 compounds when no search
  }

  const query = searchQuery.value.toLowerCase()
  
  return compounds.value.filter(compound => {
    return (
      compound.name.toLowerCase().includes(query) ||
      compound.casNumber.toLowerCase().includes(query) ||
      compound.batchNumber.toLowerCase().includes(query) ||
      compound.location.toLowerCase().includes(query) ||
      compound.supplier.toLowerCase().includes(query)
    )
  }).slice(0, 20) // Limit results to prevent performance issues
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.length >= props.minSearchLength) {
    showDropdown.value = true
  }
}

const selectCompound = (compound) => {
  selectedCompound.value = compound
  searchQuery.value = compound.name
  showDropdown.value = false
  
  emit('update:modelValue', compound.id)
  emit('compound-selected', compound)
}

const clearSelection = () => {
  selectedCompound.value = null
  searchQuery.value = ''
  
  emit('update:modelValue', '')
  emit('compound-selected', null)
}

// Watch for external model value changes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    clearSelection()
  } else if (newValue !== selectedCompound.value?.id) {
    // Find compound by ID if modelValue was set externally
    const compound = compounds.value.find(c => c.id === newValue)
    if (compound) {
      selectedCompound.value = compound
      searchQuery.value = compound.name
    }
  }
})

// Load compounds when component mounts
onMounted(() => {
  if (compounds.value.length === 0) {
    loadCompounds()
  }
})
</script>
