<template>
  <BaseModal
    v-model="localModelValue"
    :title="displayTitle"
    size="sm"
    :close-on-overlay-click="false"
    @close="$emit('close')"
  >
    <!-- Content -->
    <div class="space-y-4">
      <!-- Icon -->
      <div class="flex items-center justify-center w-12 h-12 mx-auto rounded-full" :class="iconBgClass">
        <component :is="iconComponent" :class="iconClass" class="w-6 h-6" />
      </div>
      
      <!-- Message -->
      <div class="text-center">
        <p class="text-sm text-slate-600">
          {{ message }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <Button
        variant="outline"
        @click="handleCancel"
        :disabled="loading"
      >
        {{ displayCancelText }}
      </Button>
      <Button
        :variant="confirmVariant"
        @click="handleConfirm"
        :disabled="loading"
      >
        <LoadingSpinner v-if="loading" class="w-4 h-4 mr-2" />
        {{ displayConfirmText }}
      </Button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import Button from '@/components/ui/Button.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const { t } = useI18n()

// Icons as inline components to avoid external dependencies
const WarningIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'danger', 'info'].includes(value)
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const iconComponent = computed(() => {
  switch (props.type) {
    case 'danger':
      return ErrorIcon
    case 'info':
      return InfoIcon
    default:
      return WarningIcon
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-100'
    case 'info':
      return 'bg-blue-100'
    default:
      return 'bg-yellow-100'
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'text-red-600'
    case 'info':
      return 'text-blue-600'
    default:
      return 'text-yellow-600'
  }
})

const confirmVariant = computed(() => {
  return props.type === 'danger' ? 'destructive' : 'primary'
})

// Computed properties for display text with fallbacks
const displayTitle = computed(() => {
  return props.title || t('common.confirmAction')
})

const displayConfirmText = computed(() => {
  return props.confirmText || t('common.confirmActionText')
})

const displayCancelText = computed(() => {
  return props.cancelText || t('common.cancelActionText')
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>
