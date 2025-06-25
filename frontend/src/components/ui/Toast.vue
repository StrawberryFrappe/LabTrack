<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="visible"
        :class="toastClasses"
        class="fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg p-4 flex items-center space-x-3"
        role="alert"
      >
        <!-- Icon -->
        <div :class="iconBgClass" class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
          <component :is="iconComponent" :class="iconColorClass" class="w-5 h-5" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p v-if="title" class="text-sm font-medium" :class="titleColorClass">
            {{ title }}
          </p>
          <p class="text-sm" :class="messageColorClass">
            {{ message }}
          </p>
        </div>

        <!-- Close button -->
        <button
          @click="close"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// Icons as inline components
const CheckIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 5000
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)

const toastClasses = computed(() => {
  const baseClasses = 'border-l-4'
  
  switch (props.type) {
    case 'success':
      return `${baseClasses} bg-green-50 border-green-400`
    case 'error':
      return `${baseClasses} bg-red-50 border-red-400`
    case 'warning':
      return `${baseClasses} bg-yellow-50 border-yellow-400`
    default:
      return `${baseClasses} bg-blue-50 border-blue-400`
  }
})

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckIcon
    case 'error':
      return ErrorIcon
    case 'warning':
      return WarningIcon
    default:
      return InfoIcon
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-100'
    case 'error':
      return 'bg-red-100'
    case 'warning':
      return 'bg-yellow-100'
    default:
      return 'bg-blue-100'
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-600'
    case 'error':
      return 'text-red-600'
    case 'warning':
      return 'text-yellow-600'
    default:
      return 'text-blue-600'
  }
})

const titleColorClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-800'
    case 'error':
      return 'text-red-800'
    case 'warning':
      return 'text-yellow-800'
    default:
      return 'text-blue-800'
  }
})

const messageColorClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-700'
    case 'error':
      return 'text-red-700'
    case 'warning':
      return 'text-yellow-700'
    default:
      return 'text-blue-700'
  }
})

const close = () => {
  visible.value = false
  emit('close')
}

onMounted(() => {
  visible.value = true
  
  if (!props.persistent) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})

defineExpose({
  close
})
</script>
