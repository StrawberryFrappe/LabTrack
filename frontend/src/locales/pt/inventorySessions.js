export default {
  inventorySessions: {
    title: 'Transações',
    subtitle: 'Gerenciar movimentos de estoque e transações',
    
    // Quick Transaction Form
    quickTransaction: {
      title: 'Transação Rápida',
      selectCompound: 'Selecionar Composto',
      selectInstance: 'Selecionar Instância',
      compoundPlaceholder: 'Buscar por nome, CAS ou lote...',
      instancePlaceholder: 'Buscar por composto, lote ou localização...',
      noCompounds: 'Nenhum composto encontrado',
      noInstances: 'Nenhuma instância encontrada',
      instanceRequired: 'Por favor selecione uma instância',
      transactionType: 'Tipo de Transação',
      quantity: 'Quantidade',
      quantityPlaceholder: 'Inserir quantidade',
      available: 'Disponível',
      useAll: 'Usar Tudo',
      notes: 'Notas (Opcional)',
      notesPlaceholder: 'Adicionar notas da transação...',
      submit: 'Registrar Transação',
      cancel: 'Cancelar',
      preview: 'Visualização da Transação',
      destinationLocation: 'Localização de Destino',
      locationPlaceholder: 'Insira a localização de destino',
      
      // Transaction Types
      types: {
        use: 'Usar/Consumir',
        restock: 'Reabastecer/Adicionar',
        adjust: 'Ajuste',
        transfer: 'Transferir',
        waste: 'Descartar'
      }
    },
    
    // Transaction History
    history: {
      title: 'Histórico de Transações',
      noTransactions: 'Nenhuma transação registrada ainda',
      compound: 'Composto',
      type: 'Tipo',
      quantity: 'Quantidade',
      date: 'Data',
      user: 'Usuário',
      notes: 'Notas',
      
      // Filters
      filterBy: 'Filtrar por',
      allTypes: 'Todos os Tipos',
      last7Days: 'Últimos 7 Dias',
      last30Days: 'Últimos 30 Dias',
      thisMonth: 'Este Mês',
      customRange: 'Período Personalizado'
    },
    
    // Stock Level Indicator
    stock: {
      currentStock: 'Estoque Atual',
      lowStock: 'Estoque Baixo',
      outOfStock: 'Sem Estoque',
      adequate: 'Adequado',
      overstocked: 'Excesso de Estoque'
    },
    
    // Messages and Feedback
    messages: {
      transactionRecorded: 'Transação registrada com sucesso',
      transactionFailed: 'Falha ao registrar transação',
      invalidQuantity: 'Por favor insira uma quantidade válida',
      selectCompound: 'Por favor selecione um composto',
      insufficientStock: 'Estoque insuficiente para esta transação',
      confirmTransaction: 'Tem certeza que deseja registrar esta transação?',
      deleteTransaction: 'Excluir esta transação?',
      deleteTransactionConfirm: 'Esta ação não pode ser desfeita.',
      
      // Success messages
      useRecorded: 'Uso registrado com sucesso',
      restockRecorded: 'Reabastecimento registrado com sucesso',
      adjustmentRecorded: 'Ajuste registrado com sucesso',
      transferRecorded: 'Transferência registrada com sucesso',
      wasteRecorded: 'Descarte registrado com sucesso'
    },
    
    // Actions
    actions: {
      record: 'Registrar',
      edit: 'Editar',
      delete: 'Excluir',
      view: 'Ver Detalhes',
      export: 'Exportar Histórico',
      refresh: 'Atualizar',
      bulkAction: 'Ação em Lote'
    },
    
    // Validation
    validation: {
      required: 'Este campo é obrigatório',
      positiveNumber: 'Deve ser um número positivo',
      maxQuantity: 'Não pode exceder o estoque disponível',
      minQuantity: 'Deve ser maior que 0'
    },
    
    // Bulk Operations
    bulk: {
      title: 'Operações em Lote',
      import: 'Importar Transações',
      export: 'Exportar Dados',
      selectFile: 'Selecionar arquivo CSV',
      preview: 'Visualizar',
      confirm: 'Confirmar Importação',
      processing: 'Processando...',
      success: 'Operação em lote concluída',
      error: 'Falha na operação em lote'
    }
  }
}
