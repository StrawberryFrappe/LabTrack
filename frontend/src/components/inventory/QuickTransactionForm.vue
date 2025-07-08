<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Instance Selector -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        {{ $t('inventorySessions.quickTransaction.selectInstance') }}
      </label>
      <InstanceSelector
        ref="instanceSelectorRef"
        v-model="form.instanceId"
        :placeholder="$t('inventorySessions.quickTransaction.instancePlaceholder')"
        @instance-selected="handleInstanceSelected"
        @update:modelValue="handleInstanceIdChange"
      />
      <ValidationMessages 
        v-if="validationState.errors.instanceId" 
        :errors="[validationState.errors.instanceId]" 
      />
    </div>

    

    <!-- Transaction Type -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        {{ $t('inventorySessions.quickTransaction.transactionType') }}
      </label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="(config, type) in TRANSACTION_TYPES"
          :key="type"
          type="button"
          :class="[
            'p-2 rounded-lg border-2 transition-all duration-200',
            'flex flex-col items-center gap-1',
            form.type === type
              ? `border-${config.color}-500 bg-${config.color}-50 text-${config.color}-700`
              : 'border-slate-200 hover:border-slate-300 text-slate-600'
          ]"
          @click="form.type = type"
        >
          <div :class="`w-5 h-5 rounded-full bg-${config.color}-100 flex items-center justify-center`">
            <component :is="getIconComponent(config.icon)" class="w-3 h-3" />
          </div>
          <span class="text-xs font-medium">
            {{ $t(`inventorySessions.quickTransaction.types.${type}`) }}
          </span>
        </button>
      </div>
      <ValidationMessages 
        v-if="validationState.errors.type" 
        :errors="[validationState.errors.type]" 
      />
    </div>

    <!-- Quantity Input -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        {{ $t('inventorySessions.quickTransaction.quantity') }}
        <span v-if="selectedInstance" class="text-slate-500">
          ({{ selectedInstance.unit || selectedInstance.compound?.unit }}) - {{ $t('inventorySessions.quickTransaction.available') }}: {{ selectedInstance.quantity }}
        </span>
      </label>
      <div class="relative">
        <Input
          v-model="form.quantity"
          type="number"
          step="0.01"
          min="0"
          :max="getMaxQuantity()"
          :placeholder="$t('inventorySessions.quickTransaction.quantityPlaceholder')"
          :class="{ 'border-red-300': validationState.errors.quantity }"
        />
        <!-- Quick quantity buttons for common amounts -->
        <div v-if="selectedInstance && (form.type === 'use' || form.type === 'waste')" class="flex gap-1 mt-2">
          <button
            v-for="preset in getQuantityPresets()"
            :key="preset"
            type="button"
            class="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded"
            @click="form.quantity = preset"
          >
            {{ preset }}
          </button>
          <button
            type="button"
            class="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
            @click="form.quantity = selectedInstance?.quantity || 0"
          >
            {{ $t('inventorySessions.quickTransaction.useAll') }}
          </button>
        </div>
      </div>
      <ValidationMessages 
        v-if="validationState.errors.quantity" 
        :errors="[validationState.errors.quantity]" 
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
        :class="{ 'border-red-300': validationState.errors.location }"
      />
      <ValidationMessages 
        v-if="validationState.errors.location" 
        :errors="[validationState.errors.location]" 
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
        :loading="loading || inventoryLoading"
        :disabled="!isFormValid"
        class="flex-1"
        @click="console.log('Submit button clicked, isFormValid:', isFormValid)"
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
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInventory } from '@/composables/useInventory.js'
import { useToast } from '@/composables/useToast.js'

// Components
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import ValidationMessages from '@/components/ui/ValidationMessages.vue'
import InstanceSelector from '@/components/inventory/InstanceSelector.vue'

// Icons
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
  recordInstanceTransaction, 
  validateInstanceTransaction, 
  calculateNewInstanceQuantity,
  TRANSACTION_TYPES,
  loading: inventoryLoading 
} = useInventory()

// Simplified form state
const form = reactive({
  instanceId: '',
  type: 'use',
  quantity: '',
  notes: '',
  location: ''
})

const selectedInstance = ref(null)
const instanceSelectorRef = ref(null)
const loading = ref(false)
const errors = ref({})

// Computed properties
const isFormValid = computed(() => {
  return form.instanceId && 
         form.type && 
         form.quantity && 
         parseFloat(form.quantity) > 0 &&
         (form.type !== 'transfer' || form.location?.trim()) &&
         !loading.value && 
         !inventoryLoading.value
})

const stockValidation = computed(() => {
  if (!selectedInstance.value || !form.quantity) {
    return { warning: false }
  }
  
  const currentStock = selectedInstance.value.quantity
  const quantity = parseFloat(form.quantity)
  
  if ((form.type === 'use' || form.type === 'waste') && quantity > currentStock) {
    return {
      warning: true,
      message: t('inventorySessions.messages.insufficientStock')
    }
  }
  
  return { warning: false }
})

