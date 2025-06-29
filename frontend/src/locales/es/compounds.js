export default {
  compounds: {
    title: 'Gestión de Compuestos',
    description: 'Gestiona el inventario químico de tu laboratorio',
    addNew: 'Agregar Nuevo Compuesto',
    addCompound: 'Agregar Compuesto',
    editCompound: 'Editar Compuesto',
    create: 'Crear',
    import: 'Importar',
    exportButton: 'Exportar',
    loading: 'Cargando compuestos...',
    errorLoading: 'Error al cargar compuestos',
    tryAgain: 'Intentar de nuevo',
    noCompoundsFound: 'No se encontraron compuestos',
    tryAdjustingFilters: 'Intenta ajustar tus filtros de búsqueda.',
    showing: 'Mostrando',
    of: 'de',
    compounds: 'compuestos',
    lowStock: 'Bajo Stock',
    expiringSoon: 'Pronto a Vencer',
    viewModeToggle: 'Alternar modo de vista',
    switchToGrid: 'Cambiar a vista de tarjetas',
    switchToList: 'Cambiar a vista de lista',
    cards: 'Tarjetas',
    list: 'Lista',
    search: 'Buscar compuestos...',
    searchPlaceholder: 'Buscar compuestos...',
    filters: 'Filtros',
    category: 'Categoría',
    hazardLevel: 'Nivel de Peligro',
    hazardClass: 'Clase de Peligro',
    allHazardClasses: 'Todas las clases de peligro',
    location: 'Ubicación',
    allLocations: 'Todas las ubicaciones',
    filtersActive: 'filtros activos',
    clearFilters: 'Limpiar Filtros',
    status: 'Estado',
    actions: 'Acciones',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver Detalles',
    name: "Nombre",
    namePlaceholder: "Ingrese el nombre del compuesto",
    casNumber: "Número CAS",
    casPlaceholder: "Ingrese el número CAS (ej. 123-45-6)",
    quantity: "Cantidad",
    quantityPlaceholder: "Ingrese la cantidad",
    unit: "Unidad",
    unitSelect: "Seleccione unidad",
    reorderThreshold: "Umbral de reposición",
    thresholdPlaceholder: "Ingrese el umbral de reposición",
    location: "Ubicación",
    locationPlaceholder: "Ingrese la ubicación de almacenamiento",
    hazardClass: "Clase de peligro",
    hazardClassSelect: "Seleccione clase de peligro",
    hazardClassNonHazardous: "No peligroso",
    hazardClassFlammable: "Inflamable",
    hazardClassCorrosive: "Corrosivo",
    hazardClassToxic: "Tóxico",
    hazardClassOxidizing: "Oxidante",
    hazardClassExplosive: "Explosivo",
    hazardClassCarcinogenic: "Cancerígeno",
    hazardClassRadioactive: "Radiactivo",
    expiryDate: "Fecha de caducidad",
    receivedDate: "Fecha de recepción",
    supplier: "Proveedor",
    supplierPlaceholder: "Ingrese el nombre del proveedor",
    batchNumber: "Número de lote",
    batchNumberPlaceholder: "Ingrese el número de lote",
    synonyms: "Sinónimos",
    synonymsPlaceholder: "Ingrese sinónimos (separados por comas)",
    synonymsHelp: "Separe los sinónimos con comas (ej. Acetona, Dimetil cetona)",
    
    // Stock and inventory
    currentStock: "Stock Actual",
    lowStockWarning: "⚠️ ¡Stock bajo!",
    
    // Table headers
    tableHeaders: {
      name: "Nombre",
      casNumber: "Número CAS",
      supplier: "Proveedor", 
      quantity: "Cantidad",
      location: "Ubicación",
      hazards: "Peligros",
      actions: "Acciones"
    },
    
    // Action buttons
    actions: {
      edit: "Editar",
      delete: "Eliminar",
      count: "Contar",
      view: "Ver",
      recordTransaction: "Registrar Transacción"
    },
    
    // Labels and prefixes
    labels: {
      id: "ID",
      cas: "CAS",
      casNumber: "Número CAS",
      batch: "Lote",
      location: "Ubicación",
      supplier: "Proveedor",
      expires: "Vence",
      threshold: "Umbral"
    },
    
    // CRUD Operations
    createSuccess: "Compuesto creado exitosamente",
    updateSuccess: "Compuesto actualizado exitosamente", 
    deleteSuccess: "Compuesto eliminado exitosamente",
    saveError: "Error al guardar el compuesto. Por favor intente de nuevo.",
    deleteError: "Error al eliminar el compuesto. Por favor intente de nuevo.",
    deleteConfirmTitle: "Eliminar Compuesto",
    deleteConfirm: "¿Está seguro que desea eliminar '{name}'? Esta acción no se puede deshacer.",
    
    // Import/Export
    importSuccess: "Se importaron exitosamente {count} compuestos",
    importError: "Error al importar compuestos. Verifique el formato del archivo.",
    importErrorsFound: "Importación completada con {count} errores. Revisa la consola para más detalles.",
    exportSuccess: "Compuestos exportados exitosamente",
    exportError: "Error al exportar compuestos. Intente de nuevo.",
    unsupportedFileType: "Tipo de archivo no soportado. Use archivos CSV o Excel.",
    export: {
      button: "Exportar Compuestos",
      success: "Se exportaron exitosamente {count} compuestos",
      error: "Error al exportar compuestos",
      noData: "No hay compuestos para exportar"
    },
    quickFilters: {
      lowStock: "Stock Bajo",
      expiringSoon: "Expiran Pronto",
      flammable: "Inflamable", 
      corrosive: "Corrosivo"
    },

    // Detail modal
    detail: {
      title: "Detalles del Compuesto",
      loading: "Cargando detalles del compuesto...",
      errorLoading: "Error al cargar detalles del compuesto",
      notFound: "Compuesto no encontrado",
      compoundInfo: "Información del Compuesto",
      editCompound: "Editar Compuesto",
      stockSummary: "Resumen de Stock",
      createTransaction: "Crear Transacción",
      deleteCompound: "Eliminar Compuesto",
      notes: "Notas",
      notesPlaceholder: "Agregar notas sobre este compuesto...",
      loadingInstances: "Cargando instancias...",
      transactionFeatureComingSoon: "¡Función de transacciones próximamente!"
    }
  }
}
