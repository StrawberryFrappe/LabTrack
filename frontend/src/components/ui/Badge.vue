<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'secondary', 'destructive', 'success', 'warning', 'outline'].includes(value)
  }
})

const badgeClasses = computed(() => [
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  
  {
    'bg-slate-900 text-slate-50 hover:bg-slate-800': props.variant === 'default',
    'bg-slate-100 text-slate-900 hover:bg-slate-200': props.variant === 'secondary',
    'bg-red-100 text-red-800 hover:bg-red-200': props.variant === 'destructive',
    'bg-green-100 text-green-800 hover:bg-green-200': props.variant === 'success',
    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200': props.variant === 'warning',
    'border border-slate-200 text-slate-900 hover:bg-slate-100': props.variant === 'outline'
  }
])
</script>
