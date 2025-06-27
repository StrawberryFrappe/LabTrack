<template>
  <div class="space-y-6">
    <!-- Basic Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="compound-name" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.name')}} *
        </label>
        <Input
          id="compound-name"
          :model-value="formData.name"
          @update:model-value="updateField('name', $event)"
          :placeholder="$t('compounds.namePlaceholder')"
          :error="errors.name"
          required
        />
        <ErrorMessage v-if="errors.name" :message="errors.name" />
      </div>

      <div>
        <label for="cas-number" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.casNumber')}}
        </label>
        <Input
          id="cas-number"
          :model-value="formData.casNumber"
          @update:model-value="updateField('casNumber', $event)"
          :placeholder="$t('compounds.casPlaceholder')"
          :error="errors.casNumber"
        />
        <ErrorMessage v-if="errors.casNumber" :message="errors.casNumber" />
      </div>
    </div>

    <!-- Quantity and Location -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="quantity" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.quantity')}} *
        </label>
        <Input
          id="quantity"
          :model-value="formData.quantity"
          @update:model-value="updateField('quantity', Number($event))"
          type="number"
          min="0"
          step="0.01"
          :placeholder="$t('compounds.quantityPlaceholder')"
          :error="errors.quantity"
          required
        />
        <ErrorMessage v-if="errors.quantity" :message="errors.quantity" />
      </div>

      <div>
        <label for="unit" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.unit')}} *
        </label>
        <select
          id="unit"
          :value="formData.unit"
          @input="updateField('unit', $event.target.value)"
          class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': errors.unit }"
          required
        >
          <option value="">{{$t('compounds.unitSelect')}}</option>
          <option value="g">{{$t('compounds.unit.g')}}</option>
          <option value="kg">{{$t('compounds.unit.kg')}}</option>
          <option value="ml">{{$t('compounds.unit.ml')}}</option>
          <option value="l">{{$t('compounds.unit.l')}}</option>
          <option value="mg">{{$t('compounds.unit.mg')}}</option>
          <option value="μg">{{$t('compounds.unit.μg')}}</option>
          <option value="mol">{{$t('compounds.unit.mol')}}</option>
          <option value="mmol">{{$t('compounds.unit.mmol')}}</option>
        </select>
        <ErrorMessage v-if="errors.unit" :message="errors.unit" />
      </div>

      <div>
        <label for="threshold" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.reorderThreshold')}}
        </label>
        <Input
          id="threshold"
          :model-value="formData.threshold"
          @update:model-value="updateField('threshold', Number($event))"
          type="number"
          min="0"
          step="0.01"
          :placeholder="$t('compounds.thresholdPlaceholder')"
          :error="errors.threshold"
        />
        <ErrorMessage v-if="errors.threshold" :message="errors.threshold" />
      </div>
    </div>

    <!-- Location and Hazard -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="location" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.location')}} *
        </label>
        <Input
          id="location"
          :model-value="formData.location"
          @update:model-value="updateField('location', $event)"
          :placeholder="$t('compounds.locationPlaceholder')"
          :error="errors.location"
          required
        />
        <ErrorMessage v-if="errors.location" :message="errors.location" />
      </div>

      <div>
        <label for="hazard-class" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.hazardClass')}}
        </label>
        <select
          id="hazard-class"
          :value="formData.hazardClass"
          @input="updateField('hazardClass', $event.target.value)"
          class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': errors.hazardClass }"
        >
          <option value="">{{$t('compounds.hazardClassSelect')}}</option>
          <option value="Non-hazardous">{{$t('compounds.hazardClassNonHazardous')}}</option>
          <option value="Flammable">{{$t('compounds.hazardClassFlammable')}}</option>
          <option value="Corrosive">{{$t('compounds.hazardClassCorrosive')}}</option>
          <option value="Toxic">{{$t('compounds.hazardClassToxic')}}</option>
          <option value="Oxidizing">{{$t('compounds.hazardClassOxidizing')}}</option>
          <option value="Explosive">{{$t('compounds.hazardClassExplosive')}}</option>
          <option value="Carcinogenic">{{$t('compounds.hazardClassCarcinogenic')}}</option>
          <option value="Radioactive">{{$t('compounds.hazardClassRadioactive')}}</option>
        </select>
        <ErrorMessage v-if="errors.hazardClass" :message="errors.hazardClass" />
      </div>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="expiry-date" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.expiryDate')}}
        </label>
        <Input
          id="expiry-date"
          :model-value="formData.expiryDate"
          @update:model-value="updateField('expiryDate', $event)"
          type="date"
          :error="errors.expiryDate"
        />
        <ErrorMessage v-if="errors.expiryDate" :message="errors.expiryDate" />
      </div>

      <div>
        <label for="received-date" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.receivedDate')}}
        </label>
        <Input
          id="received-date"
          :model-value="formData.receivedDate"
          @update:model-value="updateField('receivedDate', $event)"
          type="date"
          :error="errors.receivedDate"
        />
        <ErrorMessage v-if="errors.receivedDate" :message="errors.receivedDate" />
      </div>
    </div>

    <!-- Supplier Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="supplier" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.supplier')}}
        </label>
        <Input
          id="supplier"
          :model-value="formData.supplier"
          @update:model-value="updateField('supplier', $event)"
          :placeholder="$t('compounds.supplierPlaceholder')"
          :error="errors.supplier"
        />
        <ErrorMessage v-if="errors.supplier" :message="errors.supplier" />
      </div>

      <div>
        <label for="batch-number" class="block text-sm font-medium text-slate-700 mb-2">
          {{$t('compounds.batchNumber')}}
        </label>
        <Input
          id="batch-number"
          :model-value="formData.batchNumber"
          @update:model-value="updateField('batchNumber', $event)"
          :placeholder="$t('compounds.batchNumberPlaceholder')"
          :error="errors.batchNumber"
        />
        <ErrorMessage v-if="errors.batchNumber" :message="errors.batchNumber" />
      </div>
    </div>

    <!-- Synonyms -->
    <div>
      <label for="synonyms" class="block text-sm font-medium text-slate-700 mb-2">
        {{$t('compounds.synonyms')}}
      </label>
      <textarea
        id="synonyms"
        :value="formData.synonyms"
        @input="updateField('synonyms', $event.target.value)"
        rows="3"
        class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.synonyms }"
        :placeholder="$t('compounds.synonymsPlaceholder')"
      />
      <p class="text-xs text-slate-500 mt-1">
        {{$t('compounds.synonymsHelp')}}
      </p>
      <ErrorMessage v-if="errors.synonyms" :message="errors.synonyms" />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import Input from '../ui/Input.vue'
