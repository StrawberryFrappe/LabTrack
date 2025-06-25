<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Compound Selector -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        {{ $t('inventorySessions.quickTransaction.selectCompound') }}
      </label>
      <CompoundSelector
        v-model="form.compoundId"
        :placeholder="$t('inventorySessions.quickTransaction.compoundPlaceholder')"
        @compound-selected="handleCompoundSelected"
      />
      <ValidationMessages 
        v-if="errors.compoundId" 
        :errors="[errors.compoundId]" 
      />
    </div>

    <!-- Selected Compound Display -->
    <div v-if="selectedCompound" class="bg-slate-50 rounded-lg p-3">
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-slate-900">{{ selectedCompound.name }}</h4>
        <StockLevelIndicator 
          :current="selectedCompound.quantity"
          :threshold="selectedCompound.threshold"
          :unit="selectedCompound.unit"
          size="sm"
        />
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div>{{ $t('compounds.labels.casNumber') }}: {{ selectedCompound.casNumber }}</div>
        <div>{{ $t('compounds.labels.location') }}: {{ selectedCompound.location }}</div>
      </div>
    </div>

    <!-- Transaction Type -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        {{ $t('inventorySessions.quickTransaction.transactionType') }}
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="(config, type) in TRANSACTION_TYPES"
          :key="type"
          type="button"
          :class="[
            'p-3 rounded-lg border-2 transition-all duration-200',
            'flex flex-col items-center gap-2',
            form.type === type
              ? `border-${config.color}-500 bg-${config.color}-50 text-${config.color}-700`
              : 'border-slate-200 hover:border-slate-300 text-slate-600'
          ]"
          @click="form.type = type"
        >
          <div :class="`w-6 h-6 rounded-full bg-${config.color}-100 flex items-center justify-center`">
            <component :is="getIconComponent(config.icon)" class="w-4 h-4" />
          </div>
          <span class="text-xs font-medium">
            {{ $t(`inventorySessions.quickTransaction.types.${type}`) }}
          </span>
        </button>
      </div>
      <ValidationMessages 
        v-if="errors.type" 
        :errors="[errors.type]" 
      />
    </div>

    <!-- Quantity Input -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        {{ $t('inventorySessions.quickTransaction.quantity') }}
        <span v-if="selectedCompound" class="text-slate-500">
          ({{ selectedCompound.unit }})
        </span>
      </label>
      <div class="relative">
        <Input
          v-model="form.quantity"
          type="number"
          step="0.01"
          min="0"
          :placeholder="$t('inventorySessions.quickTransaction.quantityPlaceholder')"
          :class="{ 'border-red-300': errors.quantity }"
        />
        <!-- Quick quantity buttons for common amounts -->
        <div v-if="selectedCompound && form.type === 'use'" class="flex gap-1 mt-2">
          <button
            v-for="preset in getQuantityPresets()"
            :key="preset"
            type="button"
            class="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded"
            @click="form.quantity = preset"
          >
            {{ preset }}
          </button>
        </div>
      </div>
      <ValidationMessages 
        v-if="errors.quantity" 
        :errors="[errors.quantity]" 
      />
      
      <!-- Stock validation warning -->
      <div 
        v-if="stockValidation.warning" 
        class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800"
      >
        {{ stockValidation.message }}
      </div>
    </div>

    <!-- Transfer Location (for transfer type only) -->
    <div v-if="form.type === 'transfer'">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        {{ $t('inventorySessions.quickTransaction.destinationLocation') }}
      </label>
      <Input
        v-model="form.location"
        :placeholder="$t('inventorySessions.quickTransaction.locationPlaceholder')"
        :class="{ 'border-red-300': errors.location }"
      />
      <ValidationMessages 
        v-if="errors.location" 
        :errors="[errors.location]" 
      />
    </div>

    <!-- Notes (Optional) -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        {{ $t('inventorySessions.quickTransaction.notes') }}
      </label>
      <textarea
        v-model="form.notes"
        rows="2"
        :placeholder="$t('inventorySessions.quickTransaction.notesPlaceholder')"
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Submit Actions -->
    <div class="flex gap-3 pt-4">
      <Button
        type="submit"
        :loading="loading"
        :disabled="!isFormValid"
        class="flex-1"
      >
        {{ $t('inventorySessions.quickTransaction.submit') }}
      </Button>
      <Button
        type="button"
        variant="outline"
        @click="resetForm"
      >
        {{ $t('inventorySessions.quickTransaction.cancel') }}
      </Button>
    </div>

    <!-- Transaction Preview -->
    <div v-if="showPreview" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="font-medium text-blue-900 mb-2">
        {{ $t('inventorySessions.quickTransaction.preview') }}
      </h4>
      <div class="text-sm text-blue-800 space-y-1">
        <div>
          <strong>{{ $t('inventorySessions.history.compound') }}:</strong> 
          {{ selectedCompound?.name }}
        </div>
        <div>
          <strong>{{ $t('inventorySessions.history.type') }}:</strong> 
          {{ $t(`inventorySessions.quickTransaction.types.${form.type}`) }}
        </div>
        <div>
          <strong>{{ $t('inventorySessions.quickTransaction.quantity') }}:</strong> 
          {{ form.quantity }} {{ selectedCompound?.unit }}
        </div>
        <div v-if="form.notes">
          <strong>{{ $t('inventorySessions.history.notes') }}:</strong> 
          {{ form.notes }}
        </div>
        <div class="pt-2">
          <strong>{{ $t('inventorySessions.stock.newStock') }}:</strong>
          <span v-if="newStockCalculating">{{ $t('common.calculating') }}...</span>
          <span v-else>{{ newStockPreview }} {{ selectedCompound?.unit }}</span>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInventory } from '@/composables/useInventory.js'
