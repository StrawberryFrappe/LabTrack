<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'outline', 'destructive', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['sm', 'default', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  
  // Size variants
  {
    'h-8 px-3 text-sm': props.size === 'sm',
    'h-10 px-4 py-2': props.size === 'default',
    'h-11 px-8': props.size === 'lg'
  },
  
  // Color variants
  {
    'bg-slate-900 text-slate-50 hover:bg-slate-800 focus-visible:ring-slate-300': props.variant === 'default',
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-300': props.variant === 'primary',
    'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-300': props.variant === 'secondary',
    'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300': props.variant === 'outline',
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300': props.variant === 'destructive',
    'bg-transparent hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300': props.variant === 'ghost'
  }
])
</script>
