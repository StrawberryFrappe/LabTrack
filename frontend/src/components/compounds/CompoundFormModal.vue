<template>
  <BaseModal
    v-model="localModelValue"
    :title="modalTitle"
    size="lg"
    @close="handleClose"
  >
    <CompoundForm
      :form-data="formData"
      :errors="validationErrors"
      @update:formData="formData = $event"
      @validate="handleValidation"
    />

    <template #footer>
      <Button
        variant="outline"
        @click="handleClose"
        :disabled="loading"
      >
        {{ $t('common.cancel') }}
      </Button>
      <Button
        variant="primary"
        @click="handleSubmit"
        :disabled="loading || !isFormValid"
      >
        <LoadingSpinner v-if="loading" class="w-4 h-4 mr-2" />
        {{ isEditMode ? $t('common.save') : $t('compounds.create') }}
      </Button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import CompoundForm from './CompoundForm.vue'
import Button from '../ui/Button.vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'
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

// Local state
const validationErrors = ref({})
const isFormValid = ref(false)

// Create default form data structure
const createDefaultFormData = () => ({
  name: '',
  casNumber: '',
  quantity: 0,
  unit: '',
  threshold: 0,
  location: '',
  hazardClass: '',
  expiryDate: '',
  receivedDate: '',
  supplier: '',
  batchNumber: '',
  synonyms: ''
})

// Form data management
const formData = ref(createDefaultFormData())

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

// Handle validation from CompoundForm
const handleValidation = (errors) => {
  validationErrors.value = errors
  isFormValid.value = Object.keys(errors).length === 0
}

// Handle form submission
const handleSubmit = () => {
  if (!isFormValid.value) return
  
  emit('submit', {
    ...formData.value,
    id: props.compound?.id
  })
}

// Handle modal close
const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
}

// Reset form when modal opens/closes or compound changes
watch([() => props.modelValue, () => props.compound], ([isOpen, compound]) => {
  if (isOpen) {
    if (compound) {
      // Edit mode - populate form with compound data
      formData.value = {
        ...createDefaultFormData(),
        ...compound
      }
    } else {
      // Add mode - reset to default values
      formData.value = createDefaultFormData()
    }
    // Clear validation errors
    validationErrors.value = {}
    isFormValid.value = false
  }
}, { immediate: true })
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
