export default {
  validation: {
    // Field validation messages
    required: 'This field is required',
    minLength: 'Must be at least {min} characters long',
    min: 'The value is too short. Minimum length is {min}.',
    maxLength: 'Must not exceed {max} characters',
    email: 'Please enter a valid email address',
    casNumber: 'Please enter a valid CAS number (format: XXX-XX-X)',
    positiveNumber: 'Must be a positive number',
    nonNegativeNumber: 'Must be a non-negative number',
    futureDate: 'Date must be in the future',
    pastDate: 'Date must be in the past or today',
    url: 'Please enter a valid URL',
    
    // Async validation messages
    uniqueCompoundName: 'A compound with this name already exists',
    uniqueCasNumber: 'A compound with this CAS number already exists',
    
    // Form states
    validating: 'Validating...',
    formValid: 'Form is valid',
    formInvalid: 'Please fix the errors above',
    
    // Field help text
    casNumberHelp: 'Chemical Abstracts Service number (optional)',
    expiryDateHelp: 'Leave empty if compound does not expire',
    thresholdHelp: 'Minimum quantity before reorder alert',
    
    // General validation messages
    invalidFormat: 'Invalid format',
    valueTooSmall: 'Value is too small',
    valueTooLarge: 'Value is too large',
    fieldRequired: 'This field is required',
    pleaseSelectOption: 'Please select an option'
  }
}
