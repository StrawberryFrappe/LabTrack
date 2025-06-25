<template>
  <div v-if="hasMessages" class="space-y-1">
    <!-- Error messages -->
    <div 
      v-for="error in errors" 
      :key="error"
      class="flex items-center text-sm text-red-600"
      role="alert"
      :aria-live="live ? 'polite' : undefined"
    >
      <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>
    
    <!-- Warning messages -->
    <div 
      v-for="warning in warnings" 
      :key="warning"
      class="flex items-center text-sm text-yellow-600"
      role="alert"
      :aria-live="live ? 'polite' : undefined"
    >
      <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>{{ warning }}</span>
    </div>
    
    <!-- Success message -->
    <div 
      v-if="success && success.trim()" 
      class="flex items-center text-sm text-green-600"
      role="alert"
      :aria-live="live ? 'polite' : undefined"
    >
      <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ success }}</span>
    </div>
    
    <!-- Validation in progress indicator -->
    <div 
      v-if="validating"
      class="flex items-center text-sm text-blue-600"
      :aria-live="live ? 'polite' : undefined"
    >
      <svg class="w-4 h-4 mr-1 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{{ $t('validation.validating') }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * Validation Messages Component
 * 
 * Displays validation errors, warnings, success messages, and validation progress
 * with consistent styling and accessibility features.
 * 
 * Features:
 * - Multiple message types (error, warning, success, validating)
 * - Accessible ARIA attributes
 * - Consistent iconography
 * - Live region announcements for screen readers
 * - Responsive design
 */
import { computed } from 'vue'

const props = defineProps({
  /** Array of error messages */
  errors: {
    type: Array,
    default: () => []
  },
  
  /** Array of warning messages */
  warnings: {
    type: Array,
    default: () => []
  },
  
  /** Success message */
  success: {
    type: String,
    default: ''
  },
  
  /** Whether validation is in progress */
  validating: {
    type: Boolean,
    default: false
  },
  
  /** Whether to use aria-live for screen readers */
  live: {
    type: Boolean,
    default: true
  }
})

const hasMessages = computed(() => 
  props.errors.length > 0 || 
  props.warnings.length > 0 || 
  props.success.trim() !== '' || 
  props.validating
)
</script>
