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
      v-if="showDropdown && (filteredInstances.length > 0 || loading)"
      class="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-80 overflow-auto"
    >
      <!-- Loading State -->
      <div v-if="loading" class="p-3 text-center">
        <LoadingSpinner size="sm" />
        <span class="ml-2 text-sm text-slate-600">{{ $t('common.loading') }}</span>
      </div>

      <!-- No Results -->
      <div 
        v-else-if="searchQuery && filteredInstances.length === 0"
        class="p-3 text-sm text-slate-500 text-center"
      >
        {{ $t('inventorySessions.quickTransaction.noInstances') }}
      </div>

      <!-- Instance Results grouped by compound -->
      <div v-else class="py-1">
        <div 
          v-for="group in groupedInstances" 
          :key="group.compoundId"
          class="border-b border-slate-100 last:border-b-0"
        >
          <!-- Compound Header -->
          <div class="px-3 py-2 bg-slate-50 text-xs font-medium text-slate-700 uppercase tracking-wide">
            {{ group.compoundName }}
          </div>
          
          <!-- Instance Options -->
          <button
            v-for="instance in group.instances"
            :key="instance.id"
            type="button"
            class="w-full px-3 py-3 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none border-l-4 border-transparent hover:border-blue-300"
            @click="selectInstance(instance)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="font-medium text-slate-900 truncate">
                  {{ instance.batchNumber || $t('compounds.labels.noBatch') }}
                </div>
                <div class="text-sm text-slate-500 truncate">
                  {{ instance.location }}
                </div>
                <div v-if="instance.expiryDate" class="text-xs text-slate-400">
                  {{ $t('instances.labels.expiryDate') }}: {{ formatDate(instance.expiryDate) }}
                </div>
              </div>
              
              <div class="ml-3 flex items-center gap-2">
                <!-- Quantity Display -->
                <div class="text-right">
                  <div class="text-sm font-medium text-slate-900">
                    {{ instance.quantity }} {{ instance.unit || instance.compound?.unit }}
                  </div>
                  <div v-if="instance.status !== 'active'" class="text-xs text-amber-600">
                    {{ $t(`instances.status.${instance.status}`) }}
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Instance Display -->
    <div 
      v-if="selectedInstance && !showDropdown" 
      class="mt-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg shadow-sm"
    >
      <!-- Header with compound name and close button -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h4 class="font-semibold text-slate-900 text-lg leading-tight">
            {{ selectedInstance.compound?.name }}
          </h4>
          <p class="text-sm text-slate-600 mt-1">
            {{ selectedInstance.compound?.casNumber || $t('common.notAvailable') }}
          </p>
        </div>
        
        <button
          type="button"
          class="ml-3 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          @click="clearSelection"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Instance details grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <!-- Batch Information -->
        <div class="col-span-1">
          <div class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            {{ $t('instances.labels.batch') }}
          </div>
          <div class="font-medium text-slate-900">
            {{ selectedInstance.batchNumber || $t('compounds.labels.noBatch') }}
          </div>
        </div>

        <!-- Quantity -->
        <div class="col-span-1">
          <div class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            {{ $t('instances.labels.quantity') }}
          </div>
          <div class="font-medium text-slate-900">
            {{ selectedInstance.quantity }} <span class="text-slate-600">{{ selectedInstance.unit || selectedInstance.compound?.unit }}</span>
          </div>
        </div>

        <!-- Location -->
        <div class="col-span-1">
          <div class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            {{ $t('instances.labels.location') }}
          </div>
          <div class="font-medium text-slate-900 truncate" :title="selectedInstance.location">
            {{ selectedInstance.location || $t('common.notAvailable') }}
          </div>
        </div>

        <!-- Expiry Date -->
        <div class="col-span-1">
          <div class="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            {{ $t('instances.labels.expires') }}
          </div>
          <div class="font-medium" :class="getExpiryClass(selectedInstance.expiryDate)">
            {{ selectedInstance.expiryDate ? formatDate(selectedInstance.expiryDate) : $t('common.notAvailable') }}
          </div>
        </div>
      </div>

      <!-- Status and additional info -->
      <div v-if="selectedInstance.status !== 'active' || selectedInstance.supplier" 
           class="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
        <div v-if="selectedInstance.status !== 'active'" class="flex items-center">
          <span class="text-xs font-medium text-slate-500 uppercase tracking-wide mr-2">
            {{ $t('instances.labels.status') }}:
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            {{ $t(`instances.status.${selectedInstance.status}`) }}
          </span>
        </div>
        
        <div v-if="selectedInstance.supplier" class="text-xs text-slate-500">
          {{ $t('compounds.labels.supplier') }}: {{ selectedInstance.supplier }}
        </div>
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
import { useCompoundInstances } from '@/composables/useCompoundInstances.js'
import { useCompounds } from '@/composables/useCompounds.js'
import { useFormat } from '@/utils/format.js'

