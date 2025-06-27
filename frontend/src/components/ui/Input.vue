<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        :aria-invalid="hasErrors ? 'true' : 'false'"
        :aria-describedby="hasErrors ? `${inputId}-error` : undefined"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Validation indicator -->
      <div v-if="showValidationIcon" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <!-- Validating spinner -->
        <svg 
          v-if="validating" 
          class="w-4 h-4 text-blue-500 animate-spin" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        
        <!-- Error icon -->
        <svg 
          v-else-if="hasErrors" 
          class="w-4 h-4 text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <!-- Success icon -->
        <svg 
          v-else-if="isValid && isTouched" 
          class="w-4 h-4 text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    
    <!-- Validation messages -->
    <ValidationMessages 
      v-if="showValidationMessages"
      :errors="errors"
      :warnings="warnings"
      :validating="validating"
    />
    
    <!-- Help text -->
    <p v-if="helpText && !hasErrors" class="text-sm text-slate-500">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
/**
 * Enhanced Input Component with Validation
 * 
 * Provides a form input with built-in validation support, visual feedback,
 * and accessibility features.
 * 
 * Features:
 * - Real-time validation with visual indicators
 * - Accessibility compliance (ARIA attributes)
 * - Customizable validation rules
 * - Error, warning, and success states
 * - Help text and validation messages
 * - Required field indicators
 * - Debounced validation support
 */
import { computed, ref } from 'vue'
import ValidationMessages from './ValidationMessages.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  helpText: {
    type: String,
    default: ''
  },
  
  // Validation props
  errors: {
    type: Array,
    default: () => []
  },
  warnings: {
    type: Array,
    default: () => []
  },
  isValid: {
    type: Boolean,
    default: true
  },
  validating: {
    type: Boolean,
    default: false
  },
  isTouched: {
    type: Boolean,
    default: false
  },
  showValidationIcons: {
    type: Boolean,
    default: true
  },
  validateOnChange: {
    type: Boolean,
    default: true
  },
  validateOnBlur: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'validate', 'blur', 'focus'])

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const hasErrors = computed(() => props.errors.length > 0)

const showValidationIcon = computed(() => 
  props.showValidationIcons && 
  (props.validating || hasErrors.value || (props.isValid && props.isTouched))
)

const showValidationMessages = computed(() => 
  hasErrors.value || props.warnings.length > 0 || props.validating
)

const inputClasses = computed(() => [
  'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    // Default state
    'border-slate-200 focus-visible:ring-slate-950': !hasErrors.value && !props.validating && (!props.isValid || !props.isTouched),
    
    // Validation states
    'border-yellow-500 focus-visible:ring-yellow-500': props.validating,
    'border-red-500 focus-visible:ring-red-500': hasErrors.value,
    'border-green-500 focus-visible:ring-green-500': props.isValid && props.isTouched && !hasErrors.value && !props.validating,
    
    // Icon padding
    'pr-10': showValidationIcon.value
  }
])

const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  
  if (props.validateOnChange) {
    emit('validate', value, false) // false = don't show errors immediately
  }
}

const handleBlur = (event) => {
  emit('blur', event)
  
  if (props.validateOnBlur) {
    emit('validate', event.target.value, true) // true = show errors
  }
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>
