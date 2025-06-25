export default {
  validation: {
    // Mensagens de validação de campos
    required: 'Este campo é obrigatório',
    minLength: 'Deve ter pelo menos {min} caracteres',
    maxLength: 'Não deve exceder {max} caracteres',
    email: 'Digite um endereço de email válido',
    casNumber: 'Digite um número CAS válido (formato: XXX-XX-X)',
    positiveNumber: 'Deve ser um número positivo',
    nonNegativeNumber: 'Deve ser um número não negativo',
    futureDate: 'A data deve ser futura',
    pastDate: 'A data deve ser passada ou atual',
    url: 'Digite uma URL válida',
    
    // Mensagens de validação assíncrona
    uniqueCompoundName: 'Já existe um composto com este nome',
    uniqueCasNumber: 'Já existe um composto com este número CAS',
    
    // Estados do formulário
    validating: 'Validando...',
    formValid: 'Formulário válido',
    formInvalid: 'Corrija os erros acima',
    
    // Texto de ajuda dos campos
    casNumberHelp: 'Número do Chemical Abstracts Service (opcional)',
    expiryDateHelp: 'Deixe vazio se o composto não expira',
    thresholdHelp: 'Quantidade mínima antes do alerta de reposição',
    
    // Mensagens gerais de validação
    invalidFormat: 'Formato inválido',
    valueTooSmall: 'O valor é muito pequeno',
    valueTooLarge: 'O valor é muito grande',
    fieldRequired: 'Este campo é obrigatório',
    pleaseSelectOption: 'Selecione uma opção'
  }
}
