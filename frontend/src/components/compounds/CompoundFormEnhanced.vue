<template>
  <div class="space-y-6">
    <!-- Form-level validation messages -->
    <ValidationMessages 
      v-if="formErrors.length > 0"
      :errors="formErrors"
      class="bg-red-50 border border-red-200 rounded-lg p-4"
    />
    
    <!-- Basic Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        v-model="formData.name"
        :label="$t('compounds.name')"
        :placeholder="$t('compounds.namePlaceholder')"
        :required="true"
        :errors="getFieldErrors('name')"
        :validating="getFieldState('name').isValidating"
        :is-valid="isFieldValid('name')"
        :is-touched="getFieldState('name').isTouched"
        @validate="validateField('name', $event)"
        @blur="touchField('name')"
      />

      <Input
        v-model="formData.casNumber"
        :label="$t('compounds.casNumber')"
        :placeholder="$t('compounds.casPlaceholder')"
        :help-text="$t('validation.casNumberHelp')"
        :errors="getFieldErrors('casNumber')"
        :validating="getFieldState('casNumber').isValidating"
        :is-valid="isFieldValid('casNumber')"
        :is-touched="getFieldState('casNumber').isTouched"
        @validate="validateField('casNumber', $event)"
        @blur="touchField('casNumber')"
      />
    </div>

    <!-- Quantity and Location -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        v-model="formData.quantity"
        type="number"
        step="0.01"
        min="0"
        :label="$t('compounds.quantity')"
        :placeholder="$t('compounds.quantityPlaceholder')"
        :required="true"
        :errors="getFieldErrors('quantity')"
        :validating="getFieldState('quantity').isValidating"
        :is-valid="isFieldValid('quantity')"
        :is-touched="getFieldState('quantity').isTouched"
        @validate="validateField('quantity', $event)"
        @blur="touchField('quantity')"
      />

      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">
          {{ $t('compounds.unit') }}
          <span class="text-red-500 ml-1">*</span>
        </label>
        <select
          v-model="formData.unit"
          :class="[
            'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            getValidationClasses('unit')
          ]"
          @change="validateField('unit', $event.target.value); touchField('unit')"
        >
          <option value="">{{ $t('compounds.unitSelect') }}</option>
          <option value="g">{{ $t('compounds.unit.g') }}</option>
          <option value="kg">{{ $t('compounds.unit.kg') }}</option>
          <option value="ml">{{ $t('compounds.unit.ml') }}</option>
          <option value="l">{{ $t('compounds.unit.l') }}</option>
          <option value="mg">{{ $t('compounds.unit.mg') }}</option>
          <option value="μg">{{ $t('compounds.unit.μg') }}</option>
          <option value="mol">{{ $t('compounds.unit.mol') }}</option>
          <option value="mmol">{{ $t('compounds.unit.mmol') }}</option>
        </select>
        <ValidationMessages 
          :errors="getFieldErrors('unit')"
          :validating="getFieldState('unit').isValidating"
        />
      </div>

      <Input
        v-model="formData.threshold"
        type="number"
        step="0.01"
        min="0"
        :label="$t('compounds.reorderThreshold')"
        :placeholder="$t('compounds.thresholdPlaceholder')"
        :help-text="$t('validation.thresholdHelp')"
        :errors="getFieldErrors('threshold')"
        :validating="getFieldState('threshold').isValidating"
        :is-valid="isFieldValid('threshold')"
        :is-touched="getFieldState('threshold').isTouched"
        @validate="validateField('threshold', $event)"
        @blur="touchField('threshold')"
      />
    </div>

    <!-- Location and Hazard -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        v-model="formData.location"
        :label="$t('compounds.location')"
        :placeholder="$t('compounds.locationPlaceholder')"
        :required="true"
        :errors="getFieldErrors('location')"
        :validating="getFieldState('location').isValidating"
        :is-valid="isFieldValid('location')"
        :is-touched="getFieldState('location').isTouched"
        @validate="validateField('location', $event)"
        @blur="touchField('location')"
      />

      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">
          {{ $t('compounds.hazardClass') }}
        </label>
        <select
          v-model="formData.hazardClass"
          :class="[
            'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            getValidationClasses('hazardClass')
          ]"
          @change="validateField('hazardClass', $event.target.value); touchField('hazardClass')"
        >
          <option value="">{{ $t('compounds.hazardClassSelect') }}</option>
          <option value="Non-hazardous">{{ $t('compounds.hazardClassNonHazardous') }}</option>
          <option value="Flammable">{{ $t('compounds.hazardClassFlammable') }}</option>
          <option value="Corrosive">{{ $t('compounds.hazardClassCorrosive') }}</option>
          <option value="Toxic">{{ $t('compounds.hazardClassToxic') }}</option>
          <option value="Oxidizing">{{ $t('compounds.hazardClassOxidizing') }}</option>
          <option value="Explosive">{{ $t('compounds.hazardClassExplosive') }}</option>
          <option value="Carcinogenic">{{ $t('compounds.hazardClassCarcinogenic') }}</option>
          <option value="Radioactive">{{ $t('compounds.hazardClassRadioactive') }}</option>
        </select>
      </div>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        v-model="formData.receivedDate"
        type="date"
        :label="$t('compounds.receivedDate')"
        :errors="getFieldErrors('receivedDate')"
        :validating="getFieldState('receivedDate').isValidating"
        :is-valid="isFieldValid('receivedDate')"
        :is-touched="getFieldState('receivedDate').isTouched"
        @validate="validateField('receivedDate', $event)"
        @blur="touchField('receivedDate')"
      />

      <Input
        v-model="formData.expiryDate"
        type="date"
        :label="$t('compounds.expiryDate')"
        :help-text="$t('validation.expiryDateHelp')"
        :errors="getFieldErrors('expiryDate')"
        :validating="getFieldState('expiryDate').isValidating"
        :is-valid="isFieldValid('expiryDate')"
        :is-touched="getFieldState('expiryDate').isTouched"
        @validate="validateField('expiryDate', $event)"
        @blur="touchField('expiryDate')"
      />
    </div>

    <!-- Additional Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        v-model="formData.supplier"
        :label="$t('compounds.supplier')"
        :placeholder="$t('compounds.supplierPlaceholder')"
        :errors="getFieldErrors('supplier')"
        :validating="getFieldState('supplier').isValidating"
        :is-valid="isFieldValid('supplier')"
        :is-touched="getFieldState('supplier').isTouched"
        @validate="validateField('supplier', $event)"
        @blur="touchField('supplier')"
      />

      <Input
        v-model="formData.batchNumber"
        :label="$t('compounds.batchNumber')"
        :placeholder="$t('compounds.batchNumberPlaceholder')"
        :errors="getFieldErrors('batchNumber')"
        :validating="getFieldState('batchNumber').isValidating"
        :is-valid="isFieldValid('batchNumber')"
        :is-touched="getFieldState('batchNumber').isTouched"
        @validate="validateField('batchNumber', $event)"
        @blur="touchField('batchNumber')"
      />
    </div>

    <!-- Synonyms -->
    <div>
      <Input
        v-model="formData.synonyms"
        :label="$t('compounds.synonyms')"
        :placeholder="$t('compounds.synonymsPlaceholder')"
        :help-text="$t('compounds.synonymsHelp')"
        :errors="getFieldErrors('synonyms')"
        :validating="getFieldState('synonyms').isValidating"
        :is-valid="isFieldValid('synonyms')"
        :is-touched="getFieldState('synonyms').isTouched"
        @validate="validateField('synonyms', $event)"
        @blur="touchField('synonyms')"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-between pt-6 border-t border-slate-200">
      <div class="text-sm text-slate-600">
        <span v-if="hasValidationInProgress" class="flex items-center">
          <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ $t('validation.validating') }}
        </span>
        <span v-else-if="isFormValid" class="flex items-center text-green-600">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ $t('validation.formValid') }}
        </span>
      </div>
      
      <div class="flex gap-3">
        <Button 
          variant="secondary" 
          @click="resetForm"
          :disabled="hasValidationInProgress"
        >
          {{ $t('common.reset') }}
        </Button>
        
        <Button 
          @click="handleSubmit"
          :disabled="!isFormValid || hasValidationInProgress"
        >
          {{ isEditMode ? $t('common.save') : $t('compounds.create') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Enhanced Compound Form with Validation
 * 
 * Provides a comprehensive form for creating and editing compounds with
 * real-time validation, visual feedback, and accessibility features.
 * 
 * Features:
 * - Real-time field validation with debouncing
 * - Cross-field validation (e.g., expiry after received date)
 * - Async validation for unique constraints
 * - Visual validation indicators
 * - Accessible form controls
 * - Internationalized error messages
 * - Form-level error handling
 */
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import ValidationMessages from '@/components/ui/ValidationMessages.vue'
import { useValidation } from '@/composables/useValidation'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  compound: {
    type: Object,
    default: () => ({})
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])
const { t } = useI18n()

// Initialize validation
const validation = useValidation('compound-form')

const {
  registerField,
  validateField,
  validateForm,
  touchField,
  resetValidation,
  getFieldState,
  getFieldErrors,
  hasFieldErrors,
  isFieldValid,
  isFormValid,
  hasValidationInProgress,
  getValidationClasses,
  formErrors
} = validation

// Form data
const formData = reactive({
  name: '',
  casNumber: '',
  quantity: '',
  unit: '',
  threshold: '',
  location: '',
  hazardClass: '',
  receivedDate: '',
  expiryDate: '',
  supplier: '',
  batchNumber: '',
  synonyms: ''
})

// Register validation rules for each field
onMounted(() => {
  // Name field - required, unique
  registerField('name', [
    'required',
    { name: 'minLength', params: { min: 2 } },
    { name: 'maxLength', params: { max: 100 } },
    { 
      name: 'uniqueCompoundName', 
      async: true, 
      currentId: props.compound?.id 
    }
  ])

  // CAS Number - format validation, unique
  registerField('casNumber', [
    'casNumber',
    { 
      name: 'uniqueCasNumber', 
      async: true, 
      currentId: props.compound?.id 
    }
  ])

  // Quantity - required, positive number
  registerField('quantity', [
    'required',
    'positiveNumber'
  ])

  // Unit - required
  registerField('unit', ['required'])

  // Threshold - non-negative number
  registerField('threshold', ['nonNegativeNumber'])

  // Location - required
  registerField('location', [
    'required',
    { name: 'minLength', params: { min: 2 } },
    { name: 'maxLength', params: { max: 50 } }
  ])

  // Hazard class - no specific validation (optional)
  registerField('hazardClass', [])

  // Received date - should be in the past
  registerField('receivedDate', ['pastDate'])

  // Expiry date - should be in the future
  registerField('expiryDate', ['futureDate'])

  // Supplier
  registerField('supplier', [
    { name: 'maxLength', params: { max: 100 } }
  ])

  // Batch number
  registerField('batchNumber', [
    { name: 'maxLength', params: { max: 50 } }
  ])

  // Synonyms
  registerField('synonyms', [
    { name: 'maxLength', params: { max: 500 } }
  ])

  // Initialize form data if editing
  if (props.isEditMode && props.compound) {
    Object.assign(formData, props.compound)
  }
})

// Watch for form data changes to trigger validation
watch(() => formData.name, (value) => {
  if (getFieldState('name').isTouched) {
    validateField('name', value)
  }
})

watch(() => formData.casNumber, (value) => {
  if (getFieldState('casNumber').isTouched) {
    validateField('casNumber', value)
  }
})

watch(() => formData.quantity, (value) => {
  if (getFieldState('quantity').isTouched) {
    validateField('quantity', value)
  }
})

watch(() => formData.unit, (value) => {
  if (getFieldState('unit').isTouched) {
    validateField('unit', value)
  }
})

watch(() => formData.threshold, (value) => {
  if (getFieldState('threshold').isTouched) {
    validateField('threshold', value)
  }
})

watch(() => formData.location, (value) => {
  if (getFieldState('location').isTouched) {
    validateField('location', value)
  }
})

watch(() => formData.receivedDate, (value) => {
  if (getFieldState('receivedDate').isTouched) {
    validateField('receivedDate', value)
  }
})

watch(() => formData.expiryDate, (value) => {
  if (getFieldState('expiryDate').isTouched) {
    validateField('expiryDate', value)
  }
})

// Handle form submission
const handleSubmit = async () => {
  // Validate entire form
  const isValid = await validateForm(formData, true)
  
  if (isValid) {
    emit('submit', { ...formData })
  }
}

// Reset form
const resetForm = () => {
  // Reset validation state
  resetValidation()
  
  // Reset form data
  if (props.isEditMode && props.compound) {
    Object.assign(formData, props.compound)
  } else {
    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })
  }
}
</script>
