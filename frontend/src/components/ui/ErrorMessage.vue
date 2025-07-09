<!--
  Error Message Component
  
  A reusable component for displaying error messages with
  consistent styling and optional retry functionality.
  
  Features:
  - Different error types (error, warning, info)
  - Optional retry button
  - Dismissible errors
  - Icon support
  - Accessible error reporting
  
  Usage:
  <ErrorMessage message="Something went wrong" />
  <ErrorMessage message="Error loading data" @retry="loadData" />
-->

<template>
  <div 
    class="rounded-lg p-4 border"
    :class="containerClass"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    <div class="flex items-start">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <span class="text-xl" :class="iconClass">
          {{ iconText }}
        </span>
      </div>
      
      <!-- Content -->
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="text-sm font-medium" :class="titleClass">
          {{ title }}
        </h3>
        <p class="text-sm" :class="messageClass">
          {{ message }}
        </p>
        
        <!-- Actions -->
        <div v-if="showRetry || dismissible" class="mt-3 flex items-center space-x-3">
          <button 
            v-if="showRetry"
            @click="$emit('retry')"
            class="text-sm font-medium px-3 py-1 rounded transition-colors"
            :class="retryButtonClass"
          >
            {{ $t('common.tryAgain') }}
          </button>
          
          <button 
            v-if="dismissible"
            @click="$emit('dismiss')"
            class="text-sm font-medium px-3 py-1 rounded transition-colors"
            :class="dismissButtonClass"
          >
            {{ $t('common.dismiss') }}
          </button>
        </div>
      </div>
      
      <!-- Close button -->
      <div v-if="dismissible" class="ml-4">
        <button
          @click="$emit('dismiss')"
          class="inline-flex text-gray-400 hover:text-gray-600 transition-colors"
          :class="closeButtonClass"
        >
          <span class="sr-only">{{ $t('common.close') }}</span>
          <span class="text-lg">✕</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  /**
   * The error message to display
   */
  message: {
    type: String,
    required: true
  },
  
  /**
   * Optional title for the error
   */
  title: {
    type: String,
    default: ''
  },
  
  /**
   * Type of error message
   * @type {'error' | 'warning' | 'info' | 'success'}
   */
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  
  /**
   * Whether to show a retry button
   */
  showRetry: {
    type: Boolean,
    default: false
  },
  
  /**
   * Whether the error can be dismissed
   */
  dismissible: {
    type: Boolean,
    default: false
  }
})

// Define events
defineEmits(['retry', 'dismiss'])

// Computed classes based on type
const containerClass = computed(() => {
  const classes = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200'
  }
  return classes[props.type]
})

const iconClass = computed(() => {
  const classes = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    success: 'text-green-400'
  }
  return classes[props.type]
})

const iconText = computed(() => {
  const icons = {
    error: '⚠️',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅'
  }
  return icons[props.type]
})

const titleClass = computed(() => {
  const classes = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
    success: 'text-green-800'
  }
  return classes[props.type]
})

const messageClass = computed(() => {
  const classes = {
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
    success: 'text-green-700'
  }
  return classes[props.type]
})

const retryButtonClass = computed(() => {
  const classes = {
    error: 'bg-red-100 text-red-800 hover:bg-red-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200'
  }
  return classes[props.type]
})

const dismissButtonClass = computed(() => {
  const classes = {
    error: 'text-red-600 hover:text-red-800',
    warning: 'text-yellow-600 hover:text-yellow-800',
    info: 'text-blue-600 hover:text-blue-800',
    success: 'text-green-600 hover:text-green-800'
  }
  return classes[props.type]
})

const closeButtonClass = computed(() => {
  const classes = {
    error: 'hover:text-red-600',
    warning: 'hover:text-yellow-600',
    info: 'hover:text-blue-600',
    success: 'hover:text-green-600'
  }
  return classes[props.type]
})
</script>
