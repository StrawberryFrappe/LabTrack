<template>
  <div :class="containerClasses">
    <!-- Numeric Display -->
    <div v-if="showNumeric" :class="textClasses">
      {{ current }} {{ unit }}
    </div>
    
    <!-- Visual Indicator -->
    <div v-if="showVisual" class="flex items-center gap-2">
      <!-- Status Dot -->
      <div 
        :class="[
          'rounded-full flex-shrink-0',
          dotSizeClasses,
          dotColorClasses
        ]"
      />
      
      <!-- Progress Bar (for larger sizes) -->
      <div v-if="showProgressBar" class="flex-1 min-w-0">
        <div :class="progressBarBgClasses">
          <div 
            :class="progressBarFillClasses"
            :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
          />
        </div>
        
        <!-- Percentage text for larger sizes -->
        <div v-if="size !== 'xs'" class="text-xs text-slate-500 mt-1">
          {{ progressPercentage.toFixed(0) }}%
        </div>
      </div>
      
      <!-- Status text for smaller sizes -->
      <span v-else-if="showStatusText" :class="statusTextClasses">
        {{ $t(`inventorySessions.stock.${stockStatus.status}`) }}
      </span>
    </div>
    
    <!-- Compact mode: just the essential info -->
    <div v-if="compact" class="flex items-center gap-1">
      <div :class="['w-2 h-2 rounded-full', dotColorClasses]" />
      <span :class="textClasses">{{ current }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInventory } from '@/composables/useInventory.js'

const { t } = useI18n()

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'units'
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'compact', 'minimal'].includes(value)
  },
  showNumeric: {
    type: Boolean,
    default: true
  },
  showVisual: {
    type: Boolean,
    default: true
  }
})

// Composables
const { getStockStatus } = useInventory()

// Computed properties
const stockStatus = computed(() => getStockStatus(props.current, props.threshold))

const progressPercentage = computed(() => {
  if (props.threshold === 0) return 100
  return (props.current / props.threshold) * 100
})

const compact = computed(() => props.variant === 'compact')
const minimal = computed(() => props.variant === 'minimal')

const showProgressBar = computed(() => 
  props.showVisual && ['md', 'lg'].includes(props.size) && !compact.value
)

const showStatusText = computed(() => 
  props.showVisual && ['xs', 'sm'].includes(props.size) && !compact.value
)

// Styling classes
const containerClasses = computed(() => [
  'flex items-center',
  {
    'gap-1': props.size === 'xs',
    'gap-2': props.size === 'sm',
    'gap-3': ['md', 'lg'].includes(props.size)
  }
])

const textClasses = computed(() => [
  'font-medium',
  stockStatus.value.color === 'red' ? 'text-red-600' : null,
  stockStatus.value.color === 'yellow' ? 'text-yellow-600' : null,
  stockStatus.value.color === 'green' ? 'text-green-600' : null,
  stockStatus.value.color === 'slate' ? 'text-slate-600' : null,
  {
    'text-xs': props.size === 'xs',
    'text-sm': props.size === 'sm',
    'text-base': props.size === 'md',
    'text-lg': props.size === 'lg'
  }
])

const dotSizeClasses = computed(() => ({
  'w-2 h-2': props.size === 'xs',
  'w-3 h-3': props.size === 'sm',
  'w-4 h-4': props.size === 'md',
  'w-5 h-5': props.size === 'lg'
}))

const dotColorClasses = computed(() => {
  const colorMap = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    slate: 'bg-slate-400'
  }
  return colorMap[stockStatus.value.color] || 'bg-slate-400'
})

const progressBarBgClasses = computed(() => [
  'w-full bg-slate-200 rounded-full overflow-hidden',
  {
    'h-1': props.size === 'xs',
    'h-1.5': props.size === 'sm',
    'h-2': props.size === 'md',
    'h-3': props.size === 'lg'
  }
])

const progressBarFillClasses = computed(() => {
  const baseClasses = 'h-full transition-all duration-300 rounded-full'
  const colorMap = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    slate: 'bg-slate-400'
  }
  
  return [
    baseClasses,
    colorMap[stockStatus.value.color] || 'bg-slate-400'
  ]
})

const statusTextClasses = computed(() => [
  'text-xs font-medium',
  stockStatus.value.color === 'red' ? 'text-red-600' : null,
  stockStatus.value.color === 'yellow' ? 'text-yellow-600' : null,
  stockStatus.value.color === 'green' ? 'text-green-600' : null,
  stockStatus.value.color === 'slate' ? 'text-slate-600' : null
])
</script>