import { useCompounds } from '@/composables/useCompounds.js'
import { useToast } from '@/composables/useToast.js'

// Components
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import ValidationMessages from '@/components/ui/ValidationMessages.vue'
import CompoundSelector from '@/components/inventory/CompoundSelector.vue'
import StockLevelIndicator from '@/components/inventory/StockLevelIndicator.vue'

// Icons (you might need to install these or use your preferred icon library)
import { 
  MinusIcon, 
  PlusIcon, 
  PencilIcon, 
  ArrowRightIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const { toast } = useToast()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['transaction-recorded'])

// Composables
const { 
  recordTransaction, 
  validateTransaction, 
  calculateCurrentStock,
  TRANSACTION_TYPES,
  loading: inventoryLoading 
} = useInventory()

const { compounds } = useCompounds()

// Form state
const form = reactive({
  compoundId: '',
  type: 'use',
  quantity: '',
  notes: '',
  location: ''
})

const errors = ref({})
const selectedCompound = ref(null)
const showPreview = ref(false)
const newStockPreview = ref(0)
const newStockCalculating = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return form.compoundId && 
         form.type && 
         form.quantity && 
         parseFloat(form.quantity) > 0 &&
         (!form.type === 'transfer' || form.location)
})

const stockValidation = computed(() => {
  if (!selectedCompound.value || !form.quantity) {
    return { warning: false }
  }
  
  const currentStock = selectedCompound.value.quantity
  const quantity = parseFloat(form.quantity)
  const newStock = calculateNewStock()
  
  if ((form.type === 'use' || form.type === 'waste') && quantity > currentStock) {
    return {
      warning: true,
      message: t('inventorySessions.messages.insufficientStock')
    }
  }
  
  if (newStock < 0) {
    return {
      warning: true,
      message: t('inventorySessions.stock.negativeStock')
    }
  }
  
  if (newStock <= selectedCompound.value.threshold * 0.5) {
    return {
      warning: true,
      message: t('inventorySessions.stock.willBeLowStock')
    }
  }
  
  return { warning: false }
})

