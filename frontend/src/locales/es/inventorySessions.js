export default {
  inventorySessions: {
    title: 'Transacciones',
    subtitle: 'Gestionar movimientos de stock y transacciones',
    
    // Quick Transaction Form
    quickTransaction: {
      title: 'Transacción Rápida',
      selectCompound: 'Seleccionar Compuesto',
      selectInstance: 'Seleccionar Instancia',
      compoundPlaceholder: 'Buscar por nombre, CAS o lote...',
      instancePlaceholder: 'Buscar por compuesto, lote o ubicación...',
      noCompounds: 'No se encontraron compuestos',
      noInstances: 'No se encontraron instancias',
      instanceRequired: 'Por favor seleccione una instancia',
      transactionType: 'Tipo de Transacción',
      quantity: 'Cantidad',
      quantityPlaceholder: 'Ingresar cantidad',
      available: 'Disponible',
      useAll: 'Usar Todo',
      notes: 'Notas (Opcional)',
      notesPlaceholder: 'Agregar notas de transacción...',
      submit: 'Registrar Transacción',
      cancel: 'Cancelar',
      preview: 'Vista Previa de Transacción',
      destinationLocation: 'Ubicación de Destino',
      locationPlaceholder: 'Ingrese ubicación de destino',
      
      // Transaction Types
      types: {
        use: 'Usar/Consumir',
        restock: 'Reabastecer/Agregar',
        adjust: 'Ajuste',
        transfer: 'Transferir',
        waste: 'Descartar'
      }
    },
    
    // Transaction History
    history: {
      title: 'Historial de Transacciones',
      noTransactions: 'No se han registrado transacciones aún',
      compound: 'Compuesto',
      type: 'Tipo',
      quantity: 'Cantidad',
      date: 'Fecha',
      user: 'Usuario',
      notes: 'Notas',
      
      // Filters
      filterBy: 'Filtrar por',
      allTypes: 'Todos los Tipos',
      last7Days: 'Últimos 7 Días',
      last30Days: 'Últimos 30 Días',
      thisMonth: 'Este Mes',
      customRange: 'Rango Personalizado'
    },
    
    // Stock Level Indicator
    stock: {
      currentStock: 'Stock Actual',
      lowStock: 'Stock Bajo',
      outOfStock: 'Sin Stock',
      adequate: 'Adecuado',
      overstocked: 'Sobrestock'
    },
    
    // Messages and Feedback
    messages: {
      transactionRecorded: 'Transacción registrada exitosamente',
      transactionFailed: 'Error al registrar transacción',
      invalidQuantity: 'Por favor ingrese una cantidad válida',
      selectCompound: 'Por favor seleccione un compuesto',
      insufficientStock: 'Stock insuficiente para esta transacción',
      confirmTransaction: '¿Está seguro de registrar esta transacción?',
      deleteTransaction: '¿Eliminar esta transacción?',
      deleteTransactionConfirm: 'Esta acción no se puede deshacer.',
      
      // Success messages
      useRecorded: 'Uso registrado exitosamente',
      restockRecorded: 'Reabastecimiento registrado exitosamente',
      adjustmentRecorded: 'Ajuste registrado exitosamente',
      transferRecorded: 'Transferencia registrada exitosamente',
      wasteRecorded: 'Descarte registrado exitosamente'
    },
    
    // Actions
    actions: {
      record: 'Registrar',
      edit: 'Editar',
      delete: 'Eliminar',
      view: 'Ver Detalles',
      export: 'Exportar Historial',
      refresh: 'Actualizar',
      bulkAction: 'Acción en Lote'
    },
    
    // Validation
    validation: {
      required: 'Este campo es requerido',
      positiveNumber: 'Debe ser un número positivo',
      maxQuantity: 'No puede exceder el stock disponible',
      minQuantity: 'Debe ser mayor que 0'
    },
    
    // Bulk Operations
    bulk: {
      title: 'Operaciones en Lote',
      import: 'Importar Transacciones',
      export: 'Exportar Datos',
      selectFile: 'Seleccionar archivo CSV',
      preview: 'Vista Previa',
      confirm: 'Confirmar Importación',
      processing: 'Procesando...',
      success: 'Operación en lote completada',
      error: 'Error en operación en lote'
    }
  }
}
