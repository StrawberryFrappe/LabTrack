<template>
  <BaseModal
    :is-open="isOpen"
    :title="isEditing ? $t('compounds.instances.edit') : $t('compounds.instances.addNew')"
    size="medium"
    @close="handleClose"
  >
    <template #description>
      <div class="flex items-center gap-2">
        <span>{{ compound?.name }}</span>
        <Badge :variant="hazardBadgeVariant">{{ compound?.hazardClass }}</Badge>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Location -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          {{ $t('compounds.instances.location') }} *
        </label>
        <Input
          v-model="form.location"
          :placeholder="$t('compounds.locationPlaceholder')"
          :error="errors.location"
          required
        />
        <p v-if="errors.location" class="mt-1 text-sm text-red-600">
          {{ errors.location }}
        </p>
      </div>

      <!-- Batch Number -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          {{ $t('compounds.instances.batchNumber') }} *
        </label>
        <Input
          v-model="form.batchNumber"
          :placeholder="$t('compounds.batchNumberPlaceholder')"
          :error="errors.batchNumber"
          required
        />
        <p v-if="errors.batchNumber" class="mt-1 text-sm text-red-600">
          {{ errors.batchNumber }}
        </p>
      </div>

      <!-- Quantity and Unit -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            {{ $t('compounds.instances.quantity') }} *
          </label>
          <Input
            v-model="form.quantity"
            type="number"
            min="0"
            step="0.01"
            :placeholder="$t('compounds.quantityPlaceholder')"
            :error="errors.quantity"
            required
          />
          <p v-if="errors.quantity" class="mt-1 text-sm text-red-600">
            {{ errors.quantity }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            {{ $t('compounds.unit') }} *
          </label>
          <select
            v-model="form.unit"
            class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.unit }"
            required
          >
            <option value="">{{ $t('compounds.unitSelect') }}</option>
            <option value="g">g</option>
            <option value="mg">mg</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="L">L</option>
            <option value="mol">mol</option>
            <option value="mmol">mmol</option>
            <option value="units">units</option>
          </select>
          <p v-if="errors.unit" class="mt-1 text-sm text-red-600">
            {{ errors.unit }}
          </p>
        </div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            {{ $t('compounds.instances.received') }}
          </label>
          <Input
            v-model="form.receivedDate"
            type="date"
            :error="errors.receivedDate"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            {{ $t('compounds.instances.expiryDate') }}
          </label>
          <Input
            v-model="form.expiryDate"
            type="date"
            :error="errors.expiryDate"
          />
        </div>
      </div>

      <!-- Opened Date -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          {{ $t('compounds.instances.opened') }}
        </label>
        <Input
          v-model="form.openedDate"
          type="date"
          :error="errors.openedDate"
        />
        <p class="mt-1 text-xs text-slate-500">
          {{ $t('compounds.instances.openedHelp') }}
        </p>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          {{ $t('compounds.instances.status') }}
        </label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': errors.status }"
        >
          <option value="active">{{ $t('compounds.instances.statusActive') }}</option>
          <option value="used_up">{{ $t('compounds.instances.statusUsedUp') }}</option>
          <option value="expired">{{ $t('compounds.instances.statusExpired') }}</option>
        </select>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-between">
        <Button variant="outline" @click="handleClose" :disabled="loading">
          {{ $t('common.cancel') }}
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          @click="handleSubmit"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" size="xs" class="mr-2" />
          {{ isEditing ? $t('common.update') : $t('common.create') }}
        </Button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useCompoundInstances } from '@/composables/useCompoundInstances'
import { useValidation } from '@/composables/useValidation'

const { t } = useI18n()
const instanceComposable = useCompoundInstances()
const { validate, clearErrors } = useValidation()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  compound: {
    type: Object,
    default: null
  },
  instance: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

// Local state
const loading = ref(false)
const errors = ref({})

const form = ref({
  location: '',
  batchNumber: '',
  quantity: '',
  unit: '',
  receivedDate: '',
  expiryDate: '',
  openedDate: '',
  status: 'active'
})

// Computed properties
const isEditing = computed(() => !!props.instance)

const hazardBadgeVariant = computed(() => {
  if (!props.compound) return 'secondary'
  const hazard = props.compound.hazardClass.toLowerCase()
  if (hazard.includes('toxic') || hazard.includes('carcinogenic')) return 'destructive'
  if (hazard.includes('flammable') || hazard.includes('corrosive')) return 'warning'
  return 'secondary'
})

// Validation rules
const validationRules = {
  location: [
    { required: true, message: t('validation.required', { field: t('compounds.instances.location') }) },
    { minLength: 2, message: t('validation.minLength', { field: t('compounds.instances.location'), length: 2 }) }
  ],
  batchNumber: [
    { required: true, message: t('validation.required', { field: t('compounds.instances.batchNumber') }) },
    { minLength: 2, message: t('validation.minLength', { field: t('compounds.instances.batchNumber'), length: 2 }) }
  ],
  quantity: [
    { required: true, message: t('validation.required', { field: t('compounds.instances.quantity') }) },
    { min: 0, message: t('validation.min', { field: t('compounds.instances.quantity'), min: 0 }) }
  ],
  unit: [
    { required: true, message: t('validation.required', { field: t('compounds.unit') }) }
  ]
}

// Methods
const resetForm = () => {
  form.value = {
    location: '',
    batchNumber: '',
    quantity: '',
    unit: '',
    receivedDate: '',
    expiryDate: '',
    openedDate: '',
    status: 'active'
  }
  clearErrors(errors)
}

const populateForm = (instance) => {
  if (!instance) return
  
  form.value = {
    location: instance.location || '',
    batchNumber: instance.batchNumber || '',
    quantity: instance.quantity || '',
    unit: instance.unit || '',
    receivedDate: instance.receivedDate || '',
    expiryDate: instance.expiryDate || '',
    openedDate: instance.openedDate || '',
    status: instance.status || 'active'
  }
}

const handleSubmit = async () => {
  // Validate form
  const validationErrors = validate(form.value, validationRules)
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors
    return
  }

  loading.value = true
  
  try {
    const instanceData = {
      ...form.value,
      compoundId: props.compound.id,
      quantity: parseFloat(form.value.quantity)
    }

    if (isEditing.value) {
      await instanceComposable.updateInstance(props.instance.id, instanceData)
    } else {
      await instanceComposable.createInstance(instanceData)
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('Failed to save instance:', error)
    errors.value = { general: error.message }
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  emit('close')
  resetForm()
}

// Watch for modal open/close and instance changes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.instance) {
      populateForm(props.instance)
    } else {
      resetForm()
    }
  }
})

watch(() => props.instance, (instance) => {
  if (instance && props.isOpen) {
    populateForm(instance)
  }
})
</script>
