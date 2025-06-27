export default {
  inventory: {
    title: 'Conteo de Inventario',
    startCount: 'Iniciar Nuevo Conteo',
    activeCount: 'Sesión de Conteo Activa',
    scanBarcode: 'Escanear Código de Barras',
    manualEntry: 'Entrada Manual',
    manualEntryPlaceHolder: "Ingrese los detalles del inventario...",
    saveCount: 'Guardar Conteo',
    completeCount: 'Completar Conteo',
    countsTitle: "Conteos de Inventario",
    countsSubtitle: "Gestionar sesiones de conteo de inventario físico",
    activeSessions: "Sesiones de Conteo Activas",
    recentSessions: "Sesiones Recientes",
    createSessionTitle: "Crear Nueva Sesión de Conteo",
    sessionNamePlaceholder: "Nombre de la sesión",
    sessionNameLabel: "Nombre",
    sessionDescriptionPlaceholder: "Descripción de la sesión",
    sessionDescriptionLabel: "Descripción",
    sessionLocationPlaceholder: "Ubicación a contar",
    sessionLocationLabel: "Ubicación",
    createSessionButton: "Crear Sesión",
    scannerTitle: "Escáner de Inventario",
    scannerPrompt: "Escanee el código de barras o ingrese manualmente",
    enableCamera: "Habilitar escáner de cámara",
    findButton: "Buscar",
    expectedQuantity: "Cantidad esperada",
    discrepancy: "Diferencia",
    confirmCount: "Confirmar conteo",
    cancel: "Cancelar",
    recentScans: "Escaneos recientes",
    counted: "Contado",
    
    // Count Entry Modal
    countEntry: "Entrada de Conteo",
    countedQuantity: "Cantidad Contada",
    countedQuantityPlaceholder: "Ingrese la cantidad contada",
    discrepancyFound: "Discrepancia Encontrada",
    overageFound: "Exceso",
    shortageFound: "Faltante",
    noDiscrepancy: "Sin Discrepancia",
    
    // Count Entry Labels
    cas: "CAS",
    location: "Ubicación",
    expected: "Esperado",
    
    // Count Entry Actions
    confirmCount: "Confirmar Conteo",
    confirmCountAction: "Confirmar",
    cancelCountAction: "Cancelar",
    
    // Count Session Progress
    progress: "Progreso",
    unknown: "Desconocido",
    
    // Count Session Labels
    labels: {
      location: "Ubicación",
      createdBy: "Creado por",
      startDate: "Fecha de Inicio",
      completed: "Completado",
      duration: "Duración",
      notes: "Notas"
    },
    
    // Count Session Actions
    sessionActions: {
      continueCount: "Continuar Conteo",
      viewDetails: "Ver Detalles",
      complete: "Completar"
    },
    
    // Count Session Status
    status: {
      completed: "Completado",
      inProgress: "En Progreso", 
      percentComplete: "% Completado"
    }
  },
  
  // Inventory Sessions (Transaction Management)
  inventorySessions: {
    title: 'Sesiones de Inventario',
    subtitle: 'Registra y rastrea transacciones de inventario en tiempo real',
    
    // Quick Transaction Form
    quickTransaction: {
      title: 'Transacción Rápida',
      selectCompound: 'Seleccionar Compuesto',
      compoundPlaceholder: 'Buscar compuestos...',
      transactionType: 'Tipo de Transacción',
      quantity: 'Cantidad',
      notes: 'Notas (Opcional)',
      notesPlaceholder: 'Agregar notas...',
      location: 'Ubicación',
      locationPlaceholder: 'Ingresar ubicación...',
      record: 'Registrar Transacción',
      
      // Transaction Types
      types: {
        use: 'Usar',
        restock: 'Reabastecer',
        adjust: 'Ajustar',
        transfer: 'Transferir',
        waste: 'Desecho'
      },
      
      // Stock Preview
      stockPreview: {
        current: 'Stock Actual',
        after: 'Después de Transacción',
        loading: 'Calculando...'
      }
    },
    
    // Transaction History
    history: {
      title: 'Historial de Transacciones',
      today: 'Hoy',
      thisWeek: 'Esta Semana',
      total: 'Total',
      allTypes: 'Todos los Tipos',
      allTime: 'Todo el Tiempo',
      last7Days: 'Últimos 7 Días',
      last30Days: 'Últimos 30 Días',
      thisMonth: 'Este Mes',
      
      // Table Headers
      compound: 'Compuesto',
      type: 'Tipo',
      quantity: 'Cantidad',
      user: 'Usuario',
      timestamp: 'Fecha y Hora',
      notes: 'Notas',
      actions: 'Acciones'
    },
    
    // Actions
    actions: {
      refresh: 'Actualizar',
      bulkAction: 'Acciones Masivas',
      edit: 'Editar',
      delete: 'Eliminar',
      export: 'Exportar'
    },
    
    // Bulk Operations
    bulk: {
      title: 'Operaciones Masivas',
      description: 'Importar o exportar transacciones de inventario en lote',
      import: 'Importar Transacciones',
      export: 'Exportar a CSV'
    },
    
    // Messages
    messages: {
      transactionRecorded: 'Transacción registrada exitosamente',
      transactionFailed: 'Error al registrar transacción',
      deleteTransactionConfirm: '¿Estás seguro de que quieres eliminar esta transacción?',
      noTransactions: 'No se encontraron transacciones',
      loadingTransactions: 'Cargando transacciones...'
    }
  }
}
