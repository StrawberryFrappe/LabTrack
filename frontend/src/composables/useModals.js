import { ref, reactive } from 'vue'

/**
 * Composable for managing modal state and interactions
 * Provides consistent modal management across components
 */
export function useModal() {
  const isOpen = ref(false)
  const loading = ref(false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    loading.value = false
  }

  const setLoading = (state) => {
    loading.value = state
  }

  return {
    isOpen,
    loading,
    open,
    close,
    setLoading
  }
}

/**
 * Composable for managing confirmation dialogs
 * Handles promise-based confirmation flow
 */
export function useConfirmDialog() {
  const modal = useModal()
  const config = reactive({
    title: 'Confirm Action',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  })

  let resolvePromise = null
  let rejectPromise = null

  const confirm = (options = {}) => {
    // Update config with provided options
    Object.assign(config, options)
    
    // Open modal
    modal.open()

    // Return promise that resolves/rejects based on user action
    return new Promise((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })
  }

  const handleConfirm = async () => {
    if (resolvePromise) {
      modal.setLoading(true)
      try {
        await resolvePromise(true)
        modal.close()
      } catch (error) {
        modal.setLoading(false)
        // Keep modal open on error, let parent handle
        throw error
      }
    }
  }

  const handleCancel = () => {
    if (rejectPromise) {
      rejectPromise(false)
    }
    modal.close()
  }

  const handleClose = () => {
    if (rejectPromise) {
      rejectPromise(false)
    }
  }

  return {
    ...modal,
    config,
    confirm,
    handleConfirm,
    handleCancel,
    handleClose
  }
}

/**
 * Composable for managing form modals
 * Handles form state, validation, and submission
 */
export function useFormModal(initialData = {}) {
  const modal = useModal()
  const formData = reactive({ ...initialData })
  const errors = reactive({})
  const isFormValid = ref(true)

  const resetForm = () => {
    // Clear form data
    Object.keys(formData).forEach(key => {
      if (initialData[key] !== undefined) {
        formData[key] = initialData[key]
      } else {
        delete formData[key]
      }
    })
    
    // Clear errors
    Object.keys(errors).forEach(key => delete errors[key])
    isFormValid.value = true
  }

  const setFormData = (data) => {
    Object.assign(formData, data)
  }

  const setErrors = (newErrors) => {
    // Clear existing errors
    Object.keys(errors).forEach(key => delete errors[key])
    
    // Set new errors
    Object.assign(errors, newErrors)
    
    // Update form validity
    isFormValid.value = Object.keys(newErrors).length === 0
  }

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
    isFormValid.value = true
  }

  const openForEdit = (data) => {
    setFormData(data)
    clearErrors()
    modal.open()
  }

  const openForCreate = (defaultData = {}) => {
    resetForm()
    if (Object.keys(defaultData).length > 0) {
      setFormData({ ...initialData, ...defaultData })
    }
    modal.open()
  }

  const handleSubmit = async (submitFn) => {
    if (!isFormValid.value || modal.loading.value) return

    modal.setLoading(true)
    clearErrors()

    try {
      await submitFn(formData)
      modal.close()
      resetForm()
    } catch (error) {
      modal.setLoading(false)
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        // Generic error handling - could be enhanced with toast notifications
        console.error('Form submission error:', error)
      }
      
      throw error
    }
  }

  const handleCancel = () => {
    modal.close()
    resetForm()
  }

  return {
    ...modal,
    formData,
    errors,
    isFormValid,
    resetForm,
    setFormData,
    setErrors,
    clearErrors,
    openForEdit,
    openForCreate,
    handleSubmit,
    handleCancel
  }
}
