<template>
  <BaseModal
    v-model="localModelValue"
    :title="modalTitle"
    size="lg"
    @close="handleClose"
  >
    <CompoundFormEnhanced
      :compound="props.compound"
      :is-edit-mode="isEditMode"
      @submit="handleSubmit"
      @cancel="handleClose"
    />

  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import CompoundFormEnhanced from './CompoundFormEnhanced.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  compound: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEditMode = computed(() => !!props.compound)

const modalTitle = computed(() => {
  return isEditMode.value 
    ? t('compounds.editCompound') 
    : t('compounds.addCompound')
})

// Handle form submission from enhanced form
const handleSubmit = (formData) => {
  emit('submit', {
    ...formData,
    id: props.compound?.id
  })
}

// Handle modal close
const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
}

</script>

/**
 * Compound Form Modal Component
 * 
 * Integrates CompoundForm with BaseModal for add/edit workflows.
 * Handles form data management, validation, and API submission.
 * 
 * Features:
 * - Reactive form data binding with proper Vue patterns
 * - Real-time validation with error display
 * - Loading states during API operations
 * - Automatic form reset on modal open/close
 * - Support for both create and edit modes
 * - Internationalized labels and messages
 * 
 * Usage:
 * - Pass compound prop for edit mode, null for create mode
 * - Listen to @submit event for form submission
 * - Handle loading state externally for better UX
 */
