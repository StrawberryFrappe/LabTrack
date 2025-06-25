export default {
  compounds: {
    title: 'Compound Management',
    description: 'Manage your laboratory\'s chemical inventory',
    addNew: 'Add New Compound',
    addCompound: 'Add Compound',
    editCompound: 'Edit Compound',
    create: 'Create',
    import: 'Import',
    exportButton: 'Export',
    loading: 'Loading compounds...',
    errorLoading: 'Error loading compounds',
    tryAgain: 'Try Again',
    noCompoundsFound: 'No compounds found',
    tryAdjustingFilters: 'Try adjusting your search filters.',
    showing: 'Showing',
    of: 'of',
    compounds: 'compounds',
    lowStock: 'Low Stock',
    expiringSoon: 'Expiring Soon',
    viewModeToggle: 'View mode toggle',
    switchToGrid: 'Switch to grid view',
    switchToList: 'Switch to list view',
    cards: 'Cards',
    list: 'List',
    search: 'Search compounds...',
    searchPlaceholder: 'Search compounds...',
    filters: 'Filters',
    category: 'Category',
    hazardLevel: 'Hazard Level',
    hazardClass: 'Hazard Class',
    allHazardClasses: 'All hazard classes',
    location: 'Location',
    allLocations: 'All locations',
    filtersActive: 'filters active',
    clearFilters: 'Clear Filters',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View Details',
    name: "Name",
    namePlaceholder: "Enter compound name",
    casNumber: "CAS Number",
    casPlaceholder: "Enter CAS number (e.g. 123-45-6)",
    quantity: "Quantity",
    quantityPlaceholder: "Enter quantity",
    unit: "Unit",
    unitSelect: "Select unit",
    reorderThreshold: "Reorder Threshold",
    thresholdPlaceholder: "Enter reorder threshold",
    location: "Location",
    locationPlaceholder: "Enter storage location",
    hazardClass: "Hazard Class",
    hazardClassSelect: "Select hazard class",
    hazardClassNonHazardous: "Non-hazardous",
    hazardClassFlammable: "Flammable",
    hazardClassCorrosive: "Corrosive",
    hazardClassToxic: "Toxic",
    hazardClassOxidizing: "Oxidizing",
    hazardClassExplosive: "Explosive",
    hazardClassCarcinogenic: "Carcinogenic",
    hazardClassRadioactive: "Radioactive",
    expiryDate: "Expiry Date",
    receivedDate: "Received Date",
    supplier: "Supplier",
    supplierPlaceholder: "Enter supplier name",
    batchNumber: "Batch Number",
    batchNumberPlaceholder: "Enter batch number",
    synonyms: "Synonyms",
    synonymsPlaceholder: "Enter synonyms (comma separated)",
    synonymsHelp: "Separate synonyms with commas (e.g. Acetone, Dimethyl ketone)",
    
    // Stock and inventory
    currentStock: "Current Stock",
    lowStockWarning: "⚠️ Low stock!",
    
    // Table headers
    tableHeaders: {
      name: "Name",
      casNumber: "CAS Number", 
      supplier: "Supplier",
      quantity: "Quantity",
      location: "Location",
      hazards: "Hazards",
      actions: "Actions"
    },
    
    // Action buttons
    actions: {
      edit: "Edit",
      delete: "Delete",
      count: "Count",
      view: "View"
    },
    
    // Labels and prefixes
    labels: {
      id: "ID",
      cas: "CAS",
      casNumber: "CAS Number",
      batch: "Batch",
      location: "Location",
      supplier: "Supplier",
      expires: "Expires",
      threshold: "Threshold"
    },

    // CRUD Operations
    createSuccess: "Compound created successfully",
    updateSuccess: "Compound updated successfully", 
    deleteSuccess: "Compound deleted successfully",
    saveError: "Failed to save compound. Please try again.",
    deleteError: "Failed to delete compound. Please try again.",
    deleteConfirmTitle: "Delete Compound",
    deleteConfirm: "Are you sure you want to delete '{name}'? This action cannot be undone.",
    
    // Import/Export
    importSuccess: "Successfully imported {count} compounds",
    importError: "Failed to import compounds. Please check the file format.",
    importErrorsFound: "Import completed with {count} errors. Check console for details.",
    exportSuccess: "Compounds exported successfully",
    exportError: "Failed to export compounds. Please try again.",
    unsupportedFileType: "Unsupported file type. Please use CSV or Excel files.",
    export: {
      button: "Export Compounds",
      success: "Successfully exported {count} compounds",
      error: "Failed to export compounds",
      noData: "No compounds to export"
    },
    quickFilters: {
      lowStock: "Low Stock",
      expiringSoon: "Expiring Soon", 
      flammable: "Flammable",
      corrosive: "Corrosive"
    }
  }
}
