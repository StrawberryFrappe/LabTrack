<template>
  <Card>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-slate-600">{{ title }}</p>
        <p :class="valueClasses">{{ displayValue }}</p>
        <p v-if="subtitle" class="text-xs text-slate-500 mt-1">{{ subtitle }}</p>
      </div>      <div :class="iconClasses">
        <!-- Using simple text icons for now, TODO: Replace with proper icon library -->
        <!-- TODO: Implement Heroicons, Lucide, or other icon system -->
        <!-- TODO: Add click handlers for interactive stats cards -->
        <!-- TODO: Add loading skeleton states -->
        <span class="text-lg font-bold">{{ iconText }}</span>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import { useFormat } from '@/utils/format'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'warning', 'success', 'error'].includes(value)
  },
  icon: {
    type: String,
    default: 'info'
  }
})

const { formatNumber } = useFormat()

const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return formatNumber(props.value)
  }
  return props.value
})

const valueClasses = computed(() => [
  'text-2xl font-bold',
  {
    'text-slate-900': props.variant === 'default',
    'text-yellow-600': props.variant === 'warning',
    'text-green-600': props.variant === 'success',
    'text-red-600': props.variant === 'error'
  }
])

const iconClasses = computed(() => [
  'h-12 w-12 rounded-full flex items-center justify-center',
  {
    'bg-slate-100 text-slate-600': props.variant === 'default',
    'bg-yellow-100 text-yellow-600': props.variant === 'warning',
    'bg-green-100 text-green-600': props.variant === 'success',
    'bg-red-100 text-red-600': props.variant === 'error'
  }
])

const iconText = computed(() => {
  const iconMap = {
    beaker: '🧪',
    warning: '⚠️',
    clock: '🕐',
    check: '✓',
    info: 'ℹ️'
  }
  return iconMap[props.icon] || iconMap.info
})
</script>
