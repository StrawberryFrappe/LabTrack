export default {
  validation: {
    // Mensajes de validación de campos
    required: 'Este campo es obligatorio',
    minLength: 'Debe tener al menos {min} caracteres',
    maxLength: 'No debe exceder {max} caracteres',
    email: 'Ingrese una dirección de correo válida',
    casNumber: 'Ingrese un número CAS válido (formato: XXX-XX-X)',
    positiveNumber: 'Debe ser un número positivo',
    nonNegativeNumber: 'Debe ser un número no negativo',
    futureDate: 'La fecha debe ser futura',
    pastDate: 'La fecha debe ser pasada o actual',
    url: 'Ingrese una URL válida',
    
    // Mensajes de validación asíncrona
    uniqueCompoundName: 'Ya existe un compuesto con este nombre',
    uniqueCasNumber: 'Ya existe un compuesto con este número CAS',
    
    // Estados del formulario
    validating: 'Validando...',
    formValid: 'Formulario válido',
    formInvalid: 'Corrija los errores anteriores',
    
    // Texto de ayuda de campos
    casNumberHelp: 'Número del Servicio de Resúmenes Químicos (opcional)',
    expiryDateHelp: 'Deje vacío si el compuesto no expira',
    thresholdHelp: 'Cantidad mínima antes de alerta de reposición',
    
    // Mensajes generales de validación
    invalidFormat: 'Formato inválido',
    valueTooSmall: 'El valor es muy pequeño',
    valueTooLarge: 'El valor es muy grande',
    fieldRequired: 'Este campo es obligatorio',
    pleaseSelectOption: 'Seleccione una opción'
  }
}
