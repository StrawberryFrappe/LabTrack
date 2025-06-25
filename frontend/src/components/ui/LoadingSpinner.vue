<!--
  Loading Spinner Component
  
  A reusable loading spinner component that can be used throughout
  the application to indicate loading states.
  
  Features:
  - Customizable size and color
  - Optional loading text
  - Centered layout
  - Accessible loading indicator
  
  Usage:
  <LoadingSpinner />
  <LoadingSpinner size="lg" text="Loading data..." />
-->

<template>
  <div class="flex flex-col items-center justify-center p-4" :class="containerClass">
    <!-- Spinner -->
    <div 
      class="animate-spin rounded-full border-4 border-t-transparent"
      :class="spinnerClass"
      role="status"
      aria-label="Loading"
    ></div>
    
    <!-- Loading Text -->
    <p v-if="text" class="mt-3 text-gray-600" :class="textClass">
      {{ text }}
    </p>
    
    <!-- Screen reader text -->
    <span class="sr-only">{{ $t('common.loading') }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Size of the spinner
   * @type {'sm' | 'md' | 'lg' | 'xl'}
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  /**
   * Optional loading text to display below spinner
   */
  text: {
    type: String,
    default: ''
  },
  
  /**
   * Color theme of the spinner
   * @type {'blue' | 'green' | 'red' | 'gray'}
   */
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'red', 'gray'].includes(value)
  },
  
  /**
   * Whether to center the spinner in its container
   */
  centered: {
    type: Boolean,
    default: true
  }
})

// Computed classes for different sizes
const spinnerClass = computed(() => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  }
  
  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    gray: 'border-gray-600'
  }
  
  return [
    sizeClasses[props.size],
    colorClasses[props.color]
  ]
})

// Text size based on spinner size
const textClass = computed(() => {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }
  
  return textSizes[props.size]
})

// Container classes
const containerClass = computed(() => {
  return props.centered ? 'min-h-24' : ''
})
</script>
