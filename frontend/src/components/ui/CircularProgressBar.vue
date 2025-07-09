<template>
  <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="-rotate-90">
      <!-- Background track -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="transparent"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
      />
      <!-- Progress circle -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="transparent"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
        class="transition-all duration-500 ease-in-out"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-xl font-bold" :style="{ color: progressColor }">
        {{ Math.round(percentage) }}%
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: Number,
    default: 80
  },
  strokeWidth: {
    type: Number,
    default: 10
  },
  percentage: {
    type: Number,
    required: true,
  },
  trackColor: {
    type: String,
    default: '#e5e7eb' // gray-200
  },
  progressColor: {
    type: String,
    default: '#3b82f6' // blue-500
  }
})

const center = computed(() => props.size / 2)
const radius = computed(() => center.value - props.strokeWidth / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const strokeDashoffset = computed(() => {
  const visualPercentage = Math.min(props.percentage, 100)
  return circumference.value * (1 - visualPercentage / 100)
})
</script> 