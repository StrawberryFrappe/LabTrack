export default {
  inventory: {
    title: 'Contagem de Inventário',
    startCount: 'Iniciar Nova Contagem',
    activeCount: 'Sessão de Contagem Ativa',
    scanBarcode: 'Escanear Código de Barras',
    manualEntry: 'Entrada Manual',
    manualEntryPlaceHolder: "Insira os detalhes do inventário...",
    saveCount: 'Salvar Contagem',
    completeCount: 'Completar Contagem',
    countsTitle: "Contagens de Inventário",
    countsSubtitle: "Gerenciar sessões de contagem de inventário físico",
    activeSessions: "Sessões de Contagem Ativas",
    recentSessions: "Sessões Recentes",
    createSessionTitle: "Criar Nova Sessão de Contagem",
    sessionNamePlaceholder: "Nome da sessão",
    sessionNameLabel: "Nome",
    sessionDescriptionPlaceholder: "Descrição da sessão",
    sessionDescriptionLabel: "Descrição",
    sessionLocationPlaceholder: "Local a contar",
    sessionLocationLabel: "Local",
    createSessionButton: "Criar Sessão",
    scannerTitle: "Scanner de Inventário",
    scannerPrompt: "Escaneie o código de barras ou insira manualmente",
    enableCamera: "Ativar Scanner de Câmera",
    findButton: "Buscar",
    expectedQuantity: "Quantidade esperada",
    discrepancy: "Diferença",
    confirmCount: "Confirmar contagem",
    cancel: "Cancelar",
    recentScans: "Leituras recentes",
    counted: "Contado",
    itemsShort: "itens",
    
    // Count Entry Modal
    countEntry: "Entrada de Contagem",
    countedQuantity: "Quantidade Contada",
    countedQuantityPlaceholder: "Digite a quantidade contada",
    discrepancyFound: "Discrepância Encontrada",
    overageFound: "Excesso",
    shortageFound: "Faltante",
    noDiscrepancy: "Sem Discrepância",
    verificationStatus: "Status de Verificação",
    verified: "Verificado",
    discrepancy: "Discrepância",
    notFound: "Não Encontrado",
    batchNumber: "Número do Lote",
    expiryDate: "Data de Validade",
    notes: "Notas",
    discrepancyNotesPlaceholder: "Digite notas sobre a discrepância...",
    instancesVerified: "{count} de {total} instâncias verificadas",
    saveProgress: "Salvar Progresso",
    findMisplacedInstance: "Buscar Instância Perdida",
    createNewInstance: "Criar Nova Instância",
    newInstanceCreated: "Nova instância criada durante a contagem",
    countingLocation: "Contando local: {location}",
    
    // Count Entry Labels
    cas: "CAS",
    location: "Local",
    expected: "Esperado",
    
    // Count Entry Actions
    confirmCount: "Confirmar Contagem",
    confirmCountAction: "Confirmar",
    cancelCountAction: "Cancelar",
    
    // Count Session Progress
    progress: "Progresso",
    unknown: "Desconhecido",
    
    // Count Session Labels
    labels: {
      location: "Local",
      createdBy: "Criado por",
      startDate: "Data de Início",
      completed: "Completado", 
      duration: "Duração",
      notes: "Notas"
    },
    
    // Count Session Actions
    sessionActions: {
      continueCount: "Continuar Contagem",
      viewDetails: "Ver Detalhes",
      complete: "Completar",
      incompleteSession: "Incompleto"
    },
    
    // Count Session Status
    status: {
      completed: "Completado",
      inProgress: "Em Progresso",
      percentComplete: "% Completo"
    }
  },
  
  // Transações (Transaction Management)
  inventorySessions: {
    title: 'Transações',
    subtitle: 'Registre e rastreie transações de inventário em tempo real',
    
    // Quick Transaction Form
    quickTransaction: {
      title: 'Transação Rápida',
      selectCompound: 'Selecionar Composto',
      compoundPlaceholder: 'Pesquisar compostos...',
      transactionType: 'Tipo de Transação',
      quantity: 'Quantidade',
      notes: 'Notas (Opcional)',
      notesPlaceholder: 'Adicionar notas...',
      location: 'Localização',
      locationPlaceholder: 'Inserir localização...',
      record: 'Registrar Transação',
      
      // Transaction Types
      types: {
        use: 'Usar',
        restock: 'Reabastecer',
        adjust: 'Ajustar',
        transfer: 'Transferir',
        waste: 'Descarte'
      },
      
      // Stock Preview
      stockPreview: {
        current: 'Estoque Atual',
        after: 'Após Transação',
        loading: 'Calculando...'
      }
    },
    
    // Transaction History
    history: {
      title: 'Histórico de Transações',
      today: 'Hoje',
      thisWeek: 'Esta Semana',
      total: 'Total',
      allTypes: 'Todos os Tipos',
      allTime: 'Todo o Tempo',
      last7Days: 'Últimos 7 Dias',
      last30Days: 'Últimos 30 Dias',
      thisMonth: 'Este Mês',
      
      // Table Headers
      compound: 'Composto',
      type: 'Tipo',
      quantity: 'Quantidade',
      user: 'Usuário',
      timestamp: 'Data e Hora',
      notes: 'Notas',
      actions: 'Ações'
    },
    
    // Actions
    actions: {
      refresh: 'Atualizar',
      bulkAction: 'Ações em Lote',
      edit: 'Editar',
      delete: 'Excluir',
      export: 'Exportar'
    },
    
    // Bulk Operations
    bulk: {
      title: 'Operações em Lote',
      description: 'Importar ou exportar transações de inventário em lote',
      import: 'Importar Transações',
      export: 'Exportar para CSV'
    },
    
    // Messages
    messages: {
      transactionRecorded: 'Transação registrada com sucesso',
      transactionFailed: 'Falha ao registrar transação',
      deleteTransactionConfirm: 'Tem certeza de que deseja excluir esta transação?',
      noTransactions: 'Nenhuma transação encontrada',
      loadingTransactions: 'Carregando transações...',
      
      // Session messages
      sessionCreated: 'Sessão de contagem criada com sucesso',
      sessionCreationFailed: 'Falha ao criar sessão de contagem',
      sessionContinued: 'Sessão de contagem retomada',
      sessionCompleted: 'Sessão de contagem concluída com sucesso',
      sessionCompletionFailed: 'Falha ao concluir sessão de contagem',
      nameAndLocationsRequired: 'Nome da sessão e pelo menos um local são obrigatórios',
      progressSaved: 'Progresso salvo com sucesso',
      progressSaveFailed: 'Falha ao salvar progresso',
      unsavedChanges: 'Você tem alterações não salvas. Tem certeza de que deseja fechar?',
      allLocationsCompleted: 'Todos os locais foram contados',
      instanceFoundAdded: 'Instância encontrada e adicionada ao local atual',
      instanceCreatedAdded: 'Nova instância criada e adicionada à contagem',
      cannotCompleteSession: 'Não é possível completar a sessão: {reason}',
      confirmCompleteSession: 'Completar sessão "{name}"? {verified}/{total} instâncias verificadas.'
    },
    
    // Messages
    messages: {
      transactionRecorded: 'Transação registrada com sucesso',
      transactionFailed: 'Falha ao registrar transação',
      deleteTransactionConfirm: 'Tem certeza de que deseja excluir esta transação?',
      noTransactions: 'Nenhuma transação encontrada',
      loadingTransactions: 'Carregando transações...'
    }
  }
}
