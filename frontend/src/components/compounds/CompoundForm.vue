<template>
  <div class="space-y-6">
    <!-- Basic Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="compound-name" class="block text-sm font-medium text-slate-700 mb-2">
          Compound Name *
        </label>
        <Input
          id="compound-name"
          v-model="formData.name"
          placeholder="Enter compound name"
          :error="errors.name"
          required
        />
        <ErrorMessage v-if="errors.name" :message="errors.name" />
      </div>

      <div>
        <label for="cas-number" class="block text-sm font-medium text-slate-700 mb-2">
          CAS Number
        </label>
        <Input
          id="cas-number"
          v-model="formData.casNumber"
          placeholder="000-00-0"
          :error="errors.casNumber"
        />
        <ErrorMessage v-if="errors.casNumber" :message="errors.casNumber" />
      </div>
    </div>

    <!-- Quantity and Location -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="quantity" class="block text-sm font-medium text-slate-700 mb-2">
          Current Quantity *
        </label>
        <Input
          id="quantity"
          v-model.number="formData.quantity"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          :error="errors.quantity"
          required
        />
        <ErrorMessage v-if="errors.quantity" :message="errors.quantity" />
      </div>

      <div>
        <label for="unit" class="block text-sm font-medium text-slate-700 mb-2">
          Unit *
        </label>
        <select
          id="unit"
          v-model="formData.unit"
          class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': errors.unit }"
          required
        >
          <option value="">Select unit</option>
          <option value="g">Grams (g)</option>
          <option value="kg">Kilograms (kg)</option>
          <option value="ml">Milliliters (ml)</option>
          <option value="l">Liters (l)</option>
          <option value="mg">Milligrams (mg)</option>
          <option value="μg">Micrograms (μg)</option>
          <option value="mol">Moles (mol)</option>
          <option value="mmol">Millimoles (mmol)</option>
        </select>
        <ErrorMessage v-if="errors.unit" :message="errors.unit" />
      </div>

      <div>
        <label for="threshold" class="block text-sm font-medium text-slate-700 mb-2">
          Reorder Threshold
        </label>
        <Input
          id="threshold"
          v-model.number="formData.threshold"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          :error="errors.threshold"
        />
        <ErrorMessage v-if="errors.threshold" :message="errors.threshold" />
      </div>
    </div>

    <!-- Location and Hazard -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="location" class="block text-sm font-medium text-slate-700 mb-2">
          Storage Location *
        </label>
        <Input
          id="location"
          v-model="formData.location"
          placeholder="e.g., Cabinet A-3, Freezer B"
          :error="errors.location"
          required
        />
        <ErrorMessage v-if="errors.location" :message="errors.location" />
      </div>

      <div>
        <label for="hazard-class" class="block text-sm font-medium text-slate-700 mb-2">
          Hazard Class
        </label>
        <select
          id="hazard-class"
          v-model="formData.hazardClass"
          class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'border-red-500': errors.hazardClass }"
        >
          <option value="">Select hazard class</option>
          <option value="Non-hazardous">Non-hazardous</option>
          <option value="Flammable">Flammable</option>
          <option value="Corrosive">Corrosive</option>
          <option value="Toxic">Toxic</option>
          <option value="Oxidizing">Oxidizing</option>
          <option value="Explosive">Explosive</option>
          <option value="Carcinogenic">Carcinogenic</option>
          <option value="Radioactive">Radioactive</option>
        </select>
        <ErrorMessage v-if="errors.hazardClass" :message="errors.hazardClass" />
      </div>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="expiry-date" class="block text-sm font-medium text-slate-700 mb-2">
          Expiry Date
        </label>
        <Input
          id="expiry-date"
          v-model="formData.expiryDate"
          type="date"
          :error="errors.expiryDate"
        />
        <ErrorMessage v-if="errors.expiryDate" :message="errors.expiryDate" />
      </div>

      <div>
        <label for="received-date" class="block text-sm font-medium text-slate-700 mb-2">
          Received Date
        </label>
        <Input
          id="received-date"
          v-model="formData.receivedDate"
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
          Supplier
        </label>
        <Input
          id="supplier"
          v-model="formData.supplier"
          placeholder="e.g., Sigma-Aldrich, Fisher Scientific"
          :error="errors.supplier"
        />
        <ErrorMessage v-if="errors.supplier" :message="errors.supplier" />
      </div>

      <div>
        <label for="batch-number" class="block text-sm font-medium text-slate-700 mb-2">
          Batch Number
        </label>
        <Input
          id="batch-number"
          v-model="formData.batchNumber"
          placeholder="Enter batch number"
          :error="errors.batchNumber"
        />
        <ErrorMessage v-if="errors.batchNumber" :message="errors.batchNumber" />
      </div>
    </div>

    <!-- Synonyms -->
    <div>
      <label for="synonyms" class="block text-sm font-medium text-slate-700 mb-2">
        Synonyms
      </label>
      <textarea
        id="synonyms"
        v-model="formData.synonyms"
        rows="3"
        class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'border-red-500': errors.synonyms }"
        placeholder="Enter alternative names, separated by commas"
      />
      <p class="text-xs text-slate-500 mt-1">
        Enter alternative names separated by commas
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

const emit = defineEmits(['update:formData', 'validate'])

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
watch(() => props.formData, validateForm, { deep: true })
</script>
