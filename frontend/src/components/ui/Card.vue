<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-slate-200">
      <slot name="header" />
    </div>
    <div class="px-6 py-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-200 bg-slate-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline'].includes(value)
  }
})

const cardClasses = computed(() => [
  'rounded-lg overflow-hidden',
  {
    'bg-white shadow-sm border border-slate-200': props.variant === 'default',
    'border-2 border-dashed border-slate-300': props.variant === 'outline'
  }
])
</script>