import ErrorMessage from '../ui/ErrorMessage.vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

/**
 * Compound Form Component
 * 
 * Comprehensive form for compound data entry with validation.
 * Updated to work with modal workflows and proper data flow.
 * 
 * ✅ ENHANCED FEATURES:
 * - Real-time validation with immediate feedback
 * - Proper reactive data handling via emit patterns
 * - Field-specific validation rules (CAS format, required fields)
 * - Internationalized labels and error messages
 * - Support for all compound properties
 * 
 * Data Flow:
 * - Receives formData as prop (read-only)
 * - Emits update:formData for all changes
 * - Emits validate with current error state
 * - Parent handles persistence and API calls
 */
const emit = defineEmits(['update:formData', 'validate'])

// Create local reactive copy of form data
const localFormData = computed({
  get: () => props.formData,
  set: (value) => emit('update:formData', value)
})

// Helper to update individual fields
const updateField = (field, value) => {
  const updated = { ...props.formData, [field]: value }
  emit('update:formData', updated)
}

// Basic validation
const validateForm = () => {
  const errors = {}
  
  if (!props.formData.name?.trim()) {
    errors.name = 'Compound name is required'
  }
  
  if (!props.formData.quantity || props.formData.quantity < 0) {
    errors.quantity = 'Valid quantity is required'
  }
  
  if (!props.formData.unit?.trim()) {
    errors.unit = 'Unit is required'
  }
  
  if (!props.formData.location?.trim()) {
    errors.location = 'Storage location is required'
  }
  
  // CAS number format validation (optional but should be valid if provided)
  if (props.formData.casNumber && !/^\d{2,7}-\d{2}-\d$/.test(props.formData.casNumber)) {
    errors.casNumber = 'Invalid CAS number format (should be like 123-45-6)'
  }
  
  emit('validate', errors)
  return Object.keys(errors).length === 0
}

// Watch for changes and validate
watch(() => props.formData, validateForm, { deep: true, immediate: true })
</script>