// Simplified methods
const validateForm = () => {
  const newErrors = {}
  
  if (!form.instanceId) {
    newErrors.instanceId = t('inventorySessions.validation.required')
  }
  
  if (!form.type || !TRANSACTION_TYPES[form.type]) {
    newErrors.type = t('inventorySessions.validation.required')
  }
  
  const quantity = parseFloat(form.quantity)
  if (isNaN(quantity) || quantity <= 0) {
    newErrors.quantity = t('inventorySessions.validation.positiveNumber')
  }
  
  if (form.type === 'transfer' && !form.location?.trim()) {
    newErrors.location = t('inventorySessions.validation.required')
  }
  
  // Check stock availability
  if (selectedInstance.value && ['use', 'waste'].includes(form.type)) {
    if (quantity > selectedInstance.value.quantity) {
      newErrors.quantity = t('inventorySessions.messages.insufficientStock')
    }
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleInstanceSelected = (instance) => {
  selectedInstance.value = instance
  form.instanceId = instance?.id || ''
  
  // Clear instance-related errors
  if (errors.value.instanceId) {
    delete errors.value.instanceId
  }
}

const handleInstanceIdChange = (instanceId) => {
  form.instanceId = instanceId || ''
}

const getMaxQuantity = () => {
  if (!selectedInstance.value) return undefined
  return selectedInstance.value.quantity
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const handleSubmit = async () => {
  if (loading.value) return
  
  try {
    loading.value = true
    
    // Clear previous errors
    validationState.errors = {}
    
    // Basic form validation
    if (!validateForm()) {
      return
    }
    
    // Ensure instance is selected
    if (!selectedInstance.value) {
      validationState.errors.instanceId = t('inventorySessions.messages.selectInstance')
      return
    }
    
    // Create transaction object
    const transaction = {
      instanceId: form.instanceId,
      compoundId: selectedInstance.value.compoundId,
      compoundName: selectedInstance.value.compound?.name,
      batchNumber: selectedInstance.value.batchNumber,
      type: form.type,
      quantity: parseFloat(form.quantity),
      originalQuantity: selectedInstance.value.quantity || 0,
      unit: selectedInstance.value.unit || selectedInstance.value.compound?.unit,
      notes: form.notes?.trim() || '',
      location: form.type === 'transfer' ? form.location : selectedInstance.value.location
    }
    
    // Simple duplicate check
    if (isDuplicateTransaction(transaction)) {
      toast.error(t('inventorySessions.messages.duplicateTransaction'))
      return
    }
    
    // Record transaction (let the composable handle all validation and processing)
    const result = await recordInstanceTransaction(transaction)
    
    // Success handling
    emit('transaction-recorded', transaction)
    toast.success(t('inventorySessions.messages.transactionRecorded'))
    resetForm()
    
  } catch (error) {
    console.error('Transaction submission error:', error)
    
    // Simple error handling
    let errorMessage = t('inventorySessions.messages.transactionFailed')
    
    if (error && typeof error === 'object' && error.message) {
      errorMessage = error.message
    } else if (error && typeof error === 'string') {
      errorMessage = error
    }
    
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  // Reset form data
  form.instanceId = ''
  form.type = 'use'
  form.quantity = ''
  form.notes = ''
  form.location = ''
  
  // Clear validation state
  validationState.errors = {}
  validationState.hasValidated = false
  
  // Clear selected instance
  selectedInstance.value = null
  
  // Reset the InstanceSelector component if it exists
  if (instanceSelectorRef.value?.reset) {
    instanceSelectorRef.value.reset()
  }
}

// Watch for form changes to clear errors and debug
watch(() => form.instanceId, (newVal, oldVal) => {
  console.log('Form instanceId changed from', oldVal, 'to', newVal)
  if (validationState.hasValidated && validationState.errors.instanceId) {
    delete validationState.errors.instanceId
  }
})

watch(() => form.quantity, (newVal, oldVal) => {
  console.log('Form quantity changed from', oldVal, 'to', newVal)
  if (validationState.hasValidated && validationState.errors.quantity) {
    delete validationState.errors.quantity
  }
})

watch(() => form.location, (newVal, oldVal) => {
  console.log('Form location changed from', oldVal, 'to', newVal)
  if (validationState.hasValidated && validationState.errors.location) {
    delete validationState.errors.location
  }
})

watch(() => form.type, (newVal, oldVal) => {
  console.log('Form type changed from', oldVal, 'to', newVal)
  if (validationState.hasValidated && validationState.errors.type) {
    delete validationState.errors.type
  }
})


const getQuantityPresets = () => {
  if (!selectedInstance.value) return []
  
  const currentStock = selectedInstance.value.quantity
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
</script>
