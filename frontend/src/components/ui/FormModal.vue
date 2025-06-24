<template>
  <BaseModal
    v-model="localModelValue"
    :title="title"
    :size="size"
    :close-on-overlay-click="false"
    @close="handleClose"
  >
    <!-- Form Content -->
    <form @submit.prevent="handleSubmit">
      <div class="space-y-6">
        <slot :loading="loading" :errors="errors" />
      </div>
    </form>

    <!-- Footer -->
    <template #footer>
      <Button
        variant="outline"
        @click="handleCancel"
        :disabled="loading"
      >
        {{ cancelText }}
      </Button>
      <Button
        :variant="submitVariant"
        @click="handleSubmit"
        :disabled="loading || !isFormValid"
      >
        <LoadingSpinner v-if="loading" class="w-4 h-4 mr-2" />
        {{ submitText }}
      </Button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import Button from './Button.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'lg'
  },
  submitText: {
    type: String,
    default: 'Save'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  submitVariant: {
    type: String,
    default: 'primary'
  },
  loading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  isFormValid: {
    type: Boolean,
    default: true
  },
  resetOnClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'close', 'reset'])

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleSubmit = () => {
  if (props.loading || !props.isFormValid) return
  emit('submit')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleClose = () => {
  if (props.resetOnClose) {
    emit('reset')
  }
  emit('update:modelValue', false)
  emit('close')
}

// Watch for modal close to reset form if needed
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen && props.resetOnClose) {
    // Small delay to ensure modal is fully closed before reset
    setTimeout(() => {
      emit('reset')
    }, 200)
  }
})
</script>
