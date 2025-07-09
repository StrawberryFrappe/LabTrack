<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click="handleOverlayClick"
        @keydown.esc="handleEscape"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        <!-- Modal Container -->
        <div
          ref="modalRef"
          :class="modalClasses"
          @click.stop
          role="dialog"
          :aria-labelledby="titleId"
          aria-modal="true"
        >
          <!-- Header -->
          <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 v-if="title" :id="titleId" class="text-lg font-semibold text-slate-900">
              {{ title }}
            </h2>
            <slot name="header" />
            <button
              v-if="showCloseButton"
              @click="close"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-md hover:bg-slate-100"
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['sm', 'default', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', 'full'].includes(value)
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalRef = ref(null)
const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)

// Focus management
let previousActiveElement = null

const modalClasses = computed(() => [
  'relative bg-white rounded-lg shadow-xl',
  'max-h-[90vh] overflow-y-auto',
  'transform transition-all',
  {
    'max-w-sm': props.size === 'sm',
    'max-w-md': props.size === 'default',
    'max-w-lg': props.size === 'lg',
    'max-w-xl': props.size === 'xl',
    'max-w-2xl': props.size === '2xl',
    'max-w-3xl': props.size === '3xl',
    'max-w-4xl': props.size === '4xl',
    'max-w-5xl': props.size === '5xl',
    'max-w-6xl': props.size === '6xl',
    'max-w-[95vw] max-h-[95vh]': props.size === 'full'
  }
])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    close()
  }
}

const handleEscape = () => {
  if (props.closeOnEscape) {
    close()
  }
}

// Focus trap implementation
const trapFocus = () => {
  if (!modalRef.value) return
  
  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  if (focusableElements.length === 0) return
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }
  
  modalRef.value.addEventListener('keydown', handleTabKey)
  
  return () => {
    modalRef.value?.removeEventListener('keydown', handleTabKey)
  }
}

// Body scroll lock
const lockBodyScroll = () => {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${scrollBarWidth}px`
  
  return () => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

// Watch for modal visibility changes
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    // Store current focus
    previousActiveElement = document.activeElement
    
    // Lock body scroll
    const unlockScroll = lockBodyScroll()
    
    // Wait for DOM update and focus first element
    await nextTick()
    const unlockFocus = trapFocus()
    
    // Focus first focusable element or modal itself
    const focusableElements = modalRef.value?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements?.length > 0) {
      focusableElements[0].focus()
    } else {
      modalRef.value?.focus()
    }
    
    // Cleanup on close
    const cleanup = () => {
      unlockScroll()
      unlockFocus?.()
      
      // Restore previous focus
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus()
      }
    }
    
    // Store cleanup function
    modalRef.value._cleanup = cleanup
  } else {
    // Run cleanup
    modalRef.value?._cleanup?.()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  modalRef.value?._cleanup?.()
})
</script>
