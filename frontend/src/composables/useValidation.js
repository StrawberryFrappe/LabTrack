/**
 * Enhanced Validation Composable
 * 
 * Provides comprehensive validation for compound forms with real-time feedback,
 * async validation capabilities, and internationalized error messages.
 * 
 * Features:
 * - Field-level and form-level validation
 * - Real-time validation with debouncing
 * - Async validation for unique constraints
 * - Cross-field validation rules
 * - Internationalized error messages
 * - Visual feedback states
 * - Custom validation rules
 */

import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { compoundService } from '@/services/compoundService'

// Validation rule definitions
const VALIDATION_RULES = {
  required: {
    validate: (value) => value != null && value !== '',
    message: 'validation.required'
  },
  
  minLength: {
    validate: (value, params) => !value || value.length >= params.min,
    message: 'validation.minLength'
  },
  
  maxLength: {
    validate: (value, params) => !value || value.length <= params.max,
    message: 'validation.maxLength'
  },
  
  email: {
    validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'validation.email'
  },
  
  casNumber: {
    validate: (value) => {
      if (!value) return true
      // CAS number format: XXX-XX-X or XXXX-XX-X etc.
      return /^\d{1,7}-\d{2}-\d$/.test(value)
    },
    message: 'validation.casNumber'
  },
  
  positiveNumber: {
    validate: (value) => {
      if (!value && value !== 0) return true
      const num = parseFloat(value)
      return !isNaN(num) && num > 0
    },
    message: 'validation.positiveNumber'
  },
  
  nonNegativeNumber: {
    validate: (value) => {
      if (!value && value !== 0) return true
      const num = parseFloat(value)
      return !isNaN(num) && num >= 0
    },
    message: 'validation.nonNegativeNumber'
  },
  
  futureDate: {
    validate: (value) => {
      if (!value) return true
      const date = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= today
    },
    message: 'validation.futureDate'
  },
  
  pastDate: {
    validate: (value) => {
      if (!value) return true
      const date = new Date(value)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      return date <= today
    },
    message: 'validation.pastDate'
  },
  
  url: {
    validate: (value) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message: 'validation.url'
  }
}

// Async validation rules
const ASYNC_VALIDATION_RULES = {
  uniqueCompoundName: {
    validate: async (value, params, currentId) => {
      if (!value) return true
      
      try {
        const compounds = await compoundService.getAll()
        return !compounds.some(c => 
          c.id !== currentId && 
          c.name.toLowerCase() === value.toLowerCase()
        )
      } catch (error) {
        console.warn('Failed to validate unique compound name:', error)
        return true // Allow if validation service fails
      }
    },
    message: 'validation.uniqueCompoundName'
  },
  
  uniqueCasNumber: {
    validate: async (value, params, currentId) => {
      if (!value) return true
      
      try {
        const compounds = await compoundService.getAll()
        return !compounds.some(c => 
          c.id !== currentId && 
          c.casNumber === value
        )
      } catch (error) {
        console.warn('Failed to validate unique CAS number:', error)
        return true
      }
    },
    message: 'validation.uniqueCasNumber'
  }
}

