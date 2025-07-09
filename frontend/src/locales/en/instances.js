export default {
  instances: {
    title: 'Compound Instances',
    subtitle: 'Manage individual batches and containers',
    
    // Labels
    labels: {
      batch: 'Batch',
      batchNumber: 'Batch Number',
      noBatch: 'No Batch',
      expiryDate: 'Expiry Date',
      expires: 'Expires',
      quantity: 'Quantity',
      location: 'Location',
      status: 'Status',
      compound: 'Compound',
      supplier: 'Supplier',
      notes: 'Notes'
    },
    
    // Status values
    status: {
      active: 'Active',
      used_up: 'Used Up',
      expired: 'Expired'
    },
    
    // Actions
    actions: {
      view: 'View Details',
      edit: 'Edit Instance',
      delete: 'Delete Instance'
    },
    
    // Messages
    messages: {
      created: 'Instance created successfully',
      updated: 'Instance updated successfully',
      deleted: 'Instance deleted successfully',
      error: 'An error occurred',
      noInstances: 'No instances found',
      noInstancesForCompound: 'No instances found for this compound'
    },
    
    // Form fields
    form: {
      batchNumber: 'Batch Number',
      batchNumberPlaceholder: 'Enter batch number',
      quantity: 'Quantity',
      quantityPlaceholder: 'Enter quantity',
      location: 'Location',
      locationPlaceholder: 'Enter storage location',
      expiryDate: 'Expiry Date',
      supplier: 'Supplier',
      supplierPlaceholder: 'Enter supplier name',
      notes: 'Notes',
      notesPlaceholder: 'Add any additional notes...'
    }
  }
}