// Components
import Input from '@/components/ui/Input.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import StockLevelIndicator from '@/components/inventory/StockLevelIndicator.vue'

// Icons
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const { formatDate } = useFormat()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search instances...'
  },
  minSearchLength: {
    type: Number,
    default: 2
  },
  includeInactive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'instance-selected'])

// Composables
const { instances, loading: instancesLoading, loadInstances } = useCompoundInstances()
const { compounds, loading: compoundsLoading, loadCompounds } = useCompounds()

// Local state
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedInstance = ref(null)

// Reset method to be called by parent
const reset = () => {
  console.log('InstanceSelector reset called')
  searchQuery.value = ''
  selectedInstance.value = null
  showDropdown.value = false
  emit('update:modelValue', '')
  emit('instance-selected', null)
  console.log('InstanceSelector reset completed')
}

// Expose reset method to parent
defineExpose({
  reset
})

// Computed properties
const loading = computed(() => instancesLoading.value || compoundsLoading.value)

const availableInstances = computed(() => {
  return instances.value.filter(instance => {
    if (!props.includeInactive && instance.status !== 'active') return false
    if (instance.quantity <= 0) return false
    return true
  }).map(instance => {
    // Enrich instance with compound data
    const compound = compounds.value.find(c => c.id === instance.compoundId)
    return {
      ...instance,
      compound
    }
  })
})

const filteredInstances = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < props.minSearchLength) {
    return availableInstances.value.slice(0, 20) // Show first 20 instances when no search
  }

  const query = searchQuery.value.toLowerCase()
  
  return availableInstances.value.filter(instance => {
    const compound = instance.compound || {}
    return (
      (compound.name || '').toLowerCase().includes(query) ||
      (compound.casNumber || '').toLowerCase().includes(query) ||
      (instance.batchNumber || '').toLowerCase().includes(query) ||
      (instance.location || '').toLowerCase().includes(query) ||
      (compound.supplier || '').toLowerCase().includes(query)
    )
  }).slice(0, 30) // Limit results to prevent performance issues
})

const groupedInstances = computed(() => {
  const groups = new Map()
  
  filteredInstances.value.forEach(instance => {
    const compoundId = instance.compoundId
    const compoundName = instance.compound?.name || 'Unknown Compound'
    
    if (!groups.has(compoundId)) {
      groups.set(compoundId, {
        compoundId,
        compoundName,
        instances: []
      })
    }
    
    groups.get(compoundId).instances.push(instance)
  })
  
  // Sort instances within each group by quantity (highest first) and expiry (soonest first)
  groups.forEach(group => {
    group.instances.sort((a, b) => {
      // First sort by expiry date (if available)
      if (a.expiryDate && b.expiryDate) {
        const dateA = new Date(a.expiryDate)
        const dateB = new Date(b.expiryDate)
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB // Soonest expiry first
        }
      }
      
      // Then by quantity (highest first)
      return b.quantity - a.quantity
    })
  })
  
  return Array.from(groups.values()).sort((a, b) => 
    a.compoundName.localeCompare(b.compoundName)
  )
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.length >= props.minSearchLength) {
    showDropdown.value = true
  }
}

const selectInstance = (instance) => {
  selectedInstance.value = instance
  searchQuery.value = `${instance.compound?.name} - ${instance.batchNumber || t('compounds.labels.noBatch')}`
  showDropdown.value = false
  
  emit('update:modelValue', instance.id)
  emit('instance-selected', instance)
}

const clearSelection = () => {
  console.log('InstanceSelector clearSelection called')
  selectedInstance.value = null
  searchQuery.value = ''
  showDropdown.value = false
  
  emit('update:modelValue', '')
  emit('instance-selected', null)
  console.log('InstanceSelector clearSelection completed')
}

const getExpiryClass = (expiryDate) => {
  if (!expiryDate) return 'text-slate-900'
  
  const expiry = new Date(expiryDate)
  const now = new Date()
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
  const oneMonthFromNow = new Date()
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)
  
  if (expiry <= now) {
    return 'text-red-600 font-semibold' // Expired
  } else if (expiry <= oneMonthFromNow) {
    return 'text-red-500 font-medium' // Expires within 1 month
  } else if (expiry <= threeMonthsFromNow) {
    return 'text-amber-600 font-medium' // Expires within 3 months
  } else {
    return 'text-slate-900' // Good expiry date
  }
}

// Watch for external model value changes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    clearSelection()
  } else if (newValue !== selectedInstance.value?.id) {
    // Find instance by ID if modelValue was set externally
    const instance = availableInstances.value.find(i => i.id === newValue)
    if (instance) {
      selectedInstance.value = instance
      searchQuery.value = `${instance.compound?.name} - ${instance.batchNumber || t('compounds.labels.noBatch')}`
    }
  }
})

// Load data when component mounts
onMounted(() => {
  if (instances.value.length === 0) {
    loadInstances()
  }
  if (compounds.value.length === 0) {
    loadCompounds()
  }
})
</script>