// Methods
const handleCompoundSelected = async (compound) => {
  selectedCompound.value = compound
  form.compoundId = compound.id
  
  // Get current stock from server
  try {
    const currentStock = await calculateCurrentStock(compound.id)
    selectedCompound.value = {
      ...compound,
      quantity: currentStock
    }
  } catch (err) {
    console.error('Error calculating current stock:', err)
    // Fall back to compound's base quantity if calculation fails
  }
  
  // Clear any previous errors
  if (errors.value.compoundId) {
    delete errors.value.compoundId
  }
}

const handleSubmit = async () => {
  try {
    // Clear previous errors
    errors.value = {}
    
    // Validate form
    const validation = validateTransaction({
      compoundId: form.compoundId,
      type: form.type,
      quantity: parseFloat(form.quantity),
      notes: form.notes,
      location: form.location
    })
    
    if (!validation.valid) {
      // Map validation errors to form fields
      validation.errors.forEach(error => {
        if (error.includes('Compound')) errors.value.compoundId = error
        if (error.includes('type')) errors.value.type = error
        if (error.includes('quantity') || error.includes('Quantity')) errors.value.quantity = error
        if (error.includes('location')) errors.value.location = error
      })
      return
    }
    
    // Check for stock validation warnings
    if (stockValidation.value.warning && 
        (form.type === 'use' || form.type === 'waste') &&
        parseFloat(form.quantity) > selectedCompound.value.quantity) {
      const confirmed = confirm(
        `${stockValidation.value.message}\n\n${t('inventorySessions.messages.confirmTransaction')}`
      )
      if (!confirmed) return
    }
    
    // Record transaction
    const transaction = {
      compoundId: form.compoundId,
      compoundName: selectedCompound.value.name,
      type: form.type,
      quantity: parseFloat(form.quantity),
      notes: form.notes || '',
      location: form.location || selectedCompound.value.location
    }
    
    await recordTransaction(transaction)
    
    // Emit success event
    emit('transaction-recorded', transaction)
    
    // Reset form
    resetForm()
    
  } catch (err) {
    console.error('Transaction submission error:', err)
    toast.error(t('inventorySessions.messages.transactionFailed'))
  }
}

const resetForm = () => {
  form.compoundId = ''
  form.type = 'use'
  form.quantity = ''
  form.notes = ''
  form.location = ''
  selectedCompound.value = null
  errors.value = {}
  showPreview.value = false
}

const calculateNewStock = async () => {
  if (!selectedCompound.value || !form.quantity) return 0
  
  try {
    // Get the most up-to-date stock from server
    const currentStock = await calculateCurrentStock(selectedCompound.value.id)
    const quantity = parseFloat(form.quantity)
    const typeConfig = TRANSACTION_TYPES[form.type]
    
    if (form.type === 'adjust') {
      return quantity
    }
    
    return currentStock + (quantity * typeConfig.multiplier)
  } catch (err) {
    console.error('Error calculating new stock:', err)
    return 0
  }
}

const getQuantityPresets = () => {
  if (!selectedCompound.value) return []
  
  const currentStock = selectedCompound.value.quantity
  const presets = []
  
  // Add some common usage amounts based on current stock
  if (currentStock >= 10) presets.push(1, 5, 10)
  if (currentStock >= 25) presets.push(25)
  if (currentStock >= 50) presets.push(50)
  if (currentStock >= 100) presets.push(100)
  
  return presets.filter(p => p <= currentStock)
}

const getIconComponent = (iconName) => {
  const iconMap = {
    minus: MinusIcon,
    plus: PlusIcon,
    edit: PencilIcon,
    'arrow-right': ArrowRightIcon,
    trash: TrashIcon
  }
  return iconMap[iconName] || MinusIcon
}

// Watch for form changes to show/hide preview and calculate new stock
watch([() => form.compoundId, () => form.type, () => form.quantity], async () => {
  showPreview.value = form.compoundId && form.type && form.quantity
  
  if (showPreview.value) {
    newStockCalculating.value = true
    try {
      newStockPreview.value = await calculateNewStock()
    } catch (err) {
      console.error('Error calculating new stock preview:', err)
      newStockPreview.value = 0
    } finally {
      newStockCalculating.value = false
    }
  }
})
</script>
