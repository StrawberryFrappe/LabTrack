export default {
  inventorySessions: {
    title: 'Transactions',
    subtitle: 'Manage stock movements and transactions',
    
    // Quick Transaction Form
    quickTransaction: {
      title: 'Quick Transaction',
      selectCompound: 'Select Compound',
      compoundPlaceholder: 'Search by name, CAS, or batch...',
      noCompounds: 'No compounds found',
      transactionType: 'Transaction Type',
      quantity: 'Quantity',
      quantityPlaceholder: 'Enter quantity',
      notes: 'Notes (Optional)',
      notesPlaceholder: 'Add transaction notes...',
      submit: 'Record Transaction',
      cancel: 'Cancel',
      preview: 'Transaction Preview',
      destinationLocation: 'Destination Location',
      locationPlaceholder: 'Enter destination location',
      
      // Transaction Types
      types: {
        use: 'Use/Consume',
        restock: 'Restock/Add',
        adjust: 'Adjustment',
        transfer: 'Transfer',
        waste: 'Dispose/Waste'
      }
    },
    
    // Transaction History
    history: {
      title: 'Transaction History',
      noTransactions: 'No transactions recorded yet',
      noTransactionsSubtext: 'Start recording transactions to see them here',
      compound: 'Compound',
      type: 'Type',
      quantity: 'Quantity',
      date: 'Date',
      user: 'User',
      notes: 'Notes',
      today: 'Today',
      thisWeek: 'This Week',
      total: 'Total',
      allTime: 'All Time',
      
      // Filters
      filterBy: 'Filter by',
      allTypes: 'All Types',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      thisMonth: 'This Month',
      customRange: 'Custom Range'
    },
    
    // Stock Level Indicator
    stock: {
      currentStock: 'Current Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      adequate: 'Adequate',
      overstocked: 'Overstocked',
      newStock: 'New Stock',
      negativeStock: 'Warning: This will result in negative stock',
      willBeLowStock: 'Warning: This will result in low stock levels'
    },
    
    // Messages and Feedback
    messages: {
      transactionRecorded: 'Transaction recorded successfully',
      transactionFailed: 'Failed to record transaction',
      invalidQuantity: 'Please enter a valid quantity',
      selectCompound: 'Please select a compound',
      insufficientStock: 'Insufficient stock for this transaction',
      confirmTransaction: 'Are you sure you want to record this transaction?',
      deleteTransaction: 'Delete this transaction?',
      deleteTransactionConfirm: 'This action cannot be undone.',
      
      // Success messages
      useRecorded: 'Usage recorded successfully',
      restockRecorded: 'Restock recorded successfully',
      adjustmentRecorded: 'Adjustment recorded successfully',
      transferRecorded: 'Transfer recorded successfully',
      wasteRecorded: 'Disposal recorded successfully'
    },
    
    // Actions
    actions: {
      record: 'Record',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View Details',
      export: 'Export History',
      refresh: 'Refresh',
      bulkAction: 'Bulk Action'
    },
    
    // Validation
    validation: {
      required: 'This field is required',
      positiveNumber: 'Must be a positive number',
      maxQuantity: 'Cannot exceed available stock',
      minQuantity: 'Must be greater than 0'
    },
    
    // Bulk Operations
    bulk: {
      title: 'Bulk Operations',
      description: 'Import or export transaction data in bulk',
      import: 'Import Transactions',
      export: 'Export Data',
      selectFile: 'Select CSV file',
      preview: 'Preview',
      confirm: 'Confirm Import',
      processing: 'Processing...',
      success: 'Bulk operation completed',
      error: 'Bulk operation failed'
    }
  }
}