export function useValidation(formId = 'default') {
  const { t } = useI18n()
  
  // Field configurations and states
  const fieldConfigs = reactive({})
  const fieldStates = reactive({})
  const formErrors = ref([])
  const isValidating = ref(false)
  const validationInProgress = reactive({})
  
  // Debounce timers for real-time validation
  const debounceTimers = reactive({})
  const DEBOUNCE_DELAY = 500
  
  /**
   * Register a field for validation
   */
  const registerField = (fieldName, rules = [], options = {}) => {
    fieldConfigs[fieldName] = {
      rules,
      options: {
        validateOnChange: true,
        validateOnBlur: true,
        debounce: true,
        ...options
      }
    }
    
    fieldStates[fieldName] = {
      value: null,
      errors: [],
      warnings: [],
      isValid: true,
      isTouched: false,
      isValidating: false,
      showErrors: false
    }
  }
  
  /**
   * Validate a single field
   */
  const validateField = async (fieldName, value, showErrors = true) => {
    if (!fieldConfigs[fieldName]) return true
    
    const field = fieldStates[fieldName]
    const config = fieldConfigs[fieldName]
    
    field.isValidating = true
    field.value = value
    field.errors = []
    field.warnings = []
    
    let isValid = true
    
    try {
      // Run synchronous validations
      for (const rule of config.rules) {
        if (typeof rule === 'string') {
          // Built-in rule
          const validator = VALIDATION_RULES[rule]
          if (validator && !validator.validate(value)) {
            field.errors.push(t(validator.message, { field: fieldName }))
            isValid = false
          }
        } else if (typeof rule === 'object') {
          // Rule with parameters
          const { name, params, message } = rule
          const validator = VALIDATION_RULES[name]
          
          if (validator && !validator.validate(value, params)) {
            const errorMessage = message || validator.message
            field.errors.push(t(errorMessage, { field: fieldName, ...params }))
            isValid = false
          }
        } else if (typeof rule === 'function') {
          // Custom validation function
          const result = rule(value, field)
          if (result !== true) {
            field.errors.push(typeof result === 'string' ? result : t('validation.invalid'))
            isValid = false
          }
        }
      }
      
      // Run async validations
      for (const rule of config.rules) {
        if (typeof rule === 'object' && rule.async) {
          const { name, params, currentId } = rule
          const validator = ASYNC_VALIDATION_RULES[name]
          
          if (validator) {
            validationInProgress[fieldName] = true
            const asyncResult = await validator.validate(value, params, currentId)
            
            if (!asyncResult) {
              field.errors.push(t(validator.message, { field: fieldName, ...params }))
              isValid = false
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Validation error for field', fieldName, error)
      field.errors.push(t('validation.error'))
      isValid = false
    } finally {
      field.isValidating = false
      field.isValid = isValid
      field.showErrors = showErrors
      validationInProgress[fieldName] = false
    }
    
    return isValid
  }
  
  /**
   * Validate field with debouncing
   */
  const validateFieldDebounced = (fieldName, value, immediate = false) => {
    if (immediate) {
      return validateField(fieldName, value)
    }
    
    // Clear existing timer
    if (debounceTimers[fieldName]) {
      clearTimeout(debounceTimers[fieldName])
    }
    
    // Set new timer
    debounceTimers[fieldName] = setTimeout(() => {
      validateField(fieldName, value)
    }, DEBOUNCE_DELAY)
  }
  
  /**
   * Mark field as touched
   */
  const touchField = (fieldName) => {
    if (fieldStates[fieldName]) {
      fieldStates[fieldName].isTouched = true
    }
  }
  
  /**
   * Clear field validation state
   */
  const clearFieldValidation = (fieldName) => {
    if (fieldStates[fieldName]) {
      fieldStates[fieldName].errors = []
      fieldStates[fieldName].warnings = []
      fieldStates[fieldName].isValid = true
      fieldStates[fieldName].showErrors = false
    }
  }
  
  /**
   * Validate entire form
   */
  const validateForm = async (formData, showErrors = true) => {
    isValidating.value = true
    formErrors.value = []
    
    const validationPromises = []
    
    // Validate all registered fields
    for (const [fieldName, config] of Object.entries(fieldConfigs)) {
      const value = formData[fieldName]
      validationPromises.push(validateField(fieldName, value, showErrors))
    }
    
    const results = await Promise.all(validationPromises)
    const isFormValid = results.every(result => result)
    
    // Cross-field validation
    if (isFormValid) {
      const crossFieldErrors = await validateCrossFields(formData)
      if (crossFieldErrors.length > 0) {
        formErrors.value = crossFieldErrors
      }
    }
    
    isValidating.value = false
    return isFormValid && formErrors.value.length === 0
  }
  
  /**
   * Cross-field validation rules
   */
  const validateCrossFields = async (formData) => {
    const errors = []
    
    // Example: Expiry date should be after received date
    if (formData.receivedDate && formData.expiryDate) {
      const received = new Date(formData.receivedDate)
      const expiry = new Date(formData.expiryDate)
      
      if (expiry <= received) {
        errors.push(t('validation.expiryAfterReceived'))
      }
    }
    
    // Example: Threshold should be less than quantity
    if (formData.quantity && formData.threshold) {
      const quantity = parseFloat(formData.quantity)
      const threshold = parseFloat(formData.threshold)
      
      if (threshold >= quantity) {
        errors.push(t('validation.thresholdLessThanQuantity'))
      }
    }
    
    return errors
  }
  
  /**
   * Get field validation state
   */
  const getFieldState = (fieldName) => {
    return fieldStates[fieldName] || {
      value: null,
      errors: [],
      warnings: [],
      isValid: true,
      isTouched: false,
      isValidating: false,
      showErrors: false
    }
  }
  
  /**
   * Check if field has errors
   */
  const hasFieldErrors = (fieldName) => {
    const field = fieldStates[fieldName]
    return field && field.showErrors && field.errors.length > 0
  }
  
  /**
   * Get field error messages
   */
  const getFieldErrors = (fieldName) => {
    const field = fieldStates[fieldName]
    return field && field.showErrors ? field.errors : []
  }
  
  /**
   * Check if field is valid
   */
  const isFieldValid = (fieldName) => {
    const field = fieldStates[fieldName]
    return !field || field.isValid
  }
  
  /**
   * Check if form is valid
   */
  const isFormValid = computed(() => {
    const allFieldsValid = Object.values(fieldStates).every(field => field.isValid)
    return allFieldsValid && formErrors.value.length === 0
  })
  
  /**
   * Check if any validation is in progress
   */
  const hasValidationInProgress = computed(() => {
    return isValidating.value || 
           Object.values(fieldStates).some(field => field.isValidating) ||
           Object.values(validationInProgress).some(Boolean)
  })
  
  /**
   * Get validation CSS classes
   */
  const getValidationClasses = (fieldName) => {
    const field = fieldStates[fieldName]
    if (!field || !field.isTouched) return ''
    
    if (field.isValidating) return 'border-yellow-500 ring-yellow-500'
    if (field.showErrors && field.errors.length > 0) return 'border-red-500 ring-red-500'
    if (field.isValid) return 'border-green-500 ring-green-500'
    
    return ''
  }
  
  /**
   * Reset all validation state
   */
  const resetValidation = () => {
    // Clear all field states
    for (const fieldName of Object.keys(fieldStates)) {
      clearFieldValidation(fieldName)
      fieldStates[fieldName].isTouched = false
    }
    
    // Clear form errors
    formErrors.value = []
    
    // Clear debounce timers
    for (const timer of Object.values(debounceTimers)) {
      clearTimeout(timer)
    }
    Object.keys(debounceTimers).forEach(key => delete debounceTimers[key])
  }
  
  return {
    // Registration
    registerField,
    
    // Validation methods
    validateField,
    validateFieldDebounced,
    validateForm,
    touchField,
    clearFieldValidation,
    resetValidation,
    
    // State getters
    getFieldState,
    getFieldErrors,
    hasFieldErrors,
    isFieldValid,
    isFormValid,
    hasValidationInProgress,
    getValidationClasses,
    
    // Form-level state
    formErrors: computed(() => formErrors.value),
    isValidating: computed(() => isValidating.value),
    
    // Field states (reactive)
    fieldStates: computed(() => fieldStates)
  }
}
